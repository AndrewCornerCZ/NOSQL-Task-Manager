"use client";
import { useState } from "react";
import AddTask from "@/components/addTask";
import Tasks from "@/components/dashboard";
import ExitButton from "@/components/exitButtun";

export default function Dashboard() {
  const [refreshTrigger, setRefreshTrigger] = useState(0);

  function handleTaskAdded() {
    setRefreshTrigger((prev) => prev + 1);
  }

  return (
    <main style={{ padding: "20px", maxWidth: "800px", margin: "0 auto" }}>
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          marginBottom: "20px",
        }}
      >
        <h1>Task Manager Dashboard</h1>
        <ExitButton />
      </div>
      <AddTask onTaskAdded={handleTaskAdded} />
      <Tasks refreshTrigger={refreshTrigger} />
    </main>
  );
}
