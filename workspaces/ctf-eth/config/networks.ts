
interface NetworkType {
  name: string
  etherscan?: string
  paymaster: string
  ctf: string
  relayLookupWindowBlocks?: number,
  relayRegistrationLookupBlocks?: number
  pastEventsQueryMaxPageSize?: number
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
  console.warn('No local network:', (e as Error).message)
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
    pastEventsQueryMaxPageSize: 2e4,
    relayLookupWindowBlocks: 1e5,
    relayRegistrationLookupBlocks: 1e5,
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

  69: {
    name: 'Optimism kovan',
    etherscan: 'https://kovan-optimistic.etherscan.io/address/',
    paymaster: '0x6B43C92C4661c8555D5D060144457D9bF0fD0D34', //2.2
    ctf: '0xE7cca55311516c05e5E28EBcec5e231c922d4298', //2.2
    pastEventsQueryMaxPageSize: 5e7,
    relayRegistrationLookupBlocks: 5e9,
    relayLookupWindowBlocks: 5e9
  },

  300: {
    name: 'Optimism GC',
    etherscan: 'https://blockscout.com/xdai/optimism/address/',
    paymaster: '0x28E036dB9727a9d5ee9373DBAAe14B422D83a017', //2.2
    ctf: '0x39A2431c3256028a07198D2D27FD120a1f81ecae' //2.2
  },

  10: {
    name: 'Optimism',
    etherscan: 'https://optimistic.etherscan.io/address/',
    paymaster: '0x28E036dB9727a9d5ee9373DBAAe14B422D83a017',
    ctf: '0x6C28AfC105e65782D9Ea6F2cA68df84C9e7d750d',
    pastEventsQueryMaxPageSize: 9900,
    relayRegistrationLookupBlocks: 250000,
    relayLookupWindowBlocks: 250000
  },

  137: {
    name: 'matic',
    etherscan: 'https://explorer-mainnet.maticvigil.com/address/',
    paymaster: '0x9d47218ce8b8F123Efbb1Db3E0DdBe6490Cf77E1', //2.2
    ctf: '0x7c3caB8e0E89dc268300e302c2b3Fd1f5210fB45', //2.2
    relayLookupWindowBlocks: 990,
    relayRegistrationLookupBlocks: 990
  },

  43114: {
    name: 'Avalache',
    etherscan: 'https://snowtrace.io/address/',
    paymaster: '0x10E207898E76137bb27b31609a275b0635080632',
    ctf: '0x8fD27A87a126b22a5D7EC02794CAd873e1D58Ba4',
    pastEventsQueryMaxPageSize: 2000,
    relayLookupWindowBlocks: 4000,
    relayRegistrationLookupBlocks: 4000
  },
  43113: {
    name: 'Avalache Testnet(fuji)',
    etherscan: 'https://testnet.snowtrace.io/address/',
    paymaster: '0x9552C037217B46398B1c928e0e5b086C5f5F4aB3',
    ctf: '0xBb3BD33eA522dc7eDb151508F3699fa91F5FA5C9',
    pastEventsQueryMaxPageSize: 2000,
    relayLookupWindowBlocks: 4000,
    relayRegistrationLookupBlocks: 4000
  },

  1337: localnetwork
}

