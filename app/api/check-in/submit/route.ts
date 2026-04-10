import { NextResponse } from "next/server";
import { Prisma } from "@prisma/client";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function POST(req: Request) {
  try {
    const session = await auth();
    const userId = session?.user?.id;

    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = (await req.json().catch(() => null)) as
      | {
          domain?: string | null;
          subscale?: string | null;
          affect?: { distress?: number | null; mood?: number | null; energy?: number | null } | null;
          narrative?: { reflection?: string | null; copingAction?: string | null } | null;
          contextTags?: unknown;
          needsSafetyEscalation?: boolean;
          previousDayDistress?: number | null;
          consecutiveHighDistressDays?: number;
        }
      | null;

    if (!body) {
      return NextResponse.json({ error: "Invalid JSON body" }, { status: 400 });
    }

    const domain = (body.domain ?? "General") as string;
    const subscale = (body.subscale ?? "General distress") as string;

    const distress = body.affect?.distress ?? 0;
    const mood = body.affect?.mood ?? null;
    const energy = body.affect?.energy ?? null;

    const reflection = body.narrative?.reflection ?? "I'm having a hard time today.";
    const copingAction = body.narrative?.copingAction ?? null;

    const contextTags = body.contextTags ?? {};

    const created = await prisma.checkInSubmission.create({
      data: {
        userId,
        domain,
        subscale,
        distress,
        mood,
        energy,
        reflection,
        copingAction,
        contextTags: contextTags as Prisma.InputJsonValue,
        needsSafetyEscalation: !!body.needsSafetyEscalation,
        previousDayDistress: body.previousDayDistress ?? null,
        consecutiveHighDistressDays: body.consecutiveHighDistressDays ?? 0,
      },
    });

    return NextResponse.json({ ok: true, id: created.id });
  } catch (error) {
    console.error("[check-in submit] failed:", error);
    return NextResponse.json(
      { error: "Failed to save check-in submission" },
      { status: 500 }
    );
  }
}

