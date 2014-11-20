#!/usr/bin/env node

/*
  usage: 
    
    ./send.js <address> [amount_in_bits]

 
  note: if amount isn't specified, it will send the entire amount
*/

var path = require('path')
var spawn = require('child_process').spawn

var unspentsScript = spawn(path.join(__dirname, './addr-unspents.js'))
var txMakeScript = spawn(path.join(__dirname, './tx-make.js'), process.argv.slice(2))
var txSendScript = spawn(path.join(__dirname, './tx-send.js'))

unspentsScript.stdout.pipe(txMakeScript.stdin)
txMakeScript.stdout.pipe(txSendScript.stdin)
txSendScript.stdout.pipe(process.stdout)
