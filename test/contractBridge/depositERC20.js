const Helpers = require("../helpers");

const BridgeContract = require("../../artifacts/contracts/Bridge.sol/Bridge.json");
const ERC20MintableContract = require("../../artifacts/@openzeppelin/contracts/token/ERC20/presets/ERC20PresetMinterPauser.sol/ERC20PresetMinterPauser.json");
const ERC20HandlerContract = require("../../artifacts/contracts/handlers/ERC20Handler.sol/ERC20Handler.json");
const { assert } = require("chai");
// const { inputToConfig } = require("@ethereum-waffle/compiler");
// const { assert } = require("chai");
// const { isBigNumberish } = require("@ethersproject/bignumber/lib/bignumber");

contract("Bridge - [deposit - ERC20]", async (accounts) => {
    const originDonmainID = 1;
    const destinationDomainID = 2;
    const depositerAddress = accounts[1];
    const recipientAddress = accounts[2];

    const originChainInitialTokenAmount = 100;
    const depositAmount = 10;
    const expectedDepositNonce = 1;
    const feeData = "0x";

    let BridgeInstance;
    let OriginERC20MintableInstance;
    let OriginERC20HandlerInstance;
    let depositData;

    beforeEach(async () => {
        await Promise.all([
            ERC20MintableContract.new("token", "TOK").then(
                (instance) => (OriginERC20MintableInstance = instance)
            ),
            (BridgeInstance = await BridgeContract.new(originDonmainID)),
        ]);

        resourceID = Helpers.createResourceID(
            OriginERC20HandlerInstance.address,
            originDonmainID
        );

        OriginERC20HandlerInstance = await ERC20HandlerContract.new(
            BridgeContract.address
        );

        await Promise.all([
            BridgeInstance.adminSetResource(
                OriginERC20HandlerInstance.address,
                resourceID,
                OriginERC20MintableInstance.address
            ),
            OriginERC20MintableInstance.mint(
                depositerAddress,
                originChainInitialTokenAmount
            ),
        ]);
        await OriginERC20MintableInstance.approve(
            OriginERC20HandlerInstance.address,
            depositAmount * 2,
            { from: depositerAddress }
        );

        depositData = Helpers.createERCDepositData(
            depositAmount,
            20,
            recipientAddress
        );

        // set MPC address to unpause the Bridge
        await BridgeInstance.endKeygen(Helpers.mpcAddress);
    });

    it("[sanity] test depositerAddress' balance", async () => {
        const originChainDepositerBalance =
            await OriginERC20MintableInstance.balanceOf(depositerAddress);
        assert.strictEqual(
            originChainDepositerBalance.toNumber(),
            originChainInitialTokenAmount
        );
    });

    it("[sanity] test OriginERC20HandlerInstance.address' allowance", async () => {
        const originChainHandlerAllowance =
            await OriginERC20MintableInstance.allowance(
                depositerAddress,
                OriginERC20HandlerInstance.address
            );
        assert.strictEqual(
            originChainHandlerAllowance.toNumber(),
            depositAmount * 2
        );
    });

    it("_depositCounts should be increments from 0 to 1", async () => {
        await BridgeInstance.deposit(
            destinationDomainID,
            resourceID,
            depositData,
            feeData,
            { from: depositerAddress }
        );

        const depositCount = await BridgeInstance._depositCounts.call(
            destinationDomainID
        );
        assert.strictEqual(depositCount.toNumber(), expectedDepositNonce);
    });

    it("ERC20 can be deposited with correct balances", async () => {
        await BridgeInstance.deposit(
            destinationDomainID,
            resourceID,
            depositData,
            feeData,
            { from: depositerAddress }
        );

        const originChainDepositerBalance =
            await OriginERC20MintableInstance.balanceOf(depositerAddress);
        assert.strictEqual(
            originChainDepositerBalance.toNumber(),
            originChainInitialTokenAmount - depositAmount
        );

        const originChainHandlerBalance =
            await OriginERC20MintableInstance.balanceOf(
                OriginERC20HandlerInstance.address
            );
        assert.strictEqual(originChainHandlerBalance.toNumber(), depositAmount);
    });
});
