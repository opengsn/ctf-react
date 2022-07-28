const deployedNetworks = require('../config/gsn-networks.json')

module.exports = async function ({ getNamedAccounts, ethers, deployments }) {
  const { deploy } = deployments

  const network = await ethers.provider.getNetwork().then()
  const chainId = network.chainId
  const gasPrice = process.env.GAS_PRICE_GWEI == null
    ? null
    : ethers.utils.hexlify(parseInt(process.env.GAS_PRICE_GWEI + '0'.repeat(9)))

  const { deployer } = await getNamedAccounts()

  let forwarder
  if (!chainId.toString().match(/1337/)) {
    const deployedNetwork = (deployedNetworks[chainId] || [])[0]

    if (!deployedNetwork) {
      throw new Error(`GSN not deployed on network ${chainId}`)
    }
    forwarder = deployedNetwork.contracts &&
      deployedNetwork.contracts.Forwarder &&
      deployedNetwork.contracts.Forwarder.address
    if (!forwarder) {
      throw new Error(`No Forwarder address on network ${chainId}`)
    }
  }

  if (!deployer) throw new Error('must set MNEMONIC_FILE for deployer')
  console.log('deployer=', deployer, 'balance=', ethers.utils.formatEther(await ethers.provider.getBalance(deployer)))
  if (!forwarder) {
    forwarder = require('../../../build/gsn/Forwarder.json').address

    // sanity check: the build/gsn was created on the currently running node.
    if (await ethers.provider.getCode(forwarder).then(code => code.length) === 2) {
      throw new Error('GSN is not running. You may use "npx gsn start" to launch Hardhat and GSN.')
    }
  }

  const signer = ethers.provider.getSigner()
  const ret = await deploy('CaptureTheFlag', { gasPrice, from: deployer, args: [forwarder], log: true })
  const ctf = await new ethers.Contract(ret.address, ret.abi, signer)
  console.log('ctf address=', ctf.address)
}
