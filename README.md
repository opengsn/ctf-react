# Sample React application with GSN - Using custom Paymaster 

This is a sample of using GSN with react application and a custom Paymaster

This paymaster requires an external signature (in this case, CAPTCHA) before 
accepting the request. 

The transaction flow becomes:
- The user attempt to make a transaction.
- The normal GSN flows look up a relayer, and asks the user to sign the transaction.
- Now the "asyncApprovalData" callback is called, to sign the request
- The entire request is sent to the "captcha service"
- The "captcha service" contacts Google, to validate the captcha, and signs it.
- The GSN provider sends the transaction along with the signature.
- The paymaster validates the signature on-chain.


To run it do:
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
