
module.exports=async function({getNamedAccounts, ethers, deployments}) {
	const { deploy } = deployments
	const { deployer, metamask } = await getNamedAccounts() 
	ret = await deploy( 'CaptureTheFlag', {from: deployer} )

    //move some ether to my metamask account
	await signer.sendTransaction( {to:metamask, value:ethers.utils.parseEther('1')})
}

