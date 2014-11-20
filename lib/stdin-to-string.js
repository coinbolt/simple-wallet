
function stdinToString(callback) {
  var input = ''
  process.stdin.on('error', callback)
  process.stdin.on('data', function(data) {
    input += data.toString('utf8')
  })
  process.stdin.on('end', function() {
    callback(null, input.trim())
  })
}

module.exports = stdinToString