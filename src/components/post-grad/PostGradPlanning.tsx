import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  CheckCircle, 
  XCircle, 
  DollarSign, 
  Briefcase, 
  Globe, 
  GraduationCap,
  TrendingUp,
  Users,
  MapPin,
  Calendar
} from "lucide-react";
import { postGradInfo, universities } from "@/data/mockData";

export function PostGradPlanning() {
  const enhancedPostGradInfo = postGradInfo.map(info => {
    const university = universities.find(u => u.id === info.universityId);
    return { ...info, university };
  });

  const visaEligibleSchools = enhancedPostGradInfo.filter(info => info.optEligible).length;
  const stemDesignatedPrograms = enhancedPostGradInfo.filter(info => info.stemDesignated).length;
  const h1bSponsorshipAvailable = enhancedPostGradInfo.filter(info => info.h1bSponsorship).length;
  const averageSalary = enhancedPostGradInfo.reduce((sum, info) => sum + info.averageSalary, 0) / enhancedPostGradInfo.length;

  const getVisaStatusBadge = (optEligible: boolean, stemDesignated: boolean) => {
    if (optEligible && stemDesignated) {
      return <Badge className="bg-green-100 text-green-800">OPT + STEM Extension</Badge>;
    } else if (optEligible) {
      return <Badge className="bg-blue-100 text-blue-800">OPT Eligible</Badge>;
    } else {
      return <Badge className="bg-gray-100 text-gray-800">Limited Options</Badge>;
    }
  };

  const getSalaryRange = (salary: number) => {
    if (salary >= 120000) return "High ($120K+)";
    if (salary >= 90000) return "Good ($90K-120K)";
    if (salary >= 70000) return "Average ($70K-90K)";
    return "Below Average (<$70K)";
  };

  const getPlacementRating = (rate: number) => {
    if (rate >= 90) return { color: "text-green-600", label: "Excellent" };
    if (rate >= 80) return { color: "text-blue-600", label: "Good" };
    if (rate >= 70) return { color: "text-yellow-600", label: "Average" };
    return { color: "text-red-600", label: "Below Average" };
  };

  return (
    <div className="space-y-6">
      {/* Overview Cards */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Visa-Friendly Schools</CardTitle>
            <Globe className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{visaEligibleSchools}</div>
            <p className="text-xs text-muted-foreground">
              of {enhancedPostGradInfo.length} schools
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">STEM Programs</CardTitle>
            <GraduationCap className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stemDesignatedPrograms}</div>
            <p className="text-xs text-muted-foreground">
              36-month OPT extension
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">H1B Sponsors</CardTitle>
            <Briefcase className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{h1bSponsorshipAvailable}</div>
            <p className="text-xs text-muted-foreground">
              schools with good H1B networks
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Avg. Salary</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">${Math.round(averageSalary / 1000)}K</div>
            <p className="text-xs text-muted-foreground">
              across all programs
            </p>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="visa" className="space-y-4">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="visa">Visa & Immigration</TabsTrigger>
          <TabsTrigger value="career">Career Prospects</TabsTrigger>
          <TabsTrigger value="comparison">School Comparison</TabsTrigger>
        </TabsList>

        <TabsContent value="visa" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Globe className="h-5 w-5" />
                Visa and Immigration Information
              </CardTitle>
              <CardDescription>
                Understanding your post-graduation work opportunities
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Visa Timeline */}
              <div className="space-y-4">
                <h3 className="text-lg font-semibold">Typical Immigration Timeline</h3>
                <div className="space-y-3">
                  <div className="flex items-center justify-between p-3 border rounded-lg">
                    <div className="flex items-center gap-3">
                      <Calendar className="h-4 w-4 text-blue-600" />
                      <div>
                        <div className="font-medium">F-1 Student Status</div>
                        <div className="text-sm text-muted-foreground">During studies (2 years)</div>
                      </div>
                    </div>
                    <Badge variant="outline">Current</Badge>
                  </div>
                  
                  <div className="flex items-center justify-between p-3 border rounded-lg">
                    <div className="flex items-center gap-3">
                      <Briefcase className="h-4 w-4 text-green-600" />
                      <div>
                        <div className="font-medium">OPT (Optional Practical Training)</div>
                        <div className="text-sm text-muted-foreground">12 months work authorization</div>
                      </div>
                    </div>
                    <Badge className="bg-green-100 text-green-800">Available</Badge>
                  </div>
                  
                  <div className="flex items-center justify-between p-3 border rounded-lg">
                    <div className="flex items-center gap-3">
                      <TrendingUp className="h-4 w-4 text-purple-600" />
                      <div>
                        <div className="font-medium">STEM OPT Extension</div>
                        <div className="text-sm text-muted-foreground">Additional 24 months (STEM programs only)</div>
                      </div>
                    </div>
                    <Badge className="bg-purple-100 text-purple-800">If Eligible</Badge>
                  </div>
                  
                  <div className="flex items-center justify-between p-3 border rounded-lg">
                    <div className="flex items-center gap-3">
                      <Users className="h-4 w-4 text-orange-600" />
                      <div>
                        <div className="font-medium">H1B Visa</div>
                        <div className="text-sm text-muted-foreground">Long-term work authorization (renewable)</div>
                      </div>
                    </div>
                    <Badge className="bg-orange-100 text-orange-800">Lottery System</Badge>
                  </div>
                </div>
              </div>

              {/* School-specific Visa Info */}
              <div className="space-y-4">
                <h3 className="text-lg font-semibold">School-Specific Visa Information</h3>
                <div className="grid gap-4">
                  {enhancedPostGradInfo.map((info) => (
                    <div key={info.id} className="border rounded-lg p-4">
                      <div className="flex justify-between items-start mb-3">
                        <div>
                          <h4 className="font-semibold">{info.university?.name}</h4>
                          <p className="text-sm text-muted-foreground">{info.university?.programName}</p>
                        </div>
                        {getVisaStatusBadge(info.optEligible, info.stemDesignated)}
                      </div>
                      
                      <div className="grid gap-2 text-sm">
                        <div className="flex items-center gap-2">
                          {info.optEligible ? (
                            <CheckCircle className="h-4 w-4 text-green-600" />
                          ) : (
                            <XCircle className="h-4 w-4 text-red-600" />
                          )}
                          <span>OPT Eligible: {info.optEligible ? 'Yes' : 'No'}</span>
                        </div>
                        
                        <div className="flex items-center gap-2">
                          {info.stemDesignated ? (
                            <CheckCircle className="h-4 w-4 text-green-600" />
                          ) : (
                            <XCircle className="h-4 w-4 text-red-600" />
                          )}
                          <span>STEM Designated: {info.stemDesignated ? 'Yes (36 months total OPT)' : 'No (12 months OPT)'}</span>
                        </div>
                        
                        <div className="flex items-center gap-2">
                          {info.h1bSponsorship ? (
                            <CheckCircle className="h-4 w-4 text-green-600" />
                          ) : (
                            <XCircle className="h-4 w-4 text-red-600" />
                          )}
                          <span>H1B Support: {info.h1bSponsorship ? 'Strong employer network' : 'Limited support'}</span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="career" className="space-y-4">
          <div className="grid gap-6 md:grid-cols-2">
            {enhancedPostGradInfo.map((info) => {
              const placementRating = getPlacementRating(info.jobPlacementRate);
              return (
                <Card key={info.id}>
                  <CardHeader>
                    <CardTitle className="text-lg">{info.university?.name}</CardTitle>
                    <CardDescription>{info.university?.programName}</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    {/* Salary Information */}
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <DollarSign className="h-4 w-4 text-green-600" />
                        <span className="text-sm font-medium">Average Salary</span>
                      </div>
                      <div className="text-right">
                        <div className="font-semibold">${info.averageSalary.toLocaleString()}</div>
                        <div className="text-xs text-muted-foreground">{getSalaryRange(info.averageSalary)}</div>
                      </div>
                    </div>

                    {/* Job Placement Rate */}
                    <div className="space-y-2">
                      <div className="flex justify-between text-sm">
                        <span>Job Placement Rate</span>
                        <span className={placementRating.color}>{info.jobPlacementRate}% ({placementRating.label})</span>
                      </div>
                      <Progress value={info.jobPlacementRate} className="h-2" />
                    </div>

                    {/* Top Employers */}
                    <div className="space-y-2">
                      <h4 className="text-sm font-medium flex items-center gap-2">
                        <Briefcase className="h-4 w-4" />
                        Top Employers
                      </h4>
                      <div className="flex flex-wrap gap-1">
                        {info.topEmployers.map((employer, index) => (
                          <Badge key={index} variant="outline" className="text-xs">
                            {employer}
                          </Badge>
                        ))}
                      </div>
                    </div>

                    {/* Additional Notes */}
                    {info.notes && (
                      <div className="text-sm text-muted-foreground border-t pt-3">
                        {info.notes}
                      </div>
                    )}
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </TabsContent>

        <TabsContent value="comparison" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Career Outcomes Comparison</CardTitle>
              <CardDescription>
                Compare career prospects across your target universities
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b">
                      <th className="text-left p-2">University</th>
                      <th className="text-center p-2">Avg. Salary</th>
                      <th className="text-center p-2">Placement Rate</th>
                      <th className="text-center p-2">Visa Support</th>
                      <th className="text-center p-2">STEM Designation</th>
                    </tr>
                  </thead>
                  <tbody>
                    {enhancedPostGradInfo
                      .sort((a, b) => b.averageSalary - a.averageSalary)
                      .map((info) => (
                        <tr key={info.id} className="border-b hover:bg-muted/50">
                          <td className="p-2">
                            <div>
                              <div className="font-medium">{info.university?.name}</div>
                              <div className="text-xs text-muted-foreground">{info.university?.location}</div>
                            </div>
                          </td>
                          <td className="text-center p-2">
                            <div className="font-semibold">${Math.round(info.averageSalary / 1000)}K</div>
                          </td>
                          <td className="text-center p-2">
                            <div className={getPlacementRating(info.jobPlacementRate).color}>
                              {info.jobPlacementRate}%
                            </div>
                          </td>
                          <td className="text-center p-2">
                            {info.h1bSponsorship ? (
                              <CheckCircle className="h-4 w-4 text-green-600 mx-auto" />
                            ) : (
                              <XCircle className="h-4 w-4 text-red-600 mx-auto" />
                            )}
                          </td>
                          <td className="text-center p-2">
                            {info.stemDesignated ? (
                              <Badge className="bg-green-100 text-green-800">Yes</Badge>
                            ) : (
                              <Badge variant="outline">No</Badge>
                            )}
                          </td>
                        </tr>
                      ))}
                  </tbody>
                </table>
              </div>
            </CardContent>
          </Card>

          {/* Decision Matrix */}
          <Card>
            <CardHeader>
              <CardTitle>Decision Matrix</CardTitle>
              <CardDescription>
                Weighted scoring based on your priorities
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="text-sm text-muted-foreground">
                  Scoring: Salary (30%), Placement Rate (25%), Visa Support (25%), STEM Designation (20%)
                </div>
                <div className="space-y-2">
                  {enhancedPostGradInfo
                    .map(info => ({
                      ...info,
                      score: (
                        (info.averageSalary / 150000) * 30 +
                        (info.jobPlacementRate / 100) * 25 +
                        (info.h1bSponsorship ? 25 : 0) +
                        (info.stemDesignated ? 20 : 0)
                      )
                    }))
                    .sort((a, b) => b.score - a.score)
                    .map((info, index) => (
                      <div key={info.id} className="flex items-center justify-between p-3 border rounded-lg">
                        <div className="flex items-center gap-3">
                          <div className="text-lg font-bold text-muted-foreground">#{index + 1}</div>
                          <div>
                            <div className="font-medium">{info.university?.name}</div>
                            <div className="text-sm text-muted-foreground">Overall Score: {Math.round(info.score)}/100</div>
                          </div>
                        </div>
                        <Progress value={info.score} className="w-24 h-2" />
                      </div>
                    ))}
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}