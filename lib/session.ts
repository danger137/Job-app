import { SessionOptions } from "iron-session";

export interface SessionData {
  user?: {
    name: string;
    role: string;
  };
}

export const sessionOptions: SessionOptions = {
  password: process.env.SESSION_SECRET!,
  cookieName: "auth_session",
  cookieOptions: {
    secure: process.env.NODE_ENV === "production",
    httpOnly: true,
    sameSite: "strict",
  },
};
