# sample React application with GSN 

This is a sample of using GSN with react application.
It also adds some basic UI to the transaction progress.

This is the branch with GSN support.

Running it now is slightly different, since GSN must be active when deploying the contract
(this is no problem in testnet/mainnet, but requires one extra step on local network)

to run it do:
```
yarn install
yarn evm-with-gsn
```

And now in another window:

```
yarn deploy
yarn start.
```

A live deployment of this app is available at https://ctf-react.opengsn.org
