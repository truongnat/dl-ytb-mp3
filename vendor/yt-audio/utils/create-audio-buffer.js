const { TCodecs } = require("../constants/constants")

const ffmpeg = require("fluent-ffmpeg")
const axios = require("axios")
const path = require('node:path')

const { PassThrough, Readable } = require("stream")

async function fetchVideo(format, headers) {
  `Fetching data bytes ${format.mimeType}`
  const response = await axios.get(format.url, {
    headers,
    responseType: "arraybuffer",
    timeout: 60000
  })

  return Readable.from(response.data)
}

function parseTimemark(timemark) {
  const [hours, minutes, seconds] = timemark.split(":").map(Number)
  return hours * 3600 + minutes * 60 + seconds
}

function convertVideoToAudio(audio, videoStream, outputFormat) {
  return new Promise((resolve, reject) => {
    const temporaryBuffer = new PassThrough()
    const chunks = []
    const ffmpegPath = path.resolve(__dirname, '../../..', 'vendor/ffmpeg-master-latest-win64-gpl/ffmpeg-master-latest-win64-gpl/bin/ffmpeg.exe');
    ffmpeg()
      .setFfmpegPath(ffmpegPath)
      .input(videoStream)
      .inputFormat("mp4")
      .noVideo()
      .audioCodec(TCodecs[outputFormat])
      .audioChannels(audio.formats[0].audioChannels)
      .outputOptions([`-b:a`, "128k", `-t`, audio.details.lengthSeconds])
      .toFormat(outputFormat)
      .on("progress", progress => {
        const percentage =
          (parseTimemark(progress.timemark) /
            Number(audio.details.lengthSeconds)) *
          100
        process.stdout.write(`\r Compiling progress: ${percentage.toFixed(2)}%`)
      })
      .on("error", err => reject(err))
      .pipe(temporaryBuffer, { end: true })

    temporaryBuffer.on("end", () => {
      process.stdout.write("\r\x1b[2K")
      resolve(Buffer.concat(chunks))
    })

    temporaryBuffer.on("data", chunk => {
      chunks.push(chunk)
    })

    temporaryBuffer.on("error", err => {
      reject(err)
    })
  })
}

async function createAudioBuffer(audio, headers, options) {
  const videoStream = await fetchVideo(audio.formats[0], headers)

  const data = await convertVideoToAudio(
    audio,
    videoStream,
    options.outputFormat || "mp3"
  )

  return data
}

module.exports = { createAudioBuffer }
