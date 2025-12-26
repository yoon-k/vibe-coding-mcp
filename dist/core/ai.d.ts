import Anthropic from '@anthropic-ai/sdk';
/**
 * Initialize the Anthropic client
 */
export declare function initializeAI(): boolean;
/**
 * Check if AI features are available
 */
export declare function isAIAvailable(): boolean;
/**
 * Get the Anthropic client instance
 */
export declare function getAnthropicClient(): Anthropic | null;
export interface AIAnalysisResult {
    decisions: AIDesignDecision[];
    summary: string;
    insights: string[];
    recommendations: string[];
}
export interface AIDesignDecision {
    title: string;
    description: string;
    rationale: string;
    alternatives: string[];
    category: 'architecture' | 'implementation' | 'library' | 'pattern' | 'other';
    importance: 'high' | 'medium' | 'low';
    tradeoffs: string[];
    relatedTopics: string[];
}
/**
 * Use Claude AI to analyze conversation and extract design decisions
 */
export declare function analyzeWithAI(conversationLog: string, options?: {
    projectContext?: string;
    language?: 'en' | 'ko';
    maxDecisions?: number;
}): Promise<AIAnalysisResult>;
/**
 * Generate a summary using AI
 */
export declare function generateAISummary(content: string, options: {
    type: 'code' | 'conversation' | 'document';
    language?: 'en' | 'ko';
    maxLength?: number;
}): Promise<string>;
/**
 * Analyze code and generate insights using AI
 */
export declare function analyzeCodeWithAI(code: string, options?: {
    language?: string;
    analysisType?: 'complexity' | 'quality' | 'security' | 'all';
    outputLanguage?: 'en' | 'ko';
}): Promise<{
    summary: string;
    issues: Array<{
        type: string;
        severity: string;
        description: string;
        line?: number;
    }>;
    suggestions: string[];
    metrics: Record<string, number | string>;
}>;
//# sourceMappingURL=ai.d.ts.map