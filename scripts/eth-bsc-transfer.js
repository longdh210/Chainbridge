// const { artifacts } = require("hardhat");
const { sourceChainBridgeAddress } = require("../config");
const SourceChainBridge = require("../artifacts/contracts/SourceChainBridge.sol/SourceChainBridge.json");
const Web3 = require("web3");

const web3 = new Web3(
    "https://eth-rinkeby.alchemyapi.io/v2/kAPtSA_EMLRedffB6D1Ehre3rQQ2pmn2"
);

const sourceChainBridge = new web3.eth.Contract(
    SourceChainBridge.abi,
    sourceChainBridgeAddress
);

const senderPublicKey = "0x3797786150d38aa2588ac2BcFb162a61e2A69638";
const senderPrivateKey =
    "fb810f4d6c526159ebb447c7c4aa2eeadf3b291c5e203f52225928a1dec09d4b";

async function main() {
    const nonce = await web3.eth.getTransactionCount(senderPublicKey, "latest"); //get latest nonce

    //the transaction
    const tx = {
        from: senderPublicKey,
        to: sourceChainBridgeAddress,
        nonce: nonce,
        gas: 500000,
        data: sourceChainBridge.methods
            .burn("0x5B9aAEf5292B5D38C30Bb5B0CA65D3960E158b66", 1000)
            .encodeABI(),
    };

    const signPromise = web3.eth.accounts.signTransaction(tx, senderPrivateKey);
    signPromise
        .then((signedTx) => {
            web3.eth.sendSignedTransaction(
                signedTx.rawTransaction,
                function (err, hash) {
                    if (!err) {
                        console.log("The hash of your transaction is: ", hash);
                    } else {
                        console.log(
                            "Something went wrong when submitting your transaction:",
                            err
                        );
                    }
                }
            );
        })
        .catch((err) => {
            console.log(" Promise failed:", err);
        });
}
main();
