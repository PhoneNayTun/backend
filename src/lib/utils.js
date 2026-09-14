import { NextResponse } from "next/server";
import { getCorsHeaders } from "@/lib/cors";

export function errorResponse(message, status = 400, reqOrHeaders) {
  // Determine if passed argument is a Request object or already parsed headers
  const headers = reqOrHeaders?.headers || reqOrHeaders?.get
    ? getCorsHeaders(reqOrHeaders)
    : reqOrHeaders;

  return NextResponse.json(
    { error: message },
    { status, headers }
  );
}