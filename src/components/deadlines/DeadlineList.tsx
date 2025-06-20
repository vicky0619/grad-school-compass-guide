
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { format } from "date-fns";
import { Checkbox } from "@/components/ui/checkbox";
import { useDeadlines, useUpdateDeadline } from "@/hooks/useDeadlines";
import { Calendar } from "lucide-react";

export function DeadlineList() {
  const { data: deadlines = [], isLoading } = useDeadlines();
  const updateDeadline = useUpdateDeadline();
  
  // Sort deadlines by date
  const sortedDeadlines = [...deadlines].sort((a, b) => 
    new Date(a.date).getTime() - new Date(b.date).getTime()
  );
  
  // Toggle deadline completion
  const toggleDeadline = async (id: string, currentCompleted: boolean) => {
    try {
      await updateDeadline.mutateAsync({
        id,
        updates: { completed: !currentCompleted }
      });
    } catch (error) {
      console.error("Failed to update deadline:", error);
    }
  };

  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>All Deadlines</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-center p-8">
            <div className="text-center">
              <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-primary mx-auto"></div>
              <p className="mt-2 text-sm text-muted-foreground">Loading deadlines...</p>
            </div>
          </div>
        </CardContent>
      </Card>
    );
  }
  
  return (
    <Card>
      <CardHeader>
        <CardTitle>All Deadlines</CardTitle>
      </CardHeader>
      <CardContent>
        {sortedDeadlines.length === 0 ? (
          <div className="text-center py-8 text-muted-foreground">
            <Calendar className="h-12 w-12 mx-auto mb-4 opacity-50" />
            <p>No deadlines added yet</p>
            <p className="text-sm">Add your first deadline to get started</p>
          </div>
        ) : (
          <div className="space-y-4">
            {sortedDeadlines.map(deadline => (
              <div key={deadline.id} className="flex items-center space-x-4">
                <Checkbox 
                  id={`deadline-${deadline.id}`} 
                  checked={deadline.completed}
                  onCheckedChange={() => toggleDeadline(deadline.id, deadline.completed)}
                />
                <div className={`flex-1 ${deadline.completed ? 'line-through text-muted-foreground' : ''}`}>
                  <div className="text-sm font-medium">{deadline.title}</div>
                  <div className="text-xs text-muted-foreground">{deadline.universities?.name || "Unknown University"}</div>
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
        )}
      </CardContent>
    </Card>
  );
}
