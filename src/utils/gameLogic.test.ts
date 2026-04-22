import { describe, it, expect } from 'vitest';
import { getSynergies, getAgeTag, getFallbackResponse, getHealthSemantic, getStaminaSemantic, getTraumaSemantic } from './gameLogic';

describe('gameLogic', () => {
  describe('getSynergies', () => {
    it('returns empty array if no skills meet threshold', () => {
      const synergies = getSynergies({ athletics: 40, seduction: 40 });
      expect(synergies.length).toBe(0);
    });

    it('returns Acrobatic Lover if athletics and seduction > 50', () => {
      const synergies = getSynergies({ athletics: 55, seduction: 51 });
      expect(synergies.length).toBe(1);
      expect(synergies[0].name).toBe('Acrobatic Lover');
    });

    it('returns multiple synergies if conditions are met', () => {
      const synergies = getSynergies({ athletics: 60, seduction: 60, skulduggery: 60, swimming: 60 });
      expect(synergies.length).toBe(3);
      expect(synergies.map(s => s.name)).toContain('Acrobatic Lover');
      expect(synergies.map(s => s.name)).toContain('Shadow Walker');
      expect(synergies.map(s => s.name)).toContain('Aquatic Predator');
    });
  });

  describe('getAgeTag', () => {
    it('returns young adult for Elf under 100', () => {
      expect(getAgeTag(90, 'Elf')).toBe('[Player is a young, developing adult]');
    });

    it('returns mature adult for Elf between 100 and 499', () => {
      expect(getAgeTag(200, 'Elf')).toBe('[Player is a mature adult]');
    });

    it('returns elder for Elf over 500', () => {
      expect(getAgeTag(600, 'Elf')).toBe('[Player is a weathered elder]');
    });

    it('returns young adult for human under 60', () => {
      expect(getAgeTag(25, 'Human')).toBe('[Player is a young, developing adult]');
    });

    it('returns mature adult for human between 60 and 199', () => {
      expect(getAgeTag(65, 'Human')).toBe('[Player is a mature adult]');
    });

    it('returns elder for human over 200', () => {
      expect(getAgeTag(250, 'Human')).toBe('[Player is a weathered elder]');
    });
  });

  describe('getFallbackResponse', () => {
    it('returns a predefined fallback object', () => {
      const fallback = getFallbackResponse();
      expect(fallback.narrative_text).toContain('The chaotic energies');
      expect(fallback.stat_deltas).toBeDefined();
      expect(fallback.follow_up_choices.length).toBe(2);
    });
  });

  describe('semantic helpers', () => {
    it('getHealthSemantic returns correct strings', () => {
      expect(getHealthSemantic(90)).toBe('Robust');
      expect(getHealthSemantic(60)).toBe('Battered');
      expect(getHealthSemantic(30)).toBe('Bleeding');
      expect(getHealthSemantic(10)).toBe("Death's Door");
    });

    it('getStaminaSemantic returns correct strings', () => {
      expect(getStaminaSemantic(90)).toBe('Energetic');
      expect(getStaminaSemantic(60)).toBe('Winded');
      expect(getStaminaSemantic(30)).toBe('Exhausted');
      expect(getStaminaSemantic(10)).toBe('Collapsing');
    });

    it('getTraumaSemantic returns correct strings', () => {
      expect(getTraumaSemantic(10)).toBe('Lucid');
      expect(getTraumaSemantic(30)).toBe('Shaken');
      expect(getTraumaSemantic(60)).toBe('Disturbed');
      expect(getTraumaSemantic(90)).toBe('Fractured');
    });
  });
});
