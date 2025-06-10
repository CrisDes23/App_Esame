// components/Consigli.jsx
import { parseConsigli } from '../services/API'; // Assicurati che il percorso sia corretto
import AdviceCard from './AdviceCard'; // Assicurati che il percorso sia corretto
import React from 'react';

const Consigli = ({ loading, suggestion }) => {
  // `parseConsigli` è chiamata qui; gestisce internamente il parsing
  // Se 'suggestion' è null o non valido, parseConsigli restituirà un array vuoto
  let consigli = loading ? [] : parseConsigli(suggestion) ;

  return (
    <>
      {loading ? (
        'Caricamento in corso...' // Messaggio durante il caricamento
      ) : (
        // Se ci sono consigli, li mappa per renderizzare le AdviceCard
        consigli.length > 0 ? (
          consigli.map((element, i) => (
            <AdviceCard advice={element} index={i} key={i} /> // `key={i}` è fondamentale per le liste React
          ))
        ) : (
          'Nessun consiglio disponibile.' // Messaggio se non ci sono consigli
        )
      )}
    </>
  );
};

export default Consigli;