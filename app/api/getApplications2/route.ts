import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { getIronSession } from "iron-session";

interface SessionData {
  user?: {
    role: string;
    id: string;
  };
}

export async function GET(req: Request): Promise<NextResponse> {
  try {
    const session = await getIronSession<SessionData>(req, new Response(), {
      password: process.env.SESSION_SECRET as string,
      cookieName: "auth_session",
    });

    const userId = session.user?.id ? parseInt(session.user.id, 10) : undefined;

    const applications = await prisma.application.findMany({
      where: { userId },
      include: {
        job: true, 
      },
    });

    return NextResponse.json(applications, { status: 200 });
  } catch (error) {
    return NextResponse.json({ error: "Failed to fetch applications" }, { status: 500 });
  }
}
