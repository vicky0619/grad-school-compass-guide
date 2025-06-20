import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Sparkles, TrendingUp, MapPin, Star, DollarSign, Calendar, Users, BookOpen } from "lucide-react";
import { useUniversities } from "@/hooks/useUniversities";

interface RecommendationData {
  university: string;
  program: string;
  location: string;
  ranking: number;
  matchScore: number;
  reasons: string[];
  category: 'reach' | 'target' | 'safety';
  tuition: number;
  acceptance_rate: number;
  deadline: string;
}

// Mock AI 推薦數據
const mockRecommendations: RecommendationData[] = [
  {
    university: "Carnegie Mellon University",
    program: "MS Computer Science",
    location: "Pittsburgh, PA",
    ranking: 3,
    matchScore: 92,
    reasons: ["Strong CS program", "Research opportunities", "Industry connections"],
    category: "reach",
    tuition: 58924,
    acceptance_rate: 15.4,
    deadline: "2024-12-15"
  },
  {
    university: "University of Washington",
    program: "MS Computer Science",
    location: "Seattle, WA", 
    ranking: 6,
    matchScore: 88,
    reasons: ["Tech industry proximity", "Affordable tuition", "Strong research"],
    category: "target",
    tuition: 36588,
    acceptance_rate: 22.1,
    deadline: "2024-12-01"
  },
  {
    university: "Georgia Institute of Technology",
    program: "MS Computer Science",
    location: "Atlanta, GA",
    ranking: 8,
    matchScore: 85,
    reasons: ["Excellent ROI", "Strong alumni network", "Diverse programs"],
    category: "safety",
    tuition: 29890,
    acceptance_rate: 31.2,
    deadline: "2024-01-15"
  }
];

export function AIRecommendations() {
  const [recommendations, setRecommendations] = useState<RecommendationData[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [showRecommendations, setShowRecommendations] = useState(false);
  const { data: universities = [] } = useUniversities();

  const generateRecommendations = async () => {
    setIsLoading(true);
    setShowRecommendations(true);
    
    // 模擬 AI 分析和推薦生成
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    // 基於現有大學數據進行智能推薦
    const userPreferences = analyzeUserPreferences();
    const filtered = mockRecommendations.filter(rec => 
      !universities.some(uni => uni.name.toLowerCase().includes(rec.university.toLowerCase()))
    );
    
    setRecommendations(filtered);
    setIsLoading(false);
  };

  const analyzeUserPreferences = () => {
    // 分析用戶已添加的大學偏好
    const locations = universities.map(u => u.location);
    const statuses = universities.map(u => u.status);
    const tags = universities.map(u => u.tag);
    
    return {
      preferredLocations: [...new Set(locations)],
      applicationStage: statuses,
      riskProfile: tags
    };
  };

  const getCategoryColor = (category: string) => {
    switch (category) {
      case 'reach': return 'bg-red-100 text-red-700 border-red-200';
      case 'target': return 'bg-blue-100 text-blue-700 border-blue-200';
      case 'safety': return 'bg-green-100 text-green-700 border-green-200';
      default: return 'bg-gray-100 text-gray-700 border-gray-200';
    }
  };

  const getMatchScoreColor = (score: number) => {
    if (score >= 90) return 'text-green-600';
    if (score >= 80) return 'text-blue-600';
    if (score >= 70) return 'text-orange-600';
    return 'text-red-600';
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="text-center space-y-2">
        <div className="flex items-center justify-center gap-2">
          <Sparkles className="h-6 w-6 text-primary" />
          <h2 className="text-2xl font-semibold">AI University Recommendations</h2>
        </div>
        <p className="text-muted-foreground max-w-2xl mx-auto">
          Get personalized university suggestions based on your profile, preferences, and application history using our AI analysis.
        </p>
      </div>

      {/* Generate Button */}
      {!showRecommendations && (
        <div className="text-center">
          <Button 
            onClick={generateRecommendations}
            className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700"
            size="lg"
          >
            <Sparkles className="mr-2 h-5 w-5" />
            Generate AI Recommendations
          </Button>
        </div>
      )}

      {/* Loading State */}
      {isLoading && (
        <div className="text-center py-12">
          <div className="flex items-center justify-center space-x-2 mb-4">
            <Sparkles className="h-6 w-6 animate-pulse text-primary" />
            <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-primary"></div>
          </div>
          <p className="text-muted-foreground">AI is analyzing your profile and generating recommendations...</p>
          <div className="mt-4 space-y-2 text-sm text-muted-foreground">
            <p>• Analyzing your university preferences</p>
            <p>• Matching with global university database</p>
            <p>• Calculating compatibility scores</p>
          </div>
        </div>
      )}

      {/* Recommendations */}
      {showRecommendations && !isLoading && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-medium">Personalized Recommendations</h3>
            <Button 
              variant="outline" 
              size="sm"
              onClick={generateRecommendations}
              className="flex items-center gap-1"
            >
              <Sparkles className="h-4 w-4" />
              Refresh
            </Button>
          </div>

          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {recommendations.map((rec, index) => (
              <Card key={index} className="border-2 hover:shadow-md transition-all duration-200">
                <CardHeader className="space-y-2">
                  <div className="flex items-start justify-between">
                    <div className="space-y-1">
                      <CardTitle className="text-lg">{rec.university}</CardTitle>
                      <CardDescription>{rec.program}</CardDescription>
                    </div>
                    <div className="text-right space-y-1">
                      <Badge className={getCategoryColor(rec.category)}>
                        {rec.category.toUpperCase()}
                      </Badge>
                      <div className={`text-sm font-bold ${getMatchScoreColor(rec.matchScore)}`}>
                        {rec.matchScore}% Match
                      </div>
                    </div>
                  </div>
                </CardHeader>
                
                <CardContent className="space-y-4">
                  {/* Key Stats */}
                  <div className="grid grid-cols-2 gap-2 text-sm">
                    <div className="flex items-center gap-1">
                      <Star className="h-3 w-3 text-yellow-500" />
                      <span>#{rec.ranking} Ranking</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <TrendingUp className="h-3 w-3 text-green-500" />
                      <span>{rec.acceptance_rate}% Accept</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <MapPin className="h-3 w-3 text-blue-500" />
                      <span>{rec.location}</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <DollarSign className="h-3 w-3 text-orange-500" />
                      <span>${(rec.tuition/1000).toFixed(0)}k/year</span>
                    </div>
                  </div>

                  {/* AI Reasons */}
                  <div className="space-y-2">
                    <p className="text-xs font-medium text-muted-foreground">Why AI recommends this:</p>
                    <div className="space-y-1">
                      {rec.reasons.map((reason, idx) => (
                        <div key={idx} className="flex items-start gap-2 text-xs">
                          <span className="text-primary mt-1">•</span>
                          <span>{reason}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Action Button */}
                  <Button 
                    variant="outline" 
                    size="sm" 
                    className="w-full"
                    onClick={() => {
                      // This would integrate with the AddUniversityDialog
                      console.log(`Adding ${rec.university} to list`);
                    }}
                  >
                    Add to My List
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>

          {/* AI Insights */}
          <Card className="bg-gradient-to-r from-blue-50 to-purple-50 border-blue-200">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-blue-800">
                <BookOpen className="h-5 w-5" />
                AI Insights
              </CardTitle>
            </CardHeader>
            <CardContent className="text-blue-700 space-y-2">
              <p className="text-sm">
                Based on your current university list, our AI suggests you focus on:
              </p>
              <ul className="text-sm space-y-1 ml-4">
                <li>• Adding 1-2 more safety schools for balanced portfolio</li>
                <li>• Consider universities with earlier deadlines (December 1st)</li>
                <li>• Research universities in tech hubs for better internship opportunities</li>
              </ul>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
}