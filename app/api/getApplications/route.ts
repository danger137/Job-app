import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export async function GET(): Promise<NextResponse> {
  try {
    const pendingJobs = await prisma.application.findMany({
      where: { status: "pending" }, 
    });

    return NextResponse.json(pendingJobs, { status: 200 });
  } catch (error) {
    return NextResponse.json({ error: "Failed to fetch pending applications" }, { status: 500 });
  }
}
