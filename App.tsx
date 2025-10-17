
import React, { useState, useCallback } from 'react';
import { Header } from './components/Header';
import { ImageUploader } from './components/ImageUploader';
import { ChatWindow } from './components/ChatWindow';
import { GeneratedImage } from './components/GeneratedImage';
import { generateMergedImage } from './services/geminiService';

const App: React.FC = () => {
  const [youngerImage, setYoungerImage] = useState<string | null>(null);
  const [olderImage, setOlderImage] = useState<string | null>(null);
  const [prompt, setPrompt] = useState<string>('standing together in a serene, magical forest at dusk');
  const [generatedImage, setGeneratedImage] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const handleMerge = useCallback(async () => {
    if (!youngerImage || !olderImage || !prompt) {
      setError('Please upload both images and provide a prompt.');
      return;
    }

    setIsLoading(true);
    setError(null);
    setGeneratedImage(null);

    try {
      const result = await generateMergedImage(youngerImage, olderImage, prompt);
      setGeneratedImage(result);
    } catch (e) {
      console.error(e);
      setError('Failed to generate image. Please check your prompt or try again later.');
    } finally {
      setIsLoading(false);
    }
  }, [youngerImage, olderImage, prompt]);

  const canMerge = youngerImage && olderImage && prompt && !isLoading;

  return (
    <div className="min-h-screen bg-gray-900 text-gray-200 font-sans">
      <Header />
      <main className="container mx-auto p-4 md:p-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          
          {/* Left Column: Inputs & Controls */}
          <div className="lg:col-span-1 space-y-8">
            <div className="bg-gray-800 p-6 rounded-2xl shadow-lg">
              <h2 className="text-2xl font-bold text-indigo-400 mb-4">1. Upload Your Photos</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-1 gap-6">
                <ImageUploader title="Younger Self" onImageUpload={setYoungerImage} />
                <ImageUploader title="Older Self" onImageUpload={setOlderImage} />
              </div>
            </div>

            <div className="bg-gray-800 p-6 rounded-2xl shadow-lg">
              <h2 className="text-2xl font-bold text-indigo-400 mb-4">2. Describe the Scene</h2>
              <textarea
                value={prompt}
                onChange={(e) => setPrompt(e.target.value)}
                placeholder="e.g., standing in a futuristic city, sitting on a park bench..."
                className="w-full h-32 p-3 bg-gray-700 border-2 border-gray-600 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-colors"
              />
            </div>
            
            <button
              onClick={handleMerge}
              disabled={!canMerge}
              className={`w-full py-4 px-6 text-xl font-bold rounded-lg transition-all duration-300 ease-in-out transform hover:scale-105 ${
                canMerge
                  ? 'bg-indigo-600 hover:bg-indigo-500 text-white shadow-lg'
                  : 'bg-gray-600 cursor-not-allowed text-gray-400'
              }`}
            >
              {isLoading ? 'Weaving Time...' : 'Merge Photos'}
            </button>
            {error && <p className="text-red-400 text-center mt-2">{error}</p>}
          </div>

          {/* Center Column: Generated Image */}
          <div className="lg:col-span-1">
             <GeneratedImage imageUrl={generatedImage} isLoading={isLoading} prompt={prompt} />
          </div>
          
          {/* Right Column: AI Chat */}
          <div className="lg:col-span-1">
            <ChatWindow onPromptSelect={setPrompt} />
          </div>
        </div>
      </main>
    </div>
  );
};

export default App;
