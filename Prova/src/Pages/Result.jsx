// pages/Result.js
import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import AdviceCard from '../component/AdviceCard';
import LoadingSpinner from '../component/LoadingSpinner';
import GeminiAPI from '../services/API';
import '../Pages_Style/Result.css';

const Result = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [advice, setAdvice] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [imageFile, setImageFile] = useState(null);

  const { part, image } = location.state || {};

  useEffect(() => {
    if (!part || !image) {
      navigate('/');
      return;
    }

    // Converti l'URL dell'immagine in File object
    const convertImageToFile = async () => {
      try {
        const response = await fetch(image);
        const blob = await response.blob();
        const file = new File([blob], 'uploaded-image.jpg', { type: 'image/jpeg' });
        setImageFile(file);
        return file;
      } catch (error) {
        console.error('Errore nella conversione dell\'immagine:', error);
        setError('Errore nel caricamento dell\'immagine');
        setLoading(false);
      }
    };

    const fetchAdvice = async () => {
      try {
        setLoading(true);
        setError(null);

        const file = await convertImageToFile();
        if (!file) return;

        const result = await GeminiAPI.getStyleAdvice(file, part);
        
        if (result.success) {
          setAdvice(result.data);
        } else {
          throw new Error(result.error || 'Errore nell\'ottenere i consigli');
        }
      } catch (error) {
        console.error('Errore:', error);
        setError(error.message || 'Si è verificato un errore durante l\'analisi');
      } finally {
        setLoading(false);
      }
    };

    fetchAdvice();
  }, [part, image, navigate]);

  const handleGoBack = () => {
    navigate('/');
  };

  const handleRetry = () => {
    setError(null);
    setLoading(true);
    // Riavvia il processo
    window.location.reload();
  };

  const getPartTitle = (part) => {
    const titles = {
      'Busto': 'Consigli per l\'Abbigliamento Superiore',
      'Gambe': 'Consigli per l\'Abbigliamento Inferiore',
      'Scarpe': 'Consigli per le Scarpe'
    };
    return titles[part] || 'Consigli di Stile';
  };

  if (loading) {
    return (
      <div className="result-container">
        <LoadingSpinner message="Il nostro stylist sta analizzando il tuo look..." />
      </div>
    );
  }

  if (error) {
    return (
      <div className="result-container">
        <div className="error-container">
          <div className="error-icon">❌</div>
          <h2>Ops! Qualcosa è andato storto</h2>
          <p className="error-message">{error}</p>
          <div className="error-actions">
            <button onClick={handleRetry} className="retry-button">
              🔄 Riprova
            </button>
            <button onClick={handleGoBack} className="back-button">
              ← Torna Indietro
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="result-container">
      <div className="result-header">
        <button onClick={handleGoBack} className="back-button-header">
          ← Indietro
        </button>
        <h1 className="result-title">{getPartTitle(part)}</h1>
        <div className="result-subtitle">
          Ecco i consigli personalizzati del nostro stylist per te!
        </div>
      </div>

      <div className="image-preview">
        <img src={image} alt="Immagine caricata" className="preview-image" />
        <div className="image-info">
          <span className="part-badge">{part}</span>
        </div>
      </div>

      <div className="advice-container">
        {advice.length > 0 ? (
          advice.map((item, index) => (
            <AdviceCard key={index} advice={item} index={index} />
          ))
        ) : (
          <div className="no-advice">
            <p>Non sono riuscito a generare consigli per questa immagine. Prova con un'altra foto!</p>
          </div>
        )}
      </div>

      <div className="result-footer">
        <button onClick={handleGoBack} className="new-analysis-button">
          📸 Nuova Analisi
        </button>
      </div>
    </div>
  );
};

export default Result;