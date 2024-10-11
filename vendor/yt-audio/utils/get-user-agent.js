const UserAgents = require('user-agents')
function getRandomUserAgent() {
    return new UserAgents().random().toString()
}

module.exports = { getRandomUserAgent }
