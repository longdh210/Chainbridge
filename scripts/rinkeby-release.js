const Web3 = require("web3");
const web3 = new Web3("http://localhost:8545");
const { localhostBridge } = require("../config");
const SourceChainBridge = require("../artifacts/contracts//SourceChainBridge.sol/SourceChainBridge.json");

const senderPubKey = "0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266";
const senderPrivateKey =
    "0xac0974bec39a17e36ba4a6b4d238ff944bacb478cbed5efcae784d7bf4f2ff80";

const sourceChainBridge = new web3.eth.Contract(
    SourceChainBridge.abi,
    localhostBridge
);

async function main() {
    const nonce = await web3.eth.getTransactionCount(senderPubKey, "latest"); //get latest nonce

    //the transaction
    const tx = {
        from: senderPubKey,
        to: localhostBridge,
        nonce: nonce,
        gas: 500000,
        data: sourceChainBridge.methods.release(senderPubKey, 1000).encodeABI(),
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
