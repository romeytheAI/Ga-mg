import { describe, it, expect } from 'vitest';
import { SemanticAudit } from './SemanticAudit';

describe('SemanticAudit', () => {
  describe('estimateTokens', () => {
    it('returns 0 for empty string', () => {
      expect(SemanticAudit.estimateTokens('')).toBe(0);
    });

    it('estimates tokens based on 4 characters per token', () => {
      expect(SemanticAudit.estimateTokens('1234')).toBe(1);
      expect(SemanticAudit.estimateTokens('12345')).toBe(2);
      expect(SemanticAudit.estimateTokens('12345678')).toBe(2);
    });
  });

  describe('auditPrompt', () => {
    it('normalizes whitespace', () => {
      const prompt = '  Hello   world  \n  this is  a test  ';
      const { optimized, audit } = SemanticAudit.auditPrompt(prompt);
      expect(optimized).toBe('Hello world this is a test');
      expect(audit.optimizations).toContain('Normalized whitespace');
    });

    it('removes duplicate sentences', () => {
      const prompt = 'Hello world. This is a test. Hello world.';
      const { optimized, audit } = SemanticAudit.auditPrompt(prompt);
      expect(optimized).toBe('Hello world. This is a test.');
      expect(audit.optimizations).toContain('Removed duplicate sentences');
    });

    it('compresses verbose phrases', () => {
      const prompt = 'In order to test, we must make use of tools.';
      const { optimized, audit } = SemanticAudit.auditPrompt(prompt);
      // Note: internal regex uses 'gi', but replacement text is lowercase
      expect(optimized.toLowerCase()).toBe('to test, we must use tools.');
      expect(audit.optimizations).toContain('Compressed verbose phrases');
    });

    it('removes filler words only in system prompts', () => {
      const prompt = 'Basically, it is actually quite simple.';

      // Not a system prompt
      const result1 = SemanticAudit.auditPrompt(prompt, { isSystemPrompt: false });
      expect(result1.optimized).toContain('it is actually');

      // Is a system prompt
      const result2 = SemanticAudit.auditPrompt(prompt, { isSystemPrompt: true });
      expect(result2.optimized).toContain('it is simple.');
      expect(result2.audit.optimizations).toContain('Removed filler words');
    });

    it('abbreviates technical terms', () => {
      const prompt = 'We are using artificial intelligence and large language models.';
      const { optimized, audit } = SemanticAudit.auditPrompt(prompt);
      expect(optimized).toBe('We are using AI and LLMs.');
      expect(audit.optimizations).toContain('Abbreviated technical terms');
    });

    it('calculates tokens saved correctly', () => {
      const prompt = '  This is a very very long prompt in order to test the token saving capability.  ';
      const { audit } = SemanticAudit.auditPrompt(prompt);
      const expectedSaved = Math.floor((audit.originalLength - audit.optimizedLength) / 4);
      expect(audit.tokensSaved).toBe(expectedSaved);
    });
  });

  describe('checkTokenLimit', () => {
    it('checks if text is within token limit', () => {
      const text = 'a'.repeat(40); // 10 tokens
      expect(SemanticAudit.checkTokenLimit(text, 20).withinLimit).toBe(true);
      expect(SemanticAudit.checkTokenLimit(text, 5).withinLimit).toBe(false);
    });
  });

  describe('truncateToTokenLimit', () => {
    it('does not truncate if within limit', () => {
      const text = 'This is a short text.';
      expect(SemanticAudit.truncateToTokenLimit(text, 100)).toBe(text);
    });

    it('truncates with ellipsis if it exceeds limit', () => {
      const text = 'A'.repeat(100);
      const truncated = SemanticAudit.truncateToTokenLimit(text, 5);
      expect(truncated).toContain('...');
    });
  });

  describe('batchAudit', () => {
    it('audits multiple prompts and sums saved tokens', () => {
      const prompts = [
        'In order to test',
        'In order to test'
      ];
      const result = SemanticAudit.batchAudit(prompts);
      expect(result.results).toHaveLength(2);
      expect(result.totalTokensSaved).toBeGreaterThan(0);
    });
  });

  describe('generateReport', () => {
    it('generates a report string with expected sections', () => {
      const prompts = [
        'In order to test',
        'Artificial Intelligence is cool'
      ];
      const audits = prompts.map(p => SemanticAudit.auditPrompt(p).audit);
      const report = SemanticAudit.generateReport(audits);

      expect(report).toContain('Semantic Audit Report');
      expect(report).toContain('Total Prompts: 2');
      expect(report).toContain('Tokens Saved:');
      expect(report).toContain('Common Optimizations:');
    });
  });
});
