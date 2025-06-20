
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { universities } from "@/data/mockData";
import { format } from "date-fns";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Link } from "react-router-dom";
import { Search, Filter, Plus, ArrowUpDown } from "lucide-react";
import { useState, useMemo } from "react";

export function UniversityTable() {
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [tagFilter, setTagFilter] = useState("all");
  const [locationFilter, setLocationFilter] = useState("all");
  const [sortBy, setSortBy] = useState("name");
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("asc");

  const filteredAndSortedUniversities = useMemo(() => {
    const filtered = universities.filter(university => {
      const matchesSearch = university.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           university.programName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           university.location.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesStatus = statusFilter === "all" || university.status === statusFilter;
      const matchesTag = tagFilter === "all" || university.tag === tagFilter;
      const matchesLocation = locationFilter === "all" || university.location.toLowerCase().includes(locationFilter.toLowerCase());
      
      return matchesSearch && matchesStatus && matchesTag && matchesLocation;
    });

    return filtered.sort((a, b) => {
      let aValue: string | number | Date, bValue: string | number | Date;
      
      switch (sortBy) {
        case "name":
          aValue = a.name.toLowerCase();
          bValue = b.name.toLowerCase();
          break;
        case "deadline":
          aValue = new Date(a.deadline);
          bValue = new Date(b.deadline);
          break;
        case "location":
          aValue = a.location.toLowerCase();
          bValue = b.location.toLowerCase();
          break;
        case "status":
          aValue = a.status;
          bValue = b.status;
          break;
        default:
          aValue = a.name.toLowerCase();
          bValue = b.name.toLowerCase();
      }
      
      if (aValue < bValue) return sortOrder === "asc" ? -1 : 1;
      if (aValue > bValue) return sortOrder === "asc" ? 1 : -1;
      return 0;
    });
  }, [searchTerm, statusFilter, tagFilter, locationFilter, sortBy, sortOrder]);

  const handleSort = (column: string) => {
    if (sortBy === column) {
      setSortOrder(sortOrder === "asc" ? "desc" : "asc");
    } else {
      setSortBy(column);
      setSortOrder("asc");
    }
  };

  const uniqueLocations = [...new Set(universities.map(u => u.location))];

  return (
    <div className="space-y-4">
      {/* Search and Filter Controls */}
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div className="flex flex-1 items-center space-x-2">
          <div className="relative flex-1 max-w-sm">
            <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search universities, programs, locations..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-8"
            />
          </div>
          <Button variant="outline" size="icon">
            <Filter className="h-4 w-4" />
          </Button>
        </div>
        <Button className="flex items-center gap-2">
          <Plus className="h-4 w-4" />
          Add University
        </Button>
      </div>

      {/* Filter Row */}
      <div className="flex flex-wrap gap-2">
        <Select value={statusFilter} onValueChange={setStatusFilter}>
          <SelectTrigger className="w-[140px]">
            <SelectValue placeholder="Status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Status</SelectItem>
            <SelectItem value="researching">Researching</SelectItem>
            <SelectItem value="applied">Applied</SelectItem>
            <SelectItem value="admitted">Admitted</SelectItem>
            <SelectItem value="rejected">Rejected</SelectItem>
            <SelectItem value="pending">Pending</SelectItem>
          </SelectContent>
        </Select>

        <Select value={tagFilter} onValueChange={setTagFilter}>
          <SelectTrigger className="w-[120px]">
            <SelectValue placeholder="Tag" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Tags</SelectItem>
            <SelectItem value="reach">Reach</SelectItem>
            <SelectItem value="target">Target</SelectItem>
            <SelectItem value="safety">Safety</SelectItem>
          </SelectContent>
        </Select>

        <Select value={locationFilter} onValueChange={setLocationFilter}>
          <SelectTrigger className="w-[160px]">
            <SelectValue placeholder="Location" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Locations</SelectItem>
            {uniqueLocations.map(location => (
              <SelectItem key={location} value={location.toLowerCase()}>{location}</SelectItem>
            ))}
          </SelectContent>
        </Select>

        {(searchTerm || statusFilter !== "all" || tagFilter !== "all" || locationFilter !== "all") && (
          <Button
            variant="outline"
            onClick={() => {
              setSearchTerm("");
              setStatusFilter("all");
              setTagFilter("all");
              setLocationFilter("all");
            }}
          >
            Clear Filters
          </Button>
        )}
      </div>

      {/* Results Count */}
      <div className="text-sm text-muted-foreground">
        Showing {filteredAndSortedUniversities.length} of {universities.length} universities
      </div>

      {/* Table */}
      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead 
                className="cursor-pointer hover:bg-muted/50" 
                onClick={() => handleSort("name")}
              >
                <div className="flex items-center space-x-1">
                  <span>University</span>
                  <ArrowUpDown className="h-4 w-4" />
                </div>
              </TableHead>
              <TableHead>Program</TableHead>
              <TableHead 
                className="cursor-pointer hover:bg-muted/50" 
                onClick={() => handleSort("location")}
              >
                <div className="flex items-center space-x-1">
                  <span>Location</span>
                  <ArrowUpDown className="h-4 w-4" />
                </div>
              </TableHead>
              <TableHead 
                className="cursor-pointer hover:bg-muted/50" 
                onClick={() => handleSort("deadline")}
              >
                <div className="flex items-center space-x-1">
                  <span>Deadline</span>
                  <ArrowUpDown className="h-4 w-4" />
                </div>
              </TableHead>
              <TableHead 
                className="cursor-pointer hover:bg-muted/50" 
                onClick={() => handleSort("status")}
              >
                <div className="flex items-center space-x-1">
                  <span>Status</span>
                  <ArrowUpDown className="h-4 w-4" />
                </div>
              </TableHead>
              <TableHead>Tag</TableHead>
              <TableHead>Action</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredAndSortedUniversities.length === 0 ? (
              <TableRow>
                <TableCell colSpan={7} className="text-center py-8 text-muted-foreground">
                  No universities found matching your criteria.
                </TableCell>
              </TableRow>
            ) : (
              filteredAndSortedUniversities.map(university => (
                <TableRow key={university.id} className="hover:bg-muted/50">
                  <TableCell className="font-medium">
                    <div>
                      <div className="font-semibold">{university.name}</div>
                      <div className="text-sm text-muted-foreground">{university.url && (
                        <a href={university.url} target="_blank" rel="noopener noreferrer" className="hover:underline">
                          Visit Website
                        </a>
                      )}</div>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="font-medium">{university.programName}</div>
                    {university.applicationFee && (
                      <div className="text-sm text-muted-foreground">${university.applicationFee} fee</div>
                    )}
                  </TableCell>
                  <TableCell>{university.location}</TableCell>
                  <TableCell>
                    <div className="font-medium">{format(new Date(university.deadline), "MMM d, yyyy")}</div>
                    <div className="text-sm text-muted-foreground">
                      {Math.ceil((new Date(university.deadline).getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24))} days left
                    </div>
                  </TableCell>
                  <TableCell>
                    <Badge 
                      variant="secondary" 
                      className={`status-badge status-${university.status}`}
                    >
                      {university.status.charAt(0).toUpperCase() + university.status.slice(1)}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <Badge 
                      variant="outline" 
                      className={`tag-${university.tag}`}
                    >
                      {university.tag.charAt(0).toUpperCase() + university.tag.slice(1)}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <div className="flex space-x-2">
                      <Button variant="outline" size="sm" asChild>
                        <Link to={`/universities/${university.id}`}>View</Link>
                      </Button>
                      <Button variant="ghost" size="sm">
                        Edit
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
