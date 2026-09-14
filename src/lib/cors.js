export function getCorsOrigin(req) {
  // Safely extract origin whether using Web Request (App Router) or Node.js req
  const origin = req?.headers?.get 
    ? req.headers.get("origin") 
    : req?.headers?.origin;

  // Allow requests without origin (like server-to-server or Postman)
  if (!origin) {
    return process.env.FRONTEND_URL || "https://frontend-ace-a5ca.vercel.app";
  }

  // Allow any local dev origin OR any .vercel.app deployment
  if (origin.includes("localhost") || origin.endsWith(".vercel.app")) {
    return origin;
  }

  return process.env.FRONTEND_URL || "https://frontend-ace-a5ca.vercel.app";
}

export function getCorsHeaders(req) {
  const origin = getCorsOrigin(req);

  return {
    "Access-Control-Allow-Origin": origin,
    "Access-Control-Allow-Credentials": "true",
    "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE, OPTIONS",
    "Access-Control-Allow-Headers": "Content-Type, Authorization",
    "Access-Control-Max-Age": "86400",
  };
}

// Default export for backward compatibility
const corsHeaders = {
  "Access-Control-Allow-Credentials": "true",
  "Access-Control-Allow-Origin": "https://frontend-ace-a5ca.vercel.app",
  "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type, Authorization",
  "Access-Control-Max-Age": "86400",
};

export default corsHeaders;