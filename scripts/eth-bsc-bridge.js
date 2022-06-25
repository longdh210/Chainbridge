const {
    sourceChainBridgeAddress,
    destinationChainBridgeAddress,
} = require("../config");
const Web3 = require("web3");
const SourceChainBridge = require("../artifacts/contracts/SourceChainBridge.sol/SourceChainBridge.json");
const DestinationChainBridge = require("../artifacts/contracts/DestinationChainBridge.sol/DestinationChainBridge.json");

const web3Eth = new Web3(
    "wss://rinkeby.infura.io/v3/9aa3d95b3bc440fa88ea12eaa4456161"
);
const web3Bsc = new Web3("wss://data-seed-prebsc-1-s1.binance.org:8545/");
const adminPrivKey =
    "fb810f4d6c526159ebb447c7c4aa2eeadf3b291c5e203f52225928a1dec09d4b";

const { address: admin } = web3Bsc.eth.accounts.wallet.add(adminPrivKey);

const bridgeEth = new web3Eth.eth.Contract(
    SourceChainBridge.abi,
    sourceChainBridgeAddress
);

const bridgeBsc = new web3Bsc.eth.Contract(
    DestinationChainBridge.abi,
    destinationChainBridgeAddress
);

bridgeEth.events
    .Transfer({ fromBlock: 0, step: 0 }, function (error, event) {
        console.log(event);
    })
    .on("data", async (event) => {
        console.log("run");
        const { from, to, amount, date, nonce } = event.returnValues;

        const tx = bridgeBsc.methods.mint(to, amount, nonce);
        const [gasPrice, gasCost] = await Promise.all([
            web3Bsc.eth.getGasPrice(),
            tx.estimateGas({ from: admin }),
        ]);
        const data = tx.encodeABI();
        const txData = {
            from: admin,
            to: bridgeBsc.options.address,
            data,
            gas: gasCost,
            gasPrice,
        };
        const receipt = await web3Bsc.eth.sendTransaction(txData);
        console.log(`Transaction hash: ${receipt.transactionHash}`);
        console.log(`
            Processed transfer:
            - from ${from}
            - to ${to}
            - amount ${amount} tokens
            - date ${date}
          `);
    });
