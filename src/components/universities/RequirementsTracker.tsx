import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { CheckCircle, XCircle, AlertCircle, Clock } from "lucide-react";
import { requirements } from "@/data/mockData";

interface RequirementsTrackerProps {
  universityId: string;
}

export function RequirementsTracker({ universityId }: RequirementsTrackerProps) {
  const universityRequirements = requirements.find(req => req.universityId === universityId);
  
  if (!universityRequirements) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Requirements</CardTitle>
          <CardDescription>No requirements data available</CardDescription>
        </CardHeader>
      </Card>
    );
  }

  const requirements_list = [
    {
      name: "GRE General",
      required: universityRequirements.gre > 0,
      target: universityRequirements.gre,
      current: 320, // Mock current score
      status: 320 >= universityRequirements.gre ? "met" : "pending",
      type: "score"
    },
    {
      name: "TOEFL/IELTS",
      required: universityRequirements.toefl > 0,
      target: universityRequirements.toefl,
      current: 105, // Mock current score
      status: 105 >= universityRequirements.toefl ? "met" : "pending",
      type: "score"
    },
    {
      name: "GPA",
      required: universityRequirements.gpa > 0,
      target: universityRequirements.gpa,
      current: 3.7, // Mock current GPA
      status: 3.7 >= universityRequirements.gpa ? "met" : "pending",
      type: "score"
    },
    {
      name: "Background Requirements",
      required: !!universityRequirements.background,
      description: universityRequirements.background,
      status: "met", // Mock status
      type: "requirement"
    }
  ];

  const metRequirements = requirements_list.filter(req => req.required && req.status === "met").length;
  const totalRequirements = requirements_list.filter(req => req.required).length;
  const completionPercentage = totalRequirements > 0 ? (metRequirements / totalRequirements) * 100 : 0;

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "met":
        return <CheckCircle className="h-4 w-4 text-green-600" />;
      case "pending":
        return <Clock className="h-4 w-4 text-yellow-600" />;
      case "not_met":
        return <XCircle className="h-4 w-4 text-red-600" />;
      default:
        return <AlertCircle className="h-4 w-4 text-gray-400" />;
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "met":
        return <Badge variant="default" className="bg-green-100 text-green-800">Met</Badge>;
      case "pending":
        return <Badge variant="default" className="bg-yellow-100 text-yellow-800">Pending</Badge>;
      case "not_met":
        return <Badge variant="destructive">Not Met</Badge>;
      default:
        return <Badge variant="secondary">Unknown</Badge>;
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          Requirements Tracker
          <Badge variant="outline">
            {metRequirements}/{totalRequirements} Complete
          </Badge>
        </CardTitle>
        <CardDescription>
          Track your progress against admission requirements
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Overall Progress */}
        <div className="space-y-2">
          <div className="flex justify-between text-sm">
            <span>Overall Completion</span>
            <span>{Math.round(completionPercentage)}%</span>
          </div>
          <Progress value={completionPercentage} className="h-2" />
        </div>

        {/* Individual Requirements */}
        <div className="space-y-4">
          {requirements_list.map((req, index) => (
            req.required && (
              <div key={index} className="flex items-center justify-between p-3 border rounded-lg">
                <div className="flex items-center space-x-3">
                  {getStatusIcon(req.status)}
                  <div>
                    <div className="font-medium">{req.name}</div>
                    {req.type === "score" && (
                      <div className="text-sm text-muted-foreground">
                        {req.current !== undefined ? `Your Score: ${req.current}` : "No score recorded"} 
                        {req.target && ` | Required: ${req.target}+`}
                      </div>
                    )}
                    {req.type === "requirement" && req.description && (
                      <div className="text-sm text-muted-foreground">{req.description}</div>
                    )}
                  </div>
                </div>
                <div className="flex items-center space-x-2">
                  {getStatusBadge(req.status)}
                </div>
              </div>
            )
          ))}
        </div>

        {/* Notes Section */}
        {universityRequirements.notes && (
          <div className="border-t pt-4">
            <h4 className="font-medium mb-2">Additional Notes</h4>
            <p className="text-sm text-muted-foreground">{universityRequirements.notes}</p>
          </div>
        )}

        {/* Action Items */}
        <div className="border-t pt-4">
          <h4 className="font-medium mb-2">Action Items</h4>
          <div className="space-y-2 text-sm">
            {requirements_list
              .filter(req => req.required && req.status === "pending")
              .map((req, index) => (
                <div key={index} className="flex items-center space-x-2 text-yellow-700">
                  <AlertCircle className="h-3 w-3" />
                  <span>Complete {req.name} requirement</span>
                </div>
              ))}
            {requirements_list.filter(req => req.required && req.status === "pending").length === 0 && (
              <div className="flex items-center space-x-2 text-green-700">
                <CheckCircle className="h-3 w-3" />
                <span>All requirements completed!</span>
              </div>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}