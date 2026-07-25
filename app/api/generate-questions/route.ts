import { NextRequest, NextResponse } from "next/server";

import { ai } from "@/lib/gemma";
import { getJaundiceKnowledge } from "@/lib/rag";
import { extractJson } from "@/lib/parser";

export async function POST(req: NextRequest) {
  try {
    const { imageAnalysis } = await req.json();

    // Chargement des connaissances médicales
    const medicalKnowledge = getJaundiceKnowledge();

    const response = await ai.models.generateContent({
      model: "gemma-4-26b-a4b-it",

      contents: [
        {
          text: `

Tu es LifeLens AI, assistant de dépistage médical.


Ta mission :

Créer les questions les plus pertinentes
à poser au patient après une analyse visuelle
suspectant une jaunisse.



Tu dois utiliser :

1. L'analyse de l'image

2. Les connaissances médicales



====================

CONNAISSANCES MÉDICALES

====================

${medicalKnowledge}



====================

ANALYSE IMAGE

====================

${JSON.stringify(imageAnalysis)}



Règles :

- Ne pose jamais de diagnostic.
- Pose uniquement des questions utiles.
- Maximum 7 questions.
- Les questions doivent aider à confirmer ou diminuer la suspicion.
- Demande les symptômes importants liés à la jaunisse.
- Tiens compte des signes déjà visibles sur l'image.


Retourne uniquement ce JSON :


{

 "questions":[

   {

    "id":1,

    "text":"Question patient"

   }

 ]

}


`,
        },
      ],
    });

    return NextResponse.json({
      success: true,

      result: extractJson(response.text ?? ""),
    });
  } catch (error) {
    console.error(error);

    return NextResponse.json(
      {
        success: false,

        error: "Question generation failed",
      },

      {
        status: 500,
      },
    );
  }
}
