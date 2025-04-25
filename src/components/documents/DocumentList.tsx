
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { documents } from "@/data/mockData";
import { format } from "date-fns";
import { FileText } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { universities } from "@/data/mockData";

export function DocumentList() {
  // Helper to find university name
  const getUniversityName = (universityId?: string) => {
    if (!universityId) return "General";
    const university = universities.find(u => u.id === universityId);
    return university ? university.name : "Unknown University";
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>My Documents</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {documents.map(doc => (
            <div key={doc.id} className="flex items-center space-x-4 p-3 rounded-md border hover:bg-accent/10 transition-colors">
              <div className="bg-muted p-2 rounded-md">
                <FileText className="h-6 w-6" />
              </div>
              <div className="flex-1">
                <div className="font-medium">{doc.name}</div>
                <div className="text-xs text-muted-foreground">
                  {getUniversityName(doc.universityId)} • Last updated: {format(new Date(doc.updatedAt), "MMM d, yyyy")}
                </div>
              </div>
              <div className="flex items-center space-x-2">
                <Badge variant="outline">v{doc.version}</Badge>
                <Badge>{doc.type.toUpperCase()}</Badge>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
