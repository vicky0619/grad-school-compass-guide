import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { PlusCircle, Sparkles, Edit } from "lucide-react";
import { useCreateUniversity } from "@/hooks/useUniversities";
import { AIUniversitySearch } from "@/components/ai/AIUniversitySearch";
import { toast } from "sonner";

export function AddUniversityDialog() {
  const [open, setOpen] = useState(false);
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

  const createUniversity = useCreateUniversity();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      await createUniversity.mutateAsync({
        name: formData.name,
        program_name: formData.program_name,
        location: formData.location,
        deadline: formData.deadline,
        url: formData.url || null,
        application_fee: formData.application_fee ? parseInt(formData.application_fee) : null,
        status: formData.status,
        tag: formData.tag,
        notes: formData.notes || null
      });

      toast.success("University added successfully!");
      setOpen(false);
      setFormData({
        name: "",
        program_name: "",
        location: "",
        deadline: "",
        url: "",
        application_fee: "",
        status: "researching",
        tag: "target",
        notes: ""
      });
    } catch (error) {
      toast.error("Failed to add university. Please try again.");
      console.error("Error adding university:", error);
    }
  };

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleAIUniversitySelect = (university: any) => {
    setFormData({
      name: university.name,
      program_name: university.programs[0] || "",
      location: university.location,
      deadline: university.deadline || "",
      url: university.website || "",
      application_fee: university.tuition?.toString() || "",
      status: "researching",
      tag: "target",
      notes: `AI suggested university.${university.ranking ? ` Ranking: #${university.ranking}` : ''}${university.acceptanceRate ? `, Acceptance rate: ${university.acceptanceRate}%` : ''}${university.description ? `\n\n${university.description}` : ''}`
    });
    toast.success(`✨ University data filled from AI search!`);
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button>
          <PlusCircle className="mr-2 h-4 w-4" />
          Add University
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[600px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <PlusCircle className="h-5 w-5" />
            Add New University
          </DialogTitle>
          <DialogDescription>
            Use AI search for instant data or manually fill university details.
          </DialogDescription>
        </DialogHeader>
        
        <Tabs defaultValue="ai" className="space-y-4">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="ai" className="flex items-center gap-2">
              <Sparkles className="h-4 w-4" />
              AI Search
            </TabsTrigger>
            <TabsTrigger value="manual" className="flex items-center gap-2">
              <Edit className="h-4 w-4" />
              Manual Entry
            </TabsTrigger>
          </TabsList>
          
          <TabsContent value="ai" className="space-y-4">
            <AIUniversitySearch onUniversitySelect={handleAIUniversitySelect} />
          </TabsContent>
          
          <TabsContent value="manual">
            <form onSubmit={handleSubmit}>
              <div className="grid gap-4 py-4">
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="name" className="text-right">
                University
              </Label>
              <Input
                id="name"
                value={formData.name}
                onChange={(e) => handleInputChange("name", e.target.value)}
                placeholder="Stanford University"
                className="col-span-3"
                required
              />
            </div>
            
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="program_name" className="text-right">
                Program
              </Label>
              <Input
                id="program_name"
                value={formData.program_name}
                onChange={(e) => handleInputChange("program_name", e.target.value)}
                placeholder="MS in Computer Science"
                className="col-span-3"
                required
              />
            </div>
            
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="location" className="text-right">
                Location
              </Label>
              <Input
                id="location"
                value={formData.location}
                onChange={(e) => handleInputChange("location", e.target.value)}
                placeholder="Stanford, CA"
                className="col-span-3"
                required
              />
            </div>
            
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="deadline" className="text-right">
                Deadline
              </Label>
              <Input
                id="deadline"
                type="date"
                value={formData.deadline}
                onChange={(e) => handleInputChange("deadline", e.target.value)}
                className="col-span-3"
                required
              />
            </div>
            
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="url" className="text-right">
                Website
              </Label>
              <Input
                id="url"
                value={formData.url}
                onChange={(e) => handleInputChange("url", e.target.value)}
                placeholder="https://cs.stanford.edu"
                className="col-span-3"
              />
            </div>
            
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="application_fee" className="text-right">
                App Fee ($)
              </Label>
              <Input
                id="application_fee"
                type="number"
                value={formData.application_fee}
                onChange={(e) => handleInputChange("application_fee", e.target.value)}
                placeholder="125"
                className="col-span-3"
              />
            </div>
            
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="status" className="text-right">
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
              <Label htmlFor="tag" className="text-right">
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
              <Label htmlFor="notes" className="text-right">
                Notes
              </Label>
              <Textarea
                id="notes"
                value={formData.notes}
                onChange={(e) => handleInputChange("notes", e.target.value)}
                placeholder="Additional notes..."
                className="col-span-3"
              />
            </div>
              </div>
              <DialogFooter>
                <Button type="submit" disabled={createUniversity.isPending}>
                  {createUniversity.isPending ? "Adding..." : "Add University"}
                </Button>
              </DialogFooter>
            </form>
          </TabsContent>
        </Tabs>
        
        {/* Show filled data preview when AI fills the form */}
        {formData.name && (
          <div className="mt-4 p-4 bg-green-50 border border-green-200 rounded-lg">
            <div className="flex items-center gap-2 mb-2">
              <Sparkles className="h-4 w-4 text-green-600" />
              <span className="text-sm font-medium text-green-800">AI Data Filled</span>
            </div>
            <div className="text-sm text-green-700">
              <strong>{formData.name}</strong> - {formData.program_name}
              <br />
              📍 {formData.location} | 📅 {formData.deadline}
            </div>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}