import { GoogleGenerativeAI } from '@google/generative-ai';
import { env } from '../config/env';
import { logger } from '../utils/logger';
import { ExternalServiceError } from '../types/errors';

export interface GenerateConceptsParams {
  theme?: string;
  difficulty: 'easy' | 'medium' | 'hard';
  count: number;
}

export interface Concept {
  id: string;
  text: string;
  description: string;
}

class GeminiService {
  private genAI: GoogleGenerativeAI;
  private model: any;

  constructor() {
    this.genAI = new GoogleGenerativeAI(env.GEMINI_API_KEY);
    this.model = this.genAI.getGenerativeModel({ model: 'gemini-2.5-flash' });
  }

  async generateConcepts(params: GenerateConceptsParams): Promise<Concept[]> {
    const { theme = 'general', difficulty, count } = params;
    
    try {
      logger.info('Generating concepts', { theme, difficulty, count });

      const prompt = this.buildPrompt(theme, difficulty, count);
      const result = await this.model.generateContent(prompt);
      const response = await result.response;
      const text = response.text();

      return this.parseConcepts(text);
    } catch (error) {
      logger.error('Failed to generate concepts', { error, params });
      throw new ExternalServiceError(
        'Failed to generate concepts from Gemini API',
        503
      );
    }
  }

  private buildPrompt(theme: string, difficulty: string, count: number): string {
    const complexityGuide = {
      easy: 'simple, common, easily recognizable',
      medium: 'moderately complex, somewhat abstract',
      hard: 'complex, abstract, challenging to visualize'
    };

    return `Generate ${count} unique concepts for a memory game with the theme "${theme}".
    
    Requirements:
    - Difficulty level: ${difficulty} (${complexityGuide[difficulty as keyof typeof complexityGuide]})
    - Each concept should be a single item or idea that can be visually represented
    - Concepts should be distinct from each other
    - Return ONLY a JSON array with objects containing "id", "text", and "description" fields
    - The "text" field should be 1-3 words suitable for image generation
    - The "description" field should be a brief explanation (10-20 words)
    
    Example format:
    [
      {"id": "1", "text": "sunset beach", "description": "A beach scene during sunset with warm colors"},
      {"id": "2", "text": "mountain peak", "description": "A tall mountain summit covered in snow"}
    ]`;
  }

  private parseConcepts(text: string): Concept[] {
    try {
      // Extract JSON from the response
      const jsonMatch = text.match(/\[[\s\S]*\]/);
      if (!jsonMatch) {
        throw new Error('No JSON array found in response');
      }

      const concepts = JSON.parse(jsonMatch[0]);
      
      // Validate and sanitize concepts
      return concepts.map((concept: any, index: number) => ({
        id: concept.id || String(index + 1),
        text: String(concept.text || '').trim(),
        description: String(concept.description || '').trim()
      })).filter((concept: Concept) => concept.text.length > 0);
    } catch (error) {
      logger.error('Failed to parse concepts from Gemini response', { error, text });
      throw new ExternalServiceError('Invalid response format from Gemini API');
    }
  }

  async testConnection(): Promise<boolean> {
    try {
      const result = await this.model.generateContent('Say "OK" if you can read this.');
      const response = await result.response;
      return response.text().toLowerCase().includes('ok');
    } catch (error) {
      logger.error('Gemini API connection test failed', { error });
      return false;
    }
  }
}

export const geminiService = new GeminiService();