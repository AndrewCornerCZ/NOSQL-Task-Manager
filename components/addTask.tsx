"use client";
import { useState } from "react";

interface AddTaskProps {
  onTaskAdded?: () => void;
}

export default function AddTask({ onTaskAdded }: AddTaskProps) {
  const [title, setTitle] = useState("");
  const [timeTill, setTimeTill] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    setSuccess("");

    try {
      const response = await fetch("/api/addTask", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ title, timeTill }),
      });

      if (!response.ok) {
        const data = await response.json();
        setError(data.error || "Přidání tasku selhalo");
        return;
      }

      setTitle("");
      setTimeTill("");
      setSuccess("Task úspěšně vytvořen!");

      // Zavolat callback
      if (onTaskAdded) {
        onTaskAdded();
      }

      // Skrýt success zprávu po 2 sekundách
      setTimeout(() => setSuccess(""), 2000);
    } catch (err) {
      setError("Chyba serveru");
    }
  }

  return (
    <div className="card">
      <h2>Přidat nový task</h2>
      <form onSubmit={submit}>
        <input
          type="text"
          placeholder="Název tasku"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          required
        />
        <input
          type="datetime-local"
          placeholder="Termín"
          value={timeTill}
          onChange={(e) => setTimeTill(e.target.value)}
          required
        />
        <button type="submit" className="btn-success">
          Přidat task
        </button>
      </form>
      {error && <p className="error">{error}</p>}
      {success && <p className="success">{success}</p>}
    </div>
  );
}
