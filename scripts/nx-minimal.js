#!/usr/bin/env node
// Script to run nx affected with minimal dependencies by temporarily disabling plugins
const fs = require('fs')
const path = require('path')
const { execSync } = require('child_process')

const nxJsonPath = path.join(__dirname, '..', 'nx.json')
const backupPath = nxJsonPath + '.backup'

try {
  // Backup nx.json
  fs.copyFileSync(nxJsonPath, backupPath)

  // Read and modify nx.json
  const nxJson = JSON.parse(fs.readFileSync(nxJsonPath, 'utf8'))
  const originalPlugins = nxJson.plugins
  delete nxJson.plugins
  fs.writeFileSync(nxJsonPath, JSON.stringify(nxJson, null, 2))

  // Run the affected command
  const args = process.argv.slice(2)

  // Arguments are mandatory
  if (args.length === 0) {
    console.error('Error: Command arguments are required')
    console.error('Usage: node affected-minimal.js <nx-command>')
    process.exit(1)
  }

  const command = args.join(' ')

  // Use shell execution to handle redirects and pipes
  execSync(command, { stdio: 'inherit', cwd: path.join(__dirname, '..'), shell: true })
} catch (error) {
  console.error('Error:', error.message)
  process.exit(1)
} finally {
  // Restore nx.json
  if (fs.existsSync(backupPath)) {
    fs.renameSync(backupPath, nxJsonPath)
  }
}
