const {
    destinationChainBridgeAddress,
    goerliPublicKey,
    goerliPrivateKey,
} = require("../config");
const DestinationChainBridge = require("../artifacts/contracts/DestinationChainBridge.sol/DestinationChainBridge.json");
const Web3 = require("web3");

const web3 = new Web3(
    "https://eth-goerli.alchemyapi.io/v2/sNcf8L4HbcXGz_93jNm2TvvhqZ0b6kRp"
);

const detinationChainBridge = new web3.eth.Contract(
    DestinationChainBridge.abi,
    destinationChainBridgeAddress
);

const senderPublicKey = goerliPublicKey;
const senderPrivateKey = goerliPrivateKey;

// Burn token in source chain
async function main() {
    const nonce = await web3.eth.getTransactionCount(senderPublicKey, "latest"); //get latest nonce

    //the transaction
    const tx = {
        from: senderPublicKey,
        to: destinationChainBridgeAddress,
        nonce: nonce,
        gas: 500000,
        data: detinationChainBridge.methods
            .burn(senderPublicKey, 1000)
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
