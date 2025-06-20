
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { format } from "date-fns";
import { Checkbox } from "@/components/ui/checkbox";
import { Button } from "@/components/ui/button";
import { useDeadlines, useUpdateDeadline } from "@/hooks/useDeadlines";
import { Calendar, Edit } from "lucide-react";
import { EditDeadlineDialog } from "@/components/forms/EditDeadlineDialog";
import { useState } from "react";
import { Database } from "@/integrations/supabase/types";

type Deadline = Database['public']['Tables']['deadlines']['Row'] & {
  universities?: { name: string; program_name: string };
};

export function DeadlineList() {
  const { data: deadlines = [], isLoading } = useDeadlines();
  const updateDeadline = useUpdateDeadline();
  const [selectedDeadline, setSelectedDeadline] = useState<Deadline | null>(null);
  const [showEditDialog, setShowEditDialog] = useState(false);
  
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

  const handleEditDeadline = (deadline: Deadline) => {
    setSelectedDeadline(deadline);
    setShowEditDialog(true);
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
    <>
      <div className="space-y-6">
        {/* Header */}
        <div>
          <h2 className="text-2xl font-semibold text-foreground">Deadlines</h2>
          <p className="text-sm text-muted-foreground mt-1">
            Track important dates and application deadlines
          </p>
        </div>

        {sortedDeadlines.length === 0 ? (
          <div className="text-center py-16 text-muted-foreground bg-card rounded-xl border border-border">
            <div className="text-4xl mb-4">📅</div>
            <p className="text-lg font-medium">No deadlines yet</p>
            <p className="text-sm">Add your first deadline to stay on track</p>
          </div>
        ) : (
          <div className="space-y-3">
            {sortedDeadlines.map(deadline => (
              <div key={deadline.id} className="bg-card border border-border rounded-xl p-4 hover:shadow-sm transition-all duration-200">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-4">
                    <Checkbox 
                      checked={deadline.completed}
                      onCheckedChange={() => toggleDeadline(deadline.id, deadline.completed)}
                      className="scale-110"
                    />
                    <div className={`space-y-1 ${deadline.completed ? 'opacity-50' : ''}`}>
                      <div className="flex items-center space-x-3">
                        <h3 className={`font-medium ${deadline.completed ? 'line-through text-muted-foreground' : 'text-foreground'}`}>
                          {deadline.title}
                        </h3>
                        <Badge className={`
                          ${deadline.type === 'application' ? 'bg-blue-100 text-blue-700 border-blue-200' : ''}
                          ${deadline.type === 'interview' ? 'bg-purple-100 text-purple-700 border-purple-200' : ''}
                          ${deadline.type === 'decision' ? 'bg-green-100 text-green-700 border-green-200' : ''}
                          ${deadline.type === 'document' ? 'bg-orange-100 text-orange-700 border-orange-200' : ''}
                          ${deadline.type === 'test' ? 'bg-pink-100 text-pink-700 border-pink-200' : ''}
                          ${deadline.type === 'other' ? 'bg-gray-100 text-gray-700 border-gray-200' : ''}
                        `}>
                          {deadline.type.charAt(0).toUpperCase() + deadline.type.slice(1)}
                        </Badge>
                      </div>
                      <div className="flex items-center space-x-4 text-sm text-muted-foreground">
                        <span>🏫 {deadline.universities?.name || "Unknown University"}</span>
                        <span>📅 {format(new Date(deadline.date), "MMM d, yyyy")}</span>
                      </div>
                      {deadline.description && (
                        <p className="text-sm text-muted-foreground">{deadline.description}</p>
                      )}
                    </div>
                  </div>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => handleEditDeadline(deadline)}
                    className="flex items-center gap-1"
                  >
                    <Edit className="h-4 w-4" />
                    Edit
                  </Button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
      
      {/* Edit Dialog */}
      {selectedDeadline && (
        <EditDeadlineDialog
          deadline={selectedDeadline}
          open={showEditDialog}
          onOpenChange={setShowEditDialog}
        />
      )}
    </>
  );
}
