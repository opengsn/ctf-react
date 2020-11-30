
// deployed contracts:
const networks = {
  42: {
    name: "Kovan",
    etherscan: 'https://kovan.etherscan.io/address/',
    paymaster: '0x083082b7Eada37dbD8f263050570B31448E61c94',
    ctf: '0x22d1300304Ea3B658f0a6e925dd62bcfcDd91ce4'
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
    paymaster: '0x43d66E6Dce20264F6511A0e8EEa3f570980341a2',
    ctf: '0x7A2014c282ffb3Dc968dE52Db21f80A9e0A5e981'
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
  }
}

module.exports={networks}
