import { NextResponse } from "next/server";

export async function POST(req: Request) {
  try {
    // Vytvořit response a odstranit cookie
    const response = NextResponse.json(
      { message: "Odhlášení úspěšné" },
      { status: 200 }
    );

    response.cookies.set("userId", "", {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      maxAge: 0, // Ihned vyprší
    });

    return response;
  } catch (err) {
    return NextResponse.json(
      { error: "Server error" },
      { status: 500 }
    );
  }
}
