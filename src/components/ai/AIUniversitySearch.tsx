import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from "@/components/ui/command";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Sparkles, Search, MapPin, Star, TrendingUp, Globe, Calendar, DollarSign } from "lucide-react";
import { cn } from "@/lib/utils";

interface UniversityData {
  id: string;
  name: string;
  location: string;
  country: string;
  ranking: number;
  acceptance_rate: number;
  tuition: number;
  application_deadline: string;
  programs: string[];
  requirements: {
    gpa: number;
    gre: number;
    toefl: number;
  };
  website: string;
}

// Mock AI 數據 - 實際應用中會連接真實 API
const mockUniversityData: UniversityData[] = [
  {
    id: "stanford",
    name: "Stanford University",
    location: "Stanford, CA",
    country: "USA",
    ranking: 2,
    acceptance_rate: 4.3,
    tuition: 56169,
    application_deadline: "2024-12-01",
    programs: ["Computer Science", "Engineering", "Business", "Medicine"],
    requirements: { gpa: 3.9, gre: 328, toefl: 100 },
    website: "https://www.stanford.edu"
  },
  {
    id: "mit",
    name: "Massachusetts Institute of Technology",
    location: "Cambridge, MA", 
    country: "USA",
    ranking: 1,
    acceptance_rate: 6.7,
    tuition: 53790,
    application_deadline: "2024-12-15",
    programs: ["Computer Science", "Engineering", "Physics", "Mathematics"],
    requirements: { gpa: 3.9, gre: 330, toefl: 100 },
    website: "https://www.mit.edu"
  },
  {
    id: "oxford",
    name: "University of Oxford",
    location: "Oxford",
    country: "UK", 
    ranking: 4,
    acceptance_rate: 17.5,
    tuition: 35000,
    application_deadline: "2024-12-01",
    programs: ["Computer Science", "Engineering", "Medicine", "Law"],
    requirements: { gpa: 3.8, gre: 320, toefl: 100 },
    website: "https://www.ox.ac.uk"
  }
];

interface AIUniversitySearchProps {
  onUniversitySelect: (university: UniversityData) => void;
}

export function AIUniversitySearch({ onUniversitySelect }: AIUniversitySearchProps) {
  const [query, setQuery] = useState("");
  const [suggestions, setSuggestions] = useState<UniversityData[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [open, setOpen] = useState(false);

  // AI 搜索模擬
  const performAISearch = async (searchQuery: string) => {
    if (!searchQuery.trim()) return;
    
    setIsLoading(true);
    
    // 模擬 AI API 調用延遲
    await new Promise(resolve => setTimeout(resolve, 800));
    
    // 智能匹配邏輯
    const filtered = mockUniversityData.filter(university => 
      university.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      university.location.toLowerCase().includes(searchQuery.toLowerCase()) ||
      university.programs.some(program => 
        program.toLowerCase().includes(searchQuery.toLowerCase())
      )
    );
    
    setSuggestions(filtered);
    setIsLoading(false);
    setOpen(true);
  };

  useEffect(() => {
    const debounceTimer = setTimeout(() => {
      if (query.length > 2) {
        performAISearch(query);
      }
    }, 300);

    return () => clearTimeout(debounceTimer);
  }, [query]);

  const handleUniversitySelect = (university: UniversityData) => {
    onUniversitySelect(university);
    setOpen(false);
    setQuery("");
  };

  return (
    <div className="space-y-4">
      {/* AI 搜索標題 */}
      <div className="flex items-center space-x-2">
        <Sparkles className="h-5 w-5 text-primary" />
        <Label className="text-base font-medium">AI University Search</Label>
        <Badge variant="secondary" className="text-xs">Beta</Badge>
      </div>

      {/* 搜索輸入 */}
      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger asChild>
          <div className="relative">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search universities with AI... (e.g. 'CS PhD at top US universities')"
              className="pl-10 bg-gradient-to-r from-blue-50 to-indigo-50 border-blue-200 focus:border-blue-400 focus:ring-blue-400"
            />
            {isLoading && (
              <div className="absolute right-3 top-1/2 -translate-y-1/2">
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-primary"></div>
              </div>
            )}
          </div>
        </PopoverTrigger>
        
        <PopoverContent className="w-[600px] p-0" align="start">
          <Command>
            <CommandEmpty>
              {isLoading ? (
                <div className="flex items-center justify-center p-6">
                  <div className="flex items-center space-x-2">
                    <Sparkles className="h-4 w-4 animate-pulse text-primary" />
                    <span className="text-sm text-muted-foreground">AI is searching universities...</span>
                  </div>
                </div>
              ) : (
                <div className="flex items-center justify-center p-6">
                  <span className="text-sm text-muted-foreground">No universities found. Try a different search.</span>
                </div>
              )}
            </CommandEmpty>
            
            <CommandGroup heading="AI Suggestions">
              <CommandList>
                {suggestions.map((university) => (
                  <CommandItem
                    key={university.id}
                    onSelect={() => handleUniversitySelect(university)}
                    className="p-0"
                  >
                    <Card className="w-full border-0 shadow-none hover:bg-accent/50 transition-colors">
                      <CardContent className="p-4">
                        <div className="flex items-start justify-between">
                          <div className="space-y-2">
                            <div className="flex items-center space-x-2">
                              <h4 className="font-semibold text-sm">{university.name}</h4>
                              <Badge variant="outline" className="text-xs">
                                #{university.ranking} Global
                              </Badge>
                            </div>
                            
                            <div className="flex items-center space-x-4 text-xs text-muted-foreground">
                              <div className="flex items-center space-x-1">
                                <MapPin className="h-3 w-3" />
                                <span>{university.location}</span>
                              </div>
                              <div className="flex items-center space-x-1">
                                <TrendingUp className="h-3 w-3" />
                                <span>{university.acceptance_rate}% acceptance</span>
                              </div>
                              <div className="flex items-center space-x-1">
                                <DollarSign className="h-3 w-3" />
                                <span>${university.tuition.toLocaleString()}/year</span>
                              </div>
                            </div>
                            
                            <div className="flex flex-wrap gap-1">
                              {university.programs.slice(0, 3).map((program) => (
                                <Badge key={program} variant="secondary" className="text-xs">
                                  {program}
                                </Badge>
                              ))}
                              {university.programs.length > 3 && (
                                <Badge variant="secondary" className="text-xs">
                                  +{university.programs.length - 3} more
                                </Badge>
                              )}
                            </div>
                          </div>
                          
                          <div className="text-right space-y-1">
                            <div className="flex items-center space-x-1">
                              <Star className="h-3 w-3 text-yellow-500" />
                              <span className="text-xs font-medium">AI Match: 95%</span>
                            </div>
                            <div className="flex items-center space-x-1">
                              <Calendar className="h-3 w-3 text-blue-500" />
                              <span className="text-xs">Due: Dec 1</span>
                            </div>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  </CommandItem>
                ))}
              </CommandList>
            </CommandGroup>
          </Command>
        </PopoverContent>
      </Popover>

      {/* AI 功能說明 */}
      <div className="text-xs text-muted-foreground bg-blue-50 p-3 rounded-lg border border-blue-200">
        <div className="flex items-start space-x-2">
          <Sparkles className="h-4 w-4 text-blue-600 mt-0.5 flex-shrink-0" />
          <div>
            <p className="font-medium text-blue-800">AI-Powered Search</p>
            <p className="text-blue-700">
              Our AI understands natural language queries like "top engineering schools in California" 
              or "affordable CS programs in Europe" and provides smart suggestions with comprehensive data.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}