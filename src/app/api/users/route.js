import { getCorsHeaders } from "@/lib/cors";
import { errorResponse } from "@/lib/utils";
import jwt from "jsonwebtoken";
import { NextResponse } from "next/server";

const JWT_SECRET = process.env.JWT_SECRET || "fallback_secret";

// In-memory user store for demo (replace or connect with your DB)
let users = [
  { id: "1", username: "u6747002", password: "oldpassword" },
  { id: "2", username: "admin", password: "adminpassword" }
];

export async function OPTIONS(req) {
  return new Response(null, { status: 204, headers: getCorsHeaders(req) });
}

// GET: List users (Only accessible by Admin)
export async function GET(req) {
  const headers = getCorsHeaders(req);

  try {
    const token = req.cookies.get("token")?.value;
    if (!token) return errorResponse("Unauthorized", 401, headers);

    const decoded = jwt.verify(token, JWT_SECRET);
    if (decoded.username !== "admin") {
      return errorResponse("Forbidden: Admin access required", 403, headers);
    }

    // Return users without exposing raw passwords
    const safeUsers = users.map(({ password, ...u }) => u);
    return NextResponse.json({ users: safeUsers }, { status: 200, headers });
  } catch (error) {
    return errorResponse("Unauthorized", 401, headers);
  }
}

// POST: Change User Password
export async function POST(req) {
  const headers = getCorsHeaders(req);

  try {
    const token = req.cookies.get("token")?.value;
    if (!token) return errorResponse("Unauthorized", 401, headers);

    const decoded = jwt.verify(token, JWT_SECRET);
    if (decoded.username !== "admin") {
      return errorResponse("Forbidden: Only Admin can change passwords", 403, headers);
    }

    const { username, newPassword } = await req.json();

    const userToUpdate = users.find((u) => u.username === username);
    if (!userToUpdate) {
      return errorResponse("User not found", 404, headers);
    }

    userToUpdate.password = newPassword;

    return NextResponse.json(
      { message: `Password for ${username} successfully changed.` },
      { status: 200, headers }
    );
  } catch (error) {
    return errorResponse("Failed to update password", 500, headers);
  }
}