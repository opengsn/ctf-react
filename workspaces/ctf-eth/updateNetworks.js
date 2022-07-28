// create the config/networksMetaInfo from the global chainlist file.
// we only need title, explorer.

const chainListUrl = 'https://chainid.network/chains.json'

const ctfDeployments = require('./config/ctf-networks.json')
const axios = require('axios');

(async () => {
  try {
    const chainsResult = await axios.get(chainListUrl)
    const chains = chainsResult.data

    const config = Object.keys(ctfDeployments).reduce((set, chain) => {
      const chainInfo = chains.find(c => c.chainId.toString() === chain)
      if (chainInfo == null) {
        throw new Error('Unable to find network info for deployed network ' + chain)
      }
      return {
        ...set,
        [chain]: {
          name: chainInfo.name,
          currency: chainInfo.nativeCurrency.symbol,
          explorer: chainInfo.explorers?.[0].url
        }
      }
    }, {})

    config[31337] = { name: 'Local Hardhat' }
    config[1337] = { name: 'Local Hardhat' }

    console.log('// auto-generated from', chainListUrl)
    console.log('export const networksMetaInfo: { [chainId: string]: any } = ', config)
  } catch (e) {
    console.log(e)
  }
})()
  .finally(process.exit)
