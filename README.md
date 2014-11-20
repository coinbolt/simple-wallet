Simple Bitcoin Test Wallet
==========================

This is a simple Bitcoin testnet wallet with the purpose of teaching new users to Bitcoin how to program for Bitcoin with JavaScript. It assumes that you have some programming experience - JavaScript experience would be even better.

It's assumed that you have [Node.js](http://nodejs.org/download/) and [git](http://git-scm.com/downloads) git installed.


Before We Start
---------------

Understand the following...

### Windows Users

At the moment, the programs are take advantage of Unix shell scripting. This will change eventually, but to get the programs ot run on Windows, you'll need to remove the first line (`#!/usr/bin/env node`) in all files in `bin/`. Then you'll need to run the script with the actual node binary. e.g.

instead of 

    bin/addr-balance.js

you'd do

    node bin/addr-balance.js


### Testnet

It uses the [Bitcoin test network](https://en.bitcoin.it/wiki/Testnet). So actual bitcoins aren't necessary. 


### Catshop

You can use the [Coinbolt Catshop](https://www.coinbolt.com/catshop/) to test buying things with Bitcoin. It is an open source as well: https://github.com/coinbolt/catshop


### Helloblock.io

These scripts all use https://helloblock.io to communicate with the Bitcoin network. You should use it too.


Step #1: Clone Repo
-------------------

Shallow clone the repository. This will include all dependencies.

    git clone git@github.com:coinbolt/simple-wallet.git --depth 1


Navigate to `simple-wallet` directory.



Step #2: Create New Wallet
--------------------------

This will create a new wallet with just one and only one address. This is a bad idea in practice for two reasons:

1. your public key is exposed and could potentially lend itself to an attack (unlikely, but still possible)
2. sacrifice of privacy 

But for the sake of learning, it simplifies things.

    bin/addr-new.js


You'll see an output that resembles:

```

  wallet created with address:

    mvfeyJyxtX4CZEfpxp8tYZ4BRtzaTPbXbb

```

A new wallet file was created. It exists at `simple-wallet/wallet.json`. 

To really understand what's going on, you should read this: http://procbits.com/2013/08/27/generating-a-bitcoin-address-with-javascript The aforementioned tutorial uses an older version of bitcoinjs-lib but it's included on the page so that you can open a chrome or firefox console and follow along.



Step #3: Check Your Balance
---------------------------

    bin/addr-balance.js

output:

```

  balance for mvfeyJyxtX4CZEfpxp8tYZ4BRtzaTPbXbb

    0.00 BITS

```

You'll want to add some funds. But how? Use either:

1. http://faucet.xeno-genesis.com/
2. http://tpfaucet.appspot.com/

Paste in your address into one of those sites and deposit some funds. Then check your balance:

    bin/addr-balance.js

output:

```

  balance for mvfeyJyxtX4CZEfpxp8tYZ4BRtzaTPbXbb

    100,000.00 BITS

```


Step #4: Transactions and Sending Funds
---------------------------------------

Bitcoin transactions are simply a data structure that links inputs (from previous transactions) and outputs which are scripts that should do something. In most cases, said scripts involve transfering of ownership of the bitcoin.

To create a transaction, you must get what's referred to as the unspent outputs associated with your address:

    bin/unspents.js

output:

```
[
  {
    "confirmations": 4,
    "blockHeight": 309400,
    "txHash": "c65222345cb941d76e29ecf8a44c35be0f6a3e4396f008ca3ace978e4e19eb20",
    "index": 0,
    "scriptPubKey": "76a914a62f2b75f54f9f65c276c6dfacb365726f6dd42188ac",
    "type": "pubkeyhash",
    "value": 10000000,
    "hash160": "a62f2b75f54f9f65c276c6dfacb365726f6dd421",
    "address": "mvfeyJyxtX4CZEfpxp8tYZ4BRtzaTPbXbb"
  }
]
```

This output describes the input transactions to this current address.

Then you must create and sign the transaction (you need to pipe in the output from `addr-unspents`):

    bin/addr-unspents.js | bin/tx-make.js mmncSwJoFvTe1WZVM4QQtTguosepHvtdGG 2500

the program `tx-make.js` requires that the first **mandatory** command line argument be the destination address and the second **optional** argument be the amount in bits to send. If no amount is specified, the entire wallet balance is sent. Since we're dealing with test coins, it's not a big deal.

output:

```
010000000120eb194e8e97ce3aca08f096433e6a0fbe354ca4f8ec296ed741b95c342252c6000000006a473044022073fdaa1b45bc24a92da95ff28515a970888fbfc8924f3fe949a6fc2ed8fe3637022005f8305f28ab0834eaea787c0d9266156a619907482154bfff3a4b8c9c597971012102006f39d9a3938e9e151e0b5ca72226113d9d5c912c1667f5d258e187171d6f5effffffff0290d00300000000001976a91444c6d7c083cb9bf85c206f2fe2a6093af8a2b50b88ace09e9400000000001976a914a62f2b75f54f9f65c276c6dfacb365726f6dd42188ac00000000
```

This output is the hex encoded version of the transaction. You could copy and paste it to manually submit it to either: https://test.helloblock.io/propagate or http://tbtc.blockr.io/tx/push

or, you can use `tx-send.js`:

    bin/addr-unspents.js | bin/tx-make.js mmncSwJoFvTe1WZVM4QQtTguosepHvtdGG 2500 | bin/tx-send.js    

output:

```

  success!

    tx id: ef92d8f909319780e0bb347c4be2ba34dbbd5e751ceaca1a453932103aa09435

```

You can then use this transaction id to find out more information using other APIs or the API explorers e.g. http://tbtc.blockr.io/tx/info/ef92d8f909319780e0bb347c4be2ba34dbbd5e751ceaca1a453932103aa09435 or https://test.helloblock.io/transactions/ef92d8f909319780e0bb347c4be2ba34dbbd5e751ceaca1a453932103aa09435

Now check your balance again:

    bin/addr-balance.js

```

  balance for mvfeyJyxtX4CZEfpxp8tYZ4BRtzaTPbXbb

    97,400.00 BITS

```

(note 100 BITS were taken as a fee for miners)

You could skip all of the piping and just use the `send.js` program as well:

    bin/send.js mmncSwJoFvTe1WZVM4QQtTguosepHvtdGG 2500


Additional resources on transactions:

- https://curiosity-driven.org/low-level-bitcoin (uses JavaScript, excellent tutorial)
- http://www.righto.com/2014/02/bitcoins-hard-way-using-raw-bitcoin.html 
- http://www.michaelnielsen.org/ddi/how-the-bitcoin-protocol-actually-works/ (this actually on mining, but worth reading)


