const { GsnTestEnvironment } = require('@opengsn/dev');
const { saveDeployment, showDeployment } = require('@opengsn/cli/dist/utils');

(async () => {
   try {
     const network = 'localhost'
     const workdir = 'build/gsn'
     const env = await GsnTestEnvironment.startGsn(network)
     saveDeployment(env.contractsDeployment, workdir)
     showDeployment(env.contractsDeployment, 'GSN started')

     console.log(`Relay is active, URL = ${env.relayUrl} . Press Ctrl-C to abort`)
   } catch (e) {
     console.error(e)
   }
 })().catch(
   reason => {
     console.error(reason)
     process.exit(1)
   }
 )
