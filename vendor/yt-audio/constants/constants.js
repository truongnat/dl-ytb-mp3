const youtubeUrls = {
  main: "https://www.youtube.com",
  video: "https://www.youtube.com/watch?v=",
  shortLink: "https://youtu.be/",
  internalPlayer: "https://youtubei.googleapis.com/youtubei/v1/player"
}

const defaultOptions = {
  outputFormat: "webm",
  proxy: undefined,
  socks: undefined
}

const TCodecs = {
  webm: "libvorbis",
  mp3: "libmp3lame",
  wav: "pcm_s16le",
  opus: "opus",
  ogg: "libvorbis",
};

module.exports = {
  youtubeUrls,
  defaultOptions,
  TCodecs
}