const {wrapProvider, wrapSimpleProvider} = require('./sdk')
const {ethers, Wallet, Contract} = require("ethers");
const abi = require("./abi.json");
// const provider = new ethers.providers.JsonRpcProvider('https://goerli.infura.io/v3/2ff47e51ff1f4804865ba892c7efc70c');
const provider = new ethers.providers.JsonRpcProvider('http://localhost:8545');


const main = async () => {
  const etherssss = ethers.utils.parseTransaction("0xf87f808082784794ca0fe7354981aeb9d051e2f709055eb50b77408780a09ce3504b737b5530973882aaacc91ad43d45b49bf7fdb8bc97164d8f427969a01ca02d2d606bb3f0a53a2db628686bec48df6b7067c98eb1b9698e7c918cee4399f1a06f6ab52ffa68dc7145d22dd8ee67cff7103f52420810a5671e9fdd32c4f2174e")
  console.log("........",etherssss)
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
  entryPointAddress: "0xE18280A67D435c3Ca3204AC9Bb558fAC421340AD",
  accountFacotry: "0x3606618d214C9034d04b51EF9412280Ef7cB6E95",
  bundlerUrl: 'http://localhost:3000/rpc',
  
  // bundlerUrl: "https://node.stackup.sh/v1/rpc/016742ad42d36a577d914e1c68ab9eca9abe166af873f866d057c849c3cc57c8"
} 
console.log("ssss")
const aaProvider = await wrapSimpleProvider(provider, config, aasigner)
console.log(aaProvider)
// console.log("qwertyuiop", await aaProvider.smartAccountAPI.getUserOpReceipt("0x368ded23f0d20ae80e6759989457ef86f7cc2cac9919632f4b1f54ba245b422b",30000,5000))
console.log("sandeep",aaProvider.smartAccountAPI.owner);
const walletSigner = await aaProvider.getSigner()
// console.log("wallet Signer",walletSigner)
const walletAddress = await aaProvider.getSigner().getAddress();
console.log("wallet Address",walletAddress)
console.log("bala",await aaProvider.getBalance(walletAddress))
// const simple = new SimpleAccountAPI({"entryPointAddress": "0xE18280A67D435c3Ca3204AC9Bb558fAC421340AD",
// "accountAddress":"0x9273aB87BCfB48A7d6Db7C069Db694A8FB13F276","factoryAddress":"0x3606618d214C9034d04b51EF9412280Ef7cB6E95","owner":"0x9e5135494641A48f3723faD40dFb04E0Bfd8EE2c"})
// console.log("simple", simple)
// send some eth to the wallet Address: wallet should have some balance to pay for its own creation, and for calling methods.

const myContract = new Contract("0x7A3B2Fd519E3a134a62279aD60d90436E7b81062",abi, aaProvider.getSigner())
// this method will get called from the wallet address, through account-abstraction EntryPoint
console.log("symbol",await myContract.mint(walletAddress,"10000"));
}
main()