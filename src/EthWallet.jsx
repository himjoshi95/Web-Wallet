import { useState } from "react";
import { mnemonicToSeed } from "bip39";
import { Wallet, HDNodeWallet } from "ethers";



export function EthWallet({ mnemonic }) {
    const [currentIndex, setCurrentIndex] = useState(0);
    const [addresses, setAddresses] = useState([]);
    const [balances, setBalances] = useState([]); 
  
    async function fetchBalance(address, index) {
      const url = 'https://eth-mainnet.g.alchemy.com/v2/XuCdUYaJkc7t9SXU_5wq4JRVohLdu96n';
      const requestBody = {
        jsonrpc: '2.0',
        id: 1,
        method: 'eth_getBalance',
        params: [`${address}`, 'latest'],
      };
  
      try {
        const response = await fetch(url, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(requestBody),
        });
  
        if (!response.ok) {
          throw new Error(`HTTP error! Status: ${response.status}`);
        }
  
        const data = await response.json();
        const balance = parseInt(data.result, 16); // Convert balance from hex to decimal
        const newBalances = [...balances];
        newBalances[index] = balance; // Update the balance for the specific wallet
        setBalances(newBalances);
      } catch (error) {
        console.error('Error:', error);
      }
    }
  
    async function addWallet() {
      const seed = await mnemonicToSeed(mnemonic);
      const derivationPath = `m/44'/60'/${currentIndex}'/0'`;
      const hdNode = HDNodeWallet.fromSeed(seed);
      const child = hdNode.derivePath(derivationPath);
      const privateKey = child.privateKey;
      const wallet = new Wallet(privateKey);
      setCurrentIndex(currentIndex + 1);
      setAddresses([...addresses, wallet.address]);
        setBalances([...balances, null]); 
        await fetchBalance(wallet.address, currentIndex); 
    }
  
    return (
      <div style={{ padding: '20px', fontFamily: 'Arial, sans-serif' }}>
            <button 
                style={{marginBottom:"10px"}}
          onClick={addWallet} 
        
        >
          Add ETH Wallet
        </button>
        {addresses.map((p, index) => (
          <div
            key={index}
            style={{
              display: 'grid',
              gridTemplateColumns: '0.5fr 2fr 1fr',
              gap: '10px',
              alignItems: 'center',
              padding: '10px',
              border: '1px solid #ccc',
              borderRadius: '5px',
              marginBottom: '10px',
              backgroundColor: '#2F4F4F',
            }}
          >
            <span>Public Key</span>
            <span>Eth - {p}</span>
            
            <span>
              {balances[index] !== null ? `${balances[index]} ETH` : '....fetching balance'}
            </span>
          </div>
        ))}
      </div>
    );
  }