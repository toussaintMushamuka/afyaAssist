"use client";

import { useRef } from "react";

interface ImageUploaderProps {
  image: File | null;
  preview: string | null;
  onImageSelect: (file: File, preview: string) => void;
}

export default function ImageUploader({
  image,
  preview,
  onImageSelect,
}: ImageUploaderProps) {
  const inputRef = useRef<HTMLInputElement>(null);

  const handleFile = (file: File) => {
    const url = URL.createObjectURL(file);
    onImageSelect(file, url);
  };

  return (
    <div className="w-full max-w-xl mx-auto">
      <input
        ref={inputRef}
        type="file"
        accept="image/*"
        hidden
        onChange={(e) => {
          const file = e.target.files?.[0];
          if (!file) return;
          handleFile(file);
        }}
      />

      <div
        onClick={() => inputRef.current?.click()}
        className="cursor-pointer border-2 border-dashed rounded-xl p-8 text-center hover:border-blue-500 transition"
      >
        {!preview ? (
          <>
            <div className="text-5xl mb-4">📷</div>

            <h2 className="text-xl font-semibold">Upload a medical image</h2>

            <p className="text-gray-500 mt-2">Click to select an image</p>

            <p className="text-sm text-gray-400 mt-4">JPG • PNG • WEBP</p>
          </>
        ) : (
          <img
            src={preview}
            alt="preview"
            className="rounded-lg max-h-[450px] mx-auto object-contain"
          />
        )}
      </div>
    </div>
  );
}
