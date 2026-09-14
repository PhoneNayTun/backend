import { getCorsHeaders } from "@/lib/cors"; 
import { getClientPromise } from "@/lib/mongodb"; 
import { NextResponse } from "next/server"; 
import bcrypt from "bcrypt"; 
import { isAdmin } from "@/lib/auth"; 
import { errorResponse, successResponse } from "@/lib/utils"; 

export async function OPTIONS(request) {
  return new Response(null, { status: 204, headers: getCorsHeaders(request) });
}

// GET: Fetch paginated list of users (Admin only)
export async function GET(request) { 
  const headers = getCorsHeaders(request);

  if (!isAdmin(request)) { 
    return errorResponse("Unauthorized Request", 403, headers); 
  } 
 
  const searchParams = request.nextUrl.searchParams; 
  const pageParam = searchParams.get("page") || "1"; 
 
  let page = Number(pageParam) - 1; 
  page = page < 0 ? 0 : page; 
  const size = 10; 
 
  try { 
    const client = await getClientPromise(); 
    const db = client.db(process.env.DB_NAME || "my_database"); 
    const result = await db 
      .collection("user") 
      .find({}, { projection: { password: 0 } }) 
      .skip(page * size) 
      .limit(size) 
      .toArray(); 
      
    const output = { 
      users: result, 
      page: page + 1, 
      size: size, 
    }; 
    return NextResponse.json(output, { status: 200, headers }); 
  } catch (error) { 
    console.log("==>GET user exception", error); 
    return errorResponse("Failed to fetch users", 500, headers);
  } 
} 
 
// POST: Create a new user (Admin only) or update user data
export async function POST(request) { 
  const headers = getCorsHeaders(request);

  if (!isAdmin(request)) { 
    return errorResponse("Unauthorized Request", 403, headers); 
  } 
  
  const data = await request.json(); 
  const { username, email, password, firstname, lastname } = data; 
 
  if (!username || !email || !password) { 
    return errorResponse("Missing mandatory data", 400, headers); 
  } 
 
  try { 
    const client = await getClientPromise(); 
    const db = client.db(process.env.DB_NAME || "my_database"); 
    
    // Hash password with bcrypt before saving to MongoDB
    const hashedPassword = await bcrypt.hash(password, 12);

    const result = await db.collection("user").insertOne({ 
      username, 
      email, 
      firstname, 
      lastname, 
      password: hashedPassword, 
      status: "ACTIVE", 
    }); 
    
    return NextResponse.json(
      { id: result.insertedId, message: "User created successfully" }, 
      { status: 201, headers }
    ); 
  } catch (error) { 
    console.log("==>POST user exception", error); 
    const errorResponseMessage = error?.errorResponse?.errmsg || error?.message || ""; 
    
    let errorType = "Others"; 
    let errorMsg = errorResponseMessage; 

    // Handle MongoDB unique index violations (duplicate username or email)
    if (errorResponseMessage.includes("duplicate")) { 
      errorMsg = errorResponseMessage.includes("username") ? "username" : "email"; 
      errorType = "Duplicate Data"; 
    } 
    
    return NextResponse.json( 
      { errorType, errorMsg }, 
      { status: 400, headers } 
    ); 
  } 
}