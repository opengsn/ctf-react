# Sample React application with GSN 

This is a sample of using GSN with react application.
It also adds some basic UI to the transaction progress.

This is the branch with GSN support.

Running it now is slightly different, since GSN must be active when deploying the contract
(this is no problem in testnet/mainnet, but requires one extra step on local network)

In order to run it run these commands in different window each:

1. Install dependencies:
```
yarn install
```

2. Launch Hardhat node:
```
yarn evm
```

3. Deploy GSN contracts, such as RelayHub and Forwarder, and start a Relay Server:
```
yarn gsn
```

4. Deploy the CTF contract:
```
yarn deploy
```

5. Launch the React app:
```
yarn start
```
 
A live deployment of this app is available at https://ctf-react.opengsn.org
