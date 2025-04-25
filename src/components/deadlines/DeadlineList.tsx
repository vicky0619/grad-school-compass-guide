
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { deadlines } from "@/data/mockData";
import { universities } from "@/data/mockData";
import { format } from "date-fns";
import { Checkbox } from "@/components/ui/checkbox";
import { useState } from "react";

export function DeadlineList() {
  const [completedDeadlines, setCompletedDeadlines] = useState<string[]>([]);
  
  // Helper to find university name
  const getUniversityName = (universityId: string) => {
    const university = universities.find(u => u.id === universityId);
    return university ? university.name : "Unknown University";
  };
  
  // Sort deadlines by date
  const sortedDeadlines = [...deadlines].sort((a, b) => 
    new Date(a.date).getTime() - new Date(b.date).getTime()
  );
  
  // Toggle deadline completion
  const toggleDeadline = (id: string) => {
    setCompletedDeadlines(prev => {
      if (prev.includes(id)) {
        return prev.filter(deadlineId => deadlineId !== id);
      } else {
        return [...prev, id];
      }
    });
  };
  
  return (
    <Card>
      <CardHeader>
        <CardTitle>All Deadlines</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {sortedDeadlines.map(deadline => (
            <div key={deadline.id} className="flex items-center space-x-4">
              <Checkbox 
                id={`deadline-${deadline.id}`} 
                checked={completedDeadlines.includes(deadline.id)}
                onCheckedChange={() => toggleDeadline(deadline.id)}
              />
              <div className={`flex-1 ${completedDeadlines.includes(deadline.id) ? 'line-through text-muted-foreground' : ''}`}>
                <div className="text-sm font-medium">{deadline.title}</div>
                <div className="text-xs text-muted-foreground">{getUniversityName(deadline.universityId)}</div>
              </div>
              <div className="text-sm">
                {format(new Date(deadline.date), "MMM d, yyyy")}
              </div>
              <div className="text-xs px-2 py-1 rounded-full bg-muted">
                {deadline.type.charAt(0).toUpperCase() + deadline.type.slice(1)}
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
