import { NextRequest, NextResponse } from "next/server";
import { getIronSession, IronSession } from "iron-session";
import prisma from "@/lib/prisma";
import bcrypt from "bcryptjs";


if (!process.env.SESSION_SECRET || process.env.SESSION_SECRET.length < 32) {
  throw new Error("SESSION_SECRET must be at least 32 characters long.");
}


interface UserSession {
  user?: {
    id: string;
    email: string;
    role: string; // ✅ Role added
  };
}


const sessionOptions = {
  cookieName: "auth_session",
  password: process.env.SESSION_SECRET!,
  cookieOptions: {
    secure: process.env.NODE_ENV === "production",
    httpOnly: true,
    sameSite: "lax",
  },
};

export async function POST(req: Request) {
  try {
    const { email, password } = await req.json();

  
    const user = await prisma.user.findUnique({ where: { email } });
    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return NextResponse.json({ error: "Invalid credentials" }, { status: 401 });
    }

  
    const res = NextResponse.json(
      { 
        message: "Login successful", 
        user: { id: user.id, name: user.name, role: user.role } // ✅ Role included in response
      },
      { status: 200 }
    );

  
    const session: IronSession<UserSession> = await getIronSession(req, res, sessionOptions);
    
   
    session.user = { 
      id: user.id.toString(), 
      email: user.email, 
      role: user.role // ✅ Save role in session
    };
    await session.save();

    return res;
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: "Something went wrong" }, { status: 500 });
  }
}


