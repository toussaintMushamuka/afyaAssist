"use client";

import { useState } from "react";

/**
 * Structure d'un message dans la conversation
 */
type Message = {
  role: "user" | "assistant";
  content: string;
};

/**
 * Props du composant
 *
 * onHistoryChange permet de transmettre
 * toute la conversation au composant parent
 * pour l'analyse finale.
 */
interface SymptomChatProps {
  onHistoryChange?: (messages: Message[]) => void;
}

export default function SymptomChat({ onHistoryChange }: SymptomChatProps) {
  /**
   * Historique local de la conversation
   *
   * L'assistant commence toujours
   * par une première question médicale.
   */
  const [messages, setMessages] = useState<Message[]>([
    {
      role: "assistant",
      content:
        "Bonjour. Depuis quand avez-vous remarqué un jaunissement des yeux ou de la peau ?",
    },
  ]);

  /**
   * Texte actuellement écrit par l'utilisateur
   */
  const [input, setInput] = useState("");

  /**
   * Etat de chargement pendant
   * l'appel à Gemma
   */
  const [loading, setLoading] = useState(false);

  /**
   * Envoie un message utilisateur
   * vers Gemma
   */
  const sendMessage = async () => {
    // Empêche l'envoi d'un message vide
    if (!input.trim() || loading) return;

    /**
     * Création du message utilisateur
     */
    const userMessage: Message = {
      role: "user",
      content: input,
    };

    /**
     * Nouvel historique avant appel API
     */
    const updatedHistory = [...messages, userMessage];

    // Mise à jour immédiate de l'interface
    setMessages(updatedHistory);

    // Transmission au parent
    onHistoryChange?.(updatedHistory);

    // Nettoyage du champ texte
    setInput("");

    // Activation du chargement
    setLoading(true);

    try {
      /**
       * Appel de notre API Next.js
       * qui communique avec Gemma
       */
      const response = await fetch("/api/chat", {
        method: "POST",

        headers: {
          "Content-Type": "application/json",
        },

        body: JSON.stringify({
          message: input,
          history: updatedHistory,
        }),
      });

      const data = await response.json();

      /**
       * Message généré par Gemma
       */
      const assistantMessage: Message = {
        role: "assistant",
        content: data.message ?? "Je n'ai pas pu générer une réponse.",
      };

      /**
       * Historique complet après réponse IA
       */
      const finalHistory = [...updatedHistory, assistantMessage];

      // Mise à jour interface
      setMessages(finalHistory);

      // Transmission au parent pour analyse finale
      onHistoryChange?.(finalHistory);
    } catch (error) {
      console.error("Erreur pendant la conversation :", error);

      const errorMessage: Message = {
        role: "assistant",
        content: "Une erreur est survenue pendant l'analyse.",
      };

      const finalHistory = [...updatedHistory, errorMessage];

      setMessages(finalHistory);

      onHistoryChange?.(finalHistory);
    } finally {
      // Fin du chargement
      setLoading(false);
    }
  };

  return (
    <div className="bg-white rounded-xl shadow p-6 space-y-4">
      {/* Titre du module conversationnel */}
      <h2 className="text-xl font-bold">Assistant santé LifeLens AI</h2>

      {/* Zone d'affichage des messages */}
      <div className="space-y-3 max-h-96 overflow-y-auto">
        {messages.map((message, index) => (
          <div key={index}>
            <strong>{message.role === "user" ? "Vous" : "LifeLens AI"}:</strong>{" "}
            {message.content}
          </div>
        ))}

        {/* Indication pendant la génération */}
        {loading && <p className="text-gray-500">LifeLens AI analyse...</p>}
      </div>

      {/* Zone de saisie utilisateur */}
      <div className="flex gap-2">
        <input
          className="flex-1 border rounded-lg px-3 py-2"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Décrivez vos symptômes..."
          onKeyDown={(e) => {
            if (e.key === "Enter") {
              sendMessage();
            }
          }}
        />

        <button
          onClick={sendMessage}
          disabled={loading}
          className="
            bg-blue-600
            text-white
            px-4
            rounded-lg
            disabled:opacity-50
          "
        >
          Envoyer
        </button>
      </div>
    </div>
  );
}
