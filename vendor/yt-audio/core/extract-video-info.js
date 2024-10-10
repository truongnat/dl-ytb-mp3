const cheerio = require("cheerio")
const { ErrorModule } = require("../utils/throw-error")
const { HTML_PAGE_SCRIPT_REGEX } = require("../regexp")
const { desipherDownloadURL } = require("./desipher-video-urls")

const exctractVideoInfo = (htmlContent, scripts) => {
  const $ = cheerio.load(htmlContent)
  const scriptTags = $("script")

  let playerResponse = null

  scriptTags.each((_, scriptTag) => {
    const scriptContent = $(scriptTag).html()
    if (scriptContent) {
      const match = scriptContent.match(HTML_PAGE_SCRIPT_REGEX)

      if (!match) return

      playerResponse = JSON.parse(match[1])

      if (playerResponse?.playabilityStatus.status === "LOGIN_REQUIRED") {
        throw new ErrorModule(
          "Many requests, login required",
          playerResponse.playabilityStatus.status
        )
      }
      if (playerResponse?.playabilityStatus.status !== "OK") {
        throw new ErrorModule(
          playerResponse?.playabilityStatus.reason ||
          "Error while exctract palyer response",
          playerResponse?.playabilityStatus.status
        )
      }
    }
  })
  if (!playerResponse)
    throw new ErrorModule(
      "Incorrect HTML, video information not found",
      "INCORRECT_HTML"
    )

  const formats = exctractVideoFormats(playerResponse, scripts) || []

  const details = playerResponse.videoDetails

  return { details, formats }
}

function exctractVideoFormats(playerResponse, scripts) {
  const formats = []
  const streamingData = playerResponse.streamingData || {}

  try {
    ;["formats"].forEach(dataType => {
      streamingData[dataType].forEach(format => {
        if (format) {
          const decodedFormat = desipherDownloadURL(
            format,
            scripts.decipher,
            scripts.nTransform
          )
          formats.push(decodedFormat)
        }
      })
    })
  } catch {
    return []
  }

  return formats
}

module.exports = { exctractVideoInfo }
