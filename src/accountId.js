const { Client, AccountCreateTransaction, PrivateKey, PublicKey, AccountId } = require("@hashgraph/sdk");

// Define the public and private keys
const publicKey = "302d300706052b8104000a03220002beddf2ece48ab9b7732a88548777686a59e1c2faf2a7cd755c17ffcf0e6ce1e5"; // replace with your own public key
// const privateKey = "3030020100300706052b8104000a042204209261b083cd3a7298615a7bea0101c0144f6bb19b62cbd36b2176ccc97fe283d9"; // replace with your own private key
const privateKey = "0x9261b083cd3a7298615a7bea0101c0144f6bb19b62cbd36b2176ccc97fe283d9"; // replace with your own private key

// Initialize the Hedera client
const client = Client.forTestnet();

const main = async () => {
// Create a new account using the public key
const privateKeyObj = PrivateKey.fromStringECDSA(privateKey);
console.log("someyhn",privateKeyObj)
const data = PublicKey.fromString(publicKey);
console.log(AccountId.fromEvmPublicAddress("0x9e5135494641A48f3723faD40dFb04E0Bfd8EE2c"))
console.log("tyuikl",privateKeyObj.publicKey.toAccountId(0).evmAddress)
// const accountId = privateKeyObj.getPublicKey().accountId;
// console.log("something",accountId)
const transaction = await new AccountCreateTransaction()
    .setKey(publicKey)
    .execute(privateKeyObj);
    console.log("transaction",transaction)
// const transactionReceipt = await transaction.getReceipt(client);
// const accountId = transaction.accountId

console.log("Account ID:", accountId);
}
main();