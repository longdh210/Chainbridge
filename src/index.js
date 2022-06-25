const {
    sourceChainTokenAddress,
    sourceChainBridgeAddress,
} = require("../config");
const SourceChainToken = require("../artifacts/contracts/Token/SourceChainToken.sol/SourceChainToken.json");
const Web3 = require("web3");

const web3 = new Web3(
    "https://eth-rinkeby.alchemyapi.io/v2/kAPtSA_EMLRedffB6D1Ehre3rQQ2pmn2"
);
const sourceChainToken = new web3.eth.Contract(
    SourceChainToken.abi,
    sourceChainTokenAddress
);

const senderPublicKey = "0x3797786150d38aa2588ac2BcFb162a61e2A69638";
const senderPrivateKey =
    "fb810f4d6c526159ebb447c7c4aa2eeadf3b291c5e203f52225928a1dec09d4b";
const receiverAddress = "0x5B9aAEf5292B5D38C30Bb5B0CA65D3960E158b66";

function balance() {
    sourceChainToken.methods
        .balanceOf(senderPublicKey)
        .call(function (err, res) {
            if (err) {
                console.log("An error occured", err);
                return;
            }
            console.log("The balance is: ", res);
        });
}

async function mint() {
    const nonce = await web3.eth.getTransactionCount(senderPublicKey, "latest"); //get latest nonce

    //the transaction
    const tx = {
        from: senderPublicKey,
        to: sourceChainTokenAddress,
        nonce: nonce,
        gas: 500000,
        data: sourceChainToken.methods.mint(senderPublicKey, 1000).encodeABI(),
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

async function updateAdmin() {
    const nonce = await web3.eth.getTransactionCount(senderPublicKey, "latest"); //get latest nonce

    //the transaction
    const tx = {
        from: senderPublicKey,
        to: sourceChainTokenAddress,
        nonce: nonce,
        gas: 500000,
        data: sourceChainToken.methods
            .updateAdmin(sourceChainBridgeAddress)
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

// mint();
updateAdmin();
// balance();
