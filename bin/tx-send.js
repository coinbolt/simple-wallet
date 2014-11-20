#!/usr/bin/env node

var chalk = require('chalk')
var request = require('superagent')
var stdinToString = require('../lib/stdin-to-string')

var url = 'https://testnet.helloblock.io/v1/transactions'

stdinToString(function(err, input) {
  if (err) return console.error(err)

  request.post(url).send('rawTxHex=' + input).end(function(res) {
    if (res.statusCode != 200) return console.error('Response code not 200: ' + res.statusCode)
    if (res.body && res.body.status != 'success') return console.error('Response not successful.')

    if (res.body && res.body.data.transaction) {
      console.log('')
      console.log('  %s', chalk.green('success!'))
      console.log('')
      console.log('    tx id: %s', chalk.magenta(res.body.data.transaction.txHash))
      console.log('')
    }
  })
})
