import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from "@/components/ui/command";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Sparkles, Search, MapPin, Star, TrendingUp, Globe, Calendar, DollarSign, AlertCircle } from "lucide-react";
import { cn } from "@/lib/utils";
import { perplexityApi, UniversitySearchResult } from "@/services/perplexityApi";
import { toast } from "sonner";

interface AIUniversitySearchProps {
  onUniversitySelect: (university: UniversitySearchResult) => void;
}

export function AIUniversitySearch({ onUniversitySelect }: AIUniversitySearchProps) {
  const [query, setQuery] = useState("");
  const [suggestions, setSuggestions] = useState<UniversitySearchResult[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [open, setOpen] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // 真實 AI 搜索
  const performAISearch = async (searchQuery: string) => {
    if (!searchQuery.trim()) return;
    
    setIsLoading(true);
    setError(null);
    
    try {
      console.log('Searching for:', searchQuery);
      const results = await perplexityApi.searchUniversities(searchQuery);
      console.log('Search results:', results);
      
      setSuggestions(results);
      setOpen(true);
      
      if (results.length === 0) {
        toast.info("No universities found for your search. Try different keywords.");
      }
    } catch (error) {
      console.error('Search failed:', error);
      setError('Search failed. Please try again.');
      toast.error("Search failed. Please check your connection and try again.");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    const debounceTimer = setTimeout(() => {
      if (query.length > 2) {
        performAISearch(query);
      }
    }, 300);

    return () => clearTimeout(debounceTimer);
  }, [query]);

  const handleUniversitySelect = (university: UniversitySearchResult) => {
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
              ) : error ? (
                <div className="flex items-center justify-center p-6">
                  <div className="flex items-center space-x-2 text-red-600">
                    <AlertCircle className="h-4 w-4" />
                    <span className="text-sm">{error}</span>
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
                {suggestions.map((university, index) => (
                  <CommandItem
                    key={`${university.name}-${index}`}
                    onSelect={() => handleUniversitySelect(university)}
                    className="p-0"
                  >
                    <Card className="w-full border-0 shadow-none hover:bg-accent/50 transition-colors">
                      <CardContent className="p-4">
                        <div className="flex items-start justify-between">
                          <div className="space-y-2">
                            <div className="flex items-center space-x-2">
                              <h4 className="font-semibold text-sm">{university.name}</h4>
                              {university.ranking && (
                                <Badge variant="outline" className="text-xs">
                                  #{university.ranking} Global
                                </Badge>
                              )}
                            </div>
                            
                            <div className="flex items-center space-x-4 text-xs text-muted-foreground">
                              <div className="flex items-center space-x-1">
                                <MapPin className="h-3 w-3" />
                                <span>{university.location}</span>
                              </div>
                              {university.acceptanceRate && (
                                <div className="flex items-center space-x-1">
                                  <TrendingUp className="h-3 w-3" />
                                  <span>{university.acceptanceRate}% acceptance</span>
                                </div>
                              )}
                              {university.tuition && (
                                <div className="flex items-center space-x-1">
                                  <DollarSign className="h-3 w-3" />
                                  <span>${university.tuition.toLocaleString()}/year</span>
                                </div>
                              )}
                            </div>
                            
                            <div className="flex flex-wrap gap-1">
                              {university.programs.slice(0, 3).map((program, idx) => (
                                <Badge key={idx} variant="secondary" className="text-xs">
                                  {program}
                                </Badge>
                              ))}
                              {university.programs.length > 3 && (
                                <Badge variant="secondary" className="text-xs">
                                  +{university.programs.length - 3} more
                                </Badge>
                              )}
                            </div>
                            
                            {university.description && (
                              <p className="text-xs text-muted-foreground line-clamp-2">
                                {university.description}
                              </p>
                            )}
                          </div>
                          
                          <div className="text-right space-y-1">
                            <div className="flex items-center space-x-1">
                              <Sparkles className="h-3 w-3 text-primary" />
                              <span className="text-xs font-medium">AI Powered</span>
                            </div>
                            {university.deadline && (
                              <div className="flex items-center space-x-1">
                                <Calendar className="h-3 w-3 text-blue-500" />
                                <span className="text-xs">{new Date(university.deadline).toLocaleDateString()}</span>
                              </div>
                            )}
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