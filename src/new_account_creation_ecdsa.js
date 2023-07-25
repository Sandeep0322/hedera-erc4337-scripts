const { Client, PrivateKey, Mnemonic, Wallet, AccountCreateTransaction, AccountBalanceQuery, Hbar, TransferTransaction, AccountInfoQuery} = require("@hashgraph/sdk");
const Web3 = require("web3");
const web3 = new Web3(new Web3.providers.HttpProvider('https://goerli.infura.io/v3/2ff47e51ff1f4804865ba892c7efc70c'));
async function main() {
    const myAccountId='0.0.3656124'
    const myPrivateKey='3030020100300706052b8104000a042204209261b083cd3a7298615a7bea0101c0144f6bb19b62cbd36b2176ccc97fe283d9'
    const client = Client.forTestnet();
    client.setOperator(myAccountId, myPrivateKey);

    //Create new keys
    const newAccount = web3.eth.accounts.wallet.create(1);
    console.log("account address",newAccount[0].address)
    // console.log("newAcc",newAccount)
    const newAccountPrivateKey = await PrivateKey.fromStringECDSA(newAccount[0].privateKey)
    console.log("hedera priavate key",newAccountPrivateKey.toStringDer())
    console.log("priavate key",newAccountPrivateKey.toStringRaw())
    const newAccountPublicKey = newAccountPrivateKey.publicKey;
    console.log("hedera public Key",newAccountPublicKey.toStringDer())
    console.log("public Key",newAccountPublicKey.toStringRaw())
    //Create a new account with 1,000 tinybar starting balance
    const newAccountTransactionResponse = await new AccountCreateTransaction()
        .setKey(newAccountPublicKey)
        .setInitialBalance(Hbar.fromTinybars(1000))
        .execute(client);

    // console.log("account txn response",newAccountTransactionResponse)
    // Get the new account ID
    const getReceipt = await newAccountTransactionResponse.getReceipt(client);
    // console.log("get Account receipt",getReceipt)
    const newAccountId = getReceipt.accountId;

    console.log("The new account ID is: " +newAccountId);

    //Create the account info query
const query = new AccountInfoQuery()
.setAccountId(newAccountId);

//Sign with client operator private key and submit the query to a Hedera network
const accountInfo = await query.execute(client);

//Print the account info to the console
console.log(accountInfo);

//     //Verify the account balance
//     const accountBalance = await new AccountBalanceQuery()
//         .setAccountId(newAccountId)
//         .execute(client);

//     console.log("The new account balance is: " +accountBalance.hbars.toTinybars() +" tinybar.");

}
main();