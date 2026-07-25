"use client";

import { useState } from "react";

import ImageUploader from "@/components/ImageUploader";
import SymptomChat from "@/components/SymptomChat";

import { fileToBase64 } from "@/lib/file";

export default function Home() {
  /**
   * Image envoyée par l'utilisateur
   */
  const [image, setImage] = useState<File | null>(null);

  /**
   * Aperçu de l'image dans l'interface
   */
  const [preview, setPreview] = useState<string | null>(null);

  /**
   * Etat pendant l'analyse visuelle Gemma Vision
   */
  const [isAnalyzing, setIsAnalyzing] = useState(false);

  /**
   * Résultat de l'analyse de l'image
   *
   * Exemple :
   * {
   *  prediction:"Signes possibles de jaunisse",
   *  confidence:0.8
   * }
   */
  const [analysisResult, setAnalysisResult] = useState<any>(null);

  /**
   * Historique complet du dialogue médical
   *
   * Cet historique sera envoyé
   * à Gemma pour l'analyse finale.
   */
  const [chatHistory, setChatHistory] = useState<any[]>([]);

  /**
   * Rapport final généré par :
   *
   * Image + Symptômes + RAG
   */
  const [finalReport, setFinalReport] = useState<any>(null);

  /**
   * Etat de génération du rapport final
   */
  const [isFinalizing, setIsFinalizing] = useState(false);

  /**
   * Première étape :
   *
   * Analyse de l'image avec Gemma Vision
   */
  const handleAnalyze = async () => {
    if (!image) return;

    try {
      setIsAnalyzing(true);

      // Conversion image -> Base64
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

      console.log("Analyse image :", data.result);

      setAnalysisResult(data.result);
    } catch (error) {
      console.error("Erreur analyse image :", error);

      setAnalysisResult(null);
    } finally {
      setIsAnalyzing(false);
    }
  };

  /**
   * Deuxième étape :
   *
   * Fusionner :
   *
   * - Analyse image
   * - Symptômes conversationnels
   * - Base médicale RAG
   *
   * pour obtenir le rapport final.
   */
  const generateFinalReport = async () => {
    try {
      setIsFinalizing(true);

      const response = await fetch("/api/final-analysis", {
        method: "POST",

        headers: {
          "Content-Type": "application/json",
        },

        body: JSON.stringify({
          imageAnalysis: analysisResult,

          conversation: chatHistory,
        }),
      });

      const data = await response.json();

      console.log("Rapport final :", data.result);

      setFinalReport(data.result);
    } catch (error) {
      console.error("Erreur rapport final :", error);
    } finally {
      setIsFinalizing(false);
    }
  };

  return (
    <main
      className="
        min-h-screen
        bg-slate-100
        flex
        justify-center
        py-12
        px-6
      "
    >
      <div
        className="
          w-full
          max-w-3xl
          space-y-8
        "
      >
        {/* En-tête application */}
        <div className="text-center">
          <h1 className="text-4xl font-bold">LifeLens AI</h1>

          <p className="text-gray-500 mt-2">
            AI Visual Health Assistant powered by Gemma 4
          </p>
        </div>

        {/* Upload image */}
        <ImageUploader
          image={image}
          preview={preview}
          onImageSelect={(file, url) => {
            setImage(file);

            setPreview(url);

            // Nouvelle image = nouveau diagnostic
            setAnalysisResult(null);

            setChatHistory([]);

            setFinalReport(null);
          }}
        />

        {/* Bouton analyse image */}
        {image && (
          <button
            onClick={handleAnalyze}
            disabled={isAnalyzing}
            className="
              w-full
              bg-blue-600
              hover:bg-blue-700
              text-white
              rounded-xl
              py-4
              font-semibold
              transition
              disabled:opacity-50
            "
          >
            {isAnalyzing ? "Analyse de l'image..." : "Analyser avec Gemma"}
          </button>
        )}

        {/* Conversation symptômes */}
        {analysisResult && <SymptomChat onHistoryChange={setChatHistory} />}

        {/* Bouton génération rapport final */}
        {chatHistory.length > 1 && (
          <button
            onClick={generateFinalReport}
            disabled={isFinalizing}
            className="
                w-full
                bg-green-600
                text-white
                rounded-xl
                py-4
                font-semibold
                disabled:opacity-50
              "
          >
            {isFinalizing
              ? "Génération du rapport..."
              : "Générer le rapport final"}
          </button>
        )}

        {/* Affichage temporaire du rapport final */}
        {finalReport && (
          <div
            className="
                bg-white
                rounded-xl
                shadow
                p-6
              "
          >
            <h2 className="text-xl font-bold mb-4">
              Rapport final LifeLens AI
            </h2>

            <pre
              className="
                  whitespace-pre-wrap
                  text-sm
                "
            >
              {JSON.stringify(finalReport, null, 2)}
            </pre>
          </div>
        )}
      </div>
    </main>
  );
}
