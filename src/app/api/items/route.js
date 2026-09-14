import { getCorsHeaders } from "@/lib/cors";
import { errorResponse } from "@/lib/utils";
import jwt from "jsonwebtoken";
import { NextResponse } from "next/server";

const JWT_SECRET = process.env.JWT_SECRET || "fallback_secret";

// In-memory items list (or replace with your DB logic)
let items = [
  { id: 1, name: "Sample Item 1" },
  { id: 2, name: "Sample Item 2" }
];

// Audit logs array to track recorded actions
export let auditLogs = [];

export async function OPTIONS(req) {
  return new Response(null, { status: 204, headers: getCorsHeaders(req) });
}

// GET: Must be authorized to view items
export async function GET(req) {
  const headers = getCorsHeaders(req);

  try {
    const token = req.cookies.get("token")?.value;
    if (!token) return errorResponse("Unauthorized: Session missing", 401, headers);

    const user = jwt.verify(token, JWT_SECRET);

    // Record action in Audit Log
    auditLogs.push({
      action: "READ_ITEMS",
      user: user.username || user.email,
      timestamp: new Date().toISOString()
    });

    return NextResponse.json({ items, logs: auditLogs }, { status: 200, headers });
  } catch (error) {
    return errorResponse("Unauthorized: Invalid token", 401, headers);
  }
}

// POST: Add new item (Requires Auth)
export async function POST(req) {
  const headers = getCorsHeaders(req);

  try {
    const token = req.cookies.get("token")?.value;
    if (!token) return errorResponse("Unauthorized", 401, headers);

    const user = jwt.verify(token, JWT_SECRET);
    const { name } = await req.json();

    const newItem = { id: Date.now(), name };
    items.push(newItem);

    // Record action in Audit Log
    auditLogs.push({
      action: "CREATE_ITEM",
      user: user.username || user.email,
      item: name,
      timestamp: new Date().toISOString()
    });

    return NextResponse.json({ item: newItem, message: "Item added" }, { status: 201, headers });
  } catch (error) {
    return errorResponse("Unauthorized", 401, headers);
  }
}