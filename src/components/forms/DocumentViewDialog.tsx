import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from "@/components/ui/alert-dialog";
import { 
  FileText, 
  Edit, 
  Trash2, 
  Download, 
  ExternalLink,
  Calendar,
  Building,
  Hash,
  Eye
} from "lucide-react";
import { Database } from "@/integrations/supabase/types";
import { useDeleteDocument } from "@/hooks/useDocuments";
import { EditDocumentDialog } from "./EditDocumentDialog";
import { format } from "date-fns";
import { toast } from "sonner";

type Document = Database['public']['Tables']['documents']['Row'] & {
  universities?: { name: string; program_name: string };
};

interface DocumentViewDialogProps {
  document: Document;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function DocumentViewDialog({ document, open, onOpenChange }: DocumentViewDialogProps) {
  const [showEditDialog, setShowEditDialog] = useState(false);
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  
  const deleteDocument = useDeleteDocument();

  const getDocumentTypeColor = (type: string) => {
    switch (type) {
      case 'sop': return 'bg-blue-100 text-blue-800';
      case 'cv': return 'bg-green-100 text-green-800';
      case 'recommendation': return 'bg-purple-100 text-purple-800';
      case 'transcript': return 'bg-orange-100 text-orange-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getDocumentTypeName = (type: string) => {
    switch (type) {
      case 'sop': return 'Statement of Purpose';
      case 'cv': return 'CV/Resume';
      case 'recommendation': return 'Recommendation Letter';
      case 'transcript': return 'Transcript';
      default: return 'Other Document';
    }
  };

  const handleDelete = async () => {
    try {
      await deleteDocument.mutateAsync(document.id);
      toast.success("Document deleted successfully!");
      setShowDeleteDialog(false);
      onOpenChange(false);
    } catch (error) {
      toast.error("Failed to delete document. Please try again.");
      console.error("Error deleting document:", error);
    }
  };

  const handleDownload = () => {
    if (document.file_url) {
      window.open(document.file_url, '_blank');
    } else {
      toast.error("No file URL available for this document");
    }
  };

  const getFileExtension = (url: string) => {
    return url.split('.').pop()?.toLowerCase() || '';
  };

  const getFileTypeIcon = (url: string) => {
    const extension = getFileExtension(url);
    switch (extension) {
      case 'pdf':
        return '📄';
      case 'doc':
      case 'docx':
        return '📝';
      case 'jpg':
      case 'jpeg':
      case 'png':
      case 'gif':
        return '🖼️';
      case 'txt':
        return '📝';
      default:
        return '📎';
    }
  };

  const canPreviewFile = (url: string) => {
    const extension = getFileExtension(url);
    return ['pdf', 'jpg', 'jpeg', 'png', 'gif', 'txt'].includes(extension);
  };

  const isImageFile = (url: string) => {
    const extension = getFileExtension(url);
    return ['jpg', 'jpeg', 'png', 'gif'].includes(extension);
  };

  return (
    <>
      <Dialog open={open} onOpenChange={onOpenChange}>
        <DialogContent className="sm:max-w-[600px] max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Eye className="h-5 w-5" />
              {document.name}
            </DialogTitle>
            <DialogDescription>
              Document details and content preview
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-6">
            {/* Header Info */}
            <div className="flex flex-col space-y-4">
              <div className="flex items-start justify-between">
                <div className="space-y-2">
                  <div className="flex items-center gap-2">
                    <Badge className={getDocumentTypeColor(document.type)}>
                      {getDocumentTypeName(document.type)}
                    </Badge>
                    <Badge variant="outline">v{document.version}</Badge>
                  </div>
                  <h3 className="text-xl font-semibold">{document.name}</h3>
                </div>
                <div className="bg-muted p-3 rounded-lg">
                  <FileText className="h-8 w-8" />
                </div>
              </div>

              {/* Quick Info */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="flex items-center gap-2 p-3 bg-muted/50 rounded-lg">
                  <Building className="h-4 w-4 text-primary" />
                  <div>
                    <div className="text-xs text-muted-foreground">University</div>
                    <div className="text-sm font-medium">
                      {document.universities?.name || "General"}
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-2 p-3 bg-muted/50 rounded-lg">
                  <Hash className="h-4 w-4 text-primary" />
                  <div>
                    <div className="text-xs text-muted-foreground">Version</div>
                    <div className="text-sm font-medium">v{document.version}</div>
                  </div>
                </div>

                <div className="flex items-center gap-2 p-3 bg-muted/50 rounded-lg">
                  <Calendar className="h-4 w-4 text-primary" />
                  <div>
                    <div className="text-xs text-muted-foreground">Last Updated</div>
                    <div className="text-sm font-medium">
                      {format(new Date(document.updated_at), "MMM d, yyyy")}
                    </div>
                  </div>
                </div>
              </div>

              {/* Actions */}
              <div className="flex gap-2">
                <Button 
                  onClick={() => setShowEditDialog(true)}
                  className="flex items-center gap-2"
                >
                  <Edit className="h-4 w-4" />
                  Edit Document
                </Button>
                
                {document.file_url && (
                  <Button 
                    variant="outline" 
                    onClick={handleDownload}
                    className="flex items-center gap-2"
                  >
                    <Download className="h-4 w-4" />
                    Download
                  </Button>
                )}

                <Button 
                  variant="outline" 
                  onClick={() => setShowDeleteDialog(true)}
                  className="flex items-center gap-2 text-destructive hover:text-destructive"
                >
                  <Trash2 className="h-4 w-4" />
                  Delete
                </Button>
              </div>
            </div>

            {/* Document Details */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <FileText className="h-5 w-5" />
                  Document Information
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="text-sm font-medium text-muted-foreground">Document Name</label>
                    <p className="text-sm">{document.name}</p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-muted-foreground">Document Type</label>
                    <p className="text-sm">{getDocumentTypeName(document.type)}</p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-muted-foreground">University</label>
                    <p className="text-sm">{document.universities?.name || "General"}</p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-muted-foreground">Version</label>
                    <p className="text-sm">v{document.version}</p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-muted-foreground">Created</label>
                    <p className="text-sm">{format(new Date(document.created_at), "EEEE, MMMM d, yyyy")}</p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-muted-foreground">Last Updated</label>
                    <p className="text-sm">{format(new Date(document.updated_at), "EEEE, MMMM d, yyyy")}</p>
                  </div>
                </div>

                {document.file_url && (
                  <div className="space-y-3">
                    <label className="text-sm font-medium text-muted-foreground">File Preview & Actions</label>
                    
                    {/* File Info Bar */}
                    <div className="flex items-center gap-2 p-3 bg-muted/30 rounded-lg">
                      <span className="text-xl">{getFileTypeIcon(document.file_url)}</span>
                      <div className="flex-1">
                        <div className="text-sm font-medium">
                          {document.name}.{getFileExtension(document.file_url)}
                        </div>
                        <div className="text-xs text-muted-foreground">
                          {getFileExtension(document.file_url).toUpperCase()} File
                        </div>
                      </div>
                      <div className="flex gap-2">
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => window.open(document.file_url!, '_blank')}
                          className="flex items-center gap-1"
                        >
                          <ExternalLink className="h-3 w-3" />
                          Open
                        </Button>
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={handleDownload}
                          className="flex items-center gap-1"
                        >
                          <Download className="h-3 w-3" />
                          Download
                        </Button>
                      </div>
                    </div>

                    {/* File Preview */}
                    {canPreviewFile(document.file_url) && (
                      <div className="border rounded-lg overflow-hidden">
                        <div className="bg-muted/50 p-2 text-sm font-medium">File Preview</div>
                        <div className="p-4">
                          {isImageFile(document.file_url) ? (
                            <div className="text-center">
                              <img 
                                src={document.file_url} 
                                alt={document.name}
                                className="max-w-full max-h-64 mx-auto rounded border"
                                onError={(e) => {
                                  e.currentTarget.style.display = 'none';
                                  e.currentTarget.nextElementSibling!.style.display = 'block';
                                }}
                              />
                              <div style={{display: 'none'}} className="text-muted-foreground">
                                Image preview not available
                              </div>
                            </div>
                          ) : getFileExtension(document.file_url) === 'pdf' ? (
                            <div className="text-center space-y-2">
                              <div className="text-4xl">📄</div>
                              <p className="text-sm text-muted-foreground">PDF Document</p>
                              <Button
                                variant="outline"
                                onClick={() => window.open(document.file_url!, '_blank')}
                                className="flex items-center gap-1"
                              >
                                <ExternalLink className="h-3 w-3" />
                                Open PDF in New Tab
                              </Button>
                            </div>
                          ) : (
                            <div className="text-center space-y-2">
                              <div className="text-4xl">{getFileTypeIcon(document.file_url)}</div>
                              <p className="text-sm text-muted-foreground">
                                {getFileExtension(document.file_url).toUpperCase()} File
                              </p>
                              <p className="text-xs text-muted-foreground">
                                Click "Open" to view this file
                              </p>
                            </div>
                          )}
                        </div>
                      </div>
                    )}

                    {/* File URL for reference */}
                    <details className="text-xs">
                      <summary className="cursor-pointer text-muted-foreground hover:text-foreground">
                        Show file URL
                      </summary>
                      <div className="mt-2 p-2 bg-muted/50 rounded text-xs font-mono break-all">
                        {document.file_url}
                      </div>
                    </details>
                  </div>
                )}

                {document.content && (
                  <div>
                    <label className="text-sm font-medium text-muted-foreground">Content/Notes</label>
                    <div className="mt-1 p-3 bg-muted/50 rounded-md">
                      <p className="text-sm whitespace-pre-wrap">{document.content}</p>
                    </div>
                  </div>
                )}

                {/* Version History Section */}
                <div className="space-y-3">
                  <label className="text-sm font-medium text-muted-foreground">Version History</label>
                  <div className="border rounded-lg overflow-hidden">
                    <div className="bg-muted/50 p-2 text-sm font-medium">Document Versions</div>
                    <div className="p-4 space-y-3">
                      {/* Current Version */}
                      <div className="flex items-center justify-between p-3 border rounded-lg bg-primary/5 border-primary/20">
                        <div className="flex items-center gap-3">
                          <div className="bg-primary/20 p-2 rounded-full">
                            <FileText className="h-4 w-4 text-primary" />
                          </div>
                          <div>
                            <div className="font-medium text-sm">Version {document.version} (Current)</div>
                            <div className="text-xs text-muted-foreground">
                              Last updated {format(new Date(document.updated_at), "MMM d, yyyy 'at' h:mm a")}
                            </div>
                          </div>
                        </div>
                        <div className="flex items-center gap-2">
                          <Badge variant="default">Current</Badge>
                          {document.file_url && (
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() => window.open(document.file_url!, '_blank')}
                            >
                              View
                            </Button>
                          )}
                        </div>
                      </div>

                      {/* Version History Info */}
                      <div className="text-center p-4 text-muted-foreground">
                        <div className="text-sm">
                          This document was originally created on{' '}
                          {format(new Date(document.created_at), "EEEE, MMMM d, yyyy 'at' h:mm a")}
                        </div>
                        {document.created_at !== document.updated_at && (
                          <div className="text-xs mt-1">
                            Last modified on{' '}
                            {format(new Date(document.updated_at), "EEEE, MMMM d, yyyy 'at' h:mm a")}
                          </div>
                        )}
                      </div>

                      {/* Future Enhancement Note */}
                      <div className="text-center p-3 bg-muted/30 rounded-lg">
                        <div className="text-xs text-muted-foreground">
                          💡 <strong>Future Enhancement:</strong> Full version history tracking will be added in a future update.
                          This will include viewing previous versions, comparing changes, and restoring older versions.
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </DialogContent>
      </Dialog>

      {/* Edit Dialog */}
      <EditDocumentDialog
        document={document}
        open={showEditDialog}
        onOpenChange={setShowEditDialog}
      />

      {/* Delete Confirmation Dialog */}
      <AlertDialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This will permanently delete <strong>{document.name}</strong>. 
              This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDelete}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
              disabled={deleteDocument.isPending}
            >
              {deleteDocument.isPending ? "Deleting..." : "Delete Document"}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}