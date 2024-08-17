import { useState } from "react"
import { mnemonicToSeed } from "bip39";
import { derivePath } from "ed25519-hd-key";
import { Keypair } from "@solana/web3.js";
import nacl from "tweetnacl"




export function SolanaWallet({ mnemonic }) {
    const [currentIndex, setCurrentIndex] = useState(0);
    const [publicKeys, setPublicKeys] = useState([]);
    const [balances, setBalances] = useState([]); 
  
    async function fetchBalance(publicKey, index) {
      const url = 'https://solana-mainnet.g.alchemy.com/v2/XuCdUYaJkc7t9SXU_5wq4JRVohLdu96n';
      const requestBody = {
        "jsonrpc": "2.0",
        "id": 1,
        "method": "getAccountInfo",
        "params": [`${publicKey}`]
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
        const balance = data.result.value === null ? 0 : data.result.value.lamports/10**9; // Get balance in SOL
        const newBalances = [...balances];
        newBalances[index] = balance; // Update the balance for the specific wallet
        setBalances(newBalances);
      } catch (error) {
        console.error('Error:', error);
      }
    }
  
    function addWallet() {
      const seed = mnemonicToSeed(mnemonic);
      const path = `m/44'/501'/${currentIndex}'/0'`;
      const derivedSeed = derivePath(path, seed.toString("hex")).key;
      const secret = nacl.sign.keyPair.fromSeed(derivedSeed).secretKey;
      const keypair = Keypair.fromSecretKey(secret);
      setCurrentIndex(currentIndex + 1);
      setPublicKeys([...publicKeys, keypair.publicKey]);
        setBalances([...balances, null]); 
        
        fetchBalance(keypair.publicKey.toBase58(), currentIndex);
    }
  
    return (
      <div style={{ padding: '20px', fontFamily: 'Arial, sans-serif' }}>
        <button  style={{marginBottom:"10px"}}
          onClick={addWallet} 
          
        >
          Add Solana Wallet
        </button>
        {publicKeys.map((p, index) => (
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
            <span style={{padding:"10px"}}>{p.toBase58()}</span>
           
            <span>
              {balances[index] !== null ? `${balances[index]} SOL` : '....fetching balance'}
            </span>
          </div>
        ))}
      </div>
    );
  }
