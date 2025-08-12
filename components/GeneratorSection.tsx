
import React, { useState, useRef, useCallback } from 'react';
import { GeneratorType, FieldDefinition, PromptData } from '../types';
import { RAINBOW_COLORS } from '../constants';
import * as geminiService from '../services/geminiService';
import PromptCard from './PromptCard';
import Icon from './Icon';

interface GeneratorSectionProps {
  title: string;
  type: GeneratorType;
  fields: FieldDefinition[];
  initialData: PromptData;
  gradientFrom: string;
  gradientTo: string;
}

const GeneratorSection: React.FC<GeneratorSectionProps> = ({ title, type, fields, initialData, gradientFrom, gradientTo }) => {
  const [promptData, setPromptData] = useState(initialData);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [generatedIdPrompt, setGeneratedIdPrompt] = useState('');
  const [generatedEnPrompt, setGeneratedEnPrompt] = useState('');
  const [copiedId, setCopiedId] = useState(false);
  const [copiedEn, setCopiedEn] = useState(false);
  
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleInputChange = useCallback((key: string, value: string) => {
    setPromptData(prev => ({ ...prev, [key]: value }));
  }, []);

  const handleFileChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      handleGenerateDetails(file);
    }
  };
  
  const handleGenerateDetails = async (imageFile: File | null = null) => {
    const idea = promptData.ide_prompt;
    if (!idea) {
      setError('Harap masukkan ide prompt terlebih dahulu.');
      return;
    }

    setIsLoading(true);
    setError(null);
    setGeneratedIdPrompt('');
    setGeneratedEnPrompt('');

    try {
      let result;
      if (imageFile) {
        result = await geminiService.generateDetailsFromImage(idea, imageFile, fields);
      } else {
        result = await geminiService.generateDetailsFromText(idea, fields);
      }
      setPromptData(prev => ({ ...prev, ...result }));
    } catch (err: any) {
      setError(err.message || 'Terjadi kesalahan yang tidak diketahui.');
    } finally {
      setIsLoading(false);
      // Reset file input value to allow re-uploading the same file
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    }
  };

  const createFinalPrompt = () => {
    const mainParts = fields
      .map(({ key, label }) => {
        const value = promptData[key];
        if (value && key !== 'negativePrompt' && key !== 'ide_prompt') {
          return `[${label}]: ${value}`;
        }
        return null;
      })
      .filter(Boolean);

    let finalPrompt = mainParts.join('\n');

    if (promptData.negativePrompt) {
      if (finalPrompt) {
        finalPrompt += `\n\n[Negative Prompt]: ${promptData.negativePrompt}`;
      } else {
        finalPrompt = `[Negative Prompt]: ${promptData.negativePrompt}`;
      }
    }
    return finalPrompt;
  };

  const handleGenerateFinalPrompt = async () => {
    setIsLoading(true);
    setError(null);
    const idPrompt = createFinalPrompt();
    setGeneratedIdPrompt(idPrompt);

    try {
        const textToSkip = promptData.dialog || '';
        const enPrompt = await geminiService.translatePrompt(idPrompt, textToSkip);
        setGeneratedEnPrompt(enPrompt);
    } catch (err: any) {
        setError(err.message || 'Gagal menerjemahkan prompt.');
        setGeneratedEnPrompt('');
    } finally {
        setIsLoading(false);
    }
  };
  
  const handleCopyIdToClipboard = () => {
    if (!generatedIdPrompt) return;
    navigator.clipboard.writeText(generatedIdPrompt).then(() => {
        setCopiedId(true);
        setTimeout(() => setCopiedId(false), 2000);
    });
  };

  const handleCopyEnToClipboard = () => {
    if (!generatedEnPrompt) return;
    navigator.clipboard.writeText(generatedEnPrompt).then(() => {
        setCopiedEn(true);
        setTimeout(() => setCopiedEn(false), 2000);
    });
  };

  return (
    <div className="space-y-8">
      {/* Idea Input Card */}
      <div className="bg-white/40 backdrop-blur-xl p-6 rounded-3xl shadow-lg border border-white/20">
        <label htmlFor="ide_prompt" className="block text-xl font-bold text-slate-700 mb-3">{title}</label>
        <textarea
          id="ide_prompt"
          value={promptData.ide_prompt}
          onChange={(e) => handleInputChange('ide_prompt', e.target.value)}
          placeholder="Masukkan ide dasar di sini, cth: 'seorang ksatria melawan naga di puncak gunung berapi'"
          className="w-full bg-white/50 rounded-xl p-4 text-slate-800 placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-purple-400 transition duration-300 resize-y min-h-[80px]"
        />
        {error && <p className="text-red-600 mt-2">{error}</p>}
        <div className="mt-4 grid grid-cols-1 sm:grid-cols-2 gap-4">
          <input
            type="file"
            ref={fileInputRef}
            onChange={handleFileChange}
            className="hidden"
            accept="image/*"
          />
          <button
            onClick={() => handleGenerateDetails(null)}
            disabled={isLoading}
            className={`w-full flex items-center justify-center gap-2 px-4 py-3 rounded-xl font-semibold text-white transition-all duration-300 transform hover:scale-105 shadow-md bg-gradient-to-r ${gradientFrom} ${gradientTo} disabled:opacity-50 disabled:cursor-not-allowed`}
          >
            <Icon type="sparkles" />
            {isLoading ? 'Mengembangkan...' : 'Kembangkan dari Teks'}
          </button>
          <button
            onClick={() => fileInputRef.current?.click()}
            disabled={isLoading}
            className={`w-full flex items-center justify-center gap-2 px-4 py-3 rounded-xl font-semibold text-white transition-all duration-300 transform hover:scale-105 shadow-md bg-gradient-to-r ${gradientFrom} ${gradientTo} disabled:opacity-50 disabled:cursor-not-allowed`}
          >
            <Icon type="image" />
            {isLoading ? 'Mengunggah...' : 'Kembangkan dari Gambar'}
          </button>
        </div>
      </div>
      
      {/* Details Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {isLoading && Array.from({ length: 8 }).map((_, i) => (
          <div key={i} className="bg-white/20 backdrop-blur-lg rounded-2xl p-4 h-28 animate-pulse">
             <div className="h-4 bg-slate-300/50 rounded w-1/3 mb-4"></div>
             <div className="h-8 bg-slate-300/50 rounded w-full"></div>
          </div>
        ))}
        {!isLoading && fields.map((field, index) => (
          <PromptCard
            key={field.key}
            field={field}
            value={promptData[field.key]}
            onChange={handleInputChange}
            color={RAINBOW_COLORS[index % RAINBOW_COLORS.length]}
          />
        ))}
      </div>

      {/* Final Prompt Button */}
       <div className="text-center">
        <button 
          onClick={handleGenerateFinalPrompt}
          disabled={isLoading}
          className={`px-8 py-4 text-xl font-bold text-white rounded-full shadow-xl transition-all duration-300 transform hover:scale-105 bg-gradient-to-r ${gradientFrom} ${gradientTo} disabled:opacity-50 disabled:cursor-not-allowed`}
        >
          <div className='flex items-center gap-3'>
            <Icon type="translate" className="w-8 h-8"/>
            Buat & Terjemahkan Prompt Final
          </div>
        </button>
      </div>


      {/* Output Section */}
      {(generatedIdPrompt || isLoading) && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mt-8">
            {/* Indonesian Prompt */}
            <div className="bg-white/40 backdrop-blur-xl p-6 rounded-3xl shadow-lg border border-white/20">
                <div className="flex justify-between items-center mb-3">
                    <h3 className="text-xl font-bold text-slate-700">Prompt Final (Bahasa Indonesia)</h3>
                    <button
                        onClick={handleCopyIdToClipboard}
                        className={`p-2 rounded-lg text-white transition-all duration-200 shadow-md hover:shadow-lg transform hover:scale-105
                            ${copiedId
                                ? 'bg-green-500'
                                : `bg-gradient-to-r ${gradientFrom} ${gradientTo}`
                            }`
                        }
                        title={copiedId ? "Tersalin!" : "Salin ke clipboard"}
                        disabled={!generatedIdPrompt}
                    >
                        {copiedId
                            ? <Icon type="check" className="w-6 h-6" />
                            : <Icon type="clipboard" className="w-6 h-6" />
                        }
                    </button>
                </div>
                <textarea
                    value={isLoading ? "Menghasilkan dan menerjemahkan..." : generatedIdPrompt}
                    onChange={(e) => setGeneratedIdPrompt(e.target.value)}
                    readOnly={isLoading}
                    className="w-full h-96 bg-white/50 rounded-xl p-4 text-slate-800 placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-purple-400 transition duration-300 resize-y"
                />
            </div>

            {/* English Prompt */}
            <div className="bg-white/40 backdrop-blur-xl p-6 rounded-3xl shadow-lg border border-white/20">
                <div className="flex justify-between items-center mb-3">
                    <h3 className="text-xl font-bold text-slate-700">Prompt Final (English)</h3>
                    <button
                        onClick={handleCopyEnToClipboard}
                        className={`p-2 rounded-lg text-white transition-all duration-200 shadow-md hover:shadow-lg transform hover:scale-105
                            ${copiedEn
                                ? 'bg-green-500'
                                : `bg-gradient-to-r ${gradientFrom} ${gradientTo}`
                            }`
                        }
                        title={copiedEn ? "Tersalin!" : "Salin ke clipboard"}
                        disabled={!generatedEnPrompt}
                    >
                        {copiedEn
                            ? <Icon type="check" className="w-6 h-6" />
                            : <Icon type="clipboard" className="w-6 h-6" />
                        }
                    </button>
                </div>
                <div className="w-full h-96 bg-gray-500/10 rounded-xl p-4 text-slate-600 whitespace-pre-wrap overflow-y-auto">
                    {isLoading ? "Menunggu hasil..." : (generatedEnPrompt || "Terjemahan akan muncul di sini.")}
                </div>
            </div>
        </div>
      )}
    </div>
  );
};

export default GeneratorSection;