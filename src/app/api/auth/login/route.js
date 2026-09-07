import corsHeaders from "@/lib/cors";
import { errorResponse } from "@/lib/utils";
import jwt from "jsonwebtoken";
import { NextResponse } from "next/server";

const JWT_SECRET = process.env.JWT_SECRET;
const adminUser = process.env.ADMIN_USER;
const adminPass = process.env.ADMIN_PASS;

export async function POST(req) {
  const { email, password } = await req.json();

  if (email === adminUser && password === adminPass) {
    const token = jwt.sign(
      { id: "-1", email: email, username: "admin" },
      JWT_SECRET,
      { expiresIn: "7d" }
    );

    const response = NextResponse.json(
      { message: "Login successful", user: { email, username: "admin" } },
      { status: 200, headers: corsHeaders }
    );

    response.cookies.set("token", token, {
      httpOnly: true,
      sameSite: "lax",
      path: "/",
      maxAge: 60 * 60 * 24 * 7,
      secure: false,
    });

    return response;
  }

  return errorResponse("Invalid email or password", 401);
}

export async function OPTIONS() {
  return NextResponse.json({}, { status: 200, headers: corsHeaders });
}