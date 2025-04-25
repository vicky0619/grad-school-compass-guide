
import { StatusCard } from "@/components/dashboard/StatusCard";
import { UpcomingDeadlines } from "@/components/dashboard/UpcomingDeadlines";
import { RecentUniversities } from "@/components/dashboard/RecentUniversities";

export default function Dashboard() {
  return (
    <div className="space-y-6">
      <h2 className="text-3xl font-bold tracking-tight">Dashboard</h2>
      
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        <StatusCard />
        <UpcomingDeadlines />
        <RecentUniversities />
      </div>
      
      <div className="text-sm text-muted-foreground mt-8">
        <p>Welcome to your Grad School Compass! This tool helps you manage all aspects of your Fall 2026 MSCS application process.</p>
        <p className="mt-2">Use the sidebar to navigate between different sections, track your progress, and stay organized.</p>
      </div>
    </div>
  );
}
