const { Client, PrivateKey, Mnemonic, Wallet, AccountCreateTransaction, AccountBalanceQuery, Hbar, TransferTransaction, AccountInfoQuery} = require("@hashgraph/sdk");
const Web3 = require("web3");
const web3 = new Web3(new Web3.providers.HttpProvider('https://goerli.infura.io/v3/2ff47e51ff1f4804865ba892c7efc70c'));
async function main() {


//     const client = Client.forTestnet()
//     client.setOperator("0.0.3656124", "3030020100300706052b8104000a042204209261b083cd3a7298615a7bea0101c0144f6bb19b62cbd36b2176ccc97fe283d9");
//     // const wallet = await Wallet.createRandomECDSA();
//     // const wallet1 = await Wallet.createRandomED25519();
//     // console.log(wallet,wallet1)
//     // const transaction = await new AccountCreateTransaction().setKey(wallet1.).setInitialBalance(new Hbar(0));
//     // const accountId1 = await client._getOperatorAccountId("0x9e5135494641A48f3723faD40dFb04E0Bfd8EE2c");
//     // const accountId2 = await client.operatorAccountId("0x9e5135494641A48f3723faD40dFb04E0Bfd8EE2c");
//     // const contract = await client.getContract({ bytecode: "", evm: { address: "0x9e5135494641A48f3723faD40dFb04E0Bfd8EE2c" } });
//     // console.log("soooooo",contract.accountId)
//     const mnemonic = await Mnemonic.generate12()
//     const newAccountPrivateKey = await PrivateKey.fromStringECDSA("0x9261b083cd3a7298615a7bea0101c0144f6bb19b62cbd36b2176ccc97fe283d9");
//     console.log(newAccountPrivateKey.toStringDer())
//     const newAccountPublicKey = newAccountPrivateKey.publicKey
//     console.log(newAccountPublicKey.toStringDer())
//     const accountId = newAccountPublicKey.toAccountId(0, 0);
//     console.log("soolk,",accountId)
//     const some = await new Wallet(accountId, newAccountPrivateKey);
//     console.log(some)
//     const transaction = await new AccountCreateTransaction().setKey(newAccountPublicKey).setInitialBalance(new Hbar(0));
//     console.log(transaction)
//     const txResponse = await transaction.execute(client);
//     console.log(txResponse)
//     const receipt = await txResponse.getReceipt(client)
// console.log(receipt)
//     const newAccountId = receipt.accountId;
// console.log(newAccountId)
// const accountBalance = await new AccountBalanceQuery()
//         .setAccountId(newAccountId)
//         .execute(client);
//         console.log(accountBalance)
    // Create our connection to the Hedera network
    // The Hedera JS SDK makes this really easy!
    const myAccountId='0.0.3814811'
    const myPrivateKey='302e020100300506032b657004220420edc4e6ad48cd1321eef8216a21b095c6f54922cc762ce0d81e2a8bb3843f61c3'
    const client = Client.forTestnet();
    client.setOperator(myAccountId, myPrivateKey);

    //Create new keys
    const newAccount = web3.eth.accounts.wallet.create(1);
    console.log("newAcc",newAccount)
    const wallet = await Wallet.createRandomECDSA();
    console.log("qwertyui",wallet)
    const newAccountPrivateKey = await PrivateKey.fromString(newAccount[0].privateKey)
    console.log("1234567890",newAccountPrivateKey.toStringRaw())
    const newAccountPublicKey = newAccountPrivateKey.publicKey;

    // console.log("sssssss",EvmAddress.toString(myPrivateKey))

    //Create a new account with 1,000 tinybar starting balance
    const newAccountTransactionResponse = await new AccountCreateTransaction()
        .setKey(newAccountPublicKey)
        .setInitialBalance(Hbar.fromTinybars(0))
        .execute(client);

    console.log("nsnsnsn",newAccountTransactionResponse)
    // Get the new account ID
    const getReceipt = await newAccountTransactionResponse.getReceipt(client);
    console.log("get Account",getReceipt)
    const newAccountId = getReceipt.accountId;

    console.log("The new account ID is: " +newAccountId);

    //Create the account info query
const query = new AccountInfoQuery()
.setAccountId(newAccountId);

//Sign with client operator private key and submit the query to a Hedera network
const accountInfo = await query.execute(client);

//Print the account info to the console
console.log(accountInfo);

    //Verify the account balance
    const accountBalance = await new AccountBalanceQuery()
        .setAccountId(newAccountId)
        .execute(client);

    console.log("The new account balance is: " +accountBalance.hbars.toTinybars() +" tinybar.");

    //Create the transfer transaction
    const sendHbar = await new TransferTransaction()
        .addHbarTransfer(myAccountId, Hbar.fromTinybars(-1000))
        .addHbarTransfer(newAccountId, Hbar.fromTinybars(1000))
        .execute(client);
    console.log("aaaaaa" , sendHbar)
    console.log("send" , sendHbar.transactionId.toString())
    //Verify the transaction reached consensus
    const transactionReceipt = await sendHbar.getReceipt(client);
    console.log("tran rec", transactionReceipt)
    console.log("The transfer transaction from my account to the new account was: " + transactionReceipt.status.toString());
    
    //Request the cost of the query
    const queryCost = await new AccountBalanceQuery()
     .setAccountId(newAccountId)
     .getCost(client);

    console.log("The cost of query is: " +queryCost);

    //Check the new account's balance
    const getNewBalance = await new AccountBalanceQuery()
        .setAccountId(newAccountId)
        .execute(client);

    console.log("The account balance after the transfer is: " +getNewBalance.hbars.toTinybars() +" tinybar.")

}
main();