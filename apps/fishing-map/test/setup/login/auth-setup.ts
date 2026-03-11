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

async function hasValidTokens(): Promise<boolean> {
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
    await page.goto(proxyServer.loginUrl, { timeout: NAVIGATION_TIMEOUT_MS })
    await page.waitForURL('**/auth*', { timeout: NAVIGATION_TIMEOUT_MS })
    log(`Navigated to auth page: ${page.url()}`)

    log('Filling in email...')
    await page.getByRole('textbox', { name: 'Email' }).fill(email)
    log('Filling in password...')
    await page.getByRole('textbox', { name: 'Password' }).fill(password)

    log('Clicking login button...')
    await page.getByRole('button', { name: 'Login' }).click()

    log('Waiting for redirect to proxy callback with access token...')
    const accessToken = await Promise.race([
      proxyServer.waitForAccessToken(),
      rejectAfter(NAVIGATION_TIMEOUT_MS, 'Timed out waiting for auth callback'),
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

  initLogStream(AUTH_LOG_FILE, runLabel)
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
