import {networks} from '../config/networks'
import {GSNConfig, GsnEvent, RelayProvider} from "@opengsn/provider";
import {ethers, Contract, EventFilter, Signer, providers} from "ethers";
import deployedNetworks from '../build/deployed-networks.json'
import * as CtfArtifact from '../artifacts/contracts/CaptureTheFlag.sol/CaptureTheFlag.json'

import {MultiExport} from 'hardhat-deploy/types'
import {createHashcashAsyncApproval} from "@opengsn/paymasters/dist/src/HashCashApproval";
import {ContractExport, Export} from "hardhat-deploy/dist/types";

declare let window: { ethereum: any, location: any }
declare let global: { network: any }

export interface EventInfo {
  date?: Date
  previousHolder: string
  currentHolder: string
}

export interface GsnStatusInfo {
  getActiveRelayers: () => Promise<number>
  getPaymasterBalance: () => Promise<string>
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

  constructor(readonly address: string, signer: Signer, readonly gsnProvider: RelayProvider) {
    this.ethersProvider = signer.provider!

    this.gsnProvider = gsnProvider
    this.theContract = new ethers.Contract(address, CtfArtifact.abi, signer)
    this.blockDates = {}
  }


  async getCurrentFlagHolder() {
    return await this.theContract.currentHolder()
  }

  listenToEvents(onEvent: (e: EventInfo) => void, onProgress?: (e: GsnEvent) => void) {
    // @ts-ignore
    let listener = async (from, to, event) => {
      const info = await this.getEventInfo(event)
      onEvent(info);
    };
    this.theContract.on('FlagCaptured', listener)
    if (onProgress != undefined) {
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
        previousHolder: 'not-event',
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
    const lookupWindow = global.network?.relayLookupWindowBlocks || 30 * 24 * 3600 / 12
    const startBlock = Math.max(1, currentBlock - lookupWindow)

    const logs = await this.theContract.queryFilter(this.theContract.filters.FlagCaptured(), startBlock)
    return await Promise.all(logs.slice(-count).map(e => this.getEventInfo(e)))
  }

  getSigner() {
    return this.theContract.signer.getAddress()
  }

  async capture() {
    this.ethersProvider.getGasPrice().then(price => console.log('== gas price=', price.toString()))
    return await this.theContract.captureTheFlag()
  }

  async getGsnStatus(): Promise<GsnStatusInfo> {
    let relayClient = this.gsnProvider.relayClient;
    const ci = relayClient.dependencies.contractInteractor as any
    return {
      relayHubAddress: ci.relayHubInstance.address,
      forwarderAddress: ci.forwarderInstance.address,
      paymasterAddress: ci.paymasterInstance.address,

      getPaymasterBalance: () => ci.paymasterInstance.getRelayHubDeposit(),
      getActiveRelayers: async () => relayClient.dependencies.knownRelaysManager.refresh().then(() =>
        relayClient.dependencies.knownRelaysManager.allRelayers.length
      )
    }
  }
}

async function getHashcashPaymasterDifficulty(provider: ethers.providers.BaseProvider, contract: ContractExport): Promise<number> {
  const pm = new ethers.Contract(contract.address, contract.abi, provider)
  try {
    return await pm.difficulty().then((ret: any) => parseInt(ret.toString()))
  } catch (e) {
    const pmVer = await pm.versionPaymaster().catch(() => null)
    if (pmVer)
      throw new Error(`Not a Hashcash-paymaster: ${contract.address} - ${pmVer}`)

    if (await provider.getCode(contract.address).then(code => code.length) < 10)
      throw new Error(`No contract at paymaster address: ${contract.address} on network ${await provider.getNetwork()}`)

    throw new Error(e.message)
  }
}

export type InitCtfCallback = (difficulty: number, nonce?: string) => Promise<boolean>;

/**
 * initialize CTF
 * @param paymasterUiUpdateCallback - callback to be called periodically while we calculate the hashcash
 * @return {Promise<Ctf>}
 */
export async function initCtf(paymasterUiUpdateCallback: InitCtfCallback): Promise<Ctf> {

  let web3Provider = window.ethereum

  if (!web3Provider)
    throw new Error('No "window.ethereum" found. do you have Metamask installed?')

  web3Provider.on('chainChanged', (chainId: number) => {
    console.log('chainChanged', chainId)
    window.location.reload()
  })
  web3Provider.on('accountsChanged', (accounts: any[]) => {
    console.log('accountChanged', accounts)
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

  const chainId = network.chainId
  const deployedNetwork = Object.values((deployedNetworks as MultiExport)[chainId] ?? {})[0]
  const allNetworkIds = Object.keys(deployedNetworks).join("/")
  if (!deployedNetwork)
    throw new Error(`Can't find deployed contracts on network ${chainId}. Switch to one of ${allNetworkIds}`)
  const CtfContract = deployedNetwork.contracts.CaptureTheFlag
  if (CtfContract == null)
    throw new Error(`Ctf not deployed on network ${chainId}`)
  const PaymasterContract = deployedNetwork.contracts.HashcashPaymaster
  if (PaymasterContract == null)
    throw new Error(`Paymaster not deployed on network ${chainId}`)
  //we use addresses from deployed networks (deployed with "yarn deploy"), but
  // the global "networks" still contain etherscan and default param settings.
  let net = {
    ...networks[chainId],
    paymaster: PaymasterContract.address,
    ctf: CtfContract.address,
  };
  //for Address
  global.network = net
  if (!net || !net.paymaster) {
    if (chainId < 1000 || !window.location.href.match(/localhost|127.0.0.1/))
      throw new Error(`Unsupported network (chainId=${chainId}) . please switch to one of: ` + Object.values(networks).map((n: any) => n.name).filter(n => n).join(' / '))
    else
      throw new Error('To run locally, you must run "yarn evm" and then "yarn deploy" before "yarn react-start" ')
  }

  //on kotti (at least) using blockGasLimit breaks our code..
  const maxViewableGasLimit = chainId === 6 ? 5e6 : undefined

  const gsnConfig: Partial<GSNConfig> = {
    //log everything (0=debug, 5=error)
    // logLevel:'error',
    // send all log to central log server, for possible troubleshooting
    // loggerUrl: 'https://logger.opengsn.org',
    // loggerApplicationId: 'ctf' // by default, set to application's URL (unless on localhost)

    requiredVersionRange: '^2.2.0',
    maxViewableGasLimit,
    relayLookupWindowBlocks: global.network.relayLookupWindowBlocks || 600000,
    relayRegistrationLookupBlocks: global.network.relayRegistrationLookupBlocks || 600000,
    loggerConfiguration: {logLevel: 'debug'},
    paymasterAddress: net.paymaster
  }
  const difficulty = await getHashcashPaymasterDifficulty(provider, PaymasterContract)
  const gsnProvider = RelayProvider.newProvider({
    provider: web3Provider, config: gsnConfig, overrideDependencies: {
      asyncApprovalData: createHashcashAsyncApproval(difficulty, 1000, paymasterUiUpdateCallback)
      // asyncApprovalData: async ()=>'0x'.padEnd(130,'0')
    }
  })
  await gsnProvider.init()
  const provider2 = new ethers.providers.Web3Provider(gsnProvider as any as providers.ExternalProvider);

  const signer = provider2.getSigner()

  return new Ctf(net.ctf, signer, gsnProvider)
}
