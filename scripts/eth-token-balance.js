const TokenEth = artifacts.artifactExists("./SourceChainToken.sol");
const Web3 = require("web3");

const web3 = new Web3(
    "https://eth-rinkeby.alchemyapi.io/v2/kAPtSA_EMLRedffB6D1Ehre3rQQ2pmn2"
);
// module.exports = async (done) => {
//     const [sender, _] = await web3.eth.getAccounts();
//     const tokenEth = await TokenEth.deployed();
//     const balance = await tokenEth.balanceOf(sender);
//     console.log(balance.toString());
//     done();
// };
async function main() {
    const [sender, _] = await web3.eth.getAccounts();
    const tokenEth = await TokenEth.deployed();
    const balance = await tokenEth.balanceOf(sender);
    console.log(balance.toString());
}

main()
    .then(() => process.exit(0))
    .catch((error) => {
        console.error(error);
        process.exit(1);
    });
