const hre = require("hardhat");

async function main() {
    // Check network
    if (hre.network.name == "rinkeby") {
        // Deploy source chain token
        const SourceChainToken = await hre.ethers.getContractFactory(
            "SourceChainToken"
        );
        const sourceChainToken = await SourceChainToken.deploy();
        await sourceChainToken.deployed();
        console.log(
            "Source chain token deployed to:",
            sourceChainToken.address
        );

        // Deploy source chain bridge
        const SourceChainBridge = await hre.ethers.getContractFactory(
            "SourceChainBridge"
        );
        const sourceChainbridge = await SourceChainBridge.deploy(
            sourceChainToken.address
        );
        await sourceChainbridge.deployed();
        console.log(
            "Source chain bridge deployed to:",
            sourceChainbridge.address
        );
    }
    if (hre.network.name == "goerli") {
        // Deploy destination chain token
        const DestinationChainToken = await hre.ethers.getContractFactory(
            "DestinationChainToken"
        );
        const destinationChainToken = await DestinationChainToken.deploy();
        await destinationChainToken.deployed();
        console.log(
            "Destination chain token deployed to:",
            destinationChainToken.address
        );

        // Deploy destination chain bridge
        const DestinationChainBridge = await hre.ethers.getContractFactory(
            "DestinationChainBridge"
        );
        const destinationChainbridge = await DestinationChainBridge.deploy(
            destinationChainToken.address
        );
        await destinationChainbridge.deployed();
        console.log(
            "Destination chain bridge deployed to:",
            destinationChainbridge.address
        );
    }

    if (hre.network.name == "localhost") {
        // Deploy source chain token
        const Token = await hre.ethers.getContractFactory("TokenERC20");
        const token = await Token.deploy("Test", "T");
        await token.deployed();
        console.log("Source chain token deployed to:", token.address);

        // Deploy source chain bridge
        const SourceChainBridge = await hre.ethers.getContractFactory(
            "SourceChainBridge"
        );
        const sourceChainBridge = await SourceChainBridge.deploy(token.address);
        await sourceChainBridge.deployed();
        console.log(
            "Source chain bridge deployed to:",
            sourceChainBridge.address
        );
    }
}

main()
    .then(() => process.exit(0))
    .catch((error) => {
        console.error(error);
        process.exit(1);
    });
