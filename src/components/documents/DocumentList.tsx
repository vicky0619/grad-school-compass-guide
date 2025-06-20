
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
      <div className="space-y-6">
        {/* Header */}
        <div>
          <h2 className="text-2xl font-semibold text-foreground">Documents</h2>
          <p className="text-sm text-muted-foreground mt-1">
            Manage your application documents and track versions
          </p>
        </div>

        {documents.length === 0 ? (
          <div className="text-center py-16 text-muted-foreground bg-card rounded-xl border border-border">
            <div className="text-4xl mb-4">📄</div>
            <p className="text-lg font-medium">No documents yet</p>
            <p className="text-sm">Upload your first document to get started</p>
          </div>
        ) : (
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {documents.map(doc => (
              <div 
                key={doc.id} 
                className="bg-card border border-border rounded-xl p-6 hover:shadow-sm transition-all duration-200 cursor-pointer group"
                onClick={() => handleDocumentClick(doc)}
              >
                <div className="space-y-4">
                  <div className="flex items-start justify-between">
                    <div className="bg-muted/50 p-3 rounded-lg">
                      <FileText className="h-6 w-6 text-primary" />
                    </div>
                    <div className="flex items-center space-x-2">
                      <Badge variant="outline" className="text-xs">v{doc.version}</Badge>
                    </div>
                  </div>
                  
                  <div className="space-y-2">
                    <h3 className="font-medium text-foreground group-hover:text-primary transition-colors">
                      {doc.name}
                    </h3>
                    <p className="text-sm text-muted-foreground">
                      {doc.universities?.name || "General"}
                    </p>
                    <div className="flex items-center justify-between">
                      <Badge className={`
                        ${doc.type === 'sop' ? 'bg-blue-100 text-blue-700 border-blue-200' : ''}
                        ${doc.type === 'cv' ? 'bg-green-100 text-green-700 border-green-200' : ''}
                        ${doc.type === 'recommendation' ? 'bg-purple-100 text-purple-700 border-purple-200' : ''}
                        ${doc.type === 'transcript' ? 'bg-orange-100 text-orange-700 border-orange-200' : ''}
                        ${doc.type === 'other' ? 'bg-gray-100 text-gray-700 border-gray-200' : ''}
                      `}>
                        {doc.type.toUpperCase()}
                      </Badge>
                      <span className="text-xs text-muted-foreground">
                        {format(new Date(doc.updated_at), "MMM d")}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
      
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
