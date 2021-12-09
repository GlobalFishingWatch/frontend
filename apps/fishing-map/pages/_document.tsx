import Document, { DocumentContext, Html, Head, Main, NextScript } from 'next/document'

class MyDocument extends Document {
  static async getInitialProps(ctx: DocumentContext) {
    const initialProps = await Document.getInitialProps(ctx)
    return { ...initialProps }
  }

  render() {
    return (
      <Html>
        <Head>
          <head>
            <meta charSet="utf-8" />
            <meta
              name="viewport"
              content="width=device-width, initial-scale=1, viewport-fit=cover"
            />
            <link rel="shortcut icon" href="/map/icons/favicon.ico" />
            <link rel="icon" type="image/png" sizes="16x16" href="/map/icons/favicon-16x16.png" />
            <link rel="icon" type="image/png" sizes="32x32" href="/map/icons/favicon-32x32.png" />
            <link rel="icon" type="image/png" sizes="48x48" href="/map/icons/favicon-48x48.png" />
            <link rel="manifest" href="/map/icons/manifest.webmanifest" />
            <meta name="mobile-web-app-capable" content="yes" />
            <meta name="theme-color" content="#163f89" />
            <meta name="application-name" content="GFW Fishing map" />
            <link
              rel="apple-touch-icon"
              sizes="120x120"
              href="/map/icons/apple-touch-icon-120x120.png"
            />
            <link
              rel="apple-touch-icon"
              sizes="152x152"
              href="/map/icons/apple-touch-icon-152x152.png"
            />
            <link
              rel="apple-touch-icon"
              sizes="1024x1024"
              href="/map/icons/apple-touch-icon-1024x1024.png"
            />
            <meta name="apple-mobile-web-app-capable" content="yes" />
            <meta name="apple-mobile-web-app-status-bar-style" content="black-translucent" />
            <meta name="apple-mobile-web-app-title" content="GFW Fishing map" />
            <link
              rel="apple-touch-startup-image"
              media="(width: 320px) and (height: 568px) and (-webkit-device-pixel-ratio: 2) and (orientation: portrait)"
              href="/map/icons/apple-touch-startup-image-640x1136.png"
            />
            <link
              rel="apple-touch-startup-image"
              media="(width: 375px) and (height: 667px) and (-webkit-device-pixel-ratio: 2) and (orientation: portrait)"
              href="/map/icons/apple-touch-startup-image-750x1334.png"
            />
            <link
              rel="apple-touch-startup-image"
              media="(width: 414px) and (height: 896px) and (-webkit-device-pixel-ratio: 2) and (orientation: portrait)"
              href="/map/icons/apple-touch-startup-image-828x1792.png"
            />
            <link
              rel="apple-touch-startup-image"
              media="(width: 375px) and (height: 812px) and (-webkit-device-pixel-ratio: 3) and (orientation: portrait)"
              href="/map/icons/apple-touch-startup-image-1125x2436.png"
            />
            <link
              rel="apple-touch-startup-image"
              media="(width: 414px) and (height: 736px) and (-webkit-device-pixel-ratio: 3) and (orientation: portrait)"
              href="/map/icons/apple-touch-startup-image-1242x2208.png"
            />
            <link
              rel="apple-touch-startup-image"
              media="(width: 414px) and (height: 896px) and (-webkit-device-pixel-ratio: 3) and (orientation: portrait)"
              href="/map/icons/apple-touch-startup-image-1242x2688.png"
            />
            <link
              rel="apple-touch-startup-image"
              media="(width: 768px) and (height: 1024px) and (-webkit-device-pixel-ratio: 2) and (orientation: portrait)"
              href="/map/icons/apple-touch-startup-image-1536x2048.png"
            />
            <link
              rel="apple-touch-startup-image"
              media="(width: 834px) and (height: 1112px) and (-webkit-device-pixel-ratio: 2) and (orientation: portrait)"
              href="/map/icons/apple-touch-startup-image-1668x2224.png"
            />
            <link
              rel="apple-touch-startup-image"
              media="(width: 834px) and (height: 1194px) and (-webkit-device-pixel-ratio: 2) and (orientation: portrait)"
              href="/map/icons/apple-touch-startup-image-1668x2388.png"
            />
            <link
              rel="apple-touch-startup-image"
              media="(width: 1024px) and (height: 1366px) and (-webkit-device-pixel-ratio: 2) and (orientation: portrait)"
              href="/map/icons/apple-touch-startup-image-2048x2732.png"
            />
            <link
              rel="apple-touch-startup-image"
              media="(width: 810px) and (height: 1080px) and (-webkit-device-pixel-ratio: 2) and (orientation: portrait)"
              href="/map/icons/apple-touch-startup-image-1620x2160.png"
            />
            <link
              rel="apple-touch-startup-image"
              media="(width: 320px) and (height: 568px) and (-webkit-device-pixel-ratio: 2) and (orientation: landscape)"
              href="/map/icons/apple-touch-startup-image-1136x640.png"
            />
            <link
              rel="apple-touch-startup-image"
              media="(width: 375px) and (height: 667px) and (-webkit-device-pixel-ratio: 2) and (orientation: landscape)"
              href="/map/icons/apple-touch-startup-image-1334x750.png"
            />
            <link
              rel="apple-touch-startup-image"
              media="(width: 414px) and (height: 896px) and (-webkit-device-pixel-ratio: 2) and (orientation: landscape)"
              href="/map/icons/apple-touch-startup-image-1792x828.png"
            />
            <link
              rel="apple-touch-startup-image"
              media="(width: 375px) and (height: 812px) and (-webkit-device-pixel-ratio: 3) and (orientation: landscape)"
              href="/map/icons/apple-touch-startup-image-2436x1125.png"
            />
            <link
              rel="apple-touch-startup-image"
              media="(width: 414px) and (height: 736px) and (-webkit-device-pixel-ratio: 3) and (orientation: landscape)"
              href="/map/icons/apple-touch-startup-image-2208x1242.png"
            />
            <link
              rel="apple-touch-startup-image"
              media="(width: 414px) and (height: 896px) and (-webkit-device-pixel-ratio: 3) and (orientation: landscape)"
              href="/map/icons/apple-touch-startup-image-2688x1242.png"
            />
            <link
              rel="apple-touch-startup-image"
              media="(width: 768px) and (height: 1024px) and (-webkit-device-pixel-ratio: 2) and (orientation: landscape)"
              href="/map/icons/apple-touch-startup-image-2048x1536.png"
            />
            <link
              rel="apple-touch-startup-image"
              media="(width: 834px) and (height: 1112px) and (-webkit-device-pixel-ratio: 2) and (orientation: landscape)"
              href="/map/icons/apple-touch-startup-image-2224x1668.png"
            />
            <link
              rel="apple-touch-startup-image"
              media="(width: 834px) and (height: 1194px) and (-webkit-device-pixel-ratio: 2) and (orientation: landscape)"
              href="/map/icons/apple-touch-startup-image-2388x1668.png"
            />
            <link
              rel="apple-touch-startup-image"
              media="(width: 1024px) and (height: 1366px) and (-webkit-device-pixel-ratio: 2) and (orientation: landscape)"
              href="/map/icons/apple-touch-startup-image-2732x2048.png"
            />
            <link
              rel="apple-touch-startup-image"
              media="(width: 810px) and (height: 1080px) and (-webkit-device-pixel-ratio: 2) and (orientation: landscape)"
              href="/map/icons/apple-touch-startup-image-2160x1620.png"
            />
            <meta name="msapplication-TileColor" content="#fff" />
            <meta name="msapplication-TileImage" content="icons/mstile-144x144.png" />
            <meta name="msapplication-config" content="icons/browserconfig.xml" />
            <link rel="canonical" href="https://globalfishingwatch.org/map" />

            <title>GFW | Map</title>

            <link
              href="https://fonts.googleapis.com/css?family=Roboto:400,500,700&display=swap"
              rel="stylesheet"
            />

            <meta
              property="og:description"
              content="Through our free and open data transparency platform, Global Fishing Watch enables research and innovation in support of ocean sustainability."
            />
            <meta
              name="twitter:description"
              content="Through our free and open data transparency platform, Global Fishing Watch enables research and innovation in support of ocean sustainability."
            />
            <meta
              name="description"
              content="Through our free and open data transparency platform, Global Fishing Watch enables research and innovation in support of ocean sustainability."
            />
          </head>
        </Head>
        <body>
          <Main />
          <NextScript />
        </body>
      </Html>
    )
  }
}

export default MyDocument
