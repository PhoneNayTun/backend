import { getCorsHeaders } from "@/lib/cors";
import { errorResponse } from "@/lib/utils";
import jwt from "jsonwebtoken";
import { NextResponse } from "next/server";

const JWT_SECRET = process.env.JWT_SECRET || "fallback_secret";

// Preflight request handler
export async function OPTIONS(req) {
  const headers = getCorsHeaders(req);
  return new Response(null, { status: 204, headers });
}

export async function GET(req) {
  const headers = getCorsHeaders(req);

  try {
    const token = req.cookies.get("token")?.value;

    if (!token) {
      return errorResponse("Unauthorized: Missing token", 401, headers);
    }

    const decoded = jwt.verify(token, JWT_SECRET);

    return NextResponse.json(
      { user: decoded },
      { status: 200, headers }
    );
  } catch (error) {
    return errorResponse("Unauthorized: Invalid token", 401, headers);
  }
}