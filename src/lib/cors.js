const allowedOrigins = [
  "https://frontend-ace-a5ca.vercel.app",
  "http://localhost:5173",
  "http://localhost:3000"
];

if (process.env.FRONTEND_URL) {
  allowedOrigins.push(process.env.FRONTEND_URL);
}

export const corsHeaders = {
  "Access-Control-Allow-Credentials": "true",
  "Access-Control-Allow-Origin": "https://frontend-ace-a5ca.vercel.app",
  "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type, Authorization",
  "Access-Control-Max-Age": "86400",
};

export function handleCors(req, res) {
  const origin = req.headers.get ? req.headers.get('origin') : req.headers.origin;

  if (allowedOrigins.includes(origin)) {
    corsHeaders["Access-Control-Allow-Origin"] = origin;
  } else if (process.env.FRONTEND_URL) {
    corsHeaders["Access-Control-Allow-Origin"] = process.env.FRONTEND_URL;
  }

  if (req.method === 'OPTIONS') {
    return true;
  }

  return false;
}

// Add this line to fix the default import issue across all files
export default corsHeaders;