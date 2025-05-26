import React, { useRef, useState } from 'react';
import '../Pages_Style/Select.css';
import { useNavigate } from 'react-router-dom';

export default function Select() {
  const [image, setImage] = useState(null);
  const fileInputRef = useRef(null);
  const navigate = useNavigate();

  const handleButtonClick = () => {
    fileInputRef.current.click();
  };

  const handleFileChange = (event) => {
    const file = event.target.files[0];
    if (file) {
      setImage(URL.createObjectURL(file));
    }
  };

  const handleSelection = (part) => {
    navigate('/result', { state: { part, image } });
  };

  return (
    <div className="select-page">
      <h1 className="select-title">Outfitly</h1>
      <p className="subtitle">Carica un'immagine e scegli su quale parte dell'outfit vuoi un consiglio</p>

      <button className="upload-button" onClick={handleButtonClick}>
        📷 Seleziona immagine
      </button>

      <input
        type="file"
        accept="image/*"
        ref={fileInputRef}
        style={{ display: 'none' }}
        onChange={handleFileChange}
      />

      {image && (
        <div className="image-preview">
          <img src={image} alt="Selezionata" />
        </div>
      )}

      {image && (
        <div className="advice-section">
          <h2 className="fade-in">Su quale parte vuoi un consiglio?</h2>
          <div className="options">
            <button onClick={() => handleSelection('Busto')}>Busto</button>
            <button onClick={() => handleSelection('Gambe')}>Gambe</button>
            <button onClick={() => handleSelection('Scarpe')}>Scarpe</button>
          </div>
        </div>
      )}
    </div>
  );
}
