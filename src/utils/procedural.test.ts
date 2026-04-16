import { describe, it, expect } from 'vitest';
import { generateProceduralItem } from './procedural';

describe('procedural item generation security', () => {
  it('should generate valid UUIDs for item IDs', () => {
    const item = generateProceduralItem(1);
    // UUID v4 format: xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx
    const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
    expect(item.id).toMatch(uuidRegex);
  });

  it('should generate unique IDs on subsequent calls', () => {
    const item1 = generateProceduralItem(1);
    const item2 = generateProceduralItem(1);
    expect(item1.id).not.toBe(item2.id);
  });
});
