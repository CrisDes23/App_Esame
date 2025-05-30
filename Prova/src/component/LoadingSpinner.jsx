// components/LoadingSpinner.js
import React from 'react';
import '../Pages_Style/LoadingSpinner.css';

const LoadingSpinner = ({ message = "Sto analizzando la tua immagine..." }) => {
  return (
    <div className="loading-container">
      <div className="loading-spinner">
        <div className="spinner-ring"></div>
        <div className="spinner-ring"></div>
        <div className="spinner-ring"></div>
        <div className="spinner-ring"></div>
      </div>
      <p className="loading-message">{message}</p>
      <div className="loading-steps">
        <div className="step active">📸 Analisi immagine</div>
        <div className="step">🎨 Generazione consigli</div>
        <div className="step">✨ Finalizzazione</div>
      </div>
    </div>
  );
};

export default LoadingSpinner;