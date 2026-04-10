import { NextResponse } from "next/server";

export async function GET() {
  const agentId = process.env.NEXT_PUBLIC_ELEVENLABS_AGENT_ID?.trim();
  const apiKey = process.env.ELEVENLABS_API_KEY?.trim();

  if (!agentId || !apiKey) {
    return NextResponse.json(
      { error: "Missing ElevenLabs configuration" },
      { status: 503 }
    );
  }

  try {
    const response = await fetch(
      `https://api.elevenlabs.io/v1/convai/conversation/get-signed-url?agent_id=${agentId}`,
      {
        method: "GET",
        headers: { "xi-api-key": apiKey },
      }
    );

    if (!response.ok) {
      const errBody = await response.text();
      return NextResponse.json(
        { error: "Failed to get signed URL", message: errBody || "Unknown error" },
        { status: response.status >= 500 ? 502 : 400 }
      );
    }

    const data = (await response.json()) as {
      signed_url?: string;
      signedUrl?: string;
    };
    const signedUrl = data.signed_url ?? data.signedUrl;
    if (!signedUrl || typeof signedUrl !== "string") {
      return NextResponse.json(
        { error: "Invalid signed URL response from ElevenLabs" },
        { status: 502 }
      );
    }

    return NextResponse.json({ signed_url: signedUrl });
  } catch {
    return NextResponse.json(
      { error: "Server Error", message: "Could not obtain signed URL" },
      { status: 500 }
    );
  }
}