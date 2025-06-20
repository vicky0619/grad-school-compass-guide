interface PerplexityApiResponse {
  id: string;
  object: string;
  created: number;
  model: string;
  choices: {
    index: number;
    finish_reason: string;
    message: {
      role: string;
      content: string;
    };
    delta?: {
      role?: string;
      content?: string;
    };
  }[];
  usage: {
    prompt_tokens: number;
    completion_tokens: number;
    total_tokens: number;
  };
}

interface UniversitySearchResult {
  name: string;
  location: string;
  country: string;
  ranking: number | null;
  acceptanceRate: number | null;
  tuition: number | null;
  programs: string[];
  deadline: string | null;
  website: string | null;
  requirements: {
    gpa: number | null;
    gre: number | null;
    toefl: number | null;
  };
  description: string;
}

class PerplexityApiService {
  private apiKey: string;
  private baseUrl = 'https://api.perplexity.ai/chat/completions';

  constructor() {
    this.apiKey = import.meta.env.VITE_PERPLEXITY_API_KEY;
    if (!this.apiKey) {
      console.warn('Perplexity API key not found. Please set VITE_PERPLEXITY_API_KEY in your environment variables.');
      // Don't throw error to prevent app from breaking
      this.apiKey = '';
    }
  }

  private async makeRequest(messages: { role: string; content: string }[]): Promise<PerplexityApiResponse> {
    try {
      const response = await fetch(this.baseUrl, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${this.apiKey}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          model: 'llama-3.1-sonar-large-128k-online',
          messages: messages,
          temperature: 0.2,
          max_tokens: 4000,
          top_p: 0.9,
        }),
      });

      if (!response.ok) {
        throw new Error(`API request failed: ${response.status} ${response.statusText}`);
      }

      const data: PerplexityApiResponse = await response.json();
      return data;
    } catch (error) {
      console.error('Perplexity API request failed:', error);
      throw error;
    }
  }

  async searchUniversities(query: string): Promise<UniversitySearchResult[]> {
    if (!this.apiKey) {
      throw new Error('API key not configured. Please add your Perplexity API key to environment variables.');
    }
    const prompt = `
    Search for universities based on this query: "${query}"

    Please provide detailed information about relevant universities in the following JSON format:
    {
      "universities": [
        {
          "name": "University Name",
          "location": "City, State/Province",
          "country": "Country",
          "ranking": 15,
          "acceptanceRate": 12.5,
          "tuition": 45000,
          "programs": ["Computer Science", "Engineering"],
          "deadline": "2024-12-01",
          "website": "https://university.edu",
          "requirements": {
            "gpa": 3.8,
            "gre": 320,
            "toefl": 100
          },
          "description": "Brief description of the university and why it matches the query"
        }
      ]
    }

    Please include:
    - Top 5-8 most relevant universities
    - Current and accurate information (2024)
    - Specific program information if mentioned in query
    - Realistic acceptance rates and requirements
    - Application deadlines for graduate programs
    - Annual tuition in USD

    Focus on providing accurate, up-to-date information from reliable sources.
    `;

    try {
      const response = await this.makeRequest([
        { role: 'user', content: prompt }
      ]);

      const content = response.choices[0]?.message?.content;
      if (!content) {
        throw new Error('No content in API response');
      }

      // Parse JSON from the response
      const jsonMatch = content.match(/\{[\s\S]*\}/);
      if (!jsonMatch) {
        throw new Error('No JSON found in response');
      }

      const parsedData = JSON.parse(jsonMatch[0]);
      return parsedData.universities || [];
    } catch (error) {
      console.error('Error parsing university search results:', error);
      throw new Error('Failed to parse university data from AI response');
    }
  }

  async getUniversityDetails(universityName: string): Promise<UniversitySearchResult | null> {
    const prompt = `
    Get detailed information about "${universityName}" university.

    Please provide comprehensive information in the following JSON format:
    {
      "name": "Full University Name",
      "location": "City, State/Province",
      "country": "Country",
      "ranking": 25,
      "acceptanceRate": 18.5,
      "tuition": 52000,
      "programs": ["Computer Science", "Data Science", "Engineering"],
      "deadline": "2024-12-15",
      "website": "https://university.edu",
      "requirements": {
        "gpa": 3.7,
        "gre": 315,
        "toefl": 95
      },
      "description": "Detailed description including strengths, notable programs, research opportunities, campus life, and what makes this university unique"
    }

    Please provide:
    - Most current information available (2024)
    - Graduate program admission requirements
    - Popular graduate programs offered
    - Application deadlines for fall 2025 admission
    - Annual tuition for graduate programs in USD
    - University ranking (global or national)
    `;

    try {
      const response = await this.makeRequest([
        { role: 'user', content: prompt }
      ]);

      const content = response.choices[0]?.message?.content;
      if (!content) {
        return null;
      }

      // Parse JSON from the response
      const jsonMatch = content.match(/\{[\s\S]*\}/);
      if (!jsonMatch) {
        return null;
      }

      const parsedData = JSON.parse(jsonMatch[0]);
      return parsedData;
    } catch (error) {
      console.error('Error getting university details:', error);
      return null;
    }
  }

  async getUniversityRecommendations(userProfile: {
    interests: string[];
    preferredLocations: string[];
    budgetRange: string;
    academicBackground: string;
  }): Promise<UniversitySearchResult[]> {
    if (!this.apiKey) {
      throw new Error('API key not configured. Please add your Perplexity API key to environment variables.');
    }
    const prompt = `
    Based on this user profile, recommend suitable universities:
    - Interests: ${userProfile.interests.join(', ')}
    - Preferred Locations: ${userProfile.preferredLocations.join(', ')}
    - Budget Range: ${userProfile.budgetRange}
    - Academic Background: ${userProfile.academicBackground}

    Please provide 6-8 university recommendations in the following JSON format:
    {
      "recommendations": [
        {
          "name": "University Name",
          "location": "City, State/Province",
          "country": "Country",
          "ranking": 20,
          "acceptanceRate": 15.0,
          "tuition": 48000,
          "programs": ["Relevant Program 1", "Relevant Program 2"],
          "deadline": "2024-12-01",
          "website": "https://university.edu",
          "requirements": {
            "gpa": 3.6,
            "gre": 310,
            "toefl": 90
          },
          "description": "Why this university is recommended for this user",
          "matchReason": "Specific reasons why this matches user's profile",
          "category": "reach|target|safety"
        }
      ]
    }

    Please ensure:
    - Mix of reach, target, and safety schools
    - Programs align with user interests
    - Locations match preferences when possible
    - Tuition fits within budget range
    - Realistic admission requirements
    - Current application deadlines
    `;

    try {
      const response = await this.makeRequest([
        { role: 'user', content: prompt }
      ]);

      const content = response.choices[0]?.message?.content;
      if (!content) {
        throw new Error('No content in API response');
      }

      // Parse JSON from the response
      const jsonMatch = content.match(/\{[\s\S]*\}/);
      if (!jsonMatch) {
        throw new Error('No JSON found in response');
      }

      const parsedData = JSON.parse(jsonMatch[0]);
      return parsedData.recommendations || [];
    } catch (error) {
      console.error('Error getting university recommendations:', error);
      throw new Error('Failed to get AI recommendations');
    }
  }
}

// Initialize API service with error handling
let perplexityApi: PerplexityApiService;

try {
  perplexityApi = new PerplexityApiService();
} catch (error) {
  console.warn('Failed to initialize Perplexity API service:', error);
  // Create a fallback service that throws user-friendly errors
  perplexityApi = {
    async searchUniversities() {
      throw new Error('API service not available. Please check your configuration.');
    },
    async getUniversityDetails() {
      return null;
    },
    async getUniversityRecommendations() {
      throw new Error('API service not available. Please check your configuration.');
    }
  } as PerplexityApiService;
}

export { perplexityApi };
export type { UniversitySearchResult };