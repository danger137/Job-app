import { NextRequest, NextResponse } from "next/server";
import { getIronSession } from "iron-session";

export async function POST(req: NextRequest) {
  const res = NextResponse.json({ success: true });


  const session = await getIronSession(req, res, {
    password: process.env.SESSION_SECRET!, 
    cookieName: "auth_session",
    cookieOptions: {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "Strict",
      path: "/",
      maxAge: 0, 
    },
  });

  session.destroy();

  return res;
}
