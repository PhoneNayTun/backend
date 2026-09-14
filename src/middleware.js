import { NextResponse } from "next/server"; 
import { verifyJWT } from "./lib/auth"; 
import { getCorsHeaders } from "./lib/cors"; 
import { 
  X_HEADER_USER_EMAIL, 
  X_HEADER_USER_ID, 
  X_HEADER_USER_NAME, 
} from "./lib/constant"; 
 
export function middleware(request) { 
  // Handle CORS preflight OPTIONS requests directly
  if (request.method === "OPTIONS") {
    return new Response(null, { status: 204, headers: getCorsHeaders(request) });
  }

  const user = verifyJWT(request); 
  if (!user) { 
    return NextResponse.json( 
      { message: "Unauthorized Request" }, 
      { status: 401, headers: getCorsHeaders(request) } 
    ); 
  } 

  const requestHeaders = new Headers(request.headers); 
  if (user.id !== undefined) requestHeaders.set(X_HEADER_USER_ID, String(user.id)); 
  if (user.email) requestHeaders.set(X_HEADER_USER_EMAIL, user.email); 
  if (user.username) requestHeaders.set(X_HEADER_USER_NAME, user.username); 

  return NextResponse.next({ 
    request: { 
      headers: requestHeaders, 
    }, 
  }); 
} 
 
export const config = { 
  matcher: ["/api/items/:path*", "/api/item/:path*", "/api/users/:path*", "/api/user/:path*"], 
};