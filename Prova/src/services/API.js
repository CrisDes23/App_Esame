// To run this code you need to install the following dependencies:
// npm install @google/genai mime
// npm install -D @types/node

import {
  GoogleGenAI,
  Type,
} from '@google/genai';

async function generate(tipo, immagineBase64, mimeType) {
  const ai = new GoogleGenAI({
    apiKey: import.meta.env.VITE_GEMINI_API_KEY,
  });
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
  const model = 'gemini-2.5-flash-preview-05-20'; 
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
          text: prompts[tipo],
        },
      ],
    },
  ];

  const response = await ai.models.generateContentStream({
    model,
    config,
    contents,
  });

  let result = '';
  for await (const chunk of response) {
    result += chunk.text;  // Concatena i vari chunk di testo
  }
  return result;  // Restituisci il testo finale
}

export default generate;
