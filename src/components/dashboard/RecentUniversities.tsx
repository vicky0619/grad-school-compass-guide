
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { universities } from "@/data/mockData";
import { format } from "date-fns";

export function RecentUniversities() {
  // Sort universities by most recently updated
  const recentUniversities = [...universities]
    .sort((a, b) => new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime())
    .slice(0, 5);
  
  return (
    <Card>
      <CardHeader className="pb-2">
        <CardTitle>Recent Universities</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {recentUniversities.map(university => (
            <div key={university.id} className="flex justify-between items-center">
              <div>
                <div className="text-sm font-medium">{university.name}</div>
                <div className="text-xs text-muted-foreground">{university.programName}</div>
              </div>
              <div className="flex items-center space-x-2">
                <span className={`status-badge status-${university.status}`}>
                  {university.status.charAt(0).toUpperCase() + university.status.slice(1)}
                </span>
                <span className={`tag-${university.tag}`}>
                  {university.tag.charAt(0).toUpperCase() + university.tag.slice(1)}
                </span>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
