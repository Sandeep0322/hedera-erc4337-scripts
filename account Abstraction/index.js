const { wrapProvider, SimpleAccountAPI} = require('@account-abstraction/sdk')
const {ethers, Wallet, Contract} = require("ethers");
const abi = require("./abi.json");
// const provider = new ethers.providers.JsonRpcProvider('https://goerli.infura.io/v3/2ff47e51ff1f4804865ba892c7efc70c');
const provider = new ethers.providers.JsonRpcProvider('http://localhost:8545');


const main = async () => {
//use this account as wallet-owner (which will be used to sign the requests)
const signer = provider.getSigner()
console.log("signer",signer);

const aasigner = new Wallet("ab3ca80f20fe7d8aabdaa3be6fcbfc1ec8e1de67d9e10d544341ed3af1a32673")
// console.log("wallet",wallet)
// const aasigner = Wallet.createRandom()
console.log("aa",aasigner)
console.log("signer signing", aasigner._signingKey())
console.log("bal;a", await provider.getBalance(aasigner.address));
const config = {
  chainId: await provider.getNetwork().then(net => net.chainId),
  entryPointAddress: "0x0576a174D229E3cFA37253523E645A78A0C91B57",
  bundlerUrl: 'http://localhost:3000/rpc',
  
  // bundlerUrl: "https://node.stackup.sh/v1/rpc/016742ad42d36a577d914e1c68ab9eca9abe166af873f866d057c849c3cc57c8"
} 
console.log("ssss")
const aaProvider = await wrapProvider(provider, config, aasigner)
console.log(aaProvider)
// console.log("qwertyuiop", await aaProvider.smartAccountAPI.getUserOpReceipt("0x368ded23f0d20ae80e6759989457ef86f7cc2cac9919632f4b1f54ba245b422b",30000,5000))
console.log("sandeep",aaProvider.smartAccountAPI.owner);
const walletSigner = await aaProvider.getSigner()
// console.log("wallet Signer",walletSigner)
const walletAddress = await aaProvider.getSigner().getAddress();
console.log("wallet Address",walletAddress)
console.log("bala",await aaProvider.getBalance(walletAddress))

// send some eth to the wallet Address: wallet should have some balance to pay for its own creation, and for calling methods.

const myContract = new Contract("0x7A3B2Fd519E3a134a62279aD60d90436E7b81062",abi, aaProvider.getSigner())
// this method will get called from the wallet address, through account-abstraction EntryPoint
console.log("symbol",await myContract.mint(walletAddress,"10000"));
}
main()