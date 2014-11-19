#!/usr/bin/env node

var chalk = require('chalk')
var fs = require('fs-extra')
var request = require('superagent')
var util = require('util')

var data = fs.readJsonSync('./wallet.json')
var url = util.format('https://testnet.helloblock.io/v1/addresses/%s/unspents?limit=100', data.address)

request.get(url).end(function(res) {
  console.dir(res.body.data.unspents)
})