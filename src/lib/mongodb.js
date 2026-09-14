import { MongoClient } from "mongodb";
if (!process.env.MONGODB_URI) throw new Error("Missing MONGODB_URI");
const uri = process.env.MONGODB_URI;
let client = new MongoClient(uri);
let clientPromise = client.connect();
export async function getClientPromise() { return await clientPromise; }
export default clientPromise;
