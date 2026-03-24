import { describe, it, expect } from 'vitest';
import { getAgeTag } from './gameLogic';

describe('getAgeTag', () => {
  describe('when race is Elf', () => {
    it('returns young adult tag for age < 100', () => {
      expect(getAgeTag(99, 'Elf')).toBe('[Player is a young, developing adult]');
      expect(getAgeTag(0, 'Elf')).toBe('[Player is a young, developing adult]');
    });

    it('returns mature adult tag for 100 <= age < 500', () => {
      expect(getAgeTag(100, 'Elf')).toBe('[Player is a mature adult]');
      expect(getAgeTag(250, 'Elf')).toBe('[Player is a mature adult]');
      expect(getAgeTag(499, 'Elf')).toBe('[Player is a mature adult]');
    });

    it('returns weathered elder tag for age >= 500', () => {
      expect(getAgeTag(500, 'Elf')).toBe('[Player is a weathered elder]');
      expect(getAgeTag(1000, 'Elf')).toBe('[Player is a weathered elder]');
    });
  });

  describe('when race is not Elf (e.g. Human, Orc)', () => {
    it('returns young adult tag for age < 60', () => {
      expect(getAgeTag(59, 'Human')).toBe('[Player is a young, developing adult]');
      expect(getAgeTag(0, 'Orc')).toBe('[Player is a young, developing adult]');
    });

    it('returns mature adult tag for 60 <= age < 200', () => {
      expect(getAgeTag(60, 'Human')).toBe('[Player is a mature adult]');
      expect(getAgeTag(100, 'Orc')).toBe('[Player is a mature adult]');
      expect(getAgeTag(199, 'Dwarf')).toBe('[Player is a mature adult]');
    });

    it('returns weathered elder tag for age >= 200', () => {
      expect(getAgeTag(200, 'Human')).toBe('[Player is a weathered elder]');
      expect(getAgeTag(300, 'Orc')).toBe('[Player is a weathered elder]');
    });
  });
});
