import {networks} from '../config/networks'
import {GSNConfig, GsnEvent, RelayProvider} from "@opengsn/provider";
import {ethers, Contract, EventFilter, Signer, providers} from "ethers";

import * as CtfArtifact from '../artifacts/contracts/CaptureTheFlag.sol/CaptureTheFlag.json'
import {hexlify, hexValue, hexZeroPad} from '@ethersproject/bytes';

declare let window: { ethereum: any, location: any }
declare let global: { network: any }

export interface EventInfo {
  date?: Date
  previousHolder: string
  currentHolder: string
}

export interface GsnStatusInfo {
  getActiveRelayers: () => Promise<number>
  getPaymasterBalance: ()=>Promise<string>
  relayHubAddress: string
  paymasterAddress: string
  forwarderAddress: string
}

/**
 * a wrapper class for the CTF contract.
 * the only network-specific "leak" from this class is that the "capture()"
 * event returns a transaction object,
 * that the application should wait() until it gets mined.
 */
export class Ctf {

  ethersProvider: providers.Provider
  theContract: Contract

  blockDates: { [key: number]: Date } = {}

  constructor(readonly address: string, signer: Signer, readonly gsnProvider: RelayProvider, readonly chainId: number) {
    this.ethersProvider = signer.provider!

    this.gsnProvider = gsnProvider
    this.theContract = new ethers.Contract(address, CtfArtifact.abi, signer)
    this.blockDates = {}
  }


  async getCurrentFlagHolder() {
    return await this.theContract.currentHolder()
  }

  listenToEvents(onEvent: (e:EventInfo)=>void, onProgress?: (e: GsnEvent) => void) {
    // @ts-ignore
    let listener = async (from, to, event) => {
      const info = await this.getEventInfo(event)
      onEvent(info);
    };
    this.theContract.on('FlagCaptured', listener)
    if (onProgress!=undefined) {
      this.gsnProvider.registerEventListener(onProgress)
    }
  }

  stopListenToEvents(onEvent?: EventFilter, onProgress = null) {
    this.theContract.off(onEvent as any, null as any)
    this.gsnProvider.unregisterEventListener(onProgress as any)
  }

  async getBlockDate(blockNumber: number) {
    if (!this.blockDates[blockNumber]) {
      this.blockDates[blockNumber] = new Date(await this.ethersProvider.getBlock(blockNumber).then(b => {
        return b.timestamp * 1000
      }))
    }
    return this.blockDates[blockNumber]
  }

  async getEventInfo(e: ethers.Event): Promise<EventInfo> {
    if (!e.args) {
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

    const currentBlock = (await this.ethersProvider.getBlockNumber()) - 1
    //look at most one month back (in 12-second block
    const lookupWindow = global.network?.relayLookupWindowBlocks || 30 * 24 * 3600 / 12
    const startBlock = Math.max(1, currentBlock - lookupWindow)

    const logs = await this.theContract.queryFilter(this.theContract.filters.FlagCaptured(), startBlock)
        .catch(e=>[])
    const lastLogs = await Promise.all(logs.slice(-count).map(e => this.getEventInfo(e)))
    return lastLogs
  }

  getSigner() {
    return this.theContract.signer.getAddress()
  }

  async capture() {
    this.ethersProvider.getGasPrice().then(price => console.log('== gas price=', price.toString()))
    const gasFees = await this.gsnProvider.calculateGasFees()
    gasFees.maxPriorityFeePerGas = gasFees.maxFeePerGas
    console.log('gas fees=', gasFees)
    const gasLimit = 1e6
    const ret =  await this.theContract.captureTheFlag({gasLimit, ...gasFees})
    console.log('post-capture ret=',ret)
    return ret
  }

  async getGsnStatus(): Promise<GsnStatusInfo> {
    let relayClient = this.gsnProvider.relayClient;
    const ci = relayClient.dependencies.contractInteractor as any
    return {
      relayHubAddress: ci.relayHubInstance.address,
      forwarderAddress: ci.forwarderInstance.address,
      paymasterAddress: ci.paymasterInstance.address,

      getPaymasterBalance: ()=> ci.relayHubInstance.balanceOf(ci.paymasterInstance.address),
      getActiveRelayers: async () => relayClient.dependencies.knownRelaysManager.refresh().then(() =>
         relayClient.dependencies.knownRelaysManager.allRelayers.length
      )
    }
  }
}

export async function switchNetwork(id:string) {
  // hexlify and even "hexlify(parseInt(id))" doesn't work for "5"
  const hexChain = '0x'+parseInt(id).toString(16)
  console.log( 'change network to ', hexChain)
  const provider = window.ethereum
  await provider.request({
    method: 'wallet_switchEthereumChain',
    params: [{ chainId: hexChain}],
  });
}

export function getNetworks(): { [chain: number]: string } {
  return Object.keys(networks)
      .map(key=>parseInt(key))
      .filter(key=>window.location.href.match(/local/) || (key != 1337 && key != 31337) )
      .reduce((set, key) => ({...set, [key]: networks[key].name}), {})
}

export async function initCtf(): Promise<Ctf> {

  let web3Provider = window.ethereum

  if (!web3Provider)
    throw new Error('No "window.ethereum" found. do you have Metamask installed?')

  web3Provider.on('chainChanged', (chainId: number) => {
    console.log('chainChanged', chainId)
    window.location.reload()
  })
  web3Provider.on('accountsChanged', (accs: any[]) => {
    console.log('accountChanged', accs)
    window.location.reload()
  })

  //TEMP: logging provider..
  // const orig=web3Provider
  // web3Provider = {
  //   send(r,cb) {
  //     const now = Date.now()
  //     console.log('>>> ',r)
  //     if ( r && r.params && r.params[0] && r.params[0].fromBlock == 1 ) {
  //       console.log('=== big wait!')
  //     }
  //     orig.send(r,(err,res)=>{
  //       console.log('<<<', Date.now()-now, err, res)
  //       cb(err,res)
  //     })
  //   }
  // }
  const provider = new ethers.providers.Web3Provider(web3Provider);
  const network = await provider.getNetwork()

  const chainId = network.chainId;
  const net = global.network = networks[chainId]
  const netid = await provider.send('net_version', [])
  console.log('chainid=', chainId, 'networkid=', netid)
  if (chainId !== parseInt(netid))
    console.warn(`Incompatible network-id ${netid} and ${chainId}: for Metamask to work, they should be the same`)
  if (!net || !net.paymaster) {
    if (chainId.toString().match(/1337/)
        // || window.location.href.match(/localhost|127.0.0.1/)
    )
      throw new Error('To run locally, you must run "yarn evm" and then "yarn deploy" before "yarn react-start" ')
    else
      throw new Error(`Unsupported network (chainId=${chainId}) . please switch to one of: ` + Object.values(networks).map((n: any) => n.name).filter(n => n).join(' / '))
  }

  const gsnConfig: Partial<GSNConfig> = {

    loggerConfiguration: { logLevel: 'debug' },
    paymasterAddress: net.paymaster
  }
  console.log('== gsnconfig=', gsnConfig)
  const gsnProvider = RelayProvider.newProvider({provider: web3Provider, config: gsnConfig})
  await gsnProvider.init()
  const provider2 = new ethers.providers.Web3Provider(gsnProvider as any as providers.ExternalProvider);

  const signer = provider2.getSigner()

  return new Ctf(net.ctf, signer, gsnProvider, chainId)
}
