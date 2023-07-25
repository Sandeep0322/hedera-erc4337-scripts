const {
	AccountId,
	PrivateKey,
	Client,
	TokenCreateTransaction,
	TokenType,
	TokenSupplyType,
	TransferTransaction,
	AccountBalanceQuery,
	TokenAssociateTransaction,
} = require("@hashgraph/sdk");

// Configure accounts and client, and generate needed keys
const operatorId = AccountId.fromString("0.0.3814811");
console.log(operatorId)
const operatorKey = PrivateKey.fromString("302e020100300506032b657004220420edc4e6ad48cd1321eef8216a21b095c6f54922cc762ce0d81e2a8bb3843f61c3");
const treasuryId = AccountId.fromString("0.0.3941123");
console.log(treasuryId)
const treasuryKey = PrivateKey.fromString("3030020100300706052b8104000a042204202daa0f0e94c16dfdc1a0c2f8725db71391b5c16ce3fb1b29b99b5455ea8373eb");
const aliceId = AccountId.fromString("0.0.3934826");
const aliceKey = PrivateKey.fromString("3030020100300706052b8104000a042204202daa0f0e94c16dfdc1a0c2f8725db71391b5c16ce3fb1b29b99b5455ea8373eb");

const client = Client.forTestnet().setOperator(operatorId, operatorKey);

const supplyKey = PrivateKey.generateECDSA();
console.log(supplyKey)

async function main() {
	//CREATE FUNGIBLE TOKEN (STABLECOIN)
	console.log("11111")
	let tokenCreateTx = await new TokenCreateTransaction()
		.setTokenName("USD Bar")
		.setTokenSymbol("USDB")
		.setTokenType(TokenType.FungibleCommon)
		.setDecimals(2)
		.setInitialSupply(10000)
		.setTreasuryAccountId(treasuryId)
		.setSupplyType(TokenSupplyType.Infinite)
		.setSupplyKey(supplyKey)
		.freezeWith(client);

	let tokenCreateSign = await tokenCreateTx.sign(treasuryKey);
	let tokenCreateSubmit = await tokenCreateSign.execute(client);
	let tokenCreateRx = await tokenCreateSubmit.getReceipt(client);
	let tokenId = tokenCreateRx.tokenId;
	console.log(`- Created token with ID: ${tokenId} \n`);

	//TOKEN ASSOCIATION WITH ALICE's ACCOUNT
	let associateAliceTx = await new TokenAssociateTransaction()
		.setAccountId(aliceId)
		.setTokenIds([tokenId])
		.freezeWith(client)
		.sign(aliceKey);
	let associateAliceTxSubmit = await associateAliceTx.execute(client);
	let associateAliceRx = await associateAliceTxSubmit.getReceipt(client);
	console.log(`- Token association with Alice's account: ${associateAliceRx.status} \n`);

	//BALANCE CHECK
	var balanceCheckTx = await new AccountBalanceQuery().setAccountId(treasuryId).execute(client);
	console.log(`- Treasury balance: ${balanceCheckTx.tokens._map.get(tokenId.toString())} units of token ID ${tokenId}`);
	var balanceCheckTx = await new AccountBalanceQuery().setAccountId(aliceId).execute(client);
	console.log(`- Alice's balance: ${balanceCheckTx.tokens._map.get(tokenId.toString())} units of token ID ${tokenId}`);

	//TRANSFER STABLECOIN FROM TREASURY TO ALICE
	let tokenTransferTx = await new TransferTransaction()
		.addTokenTransfer(tokenId, treasuryId, -2500)
		.addTokenTransfer(tokenId, aliceId, 2500)
		.freezeWith(client)
		.sign(treasuryKey);
	let tokenTransferSubmit = await tokenTransferTx.execute(client);
	let tokenTransferRx = await tokenTransferSubmit.getReceipt(client);
	console.log(`\n- Stablecoin transfer from Treasury to Alice: ${tokenTransferRx.status} \n`);

	//BALANCE CHECK
	var balanceCheckTx = await new AccountBalanceQuery().setAccountId(treasuryId).execute(client);
	console.log(`- Treasury balance: ${balanceCheckTx.tokens._map.get(tokenId.toString())} units of token ID ${tokenId}`);
	var balanceCheckTx = await new AccountBalanceQuery().setAccountId(aliceId).execute(client);
	console.log(`- Alice's balance: ${balanceCheckTx.tokens._map.get(tokenId.toString())} units of token ID ${tokenId}`);
}
main();