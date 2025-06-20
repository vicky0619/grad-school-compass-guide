import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from "@/components/ui/alert-dialog";
import { Edit, Trash2 } from "lucide-react";
import { useUpdateUniversity, useDeleteUniversity } from "@/hooks/useUniversities";
import { Database } from "@/integrations/supabase/types";
import { toast } from "sonner";

type University = Database['public']['Tables']['universities']['Row'];

interface EditUniversityDialogProps {
  university: University;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function EditUniversityDialog({ university, open, onOpenChange }: EditUniversityDialogProps) {
  const [formData, setFormData] = useState({
    name: "",
    program_name: "",
    location: "",
    deadline: "",
    url: "",
    application_fee: "",
    status: "researching" as const,
    tag: "target" as const,
    notes: ""
  });
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);

  const updateUniversity = useUpdateUniversity();
  const deleteUniversity = useDeleteUniversity();

  // Populate form when dialog opens or university changes
  useEffect(() => {
    if (university) {
      setFormData({
        name: university.name || "",
        program_name: university.program_name || "",
        location: university.location || "",
        deadline: university.deadline || "",
        url: university.url || "",
        application_fee: university.application_fee?.toString() || "",
        status: university.status || "researching",
        tag: university.tag || "target",
        notes: university.notes || ""
      });
    }
  }, [university]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      await updateUniversity.mutateAsync({
        id: university.id,
        updates: {
          name: formData.name,
          program_name: formData.program_name,
          location: formData.location,
          deadline: formData.deadline,
          url: formData.url || null,
          application_fee: formData.application_fee ? parseInt(formData.application_fee) : null,
          status: formData.status,
          tag: formData.tag,
          notes: formData.notes || null
        }
      });

      toast.success("University updated successfully!");
      onOpenChange(false);
    } catch (error) {
      toast.error("Failed to update university. Please try again.");
      console.error("Error updating university:", error);
    }
  };

  const handleDelete = async () => {
    try {
      await deleteUniversity.mutateAsync(university.id);
      toast.success("University deleted successfully!");
      setShowDeleteDialog(false);
      onOpenChange(false);
    } catch (error) {
      toast.error("Failed to delete university. Please try again.");
      console.error("Error deleting university:", error);
    }
  };

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  return (
    <>
      <Dialog open={open} onOpenChange={onOpenChange}>
        <DialogContent className="sm:max-w-[525px] max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Edit className="h-5 w-5" />
              Edit University
            </DialogTitle>
            <DialogDescription>
              Update the details for {university?.name}. Changes will be saved to your application list.
            </DialogDescription>
          </DialogHeader>
          <form onSubmit={handleSubmit}>
            <div className="grid gap-4 py-4">
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="edit-name" className="text-right">
                  University
                </Label>
                <Input
                  id="edit-name"
                  value={formData.name}
                  onChange={(e) => handleInputChange("name", e.target.value)}
                  placeholder="Stanford University"
                  className="col-span-3"
                  required
                />
              </div>
              
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="edit-program_name" className="text-right">
                  Program
                </Label>
                <Input
                  id="edit-program_name"
                  value={formData.program_name}
                  onChange={(e) => handleInputChange("program_name", e.target.value)}
                  placeholder="MS in Computer Science"
                  className="col-span-3"
                  required
                />
              </div>
              
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="edit-location" className="text-right">
                  Location
                </Label>
                <Input
                  id="edit-location"
                  value={formData.location}
                  onChange={(e) => handleInputChange("location", e.target.value)}
                  placeholder="Stanford, CA"
                  className="col-span-3"
                  required
                />
              </div>
              
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="edit-deadline" className="text-right">
                  Deadline
                </Label>
                <Input
                  id="edit-deadline"
                  type="date"
                  value={formData.deadline}
                  onChange={(e) => handleInputChange("deadline", e.target.value)}
                  className="col-span-3"
                  required
                />
              </div>
              
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="edit-url" className="text-right">
                  Website
                </Label>
                <Input
                  id="edit-url"
                  value={formData.url}
                  onChange={(e) => handleInputChange("url", e.target.value)}
                  placeholder="https://cs.stanford.edu"
                  className="col-span-3"
                />
              </div>
              
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="edit-application_fee" className="text-right">
                  App Fee ($)
                </Label>
                <Input
                  id="edit-application_fee"
                  type="number"
                  value={formData.application_fee}
                  onChange={(e) => handleInputChange("application_fee", e.target.value)}
                  placeholder="125"
                  className="col-span-3"
                />
              </div>
              
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="edit-status" className="text-right">
                  Status
                </Label>
                <Select value={formData.status} onValueChange={(value) => handleInputChange("status", value)}>
                  <SelectTrigger className="col-span-3">
                    <SelectValue placeholder="Select status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="researching">Researching</SelectItem>
                    <SelectItem value="applied">Applied</SelectItem>
                    <SelectItem value="admitted">Admitted</SelectItem>
                    <SelectItem value="rejected">Rejected</SelectItem>
                    <SelectItem value="pending">Pending</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="edit-tag" className="text-right">
                  Category
                </Label>
                <Select value={formData.tag} onValueChange={(value) => handleInputChange("tag", value)}>
                  <SelectTrigger className="col-span-3">
                    <SelectValue placeholder="Select category" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="reach">Reach</SelectItem>
                    <SelectItem value="target">Target</SelectItem>
                    <SelectItem value="safety">Safety</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="edit-notes" className="text-right">
                  Notes
                </Label>
                <Textarea
                  id="edit-notes"
                  value={formData.notes}
                  onChange={(e) => handleInputChange("notes", e.target.value)}
                  placeholder="Additional notes..."
                  className="col-span-3"
                />
              </div>
            </div>
            <DialogFooter className="flex justify-between">
              <Button
                type="button"
                variant="destructive"
                onClick={() => setShowDeleteDialog(true)}
                className="flex items-center gap-2"
              >
                <Trash2 className="h-4 w-4" />
                Delete
              </Button>
              <div className="flex gap-2">
                <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
                  Cancel
                </Button>
                <Button type="submit" disabled={updateUniversity.isPending}>
                  {updateUniversity.isPending ? "Updating..." : "Update University"}
                </Button>
              </div>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation Dialog */}
      <AlertDialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This will permanently delete <strong>{university?.name}</strong> and all associated deadlines and documents. 
              This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDelete}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
              disabled={deleteUniversity.isPending}
            >
              {deleteUniversity.isPending ? "Deleting..." : "Delete University"}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}