
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { format } from "date-fns";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Checkbox } from "@/components/ui/checkbox";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from "@/components/ui/alert-dialog";
import { Search, Filter, Plus, ArrowUpDown, Eye, Edit, Trash2 } from "lucide-react";
import { useState, useMemo } from "react";
import { useUniversities, useDeleteUniversity } from "@/hooks/useUniversities";
import { AddUniversityDialog } from "@/components/forms/AddUniversityDialog";
import { UniversityDetailDialog } from "@/components/forms/UniversityDetailDialog";
import { EditUniversityDialog } from "@/components/forms/EditUniversityDialog";
import { Database } from "@/integrations/supabase/types";
import { toast } from "sonner";

type University = Database['public']['Tables']['universities']['Row'];

export function UniversityTable() {
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [tagFilter, setTagFilter] = useState("all");
  const [locationFilter, setLocationFilter] = useState("all");
  const [sortBy, setSortBy] = useState("name");
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("asc");
  const [selectedUniversity, setSelectedUniversity] = useState<University | null>(null);
  const [showDetailDialog, setShowDetailDialog] = useState(false);
  const [showEditDialog, setShowEditDialog] = useState(false);
  const [selectedUniversities, setSelectedUniversities] = useState<Set<string>>(new Set());
  const [showBulkDeleteDialog, setShowBulkDeleteDialog] = useState(false);

  const { data: universities = [], isLoading } = useUniversities();
  const deleteUniversity = useDeleteUniversity();

  const filteredAndSortedUniversities = useMemo(() => {
    const filtered = universities.filter(university => {
      const matchesSearch = university.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           university.program_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
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
  }, [universities, searchTerm, statusFilter, tagFilter, locationFilter, sortBy, sortOrder]);

  const handleSort = (column: string) => {
    if (sortBy === column) {
      setSortOrder(sortOrder === "asc" ? "desc" : "asc");
    } else {
      setSortBy(column);
      setSortOrder("asc");
    }
  };

  const uniqueLocations = [...new Set(universities.map(u => u.location))];

  const handleViewUniversity = (university: University) => {
    setSelectedUniversity(university);
    setShowDetailDialog(true);
  };

  const handleEditUniversity = (university: University) => {
    setSelectedUniversity(university);
    setShowEditDialog(true);
  };

  const handleSelectUniversity = (universityId: string, checked: boolean) => {
    const newSelected = new Set(selectedUniversities);
    if (checked) {
      newSelected.add(universityId);
    } else {
      newSelected.delete(universityId);
    }
    setSelectedUniversities(newSelected);
  };

  const handleSelectAll = (checked: boolean) => {
    if (checked) {
      setSelectedUniversities(new Set(filteredAndSortedUniversities.map(u => u.id)));
    } else {
      setSelectedUniversities(new Set());
    }
  };

  const handleBulkDelete = async () => {
    try {
      const deletePromises = Array.from(selectedUniversities).map(id => 
        deleteUniversity.mutateAsync(id)
      );
      
      await Promise.all(deletePromises);
      
      toast.success(`Successfully deleted ${selectedUniversities.size} universities`);
      setSelectedUniversities(new Set());
      setShowBulkDeleteDialog(false);
    } catch (error) {
      toast.error("Failed to delete some universities. Please try again.");
      console.error("Bulk delete error:", error);
    }
  };

  if (isLoading) {
    return (
      <div className="space-y-4">
        <div className="flex items-center justify-center p-8">
          <div className="text-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto"></div>
            <p className="mt-2 text-muted-foreground">Loading universities...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col space-y-4 md:flex-row md:items-center md:justify-between md:space-y-0">
        <div>
          <h2 className="text-2xl font-semibold text-foreground">Universities</h2>
          <p className="text-sm text-muted-foreground mt-1">
            Manage your university applications and track progress
          </p>
        </div>
        <AddUniversityDialog />
      </div>

      {/* Search */}
      <div className="relative max-w-sm">
        <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
        <Input
          placeholder="Search universities..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="pl-10 border-0 bg-muted/50"
        />
      </div>

      {/* Bulk Actions Bar */}
      {selectedUniversities.size > 0 && (
        <div className="flex items-center justify-between p-4 bg-blue-50 rounded-xl border border-blue-200">
          <div className="text-sm font-medium text-blue-700">
            {selectedUniversities.size} universities selected
          </div>
          <div className="flex gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setSelectedUniversities(new Set())}
              className="text-blue-600 border-blue-200 hover:bg-blue-50"
            >
              Clear
            </Button>
            <Button
              variant="destructive"
              size="sm"
              onClick={() => setShowBulkDeleteDialog(true)}
              className="flex items-center gap-1"
            >
              <Trash2 className="h-4 w-4" />
              Delete
            </Button>
          </div>
        </div>
      )}

      {/* Quick Filters */}
      {(statusFilter !== "all" || tagFilter !== "all" || locationFilter !== "all") && (
        <div className="flex items-center gap-2 flex-wrap">
          <span className="text-sm text-muted-foreground">Filters:</span>
          {statusFilter !== "all" && (
            <Badge variant="secondary" className="flex items-center gap-1">
              Status: {statusFilter}
              <button onClick={() => setStatusFilter("all")} className="ml-1 hover:bg-muted rounded-full p-0.5">
                ×
              </button>
            </Badge>
          )}
          {tagFilter !== "all" && (
            <Badge variant="secondary" className="flex items-center gap-1">
              Tag: {tagFilter}
              <button onClick={() => setTagFilter("all")} className="ml-1 hover:bg-muted rounded-full p-0.5">
                ×
              </button>
            </Badge>
          )}
          <Button
            variant="ghost"
            size="sm"
            onClick={() => {
              setSearchTerm("");
              setStatusFilter("all");
              setTagFilter("all");
              setLocationFilter("all");
            }}
            className="text-xs"
          >
            Clear all
          </Button>
        </div>
      )}

      {/* Clean Cards Layout */}
      <div className="space-y-3">
        {filteredAndSortedUniversities.length === 0 ? (
          <div className="text-center py-12 text-muted-foreground">
            <div className="text-4xl mb-4">🎓</div>
            <p className="text-lg font-medium">No universities found</p>
            <p className="text-sm">Try adjusting your search or filters</p>
          </div>
        ) : (
          filteredAndSortedUniversities.map(university => (
            <div key={university.id} className="bg-card border border-border rounded-xl p-6 hover:shadow-sm transition-all duration-200">
              <div className="flex items-start justify-between">
                <div className="flex items-start space-x-4">
                  <Checkbox
                    checked={selectedUniversities.has(university.id)}
                    onCheckedChange={(checked) => handleSelectUniversity(university.id, !!checked)}
                    className="mt-1"
                  />
                  <div className="space-y-2">
                    <div className="flex items-center space-x-3">
                      <h3 className="font-semibold text-lg text-foreground">{university.name}</h3>
                      <Badge 
                        className={`
                          ${university.status === 'admitted' ? 'bg-green-100 text-green-700 border-green-200' : ''}
                          ${university.status === 'applied' ? 'bg-blue-100 text-blue-700 border-blue-200' : ''}
                          ${university.status === 'researching' ? 'bg-indigo-100 text-indigo-700 border-indigo-200' : ''}
                          ${university.status === 'rejected' ? 'bg-amber-100 text-amber-700 border-amber-200' : ''}
                          ${university.status === 'pending' ? 'bg-violet-100 text-violet-700 border-violet-200' : ''}
                        `}
                      >
                        {university.status.charAt(0).toUpperCase() + university.status.slice(1)}
                      </Badge>
                      <Badge 
                        variant="outline"
                        className={`
                          ${university.tag === 'reach' ? 'border-red-200 text-red-600' : ''}
                          ${university.tag === 'target' ? 'border-blue-200 text-blue-600' : ''}
                          ${university.tag === 'safety' ? 'border-green-200 text-green-600' : ''}
                        `}
                      >
                        {university.tag.charAt(0).toUpperCase() + university.tag.slice(1)}
                      </Badge>
                    </div>
                    <p className="text-muted-foreground">{university.program_name}</p>
                    <div className="flex items-center space-x-4 text-sm text-muted-foreground">
                      <span>📍 {university.location}</span>
                      <span>📅 {format(new Date(university.deadline), "MMM d, yyyy")}</span>
                      {university.application_fee && (
                        <span>💰 ${university.application_fee}</span>
                      )}
                    </div>
                  </div>
                </div>
                <div className="flex space-x-2">
                  <Button 
                    variant="outline" 
                    size="sm"
                    onClick={() => handleViewUniversity(university)}
                    className="flex items-center gap-1"
                  >
                    <Eye className="h-4 w-4" />
                    View
                  </Button>
                  <Button 
                    variant="ghost" 
                    size="sm"
                    onClick={() => handleEditUniversity(university)}
                    className="flex items-center gap-1"
                  >
                    <Edit className="h-4 w-4" />
                    Edit
                  </Button>
                </div>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Detail and Edit Dialogs */}
      {selectedUniversity && (
        <>
          <UniversityDetailDialog
            university={selectedUniversity}
            open={showDetailDialog}
            onOpenChange={setShowDetailDialog}
          />
          <EditUniversityDialog
            university={selectedUniversity}
            open={showEditDialog}
            onOpenChange={setShowEditDialog}
          />
        </>
      )}

      {/* Bulk Delete Confirmation Dialog */}
      <AlertDialog open={showBulkDeleteDialog} onOpenChange={setShowBulkDeleteDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Selected Universities</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete {selectedUniversities.size} selected universities? 
              This will also delete all associated deadlines and documents. This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleBulkDelete}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
              disabled={deleteUniversity.isPending}
            >
              {deleteUniversity.isPending ? "Deleting..." : `Delete ${selectedUniversities.size} Universities`}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
