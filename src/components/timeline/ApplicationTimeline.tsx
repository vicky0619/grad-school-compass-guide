import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { CheckCircle, Clock, AlertCircle, Calendar, FileText, Send, GraduationCap } from "lucide-react";
import { universities, deadlines } from "@/data/mockData";
import { format, addMonths, isBefore, isAfter, differenceInDays } from "date-fns";

export function ApplicationTimeline() {
  // Generate timeline milestones
  const generateTimeline = () => {
    const now = new Date();
    const applicationSeason = new Date('2024-12-01'); // Typical application deadline season
    const decisionSeason = new Date('2025-03-01'); // Typical decision notification season
    const enrollmentDeadline = new Date('2025-05-01'); // Typical enrollment deadline

    const milestones = [
      {
        id: 'research',
        title: 'Research Phase',
        description: 'Research universities, programs, and requirements',
        startDate: addMonths(now, -6),
        endDate: addMonths(now, -3),
        status: 'completed',
        icon: <FileText className="h-4 w-4" />,
        color: 'bg-green-100 text-green-800',
        tasks: [
          'Research target universities',
          'Understand program requirements',
          'Create university shortlist',
          'Gather application materials'
        ]
      },
      {
        id: 'preparation',
        title: 'Preparation Phase',
        description: 'Prepare application materials and take required tests',
        startDate: addMonths(now, -4),
        endDate: addMonths(now, -1),
        status: 'completed',
        icon: <Clock className="h-4 w-4" />,
        color: 'bg-blue-100 text-blue-800',
        tasks: [
          'Take GRE/GMAT',
          'Take TOEFL/IELTS (if needed)',
          'Write Statement of Purpose',
          'Prepare recommendation letters',
          'Update CV/Resume'
        ]
      },
      {
        id: 'application',
        title: 'Application Phase',
        description: 'Submit applications to universities',
        startDate: addMonths(now, -1),
        endDate: applicationSeason,
        status: 'in_progress',
        icon: <Send className="h-4 w-4" />,
        color: 'bg-yellow-100 text-yellow-800',
        tasks: [
          'Submit applications',
          'Pay application fees',
          'Send official transcripts',
          'Follow up on recommendations',
          'Complete interviews (if required)'
        ]
      },
      {
        id: 'waiting',
        title: 'Waiting Phase',
        description: 'Wait for admission decisions',
        startDate: applicationSeason,
        endDate: decisionSeason,
        status: 'pending',
        icon: <AlertCircle className="h-4 w-4" />,
        color: 'bg-gray-100 text-gray-800',
        tasks: [
          'Monitor application status',
          'Prepare for interviews',
          'Apply for scholarships',
          'Research visa requirements',
          'Plan campus visits'
        ]
      },
      {
        id: 'decision',
        title: 'Decision Phase',
        description: 'Receive and evaluate admission offers',
        startDate: decisionSeason,
        endDate: enrollmentDeadline,
        status: 'pending',
        icon: <GraduationCap className="h-4 w-4" />,
        color: 'bg-purple-100 text-purple-800',
        tasks: [
          'Review admission offers',
          'Compare financial aid packages',
          'Visit campuses',
          'Make final decision',
          'Confirm enrollment'
        ]
      }
    ];

    return milestones;
  };

  const milestones = generateTimeline();
  const currentMilestone = milestones.find(m => m.status === 'in_progress') || milestones[0];
  
  // Calculate overall progress
  const completedMilestones = milestones.filter(m => m.status === 'completed').length;
  const totalMilestones = milestones.length;
  const overallProgress = (completedMilestones / totalMilestones) * 100;

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'completed':
        return <CheckCircle className="h-5 w-5 text-green-600" />;
      case 'in_progress':
        return <Clock className="h-5 w-5 text-yellow-600" />;
      case 'pending':
        return <AlertCircle className="h-5 w-5 text-gray-400" />;
      default:
        return <Clock className="h-5 w-5 text-gray-400" />;
    }
  };

  const getMilestoneProgress = (milestone: { status: string; startDate: Date | string; endDate: Date | string }) => {
    if (milestone.status === 'completed') return 100;
    if (milestone.status === 'pending') return 0;
    
    // For in-progress, calculate based on dates
    const now = new Date();
    const start = new Date(milestone.startDate);
    const end = new Date(milestone.endDate);
    
    if (isBefore(now, start)) return 0;
    if (isAfter(now, end)) return 100;
    
    const totalDays = differenceInDays(end, start);
    const elapsedDays = differenceInDays(now, start);
    
    return Math.min(100, Math.max(0, (elapsedDays / totalDays) * 100));
  };

  return (
    <div className="space-y-6">
      {/* Overall Progress */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Calendar className="h-5 w-5" />
            Application Timeline Progress
          </CardTitle>
          <CardDescription>
            Track your progress through the graduate school application process
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="flex justify-between text-sm">
              <span>Overall Progress</span>
              <span>{Math.round(overallProgress)}% Complete</span>
            </div>
            <Progress value={overallProgress} className="h-3" />
            <div className="text-sm text-muted-foreground">
              {completedMilestones} of {totalMilestones} milestones completed
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Timeline Milestones */}
      <div className="space-y-4">
        {milestones.map((milestone, index) => (
          <Card key={milestone.id} className={`${milestone.status === 'in_progress' ? 'ring-2 ring-blue-200' : ''}`}>
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  {getStatusIcon(milestone.status)}
                  <div>
                    <CardTitle className="text-lg">{milestone.title}</CardTitle>
                    <CardDescription>{milestone.description}</CardDescription>
                  </div>
                </div>
                <Badge className={milestone.color}>
                  {milestone.status.charAt(0).toUpperCase() + milestone.status.slice(1)}
                </Badge>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              {/* Timeline Dates */}
              <div className="flex justify-between text-sm text-muted-foreground">
                <span>Start: {format(new Date(milestone.startDate), 'MMM d, yyyy')}</span>
                <span>End: {format(new Date(milestone.endDate), 'MMM d, yyyy')}</span>
              </div>

              {/* Progress Bar */}
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span>Phase Progress</span>
                  <span>{Math.round(getMilestoneProgress(milestone))}%</span>
                </div>
                <Progress value={getMilestoneProgress(milestone)} className="h-2" />
              </div>

              {/* Tasks Checklist */}
              <div className="space-y-2">
                <h4 className="text-sm font-medium">Key Tasks:</h4>
                <div className="grid gap-2">
                  {milestone.tasks.map((task, taskIndex) => (
                    <div key={taskIndex} className="flex items-center gap-2 text-sm">
                      <CheckCircle className={`h-3 w-3 ${
                        milestone.status === 'completed' || (milestone.status === 'in_progress' && taskIndex < 2)
                          ? 'text-green-600' 
                          : 'text-gray-300'
                      }`} />
                      <span className={
                        milestone.status === 'completed' || (milestone.status === 'in_progress' && taskIndex < 2)
                          ? 'line-through text-muted-foreground' 
                          : ''
                      }>
                        {task}
                      </span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Action Button */}
              {milestone.status === 'in_progress' && (
                <Button variant="outline" className="w-full">
                  View Current Tasks
                </Button>
              )}
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Quick Stats */}
      <div className="grid gap-4 md:grid-cols-3">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Applications Submitted</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {universities.filter(u => u.status === 'applied').length}
            </div>
            <p className="text-xs text-muted-foreground">
              of {universities.length} planned
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Upcoming Deadlines</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {deadlines.filter(d => 
                new Date(d.date) > new Date() && 
                differenceInDays(new Date(d.date), new Date()) <= 30
              ).length}
            </div>
            <p className="text-xs text-muted-foreground">
              in next 30 days
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Current Focus</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-sm font-bold">{currentMilestone.title}</div>
            <p className="text-xs text-muted-foreground">
              {currentMilestone.description}
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}