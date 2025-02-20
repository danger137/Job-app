import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import cloudinary from '@/lib/cloudinary';
import upload from '@/lib/multer';
import { Readable } from 'stream';
import { getIronSession } from "iron-session";

export const config = {
  runtime: 'nodejs',
  api: {
    bodyParser: false,
  },
};

interface SessionData {
  user?: {
    role: string;
    id: string;
  };
}

function runMiddleware(req: any, res: any, fn: Function) {
  return new Promise((resolve, reject) => {
    fn(req, res, (result: any) => {
      if (result instanceof Error) {
        return reject(result);
      }
      return resolve(result);
    });
  });
}

export async function POST(req: Request) {
  try {
    const arrayBuffer = await req.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);
    const stream = Readable.from(buffer);
    const reqAny: any = stream;
    reqAny.headers = Object.fromEntries(req.headers);
    reqAny.method = req.method;
    reqAny.body = {};
    
    await runMiddleware(reqAny, {}, upload.single('resume'));
    const { jobId, fullName, email, coverLetter } = reqAny.body;
    const resumeFile = reqAny.file;

    if (!jobId || !fullName || !email || !coverLetter || !resumeFile) {
      return NextResponse.json({ error: 'All fields are required' }, { status: 400 });
    }

    const session = await getIronSession<SessionData>(req, new Response(), {
      password: process.env.SESSION_SECRET as string,
      cookieName: "auth_session",
    });

    const userId = session.user?.id;
    if (!userId) {
      return NextResponse.json({ error: "User ID is required" }, { status: 400 });
    }

    const cloudinaryResponse: any = await new Promise((resolve, reject) => {
      cloudinary.uploader.upload_stream(
        {
          resource_type: 'auto',
          folder: 'job-portal/resumes',
        },
        (error, result) => {
          if (error) {
            reject(error);
          } else {
            resolve(result);
          }
        }
      ).end(resumeFile.buffer);
    });

    if (!cloudinaryResponse || !cloudinaryResponse.secure_url) {
      throw new Error('Cloudinary upload failed');
    }

    const application = await prisma.application.create({
      data: {
        jobId: parseInt(jobId),
        userId: parseInt(userId),
        resume: cloudinaryResponse.secure_url,
        coverLetter: coverLetter,
        status: "pending",
        email: email,
        fullName: fullName,
      },
    });

    return NextResponse.json({ success: true, application }, { status: 201 });
  } catch (error: unknown) {
    const errorMessage = error instanceof Error ? error.message : 'Application submission failed';
    return NextResponse.json({ error: errorMessage }, { status: 500 });
  }
}

export async function GET(req: Request) {
  try {
    const applications = await prisma.application.findMany({
      include: {
        job: true,
        user: true,
      },
    });
    return NextResponse.json({ success: true, applications });
  } catch (error: unknown) {
    const errorMessage = error instanceof Error ? error.message : 'Failed to fetch applications';
    return NextResponse.json({ error: errorMessage }, { status: 500 });
  }
}
