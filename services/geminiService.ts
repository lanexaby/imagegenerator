import { GoogleGenAI, Type, GenerateContentResponse } from "@google/genai";
import { FieldDefinition } from './types';

// Pastikan variabel lingkungan API_KEY sudah diatur
const API_KEY = process.env.API_KEY;
if (!API_KEY) {
  // Dalam aplikasi nyata, Anda mungkin ingin menangani ini dengan lebih baik
  // daripada hanya melempar error, tapi untuk tujuan ini, ini sudah cukup.
  console.error("API_KEY tidak ditemukan di variabel lingkungan.");
}
const ai = new GoogleGenAI({ apiKey: API_KEY! });

// Fungsi untuk mengubah file menjadi string base64
const fileToGenerativePart = async (file: File) => {
  const base64EncodedDataPromise = new Promise<string>((resolve) => {
    const reader = new FileReader();
    reader.onloadend = () => resolve((reader.result as string).split(',')[1]);
    reader.readAsDataURL(file);
  });
  return {
    inlineData: { data: await base64EncodedDataPromise, mimeType: file.type },
  };
};

const createGenerationPrompt = (idea: string, fields: FieldDefinition[]): string => {
  const hasTechnicalInstructions = fields.some(f => f.key === 'technical_instructions');
  
  let basePrompt = `Berdasarkan ide utama ini: "${idea}", kembangkan dan isi setiap kolom berikut dengan deskripsi yang kreatif, detail, dan sinematik. 
  Perhatian khusus untuk kolom 'warna_kulit': jika subjek bukan manusia, isilah dengan deskripsi warna permukaan subjek (misal: 'sisik hijau zamrud' untuk naga) atau tulis 'Tidak Berlaku'. 
  Buat juga "negativePrompt" yang sesuai. 
  Terakhir, buat 'dialog' singkat yang tematik. Dialog ini harus mencerminkan ciri-ciri karakter yang telah kamu tentukan (seperti subjek, pakaian, ekspresi). Jika ada dua karakter, buat percakapan di antara mereka. Jika tidak ada karakter, isi kolom dialog dengan "Tidak ada dialog".
  PENTING untuk dialog: JANGAN sertakan nama karakter atau label narator (contoh: 'Ksatria:'). Tulis HANYA kalimat dialognya. Jika ada dua pembicara, pisahkan dialog mereka dengan baris baru.`;

  if (hasTechnicalInstructions) {
    basePrompt += `
    PENTING untuk SINKRONISASI BIBIR: Jika kolom 'dialog' berisi dialog (bukan "Tidak ada dialog"), Anda WAJIB mengisi kolom 'technical_instructions' dengan perintah teknis berikut untuk memastikan sinkronisasi bibir yang sempurna: "lip_sync: sangat presisi, akurat per frame (frame-accurate), tanpa jeda (zero-delay), dengan gerakan antisipasi bibir yang halus sebelum karakter berbicara untuk realisme maksimal." Jika tidak ada dialog, biarkan kolom 'technical_instructions' kosong atau isi dengan "Tidak berlaku".`;
  }
  
  return basePrompt;
};


export const generateDetailsFromText = async (idea: string, fields: FieldDefinition[]): Promise<any> => {
  const fieldNames = fields.map(f => f.key);
  const schemaProperties = fieldNames.reduce((acc, key) => {
      acc[key] = { type: Type.STRING, description: `Detail untuk ${key.replace(/_/g, ' ')}` };
      return acc;
  }, {} as any);

  const responseSchema = {
    type: Type.OBJECT,
    properties: schemaProperties,
  };
  
  const generationPrompt = createGenerationPrompt(idea, fields);
  
  try {
    const response: GenerateContentResponse = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: generationPrompt,
      config: {
        systemInstruction: "Anda adalah asisten AI yang ahli dalam membuat prompt detail untuk generator gambar dan video. Jawab dalam Bahasa Indonesia. Pastikan semua field terisi.",
        responseMimeType: "application/json",
        responseSchema: responseSchema,
      },
    });

    const jsonText = response.text.trim();
    return JSON.parse(jsonText);
  } catch (error) {
    console.error("Error saat menghasilkan detail dari teks:", error);
    throw new Error("Gagal berkomunikasi dengan AI. Silakan coba lagi.");
  }
};

export const generateDetailsFromImage = async (idea: string, imageFile: File, fields: FieldDefinition[]): Promise<any> => {
  const fieldNames = fields.map(f => f.key);
   const schemaProperties = fieldNames.reduce((acc, key) => {
      acc[key] = { type: Type.STRING, description: `Detail untuk ${key.replace(/_/g, ' ')}` };
      return acc;
  }, {} as any);

  const responseSchema = {
    type: Type.OBJECT,
    properties: schemaProperties,
  };
  
  const generationPrompt = createGenerationPrompt(idea, fields);

  try {
    const imagePart = await fileToGenerativePart(imageFile);
    const textPart = { text: `Analisis gambar ini dan gunakan sebagai inspirasi utama. ${generationPrompt}` };
    
    const response: GenerateContentResponse = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: { parts: [imagePart, textPart] },
      config: {
        systemInstruction: "Anda adalah asisten AI yang ahli dalam menganalisis gambar dan membuat prompt detail. Jawab dalam Bahasa Indonesia. Pastikan semua field terisi.",
        responseMimeType: "application/json",
        responseSchema: responseSchema,
      },
    });

    const jsonText = response.text.trim();
    return JSON.parse(jsonText);
  } catch (error) {
    console.error("Error saat menghasilkan detail dari gambar:", error);
    throw new Error("Gagal menganalisis gambar dengan AI. Pastikan format gambar didukung dan coba lagi.");
  }
};


export const translatePrompt = async (indonesianPrompt: string, textToSkip: string): Promise<string> => {
  if (!indonesianPrompt) return "";
  try {
    const prompt = textToSkip
      ? `Terjemahkan teks berikut dari Bahasa Indonesia ke Bahasa Inggris. PENTING: JANGAN terjemahkan kalimat yang ada di dalam tanda kutip ini: "${textToSkip}". Teks untuk diterjemahkan: \n\n${indonesianPrompt}`
      : `Terjemahkan teks berikut dari Bahasa Indonesia ke Bahasa Inggris:\n\n${indonesianPrompt}`;

    const response: GenerateContentResponse = await ai.models.generateContent({
        model: "gemini-2.5-flash",
        contents: prompt,
        config: {
          systemInstruction: "Anda adalah API terjemahan. Terjemahkan teks yang diberikan dari Bahasa Indonesia ke Bahasa Inggris. JANGAN sertakan penjelasan, catatan, atau teks pembuka apa pun dalam respons Anda. Kembalikan HANYA teks yang diterjemahkan.",
        }
    });
    return response.text;
  } catch (error) {
    console.error("Error saat menerjemahkan prompt:", error);
    throw new Error("Gagal menerjemahkan prompt. Silakan coba lagi.");
  }
};