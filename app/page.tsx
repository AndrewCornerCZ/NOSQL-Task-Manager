import SignUp from "@/components/signUp";
import LogIn from "@/components/logIn";

export default function Home() {
  return (
    <main style={{ padding: "20px" }}>
      <h1>Task Manager</h1>

      <div style={{ display: "flex", gap: "20px", marginTop: "20px" }}>
        <div>
          <h2>Registrace</h2>
          <SignUp />
        </div>

        <div>
          <h2>Přihlášení</h2>
          <LogIn />
        </div>
      </div>
    </main>
  );
}
