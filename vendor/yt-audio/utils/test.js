const { log } = require('node:console')
const path = require('node:path')
const ffmpegPath = path.resolve(__dirname, '../../..','vendor/ffmpeg-master-latest-win64-gpl/ffmpeg-master-latest-win64-gpl/bin')

log(ffmpegPath)