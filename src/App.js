import React, { useEffect, useState } from 'react';
import './App.css';

// Constants
const PERSONAL_LINK = 'http://jakub.szczepanek.pl/';

const TEST_GIFS = [
  'https://media0.giphy.com/media/MFabj1E9mgUsqwVWHu/giphy.gif?cid=790b7611a9d45ab4b51810486c7cd21aa1918322d07d3fa6&rid=giphy.gif&ct=g',
  'https://media2.giphy.com/media/doXBzUFJRxpaUbuaqz/giphy.gif?cid=790b7611709300da14ff10fe6e047601b8ec0afc827a05c4&rid=giphy.gif&ct=g',
  'https://media1.giphy.com/media/1BfRG8cK5SPOer97aK/giphy.gif?cid=790b7611916457511f8cca5c208b5c1eb347b566b7cc4be7&rid=giphy.gif&ct=g',
  'https://media4.giphy.com/media/3oFzmrqRPhYnFg9oGs/giphy.gif?cid=790b76115a56ee47b5db8e52677bca9e7f18c9e9a02dfc97&rid=giphy.gif&ct=g'
]

const App = () => {

  const [walletAddress, setWalletAddress] = useState(null);
  const [inputValue, setInputValue] = useState('');
  const [gifList, setGifList] = useState([]);
 
  const checkIfWalletIsConnected = async () => {
    try {
      const { solana } = window;

      if (solana) {
        if (solana.isPhantom) {
          console.log('Phantom wallet found!');

          const response = await solana.connect({ onlyIfTrusted: true });
          console.log(
            'Connected with Public Key:',
            response.publicKey.toString()
          );

          setWalletAddress(response.publicKey.toString());
        }
      } else {
        alert('Solana object not found! Get a Phantom Wallet 👻');
      }
    } catch (error) {
      console.error(error);
    }
  };

  const connectWallet = async () => {
    const { solana } = window;

    if (solana) {
      const response = await solana.connect();
      console.log('Connect with Public Key:', response.publicKey.toString());
      setWalletAddress(response.publicKey.toString());
    }
  };

  const sendGif = async () => {
    if (inputValue.length > 0) {
      console.log('Gif link:', inputValue);
      setGifList([...gifList, inputValue]);
      setInputValue('');
    } else {
      console.log('Empty input. Try again.');
    }
  };

  const onInputChange = (event) => {
    const { value } = event.target;
    setInputValue(value);
  };

  const renderNotConnectedContainer = () => (
    <button
      className="cta-button connect-wallet-button"
      onClick={connectWallet}
    >
      Connect to Wallet
    </button>
  );

  const renderConnectedContainer = () => (
    <div className="connected-container">
      <form
        onSubmit={(event) => {
          event.preventDefault();
          sendGif();
        }}
      >
        <input
          type="text"
          placeholder="Enter gif link!"
          value={inputValue}
          onChange={onInputChange}  
        />
        <button type="submit" className="cta-button submit-gif-button">Submit</button>
      </form>

      <div className="gif-grid">
        {gifList.map(gif => (
          <div className="gif-item" key={gif}>
            <img src={gif} alt={gif} />
          </div>
        ))}
      </div>
    </div>
  );

  useEffect(() => {
    const onLoad = async () => {
      await checkIfWalletIsConnected();
    };
    window.addEventListener('load', onLoad);
    return () => window.removeEventListener('load', onLoad);
  }, []);

  useEffect(() => {
    if (walletAddress) {
      console.log('Fetching GIF list...');

      // Call Solana program here.

      setGifList(TEST_GIFS);
    }
  }, [walletAddress]);

  return (
    <div className="App">
      <div className={walletAddress ? 'authed-container' : 'container'}>
        <div className="header-container">
          <p className="header">🖼 GIF Portal for blockchain and crypoto</p>
          <p className="sub-text">
            View your GIF collection in the metaverse ✨
          </p>
          {!walletAddress && renderNotConnectedContainer()}
          {walletAddress && renderConnectedContainer()}
        </div>
        <div className="footer-container">
          <a
            className="footer-text"
            href={PERSONAL_LINK}
            target="_blank"
            rel="noreferrer"
          >@Jakub Szczepanek</a>
        </div>
      </div>
    </div>
  );
};

export default App;
