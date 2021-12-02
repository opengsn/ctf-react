
interface NetworkType {
  name: string
  etherscan?: string
  paymaster: string
  ctf: string
  relayLookupWindowBlocks?: number,
  relayRegistrationLookupBlocks?: number
}

let localnetwork: NetworkType = {} as any
try {
  console.log('==reading localnet dir=', __dirname)
  localnetwork = {
    name: 'local',
    paymaster: require('../../build/gsn/Paymaster.json').address,
    ctf: require('../../deployments/development/CaptureTheFlag.json').address
  }
} catch (e) {
  console.warn('No local network:', e.message)
}

export const networks: { [chain: number]: NetworkType } = {
  1: {
    name: 'Ethereum Mainnet',
    etherscan: 'https://etherscan.io/address/',
    paymaster: '0x0886067579BA2AcEA3d3A1d12a5CB85af76ba526',
    ctf: '0x2b139777178Dc11516D3446367F5Bef96AB29941'
  },
  3: {
    name: 'Ropsten',
    etherscan: 'https://ropsten.etherscan.io/address/',
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
  61: {
    name: 'Ethereum Classic',
    etherscan: 'https://blockscout.com/etc/mainnet/address/',
    paymaster: '0xB178ec1B785e02A94D6CB1704437A41D25BbB2ce',
    ctf: '0xBfCB3c7FF9B3DE0e0F673818309BfB73ec27bB9F'
  },

  100: {
    name: 'xDai',
    etherscan: 'https://blockscout.com/poa/xdai/address/',
    paymaster: '0x9e59Ea5333cD4f402dAc320a04fafA023fe3810D', //2.2
    ctf: '0xAa3E82b4c4093b4bA13Cb5714382C99ADBf750cA' //2.2
  },

  0x61: {
    name: 'Binance Testnet',
    etherscan: 'https://testnet.bscscan.com/address/',
    paymaster: '0x01a5a06C5Ba6E5f8FC9CB060492fae1b3d03c69d',
    ctf: '0x05319d82fa69EA8434A967CdF4A2699Db4Ff40e8',
    relayLookupWindowBlocks: 4990,
    relayRegistrationLookupBlocks: 4990
  },

  56: {
    name: 'Binance Smart Chain',
    etherscan: 'https://bscscan.com/address/',
    paymaster: '0x01a5a06C5Ba6E5f8FC9CB060492fae1b3d03c69d',
    ctf: '0xD8Cf3315FFD1A3ec74Dc2B02908AF60e5E330472',
    relayLookupWindowBlocks: 4990,
    relayRegistrationLookupBlocks: 4990
  },

  42: {
    name: 'kovan',
    etherscan: 'https://kovan.etherscan.io/address/',
    paymaster: '0xdA78a11FD57aF7be2eDD804840eA7f4c2A38801d', //2.2
    ctf: '0x0aDF62f267206ff6EAD3d93f4d421f86b51C6B7D', //2.2
    relayLookupWindowBlocks: 9007199254740991,
    relayRegistrationLookupBlocks: 9007199254740991
  },

  137: {
    name: 'matic',
    etherscan: 'https://explorer-mainnet.maticvigil.com/address/',
    paymaster: '0x9d47218ce8b8F123Efbb1Db3E0DdBe6490Cf77E1', //2.2
    ctf: '0x7c3caB8e0E89dc268300e302c2b3Fd1f5210fB45', //2.2
    relayLookupWindowBlocks: 990,
    relayRegistrationLookupBlocks: 990
  },

  1337: localnetwork
}

