const fs = require('fs')

usePlugin("@nomiclabs/buidler-waffle");
usePlugin("buidler-deploy")

// This is a sample Buidler task. To learn how to create your own go to
// https://buidler.dev/guides/create-task.html
task("accounts", "Prints the list of accounts", async () => {
  const accounts = await ethers.getSigners();

  for (const account of accounts) {
    console.log(await account.getAddress());
  }
});

task('export-addresses', 'export contract addresses, used by react project. add locally-deployed network, if specified.')
  .setAction(async (args, bre) => {

    const {networks} = require('./config/networks')
    let chainId = null
    if ( bre.network.config.url ) {
      try {
        chainId = await bre.getChainId()
        networks[chainId] = {
          paymaster: require('./build/gsn/Paymaster.json').address,
          ctf: require('./deployments/localhost/CaptureTheFlag.json').address
        }
      } catch (e) {
        throw new Error( 'Can use --chain-id only after "gsn start" and "buidler deploy" : '+e.message)
      }
    }
    let outputFile = __dirname + '/build/networks.js';
    fs.mkdirSync(__dirname + '/build', {recursive: true})
    fs.writeFileSync(outputFile, `// generated file (by "buidler export-addresses")
const networks = ${JSON.stringify(networks, null, 2)}
module.exports = { networks }
`)
    console.log('Written networks', (chainId != null) ? '(including local ' + chainId + ')' : '', 'into', outputFile)
  })

// You have to export an object to set up your config
// This object can have the following optional entries:
// defaultNetwork, networks, solc, and paths.
// Go to https://buidler.dev/config/ to learn more
module.exports = {
  // This is a sample solc configuration that specifies which version of solc to use
  solc: {
    version: "0.6.8",
  },

  namedAccounts: {
    deployer: 0,
    metamask: '0xd21934eD8eAf27a67f0A70042Af50A1D6d195E81'
  }
};
