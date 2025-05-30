// API.js
import { GoogleGenAI } from '@google/genai';

class GeminiAPI {
  constructor() {
    // Assicurati di avere REACT_APP_GEMINI_API_KEY nel tuo .env
    this.apiKey = process.env.REACT_APP_GEMINI_API_KEY;
    if (!this.apiKey) {
      throw new Error('GEMINI_API_KEY non trovata nelle variabili d\'ambiente');
    }
    this.genAI = new GoogleGenAI(this.apiKey);
  }

  // Converte file in base64
  async fileToBase64(file) {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => {
        // Rimuove il prefisso "data:image/jpeg;base64," o simile
        const base64 = reader.result.split(',')[1];
        resolve(base64);
      };
      reader.onerror = error => reject(error);
    });
  }

  // Genera prompt personalizzato in base alla parte selezionata
  generatePrompt(part) {
    const prompts = {
      'Busto': 'Sei un stylist professionista, dammi 5 consigli per l\'abito superiore (magliette, camicie, giacche, pullover) in base all\'immagine che ti ho inviato. Per ogni consiglio fornisci il nome dell\'abito, una descrizione dettagliata e la motivazione della scelta.',
      'Gambe': 'Sei un stylist professionista, dammi 5 consigli per l\'abbigliamento delle gambe (pantaloni, gonne, shorts, leggings) in base all\'immagine che ti ho inviato. Per ogni consiglio fornisci il nome dell\'abito, una descrizione dettagliata e la motivazione della scelta.',
      'Scarpe': 'Sei un stylist professionista, dammi 5 consigli per le scarpe (sneakers, tacchi, stivali, sandali) in base all\'immagine che ti ho inviato. Per ogni consiglio fornisci il nome del tipo di scarpa, una descrizione dettagliata e la motivazione della scelta.'
    };
    return prompts[part] || prompts['Busto'];
  }

  // Chiamata principale all'API
  async getStyleAdvice(imageFile, part) {
    try {
      // Converte l'immagine in base64
      const base64Image = await this.fileToBase64(imageFile);
      
      // Configura il modello
      const model = this.genAI.getGenerativeModel({ 
        model: "gemini-1.5-flash",
        generationConfig: {
          temperature: 0.7,
          topK: 40,
          topP: 0.95,
          maxOutputTokens: 2048,
        }
      });

      // Prepara il contenuto della richiesta
      const prompt = this.generatePrompt(part);
      
      const imagePart = {
        inlineData: {
          data: base64Image,
          mimeType: imageFile.type
        }
      };

      // Invia la richiesta
      const result = await model.generateContent([prompt, imagePart]);
      const response = await result.response;
      const text = response.text();

      // Parsing della risposta (adattabile in base al formato di risposta di Gemini)
      return this.parseResponse(text);

    } catch (error) {
      console.error('Errore nella chiamata API:', error);
      throw new Error(`Errore nell'ottenere consigli di stile: ${error.message}`);
    }
  }

  // Parsing della risposta di Gemini
  parseResponse(text) {
    try {
      // Cerca di parsare come JSON se possibile
      const jsonMatch = text.match(/\{[\s\S]*\}/);
      if (jsonMatch) {
        return JSON.parse(jsonMatch[0]);
      }

      // Altrimenti parsing manuale del testo
      const lines = text.split('\n').filter(line => line.trim());
      const advice = [];
      
      let currentItem = {};
      let itemCount = 0;

      for (const line of lines) {
        const trimmedLine = line.trim();
        
        // Riconosce i titoli numerati (1., 2., etc.)
        if (/^\d+\./.test(trimmedLine)) {
          if (Object.keys(currentItem).length > 0) {
            advice.push(currentItem);
          }
          currentItem = {
            id: ++itemCount,
            nome: trimmedLine.replace(/^\d+\.\s*/, ''),
            descrizione: '',
            consiglio: ''
          };
        } else if (trimmedLine.toLowerCase().includes('descrizione') || 
                   trimmedLine.toLowerCase().includes('caratteristiche')) {
          currentItem.descrizione = trimmedLine;
        } else if (trimmedLine.toLowerCase().includes('motivazione') || 
                   trimmedLine.toLowerCase().includes('perché') || 
                   trimmedLine.toLowerCase().includes('consiglio')) {
          currentItem.consiglio = trimmedLine;
        } else if (trimmedLine && Object.keys(currentItem).length > 0) {
          // Aggiungi contenuto alla descrizione se non è vuota
          if (!currentItem.descrizione) {
            currentItem.descrizione = trimmedLine;
          } else if (!currentItem.consiglio) {
            currentItem.consiglio = trimmedLine;
          }
        }
      }

      // Aggiungi l'ultimo item se presente
      if (Object.keys(currentItem).length > 0) {
        advice.push(currentItem);
      }

      return {
        success: true,
        data: advice,
        count: advice.length
      };

    } catch (error) {
      console.error('Errore nel parsing della risposta:', error);
      return {
        success: false,
        error: 'Errore nel parsing della risposta',
        rawText: text
      };
    }
  }
}

// Esporta un'istanza singleton
export default new GeminiAPI();