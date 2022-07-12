import abi from "./abi/abi.json" assert { type: "json" };

const reinkeby = new Promise((res, rej) => {
  async function meta() {
    if (typeof window.ethereum == "undefined") {
      rej("You should install Metamask");
    }
    let web3 = new Web3(window.ethereum);
    let contract = new web3.eth.Contract(
      abi,
      "0x08e9cadc107893c306dfa3fc77525cafb1116935"
    );

    let accounts = await web3.eth.requestAccounts();
    console.log("Connected account: ", accounts[0]);

    let totalSupply = await contract.methods
      .totalSupply()
      .call({ from: accounts[0] });
    console.log("totalSupply :", totalSupply);
    let maxSupply = await contract.methods
      .maxSupply()
      .call({ from: accounts[0] });
    console.log("totalSupply :", maxSupply);

    let objects = await contract.methods
      .getOwnerObjects()
      .call({ from: accounts[0] });
    console.log("Your NFT", objects);

    web3.eth.requestAccounts().then((accounts) => {
      contract.methods
        .totalSupply()
        .call({ from: accounts[0] })
        .then((supply) => {
          contract.methods
            .getObjects()
            .call({ from: accounts[0] })
            .then((data) => {
              res({ supply: supply, nft: data });
            });
        });
    });
  }
  meta();
});

export default reinkeby;
