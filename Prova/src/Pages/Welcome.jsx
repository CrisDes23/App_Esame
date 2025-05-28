import React from 'react';
import { useNavigate } from 'react-router-dom';
import '../Pages_Style/Welcome.css';

export default function Welcome() {
  const navigate = useNavigate();

  return (
    <div className="welcome-page">
      <h1 className="welcome-title">Benvenuto su Outfitly!</h1>

      <p className="welcome-description">
        Benvenuto su <strong>Outfitly</strong>, il tuo assistente di stile intelligente.  
        Carica una foto del tuo outfit e lascia che l'intelligenza artificiale ti suggerisca 
        l'abbinamento perfetto per ogni occasione.  
        Eleganza, semplicità e personalizzazione, tutto in un clic.
      </p>

      <button className="start-button" onClick={() => navigate('/select')}>
        Scopri subito l'abbinamento che fa al caso tuo!
      </button>
    </div>
  );
}
