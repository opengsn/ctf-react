const { GsnTestEnvironment } = require ( '@opengsn/dev' )
const { constants } = require( '@opengsn/common')
module.exports=async function({getNamedAccounts, ethers, deployments}) {
	const { deploy } = deployments
	let { deployer, metamask, forwarder } = await getNamedAccounts() 

    if ( !forwarder ) {
        forwarder = require( '../build/gsn/Forwarder').address

        //sanity check: the build/gsn was created on the currently running node.
        if ( await ethers.provider.getCode(forwarder).then(code=>code.length) == 2 ) {
            throw new Error( 'GSN is not running. use "gsn-with-evm" to launch ganache.')
        }
    }

    const signer = ethers.provider.getSigner()
    ret = await deploy( 'CaptureTheFlag', {from: deployer, args: [forwarder]} )
    const ctf = await new ethers.Contract(ret.address, ret.abi, signer)
    console.log( 'ctf address=', ctf.address)

if ( process.env.DEPLOY_PM ) {
    console.log( 'Deploying paymaster:' )
    ret = await deploy( 'TestPaymasterEverythingAccepted', {from:deployer} )
    const pm = await new ethers.Contract(ret.address, ret.abi, signer)
    console.log('pm address=', pm.address)
    const currentForwrader = await pm.trustedForwarder()
    if ( currentForwrader == constants.ZERO_ADDRESS) {
        console.log('setting pm.forwrader')
        await pm.setTrustedForwarder(forwarder)
    }
    if ( await pm.getHubAddr() == constants.ZERO_ADDRESS) {
        console.log('setting relayhub')
        await pm.setRelayHub(process.env.RelayHubAddress)
    }
    if ( await pm.getRelayHubDeposit() == 0 ) {
	console.log('funding paymater with 0.5' )
	await provider.sendTransaction(pm.address, ethers.utils.parseEther('0.5'))
    }
} else {
  console.log( 'env DEPLOY_PM not set. not deploying paymaster' )
}


    //move some ether to my metamask account
   	// await signer.sendTransaction( {to:metamask, value:ethers.utils.parseEther('1')})
    // console.log( 'metasmask', metamask, 'balance=', ethers.utils.formatEther(await ethers.provider.getBalance(metamask)))
}

