import { useState } from 'react'
import './App.css'
import { generateMnemonic } from 'bip39'
import { EthWallet } from './EthWallet'
import { SolanaWallet } from './SolanaWallet'

function App() {
  const [mnemonic, setMnemonic] = useState("");
  const [wallet, setWallet] = useState(false);
  const [opacity, setOpacity] = useState(100)
  const [seedbtn, setSeedBtn] = useState('visible')
  const [display, setDisplay] = useState('grid')
  
  function vanish() {
    setWallet(true)
    setOpacity(0)
    setDisplay('none')
  }

  return (

    <>{mnemonic && <div style={{ display: `${display}` }}><h2>Secret Recovery Phrase</h2></div>}
      {mnemonic && 
      
      <div style={{ padding: "30px", opacity: `${opacity}`,backgroundColor:'#2F4F4F',borderRadius:"10px",display:`${display}`,gridTemplateColumns:'1fr 1fr 1fr',gap:"15px"}}>
        {mnemonic && mnemonic.split(' ').map((m, i) => {
          return <div key={i} style={{display:'flex',gap:'20px',padding:'10px',fontSize:'18px'}} >
            <span>{i + 1}</span>
            <span>{m}</span>           
          </div>
          
        })}
        </div>
      }
        <div style={{ display: "flex", justifyContent: "center",opacity: `${opacity}`,padding:'10px' }}>{mnemonic && <button style={{padding:'10px 30px',fontSize:'20px'}}  onClick={vanish}> Next</button>}</div>
      {/* <input type="text" value={mnemonic} onChange={setMnemonic}></input> */}
      
      <div style={{ display: `${seedbtn}` }}>
        <h1>Wallet 💼</h1>
            <button style={{padding:'10px 30px',fontSize:'20px'}}  onClick={async function () {
              const mn =  generateMnemonic();
              setMnemonic(mn)
              console.log(mn)
              setSeedBtn('none')
            }}>
              Create Seed Phrase
            </button>

      </div>
     

      <div style={{ display: 'grid', gridTemplateColumns:'1fr 1fr',  }}>
        
        {wallet && mnemonic && <SolanaWallet  mnemonic={mnemonic} />}
        

        {wallet && mnemonic && <EthWallet mnemonic={mnemonic} />}
        </div>
      
    </>
  )
}

export default App
