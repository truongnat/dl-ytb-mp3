const axios = require("axios")
const { youtubeUrls } = require("../constants/constants")
const { HTML5_PLAYER_REGEX } = require("../regexp")
const { getRandomUserAgent } = require("../utils/get-user-agent")
const { logger } = require("../utils/logger")
const { SocksProxyAgent } = require("socks-proxy-agent")

const fetchHtmlPage = async (id, options) => {
  let socksProxy

  const url = youtubeUrls.video + id + "&sttick=0"

  if (options.socks) {
    logger(`Fetching html page: ${url} with socks ${options.socks} ...`)
    socksProxy = new SocksProxyAgent(options.socks)
    options.proxy = undefined
  } else if (options.proxy) {
    options.socks = undefined
    logger(`Fetching html page: ${url} with proxy ${options.proxy.host} ...`)
  } else {
    logger(`Fetching html page: ${url}...`)
  }

  const userAgent = getRandomUserAgent()

  const headers = {
    "User-Agent": userAgent,
    "Accept-Language": "en-US,en;q=0.9",
    "Accept-Encoding": "gzip, deflate, br",
    "Cache-Control": "no-cache, max-age=0",
    Origin: youtubeUrls.main,
    Referer: url,
    Accept:
      "text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,image/apng,*/*;q=0.8",
    Connection: "keep-alive",
    "X-Requested-With": "XMLHttpRequest",
    Cookie: ""
  }
  const response = await axios.get(url, {
    headers,
    proxy: options.proxy,
    httpAgent: socksProxy,
    httpsAgent: socksProxy
  })

  headers["Cookie"] = response.headers["set-cookie"]?.toString() || ""

  return {
    htmlContent: response.data,
    headers,
    socksProxy,
    proxy: options.proxy
  }
}

const fetchtHTML5Player = async webData => {
  const html5PlayerRes = HTML5_PLAYER_REGEX.exec(webData.htmlContent)
  const html5PlayerUrl = html5PlayerRes
    ? html5PlayerRes[1] || html5PlayerRes[2]
    : ""
  const requestUrl = youtubeUrls.main + html5PlayerUrl

  logger(`Fetching player js: ${requestUrl} ...`)

  const response = await axios.get(requestUrl, {
    headers: webData.headers,
    proxy: webData.proxy,
    httpAgent: webData.socksProxy,
    httpsAgent: webData.socksProxy
  })

  return response.data
}

module.exports = { fetchHtmlPage, fetchtHTML5Player }