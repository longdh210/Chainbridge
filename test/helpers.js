const Ethers = require("ethers");

const blankFunctionSig = "0x00000000";
const blackFunctionDepositerOffset = 0;
const AbiCoder = new Ethers.utils.AbiCoder();
const mpcAddress = "0x3797786150d38aa2588ac2BcFb162a61e2A69638";
const mpcPrivateKey =
    "fb810f4d6c526159ebb447c7c4aa2eeadf3b291c5e203f52225928a1dec09d4b";

const toHex = (convertThis, padding) => {
    return Ethers.utils.hexZeroPad(Ethers.utils.hexlify(convertThis), padding);
};

const abiEncode = (valueTypes, values) => {
    return AbiCoder.encode(valueTypes, values);
};

const getFunctionSignature = (contractInstance, functionName) => {
    return contractInstance.abi.filter(
        (abiProperty) => abiProperty.name === functionName
    )[0].signature;
};

const createCallData = (contractInstance, functionName, valueTypes, values) => {
    let signature = getFunctionSignature(contractInstance, functionName);
    let encodedABI = abiEncode(valueTypes, values);
    return signature + encodedABI.substring(2);
};

const createERCDepositData = (
    tokenAmountOrID,
    lenRecipientAddress,
    recipientAddress
) => {
    return (
        "0x" +
        toHex(tokenAmountOrID, 32).substring(2) +
        toHex(lenRecipientAddress, 32).substring(2) +
        recipientAddress.substring(2)
    );
};

const createERCWithdrawData = (
    tokenAddress,
    recipientAddress,
    tokenAmountOrID
) => {
    return (
        "0x" +
        toHex(tokenAddress, 32).substring(2) +
        toHex(recipientAddress, 32).substring(2) +
        toHex(tokenAmountOrID, 32).substring(2)
    );
};

const createResourceID = (contractAddress, domainID) => {
    return toHex(contractAddress + toHex(domainID, 1).substring(2), 32);
};

const nonceAndId = (nonce, id) => {
    return (
        Ethers.utils.hexZeroPad(Ethers.utils.hexlify(nonce), 8) +
        Ethers.utils.hexZeroPad(Ethers.utils.hexlify(id), 1).substring(2)
    );
};

const signDataWithMpc = async (
    originDomainID,
    destinationDomainID,
    depositNonce,
    depositData,
    resourceID
) => {
    const signingKey = new Ethers.utils.SigningKey(mpcPrivateKey);

    const messageHash = Ethers.utils.solidityKeccak256(
        ["uint8", "uint8", "uint64", "bytes", "bytes32"],
        [
            originDomainID,
            destinationDomainID,
            depositNonce,
            depositData,
            resourceID,
        ]
    );

    const signature = signingKey.signDigest(messageHash);
    const rawSignature = Ethers.utils.joinSignature(signature);
    return rawSignature;
};

module.exports = {
    blankFunctionSig,
    blackFunctionDepositerOffset,
    mpcAddress,
    mpcPrivateKey,
    toHex,
    abiEncode,
    getFunctionSignature,
    createCallData,
    createERCDepositData,
    createERCWithdrawData,
    createResourceID,
    nonceAndId,
    signDataWithMpc,
};
