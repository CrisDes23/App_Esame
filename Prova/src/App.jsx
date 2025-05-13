// src/App.jsx
import React, { useRef, useState } from 'react';
import { Img } from './components/Image.js';
import './index.css';

function App() {
  // Stato per memorizzare il file immagine
  const [image, setImage] = useState(null);
  const fileInputRef = useRef(null);

  const handleButtonClick = () => {
    // Attiva il click sull'input file nascosto
    fileInputRef.current.click();
  };

  const handleFileChange = (event) => {
    const file = event.target.files[0];
    if (file) {
      // Aggiorna lo stato con l'immagine caricata
      setImage(URL.createObjectURL(file));
      
    }
  };

  return (
    <div>
      <h1>Outfitly</h1>

      <button className="custom-button" onClick={handleButtonClick}>
        <span role="img" aria-label="camera">📷</span> Seleziona immagine
      </button>

      {/* Input file nascosto */}
      <input
        type="file"
        accept="image/*"
        ref={fileInputRef}
        style={{ display: 'none' }}
        onChange={handleFileChange}
      />

      {/* Mostra l'immagine appena caricata */}
      {image && (
        <div className="Image-container">
          <img
            src={image} // Usa l'URL dell'immagine
            alt="Uploaded"
          />
        </div>

      )}

      {image &&(
        <>
          <h2 className='fade-in'>Su che parte del vestito ti serve un consiglio?</h2>

          <div className='Scelta-Consiglio'>
        
            <button className='Busto fade-in'>
             Busto
            </button>

           <button className='Gambe fade-in'>
             Gambe
            </button>

            <button className='Scarpe fade-in'>
              Scarpe
            </button>
          </div>
        </>
      )}


    </div>
  );
}

export default App;
