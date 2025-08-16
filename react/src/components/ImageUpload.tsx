import React, { useState, useRef, useCallback } from 'react';
import { motion } from 'framer-motion';
import { CloudArrowUpIcon, XMarkIcon, PhotoIcon } from '@heroicons/react/24/outline';
import { uploadImage, getImageUrl } from '../lib/supabase';

interface ImageUploadProps {
  onUpload: (imageUrl: string) => void;
  onRemove?: () => void;
  currentImage?: string;
  multiple?: boolean;
  className?: string;
  folder?: string; // e.g., 'products', 'news', 'preowned'
}

export const ImageUpload: React.FC<ImageUploadProps> = ({
  onUpload,
  onRemove,
  currentImage,
  multiple = false,
  className = '',
  folder = 'general'
}) => {
  const [isDragging, setIsDragging] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [uploadedImages, setUploadedImages] = useState<string[]>(currentImage ? [currentImage] : []);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  }, []);

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
  }, []);

  const handleDrop = useCallback(async (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    
    const files = Array.from(e.dataTransfer.files);
    await handleFiles(files);
  }, []);

  const handleFileSelect = useCallback(async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    await handleFiles(files);
  }, []);

  const handleFiles = async (files: File[]) => {
    const imageFiles = files.filter(file => file.type.startsWith('image/'));
    
    if (imageFiles.length === 0) return;

    setUploading(true);
    
    try {
      const uploadPromises = imageFiles.map(async (file) => {
        const imageUrl = await uploadImage(file, folder);
        return imageUrl;
      });

      const uploadedUrls = await Promise.all(uploadPromises);
      
      if (multiple) {
        setUploadedImages(prev => [...prev, ...uploadedUrls]);
        uploadedUrls.forEach(url => onUpload(url));
      } else {
        setUploadedImages(uploadedUrls);
        onUpload(uploadedUrls[0]);
      }
    } catch (error) {
      console.error('Error uploading images:', error);
    } finally {
      setUploading(false);
    }
  };

  const removeImage = (index: number) => {
    const newImages = uploadedImages.filter((_, i) => i !== index);
    setUploadedImages(newImages);
    if (onRemove && newImages.length === 0) {
      onRemove();
    }
  };

  return (
    <div className={`space-y-4 ${className}`}>
      {/* Current Images Display */}
      {uploadedImages.length > 0 && (
        <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
          {uploadedImages.map((imageUrl, index) => (
            <div key={index} className="relative group">
              <img
                src={getImageUrl(imageUrl)}
                alt={`Uploaded image ${index + 1}`}
                className="w-full h-32 object-cover rounded-lg border border-stone-200"
              />
              <button
                onClick={() => removeImage(index)}
                className="absolute top-2 right-2 p-1 bg-red-500 text-white rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-200"
              >
                <XMarkIcon className="w-4 h-4" />
              </button>
            </div>
          ))}
        </div>
      )}

      {/* Upload Area */}
      <motion.div
        animate={isDragging ? { scale: 1.02 } : { scale: 1 }}
        className={`
          relative border-2 border-dashed rounded-xl p-8 text-center transition-all duration-200
          ${isDragging 
            ? 'border-stone-400 bg-stone-50' 
            : 'border-stone-300 hover:border-stone-400 hover:bg-stone-50'
          }
        `}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
      >
        <input
          ref={fileInputRef}
          type="file"
          multiple={multiple}
          accept="image/*"
          onChange={handleFileSelect}
          className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
        />
        
        <div className="space-y-4">
          <div className="mx-auto w-12 h-12 bg-stone-100 rounded-full flex items-center justify-center">
            {uploading ? (
              <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-stone-600"></div>
            ) : (
              <CloudArrowUpIcon className="w-6 h-6 text-stone-600" />
            )}
          </div>
          
          <div>
            <p className="text-lg font-medium text-stone-900">
              {uploading ? 'Uploading...' : 'Drop images here or click to upload'}
            </p>
            <p className="text-sm text-stone-600 mt-1">
              {multiple ? 'Upload multiple images' : 'Upload a single image'}
            </p>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

