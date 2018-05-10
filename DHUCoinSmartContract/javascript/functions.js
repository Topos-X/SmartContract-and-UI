$(document).ready(function () {
    //Initiating web3 provider
    if (typeof web3 !== 'undefined') {
        web3 = new Web3(web3.currentProvider);
    } else {
        web3 = new Web3(new Web3.providers.HttpProvider("http://localhost:8545"));
    }

    //Set the default account (Makes the executer in MetaMask as default)
    web3.eth.defaultAccount = web3.eth.accounts[0];

    //ABI for contract
    var DHUCoinContract = web3.eth.contract([
        {
            "constant": false,
            "inputs": [],
            "name": "unhaltICO",
            "outputs": [],
            "payable": false,
            "stateMutability": "nonpayable",
            "type": "function"
        },
        {
            "constant": true,
            "inputs": [],
            "name": "name",
            "outputs": [
                {
                    "name": "",
                    "type": "string"
                }
            ],
            "payable": false,
            "stateMutability": "view",
            "type": "function"
        },
        {
            "constant": false,
            "inputs": [
                {
                    "name": "_spender",
                    "type": "address"
                },
                {
                    "name": "_value",
                    "type": "uint256"
                }
            ],
            "name": "approve",
            "outputs": [
                {
                    "name": "success",
                    "type": "bool"
                }
            ],
            "payable": false,
            "stateMutability": "nonpayable",
            "type": "function"
        },
        {
            "constant": true,
            "inputs": [
                {
                    "name": "",
                    "type": "address"
                }
            ],
            "name": "verified",
            "outputs": [
                {
                    "name": "",
                    "type": "bool"
                }
            ],
            "payable": false,
            "stateMutability": "view",
            "type": "function"
        },
        {
            "constant": false,
            "inputs": [],
            "name": "haltICO",
            "outputs": [],
            "payable": false,
            "stateMutability": "nonpayable",
            "type": "function"
        },
        {
            "constant": true,
            "inputs": [],
            "name": "icoStartBlock",
            "outputs": [
                {
                    "name": "",
                    "type": "uint256"
                }
            ],
            "payable": false,
            "stateMutability": "view",
            "type": "function"
        },
        {
            "constant": false,
            "inputs": [
                {
                    "name": "investor",
                    "type": "address"
                }
            ],
            "name": "removeVerifiedInvestor",
            "outputs": [],
            "payable": false,
            "stateMutability": "nonpayable",
            "type": "function"
        },
        {
            "constant": true,
            "inputs": [],
            "name": "totalSupply",
            "outputs": [
                {
                    "name": "",
                    "type": "uint256"
                }
            ],
            "payable": false,
            "stateMutability": "view",
            "type": "function"
        },
        {
            "constant": true,
            "inputs": [],
            "name": "grantVestedDHUContract",
            "outputs": [
                {
                    "name": "",
                    "type": "address"
                }
            ],
            "payable": false,
            "stateMutability": "view",
            "type": "function"
        },
        {
            "constant": false,
            "inputs": [
                {
                    "name": "newBottomInteger",
                    "type": "uint256"
                }
            ],
            "name": "updatePriceBottomInteger",
            "outputs": [],
            "payable": false,
            "stateMutability": "nonpayable",
            "type": "function"
        },
        {
            "constant": true,
            "inputs": [],
            "name": "mainWallet",
            "outputs": [
                {
                    "name": "",
                    "type": "address"
                }
            ],
            "payable": false,
            "stateMutability": "view",
            "type": "function"
        },
        {
            "constant": false,
            "inputs": [
                {
                    "name": "_from",
                    "type": "address"
                },
                {
                    "name": "_to",
                    "type": "address"
                },
                {
                    "name": "_value",
                    "type": "uint256"
                }
            ],
            "name": "transferFrom",
            "outputs": [
                {
                    "name": "success",
                    "type": "bool"
                }
            ],
            "payable": false,
            "stateMutability": "nonpayable",
            "type": "function"
        },
        {
            "constant": false,
            "inputs": [],
            "name": "liquidate",
            "outputs": [],
            "payable": false,
            "stateMutability": "nonpayable",
            "type": "function"
        },
        {
            "constant": true,
            "inputs": [],
            "name": "decimals",
            "outputs": [
                {
                    "name": "",
                    "type": "uint256"
                }
            ],
            "payable": false,
            "stateMutability": "view",
            "type": "function"
        },
        {
            "constant": true,
            "inputs": [],
            "name": "previousUpdateTime",
            "outputs": [
                {
                    "name": "",
                    "type": "uint256"
                }
            ],
            "payable": false,
            "stateMutability": "view",
            "type": "function"
        },
        {
            "constant": false,
            "inputs": [
                {
                    "name": "newMainWallet",
                    "type": "address"
                }
            ],
            "name": "changeMainWallet",
            "outputs": [],
            "payable": false,
            "stateMutability": "nonpayable",
            "type": "function"
        },
        {
            "constant": true,
            "inputs": [],
            "name": "icoEndBlock",
            "outputs": [
                {
                    "name": "",
                    "type": "uint256"
                }
            ],
            "payable": false,
            "stateMutability": "view",
            "type": "function"
        },
        {
            "constant": false,
            "inputs": [
                {
                    "name": "newTopInteger",
                    "type": "uint256"
                }
            ],
            "name": "updatePriceDHU",
            "outputs": [],
            "payable": false,
            "stateMutability": "nonpayable",
            "type": "function"
        },
        {
            "constant": true,
            "inputs": [
                {
                    "name": "_owner",
                    "type": "address"
                }
            ],
            "name": "balanceOf",
            "outputs": [
                {
                    "name": "balance",
                    "type": "uint256"
                }
            ],
            "payable": false,
            "stateMutability": "view",
            "type": "function"
        },
        {
            "constant": true,
            "inputs": [],
            "name": "priceUpdateWaitingTime",
            "outputs": [
                {
                    "name": "",
                    "type": "uint256"
                }
            ],
            "payable": false,
            "stateMutability": "view",
            "type": "function"
        },
        {
            "constant": false,
            "inputs": [
                {
                    "name": "newIcoEndBlock",
                    "type": "uint256"
                }
            ],
            "name": "changeIcoEndBlock",
            "outputs": [],
            "payable": false,
            "stateMutability": "nonpayable",
            "type": "function"
        },
        {
            "constant": true,
            "inputs": [],
            "name": "setTrading",
            "outputs": [
                {
                    "name": "",
                    "type": "bool"
                }
            ],
            "payable": false,
            "stateMutability": "view",
            "type": "function"
        },
        {
            "constant": false,
            "inputs": [
                {
                    "name": "newIcoStartBlock",
                    "type": "uint256"
                }
            ],
            "name": "changeIcoStartBlock",
            "outputs": [],
            "payable": false,
            "stateMutability": "nonpayable",
            "type": "function"
        },
        {
            "constant": false,
            "inputs": [],
            "name": "enableTrading",
            "outputs": [],
            "payable": false,
            "stateMutability": "nonpayable",
            "type": "function"
        },
        {
            "constant": true,
            "inputs": [],
            "name": "minInvestment",
            "outputs": [
                {
                    "name": "",
                    "type": "uint256"
                }
            ],
            "payable": false,
            "stateMutability": "view",
            "type": "function"
        },
        {
            "constant": false,
            "inputs": [
                {
                    "name": "_spender",
                    "type": "address"
                },
                {
                    "name": "_oldValue",
                    "type": "uint256"
                },
                {
                    "name": "_newValue",
                    "type": "uint256"
                }
            ],
            "name": "changeApproval",
            "outputs": [
                {
                    "name": "success",
                    "type": "bool"
                }
            ],
            "payable": false,
            "stateMutability": "nonpayable",
            "type": "function"
        },
        {
            "constant": true,
            "inputs": [
                {
                    "name": "",
                    "type": "address"
                }
            ],
            "name": "liquidations",
            "outputs": [
                {
                    "name": "tokens",
                    "type": "uint256"
                },
                {
                    "name": "time",
                    "type": "uint256"
                }
            ],
            "payable": false,
            "stateMutability": "view",
            "type": "function"
        },
        {
            "constant": false,
            "inputs": [
                {
                    "name": "amountTokensToLiquidate",
                    "type": "uint256"
                }
            ],
            "name": "requestLiquidation",
            "outputs": [],
            "payable": false,
            "stateMutability": "nonpayable",
            "type": "function"
        },
        {
            "constant": true,
            "inputs": [],
            "name": "symbol",
            "outputs": [
                {
                    "name": "",
                    "type": "string"
                }
            ],
            "payable": false,
            "stateMutability": "view",
            "type": "function"
        },
        {
            "constant": false,
            "inputs": [
                {
                    "name": "amount",
                    "type": "uint256"
                }
            ],
            "name": "removeLiquidity",
            "outputs": [],
            "payable": false,
            "stateMutability": "nonpayable",
            "type": "function"
        },
        {
            "constant": true,
            "inputs": [],
            "name": "currentPrice",
            "outputs": [
                {
                    "name": "topInteger",
                    "type": "uint256"
                },
                {
                    "name": "bottomInteger",
                    "type": "uint256"
                }
            ],
            "payable": false,
            "stateMutability": "view",
            "type": "function"
        },
        {
            "constant": true,
            "inputs": [
                {
                    "name": "amountTokensToLiquidate",
                    "type": "uint256"
                }
            ],
            "name": "checkLiquidationValue",
            "outputs": [
                {
                    "name": "etherValue",
                    "type": "uint256"
                }
            ],
            "payable": false,
            "stateMutability": "view",
            "type": "function"
        },
        {
            "constant": false,
            "inputs": [],
            "name": "buy",
            "outputs": [],
            "payable": true,
            "stateMutability": "payable",
            "type": "function"
        },
        {
            "constant": false,
            "inputs": [
                {
                    "name": "_to",
                    "type": "address"
                },
                {
                    "name": "_value",
                    "type": "uint256"
                }
            ],
            "name": "transfer",
            "outputs": [
                {
                    "name": "success",
                    "type": "bool"
                }
            ],
            "payable": false,
            "stateMutability": "nonpayable",
            "type": "function"
        },
        {
            "constant": false,
            "inputs": [
                {
                    "name": "newPriceUpdateWaitingTime",
                    "type": "uint256"
                }
            ],
            "name": "changePriceUpdateWaitingTime",
            "outputs": [],
            "payable": false,
            "stateMutability": "nonpayable",
            "type": "function"
        },
        {
            "constant": true,
            "inputs": [
                {
                    "name": "_investor",
                    "type": "address"
                }
            ],
            "name": "checkVerification",
            "outputs": [
                {
                    "name": "",
                    "type": "bool"
                }
            ],
            "payable": false,
            "stateMutability": "view",
            "type": "function"
        },
        {
            "constant": true,
            "inputs": [
                {
                    "name": "",
                    "type": "uint256"
                }
            ],
            "name": "prices",
            "outputs": [
                {
                    "name": "topInteger",
                    "type": "uint256"
                },
                {
                    "name": "bottomInteger",
                    "type": "uint256"
                }
            ],
            "payable": false,
            "stateMutability": "view",
            "type": "function"
        },
        {
            "constant": false,
            "inputs": [
                {
                    "name": "newSecondaryWallet",
                    "type": "address"
                }
            ],
            "name": "changeSecondaryWallet",
            "outputs": [],
            "payable": false,
            "stateMutability": "nonpayable",
            "type": "function"
        },
        {
            "constant": true,
            "inputs": [],
            "name": "icoBottomIntegerPrice",
            "outputs": [
                {
                    "name": "",
                    "type": "uint256"
                }
            ],
            "payable": false,
            "stateMutability": "view",
            "type": "function"
        },
        {
            "constant": false,
            "inputs": [
                {
                    "name": "grantVestedDHUContractInput",
                    "type": "address"
                }
            ],
            "name": "setGrantVestedDHUContract",
            "outputs": [],
            "payable": false,
            "stateMutability": "nonpayable",
            "type": "function"
        },
        {
            "constant": true,
            "inputs": [],
            "name": "maxSupply",
            "outputs": [
                {
                    "name": "",
                    "type": "uint256"
                }
            ],
            "payable": false,
            "stateMutability": "view",
            "type": "function"
        },
        {
            "constant": false,
            "inputs": [
                {
                    "name": "_investor",
                    "type": "address"
                }
            ],
            "name": "verifyInvestor",
            "outputs": [],
            "payable": false,
            "stateMutability": "nonpayable",
            "type": "function"
        },
        {
            "constant": false,
            "inputs": [
                {
                    "name": "investor",
                    "type": "address"
                }
            ],
            "name": "buyTo",
            "outputs": [],
            "payable": true,
            "stateMutability": "payable",
            "type": "function"
        },
        {
            "constant": true,
            "inputs": [
                {
                    "name": "_owner",
                    "type": "address"
                },
                {
                    "name": "_spender",
                    "type": "address"
                }
            ],
            "name": "allowance",
            "outputs": [
                {
                    "name": "remaining",
                    "type": "uint256"
                }
            ],
            "payable": false,
            "stateMutability": "view",
            "type": "function"
        },
        {
            "constant": false,
            "inputs": [],
            "name": "addLiquidity",
            "outputs": [],
            "payable": true,
            "stateMutability": "payable",
            "type": "function"
        },
        {
            "constant": true,
            "inputs": [],
            "name": "secondaryWallet",
            "outputs": [
                {
                    "name": "",
                    "type": "address"
                }
            ],
            "payable": false,
            "stateMutability": "view",
            "type": "function"
        },
        {
            "inputs": [
                {
                    "name": "secondaryWalletInput",
                    "type": "address"
                },
                {
                    "name": "priceTopIntegerInput",
                    "type": "uint256"
                },
                {
                    "name": "startBlockInput",
                    "type": "uint256"
                },
                {
                    "name": "endBlockInput",
                    "type": "uint256"
                }
            ],
            "payable": false,
            "stateMutability": "nonpayable",
            "type": "constructor"
        },
        {
            "payable": true,
            "stateMutability": "payable",
            "type": "fallback"
        },
        {
            "anonymous": false,
            "inputs": [
                {
                    "indexed": true,
                    "name": "investor",
                    "type": "address"
                }
            ],
            "name": "Verification",
            "type": "event"
        },
        {
            "anonymous": false,
            "inputs": [
                {
                    "indexed": true,
                    "name": "investor",
                    "type": "address"
                },
                {
                    "indexed": false,
                    "name": "amountTokens",
                    "type": "uint256"
                }
            ],
            "name": "LiquidationCall",
            "type": "event"
        },
        {
            "anonymous": false,
            "inputs": [
                {
                    "indexed": true,
                    "name": "investor",
                    "type": "address"
                },
                {
                    "indexed": false,
                    "name": "amountTokens",
                    "type": "uint256"
                },
                {
                    "indexed": false,
                    "name": "etherAmount",
                    "type": "uint256"
                }
            ],
            "name": "Liquidations",
            "type": "event"
        },
        {
            "anonymous": false,
            "inputs": [
                {
                    "indexed": true,
                    "name": "investor",
                    "type": "address"
                },
                {
                    "indexed": true,
                    "name": "beneficiary",
                    "type": "address"
                },
                {
                    "indexed": false,
                    "name": "ethValue",
                    "type": "uint256"
                },
                {
                    "indexed": false,
                    "name": "amountTokens",
                    "type": "uint256"
                }
            ],
            "name": "Buy",
            "type": "event"
        },
        {
            "anonymous": false,
            "inputs": [
                {
                    "indexed": false,
                    "name": "topInteger",
                    "type": "uint256"
                },
                {
                    "indexed": false,
                    "name": "bottomInteger",
                    "type": "uint256"
                }
            ],
            "name": "PriceDHUUpdate",
            "type": "event"
        },
        {
            "anonymous": false,
            "inputs": [
                {
                    "indexed": false,
                    "name": "etherAmount",
                    "type": "uint256"
                }
            ],
            "name": "AddLiquidity",
            "type": "event"
        },
        {
            "anonymous": false,
            "inputs": [
                {
                    "indexed": false,
                    "name": "etherAmount",
                    "type": "uint256"
                }
            ],
            "name": "RemoveLiquidity",
            "type": "event"
        },
        {
            "anonymous": false,
            "inputs": [
                {
                    "indexed": false,
                    "name": "status",
                    "type": "bool"
                }
            ],
            "name": "ValidationStatus",
            "type": "event"
        },
        {
            "anonymous": false,
            "inputs": [
                {
                    "indexed": false,
                    "name": "block",
                    "type": "uint256"
                }
            ],
            "name": "ICOBlockChanged",
            "type": "event"
        },
        {
            "anonymous": false,
            "inputs": [
                {
                    "indexed": false,
                    "name": "newAddress",
                    "type": "address"
                }
            ],
            "name": "WalletChanged",
            "type": "event"
        },
        {
            "anonymous": false,
            "inputs": [
                {
                    "indexed": true,
                    "name": "_from",
                    "type": "address"
                },
                {
                    "indexed": true,
                    "name": "_to",
                    "type": "address"
                },
                {
                    "indexed": false,
                    "name": "_value",
                    "type": "uint256"
                }
            ],
            "name": "Transfer",
            "type": "event"
        },
        {
            "anonymous": false,
            "inputs": [
                {
                    "indexed": true,
                    "name": "_owner",
                    "type": "address"
                },
                {
                    "indexed": true,
                    "name": "_spender",
                    "type": "address"
                },
                {
                    "indexed": false,
                    "name": "_value",
                    "type": "uint256"
                }
            ],
            "name": "Approval",
            "type": "event"
        }
    ]);

    //Creates an instance of the contract
    var _DHUCoinContract = DHUCoinContract.at('0x7113718a0b61a5bc94c97f0bc79384006cfc59a7');

    var curEvent;
    var Events = {
        "ValidateEvent": 1,
        "InvalidateEvent": 2,
        "StartBlockChangeEvent": 3,
        "EndBlockChangeEvent": 4,
        "MainWalletChangeEvent": 5,
        "SecondaryWalletChangeEvent": 6
    }

    //button to whitelist an address
    $("#btnVerify").click(function () {
        ResetNavbar();
        var _toVerifyAdd = $("#toVerifyAdd").val();
        //Input check
        if (isEmpty(_toVerifyAdd) || !isNumber(_toVerifyAdd)) {
            InvalidAddressAlert();
            return;
        }

        showHideLoader(1);
        _DHUCoinContract.verifyInvestor(_toVerifyAdd, (err, res) => {
            if (err) {
                showHideLoader(0);
            }
        });
        curEvent = Events["ValidateEvent"];
    });

    //button for blacklist an address
    $("#btnRemoveAdd").click(function () {
        ResetNavbar();
        var _addToRemove = $("#addToRemove").val();

        //Input check
        if (isEmpty(_addToRemove) || !isNumber(_addToRemove)) {
            InvalidAddressAlert();
            return;
        }

        showHideLoader(1);
        _DHUCoinContract.removeVerifiedInvestor(_addToRemove, (err, res) => {
            if (err) {
                showHideLoader(0);
            }
        });
        curEvent = Events["InvalidateEvent"];
    });

    //Common event for verifation
    var verificationEvent = _DHUCoinContract.Verification({}, 'latest');

    verificationEvent.watch(function (error, result) {
        if (!error) {
            TransactionComplete(result);
            switch (curEvent) {
                case Events["ValidateEvent"]:
                    $("#transactionResult").html('Address verified: ' + result.args.investor);
                    break;
                case Events["InvalidateEvent"]:
                    $("#transactionResult").html('Address removed: ' + result.args.investor);
                    break;
            }

        } else {
            alert("Something went wrong!");
            showHideLoader(0);
        }
    });

    //Button to update main wallet
    $("#btnNewMW").click(function () {
        ResetNavbar();
        var _addMW = $("#addMW").val();

        //Input check
        if (isEmpty(_addMW) || !isNumber(_addMW)) {
            InvalidAddressAlert();
            return;
        }

        showHideLoader(1);
        _DHUCoinContract.changeMainWallet(_addMW, (err, res) => {
            if (err) {
                showHideLoader(0);
            } else {
                $("#TransHash").html('Transaction Hash: ' + res);
                showHideLoader(0);
            }
        });
    });

    //Button to update secondary wallet
    $("#btnNewSW").click(function () {
        ResetNavbar();
        var _addSW = $("#addSW").val();

        //Input check
        if (isEmpty(_addSW) || !isNumber(_addSW)) {
            InvalidAddressAlert();
            return;
        }

        showHideLoader(1);
        _DHUCoinContract.changeSecondaryWallet(_addSW, (err, res) => {
            if (err) {
                showHideLoader(0);
            } else {
                $("#TransHash").html('Transaction Hash: ' + res);
                showHideLoader(0);
            }
        });
    });

    //Event for checking start/end block
    var WalletChangeEvent = _DHUCoinContract.WalletChanged({}, 'latest');

    WalletChangeEvent.watch(function (error, result) {
        if (!error) {
            TransactionComplete(result);

            switch (curEvent) {
                case Events["MainWalletChangeEvent"]:
                    $("#transactionResult").html('New Main Wallet: ' + result.args.newAddress);
                    break;
                case Events["SecondaryWalletChangeEvent"]:
                    $("#transactionResult").html('New Secondary Wallet: ' + result.args.newAddress);
                    break;
                default:
                    alert("Something went wrong!");
            }

        } else {
            alert("Something went wrong!");
            showHideLoader(0);
        }
    });

    //Button to update ICO start block
    $("#btnNewStartBlock").click(function () {
        ResetNavbar();
        var _newStartBlock = $("#newStartBlock").val();
        showHideLoader(1);
        _DHUCoinContract.changeIcoStartBlock(_newStartBlock, (err, res) => {
            if (err) {
                showHideLoader(0);
            } else {
                $("#TransHash").html('Transaction Hash: ' + res);
                showHideLoader(0);
            }
        });
    });

    //Button to update ICO End block
    $("#btnNewEndBlock").click(function () {
        ResetNavbar();
        var _newEndBlock = $("#newEndBlock").val();
        showHideLoader(1);
        _DHUCoinContract.changeIcoEndBlock(_newEndBlock, (err, res) => {
            if (err) {
                showHideLoader(0);
            } else {
                $("#TransHash").html('Transaction Hash: ' + res);
                showHideLoader(0);
            }
        });
    });

    //Event for checking start/end block
    var ICOBlockChangeEvent = _DHUCoinContract.ICOBlockChanged({}, 'latest');

    ICOBlockChangeEvent.watch(function (error, result) {
        if (!error) {
            TransactionComplete(result);

            switch (curEvent) {
                case Events["StartBlockChangeEvent"]:
                    $("#transactionResult").html('New ICO start block: ' + result.args.block);
                    break;
                case Events["EndBlockChangeEvent"]:
                    $("#transactionResult").html('New ICO end block: ' + result.args.block);
                    break;
                default:
                    alert("Something went wrong!");
            }

        } else {
            alert("Something went wrong!");
            showHideLoader(0);
        }
    });

    //Button to enable trading
    $("#btnEnableTrading").click(function () {
        ResetNavbar();
        showHideLoader(1);
        _DHUCoinContract.enableTrading((err, res) => {
            if (err) {
                showHideLoader(0);
            } else {
                $("#TransHash").html('Transaction Hash: ' + res);
                showHideLoader(0);
            }
        });
    });

    //Button to liquidate
    $("#btnLiquidate").click(function () {
        ResetNavbar();
        showHideLoader(1);
        _DHUCoinContract.liquidate((err, res) => {
            if (err) {
                showHideLoader(0);
            }
        });
    });

    //Event for liquidation
    var LiquidateEvent = _DHUCoinContract.Liquidations({}, 'latest');

    LiquidateEvent.watch(function (error, result) {
        if (!error) {
            TransactionComplete(result);
            $("#transactionResult").html('Investor: ' + result.args.investor + ', Amount of tokens: ' + result.args.amountTokens + ', Amount of Ether: ' + result.args.etherAmount);
        } else {
            alert("Something went wrong!");
            showHideLoader(0);
        }
    });

    //button to halt ICO
    $("#btnHaltICO").click(function () {
        ResetNavbar();
        showHideLoader(1);
        _DHUCoinContract.haltICO((err, res) => {
            if (err) {
                showHideLoader(0);
            } else {
                $("#TransHash").html('Transaction Hash: ' + res);
                showHideLoader(0);
            }
        });
    });

    //button to unhalt ICO
    $("#btnUnhaltICO").click(function () {
        ResetNavbar();
        showHideLoader(1);
        _DHUCoinContract.unhaltICO((err, res) => {
            if (err) {
                showHideLoader(0);
            } else {
                $("#TransHash").html('Transaction Hash: ' + res);
                showHideLoader(0);
            }
        });
    });

    //Button to Request liquidation
    $("#btnRequestLiquidation").click(function () {
        ResetNavbar();
        var _tokensToLiquidate = $("#tokensToLiquidate").val();
        showHideLoader(1);
        _DHUCoinContract.requestLiquidation(_tokensToLiquidate, (err, res) => {
            if (err) {
                showHideLoader(0);
            }
        });
    });

    //Event for liquidation request
    var RequestLiquidateEvent = _DHUCoinContract.LiquidationCall({}, 'latest');

    RequestLiquidateEvent.watch(function (error, result) {
        if (!error) {
            TransactionComplete(result);
            $("#transactionResult").html('Investor: ' + result.args.investor + ', Amount of tokens: ' + result.args.amountTokens);
        } else {
            alert("Something went wrong!");
            showHideLoader(0);
        }
    });


    //Button to add liquidity
    $("#btnAddLiquidity").click(function () {
        ResetNavbar();
        showHideLoader(1);
        _DHUCoinContract.addLiquidity((err, res) => {
            if (err) {
                showHideLoader(0);
            }
        });
    });

    //Event for adding liquidity
    var Addliquidity = _DHUCoinContract.AddLiquidity({}, 'latest');

    Addliquidity.watch(function (error, result) {
        if (!error) {
            TransactionComplete(result);
            $("#transactionResult").html('Amount of ether: ' + result.args.etherAmount);
        } else {
            alert("Something went wrong!");
            showHideLoader(0);
        }
    });

    //Button to remove liquidity
    $("#btnRemoveLiquidity").click(function () {
        ResetNavbar();
        var _tokensToRemoveLiq = $("#tokensToRemoveLiq").val();
        showHideLoader(1);
        _DHUCoinContract.removeLiquidity(_tokensToRemoveLiq, (err, res) => {
            if (err) {
                showHideLoader(0);
            }
        });
    });

    //Event for removing liquidity
    var RemoveLiquidityEvent = _DHUCoinContract.RemoveLiquidity({}, 'latest');

    RemoveLiquidityEvent.watch(function (error, result) {
        if (!error) {
            TransactionComplete(result);
            $("#transactionResult").html('Amount of ether: ' + result.args.etherAmount);
        } else {
            alert("Something went wrong!");
            showHideLoader(0);
        }
    });

    //button for setting grant vested contract
    $("#btnSetVestedContract").click(function () {
        ResetNavbar();
        var _vestedContractAdd = $("#vestedContractAdd").val();
        //Input check
        if (isEmpty(_vestedContractAdd) || !isNumber(_vestedContractAdd)) {
            InvalidAddressAlert();
            return;
        }
        showHideLoader(1);
        _DHUCoinContract.setGrantVestedDHUContract(_vestedContractAdd, (err, res) => {
            if (err) {
                showHideLoader(0);
            } else {
                $("#TransHash").html('Transaction Hash: ' + res);
                showHideLoader(0);
            }
        });
    });

    //button to update top price integer
    $("#btnUpdatePrice").click(function () {
        ResetNavbar();
        showHideLoader(1);
        var _updatePriceTop = $("#updatePriceTop").val();
        _DHUCoinContract.updatePriceDHU(_updatePriceTop, (err, res) => {
            if (err) {
                showHideLoader(0);
            }
        });
    });

    //button to update bottom price integer
    $("#btnUpdateBtmPrice").click(function () {
        ResetNavbar();
        showHideLoader(1);
        var _updatePriceBtm = $("#updatePriceBtm").val();
        _DHUCoinContract.updatePriceBottomInteger(_updatePriceBtm, (err, res) => {
            if (err) {
                showHideLoader(0);
            }
        });
    });

    //Common event for getting updated price
    var updatePriceEvent = _DHUCoinContract.PriceDHUUpdate({}, 'latest');

    updatePriceEvent.watch(function (error, result) {
        if (!error) {
            TransactionComplete(result);
            $("#transactionResult").html('Price updated: priceNumerator: ' + result.args.topInteger + ', priceDenominator: ' + result.args.bottomInteger);
        } else {
            alert("Something went wrong!");
            showHideLoader(0);
        }
    });

    //button for checking if verified or not
    $("#btnCheckVer").click(function () {
        ResetNavbar();
        var _addToChk = $("#addToChk").val();
        //Input check
        if (isEmpty(_addToChk) || !isNumber(_addToChk)) {
            InvalidAddressAlert();
            return;
        }
        showHideLoader(1);

        _DHUCoinContract.verified(_addToChk, (err, res) => {
            if (err) {
                showHideLoader(0);
            } else {
                ResetNavbar();
                $("#transactionResult").html('Verified: ' + res);
            }
        });
    });

    //button for checking total supply
    $("#btnCheckSup").click(function () {
        ResetNavbar();
        showHideLoader(1);
        _DHUCoinContract.totalSupply((err, res) => {
            if (err) {
                showHideLoader(0);
            } else {
                ResetNavbar();
                $("#transactionResult").html('Total supply: ' + res / Math.pow(10, 18) + ' DHU');
            }
        });
    });

    //Button for checking symbol
    $("#btnCheckSym").click(function () {
        ResetNavbar();
        showHideLoader(1);
        _DHUCoinContract.symbol((err, res) => {
            if (err) {
                showHideLoader(0);
            } else {
                ResetNavbar();
                $("#transactionResult").html('Current symbol: ' + res);
            }
        });
    });

    //Button to check contract name
    $("#btnCheckName").click(function () {
        ResetNavbar();
        showHideLoader(1);
        _DHUCoinContract.name((err, res) => {
            if (err) {
                showHideLoader(0);
            } else {
                ResetNavbar();
                $("#transactionResult").html('Contract name: ' + res);
            }
        });
    });

    //Button for checking ICO start block
    $("#btnCheckSBlk").click(function () {
        ResetNavbar();
        showHideLoader(1);
        _DHUCoinContract.icoStartBlock((err, res) => {
            if (err) {
                showHideLoader(0);
            } else {
                ResetNavbar();
                $("#transactionResult").html('Crowd sale starts at block No. ' + res);
            }
        });
    });

    //Button for checking ICO end block
    $("#btnCheckEBlk").click(function () {
        ResetNavbar();
        showHideLoader(1);
        _DHUCoinContract.icoEndBlock((err, res) => {
            if (err) {
                showHideLoader(0);
            } else {
                ResetNavbar();
                $("#transactionResult").html('Crowd sale ends at block No. ' + res);
            }
        });
    });

    //Button for checking balance of people
    $("#btnCheckBal").click(function () {
        ResetNavbar();
        var _addToChkBal = $("#addToChkBal").val();
        //Input check
        if (isEmpty(_addToChkBal) || !isNumber(_addToChkBal)) {
            InvalidAddressAlert();
            return;
        }
        showHideLoader(1);

        _DHUCoinContract.balanceOf(_addToChkBal, (err, res) => {
            if (err) {
                showHideLoader(0);
            } else {
                ResetNavbar();
                $("#transactionResult").html('Balance: ' + res / Math.pow(10, 18) + ' DHU');
            }
        });
    });

    //Button to check liquidation
    $("#btnCheckLiq").click(function () {
        ResetNavbar();
        var _valLiquidChk = $("#valLiquidChk").val();
        showHideLoader(1);
        _DHUCoinContract.checkLiquidationValue(_valLiquidChk, (err, res) => {
            if (err) {
                showHideLoader(0);
            } else {
                ResetNavbar();
                $("#transactionResult").html('Liquidation value: ' + res);
            }
        });
    });

    //Button for checking Max supply
    $("#btnMaxSupply").click(function () {
        ResetNavbar();
        showHideLoader(1);
        _DHUCoinContract.maxSupply((err, res) => {
            if (err) {
                showHideLoader(0);
            } else {
                ResetNavbar();
                $("#transactionResult").html('Max Supply: ' + res / Math.pow(10, 18) + ' DHU');
            }
        });
    });

    //Button for checking set trading status 
    $("#btnSetTrading").click(function () {
        ResetNavbar();
        showHideLoader(1);
        _DHUCoinContract.setTrading((err, res) => {
            if (err) {
                showHideLoader(0);
            } else {
                ResetNavbar();
                $("#transactionResult").html('Set Trading: ' + res);
            }
        });
    });

    //button for checking liquidation request status
    $("#btnChkLiqReqSta").click(function () {
        ResetNavbar();
        var _addLiquidations = $("#addLiquidations").val();
        //Input check
        if (isEmpty(_addLiquidations) || !isNumber(_addLiquidations)) {
            InvalidAddressAlert();
            return;
        }
        showHideLoader(1);

        _DHUCoinContract.liquidations(_addLiquidations, (err, res) => {
            if (err) {
                showHideLoader(0);
            } else {
                ResetNavbar();
                $("#transactionResult").html('Tokens: ' + res[0] + ', Time: ' + res[1]);
            }
        });
    });

    //Button for checking secondary wallet
    $("#btnChkSecWallet").click(function () {
        ResetNavbar();
        showHideLoader(1);
        _DHUCoinContract.secondaryWallet((err, res) => {
            if (err) {
                showHideLoader(0);
            } else {
                ResetNavbar();
                $("#transactionResult").html('Secondary wallet: ' + res);
            }
        });
    });

    //Button for checking main wallet
    $("#btnChkMainWallet").click(function () {
        ResetNavbar();
        showHideLoader(1);
        _DHUCoinContract.mainWallet((err, res) => {
            if (err) {
                showHideLoader(0);
            } else {
                ResetNavbar();
                $("#transactionResult").html('Main wallet: ' + res);
            }
        });
    });

    //Button for checking granted vesting contract address
    $("#btnChkGVCA").click(function () {
        ResetNavbar();
        showHideLoader(1);
        _DHUCoinContract.grantVestedDHUContract((err, res) => {
            if (err) {
                showHideLoader(0);
            } else {
                ResetNavbar();
                $("#transactionResult").html('Grant vested DHU contract address: ' + res);
            }
        });
    });

    //Button for checking price update waiting time
    $("#btnChkPriceUp").click(function () {
        ResetNavbar();
        showHideLoader(1);
        _DHUCoinContract.priceUpdateWaitingTime((err, res) => {
            if (err) {
                showHideLoader(0);
            } else {
                ResetNavbar();
                $("#transactionResult").html('Price update wait time: ' + res + ' sec' + ' (' + res / 60 / 60 + ' hr/hrs)');
            }
        });
    });

    //button for checking DHU price
    $("#btnChkDHUPri").click(function () {
        ResetNavbar();
        var _valDHUPrice = $("#valDHUPrice").val();
        showHideLoader(1);

        _DHUCoinContract.prices(_valDHUPrice, (err, res) => {
            if (err) {
                showHideLoader(0);
            } else {
                ResetNavbar();
                $("#transactionResult").html('Top Integer: ' + res[0] + ', Bottom Integer: ' + res[1]);
            }
        });
    });

    //Button for checking min investment value
    $("#btnChkMinInv").click(function () {
        ResetNavbar();
        showHideLoader(1);
        _DHUCoinContract.minInvestment((err, res) => {
            if (err) {
                showHideLoader(0);
            } else {
                ResetNavbar();
                $("#transactionResult").html('Min investment value: ' + res / Math.pow(10, 18) + ' ETH');
            }
        });
    });

    //Button for checking ICO bottom Integer
    $("#btnChkICOBtm").click(function () {
        ResetNavbar();
        showHideLoader(1);
        _DHUCoinContract.icoBottomIntegerPrice((err, res) => {
            if (err) {
                showHideLoader(0);
            } else {
                ResetNavbar();
                $("#transactionResult").html('ICO bottom integer: ' + res);
            }
        });
    });

    //Button for checking decimals
    $("#btnChkDecimals").click(function () {
        ResetNavbar();
        showHideLoader(1);
        _DHUCoinContract.decimals((err, res) => {
            if (err) {
                showHideLoader(0);
            } else {
                ResetNavbar();
                $("#transactionResult").html('Decimals: ' + res);
            }
        });
    });

    //Button for checking current price
    $("#btnChkCurPrice").click(function () {
        ResetNavbar();
        showHideLoader(1);
        _DHUCoinContract.currentPrice((err, res) => {
            if (err) {
                showHideLoader(0);
            } else {
                ResetNavbar();
                $("#transactionResult").html('Top Integer: ' + res[0] + ', Bottom Integer: ' + res[1]);
            }
        });
    });

    //button for changing price update wait time
    $("#btnChngPriUpdTime").click(function () {
        ResetNavbar();
        var _valChngPriUpdTime = $("#valChngPriUpdTime").val();
        showHideLoader(1);

        _DHUCoinContract.changePriceUpdateWaitingTime(_valChngPriUpdTime, (err, res) => {
            if (err) {
                showHideLoader(0);
            } else {
                $("#TransHash").html('Transaction Hash: ' + res);
                showHideLoader(0);
            }
        });
    });

    //Clear navbar
    function ResetNavbar() {
        showHideLoader(0);
        $("#insTrans").html('');
        $("#transBlock").html('');
        $("#TransHash").html('');
        $("#transactionResult").html('');
    }

    //Common info function (only on successful transaction)
    function TransactionComplete(block) {
        if (block.blockHash != $("#insTrans").html())
            showHideLoader(0);
        $("#insTrans").html('Block hash: ' + block.blockHash);
        $("#transBlock").html('Transaction Block: ' + block.blockNumber);
    }

    //Alert if no address is found
    function InvalidAddressAlert() {
        alert('Please enter a valid address');
    }

    //Empty string check
    function isEmpty(str) {
        return (!str || 0 === str.length);
    }

    //Loading image switch (0: off, 1: on)
    function showHideLoader(onOff) {
        if (onOff == 1) {
            var sLoader = $("#loader").show();
        } else {
            var hLoader = $("#loader").hide();
        }
    }

    //Check if input is a number (address)
    function isNumber(str) {
        if (isNaN(str)) {
            return false;
        } else {
            return true;
        }
    }
});