import { getCorsHeaders } from "@/lib/cors";
import { errorResponse } from "@/lib/utils";
import jwt from "jsonwebtoken";
import { NextResponse } from "next/server";

const JWT_SECRET = process.env.JWT_SECRET || "fallback_secret";
const adminUser = process.env.ADMIN_USER;
const adminPass = process.env.ADMIN_PASS;

// Preflight request handler
export async function OPTIONS(req) {
  const headers = getCorsHeaders(req);
  return new Response(null, { status: 204, headers });
}

export async function POST(req) {
  const headers = getCorsHeaders(req);

  try {
    const { email, password } = await req.json();

    if (email === adminUser && password === adminPass) {
      const token = jwt.sign(
        { id: "-1", email: email, username: "admin" },
        JWT_SECRET,
        { expiresIn: "7d" }
      );

      const response = NextResponse.json(
        { message: "Login successful", user: { email, username: "admin" } },
        { status: 200, headers }
      );

      const isProduction = process.env.NODE_ENV === "production";

      response.cookies.set("token", token, {
        httpOnly: true,
        sameSite: isProduction ? "none" : "lax",
        secure: isProduction,
        path: "/",
        maxAge: 60 * 60 * 24 * 7,
      });

      return response;
    }

    return errorResponse("Invalid email or password", 401, headers);
  } catch (error) {
    return errorResponse("Invalid request payload", 400, headers);
  }
}