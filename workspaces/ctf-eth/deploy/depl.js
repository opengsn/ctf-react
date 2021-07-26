const {constants} = require('@opengsn/common')
module.exports = async function ({getNamedAccounts, ethers, deployments}) {
  const {deploy} = deployments
  const gasPrice = process.env.GAS_PRICE_GWEI == null ?
    null : ethers.utils.hexlify(parseInt(process.env.GAS_PRICE_GWEI + '0'.repeat(9)))

  let {deployer, forwarder} = await getNamedAccounts()
  let hub = process.env.RelayHubAddress

  if (!forwarder) {
    forwarder = require('../build/gsn/Forwarder').address
    hub = require('../build/gsn/RelayHub').address

    //sanity check: the build/gsn was created on the currently running node.
    if (await ethers.provider.getCode(forwarder).then(code => code.length) == 2) {
      throw new Error('GSN is not running. use "gsn-with-evm" to launch ganache.')
    }
  }

  const chainId = await ethers.provider.getNetwork().then(net => net.chainId)

  if (chainId != 1337 && chainId != 31337) {
    const accounts = await ethers.provider.listAccounts()
    if (accounts.length == 0) {
      throw new Error('no account to deploy with. must set MNEMONIC_FILE')
    }
  }

  const signer = ethers.provider.getSigner()
  ret = await deploy('CaptureTheFlag', {gasPrice, from: deployer, args: [forwarder]})
  const ctf = await new ethers.Contract(ret.address, ret.abi, signer)
  console.log('ctf address=', ctf.address)

  console.log('Deploying paymaster:')
  // ret = await deploy('SingleRecipientPaymaster', { gasPrice, from: deployer, args: [ctf.address] })
  ret = await deploy('HashcashPaymaster', {gasPrice, from: deployer, args: [15]})
  const pm = await new ethers.Contract(ret.address, ret.abi, signer)
  console.log('pm address=', pm.address)
  const currentForwrader = await pm.trustedForwarder()
  if (currentForwrader == constants.ZERO_ADDRESS) {
    console.log('setting pm.forwrader')
    await pm.setTrustedForwarder(forwarder, {gasPrice})
  }
  if (await pm.getHubAddr() == constants.ZERO_ADDRESS) {
    if (hub == null)
      throw new Error('cat set hub of paymaster: RelayHubAddress env not set')
    console.log('setting relayhub to: ', hub)
    const tx = await pm.setRelayHub(hub, {gasPrice})
    await tx.wait()
  } else {
    console.log('pm\'s hub=', await pm.getHubAddr())
  }
  if (await pm.getRelayHubDeposit() == 0) {
    console.log('funding paymater with 1')
    await ethers.provider.getSigner().sendTransaction({
      to: pm.address,
      value: ethers.utils.parseEther('1'),
      gasPrice
    })
  }
}

