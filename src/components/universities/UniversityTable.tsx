
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { universities } from "@/data/mockData";
import { format } from "date-fns";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";

export function UniversityTable() {
  return (
    <div className="rounded-md border">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>University</TableHead>
            <TableHead>Program</TableHead>
            <TableHead>Location</TableHead>
            <TableHead>Deadline</TableHead>
            <TableHead>Status</TableHead>
            <TableHead>Tag</TableHead>
            <TableHead>Action</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {universities.map(university => (
            <TableRow key={university.id}>
              <TableCell className="font-medium">{university.name}</TableCell>
              <TableCell>{university.programName}</TableCell>
              <TableCell>{university.location}</TableCell>
              <TableCell>{format(new Date(university.deadline), "MMM d, yyyy")}</TableCell>
              <TableCell>
                <span className={`status-badge status-${university.status}`}>
                  {university.status.charAt(0).toUpperCase() + university.status.slice(1)}
                </span>
              </TableCell>
              <TableCell>
                <span className={`tag-${university.tag}`}>
                  {university.tag.charAt(0).toUpperCase() + university.tag.slice(1)}
                </span>
              </TableCell>
              <TableCell>
                <Button variant="outline" size="sm" asChild>
                  <Link to={`/universities/${university.id}`}>View</Link>
                </Button>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}
