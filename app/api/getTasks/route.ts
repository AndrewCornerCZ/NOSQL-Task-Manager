import { NextResponse } from "next/server";
import { redis } from "@/lib/redis";
import { cookies } from "next/headers";

export async function GET(req: Request) {
  try {
    const cookieStore = await cookies();
    const userId = cookieStore.get("userId")?.value;

    if (!userId) {
      return NextResponse.json(
        { error: "Uživatel není přihlášen" },
        { status: 401 }
      );
    }

    // Načíst všechny taskId pro uživatele
    const taskIds = await redis.lrange(`user:${userId}:tasks`, 0, -1);

    if (!taskIds || taskIds.length === 0) {
      return NextResponse.json({
        tasks: [],
      });
    }

    // Načíst detaily všech tasks
    const tasks = [];
    for (const taskId of taskIds) {
      const task = await redis.hgetall(`task:${taskId}`);
      if (task && Object.keys(task).length > 0) {
        tasks.push({
          id: taskId,
          ...task,
        });
      }
    }

    return NextResponse.json({
      tasks,
    });
  } catch (err) {
    console.error("Error fetching tasks:", err);
    return NextResponse.json(
      { error: "Server error" },
      { status: 500 }
    );
  }
}
