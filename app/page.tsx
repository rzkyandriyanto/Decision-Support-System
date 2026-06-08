import { supabase } from "@/lib/supabase";
import Dashboard from "@/components/Dashboard";

export const dynamic = 'force-dynamic';

export default async function Page() {
  // Fetch students from Supabase
  const { data: students, error } = await supabase
    .from("students")
    .select("*")
    .order("last_updated", { ascending: false });

  if (error) {
    console.error("Error fetching students:", error);
  }

  return <Dashboard initialStudents={students || []} />;
}
