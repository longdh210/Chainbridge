const {
    sourceChainBridgeAddress,
    destinationChainBridgeAddress,
    rinkebyPrivateKey,
} = require("../config");
const Web3 = require("web3");
const SourceChainBridge = require("../artifacts/contracts/SourceChainBridge.sol/SourceChainBridge.json");
const DestinationChainBridge = require("../artifacts/contracts/DestinationChainBridge.sol/DestinationChainBridge.json");

const web3Rinkeby = new Web3(
    "wss://rinkeby.infura.io/ws/v3/a2cfc47d9a4f408ea304fef5b70e5599"
);
const web3Goerli = new Web3(
    "wss://goerli.infura.io/ws/v3/a2cfc47d9a4f408ea304fef5b70e5599"
);

// Private key to sign transaction
const adminPrivKey = rinkebyPrivateKey;

const { address: admin } = web3Goerli.eth.accounts.wallet.add(adminPrivKey);

// Init source contract to interact
const bridgeRinkeby = new web3Rinkeby.eth.Contract(
    SourceChainBridge.abi,
    sourceChainBridgeAddress
);
// Init destination contract to interact
const bridgeGoerli = new web3Goerli.eth.Contract(
    DestinationChainBridge.abi,
    destinationChainBridgeAddress
);

// Listening event on source chain and mint token on destination chain
bridgeRinkeby.events
    .Transfer({ step: 1 }, function (error, event) {
        console.log("event", event);
        console.log("err", error);
    })
    .on("data", async (event) => {
        console.log(event);
        // Get data from event
        const { from, to, amount, date, nonce } = event.returnValues;

        // Mint token on destination chain
        const tx = bridgeGoerli.methods.mint("0x5B9aAEf5292B5D38C30Bb5B0CA65D3960E158b66", amount, nonce);
        const [gasPrice, gasCost] = await Promise.all([
            web3Goerli.eth.getGasPrice(),
            tx.estimateGas({ from: admin }),
        ]);
        const data = tx.encodeABI();
        const txData = {
            from: admin,
            to: bridgeGoerli.options.address,
            data,
            gas: gasCost,
            gasPrice,
        };
        const receipt = await web3Goerli.eth.sendTransaction(txData);
        console.log(`Transaction hash: ${receipt.transactionHash}`);
        console.log(`
            Processed transfer:
            - from ${from}
            - to ${to}
            - amount ${amount} tokens
            - date ${date}
          `);
    });
