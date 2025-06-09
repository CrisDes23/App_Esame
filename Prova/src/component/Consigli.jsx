// components/AdviceCard.js
import React from 'react'; 

const Consigli = ({ loading, suggestion }) => {
    try {
        const oggetto = JSON.parse(stringaJson);
        console.log(oggetto);
        let consigli = [];
        for(let i = 0; i < oggetto[titolo].length(); i++){
            consigli.push({
                titolo: oggetto[titolo][i],
                descrizione: oggetto[descrizione][i],
                consiglio: oggetto[consiglio][i],
            })
    
        }
      } catch (error) {
        console.error('Errore nel parsing del JSON:', error);
      }
      
    

  return (
    <>
    {
        loading ? 'Caricamento in corso...' : suggestion || 'Nessun consiglio disponibile.'}
  </>
  );
};

export default Consigli;