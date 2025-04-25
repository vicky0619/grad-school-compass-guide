
import { Card } from "@/components/ui/card";
import { Calendar } from "@/components/ui/calendar";
import { deadlines } from "@/data/mockData";
import { cn } from "@/lib/utils";
import { useState } from "react";
import { format } from "date-fns";
import { universities } from "@/data/mockData";

export default function CalendarPage() {
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(new Date());
  
  // Helper to find university name
  const getUniversityName = (universityId: string) => {
    const university = universities.find(u => u.id === universityId);
    return university ? university.name : "Unknown";
  };

  // Create a map of dates with deadlines
  const deadlineDates = deadlines.reduce<Record<string, { id: string; title: string; university: string; type: string }[]>>((acc, deadline) => {
    const date = new Date(deadline.date).toISOString().split('T')[0];
    if (!acc[date]) {
      acc[date] = [];
    }
    acc[date].push({
      id: deadline.id,
      title: deadline.title,
      university: getUniversityName(deadline.universityId),
      type: deadline.type
    });
    return acc;
  }, {});
  
  const selectedDateStr = selectedDate ? selectedDate.toISOString().split('T')[0] : '';
  const selectedDateDeadlines = selectedDateStr ? deadlineDates[selectedDateStr] || [] : [];

  return (
    <div className="space-y-6">
      <h2 className="text-3xl font-bold tracking-tight">Calendar</h2>
      
      <div className="grid gap-6 md:grid-cols-2">
        <Card className="p-4">
          <Calendar
            mode="single"
            selected={selectedDate}
            onSelect={setSelectedDate}
            className="rounded-md border"
            modifiers={{
              deadline: (date) => {
                const dateStr = date.toISOString().split('T')[0];
                return !!deadlineDates[dateStr];
              }
            }}
            modifiersStyles={{
              deadline: { 
                fontWeight: 'bold',
                backgroundColor: 'var(--academic-accent)',
                color: 'white',
                borderRadius: '50%'
              }
            }}
            components={{
              DayContent: ({ date }) => {
                const dateStr = date.toISOString().split('T')[0];
                const hasDeadlines = !!deadlineDates[dateStr];
                
                return (
                  <div className={cn("relative w-full h-full flex items-center justify-center")}>
                    {date.getDate()}
                    {hasDeadlines && <div className="absolute -bottom-1 left-1/2 transform -translate-x-1/2 w-1 h-1 bg-primary rounded-full"></div>}
                  </div>
                );
              }
            }}
          />
        </Card>
        
        <Card className="p-4">
          <h3 className="text-lg font-semibold mb-4">
            {selectedDate ? format(selectedDate, "MMMM d, yyyy") : "Select a date"}
          </h3>
          
          {selectedDateDeadlines.length > 0 ? (
            <div className="space-y-4">
              {selectedDateDeadlines.map(deadline => (
                <div key={deadline.id} className="p-3 border rounded-md">
                  <div className="font-medium">{deadline.title}</div>
                  <div className="text-sm text-muted-foreground">{deadline.university}</div>
                  <div className="mt-2">
                    <span className="inline-flex items-center rounded-md bg-blue-50 px-2 py-1 text-xs font-medium text-blue-700 ring-1 ring-inset ring-blue-700/10">
                      {deadline.type.charAt(0).toUpperCase() + deadline.type.slice(1)}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-10 text-muted-foreground">
              No deadlines for this date
            </div>
          )}
        </Card>
      </div>
    </div>
  );
}
