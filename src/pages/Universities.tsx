
import { UniversityTable } from "@/components/universities/UniversityTable";
import { RequirementsTracker } from "@/components/universities/RequirementsTracker";
import { PostGradPlanning } from "@/components/post-grad/PostGradPlanning";
import { AddUniversityDialog } from "@/components/forms/AddUniversityDialog";
import { AIRecommendations } from "@/components/ai/AIRecommendations";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { BarChart3, Target, GraduationCap, Sparkles } from "lucide-react";
import { useUniversities } from "@/hooks/useUniversities";

export default function Universities() {
  const { data: universities = [], isLoading } = useUniversities();
  
  const stats = {
    total: universities.length,
    applied: universities.filter(u => u.status === 'applied').length,
    admitted: universities.filter(u => u.status === 'admitted').length,
    reach: universities.filter(u => u.tag === 'reach').length,
    target: universities.filter(u => u.tag === 'target').length,
    safety: universities.filter(u => u.tag === 'safety').length,
  };

  if (isLoading) {
    return (
      <div className="space-y-6">
        <h2 className="text-3xl font-bold tracking-tight">Universities</h2>
        <div className="flex items-center justify-center p-8">
          <div className="text-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto"></div>
            <p className="mt-2 text-muted-foreground">Loading universities...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-3xl font-bold tracking-tight">Universities</h2>
        <AddUniversityDialog />
      </div>

      {/* Quick Stats */}
      <div className="grid gap-4 md:grid-cols-3 lg:grid-cols-6">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Total</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.total}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Applied</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.applied}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Admitted</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.admitted}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Reach</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.reach}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Target</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.target}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Safety</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.safety}</div>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="list" className="space-y-4">
        <TabsList className="grid w-full grid-cols-5">
          <TabsTrigger value="list">University List</TabsTrigger>
          <TabsTrigger value="ai-recommendations" className="flex items-center gap-1">
            <Sparkles className="h-4 w-4" />
            AI Recommendations
          </TabsTrigger>
          <TabsTrigger value="requirements">Requirements</TabsTrigger>
          <TabsTrigger value="analytics">Analytics</TabsTrigger>
          <TabsTrigger value="career">Career Planning</TabsTrigger>
        </TabsList>
        
        <TabsContent value="list" className="space-y-4">
          <UniversityTable />
        </TabsContent>
        
        <TabsContent value="ai-recommendations" className="space-y-4">
          <AIRecommendations />
        </TabsContent>
        
        <TabsContent value="requirements" className="space-y-4">
          <div className="grid gap-6 md:grid-cols-2">
            {universities.slice(0, 4).map(university => (
              <RequirementsTracker key={university.id} universityId={university.id} />
            ))}
          </div>
        </TabsContent>
        
        <TabsContent value="analytics" className="space-y-4">
          <div className="grid gap-6 md:grid-cols-2">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <BarChart3 className="h-5 w-5" />
                  Application Strategy
                </CardTitle>
                <CardDescription>Distribution of your university targets</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex justify-between items-center">
                    <span className="text-sm font-medium">Reach Schools</span>
                    <span className="text-sm text-muted-foreground">{stats.reach} universities</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm font-medium">Target Schools</span>
                    <span className="text-sm text-muted-foreground">{stats.target} universities</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm font-medium">Safety Schools</span>
                    <span className="text-sm text-muted-foreground">{stats.safety} universities</span>
                  </div>
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Target className="h-5 w-5" />
                  Success Rate
                </CardTitle>
                <CardDescription>Track your application success</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="text-center">
                    <div className="text-3xl font-bold">{stats.applied > 0 ? Math.round((stats.admitted / stats.applied) * 100) : 0}%</div>
                    <p className="text-sm text-muted-foreground">Admission Rate</p>
                  </div>
                  <div className="text-center">
                    <div className="text-lg font-semibold">{stats.admitted} / {stats.applied}</div>
                    <p className="text-sm text-muted-foreground">Admitted / Applied</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
        
        <TabsContent value="career" className="space-y-4">
          <PostGradPlanning />
        </TabsContent>
      </Tabs>
    </div>
  );
}
