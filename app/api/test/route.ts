import { redis } from "@/lib/redis";

export async function GET() {
  await redis.set("hello", "world");
  const value = await redis.get("hello");

  return Response.json({ value });
}