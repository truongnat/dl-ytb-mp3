const querystring = require("querystring")
const { DECIPHER_ARGUMENT, N_ARGUMENT } = require("../regexp")

const desipherDownloadURL = (format, decipherScript, nTransformScript) => {
  const decipher = url => {
    if (!decipherScript) return url
    const args = querystring.parse(url)

    if (!args.s) return args.url

    const components = new URL(decodeURIComponent(args.url))

    const context = {}
    context[DECIPHER_ARGUMENT] = decodeURIComponent(args.s)
    const sig = decipherScript.runInNewContext(context)
    components.searchParams.set("sig", sig)
    return components.toString()
  }

  const nTransform = url => {
    if (!nTransformScript) return url
    const components = new URL(decodeURIComponent(url))

    const n = components.searchParams.get("n")

    if (!n) return url
    const context = {}
    context[N_ARGUMENT] = n
    const ncode = nTransformScript.runInNewContext(context)
    components.searchParams.set("n", ncode)
    return components.toString()
  }
  const isCipher = !format.url

  const url = format.signatureCipher || format.cipher || format.url

  format.url = nTransform(isCipher ? decipher(url) : url)

  return {
    ...format,
    signatureCipher: "",
    cipher: ""
  }
}

module.exports = { desipherDownloadURL }
