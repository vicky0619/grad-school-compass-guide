import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { FileText } from "lucide-react";
import { useCreateDocument } from "@/hooks/useDocuments";
import { useUniversities } from "@/hooks/useUniversities";
import { toast } from "sonner";

export function AddDocumentDialog() {
  const [open, setOpen] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    type: "other" as const,
    university_id: "",
    content: "",
    file_url: "",
    version: 1
  });

  const createDocument = useCreateDocument();
  const { data: universities = [] } = useUniversities();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.university_id) {
      toast.error("Please select a university");
      return;
    }
    
    try {
      await createDocument.mutateAsync({
        name: formData.name,
        type: formData.type,
        university_id: formData.university_id,
        content: formData.content || null,
        file_url: formData.file_url || null,
        version: formData.version
      });

      toast.success("Document added successfully!");
      setOpen(false);
      setFormData({
        name: "",
        type: "other",
        university_id: "",
        content: "",
        file_url: "",
        version: 1
      });
    } catch (error) {
      toast.error("Failed to add document. Please try again.");
      console.error("Error adding document:", error);
    }
  };

  const handleInputChange = (field: string, value: string | number) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button size="sm">
          <FileText className="mr-2 h-4 w-4" />
          Add Document
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[525px]">
        <DialogHeader>
          <DialogTitle>Add New Document</DialogTitle>
          <DialogDescription>
            Add a new document to your application materials. Fill in the details below.
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit}>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="name" className="text-right">
                Document Name
              </Label>
              <Input
                id="name"
                value={formData.name}
                onChange={(e) => handleInputChange("name", e.target.value)}
                placeholder="Statement of Purpose"
                className="col-span-3"
                required
              />
            </div>
            
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="university_id" className="text-right">
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
              <Label htmlFor="type" className="text-right">
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
              <Label htmlFor="version" className="text-right">
                Version
              </Label>
              <Input
                id="version"
                type="number"
                value={formData.version}
                onChange={(e) => handleInputChange("version", parseInt(e.target.value) || 1)}
                min="1"
                className="col-span-3"
              />
            </div>
            
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="file_url" className="text-right">
                File URL
              </Label>
              <Input
                id="file_url"
                value={formData.file_url}
                onChange={(e) => handleInputChange("file_url", e.target.value)}
                placeholder="https://drive.google.com/..."
                className="col-span-3"
              />
            </div>
            
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="content" className="text-right">
                Notes/Content
              </Label>
              <Textarea
                id="content"
                value={formData.content}
                onChange={(e) => handleInputChange("content", e.target.value)}
                placeholder="Document notes or content summary..."
                className="col-span-3"
                rows={4}
              />
            </div>
          </div>
          <DialogFooter>
            <Button type="submit" disabled={createDocument.isPending}>
              {createDocument.isPending ? "Adding..." : "Add Document"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}