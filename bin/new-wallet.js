#!/usr/bin/env node

var chalk = require('chalk')
var coinInfo = require('coininfo') //http://cryptocoinjs.com/modules/currency/coininfo/
var CoinKey = require('coinkey') //http://cryptocoinjs.com/modules/currency/coinkey/
var fs = require('fs-extra')
var secureRandom = require('secure-random') //https://github.com/jprichardson/secure-random

//256 bit random number
var rn = secureRandom.randomBuffer(32)

var key = new CoinKey(rn, coinInfo('BTC-TEST').versions)

var data = {
  privateKey: key.privateWif,
  address: key.publicAddress
}

fs.writeJsonSync('./wallet.json', data)

console.log('')
console.log(chalk.bold('  wallet created with address:'))
console.log('')
console.log('    %s', chalk.magenta(data.address))
console.log('')



