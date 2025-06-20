
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { format } from "date-fns";
import { FileText } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { useDocuments } from "@/hooks/useDocuments";
import { DocumentViewDialog } from "@/components/forms/DocumentViewDialog";
import { useState } from "react";
import { Database } from "@/integrations/supabase/types";

type Document = Database['public']['Tables']['documents']['Row'] & {
  universities?: { name: string; program_name: string };
};

export function DocumentList() {
  const { data: documents = [], isLoading } = useDocuments();
  const [selectedDocument, setSelectedDocument] = useState<Document | null>(null);
  const [showViewDialog, setShowViewDialog] = useState(false);

  const handleDocumentClick = (document: Document) => {
    setSelectedDocument(document);
    setShowViewDialog(true);
  };

  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>My Documents</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-center p-8">
            <div className="text-center">
              <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-primary mx-auto"></div>
              <p className="mt-2 text-sm text-muted-foreground">Loading documents...</p>
            </div>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <>
      <Card>
        <CardHeader>
          <CardTitle>My Documents</CardTitle>
        </CardHeader>
        <CardContent>
          {documents.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground">
              <FileText className="h-12 w-12 mx-auto mb-4 opacity-50" />
              <p>No documents uploaded yet</p>
              <p className="text-sm">Add your first document to get started</p>
            </div>
          ) : (
            <div className="space-y-4">
              {documents.map(doc => (
                <div 
                  key={doc.id} 
                  className="flex items-center space-x-4 p-3 rounded-md border hover:bg-accent/10 transition-colors cursor-pointer"
                  onClick={() => handleDocumentClick(doc)}
                >
                  <div className="bg-muted p-2 rounded-md">
                    <FileText className="h-6 w-6" />
                  </div>
                  <div className="flex-1">
                    <div className="font-medium">{doc.name}</div>
                    <div className="text-xs text-muted-foreground">
                      {doc.universities?.name || "General"} • Last updated: {format(new Date(doc.updated_at), "MMM d, yyyy")}
                    </div>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Badge variant="outline">v{doc.version}</Badge>
                    <Badge>{doc.type.toUpperCase()}</Badge>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
      
      {/* Document View Dialog */}
      {selectedDocument && (
        <DocumentViewDialog
          document={selectedDocument}
          open={showViewDialog}
          onOpenChange={setShowViewDialog}
        />
      )}
    </>
  );
}
