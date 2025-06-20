import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Edit } from "lucide-react";
import { useUpdateDocument } from "@/hooks/useDocuments";
import { useUniversities } from "@/hooks/useUniversities";
import { Database } from "@/integrations/supabase/types";
import { toast } from "sonner";

type Document = Database['public']['Tables']['documents']['Row'] & {
  universities?: { name: string; program_name: string };
};

interface EditDocumentDialogProps {
  document: Document;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function EditDocumentDialog({ document, open, onOpenChange }: EditDocumentDialogProps) {
  const [formData, setFormData] = useState({
    name: "",
    type: "other" as const,
    university_id: "",
    content: "",
    file_url: "",
    version: 1
  });

  const updateDocument = useUpdateDocument();
  const { data: universities = [] } = useUniversities();

  // Populate form when dialog opens or document changes
  useEffect(() => {
    if (document) {
      setFormData({
        name: document.name || "",
        type: document.type || "other",
        university_id: document.university_id || "",
        content: document.content || "",
        file_url: document.file_url || "",
        version: document.version || 1
      });
    }
  }, [document]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.university_id) {
      toast.error("Please select a university");
      return;
    }
    
    try {
      await updateDocument.mutateAsync({
        id: document.id,
        updates: {
          name: formData.name,
          type: formData.type,
          university_id: formData.university_id,
          content: formData.content || null,
          file_url: formData.file_url || null,
          version: formData.version
        }
      });

      toast.success("Document updated successfully!");
      onOpenChange(false);
    } catch (error) {
      toast.error("Failed to update document. Please try again.");
      console.error("Error updating document:", error);
    }
  };

  const handleInputChange = (field: string, value: string | number) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[525px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Edit className="h-5 w-5" />
            Edit Document
          </DialogTitle>
          <DialogDescription>
            Update the details for {document?.name}. Changes will be saved to your documents.
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit}>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="edit-doc-name" className="text-right">
                Document Name
              </Label>
              <Input
                id="edit-doc-name"
                value={formData.name}
                onChange={(e) => handleInputChange("name", e.target.value)}
                placeholder="Statement of Purpose"
                className="col-span-3"
                required
              />
            </div>
            
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="edit-doc-university_id" className="text-right">
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
              <Label htmlFor="edit-doc-type" className="text-right">
                Type
              </Label>
              <Select value={formData.type} onValueChange={(value) => handleInputChange("type", value)}>
                <SelectTrigger className="col-span-3">
                  <SelectValue placeholder="Select type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="sop">Statement of Purpose</SelectItem>
                  <SelectItem value="cv">CV/Resume</SelectItem>
                  <SelectItem value="recommendation">Recommendation Letter</SelectItem>
                  <SelectItem value="transcript">Transcript</SelectItem>
                  <SelectItem value="other">Other</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="edit-doc-version" className="text-right">
                Version
              </Label>
              <Input
                id="edit-doc-version"
                type="number"
                value={formData.version}
                onChange={(e) => handleInputChange("version", parseInt(e.target.value) || 1)}
                min="1"
                className="col-span-3"
              />
            </div>
            
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="edit-doc-file_url" className="text-right">
                File URL
              </Label>
              <Input
                id="edit-doc-file_url"
                value={formData.file_url}
                onChange={(e) => handleInputChange("file_url", e.target.value)}
                placeholder="https://drive.google.com/..."
                className="col-span-3"
              />
            </div>
            
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="edit-doc-content" className="text-right">
                Notes/Content
              </Label>
              <Textarea
                id="edit-doc-content"
                value={formData.content}
                onChange={(e) => handleInputChange("content", e.target.value)}
                placeholder="Document notes or content summary..."
                className="col-span-3"
                rows={4}
              />
            </div>
          </div>
          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
              Cancel
            </Button>
            <Button type="submit" disabled={updateDocument.isPending}>
              {updateDocument.isPending ? "Updating..." : "Update Document"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}