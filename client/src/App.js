import React, { useState, useEffect } from "react";
import getWeb3 from "./getWeb3";
import SimpleStorage from "./contracts/SimpleStorage.json";
import "./App.css";

const App = () => {
  const [state, setState] = useState({
    web3: null,
    contract: null,
  });
  const [storageValue, setStorageValue] = useState(null);

  useEffect(() => {
    const init = async () => {
      try {
        const web3 = await getWeb3();
        const networkId = await web3.eth.net.getId();

        const deployedNetwork = SimpleStorage.networks[networkId];
        console.log("Contract Address:", deployedNetwork.address);
        const instance = new web3.eth.Contract(
          SimpleStorage.abi,
          deployedNetwork && deployedNetwork.address
        );
        setState({ web3, contract: instance });
      } catch (error) {
        alert("Falied to load web3 or contract.");
        console.log(error);
      }
    };
    init();
  }, []);

  useEffect(() => {
    async function getValue() {
      const { contract } = state;
      const value = await contract.methods.get().call();
      setStorageValue(value);
    }
    state.contract && getValue();
  }, [state.contract, state]);

  return (
    <div className="App">
      <div>The stored values is: {storageValue}</div>
    </div>
  );
};
export default App;
