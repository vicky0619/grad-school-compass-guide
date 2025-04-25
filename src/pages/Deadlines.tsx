
import { DeadlineCalendar } from "@/components/deadlines/DeadlineCalendar";
import { DeadlineList } from "@/components/deadlines/DeadlineList";

export default function Deadlines() {
  return (
    <div className="space-y-6">
      <h2 className="text-3xl font-bold tracking-tight">Deadlines</h2>
      
      <div className="grid gap-6 md:grid-cols-2">
        <DeadlineCalendar />
        <DeadlineList />
      </div>
    </div>
  );
}
