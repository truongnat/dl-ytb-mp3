const { checkVideoId } = require("./scripts/check-video-id")
const { fetchHtmlPage } = require("./core/fetch-html-page")
const { exctractVideoInfo } = require("./core/extract-video-info")
const { createAudioBuffer } = require("./utils/create-audio-buffer")
const { clearLogger } = require("./utils/logger")
const { defaultOptions } = require("./constants/constants")
const { extractDesipherFunctions } = require("./core/extract-desipher-scripts")


async function getAudioById(id, options) {
  try {
    if (!checkVideoId(id)) throw new Error("Invalid video id")
    options = { ...defaultOptions, ...options }

    const webData = await fetchHtmlPage(id, options)

    const scripts = await extractDesipherFunctions(webData)

    const video = exctractVideoInfo(webData.htmlContent, scripts)

    const buffer = await createAudioBuffer(video, webData.headers, options)

    return {
      audio: video,
      buffer,
      headers: webData.headers
    }
  } catch (e) {
    throw e
  } finally {
    clearLogger()
  }
}

module.exports = { getAudioById }
