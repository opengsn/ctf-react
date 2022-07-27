require('@nomiclabs/hardhat-waffle')

// You have to export an object to set up your config
// This object can have the following optional entries:
// defaultNetwork, networks, solc, and paths.
// Go to https://buidler.dev/config/ to learn more
module.exports = {
  solidity: "0.8.12",
  networks: {
    hardhat: {
      chainId: 1337
    },
  }
}
