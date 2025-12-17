"use client";
import { useRouter } from "next/navigation";

export default function ExitButton() {
  const router = useRouter();

  async function handleLogout() {
    try {
      // Zavolat endpoint na logout (odstraní cookies)
      const response = await fetch("/api/logOut", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
      });

      if (response.ok) {
        // Přesměrovat na home page
        router.push("/");
      }
    } catch (err) {
      console.error("Logout error:", err);
    }
  }

  return (
    <button onClick={handleLogout} className="btn-danger">
      Odhlásit se
    </button>
  );
}
