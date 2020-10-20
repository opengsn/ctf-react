import Web3Modal from "web3modal";
import Portis from "@portis/web3";
import WalletConnectProvider from "@walletconnect/web3-provider";
import Fortmatic from "fortmatic";
import Torus from "@toruslabs/torus-embed";

export async function initWeb3Provider() {

  let infuraId = 'f40be2b1a3914db682491dc62a19ad43';
  const web3Modal = new Web3Modal({
    network: "rinkeby", // optional
    // network: "ropsten", // optional
    cacheProvider: true, // optional
    providerOptions: {
      cacheProvider: false,

      portis: {
        package: Portis, // required
        options: {
          id: "41c48038-e3cc-4985-b381-52cd94c0d1ae" // required
        }
      },

      //works: but reports an error after mining..
      fortmatic: {
        package: Fortmatic, // required
        options: {
          key: "pk_test_6F59A9CE6D5FD44B",
        }
      },

      torus: {
        package: Torus, // required
        options: {
          config: {
            // buildEnv: "development" // optional
          }
        }
      },

      walletconnect: {
        package: WalletConnectProvider, // required
        options: {
          infuraId: infuraId // required
        }
      },

    }
  });

  web3Modal.clearCachedProvider()
  const provider = await web3Modal.connect();

  // try { provider.disconnect() } catch(e) {
  //   console.log(' no disconnect: ' + e.message)
  // }
  // try { provider.close() } catch(e) {
  //   console.log(' no close: ' + e.message)
  // }
  // console.log('=== disconnected provider')

  console.log('provider keys=',Object.keys(provider))

  return provider
}