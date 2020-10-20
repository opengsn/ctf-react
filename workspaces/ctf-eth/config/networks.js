
// deployed contracts:
const networks = [
  {
    name: "Kovan",
    chainId: 42,
    explorerAddr: "https://kovan.etherscan.io/address/",
    explorerTx: "https://kovan.etherscan.io/tx/",
    paymaster: '0x083082b7Eada37dbD8f263050570B31448E61c94',
    ctf: '0x22d1300304Ea3B658f0a6e925dd62bcfcDd91ce4'
  },
  {
    name: "Ropsten",
    chainId: 3,
    explorerAddr: "https://ropsten.etherscan.io/address/",
    explorerTx: "https://ropsten.etherscan.io/tx/",
    paymaster: '0x8057c0fb7089BB646f824fF4A4f5a18A8d978ecC',
    ctf: '0x5B3403F215799E3Af100BDCB37f3Fd925aD80f76'
  },
  {
    name: "Rinkeby",
    chainId: 4,
    explorerAddr: "https://rinkeby.etherscan.io/address/",
    explorerTx: "https://rinkeby.etherscan.io/tx/",
    paymaster: '0x43d66E6Dce20264F6511A0e8EEa3f570980341a2',
    ctf: '0x7A2014c282ffb3Dc968dE52Db21f80A9e0A5e981'
  },
  {
    name: "Goerli",
    chainId: 5,
    explorerAddr: "https://goerli.etherscan.io/address/",
    explorerTx: "https://goerli.etherscan.io/tx/",
    paymaster: '0x50d2b611CC85308CeEecd7a43D00168b97B71F9A',
    ctf: '0xEDdafFdb235dDB9A6189FbFEb9A572B65d6BB187'
  },
  {
    name: "Kotti",
    chainId: 6,
    explorerAddr: "https://blockscout.com/etc/kotti/address/",
    explorerTx: "https://blockscout.com/etc/kotti/tx/",
    paymaster: '0x9AE9FC73A7ad54004D7eEA2817787684FBE52433',
    ctf: '0x7f5437b27478791642AE95Ce38b123b0107e0cEc'
  }
]

module.exports = {networks}
