import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  Eye, 
  Edit, 
  ExternalLink, 
  Calendar, 
  MapPin, 
  DollarSign, 
  GraduationCap,
  FileText,
  Clock,
  CheckCircle,
  AlertCircle
} from "lucide-react";
import { Database } from "@/integrations/supabase/types";
import { useDeadlines } from "@/hooks/useDeadlines";
import { useDocuments } from "@/hooks/useDocuments";
import { EditUniversityDialog } from "./EditUniversityDialog";
import { format } from "date-fns";

type University = Database['public']['Tables']['universities']['Row'];

interface UniversityDetailDialogProps {
  university: University;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function UniversityDetailDialog({ university, open, onOpenChange }: UniversityDetailDialogProps) {
  const [showEditDialog, setShowEditDialog] = useState(false);
  const { data: allDeadlines = [] } = useDeadlines();
  const { data: allDocuments = [] } = useDocuments();

  // Filter related data
  const relatedDeadlines = allDeadlines.filter(d => d.university_id === university.id);
  const relatedDocuments = allDocuments.filter(d => d.university_id === university.id);

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'admitted': return 'bg-green-100 text-green-800';
      case 'applied': return 'bg-blue-100 text-blue-800';
      case 'rejected': return 'bg-red-100 text-red-800';
      case 'pending': return 'bg-yellow-100 text-yellow-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getTagColor = (tag: string) => {
    switch (tag) {
      case 'reach': return 'bg-red-50 text-red-700 border-red-200';
      case 'target': return 'bg-blue-50 text-blue-700 border-blue-200';
      case 'safety': return 'bg-green-50 text-green-700 border-green-200';
      default: return 'bg-gray-50 text-gray-700 border-gray-200';
    }
  };

  return (
    <>
      <Dialog open={open} onOpenChange={onOpenChange}>
        <DialogContent className="sm:max-w-[700px] max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Eye className="h-5 w-5" />
              {university.name}
            </DialogTitle>
            <DialogDescription>
              Complete details and related information for this university
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-6">
            {/* Header Info */}
            <div className="flex flex-col space-y-4">
              <div className="flex items-center justify-between">
                <div className="space-y-1">
                  <h3 className="text-xl font-semibold">{university.program_name}</h3>
                  <div className="flex items-center gap-2 text-muted-foreground">
                    <MapPin className="h-4 w-4" />
                    <span>{university.location}</span>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <Badge className={getStatusColor(university.status)}>
                    {university.status.charAt(0).toUpperCase() + university.status.slice(1)}
                  </Badge>
                  <Badge variant="outline" className={getTagColor(university.tag)}>
                    {university.tag.charAt(0).toUpperCase() + university.tag.slice(1)}
                  </Badge>
                </div>
              </div>

              {/* Quick Stats */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div className="flex items-center gap-2 p-3 bg-muted/50 rounded-lg">
                  <Calendar className="h-4 w-4 text-primary" />
                  <div>
                    <div className="text-xs text-muted-foreground">Deadline</div>
                    <div className="text-sm font-medium">
                      {format(new Date(university.deadline), "MMM d, yyyy")}
                    </div>
                  </div>
                </div>

                {university.application_fee && (
                  <div className="flex items-center gap-2 p-3 bg-muted/50 rounded-lg">
                    <DollarSign className="h-4 w-4 text-primary" />
                    <div>
                      <div className="text-xs text-muted-foreground">App Fee</div>
                      <div className="text-sm font-medium">${university.application_fee}</div>
                    </div>
                  </div>
                )}

                <div className="flex items-center gap-2 p-3 bg-muted/50 rounded-lg">
                  <FileText className="h-4 w-4 text-primary" />
                  <div>
                    <div className="text-xs text-muted-foreground">Documents</div>
                    <div className="text-sm font-medium">{relatedDocuments.length}</div>
                  </div>
                </div>

                <div className="flex items-center gap-2 p-3 bg-muted/50 rounded-lg">
                  <Clock className="h-4 w-4 text-primary" />
                  <div>
                    <div className="text-xs text-muted-foreground">Deadlines</div>
                    <div className="text-sm font-medium">{relatedDeadlines.length}</div>
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
                  Edit University
                </Button>
                
                {university.url && (
                  <Button 
                    variant="outline" 
                    onClick={() => window.open(university.url!, '_blank')}
                    className="flex items-center gap-2"
                  >
                    <ExternalLink className="h-4 w-4" />
                    Visit Website
                  </Button>
                )}
              </div>
            </div>

            {/* Detailed Tabs */}
            <Tabs defaultValue="overview" className="space-y-4">
              <TabsList className="grid w-full grid-cols-3">
                <TabsTrigger value="overview">Overview</TabsTrigger>
                <TabsTrigger value="deadlines">Deadlines ({relatedDeadlines.length})</TabsTrigger>
                <TabsTrigger value="documents">Documents ({relatedDocuments.length})</TabsTrigger>
              </TabsList>

              <TabsContent value="overview" className="space-y-4">
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <GraduationCap className="h-5 w-5" />
                      University Information
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label className="text-sm font-medium text-muted-foreground">University Name</label>
                        <p className="text-sm">{university.name}</p>
                      </div>
                      <div>
                        <label className="text-sm font-medium text-muted-foreground">Program</label>
                        <p className="text-sm">{university.program_name}</p>
                      </div>
                      <div>
                        <label className="text-sm font-medium text-muted-foreground">Location</label>
                        <p className="text-sm">{university.location}</p>
                      </div>
                      <div>
                        <label className="text-sm font-medium text-muted-foreground">Application Deadline</label>
                        <p className="text-sm">{format(new Date(university.deadline), "EEEE, MMMM d, yyyy")}</p>
                      </div>
                      {university.application_fee && (
                        <div>
                          <label className="text-sm font-medium text-muted-foreground">Application Fee</label>
                          <p className="text-sm">${university.application_fee}</p>
                        </div>
                      )}
                      <div>
                        <label className="text-sm font-medium text-muted-foreground">Added On</label>
                        <p className="text-sm">{format(new Date(university.created_at), "MMM d, yyyy")}</p>
                      </div>
                    </div>

                    {university.notes && (
                      <div className="mt-4">
                        <label className="text-sm font-medium text-muted-foreground">Notes</label>
                        <p className="text-sm mt-1 p-3 bg-muted/50 rounded-md">{university.notes}</p>
                      </div>
                    )}
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="deadlines" className="space-y-4">
                {relatedDeadlines.length === 0 ? (
                  <Card>
                    <CardContent className="text-center py-8">
                      <Clock className="h-12 w-12 mx-auto mb-4 opacity-50" />
                      <p className="text-muted-foreground">No deadlines for this university yet</p>
                    </CardContent>
                  </Card>
                ) : (
                  <div className="space-y-3">
                    {relatedDeadlines.map(deadline => (
                      <Card key={deadline.id}>
                        <CardContent className="flex items-center justify-between p-4">
                          <div className="flex items-center gap-3">
                            {deadline.completed ? (
                              <CheckCircle className="h-5 w-5 text-green-600" />
                            ) : (
                              <AlertCircle className="h-5 w-5 text-yellow-600" />
                            )}
                            <div>
                              <div className="font-medium">{deadline.title}</div>
                              <div className="text-sm text-muted-foreground">
                                {format(new Date(deadline.date), "MMM d, yyyy")} • {deadline.type}
                              </div>
                            </div>
                          </div>
                          <Badge variant={deadline.completed ? "default" : "secondary"}>
                            {deadline.completed ? "Completed" : "Pending"}
                          </Badge>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                )}
              </TabsContent>

              <TabsContent value="documents" className="space-y-4">
                {relatedDocuments.length === 0 ? (
                  <Card>
                    <CardContent className="text-center py-8">
                      <FileText className="h-12 w-12 mx-auto mb-4 opacity-50" />
                      <p className="text-muted-foreground">No documents for this university yet</p>
                    </CardContent>
                  </Card>
                ) : (
                  <div className="space-y-3">
                    {relatedDocuments.map(document => (
                      <Card key={document.id}>
                        <CardContent className="flex items-center justify-between p-4">
                          <div className="flex items-center gap-3">
                            <div className="bg-muted p-2 rounded-md">
                              <FileText className="h-4 w-4" />
                            </div>
                            <div>
                              <div className="font-medium">{document.name}</div>
                              <div className="text-sm text-muted-foreground">
                                {document.type.toUpperCase()} • v{document.version} • 
                                Updated {format(new Date(document.updated_at), "MMM d, yyyy")}
                              </div>
                            </div>
                          </div>
                          <div className="flex items-center gap-2">
                            <Badge variant="outline">v{document.version}</Badge>
                            <Badge>{document.type.toUpperCase()}</Badge>
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                )}
              </TabsContent>
            </Tabs>
          </div>
        </DialogContent>
      </Dialog>

      {/* Edit Dialog */}
      <EditUniversityDialog
        university={university}
        open={showEditDialog}
        onOpenChange={setShowEditDialog}
      />
    </>
  );
}