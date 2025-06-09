import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import '../Pages_Style/Result.css';
import generate from '../services/API.js';
import Consigli from '../component/Consigli.jsx';

export default function Result() {
  const location = useLocation();
  const navigate = useNavigate();

  const image = location.state?.image;
  const part = location.state?.part;

  const [suggestion, setSuggestion] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchSuggestion = async () => {
      if (image && part) {
        try {
          const base64String = image.split(',')[1];
          const mimeType = image.match(/data:(.*);base64/)[1];

          const response = await generate(part, base64String, mimeType);
          setSuggestion(response);
        } catch (error) {
          console.error('Errore nel generare il consiglio:', error);
          setSuggestion('Errore durante la generazione del consiglio.');
        } finally {
          setLoading(false);
        }
      }
    };

    fetchSuggestion();
  }, [image, part]);

  return (
    <div className="result-page">
      <h1 className="result-title">Ecco a te il tuo consiglio su misura!</h1>

      {image && (
        <div className="result-image-container">
          <img src={image} alt="Selezionata" />
        </div>
      )}

      <div className="result-info">
        <h2>{part ? `Consiglio per il ${part.toLowerCase()}:` : "Nessuna selezione."}</h2>
        <p className="suggestion-text">
          <Consigli loading={loading} suggestion={suggestion}  />
        </p>
      </div>

      <button className="back-button" onClick={() => navigate('/select')}>
        🔙 Torna alla selezione
      </button>
    </div>
  );
}
