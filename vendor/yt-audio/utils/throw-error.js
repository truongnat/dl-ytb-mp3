class ErrorModule extends Error {
  constructor(message, reason) {
    super(message)

    this.message = message
    this.name = ErrorModule.name
    this.stack = reason

    Error.captureStackTrace(this, ErrorModule)
  }
}

module.exports = { ErrorModule }
