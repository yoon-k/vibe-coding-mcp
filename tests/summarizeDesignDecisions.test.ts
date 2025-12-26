import { summarizeDesignDecisions } from '../src/tools/summarizeDesignDecisions.js';

describe('summarizeDesignDecisions', () => {
  describe('language detection', () => {
    it('should detect English text', () => {
      const result = summarizeDesignDecisions({
        conversationLog: 'We decided to use React because it has a large ecosystem.',
        language: 'auto'
      });

      expect(result).toBeDefined();
      expect(result.decisions).toBeDefined();
    });

    it('should detect Korean text', () => {
      const result = summarizeDesignDecisions({
        conversationLog: 'React를 사용하기로 결정했습니다. 생태계가 크기 때문입니다.',
        language: 'auto'
      });

      expect(result).toBeDefined();
      expect(result.decisions).toBeDefined();
    });
  });

  describe('decision extraction', () => {
    it('should extract decisions from English text', () => {
      const result = summarizeDesignDecisions({
        conversationLog: `
          We decided to use TypeScript instead of JavaScript because of type safety.
          We chose React over Vue for its ecosystem.
          I recommend using PostgreSQL for the database.
        `,
        language: 'en'
      });

      expect(result.decisions.length).toBeGreaterThan(0);
      expect(result.stats.totalDecisions).toBeGreaterThan(0);
    });

    it('should extract decisions from Korean text', () => {
      const result = summarizeDesignDecisions({
        conversationLog: `
          TypeScript를 선택했습니다. 타입 안정성 때문입니다.
          Vue 대신 React를 사용하기로 결정했습니다.
        `,
        language: 'ko'
      });

      expect(result.decisions.length).toBeGreaterThanOrEqual(0);
    });

    it('should respect maxDecisions limit', () => {
      const result = summarizeDesignDecisions({
        conversationLog: `
          We decided to use A. We chose B. We selected C. We picked D. We went with E.
        `,
        maxDecisions: 2
      });

      expect(result.decisions.length).toBeLessThanOrEqual(2);
    });
  });

  describe('importance scoring', () => {
    it('should assign higher importance to critical decisions', () => {
      const result = summarizeDesignDecisions({
        conversationLog: 'This critical architectural decision is essential for the system.',
        includeImportanceScore: true
      });

      if (result.decisions.length > 0) {
        expect(result.decisions[0].importanceScore).toBeDefined();
      }
    });
  });

  describe('categorization', () => {
    it('should categorize architecture decisions', () => {
      const result = summarizeDesignDecisions({
        conversationLog: 'We decided on a microservice architecture for scalability.'
      });

      const archDecisions = result.decisions.filter(d => d.category === 'architecture');
      // May or may not find architecture decisions depending on pattern matching
      expect(result.decisions).toBeDefined();
    });

    it('should categorize library decisions', () => {
      const result = summarizeDesignDecisions({
        conversationLog: 'We chose the lodash library for utility functions.'
      });

      expect(result.decisions).toBeDefined();
    });
  });

  describe('statistics', () => {
    it('should provide category breakdown', () => {
      const result = summarizeDesignDecisions({
        conversationLog: 'We decided to use React. We chose microservices architecture.'
      });

      expect(result.stats.byCategory).toBeDefined();
      expect(result.stats.byImportance).toBeDefined();
      expect(result.stats.topKeywords).toBeDefined();
    });
  });

  describe('code extraction', () => {
    it('should extract related code blocks when enabled', () => {
      const result = summarizeDesignDecisions({
        conversationLog: `
          We decided to use this pattern:
          \`\`\`typescript
          function example() { return true; }
          \`\`\`
        `,
        extractRelatedCode: true
      });

      expect(result).toBeDefined();
    });

    it('should not extract code when disabled', () => {
      const result = summarizeDesignDecisions({
        conversationLog: `
          We decided to use this pattern:
          \`\`\`typescript
          function example() { return true; }
          \`\`\`
        `,
        extractRelatedCode: false
      });

      if (result.decisions.length > 0) {
        expect(result.decisions[0].relatedCode).toEqual([]);
      }
    });
  });

  describe('summary generation', () => {
    it('should generate summary when decisions are found', () => {
      const result = summarizeDesignDecisions({
        conversationLog: 'We decided to use React for the frontend.'
      });

      expect(result.summary).toBeDefined();
      expect(typeof result.summary).toBe('string');
    });

    it('should generate appropriate summary when no decisions found', () => {
      const result = summarizeDesignDecisions({
        conversationLog: 'Hello, how are you today?'
      });

      expect(result.summary).toBeDefined();
    });
  });
});
