
import { Button } from "@/components/ui/button";
import { DocumentList } from "@/components/documents/DocumentList";
import { PlusCircle } from "lucide-react";

export default function Documents() {
  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-3xl font-bold tracking-tight">Documents</h2>
        <Button>
          <PlusCircle className="mr-2 h-4 w-4" />
          New Document
        </Button>
      </div>
      
      <DocumentList />
    </div>
  );
}
