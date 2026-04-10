import { NextResponse } from 'next/server';

export async function POST(req: Request) {
  const { text, voiceId } = await req.json();

  const ELEVENLABS_API_KEY = process.env.ELEVENLABS_API_KEY;
  // Use a specific Voice ID (e.g., a calm, supportive voice for "Stampley")
  const id = voiceId || '21m0pTKZ6mT67YZ68wSu'; 

  const response = await fetch(`https://api.elevenlabs.io/v1/text-to-speech/${id}`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'xi-api-key': ELEVENLABS_API_KEY as string,
    },
    body: JSON.stringify({
      text,
      model_id: 'eleven_monolingual_v1',
      voice_settings: { stability: 0.5, similarity_boost: 0.5 },
    }),
  });

  if (!response.ok) {
    return NextResponse.json({ error: 'Failed to generate voice' }, { status: 500 });
  }

  const audioBuffer = await response.arrayBuffer();
  return new NextResponse(audioBuffer, {
    headers: { 'Content-Type': 'audio/mpeg' },
  });
}