const Web3 = require("web3");
const web3 = new Web3("http://localhost:8545");
const { localhostTokenAddress } = require("../config");
const SourceChainToken = require("../artifacts/contracts/Token/ERC20.sol/TokenERC20.json");

const balance = () => {
    const recipient = "0xe7f1725E7734CE288F8367e1Bb143E90bb3F0512";
    const tokenContract = new web3.eth.Contract(
        SourceChainToken.abi,
        localhostTokenAddress
    );
    tokenContract.methods.balanceOf(recipient).call(function (err, res) {
        if (err) {
            console.log("An error occurred", err);
            return;
        }
        console.log("The balance is:", res);
    });
};

balance();
