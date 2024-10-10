const { VIDEO_ID_REGEXP } = require("../regexp")

const checkVideoId = (id) => VIDEO_ID_REGEXP.test(id);

module.exports = {
    checkVideoId
}