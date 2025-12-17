import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import DashboardClient from "@/components/dashboardClient";

export default async function Dashboard() {
  const cookieStore = await cookies();
  const userId = cookieStore.get("userId")?.value;
  const userName = cookieStore.get("userName")?.value;

  // Pokud uživatel není přihlášen, přesměruj na home
  if (!userId) {
    redirect("/");
  }

  return <DashboardClient userName={userName || "Uživatel"} />;
}
