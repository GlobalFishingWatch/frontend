// Fix to solve svg without proper styles in html2canvas
// https://github.com/niklasvh/html2canvas/issues/1380#issuecomment-361611523
const setInlineStyles = (targetElem: HTMLElement) => {
  const transformProperties = ['fill', 'color', 'font-size', 'stroke', 'font', 'opacity']

  const svgElems = Array.from(targetElem.getElementsByTagName('svg'))

  for (const svgElement of svgElems) {
    recurseElementChildren(svgElement)
  }

  function recurseElementChildren(node: SVGSVGElement | HTMLElement) {
    if (!node.style) return

    const styles = getComputedStyle(node)

    for (const transformProperty of transformProperties) {
      node.style[transformProperty as any] = styles[transformProperty as any]
    }

    for (const child of Array.from(node.childNodes)) {
      recurseElementChildren(child as SVGSVGElement)
    }
  }
}

export const getCSSVarValue = (property: string) => {
  if (typeof window !== 'undefined') {
    return window.getComputedStyle(document.body).getPropertyValue(property)
  }
  return ''
}

export default setInlineStyles

export const getOperatingSystem = () => {
  const userAgent = window.navigator.userAgent,
    platform = window.navigator?.userAgentData ? window.navigator.userAgentData.platform : window.navigator.platform,
    macosPlatforms = ['Macintosh', 'MacIntel', 'MacPPC', 'Mac68K', 'macOS'],
    windowsPlatforms = ['Win32', 'Win64', 'Windows', 'WinCE'],
    iosPlatforms = ['iPhone', 'iPad', 'iPod'];

  if (macosPlatforms.indexOf(platform) !== -1) {
    return 'Mac OS';
  } else if (iosPlatforms.indexOf(platform) !== -1) {
    return 'iOS';
  } else if (windowsPlatforms.indexOf(platform) !== -1) {
    return 'Windows 10';
  } else if (/Android/.test(userAgent)) {
    return 'Android';
  } else if (/Linux/.test(platform)) {
    return 'Linux (Ubuntu, etc)';
  }

  return 'unknown';
}

export const getBrowser = () => {
  const userAgent = window.navigator.userAgent,
    browsers = {
      chrome: /chrome/i,
      safari: /safari/i,
      firefox: /firefox/i,
      ie: /internet explorer/i,
      edge: /edge/i,
    };

  for (const key in browsers) {
    if (browsers[key].test(userAgent)) {
      return key[0].toUpperCase() + key.substring(1).toLowerCase();
    }
  }

  return 'unknown';
}

export const getHref = () => {
  return window.location.href
}