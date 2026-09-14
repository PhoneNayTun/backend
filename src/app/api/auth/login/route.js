import { getCorsHeaders } from "../../../../lib/cors";
import { getClientPromise } from "../../../../lib/mongodb";
import { errorResponse } from "../../../../lib/utils";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { NextResponse } from "next/server";

const JWT_SECRET = process.env.JWT_SECRET || "fallback_secret";

// Preflight request handler
export async function OPTIONS(req) {
  const headers = getCorsHeaders(req);
  return new Response(null, { status: 204, headers });
}

export async function POST(req) {
  const headers = getCorsHeaders(req);

  try {
    const { username, email, password } = await req.json();
    const loginIdentifier = username || email;

    if (!loginIdentifier || !password) {
      return errorResponse("Missing email/username or password", 400, headers);
    }

    const client = await getClientPromise();
    const db = client.db(process.env.DB_NAME || "my_database");

    // Search user by username OR email
    const user = await db.collection("user").findOne({
      $or: [{ username: loginIdentifier }, { email: loginIdentifier }],
    });

    if (!user) {
      return errorResponse("Invalid email or password", 401, headers);
    }

    // Verify hashed password
    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      return errorResponse("Invalid email or password", 401, headers);
    }

    // Assign id "-1" if username is admin to preserve your frontend admin privileges logic
    const userId = user.username === "admin" ? "-1" : user._id.toString();

    // Create JWT Token
    const token = jwt.sign(
      { id: userId, email: user.email, username: user.username },
      JWT_SECRET,
      { expiresIn: "7d" }
    );

    const response = NextResponse.json(
      { 
        message: "Login successful", 
        user: { id: userId, email: user.email, username: user.username } 
      },
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
  } catch (error) {
    console.error("==> Login Exception:", error);
    return errorResponse("Invalid request payload", 400, headers);
  }
}