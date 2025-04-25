
import { Card } from "@/components/ui/card";
import { Calendar } from "@/components/ui/calendar";
import { deadlines } from "@/data/mockData";
import { cn } from "@/lib/utils";
import { universities } from "@/data/mockData";

export function DeadlineCalendar() {
  // Helper to find university name
  const getUniversityName = (universityId: string) => {
    const university = universities.find(u => u.id === universityId);
    return university ? university.name : "Unknown";
  };

  // Create a map of dates with deadlines
  const deadlineDates = deadlines.reduce<Record<string, { title: string; university: string; type: string }[]>>((acc, deadline) => {
    const date = new Date(deadline.date).toISOString().split('T')[0];
    if (!acc[date]) {
      acc[date] = [];
    }
    acc[date].push({
      title: deadline.title,
      university: getUniversityName(deadline.universityId),
      type: deadline.type
    });
    return acc;
  }, {});

  return (
    <Card className="p-4">
      <Calendar
        mode="default"
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
  );
}
