import { getCorsHeaders } from "@/lib/cors";
import { NextResponse } from "next/server";

export async function OPTIONS(req) {
  const headers = getCorsHeaders(req);
  return new Response(null, { status: 204, headers });
}

export async function POST(req) {
  const headers = getCorsHeaders(req);

  const response = NextResponse.json(
    { message: "Logout successful" },
    { status: 200, headers }
  );

  const isProduction = process.env.NODE_ENV === "production";

  response.cookies.set("token", "", {
    httpOnly: true,
    sameSite: isProduction ? "none" : "lax",
    secure: isProduction,
    path: "/",
    maxAge: 0,
    expires: new Date(0),
  });

  return response;
}

// Support GET requests as a fallback if your frontend calls GET for logout
export async function GET(req) {
  return POST(req);
}