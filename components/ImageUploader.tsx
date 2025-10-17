
import React, { useState, useCallback } from 'react';

interface ImageUploaderProps {
  title: string;
  onImageUpload: (base64: string) => void;
}

const fileToBase64 = (file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.readAsDataURL(file);
        reader.onload = () => resolve(reader.result as string);
        reader.onerror = error => reject(error);
    });
};


export const ImageUploader: React.FC<ImageUploaderProps> = ({ title, onImageUpload }) => {
  const [imagePreview, setImagePreview] = useState<string | null>(null);

  const handleFileChange = useCallback(async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const base64 = await fileToBase64(file);
      setImagePreview(base64);
      onImageUpload(base64);
    }
  }, [onImageUpload]);

  const handleRemoveImage = () => {
    setImagePreview(null);
    onImageUpload('');
    // Reset file input value
    const input = document.getElementById(`${title}-file-input`) as HTMLInputElement;
    if (input) input.value = '';
  };


  return (
    <div className="w-full">
        <label className="block text-sm font-medium text-gray-300 mb-2">{title}</label>
        <div className="relative w-full aspect-square bg-gray-700 rounded-lg border-2 border-dashed border-gray-500 flex items-center justify-center text-center transition-all hover:border-indigo-400">
            {imagePreview ? (
                <>
                    <img src={imagePreview} alt={title} className="object-cover w-full h-full rounded-lg" />
                    <button 
                        onClick={handleRemoveImage}
                        className="absolute top-2 right-2 bg-red-600/70 hover:bg-red-500 text-white rounded-full p-1.5 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-800 focus:ring-white"
                        aria-label="Remove image"
                    >
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
                            <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
                        </svg>
                    </button>
                </>
            ) : (
                <div className="p-4">
                     <svg className="mx-auto h-12 w-12 text-gray-400" stroke="currentColor" fill="none" viewBox="0 0 48 48" aria-hidden="true">
                        <path d="M28 8H12a4 4 0 00-4 4v20m32-12v8m0 0v8a4 4 0 01-4 4H12a4 4 0 01-4-4v-4m32-4l-3.172-3.172a4 4 0 00-5.656 0L28 28M8 32l9.172-9.172a4 4 0 015.656 0L28 28m0 0l4 4m4-24h8m-4-4v8" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"></path>
                    </svg>
                    <p className="mt-2 text-sm text-gray-400">Click to upload</p>
                </div>
            )}
             <input
                id={`${title}-file-input`}
                type="file"
                accept="image/png, image/jpeg"
                onChange={handleFileChange}
                className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
            />
        </div>
    </div>
  );
};
