/* eslint-disable */
const favicons = require('favicons')
const path = require('path')
const fs = require('fs')

const appName = 'Carrier Vessel Portal'
const themeColor = '#163f89'
const backgroundColor = '#fff'

const dest = '../public'
const destImages = '../public/icons'
const source = './public/icon.png'

const dir = path.resolve(__dirname, dest)
if (!fs.existsSync(dir)) {
  fs.mkdirSync(dir)
}
const dirImages = path.resolve(__dirname, destImages)
if (!fs.existsSync(dirImages)) {
  fs.mkdirSync(dirImages)
}

const configuration = {
  path: '/carrier-portal/icons',
  appName,
  appDescription: null,
  developerName: null,
  developerURL: null,
  dir: 'auto',
  lang: 'en-US',
  background: backgroundColor,
  theme_color: themeColor,
  display: 'standalone',
  orientation: 'any',
  start_url: '/',
  version: '1.0',
  logging: true,
  icons: {
    android: true,
    appleIcon: true,
    appleStartup: true,
    coast: false,
    favicons: true,
    firefox: false,
    windows: true,
    yandex: false,
  },
}

const callback = function(err, res) {
  if (err) {
    console.log(err.message)
    return
  }

  fs.writeFile(path.resolve(__dirname, 'head.html'), res.html.join('\n'), (err) => {
    if (err) {
      console.log(err)
    }
  })

  res.images.forEach((image) => {
    fs.writeFile(path.resolve(__dirname, destImages, image.name), image.contents, (err) => {
      if (err) {
        console.log(err)
      }
    })
  })

  res.files.forEach((file) => {
    fs.writeFile(path.resolve(__dirname, dest, file.name), file.contents, (err) => {
      if (err) {
        console.log(err)
      }
    })
  })
}

favicons(source, configuration, callback)
