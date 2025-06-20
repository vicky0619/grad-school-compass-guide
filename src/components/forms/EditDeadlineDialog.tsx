import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from "@/components/ui/alert-dialog";
import { Edit, Trash2 } from "lucide-react";
import { useUpdateDeadline, useDeleteDeadline } from "@/hooks/useDeadlines";
import { useUniversities } from "@/hooks/useUniversities";
import { Database } from "@/integrations/supabase/types";
import { toast } from "sonner";

type Deadline = Database['public']['Tables']['deadlines']['Row'] & {
  universities?: { name: string; program_name: string };
};

interface EditDeadlineDialogProps {
  deadline: Deadline;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function EditDeadlineDialog({ deadline, open, onOpenChange }: EditDeadlineDialogProps) {
  const [formData, setFormData] = useState({
    title: "",
    date: "",
    type: "application" as const,
    university_id: "",
    description: "",
    completed: false
  });
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);

  const updateDeadline = useUpdateDeadline();
  const deleteDeadline = useDeleteDeadline();
  const { data: universities = [] } = useUniversities();

  // Populate form when dialog opens or deadline changes
  useEffect(() => {
    if (deadline) {
      setFormData({
        title: deadline.title || "",
        date: deadline.date || "",
        type: deadline.type || "application",
        university_id: deadline.university_id || "",
        description: deadline.description || "",
        completed: deadline.completed || false
      });
    }
  }, [deadline]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.university_id) {
      toast.error("Please select a university");
      return;
    }
    
    try {
      await updateDeadline.mutateAsync({
        id: deadline.id,
        updates: {
          title: formData.title,
          date: formData.date,
          type: formData.type,
          university_id: formData.university_id,
          description: formData.description || null,
          completed: formData.completed
        }
      });

      toast.success("Deadline updated successfully!");
      onOpenChange(false);
    } catch (error) {
      toast.error("Failed to update deadline. Please try again.");
      console.error("Error updating deadline:", error);
    }
  };

  const handleDelete = async () => {
    try {
      await deleteDeadline.mutateAsync(deadline.id);
      toast.success("Deadline deleted successfully!");
      setShowDeleteDialog(false);
      onOpenChange(false);
    } catch (error) {
      toast.error("Failed to delete deadline. Please try again.");
      console.error("Error deleting deadline:", error);
    }
  };

  const handleInputChange = (field: string, value: string | boolean) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  return (
    <>
      <Dialog open={open} onOpenChange={onOpenChange}>
        <DialogContent className="sm:max-w-[525px] max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Edit className="h-5 w-5" />
              Edit Deadline
            </DialogTitle>
            <DialogDescription>
              Update the details for {deadline?.title}. Changes will be saved to your deadlines.
            </DialogDescription>
          </DialogHeader>
          <form onSubmit={handleSubmit}>
            <div className="grid gap-4 py-4">
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="edit-deadline-title" className="text-right">
                  Title
                </Label>
                <Input
                  id="edit-deadline-title"
                  value={formData.title}
                  onChange={(e) => handleInputChange("title", e.target.value)}
                  placeholder="Application Deadline"
                  className="col-span-3"
                  required
                />
              </div>
              
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="edit-deadline-university_id" className="text-right">
                  University
                </Label>
                <Select value={formData.university_id} onValueChange={(value) => handleInputChange("university_id", value)}>
                  <SelectTrigger className="col-span-3">
                    <SelectValue placeholder="Select university" />
                  </SelectTrigger>
                  <SelectContent>
                    {universities.map((university) => (
                      <SelectItem key={university.id} value={university.id}>
                        {university.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="edit-deadline-date" className="text-right">
                  Date
                </Label>
                <Input
                  id="edit-deadline-date"
                  type="date"
                  value={formData.date}
                  onChange={(e) => handleInputChange("date", e.target.value)}
                  className="col-span-3"
                  required
                />
              </div>
              
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="edit-deadline-type" className="text-right">
                  Type
                </Label>
                <Select value={formData.type} onValueChange={(value) => handleInputChange("type", value)}>
                  <SelectTrigger className="col-span-3">
                    <SelectValue placeholder="Select type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="application">Application</SelectItem>
                    <SelectItem value="interview">Interview</SelectItem>
                    <SelectItem value="decision">Decision</SelectItem>
                    <SelectItem value="document">Document</SelectItem>
                    <SelectItem value="test">Test</SelectItem>
                    <SelectItem value="other">Other</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="edit-deadline-description" className="text-right">
                  Description
                </Label>
                <Textarea
                  id="edit-deadline-description"
                  value={formData.description}
                  onChange={(e) => handleInputChange("description", e.target.value)}
                  placeholder="Additional details about this deadline..."
                  className="col-span-3"
                  rows={3}
                />
              </div>
              
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="edit-deadline-completed" className="text-right">
                  Completed
                </Label>
                <div className="col-span-3">
                  <input
                    id="edit-deadline-completed"
                    type="checkbox"
                    checked={formData.completed}
                    onChange={(e) => handleInputChange("completed", e.target.checked)}
                    className="h-4 w-4"
                  />
                </div>
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
                <Button type="submit" disabled={updateDeadline.isPending}>
                  {updateDeadline.isPending ? "Updating..." : "Update Deadline"}
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
              This will permanently delete <strong>{deadline?.title}</strong>. 
              This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDelete}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
              disabled={deleteDeadline.isPending}
            >
              {deleteDeadline.isPending ? "Deleting..." : "Delete Deadline"}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}