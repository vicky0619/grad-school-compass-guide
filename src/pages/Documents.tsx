
import { DocumentList } from "@/components/documents/DocumentList";
import { AddDocumentDialog } from "@/components/forms/AddDocumentDialog";

export default function Documents() {
  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-3xl font-bold tracking-tight">Documents</h2>
        <AddDocumentDialog />
      </div>
      
      <DocumentList />
    </div>
  );
}
