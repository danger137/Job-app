import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export async function GET(): Promise<NextResponse> {
  try {
    const applications = await prisma.application.findMany();
    return NextResponse.json(applications, { status: 200 });
  } catch (error) {
    return NextResponse.json({ error: "Failed to fetch applications" }, { status: 500 });
  }
}
