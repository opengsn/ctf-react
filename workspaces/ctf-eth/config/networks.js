fs = require('fs')

let localnetwork = {}
try {
  localnetwork = {
    paymaster: JSON.parse(fs.readFileSync('../build/gsn/Paymaster.json')).address,
    ctf: JSON.parse(require('../deployments/localhost/CaptureTheFlag.json')).address
  }
} catch (e) {
  console.warn('No local network:', e.message)
}

//new deployment only on rinkeby, for now.
const networks = {
  1: {
    name: 'Ethereum Mainnet',
    etherscan: 'https://etherscan.io/address/',
    paymaster: '0x0886067579BA2AcEA3d3A1d12a5CB85af76ba526',
    ctf: '0x2b139777178Dc11516D3446367F5Bef96AB29941'
  },
  3: {
    name: 'Ropsten',
    etherscan: 'https://ropsten.etherscan.io/address/',
    // paymaster: '0x246aC46ad7ee41A1Ba87DbF9Dd0592E8a20951D9',
    // ctf: '0xcA04Ac9e60A76390936A1f4d4E10F0c9103DAb7d'
    paymaster: '0x05319d82fa69EA8434A967CdF4A2699Db4Ff40e8', //single-recipient
    ctf: '0xd4b5f1C12B46447693Ae5ec05880fFd117277D12'
  },
  4: {
    name: 'Rinkeby',
    etherscan: 'https://rinkeby.etherscan.io/address/',
    paymaster: '0xA6e10aA9B038c9Cddea24D2ae77eC3cE38a0c016',
    ctf: '0xD2E87f2532bC175DA4700072cA4a5cfE66b833fA'
  },

  80001: {
    name: 'Mumbai',
    etherscan: 'https://explorer-mumbai.maticvigil.com/address/',
    paymaster: '0xcA94aBEdcC18A10521aB7273B3F3D5ED28Cf7B8A',
    ctf: '0xB8308F78A8f56a0A57882Cd8b523F4580e58b7c7'
  },

  6: {
    name: 'Kotti',
    etherscan: 'https://blockscout.com/etc/kotti/address/',
    paymaster: '0x41ddb318BB35cA0aD54b52f5b1708ff860161dCc',
    ctf: '0x62a7cD077A18d05083410cd676c3b728ae9afb93'
  },

  100: {
    name: 'xDai',
    etherscan: 'https://blockscout.com/poa/xdai/address/',
    paymaster: '0x9e59Ea5333cD4f402dAc320a04fafA023fe3810D', //2.2
    ctf: '0xAa3E82b4c4093b4bA13Cb5714382C99ADBf750cA' //2.2
  },


  100: {
    name: 'xDai',
    etherscan: 'https://testnet.bscscan.com/address',
    paymaster: '0x01a5a06C5Ba6E5f8FC9CB060492fae1b3d03c69d', //2.2
    ctf: '0x05319d82fa69EA8434A967CdF4A2699Db4Ff40e8' //2.2
  },

  0x61: {
    name: 'Binance Testnet',
    etherscan: 'https://testnet.bscscan.com/address/',
    paymaster: '0x01a5a06C5Ba6E5f8FC9CB060492fae1b3d03c69d',
    ctf: '0x05319d82fa69EA8434A967CdF4A2699Db4Ff40e8'
  },

  1337: localnetwork
}

const oldnetworks = {
  42: {
    name: 'Kovan',
    etherscan: 'https://kovan.etherscan.io/address/',

    paymaster: '0xC2171626e3d2Fc5F7Ac71567124AA9adB575a169', // 2.2.0-rc.1
//    paymaster: '0x083082b7Eada37dbD8f263050570B31448E61c94', // 2.0.0
    ctf: '0xbca9a2dd9b9fc1c04bb69ed8a18ecceb10fb3c1b' //2.2
//    ctf: '0x22d1300304Ea3B658f0a6e925dd62bcfcDd91ce4' //2.0
  },
  4: {
    name: 'Rinkeby',
    etherscan: 'https://rinkeby.etherscan.io/address/',
//depl:
    paymaster: '0x82758f9D6853C2087832aCdcAa641Ed527891310',
    ctf: '0xD2E87f2532bC175DA4700072cA4a5cfE66b833fA'
  },
  5: {
    name: 'Goerli',
    etherscan: 'https://goerli.etherscan.io/address/',
    paymaster: '0x50d2b611CC85308CeEecd7a43D00168b97B71F9A',
    ctf: '0xEDdafFdb235dDB9A6189FbFEb9A572B65d6BB187'
  },
  6: {
    name: 'Kotti',
    etherscan: 'https://blockscout.com/etc/kotti/address/',
    paymaster: '0x9AE9FC73A7ad54004D7eEA2817787684FBE52433',
    ctf: '0x7f5437b27478791642AE95Ce38b123b0107e0cEc'
  },
  61: {
    name: 'Ethereum Classic',
    etherscan: 'https://blockscout.com/etc/mainnet/address/',
    paymaster: '0x4F73b876D90064aC05389713504Dd7E685F7BFdF',
    ctf: '0x15fEdA2926c126047B131602543FEf6140fe87F0'
  },
  0x61: {
    name: 'Binance Testnet',
    etherscan: 'https://testnet.bscscan.com/address/',
    paymaster: '0x30c42A5F0099f67c6d9036a61FED44C823B7CC83',
    ctf: '0xCF8033797367D6d2690D2c8380ADCD55C83D1b8d'
  },
  0x38: {
    name: 'Binance Smart Chain',
    etherscan: 'https://bscscan.com/address/',
    paymaster: '0x407a5823F83159FaC2bE7a5228fbC1Ee140FEdfD',
    ctf: '0x70B79568Bb07ddC5193eD4c6316d51Cd3f42773f'
  },
}

module.exports = { networks }
