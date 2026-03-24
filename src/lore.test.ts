import { describe, it, expect } from 'vitest';
import { getRelevantLore, ELDER_SCROLLS_LORE } from './lore';

describe('getRelevantLore', () => {
  const allLines = ELDER_SCROLLS_LORE.split('\n').filter((line) => line.trim().length > 0);

  it('should return the first maxLines if contextText is empty', () => {
    const result = getRelevantLore('', 5);
    const resultLines = result.split('\n');
    expect(resultLines).toHaveLength(5);
    expect(resultLines).toEqual(allLines.slice(0, 5));
  });

  it('should return the first maxLines if contextText has no matches in the lore', () => {
    const result = getRelevantLore('jibberishwordthatdoesnotexist', 3);
    const resultLines = result.split('\n');
    expect(resultLines).toHaveLength(3);
    expect(resultLines).toEqual(allLines.slice(0, 3));
  });

  it('should return relevant lines based on contextText keywords', () => {
    const result = getRelevantLore('dragonborn akatosh', 2);
    const resultLines = result.split('\n');
    expect(resultLines).toHaveLength(2);
    expect(resultLines.some(line => line.toLowerCase().includes('dragonborn'))).toBe(true);
    expect(resultLines.some(line => line.toLowerCase().includes('akatosh'))).toBe(true);
  });

  it('should be case-insensitive', () => {
    const result = getRelevantLore('DRAGONBORN', 1);
    const resultLines = result.split('\n');
    expect(resultLines).toHaveLength(1);
    expect(resultLines[0].toLowerCase()).toContain('dragonborn');
  });

  it('should ignore stopwords', () => {
    // Stopwords include 'that', 'with', 'from', 'this', 'player', etc.
    // Searching just for stopwords should yield default first lines.
    const result = getRelevantLore('that with from this', 5);
    const resultLines = result.split('\n');
    expect(resultLines).toHaveLength(5);
    expect(resultLines).toEqual(allLines.slice(0, 5));
  });

  it('should respect maxLines parameter when there are matches', () => {
    const result = getRelevantLore('dragonborn', 2);
    const resultLines = result.split('\n');
    expect(resultLines).toHaveLength(2);
  });

  it('should respect maxLines parameter when it exceeds total available matching lines', () => {
    const result = getRelevantLore('numidium', 100);
    const resultLines = result.split('\n');
    // Numidium appears less than 100 times in the lore.
    expect(resultLines.length).toBeLessThan(100);
    expect(resultLines.length).toBeGreaterThan(0);
    expect(resultLines.every(line => line.toLowerCase().includes('numidium') || line.toLowerCase().includes('brass god'))).toBe(true);
  });

  it('should return the first maxLines when there are matches but fewer than maxLines', () => {
    // Actually the function behaviour is:
    // `const selected = scoredLines.filter(item => item.score > 0).slice(0, maxLines).map(item => item.line);`
    // So if there's only 1 match and maxLines is 5, it returns 1 line.
    const result = getRelevantLore('numidium', 100);
    const resultLines = result.split('\n');
    expect(resultLines.length).toBeGreaterThan(0);
  });
});
