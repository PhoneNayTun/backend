import jwt from "jsonwebtoken"; 
import { X_HEADER_USER_ID } from "./constant"; 
 
const JWT_SECRET = process.env.JWT_SECRET || "fallback_secret"; 
 
export function verifyJWT(req) { 
  try { 
    const token = req.cookies.get("token")?.value; 
    if (!token) { 
      return null; 
    } 
    const decoded = jwt.verify(token, JWT_SECRET); 
    return decoded; 
  } catch (err) { 
    console.log("==>Verify Token Exception", err); 
    return null; 
  } 
} 
 
export function isAdmin(request) { 
  const headers = request.headers; 
  const userId = Number(headers.get(X_HEADER_USER_ID)); 
  return userId === -1 || headers.get("x-user-username") === "admin"; 
}