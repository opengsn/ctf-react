
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
  5: {
    name: 'Goerli',
    etherscan: 'https://goerli.etherscan.io/address/',
    paymaster: '0x32958b9199974Ec0715D1DBBd152B7e6C8373fC6',
    ctf: '0xE03E44D8bCeAfa79cD79208322135B014b7063b5'
  },
  69: {
    name: 'Optimism kovan',
    etherscan: 'https://kovan-optimistic.etherscan.io/address/',
    paymaster: "0x255fc98fE2C2564CF361E6dCD233862f884826E5",
    ctf: '0x57104d907A75FbF222639a7D47ED4396dCE02a96'
  },
  80001: {
    name: 'Mumbai',
    etherscan: 'https://explorer-mumbai.maticvigil.com/address/',
    paymaster: "0xb4Bbb5e968e278C6541addBC24b903712746f102",
    ctf: '0x43a4c7fbf4ee9ba0b9156b7c39ded8921db300a4'
  },
  43113: {
    name: 'Fuji (Avalanche Testnet)',
    etherscan: 'https://testnet.snowtrace.io/address/',
    paymaster: '0xcA94aBEdcC18A10521aB7273B3F3D5ED28Cf7B8A',
    ctf: '0x5Aa3c9e8a62C35E656C1CC601aa91107800278FC'
  },
  /* old deployments - not 3.0 alpha 2...
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
    name: 'Rinkeby - eywa relayer',
    etherscan: 'https://rinkeby.etherscan.io/address/',
//TEMP 
    paymaster: '0x972Ed0F36cEc3c792D46Ef7158FA7138D88e195C',
//    pastEventsQueryMaxPageSize: 2e4,
//    relayLookupWindowBlocks: 1e5,
//    relayRegistrationLookupBlocks: 1e5,
    ctf: '0xD2E87f2532bC175DA4700072cA4a5cfE66b833fA'
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

  69: {
    name: 'Optimism kovan',
    etherscan: 'https://kovan-optimistic.etherscan.io/address/',
    paymaster: '0x6B43C92C4661c8555D5D060144457D9bF0fD0D34', //2.2
    ctf: '0xE7cca55311516c05e5E28EBcec5e231c922d4298' //2.2
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

//alpha 1
  421611: {
    name: 'Arbitrum-Rinkeby',
    etherscan: 'https://testnet.arbiscan.io/address/',
    paymaster: '0x6D9282ED66d3DDDe461f8a59A574767bA1e77044',
    ctf: '0x1B9F8a3612f4ED01c8E7D2DC7ea270eB0Ea6b6E8', 
    relayLookupWindowBlocks: 99000,
    relayRegistrationLookupBlocks: 99000
  },
  200: {
    name: 'Arbitrum-xDai',
    etherscan: 'https://blockscout.com/xdai/aox/address/',
    paymaster: '0x255fc98fE2C2564CF361E6dCD233862f884826E5',
    ctf: '0x762745B16190F68F4eBD30EA159526FEA13d15a9', 
    relayLookupWindowBlocks: 99000,
    relayRegistrationLookupBlocks: 99000
  },
  42: {
    name: 'kovan',
    etherscan: 'https://kovan.etherscan.io/address/',
    paymaster: '0xB997D12580ddBAf6d193E361f4C7a0A918743B6d', //3-alpha2
    ctf: '0x8c956d2104D7B8483572b02A945230E0dEF90cc9', //3-alpha2
  },
  421611: {
    name: 'Arbitrum-Rinkeby',
    etherscan: 'https://testnet.arbiscan.io/address/',
    paymaster: '0x745daDe3c11b80806180953d32f75B2B8b96BDa9',
    ctf: '0x741940C70E23402ea897678E1bAF8C044BDB8c0D', 
  },
  200: {
    name: 'Arbitrum-xDai',
    etherscan: 'https://blockscout.com/xdai/aox/address/',
    paymaster: '0x255fc98fE2C2564CF361E6dCD233862f884826E5',
    ctf: '0x762745B16190F68F4eBD30EA159526FEA13d15a9', 
    relayLookupWindowBlocks: 99000,
    relayRegistrationLookupBlocks: 99000
  },
  42: {
    name: 'kovan',
    etherscan: 'https://kovan.etherscan.io/address/',
    paymaster: '0x432c8e88294e1c64bF590D092130C82545639894', //3-alpha3
    ctf: '0x47EBb6Ed7DC0dea307BB5635785cE626Fa2290f7', //3-alpha3
  },
  
  421611: {
    name: 'Arbitrum-Rinkeby',
    etherscan: 'https://testnet.arbiscan.io/address/',
    paymaster: '0x077ed681eB435B355eed95903021740e9C35a7Ed',
    ctf: '0x077ed681eB435B355eed95903021740e9C35a7Ed', 
  },
  200: {
    name: 'Arbitrum-xDai',
    etherscan: 'https://blockscout.com/xdai/aox/address/',
    paymaster: '0xc94634441D0F04ab5624CeBd6eF2A96a66202BAD',
    ctf: '0xcA94aBEdcC18A10521aB7273B3F3D5ED28Cf7B8A',
  },

*/

  1337: localnetwork
}

