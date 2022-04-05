import React, { useState, useEffect } from "react";
import {
  Layout,
  Container,
  Fieldset,
  Legend,
  InputBox,
  AddInput,
  AddButton,
  Root,
  List,
  ButtonBoxContainer,
  ButtonBox,
  Mint,
  WalletConnect,
} from "./style";

import axios from "axios";

import { useEthContext } from "../../context/EthereumContext";
import contract_abi from "../../contract/abi.json";
import { contract_address } from "../../contract/contract_address";

const backend = "https://pey-test-backend.herokuapp.com/";

const Dashboard = () => {
  const [temp, setTemp] = useState("");

  const [root, setRoot] = useState();
  const [addresses, setAddresses] = useState([]);

  const [publicPrice, setPublicPrice] = useState(0);
  const [whitelistPrice, setWhitelistPrice] = useState(0);

  const [whitelist, setWhitelist] = useState();
  const [owner, setOwner] = useState("");

  const { provider, currentAcc, web3 } = useEthContext();

  useEffect(() => {
    getInfo();
  }, []);

  useEffect(() => {
    const Timer = setInterval(() => {
      if (currentAcc !== "") {
        (async () => {
          const contract = new web3.eth.Contract(
            contract_abi,
            contract_address
          );
          let proof = await getProof();
          contract.methods
            .isWhitelist(proof)
            .call({ from: currentAcc.toLocaleLowerCase() })
            .then((data) => {
              console.log(data);
              setWhitelist(data);
            })
            .catch((e) => {
              console.log(e);
            });
        })();
      }
    }, 1000);

    return () => {
      clearInterval(Timer);
    };
  }, [currentAcc, web3]);

  const getInfo = () => {
    const contract = new web3.eth.Contract(contract_abi, contract_address);
    contract.methods
      .owner()
      .call()
      .then((data) => {
        setOwner(data.toLowerCase());
      })
      .catch((e) => {
        console.log(e);
      });
    contract.methods
      .publicPrice()
      .call()
      .then((data) => {
        setPublicPrice(data);
      })
      .catch((e) => {
        console.log(e);
      });
    contract.methods
      .whitelistPrice()
      .call()
      .then((data) => {
        setWhitelistPrice(data);
      })
      .catch((e) => {
        console.log(e);
      });

    axios.get(backend + `all`).then((res) => {
      console.log("first");
      setAddresses(res.data.addresses);
    });
  };

  const changeInput = (e) => {
    setTemp(e.target.value.toLowerCase());
  };

  const addList = async () => {
    if (owner === currentAcc.toLocaleLowerCase()) {
      let tempRoot = "";
      await axios.get(backend + `add/${temp}`).then((res) => {
        tempRoot = res.data.root;
      });
      if (tempRoot === "Address already exists") {
        alert("Address already exists");
      } else {
        setRoot(tempRoot.toLowerCase());
        (async () => {
          const contract = new web3.eth.Contract(
            contract_abi,
            contract_address
          );
          await contract.methods
            .setMerkleRoot("0x" + tempRoot.toLowerCase())
            .send({ from: currentAcc.toUpperCase() }, (err, res) => {
              if (err) {
                console.log("An error occured", err);
                return;
              }
              console.log("Hash of the transaction: " + res);
            });
          axios.get(backend + `all`).then((res) => {
            setAddresses(res.data.addresses);
          });
        })();
      }
    } else {
      alert("Only owner can add");
    }
  };

  const getProof = async () => {
    return await axios
      .get(backend + `get/${currentAcc.toLocaleLowerCase()}`)
      .then((res) => {
        return res.data.proof;
      });
  };

  const handleConnectWallet = async () => {
    if (provider) {
      await provider.request({ method: `eth_requestAccounts` });
    } else {
      alert("Please install your Metamask wallet in this browser");
    }
  };

  const mint = async () => {
    let proof = await getProof();
    const contract = new web3.eth.Contract(contract_abi, contract_address);
    console.log("sdfwef");
    contract.methods.mintItem(currentAcc, 1, proof).send(
      {
        from: currentAcc,
        value:
          owner !== currentAcc.toLocaleLowerCase()
            ? whitelist
              ? whitelistPrice
              : publicPrice
            : 0,
      },
      (err, res) => {
        if (err) {
          console.log("An error occured", err);
          return;
        }
        console.log("Hash of the transaction: " + res);
      }
    );
  };

  return (
    <Layout>
      <Container>
        <Fieldset>
          <Legend>Owner: {owner}</Legend>
          <InputBox>
            <AddInput
              onChange={(e) => changeInput(e)}
              placeholder={"Add Address"}
            ></AddInput>
            <AddButton onClick={addList}>Add Whitelist</AddButton>
          </InputBox>
          {root && <Root>{"Root: " + root}</Root>}
          <List>
            <legend>WhiteList</legend>
            {addresses.map((item, index) => (
              <p key={index}>{item}</p>
            ))}
          </List>
        </Fieldset>
      </Container>
      <Container>
        <Fieldset>
          <Legend>
            Mint Price:
            {currentAcc !== ""
              ? owner === currentAcc.toLocaleLowerCase()
                ? 0
                : whitelist
                ? whitelistPrice
                : publicPrice
              : ""}
          </Legend>
          <ButtonBoxContainer>
            <ButtonBox>
              <WalletConnect onClick={() => handleConnectWallet()}>
                {currentAcc ? currentAcc : "Connect Wallet"}
              </WalletConnect>
              <Mint onClick={mint}>Mint</Mint>
            </ButtonBox>
          </ButtonBoxContainer>
        </Fieldset>
      </Container>
    </Layout>
  );
};

export default Dashboard;
