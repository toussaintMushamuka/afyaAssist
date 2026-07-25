import { NextResponse } from "next/server";
import { ai } from "@/lib/gemma";

export async function GET() {
  try {
    const response = await ai.models.generateContent({
      model: "gemma-4-26b-a4b-it",
      contents: "Reply only with: afyaassist is ready!",
    });

    return NextResponse.json({
      success: true,
      text: response.text,
    });
  } catch (error) {
    console.error(error);

    return NextResponse.json(
      {
        success: false,
        error,
      },
      { status: 500 },
    );
  }
}
