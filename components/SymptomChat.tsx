"use client";

import { useState } from "react";

type Question = {
  id: number;
  text: string;
};

type Answer = {
  question: string;
  answer: string;
};

export default function SymptomChat({
  questions = [],

  onComplete,
}: {
  questions: Question[];

  onComplete?: (answers: Answer[]) => void;
}) {
  const [currentIndex, setCurrentIndex] = useState(0);

  const [answer, setAnswer] = useState("");

  const [answers, setAnswers] = useState<Answer[]>([]);

  const currentQuestion = questions[currentIndex];

  const handleNext = () => {
    if (!answer.trim()) return;

    const newAnswers = [
      ...answers,

      {
        question: currentQuestion.text,

        answer: answer,
      },
    ];

    setAnswers(newAnswers);

    setAnswer("");

    // Dernière question terminée

    if (currentIndex === questions.length - 1) {
      onComplete?.(newAnswers);

      return;
    }

    setCurrentIndex(currentIndex + 1);
  };

  if (!questions.length) {
    return null;
  }

  return (
    <div
      className="
      bg-white
      rounded-xl
      shadow
      p-6
      space-y-6
      "
    >
      <h2 className="text-xl font-bold">Assistant santé LifeLens AI</h2>

      <p className="text-gray-500">
        Question {currentIndex + 1} / {questions.length}
      </p>

      <div>
        <p className="font-semibold">{currentQuestion.text}</p>
      </div>

      <textarea
        value={answer}
        onChange={(e) => setAnswer(e.target.value)}
        placeholder="Votre réponse..."
        className="
        w-full
        border
        rounded-lg
        p-3
        "
      />

      <button
        onClick={handleNext}
        className="
        w-full
        bg-blue-600
        text-white
        rounded-lg
        py-3
        "
      >
        {currentIndex === questions.length - 1
          ? "Terminer"
          : "Question suivante"}
      </button>
    </div>
  );
}
