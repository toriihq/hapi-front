const front = require('../')
const init = require('./server')

module.exports.handler = front(init)
