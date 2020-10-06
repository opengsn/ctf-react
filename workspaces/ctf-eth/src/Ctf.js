import CtfArtifact from '@ctf/eth/artifacts/CaptureTheFlag.json'
import ethers from 'ethers'
import {networks} from './networks'

/**
 * a wrapper class for the CTF contract.
 * the only network-specific "leak" from this class is that the "capture()"
 * event returns a transaction object,
 * that the application should wait() until it gets mined.
 */
export class Ctf {

  constructor(addr, signer) {
    this.address = addr
    this.theContract = new ethers.Contract(addr, CtfArtifact.abi, signer)
  }


  async getCurrentFlagHolder() {
    return await this.theContract.currentHolder()
  }

  listenToEvents(onEvent, onProgress) {
    this.theContract.on('FlagCaptured', (previousHolder, currentHolder) => {
      onEvent({previousHolder, currentHolder});
    })
  }

  stopListenToEvents(onEvent, onProgress) {
    this.theContract.off(onEvent)
  }

  async getPastEvents(count = 5) {
    const logs = await this.theContract.queryFilter('FlagCaptured', 1)
    return logs.map(e => ({previousHolder: e.args.previousHolder, currentHolder: e.args.currentHolder})).slice(0, count)
  }

  getSigner() {
    return this.theContract.signer.getAddress()
  }

  async capture() {
    return await this.theContract.captureTheFlag()
  }
}

export async function initCtf() {

  const web3Provider = window.ethereum

  const provider = new ethers.providers.Web3Provider(web3Provider);
  const network = await provider.getNetwork()

  let net = networks[network.chainId]
  if (!net) {
    net = {
      ctf: require('@ctf/eth/deployments/localhost/CaptureTheFlag.json').address
    }
  }

  const signer = provider.getSigner()

  return new Ctf(net.ctf, signer)
}
