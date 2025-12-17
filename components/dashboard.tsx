"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

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
  const [selectedTaskId, setSelectedTaskId] = useState<string | null>(null);
  const [selectedTaskTitle, setSelectedTaskTitle] = useState<string>("");

  const Router = useRouter();
  useEffect(() => {
    fetchTasks();
  }, [refreshTrigger]);

  // Načíst tasky při prvním načtení komponenty
  useEffect(() => {
    fetchTasks();
  }, []);

  // Auto-refresh stránky každých 30 sekund nebo když se změní deadline
  useEffect(() => {
    if (tasks.length === 0) return;

    const interval = setInterval(() => {
      // Zkontroluj, jestli nějaký task přešel deadline
      const hasOverdueTask = tasks.some(
        (task) => task.completed !== "true" && isOverdue(task.timeTill)
      );

      // Pokud je overdue task, refreshni stránku
      if (hasOverdueTask) {
        Router.refresh();
      }
    }, 30000); // Každých 30 sekund

    return () => clearInterval(interval);
  }, [tasks, Router]);

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

  async function handleCompleteTask() {
    if (!selectedTaskId) {
      fetchTasks();
      return;
    }

    try {
      const response = await fetch("/api/completeTask", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ taskId: selectedTaskId }),
      });

      if (!response.ok) {
        alert("Chyba při označení tasku");
        return;
      }

      // Zavřít modal a znovu načíst tasky
      setSelectedTaskId(null);
      setTimeout(() => {
        fetchTasks();
      }, 500);
    } catch (err) {
      alert("Chyba serveru");
    }
  }

  function isOverdue(timeTill: string): boolean {
    return new Date(timeTill) < new Date();
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

  // Oddělit hotové a nehotové tasky
  const incompleteTasks = tasks.filter((task) => task.completed !== "true");
  const completedTasks = tasks.filter((task) => task.completed === "true");

  return (
    <div>
      <h2>Tvé tasky ({tasks.length})</h2>

      {/* Nehotové tasky */}
      {incompleteTasks.length > 0 && (
        <div>
          <h3>K splnění ({incompleteTasks.length})</h3>
          <ul style={{ listStyle: "none", padding: 0 }}>
            {incompleteTasks.map((task) => (
              <li
                key={task.id}
                style={{
                  padding: "10px",
                  marginBottom: "10px",
                  border: "1px solid #ddd",
                  borderRadius: "4px",
                  backgroundColor: isOverdue(task.timeTill)
                    ? "#ffebee"
                    : "#fff",
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                }}
              >
                <div style={{ flex: 1 }}>
                  <strong>{task.title}</strong>
                  {task.completed === "true" && (
                    <span style={{ marginLeft: "10px", color: "green" }}>
                      (✓ hotovo)
                    </span>
                  )}
                  <div style={{ marginTop: "5px" }}>
                    <small style={{ color: "#666" }}>
                      Termín: {new Date(task.timeTill).toLocaleString("cs-CZ")}
                    </small>
                  </div>
                </div>
                {task.completed !== "true" && (
                  <button
                    onClick={() => {
                      setSelectedTaskId(task.id);
                      setSelectedTaskTitle(task.title);
                    }}
                    style={{
                      padding: "6px 12px",
                      marginLeft: "10px",
                      backgroundColor: "#4CAF50",
                      color: "white",
                      border: "none",
                      borderRadius: "4px",
                      cursor: "pointer",
                    }}
                  >
                    Hotovo
                  </button>
                )}
              </li>
            ))}
          </ul>
        </div>
      )}

      {/* Hotové tasky */}
      {completedTasks.length > 0 && (
        <div style={{ marginTop: "20px" }}>
          <h3>Splněné ({completedTasks.length})</h3>
          <ul style={{ listStyle: "none", padding: 0 }}>
            {completedTasks.map((task) => (
              <li
                key={task.id}
                style={{
                  padding: "10px",
                  marginBottom: "10px",
                  border: "1px solid #ddd",
                  borderRadius: "4px",
                  backgroundColor: "#e8f5e9",
                }}
              >
                <div>
                  <strong>{task.title}</strong>
                  <span style={{ marginLeft: "10px", color: "green" }}>
                    (✓ hotovo)
                  </span>
                </div>
                <small style={{ color: "#666" }}>
                  Termín: {new Date(task.timeTill).toLocaleString("cs-CZ")}
                </small>
              </li>
            ))}
          </ul>
        </div>
      )}

      {/* Modal */}
      {selectedTaskId && (
        <div
          style={{
            position: "fixed",
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            backgroundColor: "rgba(0, 0, 0, 0.5)",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            zIndex: 1000,
          }}
        >
          <div
            style={{
              backgroundColor: "white",
              padding: "30px",
              borderRadius: "8px",
              boxShadow: "0 4px 6px rgba(0, 0, 0, 0.1)",
              maxWidth: "400px",
              textAlign: "center",
            }}
          >
            <h2 style={{ marginBottom: "10px" }}>Potvrdit</h2>
            <p style={{ marginBottom: "20px" }}>
              Chceš označit task "<strong>{selectedTaskTitle}</strong>" jako
              hotový?
            </p>
            <div
              style={{ display: "flex", gap: "10px", justifyContent: "center" }}
            >
              <button
                onClick={handleCompleteTask}
                style={{
                  padding: "10px 20px",
                  backgroundColor: "#4CAF50",
                  color: "white",
                  border: "none",
                  borderRadius: "4px",
                  cursor: "pointer",
                  fontSize: "16px",
                }}
              >
                Ano
              </button>
              <button
                onClick={() => setSelectedTaskId(null)}
                style={{
                  padding: "10px 20px",
                  backgroundColor: "#f44336",
                  color: "white",
                  border: "none",
                  borderRadius: "4px",
                  cursor: "pointer",
                  fontSize: "16px",
                }}
              >
                Ne
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
