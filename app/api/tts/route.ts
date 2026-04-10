import { NextResponse } from "next/server";

export async function POST(req: Request) {
  const apiKey = process.env.ELEVENLABS_API_KEY?.trim();
  if (!apiKey) {
    return NextResponse.json(
      { error: "Missing ELEVENLABS_API_KEY" },
      { status: 503 }
    );
  }

  try {
    const body = (await req.json().catch(() => null)) as
      | { text?: string; voiceId?: string }
      | null;
    const text = body?.text?.trim();
    const voiceId = body?.voiceId?.trim() || "21m0pTKZ6mT67YZ68wSu";

    if (!text) {
      return NextResponse.json({ error: "Text is required" }, { status: 400 });
    }

    const response = await fetch(
      `https://api.elevenlabs.io/v1/text-to-speech/${voiceId}`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "xi-api-key": apiKey,
        },
        body: JSON.stringify({
          text,
          model_id: "eleven_monolingual_v1",
          voice_settings: { stability: 0.5, similarity_boost: 0.5 },
        }),
      }
    );

    if (!response.ok) {
      const errBody = await response.text();
      return NextResponse.json(
        { error: "TTS failed", message: errBody || "Failed to generate voice" },
        { status: response.status >= 500 ? 502 : 400 }
      );
    }

    const audioBuffer = await response.arrayBuffer();
    return new NextResponse(audioBuffer, {
      headers: { "Content-Type": "audio/mpeg" },
    });
  } catch {
    return NextResponse.json(
      { error: "Server Error", message: "Could not generate TTS audio" },
      { status: 500 }
    );
  }
}