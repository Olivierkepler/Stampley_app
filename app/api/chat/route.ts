import { NextResponse } from "next/server";
import OpenAI from "openai";
import { buildSystemPrompt } from "../../(checkin)/check-in/lib/stampley-prompt";
import type { PatientState } from "../../(checkin)/check-in/lib/stampley-prompt";

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

/** Ensure patientState has safe defaults so buildSystemPrompt never receives invalid values. */
function normalizePatientState(raw: unknown): PatientState {
  if (!raw || typeof raw !== "object") {
    return {
      domain: "General",
      subscale: "General distress",
      distress: 5,
      mood: null,
      energy: null,
      reflection: "I'm having a hard time today.",
      copingAction: "",
      contextTagLabels: [],
      emotionKeywords: [],
    };
  }
  const o = raw as Record<string, unknown>;
  const num = (v: unknown, fallback: number): number =>
    typeof v === "number" && !Number.isNaN(v) ? v : fallback;
  const str = (v: unknown, fallback: string): string =>
    typeof v === "string" ? v : fallback;
  const arr = (v: unknown): string[] =>
    Array.isArray(v) ? v.filter((x): x is string => typeof x === "string") : [];

  return {
    domain: str(o.domain, "General"),
    subscale: str(o.subscale, "General distress"),
    distress: num(o.distress, 5),
    mood: o.mood != null ? num(o.mood, 5) : null,
    energy: o.energy != null ? num(o.energy, 5) : null,
    reflection: str(o.reflection, "I'm having a hard time today."),
    copingAction: str(o.copingAction, ""),
    contextTagLabels: arr(o.contextTagLabels),
    emotionKeywords: arr(o.emotionKeywords),
  };
}

/** Build OpenAI messages: system + conversation (user/assistant only). */
function buildMessages(systemContent: string, messageHistory: unknown[]): { role: "system" | "user" | "assistant"; content: string }[] {
  const systemMessage = { role: "system" as const, content: systemContent };
  const conversation: { role: "user" | "assistant"; content: string }[] = [];

  for (const item of messageHistory) {
    if (!item || typeof item !== "object") continue;
    const m = item as Record<string, unknown>;
    const role = m.role;
    const content = typeof m.content === "string" ? m.content : "";
    if (role === "user" || role === "assistant") {
      conversation.push({ role, content });
    }
  }

  return [systemMessage, ...conversation];
}

/** Expected shape from the model for the frontend. */
const REQUIRED_KEYS = ["validationText", "reflectionText", "followUpQuestion", "microSkill", "education", "resourceLink"];

function isValidStampleyResponse(data: unknown): data is Record<string, unknown> {
  if (!data || typeof data !== "object") return false;
  const d = data as Record<string, unknown>;
  return (
    REQUIRED_KEYS.every((k) => k in d) &&
    typeof d.validationText === "string" &&
    typeof d.reflectionText === "string" &&
    typeof d.followUpQuestion === "string" &&
    d.microSkill != null &&
    typeof d.microSkill === "object" &&
    d.education != null &&
    typeof d.education === "object"
  );
}

export async function POST(req: Request) {
  try {
    if (!process.env.OPENAI_API_KEY?.trim()) {
      return NextResponse.json(
        { error: "Server misconfiguration: OPENAI_API_KEY is not set." },
        { status: 503 }
      );
    }

    let body: unknown;
    try {
      body = await req.json();
    } catch {
      return NextResponse.json(
        { error: "Invalid JSON body." },
        { status: 400 }
      );
    }

    if (!body || typeof body !== "object") {
      return NextResponse.json(
        { error: "Body must be an object with messageHistory and patientState." },
        { status: 400 }
      );
    }

    const { messageHistory = [], patientState: rawPatientState } = body as Record<string, unknown>;
    if (!Array.isArray(messageHistory)) {
      return NextResponse.json(
        { error: "messageHistory must be an array." },
        { status: 400 }
      );
    }

    const patientState = normalizePatientState(rawPatientState);
    const systemContent = buildSystemPrompt(patientState);
    const messages = buildMessages(systemContent, messageHistory);

    const response = await openai.chat.completions.create({
      model: "gpt-4o",
      messages,
      temperature: 0.55,
      response_format: { type: "json_object" },
    });

    const aiContent = response.choices[0]?.message?.content;
    if (!aiContent || typeof aiContent !== "string") {
      return NextResponse.json(
        { error: "No response generated from the model." },
        { status: 502 }
      );
    }

    let structuredData: unknown;
    try {
      structuredData = JSON.parse(aiContent);
    } catch {
      console.error("Stampley API: Model returned invalid JSON.", aiContent?.slice(0, 200));
      return NextResponse.json(
        { error: "Model response was not valid JSON." },
        { status: 502 }
      );
    }

    if (!isValidStampleyResponse(structuredData)) {
      return NextResponse.json(
        { error: "Model response did not match required structure." },
        { status: 502 }
      );
    }

    return NextResponse.json(structuredData);
  } catch (error) {
    console.error("Stampley API Error:", error);

    if (error instanceof OpenAI.APIError) {
      const status = error.status ?? 500;
      return NextResponse.json(
        { error: error.message || "OpenAI API error." },
        { status: status >= 400 && status < 600 ? status : 500 }
      );
    }

    return NextResponse.json(
      { error: "Failed to generate response." },
      { status: 500 }
    );
  }
}
