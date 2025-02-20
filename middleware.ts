import { NextResponse, NextRequest } from "next/server";
import { cookies } from "next/headers";


export async function middleware(req: NextRequest) {
  const cookieStore = await cookies();
  const token = cookieStore.get("auth_session");



  if (!token) {
    return NextResponse.redirect(new URL("/Login", req.url));
  }




  return NextResponse.next();
}

export const config = {
  matcher: ["/DashboardUser", "/AdminDashboard", "/jobs","/AddJob","/applications","/getApplications","/getApplications2","/jobs","/updateApplicationStatus","/logout"], 
};
