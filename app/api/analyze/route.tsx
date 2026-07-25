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
You are a medical vision analysis assistant.

Your task is ONLY to extract visual observations.

Do NOT diagnose.

Do NOT infer diseases.

Analyze the uploaded face and report ONLY observable facts.

Focus on:

1. Are both eyes visible?
2. Is the sclera visible?
3. What is the apparent sclera color?
   - white
   - slightly yellow
   - clearly yellow
   - cannot determine

4. Skin color
   - normal
   - slightly yellow
   - clearly yellow
   - cannot determine

5. Image quality
   - good
   - fair
   - poor

6. Lighting
   - natural
   - artificial
   - dark
   - overexposed

Return ONLY valid JSON.

{
  "eyes_visible": true,
  "sclera_visible": true,
  "sclera_color": "",
  "skin_color": "",
  "image_quality": "",
  "lighting": "",
  "observations": []
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
