
import { StatusCard } from "@/components/dashboard/StatusCard";
import { UpcomingDeadlines } from "@/components/dashboard/UpcomingDeadlines";
import { RecentUniversities } from "@/components/dashboard/RecentUniversities";
import { NotificationCenter } from "@/components/notifications/NotificationCenter";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useUniversities } from "@/hooks/useUniversities";
import { useDeadlines } from "@/hooks/useDeadlines";
import { useDocuments } from "@/hooks/useDocuments";
import { CalendarDays, BookOpen, FileText, TrendingUp, Target, AlertCircle, CheckCircle, Bell } from "lucide-react";
import { ResponsiveContainer, PieChart, Pie, Cell, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, LineChart, Line } from "recharts";

export default function Dashboard() {
  const { data: universities = [], isLoading: universitiesLoading } = useUniversities();
  const { data: deadlines = [], isLoading: deadlinesLoading } = useDeadlines();
  const { data: documents = [], isLoading: documentsLoading } = useDocuments();

  const isLoading = universitiesLoading || deadlinesLoading || documentsLoading;

  if (isLoading) {
    return (
      <div className="space-y-6">
        <h2 className="text-3xl font-bold tracking-tight">Dashboard</h2>
        <div className="flex items-center justify-center p-8">
          <div className="text-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto"></div>
            <p className="mt-2 text-muted-foreground">Loading dashboard...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <h2 className="text-3xl font-bold tracking-tight">Dashboard</h2>
      
      <Tabs defaultValue="overview" className="space-y-4">
        <TabsList>
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="notifications">Notifications</TabsTrigger>
        </TabsList>
        
        <TabsContent value="overview" className="space-y-6">
      
      {/* Key Metrics Row */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Universities</CardTitle>
            <Target className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{universities.length}</div>
            <p className="text-xs text-muted-foreground">+2 from last month</p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Applications Submitted</CardTitle>
            <CheckCircle className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{universities.filter(u => u.status === 'applied').length}</div>
            <p className="text-xs text-muted-foreground">of {universities.length} total</p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Upcoming Deadlines</CardTitle>
            <AlertCircle className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {deadlines.filter(d => new Date(d.date) > new Date() && 
                Math.ceil((new Date(d.date).getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24)) <= 30).length}
            </div>
            <p className="text-xs text-muted-foreground">in next 30 days</p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Documents Ready</CardTitle>
            <FileText className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{documents.length}</div>
            <p className="text-xs text-muted-foreground">across all applications</p>
          </CardContent>
        </Card>
      </div>

      {/* Analytics and Progress Row */}
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {/* Application Status Chart */}
        <Card className="col-span-full lg:col-span-1">
          <CardHeader>
            <CardTitle>Application Status</CardTitle>
            <CardDescription>Distribution of your applications</CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={200}>
              <PieChart>
                <Pie
                  data={[
                    { name: 'Researching', value: universities.filter(u => u.status === 'researching').length, color: '#9DB2BF' },
                    { name: 'Applied', value: universities.filter(u => u.status === 'applied').length, color: '#526D82' },
                    { name: 'Admitted', value: universities.filter(u => u.status === 'admitted').length, color: '#27374D' },
                    { name: 'Rejected', value: universities.filter(u => u.status === 'rejected').length, color: '#B8860B' },
                    { name: 'Pending', value: universities.filter(u => u.status === 'pending').length, color: '#526D82' },
                  ]}
                  cx="50%"
                  cy="50%"
                  innerRadius={40}
                  outerRadius={80}
                  paddingAngle={5}
                  dataKey="value"
                >
                  {[
                    { name: 'Researching', value: universities.filter(u => u.status === 'researching').length, color: '#9DB2BF' },
                    { name: 'Applied', value: universities.filter(u => u.status === 'applied').length, color: '#526D82' },
                    { name: 'Admitted', value: universities.filter(u => u.status === 'admitted').length, color: '#27374D' },
                    { name: 'Rejected', value: universities.filter(u => u.status === 'rejected').length, color: '#B8860B' },
                    { name: 'Pending', value: universities.filter(u => u.status === 'pending').length, color: '#526D82' },
                  ].map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Progress Overview */}
        <Card>
          <CardHeader>
            <CardTitle>Application Progress</CardTitle>
            <CardDescription>Your overall progress</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span>Applications Submitted</span>
                <span>{Math.round((universities.filter(u => u.status === 'applied').length / universities.length) * 100)}%</span>
              </div>
              <Progress value={(universities.filter(u => u.status === 'applied').length / universities.length) * 100} className="h-2" />
            </div>
            
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span>Documents Prepared</span>
                <span>80%</span>
              </div>
              <Progress value={80} className="h-2" />
            </div>
            
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span>Deadlines Met</span>
                <span>95%</span>
              </div>
              <Progress value={95} className="h-2" />
            </div>
            
            <div className="pt-2">
              <Button className="w-full" variant="outline">
                View Detailed Progress
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* School Categories */}
        <Card>
          <CardHeader>
            <CardTitle>School Categories</CardTitle>
            <CardDescription>Your target strategy</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <Badge variant="outline" className="tag-reach">Reach</Badge>
                  <span className="text-sm">Schools</span>
                </div>
                <span className="font-semibold">{universities.filter(u => u.tag === 'reach').length}</span>
              </div>
              
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <Badge variant="outline" className="tag-target">Target</Badge>
                  <span className="text-sm">Schools</span>
                </div>
                <span className="font-semibold">{universities.filter(u => u.tag === 'target').length}</span>
              </div>
              
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <Badge variant="outline" className="tag-safety">Safety</Badge>
                  <span className="text-sm">Schools</span>
                </div>
                <span className="font-semibold">{universities.filter(u => u.tag === 'safety').length}</span>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

          {/* Existing Components Row */}
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            <StatusCard />
            <UpcomingDeadlines />
            <RecentUniversities />
          </div>
          
          <div className="text-sm text-muted-foreground mt-8">
            <p>Welcome to your Grad School Compass! This tool helps you manage all aspects of your Fall 2026 MSCS application process.</p>
            <p className="mt-2">Use the sidebar to navigate between different sections, track your progress, and stay organized.</p>
          </div>
        </TabsContent>
        
        <TabsContent value="notifications" className="space-y-4">
          <NotificationCenter />
        </TabsContent>
      </Tabs>
    </div>
  );
}
