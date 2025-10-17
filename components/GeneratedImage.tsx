
import React from 'react';
import { Spinner } from './Spinner';

interface GeneratedImageProps {
  imageUrl: string | null;
  isLoading: boolean;
  prompt: string;
}

export const GeneratedImage: React.FC<GeneratedImageProps> = ({ imageUrl, isLoading, prompt }) => {
  return (
    <div className="bg-gray-800 p-6 rounded-2xl shadow-lg h-full flex flex-col">
      <h2 className="text-2xl font-bold text-indigo-400 mb-4">3. Your Timeless Photo</h2>
      <div className="w-full aspect-square bg-gray-900 rounded-lg flex items-center justify-center text-center relative overflow-hidden">
        {isLoading && (
          <div className="absolute inset-0 bg-black/50 backdrop-blur-sm flex flex-col items-center justify-center z-10">
            <Spinner />
            <p className="text-gray-300 mt-4 text-lg font-semibold animate-pulse">Generating your memory...</p>
          </div>
        )}
        {imageUrl ? (
          <img src={imageUrl} alt={prompt} className="object-contain w-full h-full" />
        ) : (
          !isLoading && (
            <div className="text-gray-500 p-8">
              <svg xmlns="http://www.w3.org/2000/svg" className="mx-auto h-24 w-24 text-gray-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
              <h3 className="mt-4 text-xl font-medium">Your merged photo will appear here.</h3>
              <p className="mt-1 text-sm">Upload your photos, describe a scene, and click "Merge Photos" to start.</p>
            </div>
          )
        )}
      </div>
    </div>
  );
};
