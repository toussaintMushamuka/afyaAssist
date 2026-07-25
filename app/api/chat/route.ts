import { NextRequest, NextResponse } from "next/server";
import { ai } from "@/lib/gemma";
import { jaundiceChatPrompt } from "@/lib/prompts/jaundiceChat";

export async function POST(req: NextRequest) {
  try {
    const { message, history } = await req.json();

    const response = await ai.models.generateContent({
      model: "gemma-4-26b-a4b-it",
      contents: [
        {
          text: `
${jaundiceChatPrompt}

Historique de la conversation :
${JSON.stringify(history)}

Dernier message utilisateur :
${message}

Réponds uniquement avec la prochaine question à poser.
          `,
        },
      ],
    });

    return NextResponse.json({
      success: true,
      message: response.text,
    });
  } catch (error) {
    console.error(error);

    return NextResponse.json(
      {
        success: false,
        error: "Chat failed",
      },
      {
        status: 500,
      },
    );
  }
}
