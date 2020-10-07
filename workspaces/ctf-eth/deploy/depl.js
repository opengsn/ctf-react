const { GsnTestEnvironment } = require ( '@opengsn/gsn/dist/GsnTestEnvironment' )

module.exports=async function({getNamedAccounts, ethers, deployments}) {
	const { deploy } = deployments
	let { deployer, metamask, forwarder } = await getNamedAccounts() 

    const signer = ethers.provider.getSigner()

	ret = await deploy( 'CaptureTheFlag', {from: deployer} )
    const ctf = await new ethers.Contract(ret.address, ret.abi, signer)

    if ( !forwarder ) {
        forwarder = require( '../build/gsn/Forwarder').address

        //sanity check: the build/gsn was created on the currently running node.
        if ( await ethers.provider.getCode(forwarder).then(code=>code.length) == 2 ) {
            throw new Error( 'GSN is not running. use "gsn-with-evm" to launch ganache.')
        }
    }

    console.log( 'ctf address=', ctf.address)
    await ctf.setTrustedForwarder( forwarder ).then(ret=>ret.wait())

    //move some ether to my metamask account
	await signer.sendTransaction( {to:metamask, value:ethers.utils.parseEther('1')})

    console.log( 'metasmask', metamask, 'balance=', ethers.utils.formatEther(await ethers.provider.getBalance(metamask)))
}

