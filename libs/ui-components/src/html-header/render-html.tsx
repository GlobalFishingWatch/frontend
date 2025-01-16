/// <reference types="../types" />

import fs from 'fs'
import util from 'util'

import React from 'react'
import { renderToStaticMarkup } from 'react-dom/server'

import { Header } from './html/Header'

const readFile = util.promisify(fs.readFile)
const writeFile = util.promisify(fs.writeFile)

type ComponentItem = {
  component: React.ReactElement<any>
  path: string
}
const componentsList: ComponentItem[] = [
  { component: <Header />, path: 'src/header/html/header.html' },
  { component: <Header />, path: 'src/header/html/header-no-languages.html' },
  { component: <Header mini />, path: 'src/header/html/header-mini.html' },
  {
    component: <Header mini />,
    path: 'src/header/html/header-mini-no-languages.html',
  },
  { component: <Header inverted />, path: 'src/header/html/header-inverted.html' },
  {
    component: <Header inverted />,
    path: 'src/header/html/header-inverted-no-languages.html',
  },
  { component: <Header mini inverted />, path: 'src/header/html/header-mini-inverted.html' },
]

async function preRender(components: typeof componentsList) {
  const styles = await readFile('src/header/html/header.css')

  for (let i = 0, length = components.length; i < length; i++) {
    const { component, path } = components[i]
    const markup = renderToStaticMarkup(component)
    const html = `<style>\n${styles}</style>\n${markup}}`
    try {
      await writeFile(path, html)
      console.info(`Wrote ${path}`)
    } catch (e: any) {
      console.warn(e)
    }
  }
}

preRender(componentsList)
