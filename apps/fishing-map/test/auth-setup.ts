import { type ChildProcess, spawn } from 'child_process'
import * as fs from 'fs'
import * as path from 'path'
import { fileURLToPath } from 'url'

import { chromium } from '@playwright/test'
import * as dotenv from 'dotenv'

const __dirname = path.dirname(fileURLToPath(import.meta.url))

dotenv.config({ path: path.resolve(__dirname, '../../../.env') })

let devServerProcess: ChildProcess | null = null
let logStream: fs.WriteStream | null = null

function log(message: string) {
  const timestamp = new Date().toISOString()
  const logMessage = `[${timestamp}] ${message}\n`
  console.log(message)
  if (logStream) {
    logStream.write(logMessage)
  }
}

async function waitForServer(url: string, maxAttempts = 60, delayMs = 1000): Promise<boolean> {
  for (let i = 0; i < maxAttempts; i++) {
    try {
      const controller = new AbortController()
      const timeoutId = setTimeout(() => controller.abort(), 5000) // 5 second timeout per attempt

      const response = await fetch(url, { signal: controller.signal })
      clearTimeout(timeoutId)

      if (response.ok || response.status === 404) {
        return true
      }
      log(`   Attempt ${i + 1}/${maxAttempts}: Server returned ${response.status}, retrying...`)
    } catch (error: any) {
      log(`   Attempt ${i + 1}/${maxAttempts}: ${error.name} - ${error.message}`)
      // Server not ready yet
    }
    await new Promise((resolve) => setTimeout(resolve, delayMs))
  }
  return false
}

async function startDevServer(baseURL: string): Promise<boolean> {
  log('🚀 Starting dev server...')

  const workspaceRoot = path.resolve(__dirname, '../../..')

  devServerProcess = spawn('npx', ['nx', 'start', 'fishing-map'], {
    cwd: workspaceRoot,
    stdio: 'pipe',
    detached: false,
    env: { ...process.env },
  })

  devServerProcess.stdout?.on('data', (data) => {
    const output = data.toString()
    log(`   [DEV SERVER STDOUT] ${output.trim()}`)
  })

  devServerProcess.stderr?.on('data', (data) => {
    const output = data.toString()
    log(`   [DEV SERVER STDERR] ${output.trim()}`)
  })

  log(`   Waiting for server to be ready at ${baseURL}`)
  const ready = await waitForServer(baseURL, 60, 2000)

  if (ready) {
    log('✅ Dev server is ready')
    return true
  } else {
    log('❌ Dev server failed to start within timeout')
    if (devServerProcess) {
      devServerProcess.kill()
      devServerProcess = null
    }
    return false
  }
}

async function globalSetup() {
  // Initialize log file
  const logFile = path.join(__dirname, '../../../.auth/auth-setup.log')
  const authDir = path.dirname(logFile)
  if (!fs.existsSync(authDir)) {
    fs.mkdirSync(authDir, { recursive: true })
  }
  logStream = fs.createWriteStream(logFile, { flags: 'w' })

  log('========================================')
  log('Authentication Setup Started')
  log('========================================')

  const baseURL =
    process.env.VITEST_BASE_URL || process.env.PLAYWRIGHT_BASE_URL || 'http://localhost:3003'
  const email = process.env.TEST_USER_EMAIL
  const password = process.env.TEST_USER_PASSWORD

  log(`Base URL: ${baseURL}`)
  log(`Email configured: ${email ? 'Yes' : 'No'}`)
  log(`Password configured: ${password ? 'Yes (hidden)' : 'No'}`)

  if (!email || !password) {
    log('⚠️  TEST_USER_EMAIL or TEST_USER_PASSWORD not set, skipping auth setup')
    logStream?.end()
    return
  }

  log('🔐 Setting up authenticated browser state...')

  // Check if the server is running
  let serverWasStarted = false
  try {
    log(`Checking if server is already running at ${baseURL}...`)
    const controller = new AbortController()
    const timeoutId = setTimeout(() => controller.abort(), 5000) // 5 second timeout

    const response = await fetch(baseURL, { signal: controller.signal })
    clearTimeout(timeoutId)

    log(`Server response status: ${response.status}`)
    if (response.ok || response.status === 404) {
      log('✅ Dev server is already running')
    } else {
      log(`⚠️  Server returned status ${response.status}, will try to start dev server`)
      throw new Error('Server not ready')
    }
  } catch (error: any) {
    // Server not running, try to start it
    log(`⚠️  Dev server not accessible (${error.name}: ${error.message}), starting it...`)
    const started = await startDevServer(baseURL)
    if (!started) {
      log('❌ Failed to start dev server, skipping auth setup')
      log('   Tests will run without authentication')
      logStream?.end()
      return
    }
    serverWasStarted = true
  }

  log('Launching Playwright browser...')
  const browser = await chromium.launch()
  const context = await browser.newContext({ baseURL })
  const page = await context.newPage()

  // Enable console logging from the page
  page.on('console', (msg) => {
    log(`   [BROWSER CONSOLE] ${msg.type()}: ${msg.text()}`)
  })

  page.on('pageerror', (error) => {
    log(`   [BROWSER ERROR] ${error.message}`)
  })

  try {
    // Navigate to the app
    log('Navigating to /map...')
    await page.goto('/map', { timeout: 10000 })
    log(`Current URL: ${page.url()}`)

    // Close any modal that might appear
    log('Checking for modals...')
    const modalClose = page.getByTestId('modal-close-button')
    if (await modalClose.isVisible({ timeout: 2000 }).catch(() => false)) {
      log('Closing modal...')
      await modalClose.click()
    }

    // Click the login button
    log('Clicking login link...')
    await page.getByTestId('login-link').click()

    // Wait for navigation to auth page
    log('Waiting for auth page navigation...')
    await page.waitForURL('**/v3/auth*', { timeout: 10000 })
    log(`Navigated to auth page: ${page.url()}`)

    // Fill in credentials
    log('Filling in email...')
    await page.getByRole('textbox', { name: 'Email' }).fill(email)
    log('Filling in password...')
    await page.getByRole('textbox', { name: 'Password' }).fill(password)

    // Submit login
    log('Clicking login button...')
    await page.getByRole('button', { name: 'Login' }).click()

    // Wait for redirect back to app
    log('Waiting for redirect back to app...')
    await page.waitForURL('**/map/**', { timeout: 30000 })
    log(`Redirected to: ${page.url()}`)

    // Wait for the tokens to be stored in localStorage
    log('Waiting for tokens in localStorage...')
    await page.waitForFunction(
      () => {
        return localStorage.getItem('GFW_API_USER_TOKEN') !== null
      },
      { timeout: 10000 }
    )
    log('Tokens detected in localStorage')

    // Get the tokens from localStorage
    const tokens = await page.evaluate(() => {
      return {
        token: localStorage.getItem('GFW_API_USER_TOKEN'),
        refreshToken: localStorage.getItem('GFW_API_USER_REFRESH_TOKEN'),
      }
    })

    log(`Token retrieved: ${tokens.token ? 'Yes (length: ' + tokens.token.length + ')' : 'No'}`)
    log(
      `Refresh token retrieved: ${tokens.refreshToken ? 'Yes (length: ' + tokens.refreshToken.length + ')' : 'No'}`
    )

    // Save the tokens to a file that can be read by the config
    const tokensFile = path.join(__dirname, '../../../.auth/tokens.json')

    fs.writeFileSync(tokensFile, JSON.stringify(tokens, null, 2))

    log(`✅ Authentication tokens saved to ${tokensFile}`)
  } catch (error: any) {
    log(`❌ Failed to setup authentication: ${error.message}`)
    log(`Stack trace: ${error.stack}`)
    logStream?.end()
    throw error
  } finally {
    await context.close()
    await browser.close()
    log('Browser closed')
  }

  log('========================================')
  log('Authentication Setup Completed Successfully')
  log('========================================')

  // Return teardown function to clean up dev server if we started it
  return async () => {
    if (serverWasStarted && devServerProcess) {
      log('🛑 Stopping dev server...')
      devServerProcess.kill('SIGTERM')

      // Give it a moment to shut down gracefully
      await new Promise((resolve) => setTimeout(resolve, 2000))

      // Force kill if still running
      if (devServerProcess && !devServerProcess.killed) {
        devServerProcess.kill('SIGKILL')
      }

      devServerProcess = null
      log('✅ Dev server stopped')
    }

    // Close log stream
    if (logStream) {
      log('Closing log file')
      logStream.end()
    }
  }
}

export default globalSetup
