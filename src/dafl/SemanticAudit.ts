/**
 * Semantic Audit System
 * Optimizes API requests for maximum info-to-token ratio
 * Strips redundancy and minimizes token wastage
 */

export interface AuditResult {
  originalLength: number;
  optimizedLength: number;
  tokensSaved: number;
  optimizations: string[];
}

export class SemanticAudit {
  /**
   * Audit and optimize a text prompt for API calls
   */
  static auditPrompt(prompt: string, context?: Record<string, any>): { optimized: string; audit: AuditResult } {
    const originalLength = prompt.length;
    const optimizations: string[] = [];
    let optimized = prompt;

    // 1. Remove excessive whitespace
    const beforeWhitespace = optimized.length;
    optimized = optimized.replace(/\s+/g, ' ').trim();
    if (optimized.length < beforeWhitespace) {
      optimizations.push('Normalized whitespace');
    }

    // 2. Remove duplicate sentences
    const beforeDuplicates = optimized.length;
    optimized = this.removeDuplicateSentences(optimized);
    if (optimized.length < beforeDuplicates) {
      optimizations.push('Removed duplicate sentences');
    }

    // 3. Compress verbose phrases
    const beforeCompression = optimized.length;
    optimized = this.compressVerbosePhrases(optimized);
    if (optimized.length < beforeCompression) {
      optimizations.push('Compressed verbose phrases');
    }

    // 4. Remove filler words for system prompts
    if (context?.isSystemPrompt) {
      const beforeFiller = optimized.length;
      optimized = this.removeFillerWords(optimized);
      if (optimized.length < beforeFiller) {
        optimizations.push('Removed filler words');
      }
    }

    // 5. Abbreviate common technical terms
    const beforeAbbreviation = optimized.length;
    optimized = this.abbreviateTechnicalTerms(optimized);
    if (optimized.length < beforeAbbreviation) {
      optimizations.push('Abbreviated technical terms');
    }

    const optimizedLength = optimized.length;
    const tokensSaved = Math.floor((originalLength - optimizedLength) / 4); // Rough estimate: 4 chars = 1 token

    return {
      optimized,
      audit: {
        originalLength,
        optimizedLength,
        tokensSaved,
        optimizations
      }
    };
  }

  /**
   * Remove duplicate sentences from text
   */
  private static removeDuplicateSentences(text: string): string {
    const sentences = text.split(/[.!?]+/).map(s => s.trim()).filter(Boolean);
    const uniqueSentences = [...new Set(sentences)];
    return uniqueSentences.join('. ') + (text.endsWith('.') ? '.' : '');
  }

  /**
   * Compress verbose phrases to concise equivalents
   */
  private static compressVerbosePhrases(text: string): string {
    const compressions: Record<string, string> = {
      'in order to': 'to',
      'due to the fact that': 'because',
      'at this point in time': 'now',
      'has the ability to': 'can',
      'is able to': 'can',
      'in the event that': 'if',
      'for the purpose of': 'for',
      'with regard to': 'regarding',
      'in the process of': 'during',
      'on a regular basis': 'regularly',
      'make use of': 'use',
      'take into consideration': 'consider',
      'give consideration to': 'consider',
      'in a timely manner': 'promptly',
      'at the present time': 'now',
      'prior to': 'before',
      'subsequent to': 'after',
      'in close proximity to': 'near',
      'for the reason that': 'because',
      'in spite of the fact that': 'although'
    };

    let compressed = text;
    Object.entries(compressions).forEach(([verbose, concise]) => {
      const regex = new RegExp(verbose, 'gi');
      compressed = compressed.replace(regex, concise);
    });

    return compressed;
  }

  /**
   * Remove filler words that don't add semantic value
   */
  private static removeFillerWords(text: string): string {
    const fillers = [
      'basically', 'literally', 'actually', 'honestly', 'frankly',
      'quite', 'rather', 'somewhat', 'pretty much', 'kind of',
      'sort of', 'really', 'very', 'just', 'simply'
    ];

    let cleaned = text;
    fillers.forEach(filler => {
      const regex = new RegExp(`\\b${filler}\\b`, 'gi');
      cleaned = cleaned.replace(regex, '');
    });

    // Clean up any resulting double spaces
    return cleaned.replace(/\s+/g, ' ').trim();
  }

  /**
   * Abbreviate common technical terms
   */
  private static abbreviateTechnicalTerms(text: string): string {
    const abbreviations: Record<string, string> = {
      'artificial intelligence': 'AI',
      'natural language processing': 'NLP',
      'machine learning': 'ML',
      'large language model': 'LLM',
      'application programming interface': 'API',
      'hypertext markup language': 'HTML',
      'cascading style sheets': 'CSS',
      'javascript object notation': 'JSON',
      'extensible markup language': 'XML',
      'structured query language': 'SQL',
      'user interface': 'UI',
      'user experience': 'UX',
      'representational state transfer': 'REST',
      'graphical user interface': 'GUI',
      'command line interface': 'CLI'
    };

    let abbreviated = text;
    Object.entries(abbreviations).forEach(([full, abbr]) => {
      const regex = new RegExp(full, 'gi');
      abbreviated = abbreviated.replace(regex, abbr);
    });

    return abbreviated;
  }

  /**
   * Estimate token count for text
   */
  static estimateTokens(text: string): number {
    // Rough estimation: ~4 characters per token on average
    // More accurate for English text with technical content
    return Math.ceil(text.length / 4);
  }

  /**
   * Check if prompt exceeds recommended token limits
   */
  static checkTokenLimit(text: string, maxTokens: number = 8192): { withinLimit: boolean; tokens: number; maxTokens: number } {
    const tokens = this.estimateTokens(text);
    return {
      withinLimit: tokens <= maxTokens,
      tokens,
      maxTokens
    };
  }

  /**
   * Truncate text to fit within token limit
   */
  static truncateToTokenLimit(text: string, maxTokens: number): string {
    const estimatedTokens = this.estimateTokens(text);

    if (estimatedTokens <= maxTokens) {
      return text;
    }

    // Calculate target character length
    const targetLength = Math.floor(maxTokens * 4 * 0.95); // 5% safety margin

    // Try to truncate at sentence boundary
    const truncated = text.substring(0, targetLength);
    const lastPeriod = truncated.lastIndexOf('.');
    const lastNewline = truncated.lastIndexOf('\n');
    const cutPoint = Math.max(lastPeriod, lastNewline);

    if (cutPoint > targetLength * 0.8) { // If we can cut at a good boundary
      return truncated.substring(0, cutPoint + 1);
    }

    return truncated + '...';
  }

  /**
   * Batch audit multiple prompts
   */
  static batchAudit(prompts: string[]): { results: AuditResult[]; totalTokensSaved: number } {
    const results = prompts.map(prompt => this.auditPrompt(prompt).audit);
    const totalTokensSaved = results.reduce((sum, result) => sum + result.tokensSaved, 0);

    return { results, totalTokensSaved };
  }

  /**
   * Generate audit report
   */
  static generateReport(audits: AuditResult[]): string {
    const totalOriginal = audits.reduce((sum, a) => sum + a.originalLength, 0);
    const totalOptimized = audits.reduce((sum, a) => sum + a.optimizedLength, 0);
    const totalSaved = audits.reduce((sum, a) => sum + a.tokensSaved, 0);
    const avgReduction = ((totalOriginal - totalOptimized) / totalOriginal * 100).toFixed(2);

    return `
Semantic Audit Report
=====================
Total Prompts: ${audits.length}
Original Length: ${totalOriginal} chars
Optimized Length: ${totalOptimized} chars
Tokens Saved: ${totalSaved} tokens
Avg Reduction: ${avgReduction}%

Common Optimizations:
${this.summarizeOptimizations(audits)}
    `.trim();
  }

  /**
   * Summarize common optimizations across multiple audits
   */
  private static summarizeOptimizations(audits: AuditResult[]): string {
    const optimizationCounts: Record<string, number> = {};

    audits.forEach(audit => {
      audit.optimizations.forEach(opt => {
        optimizationCounts[opt] = (optimizationCounts[opt] || 0) + 1;
      });
    });

    return Object.entries(optimizationCounts)
      .sort((a, b) => b[1] - a[1])
      .map(([opt, count]) => `- ${opt}: ${count} times`)
      .join('\n');
  }
}
