/// <reference types="../types" />

import fs from 'fs'
import util from 'util'
import React from 'react'
import { renderToStaticMarkup } from 'react-dom/server'
import Header from './Header'

const readFile = util.promisify(fs.readFile)
const writeFile = util.promisify(fs.writeFile)

const componentsList = [
  { component: <Header />, path: 'src/header/html/header.html' },
  { component: <Header languages={false} />, path: 'src/header/html/header-no-languages.html' },
  { component: <Header mini />, path: 'src/header/html/header-mini.html' },
  { component: <Header inverted />, path: 'src/header/html/header-inverted.html' },
  {
    component: <Header inverted languages={false} />,
    path: 'src/header/html/header-inverted-no-languages.html',
  },
  { component: <Header mini inverted />, path: 'src/header/html/header-mini-inverted.html' },
]

async function preRender(components: typeof componentsList) {
  const styles = await readFile('src/header/header.css')
  const languagesScript = await readFile('src/header/header-scripts.html')

  for (let i = 0, length = components.length; i < length; i++) {
    const { component, path } = components[i]
    const { languages = true } = component.props
    const markup = renderToStaticMarkup(component)
    const script = languages ? languagesScript : ''
    const html = `<style>\n${styles}</style>\n${markup}\n${script}`
    try {
      await writeFile(path, html)
      console.log(`Wrote ${path}`)
    } catch (e) {
      console.log(e)
    }
  }
}

preRender(componentsList)
