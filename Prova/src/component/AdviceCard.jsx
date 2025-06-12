import React from 'react';
import '../Pages_Style/AdviceCard.css';

const AdviceCard = ({ advice, index }) => {
  // Creo una classe dinamica con index + 1 (es. position-1, position-2, ...)
  const positionClass = `position-${index + 1}`;

  return (
    <div className={`advice-card ${positionClass}`}>
      <div className="card-header">
        <span className="card-number">{index + 1}</span>
        <h3 className="card-title">{advice.nome || `Consiglio ${index + 1}`}</h3>
      </div>
   
      <div className="card-content">
        {advice.descrizione && (
          <div className="card-section">
            <h4 className="section-title">Descrizione</h4>
            <p className="section-text">{advice.descrizione}</p>
          </div>
        )}
        
        {advice.consiglio && (
          <div className="card-section">
            <h4 className="section-title">Perché te lo consiglio</h4>
            <p className="section-text">{advice.consiglio}</p>
          </div>
        )}
      </div>
      
      <div className="card-footer">
        <div className="style-badge">
          ✨ Consiglio Stylist
        </div>
      </div>
    </div>
  );
};

export default AdviceCard;
