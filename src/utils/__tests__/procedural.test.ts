import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { generateProceduralItem } from '../procedural';

describe('generateProceduralItem', () => {
  beforeEach(() => {
    vi.spyOn(Math, 'random');
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  it('should generate an item of a specific type', () => {
    // Math.random is called for:
    // 1. rarityRoll (Math.random() * 100) -> let's mock 0.1 for uncommon (> 40? no, 0.1*100=10 is common)
    // 2. prefix index
    // 3. suffix index
    // 4. weapon index
    // 5. id generation
    // 6. weight

    // We'll just provide an implementation that returns a consistent value.
    let randomCalls = 0;
    vi.mocked(Math.random).mockImplementation(() => {
      randomCalls++;
      // Return 0.5 to have consistent indices and 'uncommon' rarity (0.5 * 100 = 50 > 40)
      return 0.5;
    });

    const item = generateProceduralItem(1, 'weapon');

    expect(item.type).toBe('weapon');
    expect(item.rarity).toBe('uncommon');
  });

  it('should generate items with varying rarities based on rarityRoll', () => {
    // Define the threshold and expected rarity mapping
    const rarityTests = [
      { randomValue: 0.995, expectedRarity: 'mythic' },    // > 99
      { randomValue: 0.96, expectedRarity: 'legendary' },  // > 95
      { randomValue: 0.86, expectedRarity: 'epic' },       // > 85
      { randomValue: 0.71, expectedRarity: 'rare' },       // > 70
      { randomValue: 0.41, expectedRarity: 'uncommon' },   // > 40
      { randomValue: 0.3, expectedRarity: 'common' },      // <= 40
    ];

    rarityTests.forEach(({ randomValue, expectedRarity }) => {
      vi.mocked(Math.random).mockImplementation(() => randomValue);
      const item = generateProceduralItem(1, 'weapon');
      expect(item.rarity).toBe(expectedRarity);
    });
  });
});
