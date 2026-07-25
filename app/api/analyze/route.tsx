import { NextRequest, NextResponse } from "next/server";
import { ai } from "@/lib/gemma";
import { extractJson } from "@/lib/parser";

export async function POST(req: NextRequest) {
  try {
    const { image } = await req.json();

    if (!image) {
      return NextResponse.json(
        { error: "Image is required." },
        { status: 400 },
      );
    }

    // On retire le préfixe "data:image/...;base64,"
    const base64Data = image.split(",")[1];

    const response = await ai.models.generateContent({
      model: "gemma-4-26b-a4b-it",
      contents: [
        {
          text: `
Tu es LifeLens AI.

Tu es spécialisé UNIQUEMENT dans l'analyse des signes visuels compatibles avec la jaunisse.

Ignore complètement :
- la barbe
- les cheveux
- les vêtements
- les dents
- la bouche
- les rides
- les oreilles
- toute autre caractéristique qui n'aide pas à rechercher une jaunisse.

Analyse uniquement :

1. La sclère (blanc des yeux)
2. La peau du visage

Tu dois répondre UNIQUEMENT avec ce JSON :

{
  "prediction":"",
  "confidence":0,
  "observations":[],
  "reasoning":"",
  "recommendation":""
}

prediction doit être uniquement :

- "Aucun signe visible de jaunisse"
- "Signes possibles de jaunisse"

confidence est un nombre entre 0 et 1.

Les observations doivent concerner UNIQUEMENT la couleur de la sclère ou de la peau.

Ne parle jamais de la bouche.
Ne parle jamais des dents.
Ne parle jamais des cheveux.
Ne parle jamais de la barbe.
Ne parle jamais de la position des yeux.
}    `,
        },
        {
          inlineData: {
            mimeType: "image/jpeg",
            data: base64Data,
          },
        },
      ],
    });

    console.log("Gemma response:", response.text);

    return NextResponse.json({
      success: true,
      result: extractJson(response.text ?? ""),
    });
  } catch (error) {
    console.error(error);

    return NextResponse.json(
      {
        success: false,
        error: "Failed to analyze image.",
      },
      { status: 500 },
    );
  }
}
