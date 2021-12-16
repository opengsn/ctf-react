require('@nomiclabs/hardhat-waffle')
require('hardhat-deploy')
const fs = require('fs')

let accounts

let mnemonicFile = process.env.MNEMONIC_FILE
if (mnemonicFile) {
  console.log('using MNEMONIC_FILE', mnemonicFile)
  mnemonic = fs.readFileSync(mnemonicFile, 'utf-8')
  accounts = { mnemonic }
}


// This is a sample Buidler task. To learn how to create your own go to
// https://buidler.dev/guides/create-task.html
task('accounts', 'Prints the list of accounts', async () => {
  const accounts = await ethers.getSigners()

  for (const account of accounts) {
    console.log(await account.getAddress())
  }
})

infura = process.env.INFURA_ID

// You have to export an object to set up your config
// This object can have the following optional entries:
// defaultNetwork, networks, solc, and paths.
// Go to https://buidler.dev/config/ to learn more
module.exports = {
  solidity: "0.7.6",
  defaultNetwork: 'development',
  networks: {
    development: {
      url: 'http://localhost:8545'
    },
    fork: {
      url: 'http://localhost:8545',
      accounts
    },
    mainnet: {
      url: `https://mainnet.infura.io/v3/${infura}`,
      accounts
    },
    rinkeby: {
      url: `https://rinkeby.infura.io/v3/${infura}`,
      accounts
    },
    kovan: {
      url: `https://kovan.infura.io/v3/${infura}`,
      accounts
    },
    ropsten: {
      url: `https://ropsten.infura.io/v3/${infura}`,
      accounts
    },
    mumbai: {
      url: `https://matic-mumbai.chainstacklabs.com`,
      accounts
    },
    etc: {
      url: `https://etc.connect.bloq.cloud/v1/roast-blossom-sentence`,
      accounts
    },
    matic: {
      url: `https://rpc-mainnet.maticvigil.com/`,
      accounts
    },
    kotti: {
      url: `https://kotti.connect.bloq.cloud/v1/roast-blossom-sentence`,
      accounts
    },
    xdai: {
      url: `https://dai.poa.network/`,
      accounts
    },
    testbsc: {
      url: `https://data-seed-prebsc-1-s1.binance.org:8545`,
      accounts
    },
    bsc: {
      url: `https://bsc-dataseed.binance.org/`,
      accounts
    },
    optimism_kovan: {
      url: `https://kovan.optimism.io`,
      accounts
    },
    optimism: {
      url: `https://mainnet.optimism.io`,
      accounts
    }

  },

  namedAccounts: {
    deployer: { default: 0 },
    metamask: '0xd21934eD8eAf27a67f0A70042Af50A1D6d195E81',

    //official addresses from https://docs.opengsn.org/networks
    forwarder: {
      1: '0xAa3E82b4c4093b4bA13Cb5714382C99ADBf750cA',
      3: '0xeB230bF62267E94e657b5cbE74bdcea78EB3a5AB',
      4: '0x83A54884bE4657706785D7309cf46B58FE5f6e8a',
      80001: '0x4d4581c01A457925410cd3877d17b2fd4553b2C5',
      6: '0x255fc98fE2C2564CF361E6dCD233862f884826E5',
      61: '0x0DEEF5a1e5bF8794A5145e052E24A852a081AF65',
      100: '0x7eEae829DF28F9Ce522274D5771A6Be91d00E5ED',
      42: '0x7eEae829DF28F9Ce522274D5771A6Be91d00E5ED',
      97: '0xeB230bF62267E94e657b5cbE74bdcea78EB3a5AB',
      56: '0xeB230bF62267E94e657b5cbE74bdcea78EB3a5AB',
      137: '0xdA78a11FD57aF7be2eDD804840eA7f4c2A38801d',
      69: '0x39A2431c3256028a07198D2D27FD120a1f81ecae',
      10: '0x67097a676FCb14dc0Ff337D0D1F564649aD94715'
    }
  }
}
