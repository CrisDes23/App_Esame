import React from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import '../Pages_Style/Result.css';

export default function Result() {
  const location = useLocation();
  const navigate = useNavigate();

  const image = location.state?.image;
  const part = location.state?.part;

  const getSuggestion = (part) => {
    switch (part) {
      case 'Busto':
        return "Prova una camicia di lino chiara per un look elegante ma rilassato.";
      case 'Gambe':
        return "Un pantalone a palazzo o slim-fit abbinato a tacchi valorizza le gambe.";
      case 'Scarpe':
        return "Scegli mocassini in pelle o sneakers minimal per uno stile versatile.";
      default:
        return "Seleziona una parte del corpo per ricevere un consiglio personalizzato.";
    }
  };

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
        <p className="suggestion-text">{getSuggestion(part)}</p>
      </div>

      <button className="back-button" onClick={() => navigate('/select')}>
        🔙 Torna alla selezione
      </button>
    </div>
  );
}