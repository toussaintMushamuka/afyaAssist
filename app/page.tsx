"use client";

import { useState } from "react";

import ImageUploader from "@/components/ImageUploader";
import SymptomChat from "@/components/SymptomChat";
import FinalReport from "@/components/FinalReport";

import { fileToBase64 } from "@/lib/file";

/**
 * Résultat de l'analyse visuelle Gemma Vision
 */
interface ImageAnalysis {
  prediction: string;

  confidence: number;

  observations: string[];

  reasoning: string;

  recommendation: string;
}

/**
 * Question générée par Gemma
 */
interface SymptomQuestion {
  id: number;

  text: string;
}

/**
 * Réponse finale LifeLens AI
 */
interface FinalReportType {
  riskLevel: string;

  confidence: number;

  summary: string;

  riskFactors: string[];

  negativeSigns: string[];

  visualSigns: string[];

  reportedSymptoms: string[];

  reasoning: string;

  recommendation: string;
}

export default function Home() {
  /**
   * Image du patient
   */
  const [image, setImage] = useState<File | null>(null);

  /**
   * Aperçu image
   */
  const [preview, setPreview] = useState<string | null>(null);

  /**
   * Chargement analyse image
   */
  const [isAnalyzing, setIsAnalyzing] = useState(false);

  /**
   * Résultat analyse visuelle
   */
  const [analysisResult, setAnalysisResult] = useState<ImageAnalysis | null>(
    null,
  );

  /**
   * Questions générées par Gemma
   */
  const [questions, setQuestions] = useState<SymptomQuestion[]>([]);

  /**
   * Réponses du patient
   */
  const [chatHistory, setChatHistory] = useState<any[]>([]);

  /**
   * Indique que toutes les questions
   * sont terminées
   */
  const [symptomsCompleted, setSymptomsCompleted] = useState(false);

  /**
   * Rapport final
   */
  const [finalReport, setFinalReport] = useState<FinalReportType | null>(null);

  /**
   * Chargement génération rapport
   */
  const [isFinalizing, setIsFinalizing] = useState(false);

  /**
   * ETAPE 1
   *
   * Analyse image avec Gemma Vision
   *
   * Puis génération automatique
   * des questions adaptées
   */
  const handleAnalyze = async () => {
    if (!image) return;

    try {
      setIsAnalyzing(true);

      const base64 = await fileToBase64(image);

      /**
       * Analyse visuelle
       */
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

      if (!data.success) {
        throw new Error(data.error);
      }

      console.log("Analyse image :", data.result);

      setAnalysisResult(data.result);

      // Reset avant nouvelles questions
      setQuestions([]);
      setSymptomsCompleted(false);
      setChatHistory([]);
      setFinalReport(null);

      /**
       * ETAPE 1.2
       *
       * Demander à Gemma
       * de créer les questions
       * adaptées aux signes observés
       */
      const questionResponse = await fetch("/api/generate-questions", {
        method: "POST",

        headers: {
          "Content-Type": "application/json",
        },

        body: JSON.stringify({
          imageAnalysis: data.result,
        }),
      });

      const questionData = await questionResponse.json();

      console.log("Questions Gemma :", questionData.result);

      setQuestions(questionData.result.questions);
    } catch (error) {
      console.error("Erreur analyse :", error);

      setAnalysisResult(null);
    } finally {
      setIsAnalyzing(false);
    }
  };

  /**
   * ETAPE 2
   *
   * Analyse finale
   *
   * Utilise :
   *
   * - image
   * - réponses patient
   * - RAG médical
   */
  const generateFinalReport = async () => {
    if (!analysisResult) return;

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
      console.error("Erreur rapport final", error);
    } finally {
      setIsFinalizing(false);
    }
  };

  return (
    <main
      className="
      min-h-screen
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
        {/* Header */}

        <div className="text-center">
          <h1 className="text-5xl font-bold">AfyaAssist</h1>

          <p className="text-center mt-4 text-gray-100">
            Assistant de santé visuel pour le dépistage de la jaunisse <br />{" "}
            alimenté par Gemma 4
          </p>
        </div>

        {/* Upload image */}

        <ImageUploader
          image={image}
          preview={preview}
          onImageSelect={(file, url) => {
            setImage(file);

            setPreview(url);

            // Reset nouveau patient

            setAnalysisResult(null);

            setQuestions([]);

            setChatHistory([]);

            setSymptomsCompleted(false);

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
            disabled:opacity-50
            "
          >
            {isAnalyzing
              ? "Analyse et préparation des questions..."
              : "Analyser avec Gemma"}
          </button>
        )}

        {/* Questionnaire dynamique */}

        {questions.length > 0 && (
          <SymptomChat
            questions={questions}
            onComplete={(answers) => {
              console.log("Réponses patient :", answers);

              setChatHistory(answers);

              setSymptomsCompleted(true);
            }}
          />
        )}

        {/* Rapport seulement après toutes les réponses */}

        {symptomsCompleted && (
          <button
            onClick={generateFinalReport}
            disabled={isFinalizing}
            className="
            w-full
           btn-primary
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

        {/* Rapport final */}

        {finalReport && <FinalReport result={finalReport} />}
      </div>
    </main>
  );
}
