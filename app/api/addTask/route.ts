import { redis } from "@/lib/redis";
import { NextResponse } from "next/server";
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

    const { title, timeTill } = await req.json();

    if (!title || !timeTill) {
      return NextResponse.json(
        { error: "Title a timeTill jsou povinné" },
        { status: 400 }
      );
    }

    const taskId = crypto.randomUUID();

    await redis.hset(`task:${taskId}`, {
      title,
      completed: "false",
      timeTill,
      createdAt: Date.now().toString(),
      userId,
    });

    await redis.lpush(`user:${userId}:tasks`, taskId);
    return NextResponse.json({ message: "Task created successfully", taskId }, { status: 201 });
  } catch (error) {
    console.error("Error creating task:", error);
    return NextResponse.json(
      { error: "Server error" },
      { status: 500 }
    );
  }
} 