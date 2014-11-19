#!/usr/bin/env node

var fs = require('fs-extra')
var request = require('superagent')
var path = require('path')
var util = require('util')

var walletData = fs.readJsonSync(path.join(__dirname, '../wallet.json'))
var url = util.format('https://testnet.helloblock.io/v1/addresses/%s/unspents?limit=100', walletData.address)

request.get(url).end(function(res) {
  console.log(JSON.stringify(res.body.data.unspents, null, 2))
})