import { NextResponse } from "next/server";
import corsHeaders from "@/lib/cors";

export function errorResponse(message, status = 400) {
  return NextResponse.json({ error: message }, { status, headers: corsHeaders });
}