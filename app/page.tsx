"use client";

import { useState } from "react";
import ImageUploader from "@/components/ImageUploader";
import { fileToBase64 } from "@/lib/file";

export default function Home() {
  const [image, setImage] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(null);

  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [analysisResult, setAnalysisResult] = useState("");

  const handleAnalyze = async () => {
    if (!image) return;

    try {
      setIsAnalyzing(true);

      const base64 = await fileToBase64(image);

      const response = await fetch("/api/analyze", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          image: base64,
        }),
      });

      const data = await response.json();

      setAnalysisResult(JSON.stringify(data, null, 2));
    } catch (error) {
      console.error(error);
      setAnalysisResult("Something went wrong.");
    } finally {
      setIsAnalyzing(false);
    }
  };

  return (
    <main className="min-h-screen bg-slate-100 flex justify-center py-12 px-6">
      <div className="w-full max-w-3xl space-y-8">
        <div className="text-center">
          <h1 className="text-4xl font-bold">LifeLens AI</h1>

          <p className="text-gray-500 mt-2">
            AI Visual Health Assistant powered by Gemma 4
          </p>
        </div>

        <ImageUploader
          image={image}
          preview={preview}
          onImageSelect={(file, url) => {
            setImage(file);
            setPreview(url);
            setAnalysisResult("");
          }}
        />

        {image && (
          <button
            onClick={handleAnalyze}
            disabled={isAnalyzing}
            className="w-full bg-blue-600 hover:bg-blue-700 text-white rounded-xl py-4 font-semibold transition disabled:opacity-50"
          >
            {isAnalyzing ? "Analyzing with Gemma..." : "Analyze with Gemma"}
          </button>
        )}

        {analysisResult && (
          <div className="bg-white rounded-xl shadow p-6">
            <h2 className="font-bold text-lg mb-2">Result</h2>

            <p>{analysisResult}</p>
          </div>
        )}
      </div>
    </main>
  );
}
