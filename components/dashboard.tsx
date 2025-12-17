"use client";
import { useEffect, useState } from "react";

interface Task {
  id: string;
  title: string;
  timeTill: string;
  completed: string;
  createdAt: string;
}

interface TasksProps {
  refreshTrigger?: number;
}

export default function Tasks({ refreshTrigger }: TasksProps) {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    fetchTasks();
  }, [refreshTrigger]);

  // Načíst tasky při prvním načtení komponenty
  useEffect(() => {
    fetchTasks();
  }, []);

  async function fetchTasks() {
    setLoading(true);
    setError("");

    try {
      const response = await fetch("/api/getTasks", {
        method: "GET",
        headers: { "Content-Type": "application/json" },
      });

      if (!response.ok) {
        const data = await response.json();
        setError(data.error || "Chyba při načítání tasků");
        setTasks([]);
        return;
      }

      const data = await response.json();
      setTasks(data.tasks || []);
    } catch (err) {
      setError("Chyba serveru");
      setTasks([]);
    } finally {
      setLoading(false);
    }
  }

  if (loading) {
    return <p>Načítám tasky...</p>;
  }

  if (error) {
    return <p style={{ color: "red" }}>{error}</p>;
  }

  if (tasks.length === 0) {
    return <p>Zatím nemáš žádné tasky. Přidej si nějaký!</p>;
  }

  return (
    <div>
      <h2>Tvé tasky ({tasks.length})</h2>
      <ul style={{ listStyle: "none", padding: 0 }}>
        {tasks.map((task) => (
          <li
            key={task.id}
            style={{
              padding: "10px",
              marginBottom: "10px",
              border: "1px solid #ddd",
              borderRadius: "4px",
              backgroundColor: task.completed === "true" ? "#e8f5e9" : "#fff",
            }}
          >
            <div>
              <strong>{task.title}</strong>
              {task.completed === "true" && (
                <span style={{ marginLeft: "10px", color: "green" }}>
                  (✓ hotovo)
                </span>
              )}
            </div>
            <small style={{ color: "#666" }}>
              Termín: {new Date(task.timeTill).toLocaleString("cs-CZ")}
            </small>
          </li>
        ))}
      </ul>
    </div>
  );
}
