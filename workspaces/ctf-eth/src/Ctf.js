import CtfArtifact from '@ctf/eth/artifacts/CaptureTheFlag.json'
import ethers from 'ethers'
import {networks} from '../config/networks.js'
import {RelayProvider} from "@opengsn/provider";

/**
 * a wrapper class for the CTF contract.
 * the only network-specific "leak" from this class is that the "capture()"
 * event returns a transaction object,
 * that the application should wait() until it gets mined.
 */
export class Ctf {

  constructor(addr, signer, gsnProvider) {
    this.address = addr
    this.ethersProvider = signer.provider

    this.gsnProvider = gsnProvider
    this.theContract = new ethers.Contract(addr, CtfArtifact.abi, signer)
    this.blockDates = {}
  }


  async getCurrentFlagHolder() {
    return await this.theContract.currentHolder()
  }

  listenToEvents(onEvent, onProgress) {
    this.theContract.on('FlagCaptured', async (form,to,event) => {
      const info = await this.getEventInfo(event)
      onEvent(info);
    })
    this.gsnProvider.registerEventListener(onProgress)
  }

  stopListenToEvents(onEvent, onProgress) {
    this.theContract.off(onEvent)
    this.gsnProvider.unregisterEventListener(onProgress)
  }

  async getBlockDate(blockNumber) {
    if ( ! this.blockDates[blockNumber]) {
      this.blockDates[blockNumber] = new Date(await this.ethersProvider.getBlock(blockNumber).then(b=> {
        return b.timestamp * 1000
      }))
    }
    return this.blockDates[blockNumber]
  }
  async getEventInfo(e) {
    if ( !e.args ) {
      console.log('==not a valid event: ', e)
      return {
        previousHolder: 'notevent',
        currentHolder: JSON.stringify(e)
      }
    }
    return {
      date: await this.getBlockDate(e.blockNumber),
      previousHolder: e.args.previousHolder,
      currentHolder: e.args.currentHolder
    }
  }

  async getPastEvents(count = 5) {

    const currentBlock = await this.ethersProvider.getBlockNumber()
    //look at most one month back (in 12-second block
    const startBlock = Math.max(1,currentBlock-30*24*3600/12)
    const logs = await this.theContract.queryFilter('FlagCaptured', startBlock)
    const lastLogs = await Promise.all(logs.slice(-count).map(e=>this.getEventInfo(e)))
    return lastLogs
  }

  getSigner() {
    return this.theContract.signer.getAddress()
  }

  async capture() {
    this.ethersProvider.getGasPrice().then(price=>console.log( '== gas price=', price.toString()))
    return await this.theContract.captureTheFlag()
  }
}

export async function initCtf() {

  const web3Provider = window.ethereum

  if (!web3Provider)
    throw new Error( 'No "window.ethereum" found. do you have Metamask installed?')

  web3Provider.on('chainChanged', (chainId)=>{
    console.log( 'chainChanged', chainId)
      window.location.reload()
  })
  web3Provider.on('accountsChanged', (accs)=>{
    console.log( 'accountChanged', accs)
    window.location.reload()
  })
  const provider = new ethers.providers.Web3Provider(web3Provider);
  const network = await provider.getNetwork()

  let chainId = network.chainId;
  let net = networks[chainId]
  //for Address
  global.network = net
  const netid = await provider.send('net_version')
  console.log('chainid=',chainId, 'networkid=', netid)
  if (chainId !== parseInt(netid))
    console.warn(`Incompatible network-id ${netid} and ${chainId}: for Metamask to work, they should be the same`)
  if (!net) {
    if( chainId<1000 || ! window.location.href.match( /localhos1t|127.0.0.1/ ) )
      throw new Error( `Unsupported network (chainId=${chainId}) . please switch to one of: `+ Object.values(networks).map(n=>n.name).filter(n=>n).join(' / '))
    else
      throw new Error( 'To run locally, you must run "yarn evm" and then "yarn deploy" before "yarn react-start" ')
  }

  const gsnConfig = {
    //log everything (0=debug, 5=error)
    // logLevel:'error',
    // send all log to central log server, for possible troubleshooting
    // loggerUrl: 'https://logger.opengsn.org',
    // loggerApplicationId: 'ctf' // by default, set to application's URL (unless on localhost)

    relayLookupWindowBlocks: 600000,
    loggerConfiguration: {logLevel: 'debug'},
    paymasterAddress: net.paymaster
  }
  const gsnProvider =  RelayProvider.newProvider({provider:web3Provider, config:gsnConfig})
  await gsnProvider.init()
  const provider2 = new ethers.providers.Web3Provider(gsnProvider);

  const signer = provider2.getSigner()

  return new Ctf(net.ctf, signer, gsnProvider)
}
