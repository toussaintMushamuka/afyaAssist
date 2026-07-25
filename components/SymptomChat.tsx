"use client";

import { useState } from "react";

/**
 * Structure d'une question symptôme
 */
interface Question {
  id: number;

  text: string;
}

/**
 * Structure d'un message du chat
 */
interface Message {
  role: "assistant" | "user";

  content: string;
}

interface SymptomChatProps {
  /**
   * Questions générées par Gemma
   */
  questions: Question[];

  /**
   * Retourne toute la conversation
   * lorsque toutes les questions sont terminées
   */
  onComplete: (messages: Message[]) => void;
}

export default function SymptomChat({
  questions,

  onComplete,
}: SymptomChatProps) {
  /**
   * Question actuellement affichée
   */
  const [currentQuestion, setCurrentQuestion] = useState(0);

  /**
   * Historique conversation
   */
  const [messages, setMessages] = useState<Message[]>([
    {
      role: "assistant",

      content: questions[0]?.text ?? "Bonjour, commençons l'évaluation.",
    },
  ]);

  /**
   * Texte de réponse utilisateur
   */
  const [input, setInput] = useState("");

  /**
   * Simulation réflexion IA
   */
  const [isTyping, setIsTyping] = useState(false);

  /**
   * Questionnaire terminé
   */
  const [isCompleted, setIsCompleted] = useState(false);

  /**
   * Envoi d'une réponse utilisateur
   */
  const sendMessage = async () => {
    /**
     * Empêche un envoi vide
     */
    if (!input.trim()) return;

    const userMessage: Message = {
      role: "user",

      content: input,
    };

    const updatedMessages = [...messages, userMessage];

    /**
     * Affichage immédiat
     * de la réponse utilisateur
     */
    setMessages(updatedMessages);

    setInput("");

    /**
     * Vérification :
     * dernière question atteinte
     */
    if (currentQuestion + 1 >= questions.length) {
      /**
       * Fin du questionnaire
       */
      setIsCompleted(true);

      /**
       * Envoi de toutes les réponses
       * au composant parent
       */
      onComplete(updatedMessages);

      return;
    }

    /**
     * Simulation analyse Gemma
     */
    setIsTyping(true);

    setTimeout(() => {
      const nextQuestion = questions[currentQuestion + 1];

      setMessages((previous) => [
        ...previous,

        {
          role: "assistant",

          content: nextQuestion.text,
        },
      ]);

      setCurrentQuestion(currentQuestion + 1);

      setIsTyping(false);
    }, 800);
  };

  return (
    <div
      className="
      card
      bg-base-100
      shadow-xl
      "
    >
      <div
        className="
        card-body
        "
      >
        {/* HEADER */}

        <div
          className="
          flex
          justify-between
          items-center
          "
        >
          <div>
            <h2
              className="
              card-title
              "
            >
              🩺 LifeLens AI
            </h2>

            <p
              className="
              text-sm
              opacity-60
              "
            >
              Analyse des symptômes
            </p>
          </div>

          <div
            className="
            badge
            badge-primary
            "
          >
            {Math.min(currentQuestion + 1, questions.length)}/{questions.length}
          </div>
        </div>

        {/* BARRE PROGRESSION */}

        <progress
          className="
          progress
          progress-primary
          w-full
          "
          value={currentQuestion + 1}
          max={questions.length}
        />

        {/* ZONE MESSAGE */}

        <div
          className="
          h-96
          overflow-y-auto
          space-y-3
          mt-4
          "
        >
          {messages.map((message, index) => (
            <div
              key={index}
              className={
                message.role === "assistant"
                  ? "chat chat-start"
                  : "chat chat-end"
              }
            >
              <div
                className="
                  chat-image
                  avatar
                  "
              >
                <div
                  className="
                    w-10
                    rounded-full
                    bg-primary
                    text-white
                    flex
                    items-center
                    justify-center
                    "
                >
                  {message.role === "assistant" ? "AI" : "👤"}
                </div>
              </div>

              <div
                className={
                  message.role === "assistant"
                    ? "chat-bubble chat-bubble-primary"
                    : "chat-bubble"
                }
              >
                {message.content}
              </div>
            </div>
          ))}

          {/* Animation IA */}

          {isTyping && (
            <div className="chat chat-start">
              <div
                className="
                  chat-bubble
                  chat-bubble-primary
                  "
              >
                LifeLens AI écrit...
                <span
                  className="
                    loading
                    loading-dots
                    loading-sm
                    ml-2
                    "
                />
              </div>
            </div>
          )}

          {/* FIN QUESTIONNAIRE */}

          {isCompleted && (
            <div
              className="
                alert
                alert-success
                mt-4
                "
            >
              <span>
                ✅ Questionnaire terminé. Vous pouvez générer votre rapport
                final.
              </span>
            </div>
          )}
        </div>

        {/* ZONE REPONSE */}

        {!isCompleted && (
          <div
            className="
              flex
              gap-2
              mt-4
              "
          >
            <input
              className="
                input
                input-bordered
                flex-1
                "
              placeholder="
                Décrivez vos symptômes...
                "
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter") sendMessage();
              }}
            />

            <button
              className="
                btn
                btn-primary
                "
              onClick={sendMessage}
            >
              Envoyer
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
