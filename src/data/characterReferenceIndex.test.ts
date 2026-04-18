import { describe, expect, it } from 'vitest';

import {
  CHARACTER_REFERENCE_INDEX,
  getCharacterReference,
  getCharacterReferenceContext,
  searchCharacterReferences,
} from './characterReferenceIndex';
import { NPCS } from './npcs';

describe('characterReferenceIndex', () => {
  it('creates one reference entry per NPC from existing data sources', () => {
    expect(CHARACTER_REFERENCE_INDEX).toHaveLength(Object.keys(NPCS).length);
    expect(CHARACTER_REFERENCE_INDEX.every((reference) => reference.referenceFiles.includes('src/data/npcs.ts'))).toBe(true);
  });

  it('maps code references, story events, and dialogue trees for a known character', () => {
    const constance = getCharacterReference('constance_michel');

    expect(constance).toBeDefined();
    expect(constance?.name).toBe('Sister Constance');
    expect(constance?.primaryLocationId).toBe('orphanage');
    expect(constance?.storyEventIds).toContain('constance_secret_bread');
    expect(constance?.dialogueTreeIds).toContain('constance_secret_bread');
    expect(constance?.referenceFiles).toEqual(
      expect.arrayContaining(['src/data/npcs.ts', 'src/data/locations.ts', 'src/data/dialogueTrees.ts']),
    );
  });

  it('supports lookup by display name and attribute-based search', () => {
    expect(getCharacterReference('Sister Constance')?.id).toBe('constance_michel');

    const schoolLoveInterests = searchCharacterReferences({
      locationId: 'school',
      loveInterest: true,
      intent: 'date',
    }).map((reference) => reference.id);

    expect(schoolLoveInterests).toEqual(expect.arrayContaining(['whitney', 'kylar', 'avery', 'sydney']));
  });

  it('formats local character context for AI prompt consumption', () => {
    const context = getCharacterReferenceContext(['constance_michel']);

    expect(context).toContain('Sister Constance [constance_michel]');
    expect(context).toContain('references=src/data/npcs.ts, src/data/locations.ts, src/data/dialogueTrees.ts');
    expect(context).toContain('asset_keywords=constance_michel, Sister Constance, Human, orphanage, Honorhall Orphanage');
  });
});
