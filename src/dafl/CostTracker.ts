/**
 * DAFL (Distributed Autonomous Funding Layer) - Cost Tracking System
 * Tracks API costs, compute usage, and revenue to enable autonomous funding
 */

export interface APICallCost {
  timestamp: number;
  provider: 'horde' | 'pollinations' | 'gemini' | 'openai' | 'azure';
  type: 'text' | 'image' | 'audio' | 'video';
  tokens?: number;
  estimatedCost: number;
  successful: boolean;
  metadata?: Record<string, any>;
}

export interface ComputeCost {
  timestamp: number;
  operation: string;
  durationMs: number;
  cpuIntensive: boolean;
  estimatedCost: number;
}

export interface Revenue {
  timestamp: number;
  source: 'ads' | 'affiliate' | 'sponsor' | 'donation' | 'content';
  amount: number;
  currency: string;
  metadata?: Record<string, any>;
}

export interface CostSummary {
  totalCosts: number;
  totalRevenue: number;
  netBalance: number;
  apiCosts: number;
  computeCosts: number;
  projectedMonthlyBurn: number;
  survivalMode: boolean;
}

class CostTracker {
  private apiCalls: APICallCost[] = [];
  private computeCosts: ComputeCost[] = [];
  private revenues: Revenue[] = [];
  private readonly STORAGE_KEY = 'dafl_cost_tracker';
  private readonly MAX_HISTORY_DAYS = 30;

  // Cost estimation rates (in USD)
  private readonly COST_RATES = {
    horde: { text: 0, image: 0 }, // Free, but track for fallback planning
    pollinations: { text: 0, image: 0 }, // Free
    gemini: { text: 0.000075, image: 0.00025 }, // per 1K tokens / per image
    openai: { text: 0.0015, image: 0.02 }, // GPT-3.5 / DALL-E 3
    azure: { text: 0.002, image: 0.04 },
    compute: { perSecond: 0.00001 } // Estimated cloud compute cost
  };

  constructor() {
    this.loadFromStorage();
  }

  /**
   * Track an API call with cost estimation
   */
  trackAPICall(call: Omit<APICallCost, 'timestamp' | 'estimatedCost'>): void {
    const estimatedCost = this.estimateAPICost(call);
    const apiCallCost: APICallCost = {
      ...call,
      timestamp: Date.now(),
      estimatedCost
    };

    this.apiCalls.push(apiCallCost);
    this.pruneOldData();
    this.saveToStorage();
  }

  /**
   * Track compute-intensive operations
   */
  trackCompute(operation: string, durationMs: number, cpuIntensive: boolean = true): void {
    const estimatedCost = (durationMs / 1000) * this.COST_RATES.compute.perSecond * (cpuIntensive ? 2 : 1);

    this.computeCosts.push({
      timestamp: Date.now(),
      operation,
      durationMs,
      cpuIntensive,
      estimatedCost
    });

    this.pruneOldData();
    this.saveToStorage();
  }

  /**
   * Track revenue from various sources
   */
  trackRevenue(revenue: Omit<Revenue, 'timestamp'>): void {
    this.revenues.push({
      ...revenue,
      timestamp: Date.now()
    });

    this.pruneOldData();
    this.saveToStorage();
  }

  /**
   * Get comprehensive cost summary
   */
  getSummary(): CostSummary {
    const now = Date.now();
    const oneDayAgo = now - (24 * 60 * 60 * 1000);
    const thirtyDaysAgo = now - (30 * 24 * 60 * 60 * 1000);

    // Calculate total costs
    const apiCosts = this.apiCalls
      .filter(call => call.timestamp >= thirtyDaysAgo)
      .reduce((sum, call) => sum + call.estimatedCost, 0);

    const computeCosts = this.computeCosts
      .filter(cost => cost.timestamp >= thirtyDaysAgo)
      .reduce((sum, cost) => sum + cost.estimatedCost, 0);

    const totalCosts = apiCosts + computeCosts;

    // Calculate total revenue
    const totalRevenue = this.revenues
      .filter(rev => rev.timestamp >= thirtyDaysAgo)
      .reduce((sum, rev) => sum + rev.amount, 0);

    // Calculate projected monthly burn
    const recentCosts = this.apiCalls
      .filter(call => call.timestamp >= oneDayAgo)
      .reduce((sum, call) => sum + call.estimatedCost, 0);
    const projectedMonthlyBurn = recentCosts * 30;

    const netBalance = totalRevenue - totalCosts;
    const survivalMode = netBalance < 0 || (totalRevenue < totalCosts * 0.5);

    return {
      totalCosts,
      totalRevenue,
      netBalance,
      apiCosts,
      computeCosts,
      projectedMonthlyBurn,
      survivalMode
    };
  }

  /**
   * Get detailed breakdown by provider
   */
  getProviderBreakdown(): Record<string, { calls: number; cost: number }> {
    const breakdown: Record<string, { calls: number; cost: number }> = {};

    this.apiCalls.forEach(call => {
      if (!breakdown[call.provider]) {
        breakdown[call.provider] = { calls: 0, cost: 0 };
      }
      breakdown[call.provider].calls++;
      breakdown[call.provider].cost += call.estimatedCost;
    });

    return breakdown;
  }

  /**
   * Check if we should enter survival mode
   */
  shouldEnterSurvivalMode(): boolean {
    const summary = this.getSummary();
    return summary.survivalMode;
  }

  /**
   * Get optimization recommendations
   */
  getOptimizationRecommendations(): string[] {
    const recommendations: string[] = [];
    const breakdown = this.getProviderBreakdown();

    // Check for expensive provider usage
    Object.entries(breakdown).forEach(([provider, stats]) => {
      if (provider === 'gemini' && stats.cost > 1.0) {
        recommendations.push(`Consider reducing Gemini API usage (${stats.calls} calls, $${stats.cost.toFixed(2)}). Use Horde/Pollinations first.`);
      }
      if (provider === 'openai' || provider === 'azure') {
        recommendations.push(`Detected paid API usage (${provider}). Consider free alternatives for non-critical operations.`);
      }
    });

    // Check compute costs
    const highComputeOps = this.computeCosts
      .filter(op => op.estimatedCost > 0.01)
      .map(op => op.operation);

    if (highComputeOps.length > 0) {
      recommendations.push(`High compute operations detected: ${[...new Set(highComputeOps)].join(', ')}. Consider optimization.`);
    }

    const summary = this.getSummary();
    if (summary.survivalMode) {
      recommendations.push('🚨 SURVIVAL MODE: Revenue < Costs. Implement revenue sidecar immediately.');
    }

    return recommendations;
  }

  /**
   * Estimate API call cost
   */
  private estimateAPICost(call: Omit<APICallCost, 'timestamp' | 'estimatedCost'>): number {
    const rates = this.COST_RATES[call.provider];
    if (!rates) return 0;

    if (call.type === 'text') {
      const tokens = call.tokens || 1000; // Default estimate
      return (tokens / 1000) * rates.text;
    } else if (call.type === 'image') {
      return rates.image;
    }

    return 0;
  }

  /**
   * Prune old data beyond retention period
   */
  private pruneOldData(): void {
    const cutoff = Date.now() - (this.MAX_HISTORY_DAYS * 24 * 60 * 60 * 1000);

    this.apiCalls = this.apiCalls.filter(call => call.timestamp >= cutoff);
    this.computeCosts = this.computeCosts.filter(cost => cost.timestamp >= cutoff);
    this.revenues = this.revenues.filter(rev => rev.timestamp >= cutoff);
  }

  /**
   * Save to localStorage
   */
  private saveToStorage(): void {
    try {
      const data = {
        apiCalls: this.apiCalls,
        computeCosts: this.computeCosts,
        revenues: this.revenues
      };
      localStorage.setItem(this.STORAGE_KEY, JSON.stringify(data));
    } catch (e) {
      console.warn('Failed to save cost tracker data:', e);
    }
  }

  /**
   * Load from localStorage
   */
  private loadFromStorage(): void {
    try {
      const data = localStorage.getItem(this.STORAGE_KEY);
      if (data) {
        const parsed = JSON.parse(data);
        this.apiCalls = parsed.apiCalls || [];
        this.computeCosts = parsed.computeCosts || [];
        this.revenues = parsed.revenues || [];
        this.pruneOldData();
      }
    } catch (e) {
      console.warn('Failed to load cost tracker data:', e);
    }
  }

  /**
   * Clear all data (for testing)
   */
  clear(): void {
    this.apiCalls = [];
    this.computeCosts = [];
    this.revenues = [];
    localStorage.removeItem(this.STORAGE_KEY);
  }

  /**
   * Export data for analysis
   */
  exportData(): { apiCalls: APICallCost[]; computeCosts: ComputeCost[]; revenues: Revenue[] } {
    return {
      apiCalls: [...this.apiCalls],
      computeCosts: [...this.computeCosts],
      revenues: [...this.revenues]
    };
  }
}

// Singleton instance
export const costTracker = new CostTracker();
