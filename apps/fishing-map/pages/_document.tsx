import type { DocumentContext } from 'next/document'
import Document, { Head, Html, Main, NextScript } from 'next/document'

import { GOOGLE_TAG_MANAGER_ID, PATH_BASENAME } from 'data/config'

class MyDocument extends Document {
  static async getInitialProps(ctx: DocumentContext) {
    const initialProps = await Document.getInitialProps(ctx)
    return { ...initialProps }
  }

  render() {
    return (
      <Html>
        <Head>
          <meta charSet="utf-8" />
          <meta
            property="og:description"
            content="The Global Fishing Watch map is the first open-access platform for visualization and analysis of marine traffic and vessel-based human activity at sea."
          />
          <meta
            name="twitter:description"
            content="The Global Fishing Watch map is the first open-access platform for visualization and analysis of marine traffic and vessel-based human activity at sea."
          />
          <meta
            name="description"
            content="The Global Fishing Watch map is the first open-access platform for visualization and analysis of marine traffic and vessel-based human activity at sea."
          />
          <link rel="shortcut icon" href={`${PATH_BASENAME}/icons/favicon.ico`} />
          <link
            rel="icon"
            type="image/png"
            sizes="16x16"
            href={`${PATH_BASENAME}/icons/favicon-16x16.png`}
          />
          <link
            rel="icon"
            type="image/png"
            sizes="32x32"
            href={`${PATH_BASENAME}/icons/favicon-32x32.png`}
          />
          <link
            rel="icon"
            type="image/png"
            sizes="48x48"
            href={`${PATH_BASENAME}/icons/favicon-48x48.png`}
          />
          <link rel="manifest" href={`${PATH_BASENAME}/icons/manifest.webmanifest`} />
          <link rel="preconnect" href="https://fonts.gstatic.com/" />
          <link rel="preconnect" href="https://fonts.gstatic.com/" crossOrigin="anonymous" />
          <link
            href="https://fonts.googleapis.com/css?family=Roboto:400,500&display=swap"
            rel="stylesheet"
            media="print"
          />
          <meta name="mobile-web-app-capable" content="yes" />
          <meta name="theme-color" content="#163f89" />
          <meta name="application-name" content="GFW Fishing map" />
          <meta name="referrer" content="no-referrer-when-downgrade"></meta>
          <link
            rel="apple-touch-icon"
            sizes="120x120"
            href={`${PATH_BASENAME}/icons/apple-touch-icon-120x120.png`}
          />
          <link
            rel="apple-touch-icon"
            sizes="152x152"
            href={`${PATH_BASENAME}/icons/apple-touch-icon-152x152.png`}
          />
          <link
            rel="apple-touch-icon"
            sizes="1024x1024"
            href={`${PATH_BASENAME}/icons/apple-touch-icon-1024x1024.png`}
          />
          <meta name="apple-mobile-web-app-capable" content="yes" />
          <meta name="apple-mobile-web-app-status-bar-style" content="black-translucent" />
          <meta name="apple-mobile-web-app-title" content="GFW Fishing map" />
          <link
            rel="apple-touch-startup-image"
            media="(width: 320px) and (height: 568px) and (-webkit-device-pixel-ratio: 2) and (orientation: portrait)"
            href={`${PATH_BASENAME}/icons/apple-touch-startup-image-640x1136.png`}
          />
          <link
            rel="apple-touch-startup-image"
            media="(width: 375px) and (height: 667px) and (-webkit-device-pixel-ratio: 2) and (orientation: portrait)"
            href={`${PATH_BASENAME}/icons/apple-touch-startup-image-750x1334.png`}
          />
          <link
            rel="apple-touch-startup-image"
            media="(width: 414px) and (height: 896px) and (-webkit-device-pixel-ratio: 2) and (orientation: portrait)"
            href={`${PATH_BASENAME}/icons/apple-touch-startup-image-828x1792.png`}
          />
          <link
            rel="apple-touch-startup-image"
            media="(width: 375px) and (height: 812px) and (-webkit-device-pixel-ratio: 3) and (orientation: portrait)"
            href={`${PATH_BASENAME}/icons/apple-touch-startup-image-1125x2436.png`}
          />
          <link
            rel="apple-touch-startup-image"
            media="(width: 414px) and (height: 736px) and (-webkit-device-pixel-ratio: 3) and (orientation: portrait)"
            href={`${PATH_BASENAME}/icons/apple-touch-startup-image-1242x2208.png`}
          />
          <link
            rel="apple-touch-startup-image"
            media="(width: 414px) and (height: 896px) and (-webkit-device-pixel-ratio: 3) and (orientation: portrait)"
            href={`${PATH_BASENAME}/icons/apple-touch-startup-image-1242x2688.png`}
          />
          <link
            rel="apple-touch-startup-image"
            media="(width: 768px) and (height: 1024px) and (-webkit-device-pixel-ratio: 2) and (orientation: portrait)"
            href={`${PATH_BASENAME}/icons/apple-touch-startup-image-1536x2048.png`}
          />
          <link
            rel="apple-touch-startup-image"
            media="(width: 834px) and (height: 1112px) and (-webkit-device-pixel-ratio: 2) and (orientation: portrait)"
            href={`${PATH_BASENAME}/icons/apple-touch-startup-image-1668x2224.png`}
          />
          <link
            rel="apple-touch-startup-image"
            media="(width: 834px) and (height: 1194px) and (-webkit-device-pixel-ratio: 2) and (orientation: portrait)"
            href={`${PATH_BASENAME}/icons/apple-touch-startup-image-1668x2388.png`}
          />
          <link
            rel="apple-touch-startup-image"
            media="(width: 1024px) and (height: 1366px) and (-webkit-device-pixel-ratio: 2) and (orientation: portrait)"
            href={`${PATH_BASENAME}/icons/apple-touch-startup-image-2048x2732.png`}
          />
          <link
            rel="apple-touch-startup-image"
            media="(width: 810px) and (height: 1080px) and (-webkit-device-pixel-ratio: 2) and (orientation: portrait)"
            href={`${PATH_BASENAME}/icons/apple-touch-startup-image-1620x2160.png`}
          />
          <link
            rel="apple-touch-startup-image"
            media="(width: 320px) and (height: 568px) and (-webkit-device-pixel-ratio: 2) and (orientation: landscape)"
            href={`${PATH_BASENAME}/icons/apple-touch-startup-image-1136x640.png`}
          />
          <link
            rel="apple-touch-startup-image"
            media="(width: 375px) and (height: 667px) and (-webkit-device-pixel-ratio: 2) and (orientation: landscape)"
            href={`${PATH_BASENAME}/icons/apple-touch-startup-image-1334x750.png`}
          />
          <link
            rel="apple-touch-startup-image"
            media="(width: 414px) and (height: 896px) and (-webkit-device-pixel-ratio: 2) and (orientation: landscape)"
            href={`${PATH_BASENAME}/icons/apple-touch-startup-image-1792x828.png`}
          />
          <link
            rel="apple-touch-startup-image"
            media="(width: 375px) and (height: 812px) and (-webkit-device-pixel-ratio: 3) and (orientation: landscape)"
            href={`${PATH_BASENAME}/icons/apple-touch-startup-image-2436x1125.png`}
          />
          <link
            rel="apple-touch-startup-image"
            media="(width: 414px) and (height: 736px) and (-webkit-device-pixel-ratio: 3) and (orientation: landscape)"
            href={`${PATH_BASENAME}/icons/apple-touch-startup-image-2208x1242.png`}
          />
          <link
            rel="apple-touch-startup-image"
            media="(width: 414px) and (height: 896px) and (-webkit-device-pixel-ratio: 3) and (orientation: landscape)"
            href={`${PATH_BASENAME}/icons/apple-touch-startup-image-2688x1242.png`}
          />
          <link
            rel="apple-touch-startup-image"
            media="(width: 768px) and (height: 1024px) and (-webkit-device-pixel-ratio: 2) and (orientation: landscape)"
            href={`${PATH_BASENAME}/icons/apple-touch-startup-image-2048x1536.png`}
          />
          <link
            rel="apple-touch-startup-image"
            media="(width: 834px) and (height: 1112px) and (-webkit-device-pixel-ratio: 2) and (orientation: landscape)"
            href={`${PATH_BASENAME}/icons/apple-touch-startup-image-2224x1668.png`}
          />
          <link
            rel="apple-touch-startup-image"
            media="(width: 834px) and (height: 1194px) and (-webkit-device-pixel-ratio: 2) and (orientation: landscape)"
            href={`${PATH_BASENAME}/icons/apple-touch-startup-image-2388x1668.png`}
          />
          <link
            rel="apple-touch-startup-image"
            media="(width: 1024px) and (height: 1366px) and (-webkit-device-pixel-ratio: 2) and (orientation: landscape)"
            href={`${PATH_BASENAME}/icons/apple-touch-startup-image-2732x2048.png`}
          />
          <link
            rel="apple-touch-startup-image"
            media="(width: 810px) and (height: 1080px) and (-webkit-device-pixel-ratio: 2) and (orientation: landscape)"
            href={`${PATH_BASENAME}/icons/apple-touch-startup-image-2160x1620.png`}
          />
          <meta name="msapplication-TileColor" content="#fff" />
          <meta name="msapplication-TileImage" content="icons/mstile-144x144.png" />
          <meta name="msapplication-config" content="icons/browserconfig.xml" />
          <link rel="canonical" href="https://globalfishingwatch.org/map" />

          {/* {(process.env.NODE_ENV === 'development' ||
            process.env.NEXT_PUBLIC_WORKSPACE_ENV === 'development') && (
            // eslint-disable-next-line @next/next/no-sync-scripts
            <script
              data-recording-token="OdtneXMLbdjnMXixIvHVgAKe9T1RQhmfWf5a68Jj"
              data-is-production-environment="false"
              src="https://snippet.meticulous.ai/v1/meticulous.js"
            />
          )} */}
        </Head>
        <body>
          <noscript
            dangerouslySetInnerHTML={{
              __html: `
                <iframe src="https://www.googletagmanager.com/ns.html?id=${GOOGLE_TAG_MANAGER_ID}"
                height="0" width="0" style="display:none;visibility:hidden"></iframe>
              `,
            }}
          />
          <Main />
          <NextScript />
        </body>
      </Html>
    )
  }
}

export default MyDocument
