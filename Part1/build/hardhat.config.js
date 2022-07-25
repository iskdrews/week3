"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const config_1 = require("hardhat/config");
const dotenv_1 = require("dotenv");
const path_1 = require("path");
(0, dotenv_1.config)({ path: (0, path_1.resolve)(__dirname, "./.env") });
require("@nomiclabs/hardhat-waffle");
require("@typechain/hardhat");
require("@nomiclabs/hardhat-ethers");
require("@nomiclabs/hardhat-waffle");
// import "hardhat-gas-reporter";
require("@nomiclabs/hardhat-etherscan");
// import "solidity-coverage";
const name = "arbitrum-rinkeby";
// @ref check all chainIds https://chainlist.org/
const chainIds = {
    ganache: 1337,
    goerli: 5,
    hardhat: 31337,
    kovan: 42,
    mainnet: 1,
    rinkeby: 4,
    ropsten: 3,
    arbitrum_mainnet: 42161,
    arbitrum_rinkeby: 421611,
    optimism_mainnet: 10,
    optimism_kovan: 69,
    fantom_mainnet: 250,
    fantom_testnet: 0xfa2,
    name: 421611,
    polygon_testnet: 80001,
    polygon_mainnet: 137,
    bsc_testnet: 97,
    bsc_mainnet: 56,
};
const MNEMONIC = process.env.MNEMONIC || "";
const ETHERSCAN_API_KEY = process.env.ETHERSCAN_API_KEY || "";
const INFURA_API_KEY = process.env.INFURA_API_KEY || "";
const ALCHEMY_KEY = process.env.ALCHEMY_KEY || "";
// This is a sample Hardhat task. To learn how to create your own go to
// https://hardhat.org/guides/create-task.html
(0, config_1.task)("accounts", "Prints the list of accounts", async (_, hre) => {
    const accounts = await hre.ethers.getSigners();
    for (const account of accounts) {
        console.log(await account.getAddress());
    }
});
function replaceAt(word, index, replacement) {
    return word.substr(0, index) + replacement + word.substr(index + replacement.length);
}
function createInfuraConfig(network) {
    let url;
    // Updating some names to work with Infura
    if (network.indexOf("_") != -1) {
        let updated_network = replaceAt(network, network.indexOf("_"), "-");
        url = "https://" + updated_network + ".infura.io/v3/" + INFURA_API_KEY;
    }
    else {
        url = "https://" + network + ".infura.io/v3/" + INFURA_API_KEY;
    }
    return {
        accounts: {
            count: 10,
            initialIndex: 0,
            mnemonic: MNEMONIC,
            path: "m/44'/60'/0'/0",
        },
        chainId: chainIds[network],
        url,
    };
}
// You need to export an object to set up your config
// Go to https://hardhat.org/config/ to learn more
const config = {
    defaultNetwork: "hardhat",
    networks: {
        hardhat: {
        // hardfork: "london",
        // initialBaseFeePerGas: 0,
        // forking: {
        //   url: `https://eth-mainnet.alchemyapi.io/v2/${ALCHEMY_KEY}`,
        //   blockNumber: 13460453,
        // },
        },
        mainnet: createInfuraConfig("mainnet"),
        goerli: createInfuraConfig("goerli"),
        kovan: createInfuraConfig("kovan"),
        rinkeby: createInfuraConfig("rinkeby"),
        ropsten: createInfuraConfig("ropsten"),
        arbitrum_mainnet: createInfuraConfig("arbitrum_mainnet"),
        arbitrum_testnet: createInfuraConfig("arbitrum_rinkeby"),
        bsc_testnet: {
            url: "https://data-seed-prebsc-1-s1.binance.org:8545",
            chainId: chainIds.bsc_testnet,
            gasPrice: 20000000000,
            accounts: { mnemonic: MNEMONIC },
        },
        bsc_mainnet: {
            url: "https://bsc-dataseed.binance.org/",
            chainId: chainIds.bsc_mainnet,
            gasPrice: 20000000000,
            accounts: { mnemonic: MNEMONIC },
        },
        polygon_testnet: {
            url: "https://rpc-mumbai.maticvigil.com",
            chainId: chainIds.polygon_testnet,
            gasPrice: 20000000000,
            accounts: { mnemonic: MNEMONIC },
        },
        polygon_mainnet: {
            url: "https://rpc-mainnet.maticvigil.com",
            chainId: chainIds.polygon_mainnet,
            gasPrice: 20000000000,
            accounts: { mnemonic: MNEMONIC },
        },
        optimism_testnet: {
            url: "https://kovan.optimism.io",
            chainId: chainIds.optimism_kovan,
            gasPrice: 20000000000,
            accounts: { mnemonic: MNEMONIC },
        },
        optimism_mainnet: {
            url: "https://mainnet.optimism.io",
            chainId: chainIds.optimism_mainnet,
            gasPrice: 20000000000,
            accounts: { mnemonic: MNEMONIC },
        },
        fantom_mainnet: {
            url: "https://rpc.ftm.tools/",
            chainId: chainIds.fantom_mainnet,
            gasPrice: 20000000000,
            accounts: { mnemonic: MNEMONIC },
        },
        fantom_testnet: {
            url: "https://rpc.testnet.fantom.network/",
            chainId: chainIds.fantom_testnet,
            gasPrice: 20000000000,
            accounts: { mnemonic: MNEMONIC },
        },
    },
    solidity: {
        compilers: [
            {
                version: "0.6.12",
            },
            {
                version: "0.8.4",
            },
        ],
    },
    // etherscan: {
    //   apiKey: ETHERSCAN_API_KEY,
    // },
    // gasReporter: {
    //   currency: "USD",
    //   gasPrice: 100,
    //   // enabled: process.env.REPORT_GAS ? true : false,
    // },
    // typechain: {
    //   outDir: "typechain",
    //   target: "ethers-v5",
    // },
};
exports.default = config;
//# sourceMappingURL=hardhat.config.js.map