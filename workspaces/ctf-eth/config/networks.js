
// deployed contracts:
const networks = {
  42: {
    name: "Kovan",
    etherscan: 'https://kovan.etherscan.io/address/',

    paymaster: '0xC2171626e3d2Fc5F7Ac71567124AA9adB575a169', // 2.2.0-rc.1
//    paymaster: '0x083082b7Eada37dbD8f263050570B31448E61c94', // 2.0.0
    ctf: '0xbca9a2dd9b9fc1c04bb69ed8a18ecceb10fb3c1b' //2.2
//    ctf: '0x22d1300304Ea3B658f0a6e925dd62bcfcDd91ce4' //2.0
  },
  3: {
    name: "Ropsten",
    etherscan: 'https://ropsten.etherscan.io/address/',
    paymaster: '0x8057c0fb7089BB646f824fF4A4f5a18A8d978ecC',
    ctf: '0x5B3403F215799E3Af100BDCB37f3Fd925aD80f76'
  },
  4: {
    name: "Rinkeby",
    etherscan: 'https://rinkeby.etherscan.io/address/',
    paymaster: '0x9D0780a594187d1756731743528C63dCc82F2367',
    ctf: '0xFc02Aab24E7A3f7c184bbF795d87b9C9fF6F6f7e'
  },
  5: {
    name: "Goerli",
    etherscan: 'https://goerli.etherscan.io/address/',
    paymaster: '0x50d2b611CC85308CeEecd7a43D00168b97B71F9A',
    ctf: '0xEDdafFdb235dDB9A6189FbFEb9A572B65d6BB187'
  },
  6: {
    name: "Kotti",
    etherscan: "https://blockscout.com/etc/kotti/address/",
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
    name: "Binance Testnet",
    etherscan: "https://testnet.bscscan.com/address/",
    paymaster: "0x30c42A5F0099f67c6d9036a61FED44C823B7CC83",
    ctf: "0xCF8033797367D6d2690D2c8380ADCD55C83D1b8d"
  },
  0x38: {
    name: "Binance Smart Chain",
    etherscan: "https://bscscan.com/address/",
    paymaster: "0x407a5823F83159FaC2bE7a5228fbC1Ee140FEdfD",
    ctf: "0x70B79568Bb07ddC5193eD4c6316d51Cd3f42773f"
  },
  100: {
    name: "xDai",
    etherscan: "https://blockscout.com/poa/xdai/address/",
    paymaster: "0x52f882D1c431D0eD98e73dE198Fb0eeA3adfcf10", //2.2
    ctf: "0xD76DE551E287B413c8095CfF3198C831ae1D43Ba" //2.2
  }

}

module.exports={networks}
