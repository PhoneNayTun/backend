export function getCorsHeaders(req) {
  // Safely retrieve the origin header from Web API Request or Node.js req
  const origin = req?.headers?.get 
    ? req.headers.get("origin") 
    : req?.headers?.origin;

  // Fallback if no origin header is sent (e.g., Postman / server calls)
  if (!origin) {
    return {
      "Access-Control-Allow-Origin": process.env.FRONTEND_URL || "https://frontend-ace-a5ca.vercel.app",
      "Access-Control-Allow-Credentials": "true",
      "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE, OPTIONS",
      "Access-Control-Allow-Headers": "Content-Type, Authorization",
      "Access-Control-Max-Age": "86400",
    };
  }

  // Allow localhost during dev and ANY .vercel.app deployment URL
  const isAllowed = 
    origin.includes("localhost") || 
    origin.endsWith(".vercel.app");

  const allowedOrigin = isAllowed 
    ? origin 
    : (process.env.FRONTEND_URL || "https://frontend-ace-a5ca.vercel.app");

  return {
    "Access-Control-Allow-Origin": allowedOrigin,
    "Access-Control-Allow-Credentials": "true",
    "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE, OPTIONS",
    "Access-Control-Allow-Headers": "Content-Type, Authorization",
    "Access-Control-Max-Age": "86400",
  };
}

// Default export fallback for backward compatibility
export default {
  "Access-Control-Allow-Credentials": "true",
  "Access-Control-Allow-Origin": "https://frontend-ace-a5ca.vercel.app",
  "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type, Authorization",
  "Access-Control-Max-Age": "86400",
};