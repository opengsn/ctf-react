import CtfArtifact from '@ctf/eth/artifacts/CaptureTheFlag.json'
import ethers from 'ethers'
import {networks} from '../build/networks.js'
import {RelayProvider, resolveConfigurationGSN} from "@opengsn/gsn";
/**
 * a wrapper class for the CTF contract.
 * the only network-specific "leak" from this class is that the "capture()"
 * event returns a transaction object,
 * that the application should wait() until it gets mined.
 */
export class Ctf {

  constructor(addr, signer, signerAddress, gsnProvider) {
    this.address = addr
    this.signerAddress = signerAddress
    this.gsnProvider = gsnProvider
    this.theContract = new ethers.Contract(addr, CtfArtifact.abi, signer)
  }


  async getCurrentFlagHolder() {
    return await this.theContract.currentHolder()
  }

  listenToEvents(onEvent, onProgress) {
    this.theContract.on('FlagCaptured', (previousHolder, currentHolder) => {
      onEvent({previousHolder, currentHolder});
    })
    this.gsnProvider.registerEventListener(onProgress)
  }

  stopListenToEvents(onEvent, onProgress) {
    this.theContract.off(onEvent)
    this.gsnProvider.unregisterEventListener(onProgress)
  }

  async getPastEvents(count = 5) {
    const logs = await this.theContract.queryFilter('FlagCaptured', 1)
    return logs.map(e => ({previousHolder: e.args.previousHolder, currentHolder: e.args.currentHolder})).slice(0, count)
  }

  getSignerAddress() {
    return this.signerAddress
  }

  async capture() {
    return await this.theContract.captureTheFlag()
  }
}

export async function initCtf() {

  const web3Provider = window.ethereum

  if (!web3Provider)
    throw new Error( 'No "window.ethereum" found. do you have Metamask installed?')

  const provider = new ethers.providers.Web3Provider(web3Provider);
  const network = await provider.getNetwork()
  const accounts = await provider.listAccounts()
  console.log('accounts=', accounts)
  const signerAddress = accounts[0]

  let chainId = network.chainId;
  let net = networks[chainId]
  const netid = await provider.send('net_version')
  console.log('chainid=',chainId, 'networkid=', netid)
  if (chainId !== parseInt(netid))
    console.warn(`Incompatible network-id ${netid} and ${chainId}: for Metamask to work, they should be the same`)
  if (!net) {
    if( chainId<1000 || ! window.location.href.match( /localhos1t|127.0.0.1/ ) )
      throw new Error( 'Unsupported network. please switch to one of: '+ Object.values(networks).map(n=>n.name).join('/'))
    else
      throw new Error( 'To run locally, you must run "yarn evm" and then "yarn deploy" before "yarn react-start" ')
  }

  const gsnConfig = await resolveConfigurationGSN(web3Provider,{
    logLevel:0,
    paymasterAddress: net.paymaster
  })
  const gsnProvider = new RelayProvider(web3Provider, gsnConfig)
  const provider2 = new ethers.providers.Web3Provider(gsnProvider);

  const signer = provider2.getSigner()

  return new Ctf(net.ctf, signer, signerAddress, gsnProvider)
}
