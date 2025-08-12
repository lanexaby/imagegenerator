
import React, { useState } from 'react';
import GeneratorSection from './components/GeneratorSection';
import { VEO_FIELDS, IMAGEN_FIELDS } from './constants';
import { VeoPromptData, ImagenPromptData } from './types';

const App: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'veo' | 'imagen'>('veo');

  const initialVeoData: VeoPromptData = VEO_FIELDS.reduce((acc, field) => ({ ...acc, [field.key]: '' }), { ide_prompt: '' } as VeoPromptData);
  const initialImagenData: ImagenPromptData = IMAGEN_FIELDS.reduce((acc, field) => ({ ...acc, [field.key]: '' }), { ide_prompt: '' } as ImagenPromptData);

  return (
    <div className="min-h-screen w-full bg-gradient-to-br from-purple-200 via-pink-200 to-blue-200 text-slate-800 p-4 sm:p-6 md:p-8">
      <main className="container mx-auto">
        <header className="text-center mb-8">
          <h1 className="text-4xl md:text-5xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-purple-600 to-pink-600 drop-shadow-sm">
            Generator Prompt Pro AI
          </h1>
          <p className="text-slate-600 mt-2 text-lg">Buat prompt Veo 3 & Imagen 3 yang sempurna dengan mudah</p>
        </header>

        <div className="mb-8 flex justify-center">
          <div className="bg-white/50 backdrop-blur-sm p-1 rounded-full shadow-md">
            <button
              onClick={() => setActiveTab('veo')}
              className={`px-6 py-2 rounded-full text-lg font-semibold transition-all duration-300 ${activeTab === 'veo' ? 'bg-white shadow-lg text-purple-600' : 'text-slate-500'}`}
            >
              Veo 3 (Video)
            </button>
            <button
              onClick={() => setActiveTab('imagen')}
              className={`px-6 py-2 rounded-full text-lg font-semibold transition-all duration-300 ${activeTab === 'imagen' ? 'bg-white shadow-lg text-pink-600' : 'text-slate-500'}`}
            >
              Imagen 3 (Gambar)
            </button>
          </div>
        </div>

        <div>
          {activeTab === 'veo' && (
            <GeneratorSection
              key="veo"
              title="Generator Prompt Veo 3"
              type="veo"
              fields={VEO_FIELDS}
              initialData={initialVeoData}
              gradientFrom="from-purple-500"
              gradientTo="to-indigo-500"
            />
          )}
          {activeTab === 'imagen' && (
            <GeneratorSection
              key="imagen"
              title="Generator Prompt Imagen 3"
              type="imagen"
              fields={IMAGEN_FIELDS}
              initialData={initialImagenData}
              gradientFrom="from-pink-500"
              gradientTo="to-rose-500"
            />
          )}
        </div>
        <footer className="text-center mt-12 text-slate-500">
          <p>Dibuat dengan ❤️ dan AI</p>
        </footer>
      </main>
    </div>
  );
};

export default App;
