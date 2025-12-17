import { NextResponse } from "next/server";
import { redis } from "@/lib/redis";

export async function POST(req: Request) {
  try {
    const { email, password } = await req.json();

    if (!email || !password) {
      return NextResponse.json(
        { error: "Email a heslo jsou povinné" },
        { status: 400 }
      );
    }

    // Najít uživatele podle emailu
    const userIds = await redis.smembers("users");
    let userId = null;
    let user = null;

    for (const id of userIds) {
      const userData = await redis.hgetall(`user:${id}`);
      if (userData.email === email) {
        // Ověřit heslo
        if (userData.password !== password) {
          return NextResponse.json(
            { error: "Nesprávné heslo" },
            { status: 401 }
          );
        }
        userId = id;
        user = userData;
        break;
      }
    }

    if (!userId || !user) {
      return NextResponse.json(
        { error: "Uživatel nenalezen" },
        { status: 401 }
      );
    }

    // Nastavit cookie s userID
    const response = NextResponse.json({
      id: userId,
      name: user.name,
      email: user.email,
    });

    response.cookies.set("userId", userId, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      maxAge: 60 * 60 * 24 * 7, // 7 dní
    });

    return response;
  } catch (err) {
    console.error("Login error:", err);
    return NextResponse.json(
      { error: "Server error" },
      { status: 500 }
    );
  }
}
