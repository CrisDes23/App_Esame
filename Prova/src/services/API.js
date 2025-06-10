// services/API.js
import { GoogleGenAI, Type } from '@google/genai';

async function generate(tipo, immagineBase64, mimeType) {
  const ai = new GoogleGenAI({
    apiKey: import.meta.env.VITE_GEMINI_API_KEY,
  });

  // Configurazione dello schema di risposta JSON desiderato
  const config = {
    responseMimeType: 'application/json',
    responseSchema: {
      type: Type.OBJECT,
      required: ["nome", "descrizione", "consiglio"],
      properties: {
        nome: {
          type: Type.ARRAY,
          items: {
            type: Type.STRING,
          },
        },
        descrizione: {
          type: Type.ARRAY,
          items: {
            type: Type.STRING,
          },
        },
        consiglio: {
          type: Type.ARRAY,
          items: {
            type: Type.STRING,
          },
        },
      },
    },
  };

  const model = 'gemini-2.5-flash-preview-05-20'; // Modello Gemini utilizzato
  const prompts = {
    'Busto': 'Sei un stylist professionista, dammi 5 consigli per l\'abito superiore (magliette, camicie, giacche, pullover) in base all\'immagine che ti ho inviato. Per ogni consiglio fornisci il nome dell\'abito, una descrizione dettagliata e la motivazione della scelta.',
    'Gambe': 'Sei un stylist professionista, dammi 5 consigli per l\'abbigliamento delle gambe (pantaloni, gonne, shorts, leggings) in base all\'immagine che ti ho inviato. Per ogni consiglio fornisci il nome dell\'abito, una descrizione dettagliata e la motivazione della scelta.',
    'Scarpe': 'Sei un stylist professionista, dammi 5 consigli per le scarpe (sneakers, tacchi, stivali, sandali) in base all\'immagine che ti ho inviato. Per ogni consiglio fornisci il nome del tipo di scarpa, una descrizione dettagliata e la motivazione della scelta.'
  };

  const contents = [
    {
      role: 'user',
      parts: [
        {
          inlineData: {
            data: immagineBase64,
            mimeType: mimeType,
          },
        },
        {
          text: prompts[tipo], // Utilizza il prompt specifico in base al 'tipo'
        },
      ],
    },
  ];

  try {
    const response = await ai.models.generateContentStream({
      model,
      config,
      contents,
    });

    let result = '';
    // Concatena tutti i "chunk" della risposta streamizzata
    for await (const chunk of response) {
      if (chunk && chunk.text) {
        result += chunk.text;
      }
    }

    // --- DEBUG: LOG DELLA RISPOSTA GREZZA DI GEMINI ---
    // Controlla questo log per vedere esattamente cosa ti ha inviato Gemini.
    // Se non è un JSON valido o è vuoto, il problema è qui.
    console.log("Raw Gemini response (before validation/parsing):", result);

    // Validazione di base: se la risposta non inizia con '{' o è vuota, non è un JSON valido
    if (!result.trim().startsWith('{')) {
      console.warn("Il contenuto generato non è JSON valido o è vuoto. Ricevuto:", result);
      return null; // Restituisce null per indicare un fallimento
    }

    return result; // Restituisce la stringa JSON completa
  } catch (error) {
    // Cattura errori di rete, errori API 500, ecc.
    console.error('Errore durante la generazione del contenuto con Gemini:', error);
    return null; // Restituisce null in caso di errore
  }
}

export default generate;

export function parseConsigli(stringaJson) {
  try {
    // Gestisce il caso in cui la stringa JSON sia null o vuota
    if (!stringaJson) {
      console.warn('Impossibile analizzare una stringa JSON null o vuota.');
      return [];
    }

    const oggetto = JSON.parse(stringaJson);
    // --- DEBUG: LOG DELL'OGGETTO JSON PARSATO ---
    // Controlla questo log per vedere se il JSON parsato ha le proprietà attese (nome, descrizione, consiglio)
    console.log("Oggetto JSON parsato:", oggetto);

    const consigli = [];

    // Verifica che le proprietà nome, descrizione, consiglio esistano e siano array
    if (oggetto && Array.isArray(oggetto.nome) && Array.isArray(oggetto.descrizione) && Array.isArray(oggetto.consiglio)) {
      // Itera fino alla lunghezza dell'array più corto per prevenire errori
      const minLength = Math.min(oggetto.nome.length, oggetto.descrizione.length, oggetto.consiglio.length);
      for (let i = 0; i < minLength; i++) {
        consigli.push({
          nome: oggetto.nome[i],
          descrizione: oggetto.descrizione[i],
          consiglio: oggetto.consiglio[i],
        });
      }
    } else {
      console.warn('L\'oggetto JSON parsato manca delle proprietà richieste (nome, descrizione, consiglio) o non sono array.', oggetto);
      return [];
    }

    return consigli;

  } catch (error) {
    // Cattura errori nel parsing JSON (es. stringa JSON malformata)
    console.error('Errore nel parsing del JSON:', error);
    return []; // Restituisce un array vuoto in caso di errore di parsing
  }
}