let logMessages = []

function logger(message) {
  logMessages.push(message)

  process.stdout.write(message + "\n")
}

function clearLogger() {
  for (let i = 0; i < logMessages.length; i++) {
    process.stdout.write("\x1b[2J\x1b[0f")
  }

  logMessages = []
}

module.exports = {
  logger,
  clearLogger
}