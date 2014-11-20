#!/usr/bin/env node

var CoinKey = require('coinkey')
var chalk = require('chalk')
var fs = require('fs-extra')
var path = require('path')
var stdinToString = require('../lib/stdin-to-string')
var Transaction = require('cointx').Transaction
var txUtils = require('../lib/txutils')

var args = process.argv.slice(2) //chop off first two
if (args.length < 1) 
  return console.error("Must pass in both address as the first argument and the optionally the amount as the second.")

var walletData = fs.readJsonSync(path.join(__dirname, '../wallet.json'))

var receiverAddress = args[0]
var amountSatoshis = 100 * parseInt(args[1], 10) || 0 //input amount should be in bits
var feeSatoshis = 10000 //100 bits

var key = new CoinKey.fromWif(walletData.privateKey)

stdinToString(function(err, input) {
  if (err) return console.error(err)

  var unspents = JSON.parse(input)
  var walletBalance = unspents.reduce(function(amount, unspent) { 
    return unspent.value + amount
  }, 0)

  if (amountSatoshis > (walletBalance - feeSatoshis))
    return console.error('\n  %s  \n', chalk.red.bold('Not enough money to send.'))

  var tx = new Transaction()

  unspents.forEach(function(unspent) {
    tx.addInput(unspent.txHash, unspent.index)
  })

  //user didn't enter any amount, send all of it
  if (amountSatoshis === 0)
    amountSatoshis = walletBalance - feeSatoshis
      
  tx.addOutput(txUtils.addressToOutputScript(receiverAddress), amountSatoshis)

  //only receive change if there is actually change to receive
  if (walletBalance - amountSatoshis - feeSatoshis > 0)
    tx.addOutput(txUtils.addressToOutputScript(walletData.address), walletBalance - amountSatoshis - feeSatoshis)

  tx.ins.forEach(function(input, index) {
    txUtils.sign(tx, index, key)
  })

  console.log(tx.toHex())
})
