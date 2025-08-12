
import React, { useState, useCallback, useEffect, useRef } from 'react';
import FormSection from './components/FormSection';
import CollapsibleSection from './components/CollapsibleSection';
import { generatePromptFromIdea, translateAndEnhancePrompt } from './services/geminiService';
import { PromptData } from './types';
import {
  DEFAULT_NEGATIVE_PROMPT,
} from './constants';
import { Part } from '@google/genai';


// Helper to convert file to base64
const fileToGenerativePart = async (file: File): Promise<Part> => {
  const base64EncodedDataPromise = new Promise<string>((resolve) => {
    const reader = new FileReader();
    reader.onloadend = () => resolve((reader.result as string).split(',')[1]);
    reader.readAsDataURL(file);
  });
  return {
    inlineData: { data: await base64EncodedDataPromise, mimeType: file.type },
  };
};

// SVG Icons
const IconImage = () => <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className="w-5 h-5"><path strokeLinecap="round" strokeLinejoin="round" d="m2.25 15.75 5.159-5.159a2.25 2.25 0 0 1 3.182 0l5.159 5.159m-1.5-1.5 1.409-1.409a2.25 2.25 0 0 1 3.182 0l2.909 2.909m-18 3.75h16.5a1.5 1.5 0 0 0 1.5-1.5V6a1.5 1.5 0 0 0-1.5-1.5H3.75A1.5 1.5 0 0 0 2.25 6v12a1.5 1.5 0 0 0 1.5 1.5Zm10.5-11.25h.008v.008h-.008V8.25Zm.375 0a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0Z" /></svg>;
const IconText = () => <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className="w-5 h-5"><path strokeLinecap="round" strokeLinejoin="round" d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25H12" /></svg>;
const IconPerson = () => <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className="w-6 h-6"><path strokeLinecap="round" strokeLinejoin="round" d="M15.75 6a3.75 3.75 0 1 1-7.5 0 3.75 3.75 0 0 1 7.5 0ZM4.501 20.118a7.5 7.5 0 0 1 14.998 0A17.933 17.933 0 0 1 12 21.75c-2.676 0-5.216-.584-7.499-1.632Z" /></svg>;
const IconPalette = () => <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className="w-6 h-6"><path strokeLinecap="round" strokeLinejoin="round" d="M4.098 19.902a3.75 3.75 0 0 0 5.304 0l6.401-6.402M6.75 21A3.75 3.75 0 0 1 3 17.25V4.125C3 3.504 3.504 3 4.125 3h5.25c.621 0 1.125.504 1.125 1.125v4.072M6.75 21a3.75 3.75 0 0 0 3.75-3.75V8.197M6.75 21h13.125c.621 0 1.125-.504 1.125-1.125V4.125C21 3.504 20.496 3 19.875 3H14.25M9 13.5h3m-3 3h3m-3 3h3" /></svg>;
const IconShirt = () => <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className="w-6 h-6"><path strokeLinecap="round" strokeLinejoin="round" d="M9.813 15.904L9 18.75l-.813-2.846a4.5 4.5 0 0 1-3.09-3.09L2.25 12l2.846-.813a4.5 4.5 0 0 1 3.09-3.09L9 5.25l.813 2.846a4.5 4.5 0 0 1 3.09 3.09L15.75 12l-2.846.813a4.5 4.5 0 0 1-3.09 3.09ZM18.259 8.715L18 9.75l-.259-1.035a3.375 3.375 0 0 0-2.455-2.456L14.25 6l1.036-.259a3.375 3.375 0 0 0 2.455-2.456L18.75 2.25l.259 1.035a3.375 3.375 0 0 0 2.456 2.456L22.5 6l-1.035.259a3.375 3.375 0 0 0-2.456 2.456ZM16.898 20.572L16.5 21.75l-.398-1.178a3.375 3.375 0 0 0-2.31-2.31L12.525 18l1.178-.398a3.375 3.375 0 0 0 2.31-2.31L16.5 14.25l.398 1.178a3.375 3.375 0 0 0 2.31 2.31L20.375 18l-1.178.398a3.375 3.375 0 0 0-2.31 2.31Z" /></svg>;
const IconPlanet = () => <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className="w-6 h-6"><path strokeLinecap="round" strokeLinejoin="round" d="M12.75 3.03v.568c0 .334.148.65.405.864l1.068.89c.442.369.535 1.01.216 1.49l-.51.766a2.25 2.25 0 0 1-1.161.886l-.143.048a1.125 1.125 0 0 0-.11 1.963l.135.05a1.125 1.125 0 0 0 1.11-1.963l-.135-.05a2.25 2.25 0 0 1-1.11-1.963l.135-.05A2.25 2.25 0 0 1 9 15.75V9.75M8.25 21a12.75 12.75 0 1 1 7.5 0" /></svg>;
const IconSparkles = () => <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className="w-6 h-6"><path strokeLinecap="round" strokeLinejoin="round" d="M9.813 15.904 9 18.75l-.813-2.846a4.5 4.5 0 0 1-3.09-3.09L2.25 12l2.846-.813a4.5 4.5 0 0 1 3.09-3.09L9 5.25l.813 2.846a4.5 4.5 0 0 1 3.09 3.09L15.75 12l-2.846.813a4.5 4.5 0 0 1-3.09 3.09ZM18.259 8.715L18 9.75l-.259-1.035a3.375 3.375 0 0 0-2.455-2.456L14.25 6l1.036-.259a3.375 3.375 0 0 0 2.455-2.456L18.75 2.25l.259 1.035a3.375 3.375 0 0 0 2.456 2.456L22.5 6l-1.035.259a3.375 3.375 0 0 0-2.456 2.456ZM16.898 20.572L16.5 21.75l-.398-1.178a3.375 3.375 0 0 0-2.31-2.31L12.525 18l1.178-.398a3.375 3.375 0 0 0 2.31-2.31L16.5 14.25l.398 1.178a3.375 3.375 0 0 0 2.31 2.31L20.375 18l-1.178.398a3.375 3.375 0 0 0-2.31 2.31Z" /></svg>;
const IconMapPin = () => <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className="w-6 h-6"><path strokeLinecap="round" strokeLinejoin="round" d="M15 10.5a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z" /><path strokeLinecap="round" strokeLinejoin="round" d="M19.5 10.5c0 7.142-7.5 11.25-7.5 11.25S4.5 17.642 4.5 10.5a7.5 7.5 0 1 1 15 0Z" /></svg>;
const IconClock = () => <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className="w-6 h-6"><path strokeLinecap="round" strokeLinejoin="round" d="M12 6v6h4.5m4.5 0a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" /></svg>;
const IconCamera = () => <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className="w-6 h-6"><path strokeLinecap="round" strokeLinejoin="round" d="M6.827 6.175A2.31 2.31 0 0 1 5.186 7.825L2.884 12.72a11.24 11.24 0 0 0 .04 1.353c.123.638.27 1.259.435 1.848.408 1.48.983 2.825 1.67 4.026.31.42.637.828.98 1.213.318.36.66.693 1.018.995a11.25 11.25 0 0 0 4.975 2.12c.749.193 1.505.33 2.26.412a11.25 11.25 0 0 0 4.226 0c.755-.082 1.511-.219 2.26-.412.358-.092.709-.204 1.04-.337.31-.12.608-.255.89-.4.32-.16.623-.338.91-.53.32-.21.62-.438.91-.68.28-.23.55-.48.81-.74.26-.26.5-.54.73-.82l.024-.03.01-.013c.23-.29.45-.6.66-1.18.21-.58.35-1.18.41-1.8.06-.63.04-1.27-.04-1.9.02-.002.04-.004.06-.006a1.5 1.5 0 0 0 1.44-2.24l-1.02-2.8a1.5 1.5 0 0 0-2.24-1.01l-1.02 2.8a1.5 1.5 0 0 0 1.01 2.24l.03.01c-.1-.01-.2-.01-.3-.01Z" /></svg>;
const IconSun = () => <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className="w-6 h-6"><path strokeLinecap="round" strokeLinejoin="round" d="M12 3v2.25m6.364.386-1.591 1.591M21 12h-2.25m-.386 6.364-1.591-1.591M12 18.75V21m-4.773-4.227-1.591 1.591M5.25 12H3m4.227-4.773L5.636 5.636M15.75 12a3.75 3.75 0 1 1-7.5 0 3.75 3.75 0 0 1 7.5 0Z" /></svg>;
const IconPaintBrush = () => <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className="w-6 h-6"><path strokeLinecap="round" strokeLinejoin="round" d="M9.53 16.122a3 3 0 0 0-2.228-1.326L5.603 14.54a3 3 0 0 0-2.228 1.326M5.603 14.54a2.25 2.25 0 0 1-2.25-2.25V6.75a2.25 2.25 0 0 1 2.25-2.25h12.897a2.25 2.25 0 0 1 2.25 2.25v5.54a2.25 2.25 0 0 1-2.25 2.25M5.603 14.54L5.603 14.54a3 3 0 0 1 3.225 0l2.122 2.122a3 3 0 0 1 0 4.242 3 3 0 0 1-4.242 0l-2.122-2.122a3 3 0 0 1 0-4.242Z" /></svg>;
const IconCheckBadge = () => <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className="w-6 h-6"><path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75 11.25 15 15 9.75M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" /></svg>;
const IconAspectRatio = () => <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className="w-6 h-6"><path strokeLinecap="round" strokeLinejoin="round" d="M3.75 3.75v4.5m0-4.5h4.5m-4.5 0L9 9M3.75 20.25v-4.5m0 4.5h4.5m-4.5 0L9 15M20.25 3.75h-4.5m4.5 0v4.5m0-4.5L15 9m5.25 11.25h-4.5m4.5 0v-4.5m0 4.5L15 15" /></svg>;
const IconDetails = () => <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className="w-6 h-6"><path strokeLinecap="round" strokeLinejoin="round" d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5" /></svg>;
const IconMinusCircle = () => <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className="w-6 h-6"><path strokeLinecap="round" strokeLinejoin="round" d="M15 12H9m12 0a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" /></svg>;

// Autosizing Textarea Component
interface AutosizeTextareaProps extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
    value: string;
}
const AutosizeTextarea: React.FC<AutosizeTextareaProps> = ({ value, ...props }) => {
    const textareaRef = useRef<HTMLTextAreaElement>(null);

    useEffect(() => {
        const textarea = textareaRef.current;
        if (textarea) {
            textarea.style.height = 'auto'; // Reset height to recalculate
            textarea.style.height = `${textarea.scrollHeight}px`; // Set to content height
        }
    }, [value]); // Reruns when the text value changes

    return (
        <textarea
            ref={textareaRef}
            value={value}
            rows={1} // Start with one row and let it expand
            {...props}
        />
    );
};

const HeartbeatLoader = ({ text, className = '' }: { text: string; className?: string }) => (
    <div className={`flex items-center gap-3 ${className}`} aria-live="polite" role="status">
        <svg width="180" height="24" viewBox="0 0 220 30" role="img" aria-label="Heartbeat loading animation">
            <style>
                {`
                .pulse-path-hbl {
                    stroke: #f9a8d4; /* Tailwind pink-300 */
                    stroke-width: 2.5;
                    fill: none;
                    stroke-dasharray: 720;
                    stroke-dashoffset: 720;
                    animation: draw-pulse-hbl 3s ease-in-out infinite;
                }

                @keyframes draw-pulse-hbl {
                    0% {
                        stroke-dashoffset: 720;
                        opacity: 0;
                    }
                    30% {
                        stroke-dashoffset: 720;
                        opacity: 1;
                    }
                    70% {
                        stroke-dashoffset: 0;
                        opacity: 1;
                    }
                    100% {
                        stroke-dashoffset: 0;
                        opacity: 0;
                    }
                }
                `}
            </style>
            <path className="pulse-path-hbl" d="M0,15 h20 l5,-10 l10,20 l5,-10 h20 l5,-10 l10,20 l5,-10 h20 l5,-10 l10,20 l5,-10 h20 l5,-10 l10,20 l5,-10 h20" />
        </svg>
        <span className="text-sm text-pink-200/90 font-medium">{text}</span>
    </div>
);


const App: React.FC = () => {
    const initialPromptData: PromptData = {
        subjek: '',
        usia: '',
        warnaKulit: '',
        wajah: '',
        rambut: '',
        pakaian: '',
        asal: '',
        asesoris: '',
        aksi: '',
        ekspresi: '',
        tempat: '',
        waktu: '',
        kamera: '',
        pencahayaan: '',
        gaya: '',
        kualitasGambar: '',
        suasanaGambar: '',
        aspekRasio: '',
        detailTambahan: '',
        negativePrompt: DEFAULT_NEGATIVE_PROMPT,
    };

  const [promptData, setPromptData] = useState<PromptData>(initialPromptData);
  const [ideaText, setIdeaText] = useState<string>('');
  const [indonesianPrompt, setIndonesianPrompt] = useState<string>('');
  const [englishPrompt, setEnglishPrompt] = useState<string>('');
  const [showResults, setShowResults] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [isGeneratingIdea, setIsGeneratingIdea] = useState<boolean>(false);
  const [apiKeyMissing, setApiKeyMissing] = useState<boolean>(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const resultsRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!process.env.API_KEY) {
      setApiKeyMissing(true);
    }
  }, []);

  const handleInputChange = (field: keyof PromptData, value: string) => {
    setPromptData(prev => ({ ...prev, [field]: value }));
  };
  
  const constructIndonesianPrompt = useCallback((): string => {
    const {
        subjek, usia, warnaKulit, wajah, rambut, pakaian, asal, asesoris,
        aksi, ekspresi, tempat, waktu, kamera, pencahayaan, gaya,
        kualitasGambar, suasanaGambar, aspekRasio, detailTambahan
    } = promptData;

    const potentialParts = [
        { value: subjek, prefix: "" },
        { value: usia, prefix: "usia " },
        { value: warnaKulit, prefix: "kulit " },
        { value: wajah, prefix: "wajah " },
        { value: rambut, prefix: "rambut " },
        { value: pakaian, prefix: "mengenakan " },
        { value: asal, prefix: "berasal dari " },
        { value: asesoris, prefix: "dengan " },
        { value: aksi, prefix: "sedang " },
        { value: ekspresi, prefix: "ekspresi " },
        { value: tempat, prefix: "di " },
        { value: waktu, prefix: "" },
        { value: kamera, prefix: "" },
        { value: pencahayaan, prefix: "" },
        { value: gaya, prefix: "" },
        { value: kualitasGambar, prefix: "" },
        { value: suasanaGambar, prefix: "suasana " },
        { value: aspekRasio, prefix: "" },
        { value: detailTambahan, prefix: "" },
    ];
    
    const promptParts = potentialParts.map(part => {
        const trimmedValue = part.value.trim();
        if (trimmedValue) {
            return `${part.prefix}${trimmedValue}`;
        }
        return null;
    }).filter(p => p !== null);

    return promptParts.join(', ');
  }, [promptData]);

  const handleFullPromptGeneration = async () => {
    if (apiKeyMissing) {
      alert("Error: API_KEY tidak ditemukan. Mohon konfigurasikan environment variable API_KEY.");
      return;
    }
    const currentIndonesianPrompt = constructIndonesianPrompt();
    if (!currentIndonesianPrompt) {
        alert("Mohon isi beberapa detail sebelum menghasilkan prompt.");
        return;
    }
    setIndonesianPrompt(currentIndonesianPrompt);
    setShowResults(true);
    setIsLoading(true);
    setEnglishPrompt('');

    // Scroll to results section after a short delay to allow rendering
    setTimeout(() => {
        resultsRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }, 100);

    try {
      const finalPrompt = await translateAndEnhancePrompt(currentIndonesianPrompt);
      const fullPromptWithNegative = `${finalPrompt} --no ${promptData.negativePrompt}`;
      setEnglishPrompt(fullPromptWithNegative);
    } catch (error) {
      console.error("Failed to generate English prompt:", error);
      setEnglishPrompt("Gagal menerjemahkan atau meningkatkan prompt. Silakan coba lagi.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleIdeaGeneration = async (parts: Part[]) => {
      if (apiKeyMissing) {
          alert("Error: API_KEY tidak ditemukan. Mohon konfigurasikan environment variable API_KEY.");
          return;
      }
      setIsGeneratingIdea(true);
      try {
          const generatedData = await generatePromptFromIdea(parts);
          // Update state with new data, keeping existing values if a field is not returned
          setPromptData(prev => ({ ...prev, ...generatedData, negativePrompt: generatedData.negativePrompt || prev.negativePrompt }));

      } catch (error) {
          console.error("Failed to generate from idea:", error);
          alert("Gagal membuat ide. Silakan coba lagi.");
      } finally {
          setIsGeneratingIdea(false);
          setIdeaText('');
      }
  };

  const handleGenerateFromText = () => {
      if (!ideaText.trim()) {
          alert("Mohon masukkan ide singkat terlebih dahulu.");
          return;
      }
      handleIdeaGeneration([{ text: ideaText }]);
  };

  const handleGenerateFromImage = async (event: React.ChangeEvent<HTMLInputElement>) => {
      const file = event.target.files?.[0];
      if (!file) return;

      const imagePart = await fileToGenerativePart(file);
      handleIdeaGeneration([imagePart]);
      
      if(fileInputRef.current) {
        fileInputRef.current.value = "";
      }
  };
  
  const renderInput = (field: keyof PromptData) => (
    <AutosizeTextarea
        value={promptData[field]}
        onChange={(e) => handleInputChange(field, e.target.value)}
        className="w-full p-3 bg-red-900/50 border border-red-700/60 rounded-md text-pink-100 focus:ring-2 focus:ring-pink-400 focus:border-pink-400 placeholder-pink-300/70 resize-none overflow-y-hidden"
    />
  );

  return (
    <div className="min-h-screen container mx-auto p-4 md:p-8 selection:bg-pink-500 selection:text-white">
      <header className="text-center mb-10">
        <h1 
          className="text-4xl md:text-5xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-pink-300 via-pink-100 to-rose-300 pb-2"
          style={{ fontFamily: "'Playfair Display', serif" }}
        >
          Prompt Generator Image
        </h1>
        <p className="text-pink-200/90 text-lg mt-2 max-w-3xl mx-auto">
          Ciptakan prompt gambar yang kaya detail. Mulai dengan ide, atau isi manual untuk kontrol penuh.
        </p>
      </header>
      
      {apiKeyMissing && (
        <div className="mb-6 p-4 bg-yellow-500/30 border border-yellow-600 text-yellow-100 rounded-lg text-center">
          <strong>Peringatan:</strong> API_KEY untuk Gemini API tidak ditemukan. Fungsi terjemahan dan peningkatan prompt tidak akan bekerja.
        </div>
      )}

      <main className="max-w-4xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
            <div className='md:col-span-2'>
              <FormSection icon={<IconText />} title="Ide Prompt">
                <AutosizeTextarea
                  value={ideaText}
                  onChange={(e) => setIdeaText(e.target.value)}
                  className="w-full p-3 bg-red-900/50 border border-red-700/60 rounded-md text-pink-100 focus:ring-2 focus:ring-pink-400 placeholder-pink-300/70 mb-3 resize-none overflow-y-hidden"
                  placeholder="Deskripsikan ide gambarmu di sini..."
                />
                <div className='flex items-center justify-start gap-3 flex-wrap'>
                  <button onClick={handleGenerateFromText} disabled={isGeneratingIdea} className="flex items-center justify-center gap-2 px-5 py-2.5 bg-pink-500/80 hover:bg-pink-600/90 text-white font-semibold rounded-lg shadow-md transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed">
                    <IconText/> Kembangkan Teks
                  </button>
                  <input type="file" accept="image/*" className="hidden" ref={fileInputRef} onChange={handleGenerateFromImage} />
                  <button onClick={() => fileInputRef.current?.click()} disabled={isGeneratingIdea} className="flex items-center justify-center gap-2 px-5 py-2.5 bg-rose-500/80 hover:bg-rose-600/90 text-white font-semibold rounded-lg shadow-md transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed">
                    <IconImage/> Dari Gambar
                  </button>
                  {isGeneratingIdea && <HeartbeatLoader text="Mengembangkan..." className="ml-2" />}
                </div>
              </FormSection>
            </div>
            
            <FormSection icon={<IconPerson />} title="Subjek">{renderInput('subjek')}</FormSection>
            <FormSection icon={<IconPerson />} title="Usia">{renderInput('usia')}</FormSection>
            <FormSection icon={<IconPalette />} title="Warna Kulit">{renderInput('warnaKulit')}</FormSection>
            <FormSection icon={<IconPerson />} title="Wajah">{renderInput('wajah')}</FormSection>
            <FormSection icon={<IconPerson />} title="Rambut">{renderInput('rambut')}</FormSection>
            <FormSection icon={<IconShirt />} title="Pakaian">{renderInput('pakaian')}</FormSection>
            <FormSection icon={<IconPlanet />} title="Asal (Negara)">{renderInput('asal')}</FormSection>
            <FormSection icon={<IconSparkles />} title="Asesoris">{renderInput('asesoris')}</FormSection>
            <FormSection icon={<IconSparkles />} title="Aksi">{renderInput('aksi')}</FormSection>
            <FormSection icon={<IconSparkles />} title="Ekspresi">{renderInput('ekspresi')}</FormSection>
            <FormSection icon={<IconMapPin />} title="Tempat">{renderInput('tempat')}</FormSection>
            <FormSection icon={<IconClock />} title="Waktu">{renderInput('waktu')}</FormSection>
            <FormSection icon={<IconCamera />} title="Kamera">{renderInput('kamera')}</FormSection>
            <FormSection icon={<IconSun />} title="Pencahayaan">{renderInput('pencahayaan')}</FormSection>
            <FormSection icon={<IconPaintBrush />} title="Gaya">{renderInput('gaya')}</FormSection>
            <FormSection icon={<IconCheckBadge />} title="Kualitas Gambar">{renderInput('kualitasGambar')}</FormSection>
            <FormSection icon={<IconPalette />} title="Suasana Gambar">{renderInput('suasanaGambar')}</FormSection>
            <FormSection icon={<IconAspectRatio />} title="Aspek Rasio">{renderInput('aspekRasio')}</FormSection>
            
            <div className='md:col-span-2'>
              <FormSection icon={<IconDetails />} title="Detail Tambahan">
                {renderInput('detailTambahan')}
              </FormSection>
            </div>
            
            <div className='md:col-span-2'>
              <FormSection icon={<IconMinusCircle />} title="Negative Prompt">
                {renderInput('negativePrompt')}
              </FormSection>
            </div>
        </div>
      </main>

      <div className="text-center mt-10 mb-6">
        <button
          onClick={handleFullPromptGeneration}
          disabled={isLoading}
          className="bg-gradient-to-r from-pink-500 to-rose-600 hover:from-pink-600 hover:to-rose-700 text-white font-bold text-lg py-4 px-10 rounded-xl shadow-xl hover:shadow-2xl transform transition-all duration-300 ease-in-out hover:scale-105 active:scale-95 focus:outline-none focus:ring-4 focus:ring-pink-400 focus:ring-opacity-50 disabled:opacity-70 disabled:cursor-wait"
          style={{ boxShadow: '0 5px 15px rgba(236, 72, 153, 0.4), inset 0 2px 2px rgba(255,255,255,0.2), inset 0 -2px 2px rgba(0,0,0,0.15)' }}
        >
          ✨ Hasilkan Prompt Akhir! ✨
        </button>
        {isLoading && (
          <div className="mt-6 flex items-center justify-center">
             <HeartbeatLoader text="Menerjemahkan & Menyempurnakan..." />
          </div>
        )}
      </div>

      {showResults && (
        <div ref={resultsRef} className="max-w-4xl mx-auto my-10 p-5 bg-red-800/50 backdrop-blur-lg border border-red-600/70 rounded-xl shadow-2xl">
          <h2 className="text-2xl font-bold text-pink-100 mb-6 text-center" style={{ fontFamily: "'Playfair Display', serif" }}>Hasil Prompt</h2>
           {isLoading ? (
              <div className="p-8 text-center flex flex-col items-center justify-center h-64">
                <p className="text-xl text-pink-200/90 animate-pulse">Menyiapkan hasil prompt terbaik untuk Anda...</p>
              </div>
            ) : (
              <div className="flex flex-col gap-6">
                <CollapsibleSection title="Prompt Bahasa Indonesia (Lihat/Ubah)">
                  <AutosizeTextarea
                    value={indonesianPrompt}
                    onChange={(e) => setIndonesianPrompt(e.target.value)}
                    className="w-full p-3 bg-red-900/50 border border-red-700/60 rounded-md text-pink-100 focus:ring-2 focus:ring-pink-400 focus:border-pink-400 placeholder-pink-300/70 resize-none overflow-y-hidden"
                    placeholder="Prompt dalam Bahasa Indonesia akan muncul di sini..."
                  />
                </CollapsibleSection>

                <div>
                  <h3 className="text-lg font-semibold text-pink-200 mb-2">Prompt Bahasa Inggris (Final):</h3>
                  <div className="w-full p-3 bg-red-900/40 border border-red-700/50 rounded-md text-pink-50 prose prose-sm prose-invert max-w-none">
                    {englishPrompt ? (
                       <pre className="whitespace-pre-wrap break-words text-sm">{englishPrompt}</pre>
                    ) : (
                      <p className="text-pink-300/80">English prompt will appear here after generation.</p>
                    )}
                  </div>
                   <button
                    onClick={() => navigator.clipboard.writeText(englishPrompt)}
                    disabled={!englishPrompt || isLoading}
                    className="mt-3 w-full bg-pink-500/80 hover:bg-pink-600/90 text-white font-semibold py-2.5 px-4 rounded-lg shadow-md hover:shadow-lg transition-all duration-200 ease-in-out transform hover:scale-105 active:scale-95 focus:outline-none focus:ring-2 focus:ring-pink-300 disabled:opacity-60 disabled:cursor-not-allowed"
                  >
                    Salin Prompt Bahasa Inggris
                  </button>
                </div>
              </div>
            )}
        </div>
      )}

      <footer className="text-center py-8 mt-12 border-t border-red-700/30">
        <p className="text-pink-300/80 text-sm">
          Dibuat dengan ❤️ untuk kreativitas tanpa batas.
        </p>
      </footer>
    </div>
  );
};

export default App;
