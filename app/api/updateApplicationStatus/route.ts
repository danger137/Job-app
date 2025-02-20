import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export async function PUT(req: Request): Promise<NextResponse> {
  try {
    const body = await req.json(); 
    const { id, status } = body;

    if (!id || !status) {
      return NextResponse.json({ error: "ID and Status are required" }, { status: 400 });
    }

    const updatedApplication = await prisma.application.update({
      where: { id },
      data: { status },
    });

    return NextResponse.json(updatedApplication, { status: 200 });
  } catch (error) {
    console.error("Update Error:", error);
    return NextResponse.json({ error: "Failed to update status" }, { status: 500 });
  }
}
