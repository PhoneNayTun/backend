import jwt from "jsonwebtoken";

const JWT_SECRET = process.env.JWT_SECRET;

export function verifyJWT(req) {
  try {
    const token = req.cookies.get("token")?.value;
    if (!token) return null;
    return jwt.verify(token, JWT_SECRET);
  } catch (err) {
    return null;
  }
}