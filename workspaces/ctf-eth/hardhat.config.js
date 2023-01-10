require('@nomiclabs/hardhat-waffle')
require('hardhat-deploy')

const fs = require('fs')

let accounts

const mnemonicFile = process.env.MNEMONIC_FILE
if (mnemonicFile) {
  console.log('using MNEMONIC_FILE', mnemonicFile)
  const mnemonic = fs.readFileSync(mnemonicFile, 'utf-8')
  accounts = { mnemonic }
}

// This is a sample Buidler task. To learn how to create your own go to
// https://buidler.dev/guides/create-task.html
// eslint-disable-next-line no-undef
task('accounts', 'Prints the list of accounts', async () => {
  // eslint-disable-next-line no-undef
  const accounts = await ethers.getSigners()

  for (const account of accounts) {
    console.log(await account.getAddress())
  }
})

const infura = process.env.INFURA_ID

// You have to export an object to set up your config
// This object can have the following optional entries:
// defaultNetwork, networks, solc, and paths.
// Go to https://buidler.dev/config/ to learn more
module.exports = {
  solidity: '0.8.12',
  defaultNetwork: 'development',
  networks: {
    hardhat: {
      chainId: 1337
    },
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
    goerli: {
      url: `https://goerli.infura.io/v3/${infura}`,
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
      url: 'https://polygon-mumbai.infura.io/v3/2461e2a5b1914b508c16cdb31d0225bf',
      accounts
    },
    etc: {
      url: 'https://etc.connect.bloq.cloud/v1/roast-blossom-sentence',
      accounts
    },
    matic: {
      url: 'https://rpc-mainnet.maticvigil.com/',
      accounts
    },
    kotti: {
      url: 'https://kotti.connect.bloq.cloud/v1/roast-blossom-sentence',
      accounts
    },
    xdai: {
      url: 'https://dai.poa.network/',
      accounts
    },
    testbsc: {
      url: 'https://data-seed-prebsc-1-s1.binance.org:8545',
      accounts
    },
    bsc: {
      url: 'https://bsc-dataseed.binance.org/',
      accounts
    },
    optimism_kovan: {
      url: 'https://kovan.optimism.io',
      accounts
    },
    optimism: {
      url: 'https://mainnet.optimism.io',
      accounts
    },
    fuji: {
      url: 'https://api.avax-test.network/ext/bc/C/rpc',
      accounts
    },
    gopt: {
      url: 'https://goerli.optimism.io/',
      accounts
    },
    bsctestnet: { accounts, url: 'https://bsc-testnet.public.blastapi.io' },
    aox: { accounts, url: 'https://arbitrum.xdaichain.com/' },
    garb: { accounts, url: 'https://goerli-rollup.arbitrum.io/rpc' },
    arbitrum: { accounts, url: 'https://arb1.arbitrum.io/rpc' },
    gnosis: { accounts, url: 'https://rpc.gnosis.gateway.fm' },
    polygon: { accounts, url: 'https://rpc-mainnet.maticvigil.com', gasPrice: 137577028731 }

  },
  namedAccounts: {
    deployer: { default: 0 }
  }
}
