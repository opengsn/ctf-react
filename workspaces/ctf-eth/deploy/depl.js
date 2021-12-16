const { constants } = require( '@opengsn/common')
module.exports=async function({getNamedAccounts, ethers, deployments}) {
	const { deploy } = deployments

  const network = await ethers.provider.getNetwork().then()
  const chainId = network.chainId
  const gasPrice = process.env.GAS_PRICE_GWEI==null ?
    null : ethers.utils.hexlify(parseInt(process.env.GAS_PRICE_GWEI +'0'.repeat(9)))

	let { deployer, metamask, forwarder } = await getNamedAccounts() 
	let hub = process.env.RelayHubAddress
    console.log( 'net forwarder=', forwarder)
    console.log( 'net=', await ethers.provider.getNetwork())
    if ( !forwarder ) {
        forwarder = require( '../build/gsn/Forwarder').address
      	hub = require('../build/gsn/RelayHub').address

        //sanity check: the build/gsn was created on the currently running node.
        if ( await ethers.provider.getCode(forwarder).then(code=>code.length) == 2 ) {
            throw new Error( 'GSN is not running. use "gsn-with-evm" to launch ganache.')
        }
    }

    const signer = ethers.provider.getSigner()
    console.log( 'signer=',await signer.getAddress())
    console.log( 'signer balance=', await ethers.provider.getBalance(await signer.getAddress()).then(x=>x/1e18))
    ret = await deploy( 'CaptureTheFlag', {gasPrice, from: deployer, args: [forwarder]} )
    const ctf = await new ethers.Contract(ret.address, ret.abi, signer)
    console.log( 'ctf address=', ctf.address)

if ( process.env.DEPLOY_PM || chainId == 1337 || chainId == 31337 ) {
  console.log('Deploying paymaster:')
  ret = await deploy('SingleRecipientPaymaster', { gasPrice, from: deployer, args: [ctf.address] })
  const pm = await new ethers.Contract(ret.address, ret.abi, signer)
  console.log('pm address=', pm.address)
  const currentForwrader = await pm.trustedForwarder()
  if (currentForwrader == constants.ZERO_ADDRESS) {
    console.log('setting pm.forwrader')
    await pm.setTrustedForwarder(forwarder, { gasPrice })
  }
  if (await pm.getHubAddr() == constants.ZERO_ADDRESS) {
    console.log('setting relayhub to: ', hub)
    await pm.setRelayHub(hub, { gasPrice })
  }
  if (await pm.getRelayHubDeposit() == 0) {
    console.log('funding paymater with 0.5')
    await ethers.provider.getSigner().sendTransaction({
      to: pm.address,
      value: ethers.utils.parseEther('0.5'),
      gasPrice
    })
  }
} else {
  //suppress warning on local network
  if ( !require( '../build/gsn/Paymaster').address ) {
    console.log( 'env DEPLOY_PM not set. not deploying paymaster' )
  }
}


    //move some ether to my metamask account
   	// await signer.sendTransaction( {to:metamask, value:ethers.utils.parseEther('1')})
    // console.log( 'metasmask', metamask, 'balance=', ethers.utils.formatEther(await ethers.provider.getBalance(metamask)))
}

