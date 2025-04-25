
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { StatusCount } from "@/types";
import { universities } from "@/data/mockData";

export function StatusCard() {
  // Calculate status counts
  const calculateStatusCounts = (): StatusCount => {
    const counts: StatusCount = {
      researching: 0,
      applied: 0,
      admitted: 0,
      rejected: 0,
      pending: 0,
      total: universities.length
    };
    
    universities.forEach(university => {
      if (counts[university.status]) {
        counts[university.status]++;
      }
    });
    
    return counts;
  };
  
  const counts = calculateStatusCounts();
  
  return (
    <Card>
      <CardHeader className="pb-2">
        <CardTitle>Application Status</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-3 gap-4">
          <div className="flex flex-col items-center">
            <div className="text-3xl font-bold text-status-researching">{counts.researching}</div>
            <div className="text-sm text-muted-foreground">Researching</div>
          </div>
          <div className="flex flex-col items-center">
            <div className="text-3xl font-bold text-status-applied">{counts.applied}</div>
            <div className="text-sm text-muted-foreground">Applied</div>
          </div>
          <div className="flex flex-col items-center">
            <div className="text-3xl font-bold text-status-pending">{counts.pending}</div>
            <div className="text-sm text-muted-foreground">Pending</div>
          </div>
          <div className="flex flex-col items-center">
            <div className="text-3xl font-bold text-status-admitted">{counts.admitted}</div>
            <div className="text-sm text-muted-foreground">Admitted</div>
          </div>
          <div className="flex flex-col items-center">
            <div className="text-3xl font-bold text-status-rejected">{counts.rejected}</div>
            <div className="text-sm text-muted-foreground">Rejected</div>
          </div>
          <div className="flex flex-col items-center">
            <div className="text-3xl font-bold">{counts.total}</div>
            <div className="text-sm text-muted-foreground">Total</div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
