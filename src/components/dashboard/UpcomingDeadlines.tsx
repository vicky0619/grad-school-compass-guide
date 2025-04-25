
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { deadlines } from "@/data/mockData";
import { universities } from "@/data/mockData";
import { format } from "date-fns";

export function UpcomingDeadlines() {
  // Helper to find university name
  const getUniversityName = (universityId: string) => {
    const university = universities.find(u => u.id === universityId);
    return university ? university.name : "Unknown University";
  };
  
  // Get current date
  const now = new Date();
  
  // Filter for upcoming deadlines (within the next 60 days) and sort
  const upcomingDeadlines = deadlines
    .filter(deadline => {
      const deadlineDate = new Date(deadline.date);
      const daysDifference = Math.ceil((deadlineDate.getTime() - now.getTime()) / (1000 * 60 * 60 * 24));
      return daysDifference > 0 && daysDifference <= 60 && !deadline.completed;
    })
    .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime())
    .slice(0, 5);
  
  return (
    <Card>
      <CardHeader className="pb-2">
        <CardTitle>Upcoming Deadlines</CardTitle>
      </CardHeader>
      <CardContent>
        {upcomingDeadlines.length > 0 ? (
          <div className="space-y-4">
            {upcomingDeadlines.map((deadline) => (
              <div key={deadline.id} className="flex justify-between items-center">
                <div>
                  <div className="text-sm font-medium">{deadline.title}</div>
                  <div className="text-xs text-muted-foreground">{getUniversityName(deadline.universityId)}</div>
                </div>
                <div className="text-sm font-medium">
                  {format(new Date(deadline.date), "MMM d, yyyy")}
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-4 text-muted-foreground">
            No upcoming deadlines
          </div>
        )}
      </CardContent>
    </Card>
  );
}
