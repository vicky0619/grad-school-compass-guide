
import { DeadlineCalendar } from "@/components/deadlines/DeadlineCalendar";
import { DeadlineList } from "@/components/deadlines/DeadlineList";
import { ApplicationTimeline } from "@/components/timeline/ApplicationTimeline";
import { AddDeadlineDialog } from "@/components/forms/AddDeadlineDialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Calendar, Clock, TrendingUp } from "lucide-react";

export default function Deadlines() {
  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-3xl font-bold tracking-tight">Deadlines & Timeline</h2>
        <AddDeadlineDialog />
      </div>
      
      <Tabs defaultValue="deadlines" className="space-y-4">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="deadlines" className="flex items-center gap-2">
            <Calendar className="h-4 w-4" />
            Deadlines
          </TabsTrigger>
          <TabsTrigger value="timeline" className="flex items-center gap-2">
            <TrendingUp className="h-4 w-4" />
            Application Timeline
          </TabsTrigger>
        </TabsList>
        
        <TabsContent value="deadlines" className="space-y-4">
          <div className="grid gap-6 md:grid-cols-2">
            <DeadlineCalendar />
            <DeadlineList />
          </div>
        </TabsContent>
        
        <TabsContent value="timeline" className="space-y-4">
          <ApplicationTimeline />
        </TabsContent>
      </Tabs>
    </div>
  );
}
