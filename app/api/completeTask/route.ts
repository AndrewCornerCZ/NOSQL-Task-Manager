import { NextResponse } from "next/server";
import { redis } from "@/lib/redis";
import { cookies } from "next/headers";

export async function POST(req: Request) {
  try {
    const cookieStore = await cookies();
    const userId = cookieStore.get("userId")?.value;

    if (!userId) {
      return NextResponse.json(
        { error: "Uživatel není přihlášen" },
        { status: 401 }
      );
    }

    const { taskId } = await req.json();

    if (!taskId) {
      return NextResponse.json(
        { error: "taskId je povinné" },
        { status: 400 }
      );
    }

    // Označit task jako hotový
    await redis.hset(`task:${taskId}`, {
      completed: "true",
    });

    return NextResponse.json(
      { message: "Task označen jako hotový" },
      { status: 200 }
    );
  } catch (err) {
    console.error("Error completing task:", err);
    return NextResponse.json(
      { error: "Server error" },
      { status: 500 }
    );
  }
}
