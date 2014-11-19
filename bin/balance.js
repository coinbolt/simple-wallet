#!/usr/bin/env node

var accounting = require('accounting')
var chalk = require('chalk')
var fs = require('fs-extra')
var request = require('superagent')

var data = fs.readJsonSync('./wallet.json')
var url = 'https://testnet.helloblock.io/v1/addresses/' + data.address

request.get(url).end(function(res) {
  if (res.statusCode != 200) return console.error('Response code not 200: ' + res.statusCode)
  if (res.body && res.body.status != 'success') return console.error('Response not successful.')
  
  //always in satoshis (1e8 per 1 bitcoin)
  var balance = parseInt(res.body.data.address.balance, 10)

  //100 satoshis per 1 bit => 1e6 bits per 1 bitcoin
  var balanceBits = accounting.formatMoney(balance / 100, {symbol: 'BIT', format: '%v %s'})

  console.log('')
  console.log('  balance for %s', chalk.magenta(data.address))
  console.log('')
  console.log('    %s', chalk.blue.bold(balanceBits))
  console.log('')
})



