
import { GoogleGenAI, Modality } from "@google/genai";

// Audio Decoding Helpers
function decode(base64: string) {
  const binaryString = atob(base64);
  const len = binaryString.length;
  const bytes = new Uint8Array(len);
  for (let i = 0; i < len; i++) {
    bytes[i] = binaryString.charCodeAt(i);
  }
  return bytes;
}

async function decodeAudioData(
  data: Uint8Array,
  ctx: AudioContext,
  sampleRate: number,
  numChannels: number,
): Promise<AudioBuffer> {
  const dataInt16 = new Int16Array(data.buffer);
  const frameCount = dataInt16.length / numChannels;
  const buffer = ctx.createBuffer(numChannels, frameCount, sampleRate);

  for (let channel = 0; channel < numChannels; channel++) {
    const channelData = buffer.getChannelData(channel);
    for (let i = 0; i < frameCount; i++) {
      channelData[i] = dataInt16[i * numChannels + channel] / 32768.0;
    }
  }
  return buffer;
}

function audioBufferToWav(buffer: AudioBuffer): Blob {
  const numOfChan = buffer.numberOfChannels;
  const length = buffer.length * numOfChan * 2 + 44;
  const outBuffer = new ArrayBuffer(length);
  const view = new DataView(outBuffer);
  const channels = [];
  let i;
  let sample;
  let offset = 0;
  let pos = 0;

  function setUint16(data: number) {
    view.setUint16(pos, data, true);
    pos += 2;
  }

  function setUint32(data: number) {
    view.setUint32(pos, data, true);
    pos += 4;
  }

  setUint32(0x46464952);                         // "RIFF"
  setUint32(length - 8);                         // file length - 8
  setUint32(0x45564157);                         // "WAVE"

  setUint32(0x20746d66);                         // "fmt " chunk
  setUint32(16);                                 // length = 16
  setUint16(1);                                  // PCM
  setUint16(numOfChan);
  setUint32(buffer.sampleRate);
  setUint32(buffer.sampleRate * 2 * numOfChan);
  setUint16(numOfChan * 2);
  setUint16(16);

  setUint32(0x61746164);                         // "data"
  setUint32(length - pos - 4);

  for (i = 0; i < buffer.numberOfChannels; i++) {
    channels.push(buffer.getChannelData(i));
  }

  while (pos < length) {
    for (i = 0; i < numOfChan; i++) {
      sample = Math.max(-1, Math.min(1, channels[i][offset]));
      sample = (sample < 0 ? sample * 0x8000 : sample * 0x7FFF);
      view.setInt16(pos, sample, true);
      pos += 2;
    }
    offset++;
  }

  return new Blob([outBuffer], { type: "audio/wav" });
}

export class NourVoiceService {
  private ai = new GoogleGenAI({ apiKey: process.env.API_KEY as string });

  async preprocessText(text: string, options: { dialect: string, field: string, personality: string, controls: any }): Promise<string> {
    const prompt = `
Vous êtes l'ingénieur du son principal de "NOUR VOICE - Professional Voice Engine". 
Votre tâche est de raffiner le texte suivant pour une production vocale professionnelle.

Paramètres :
1. Langue/Style : ${options.dialect}.
2. Domaine : ${options.field}.
3. Personnalité : ${options.personality}.
4. Consignes : Optimisez la ponctuation, le rythme et le ton pour un rendu naturel. Style de narration souhaité : ${options.controls?.narration || 'Narrative'}.

Texte à traiter :
"${text}"

Retournez uniquement le texte optimisé, sans commentaires.
    `;

    try {
      const result = await this.ai.models.generateContent({
        model: "gemini-3-flash-preview",
        contents: [{ parts: [{ text: prompt }] }],
      });
      return result.text || text;
    } catch (error) {
      console.error("Preprocessing Error:", error);
      return text;
    }
  }

  async generateVoiceOver(text: string, voiceName: string, performanceNote: string): Promise<string> {
    const studioDirective = `
Directives NOUR VOICE :
Générez une performance vocale de haute qualité basée sur ces spécifications :

${performanceNote}

Règles de production :
1. Respectez strictement l'accent et l'intonation de la langue choisie.
2. Incarnez la personnalité du profil vocal sélectionné.
3. Appliquez les modulations de vitesse, profondeur, ton et style de narration demandées.
4. Aucun texte étranger ne doit être ajouté.

Texte à enregistrer :
"${text}"
    `;

    try {
      const response = await this.ai.models.generateContent({
        model: "gemini-2.5-flash-preview-tts",
        contents: [{ parts: [{ text: studioDirective }] }],
        config: {
          responseModalities: [Modality.AUDIO],
          speechConfig: {
            voiceConfig: {
              prebuiltVoiceConfig: { voiceName },
            },
          },
        },
      });

      const base64Audio = response.candidates?.[0]?.content?.parts?.[0]?.inlineData?.data;
      if (!base64Audio) throw new Error("Erreur de génération audio.");

      const audioContext = new (window.AudioContext || (window as any).webkitAudioContext)({ sampleRate: 24000 });
      const decodedBytes = decode(base64Audio);
      const audioBuffer = await decodeAudioData(decodedBytes, audioContext, 24000, 1);
      
      const wavBlob = audioBufferToWav(audioBuffer);
      return URL.createObjectURL(wavBlob);
    } catch (error) {
      console.error("Studio Generation Error:", error);
      throw error;
    }
  }
}

export const nourService = new NourVoiceService();
