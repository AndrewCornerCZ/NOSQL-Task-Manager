import { NextResponse } from "next/server";
import { redis } from "@/lib/redis";

export async function POST(req: Request) {
  try {
    const { name, email, password } = await req.json();

    if (!name || !email || !password) {
      return NextResponse.json(
        { error: "Chybí name, email nebo heslo" },
        { status: 400 }
      );
    }

    const userId = crypto.randomUUID();

    // uložit uživatele
    await redis.hset(`user:${userId}`, {
      name,
      email,
      password,
      createdAt: new Date().toISOString(),
    });

    // přidat do seznamu uživatelů
    await redis.sadd("users", userId);

    // Nastavit cookie s userID
    const response = NextResponse.json({
      id: userId,
      name,
      email,
    });

    response.cookies.set("userId", userId, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      maxAge: 60 * 60 * 24 * 7, // 7 dní
    });

    return response;
  } catch (err) {
    return NextResponse.json(
      { error: "Server error" },
      { status: 500 }
    );
  }
}
