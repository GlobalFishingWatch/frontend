import { once } from 'events'
import * as fs from 'fs'
import { type Server } from 'http'
import * as path from 'path'
import { fileURLToPath } from 'url'

import { chromium, type Page } from '@playwright/test'
import * as dotenv from 'dotenv'

import { GFWAPI } from '@globalfishingwatch/api-client'

import { closeLogStream, initLogStream, log } from '../logs'

import { startAuthProxyServer } from './proxy-server'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
dotenv.config({ path: path.resolve(__dirname, '../../.env') })

const AUTH_DIR = path.join(__dirname, '../../../../../.auth')
const TOKENS_FILE = path.join(AUTH_DIR, 'tokens.json')
const AUTH_LOG_FILE = path.join(AUTH_DIR, 'auth-setup.log')
const NAVIGATION_TIMEOUT_MS = 10000
const INVALID_CREDENTIALS_MESSAGE = 'email or password incorrect'

// Cache the /auth/me result so concurrent globalSetup calls (one per browser
// project) share a single HTTP round-trip.  The TTL guards long-lived
// processes like --watch where tokens can expire mid-session.
const TOKEN_VALIDITY_TTL_MS = 30 * 60 * 1000 // 30 minutes
let tokenValidityPromise: Promise<boolean> | null = null
let tokenValidityTimestamp = 0

export function isAuthCacheExpired(): boolean {
  return Date.now() - tokenValidityTimestamp > TOKEN_VALIDITY_TTL_MS
}

async function hasValidTokens(): Promise<boolean> {
  const isExpired = Date.now() - tokenValidityTimestamp > TOKEN_VALIDITY_TTL_MS
  if (tokenValidityPromise !== null && !isExpired) {
    return tokenValidityPromise
  }
  tokenValidityTimestamp = Date.now()
  tokenValidityPromise = (async () => {
    if (!fs.existsSync(TOKENS_FILE)) {
      return false
    }
    try {
      const { token } = JSON.parse(fs.readFileSync(TOKENS_FILE, 'utf-8'))
      if (!token || typeof token !== 'string') {
        return false
      }
      const response = await fetch(`${GFWAPI.baseUrl}/${GFWAPI.apiVersion}/auth/me`, {
        headers: { Authorization: `Bearer ${token}` },
      })
      return response.ok
    } catch {
      return false
    }
  })()
  return tokenValidityPromise
}

function rejectAfter(ms: number, message: string): Promise<never> {
  return new Promise((_, reject) => setTimeout(() => reject(new Error(message)), ms))
}

function logBanner(message: string) {
  log('========================================')
  log(message)
  log('========================================')
}

function setupPageLogging(page: Page) {
  page.on('console', (msg) => {
    log(`   [BROWSER CONSOLE] ${msg.type()}: ${msg.text()}`)
  })
  page.on('pageerror', (error) => {
    log(`   [BROWSER ERROR] ${error.message}`)
  })
}

async function getAuthErrorMessage(page: Page): Promise<string> {
  const bodyText = (await page.textContent('body').catch(() => ''))?.trim() || ''
  if (!bodyText) {
    return ''
  }
  if (bodyText.toLowerCase().includes(INVALID_CREDENTIALS_MESSAGE)) {
    return 'Email or password incorrect'
  }
  return ''
}

async function runLoginFlow(email: string, password: string) {
  log('🔐 Setting up authenticated browser state...')
  log('Launching Playwright browser...')
  const browser = await chromium.launch()
  const context = await browser.newContext()
  const page = await context.newPage()
  let authProxyServer: Server | null = null

  setupPageLogging(page)

  try {
    log('Starting auth proxy server...')
    const proxyServer = await startAuthProxyServer()
    authProxyServer = proxyServer.server

    log(`Navigating to proxy login URL: ${proxyServer.loginUrl}`)
    await page.goto(proxyServer.loginUrl, {
      timeout: NAVIGATION_TIMEOUT_MS,
      waitUntil: 'domcontentloaded',
    })
    await page.waitForURL('**/auth*', { timeout: NAVIGATION_TIMEOUT_MS })
    log(`Navigated to auth page: ${page.url()}`)

    log('Filling in email...')
    await page.getByRole('textbox', { name: 'Email' }).fill(email)
    log('Filling in password...')
    await page.getByRole('textbox', { name: 'Password' }).fill(password)

    log('Clicking login button...')
    await page.getByRole('button', { name: 'Login' }).click()

    log('Waiting for redirect to proxy callback with access token...')
    const accessToken = await Promise.race<string>([
      proxyServer.waitForAccessToken(),
      page.waitForURL('**/auth?error=true**', { timeout: NAVIGATION_TIMEOUT_MS }).then(async () => {
        const authErrorMessage = await getAuthErrorMessage(page)
        if (authErrorMessage.toLowerCase().includes(INVALID_CREDENTIALS_MESSAGE)) {
          throw new Error(
            'Authentication failed: invalid TEST_USER_EMAIL or TEST_USER_PASSWORD (gateway says "Email or password incorrect").'
          )
        }
        throw new Error(
          authErrorMessage
            ? `Authentication rejected by gateway: ${authErrorMessage}`
            : 'Authentication rejected by gateway (redirected to auth?error=true).'
        )
      }),
      rejectAfter(NAVIGATION_TIMEOUT_MS + 1000, 'Timed out waiting for auth callback'),
    ])
    log(`Access token captured from callback URL: Yes (length: ${accessToken.length})`)

    log('Exchanging access token for API tokens with GFWAPI...')
    const tokens = await GFWAPI.getTokensWithAccessToken(accessToken)

    log(`Token retrieved: ${tokens.token ? 'Yes (length: ' + tokens.token.length + ')' : 'No'}`)
    log(
      `Refresh token retrieved: ${tokens.refreshToken ? 'Yes (length: ' + tokens.refreshToken.length + ')' : 'No'}`
    )

    fs.writeFileSync(TOKENS_FILE, JSON.stringify(tokens, null, 2))
    log(`✅ Authentication tokens saved to ${TOKENS_FILE}`)
  } catch (error: unknown) {
    const errorMessage = error instanceof Error ? error.message : String(error)
    const errorStack = error instanceof Error ? error.stack : undefined
    log(`❌ Failed to setup authentication: ${errorMessage}`)
    if (errorStack) {
      log(`Stack trace: ${errorStack}`)
    }
    throw error
  } finally {
    if (authProxyServer) {
      authProxyServer.close()
      await once(authProxyServer, 'close')
      log('Auth proxy server stopped')
    }
    await context.close()
    await browser.close()
    log('Browser closed')
  }
}

type AuthSetupOptions = {
  resetLog?: boolean
}

async function runAuthSetup(runLabel: string, options: AuthSetupOptions = {}) {
  fs.mkdirSync(AUTH_DIR, { recursive: true })
  if (options.resetLog) {
    fs.writeFileSync(AUTH_LOG_FILE, '')
  }

  initLogStream(AUTH_LOG_FILE)
  logBanner(`Authentication Setup Started (${runLabel})`)

  try {
    if (await hasValidTokens()) {
      log('✅ Valid tokens found, skipping auth setup')
      return
    }

    const email = process.env.TEST_USER_EMAIL
    const password = process.env.TEST_USER_PASSWORD

    log(`Email configured: ${email ? 'Yes' : 'No'}`)
    log(`Password configured: ${password ? 'Yes (hidden)' : 'No'}`)

    if (!email || !password) {
      log('⚠️  TEST_USER_EMAIL or TEST_USER_PASSWORD not set, skipping auth setup')
      return
    }

    await runLoginFlow(email, password)
    logBanner('Authentication Setup Completed Successfully')
  } finally {
    closeLogStream()
  }
}
export default runAuthSetup
