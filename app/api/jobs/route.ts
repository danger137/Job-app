import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";
import { getIronSession } from "iron-session";

const prisma = new PrismaClient();


export async function GET(): Promise<NextResponse> {
  try {
    const jobs = await prisma.job.findMany();
    return NextResponse.json(jobs, { status: 200 });
  } catch (error) {
    return NextResponse.json({ error: "Failed to fetch jobs" }, { status: 500 });
  }
}

interface SessionData {
  user?: {
    role: string;
    id:string;
  };
}


export async function POST(req:Request) {
  try {
    const body = await req.json();

 

    const session = await getIronSession<SessionData>(req, new Response(), {
      password: process.env.SESSION_SECRET as string,
      cookieName: "auth_session",
    });
  
    const postedById = session.user?.id;
  
    

  
    if (!body.title || !body.description || !body.category || !body.location || !body.salary || !postedById) {
      return NextResponse.json({ error: "Invalid input" }, { status: 400 });
    }

 
    const newJob = await prisma.job.create({
      data: {
        title: body.title,
        description: body.description,
        category: body.category,
        location: body.location,
        salary: parseFloat(body.salary),
        postedById: parseInt(postedById), 
      },
      include: {
        posted_by: true, 
      },
    });

    return NextResponse.json({ message: "Job posted successfully", job: newJob }, { status: 201 });
  } catch (error) {
    console.error("Error posting job:", error);
    return NextResponse.json({ error: "Failed to post job" }, { status: 500 });
  }
}

