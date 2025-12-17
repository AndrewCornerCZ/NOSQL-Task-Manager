"use client";
import { useState } from "react";
import AddTask from "@/components/addTask";
import Tasks from "@/components/dashboard";
import ExitButton from "@/components/exitButtun";

interface DashboardClientProps {
  userName: string;
}

export default function DashboardClient({ userName }: DashboardClientProps) {
  const [refreshTrigger, setRefreshTrigger] = useState(0);

  function handleRefresh() {
    setRefreshTrigger((prev) => prev + 1);
  }

  return (
    <main>
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          marginBottom: "20px",
        }}
      >
        <div>
          <h1>Task Manager Dashboard</h1>
          <p style={{ margin: "5px 0", color: "#666" }}>
            Přihlášen jako: <strong>{userName}</strong>
          </p>
        </div>
        <div style={{ display: "flex", gap: "10px" }}>
          <button
            onClick={handleRefresh}
            className="btn-primary"
            title="Refreshnout data"
          >
            🔄 Refresh
          </button>
          <ExitButton />
        </div>
      </div>
      <AddTask />
      <Tasks refreshTrigger={refreshTrigger} />
    </main>
  );
}
