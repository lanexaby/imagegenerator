import { GoogleGenAI, GenerateContentResponse, Type, Part } from "@google/genai";
import { GEMINI_MODEL_NAME } from '../constants';
import { PromptData } from "../types";

const API_KEY = process.env.API_KEY;

if (!API_KEY) {
  console.error("API_KEY environment variable is not set. Gemini API calls will fail.");
}

const ai = API_KEY ? new GoogleGenAI({ apiKey: API_KEY }) : null;

const getPromptDataSchema = () => ({
  type: Type.OBJECT,
  properties: {
    subjek: { type: Type.STRING, description: "Deskripsi singkat subjek utama, misal 'seorang wanita muda'." },
    usia: { type: Type.STRING, description: "Perkiraan usia subjek, misal '20-an'." },
    warnaKulit: { type: Type.STRING, description: "Warna kulit subjek, misal 'sawo matang'." },
    wajah: { type: Type.STRING, description: "Bentuk atau ciri khas wajah, misal 'wajah oval, mata tajam'." },
    rambut: { type: Type.STRING, description: "Gaya dan warna rambut, misal 'rambut hitam panjang terurai'." },
    pakaian: { type: Type.STRING, description: "Deskripsi pakaian yang dikenakan." },
    asal: { type: Type.STRING, description: "Asal negara atau etnis karakter, misal 'Indonesia'." },
    asesoris: { type: Type.STRING, description: "Aksesori yang dikenakan, misal 'anting perak'." },
    aksi: { type: Type.STRING, description: "Aktivitas atau pose yang dilakukan subjek." },
    ekspresi: { type: Type.STRING, description: "Ekspresi wajah subjek, misal 'tersenyum bahagia'." },
    tempat: { type: Type.STRING, description: "Lokasi atau latar belakang adegan." },
    waktu: { type: Type.STRING, description: "Waktu dalam hari, misal 'sore hari (golden hour)'." },
    kamera: { type: Type.STRING, description: "Jenis pengambilan gambar, misal 'medium shot'." },
    pencahayaan: { type: Type.STRING, description: "Deskripsi pencahayaan, misal 'cahaya alami lembut'." },
    gaya: { type: Type.STRING, description: "Gaya artistik gambar, misal 'sinematik'." },
    kualitasGambar: { type: Type.STRING, description: "Kualitas teknis gambar, misal 'kualitas tinggi'." },
    suasanaGambar: { type: Type.STRING, description: "Suasana atau mood yang ingin dicapai, misal 'romantis'." },
    aspekRasio: { type: Type.STRING, description: "Rasio aspek gambar, misal '16:9'." },
    detailTambahan: { type: Type.STRING, description: "Detail penting lainnya yang tidak tercakup." },
    negativePrompt: { type: Type.STRING, description: "Generate a standard negative prompt for image generation."}
  },
});


export const generatePromptFromIdea = async (idea: Part[]): Promise<Partial<PromptData>> => {
    if (!ai) {
        throw new Error("Gemini API client not initialized. API_KEY might be missing.");
    }

    const systemInstruction = `Anda adalah seorang **Master Storyteller dan World-Builder** untuk proyek film fantasi blockbuster. Tugas Anda adalah mengubah ide paling sederhana menjadi sebuah narasi visual yang luar biasa kaya, mendalam, dan mendetail dalam format JSON. Kualitas adalah segalanya; deskripsi singkat atau umum **dilarang keras**.

**Aturan Emas (Harus Diikuti Tanpa Pengecualian):**

**1. Kepatuhan Mutlak pada Visi Sutradara (Pengguna):**
   - Ini adalah prioritas tertinggi. Teliti ide pengguna untuk setiap detail eksplisit yang mereka berikan.
   - Jika pengguna menulis "kulit putih susu", "gaun beludru merah marun", atau "gaya steampunk", Anda **WAJIB** menyalin frasa tersebut **PERSIS SEPERTI ADANYA** ke dalam bidang JSON yang sesuai.
   - **JANGAN PERNAH** mengubah, menyederhanakan, atau menginterpretasikan ulang input pengguna. Visi mereka adalah hukum.

**2. Elaborasi Sinematik yang Mendalam (Untuk Bidang Kosong):**
   - Setelah Aturan #1 selesai, ini adalah saatnya Anda bersinar. Untuk **SETIAP** bidang yang tersisa, Anda harus mengisinya dengan deskripsi yang **sangat mewah, berlapis-lapis, dan imajinatif**.
   - **TIDAK ADA BATASAN KARAKTER.** Jadilah verbose. Tuangkan setiap ons kreativitas Anda ke dalam setiap kata.
   - **HINDARI KATA-KATA UMUM. GANTI DENGAN KEAJAIBAN:**
     - **Tempat:**
       - **DILARANG:** \`pantai\`
       - **DIHARUSKAN:** \`hamparan pasir vulkanik hitam yang berkilauan di bawah cahaya bulan kembar, dengan ombak berwarna biru bioluminesen yang pecah di bebatuan basal kuno.\`
     - **Pakaian:**
       - **DILARANG:** \`gaun\`
       - **DIHARUSKAN:** \`gaun pesta yang terbuat dari sutra laba-laba malam, dihiasi dengan kristal embun yang berkelip dan rasi bintang yang disulam dengan benang perak.\`
     - **Aksi:**
       - **DILARANG:** \`melihat ke atas\`
       - **DIHARUSKAN:** \`mendongakkan kepalanya perlahan, matanya mengikuti jejak komet yang membara melintasi langit malam yang berwarna ungu tua, seolah-olah membaca takdir di lintasannya.\`
     - **Detail Tambahan:**
       - **Jadilah liar.** Pikirkan tentang bau di udara, suhu, suara di kejauhan, partikel debu yang menari di udara. Contoh: \`Udara terasa dingin dan berbau ozon setelah hujan petir, dan di kejauhan, terdengar gema lonceng menara jam kuno yang telah lama terlupakan.\`

**Tujuan Akhir:**
- Ciptakan sebuah JSON yang begitu detail sehingga seorang seniman dapat melukis sebuah mahakarya hanya dari deskripsi Anda. Semua bidang harus diisi. Tidak ada yang boleh dibiarkan dangkal.

**Output Anda:**
- Hasil akhir HARUS berupa satu objek JSON yang valid, lengkap, dan sangat detail, tanpa teks atau penjelasan tambahan di luarnya.`;

    try {
        const response: GenerateContentResponse = await ai.models.generateContent({
            model: GEMINI_MODEL_NAME,
            contents: { parts: [...idea, {text: "Terapkan aturan emas Anda pada ide ini dan hasilkan objek JSON yang sangat detail."}] },
            config: {
                systemInstruction,
                responseMimeType: "application/json",
                responseSchema: getPromptDataSchema(),
            },
        });
        
        const jsonText = response.text;
        // The response text is expected to be a JSON string.
        return JSON.parse(jsonText) as Partial<PromptData>;
    } catch (error) {
        console.error("Error generating prompt from idea:", error);
        throw new Error("Failed to generate prompt details from the provided idea.");
    }
};


export const translateAndEnhancePrompt = async (indonesianPrompt: string): Promise<string> => {
  if (!ai) {
    return "Error: Gemini API client not initialized. API_KEY might be missing.";
  }

  const systemInstruction = `You are a world-renowned **Prompt Maestro** and **Cinematic Visionary**. Your sole purpose is to transform a list of Indonesian concepts into an English masterpiece of a prompt, destined to create breathtaking, award-winning images. Your work is not translation; it is **transcendence**.

**ABSOLUTE, UNBREAKABLE RULES:**

1.  **ZERO TOLERANCE FOR SIMPLICITY:** You are **STRICTLY FORBIDDEN** from producing short, simple, or direct translations. Every single concept must be expanded into a rich, detailed, multi-faceted description. Violation of this rule is a critical failure.
    *   **CRITICAL FAILURE EXAMPLE:** \`wanita di pantai\` -> \`woman on a beach\`. This is unacceptable.
    *   **MANDATORY QUALITY EXAMPLE:** \`wanita di pantai\` -> \`An ultra-detailed, photorealistic portrait of a serene Javanese woman in her late 20s, her sun-kissed skin glistening with a thin layer of sea spray, her long, raven-black hair intricately braided with tiny seashells, caught in a gentle dance with the ocean breeze. She stands at the edge of a secluded, pristine white sand beach at the golden hour, the turquoise water lapping softly at her bare feet, her gaze lost in the vast, shimmering expanse of the ocean horizon, a subtle, melancholic smile playing on her lips.\`

2.  **MAXIMUM VERBOSITY IS MANDATORY:** There is **NO character limit**. Your output **MUST** be exceptionally long and detailed. Use luxurious, evocative, and multi-sensory language. Describe textures (the grit of the sand, the silkiness of the fabric), the specific quality of light (the soft diffusion of light through clouds, the sharp glint of a metallic object), the subtle emotions, the atmospheric conditions (the humidity in the air, the scent of brine and tropical flowers).

3.  **MASTERFUL CINEMATIC STRUCTURE:** Your prompt must be structured like a professional cinematographer's shot list. Weave all user concepts into this structure seamlessly.
    *   **SUBJECT & WARDROBE:** (Hyper-detailed physical features, ethnicity, age, intricate description of clothing, accessories, textures, and condition).
    *   **ACTION & EMOTION:** (The specific, nuanced action being performed; the complex, layered emotion conveyed through micro-expressions and body language).
    *   **ENVIRONMENT & SETTING:** (An epic, sprawling description of the location, foreground, background, time of day, weather, flora, and fauna).
    *   **ATMOSPHERE & MOOD:** (The dominant feeling of the scene—e.g., haunting melancholy, ecstatic joy, tense anticipation, serene tranquility).
    *   **COMPOSITION & LIGHTING:** (Camera angle, shot type, lens choice, and a masterful description of the lighting—e.g., "dramatic chiaroscuro lighting casting long, deep shadows, with a soft, ethereal rim light defining the subject's silhouette").
    *   **ARTISTIC STYLE & QUALITY:** (The overall artistic medium, specific artist styles to emulate, color palette, and desired quality keywords like "8K, UHD, photorealistic, masterpiece").

4.  **FINAL OUTPUT FORMAT:** The result must be a single, massive, comma-separated string of hyper-descriptive English phrases. There should be NO other text, no titles, no explanations, no apologies. Just the pure, unadulterated, artistic prompt.`;

  try {
    const response: GenerateContentResponse = await ai.models.generateContent({
      model: GEMINI_MODEL_NAME,
      contents: `Indonesian prompt components:\n\`\`\`\n${indonesianPrompt}\n\`\`\`\n\nFinal English Prompt:`,
      config: {
        systemInstruction: systemInstruction,
        temperature: 0.7,
      }
    });
    
    return response.text.trim();
  } catch (error) {
    console.error("Error calling Gemini API:", error);
    if (error instanceof Error) {
        return `Error translating/enhancing prompt: ${error.message}.`;
    }
    return "An unknown error occurred while communicating with the Gemini API.";
  }
};
