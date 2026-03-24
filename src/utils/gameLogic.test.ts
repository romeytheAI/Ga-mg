import { describe, it, expect } from 'vitest';
import { getHealthSemantic, getStaminaSemantic, getTraumaSemantic } from './gameLogic';

describe('Semantic Health Functions', () => {
  describe('getHealthSemantic', () => {
    it('returns "Robust" for health > 80', () => {
      expect(getHealthSemantic(100)).toBe('Robust');
      expect(getHealthSemantic(81)).toBe('Robust');
    });

    it('returns "Battered" for 50 < health <= 80', () => {
      expect(getHealthSemantic(80)).toBe('Battered');
      expect(getHealthSemantic(51)).toBe('Battered');
    });

    it('returns "Bleeding" for 20 < health <= 50', () => {
      expect(getHealthSemantic(50)).toBe('Bleeding');
      expect(getHealthSemantic(21)).toBe('Bleeding');
    });

    it(`returns "Death's Door" for health <= 20`, () => {
      expect(getHealthSemantic(20)).toBe("Death's Door");
      expect(getHealthSemantic(0)).toBe("Death's Door");
      expect(getHealthSemantic(-10)).toBe("Death's Door");
    });
  });

  describe('getStaminaSemantic', () => {
    it('returns "Energetic" for stamina > 80', () => {
      expect(getStaminaSemantic(100)).toBe('Energetic');
      expect(getStaminaSemantic(81)).toBe('Energetic');
    });

    it('returns "Winded" for 50 < stamina <= 80', () => {
      expect(getStaminaSemantic(80)).toBe('Winded');
      expect(getStaminaSemantic(51)).toBe('Winded');
    });

    it('returns "Exhausted" for 20 < stamina <= 50', () => {
      expect(getStaminaSemantic(50)).toBe('Exhausted');
      expect(getStaminaSemantic(21)).toBe('Exhausted');
    });

    it('returns "Collapsing" for stamina <= 20', () => {
      expect(getStaminaSemantic(20)).toBe('Collapsing');
      expect(getStaminaSemantic(0)).toBe('Collapsing');
      expect(getStaminaSemantic(-10)).toBe('Collapsing');
    });
  });

  describe('getTraumaSemantic', () => {
    it('returns "Lucid" for trauma < 20', () => {
      expect(getTraumaSemantic(0)).toBe('Lucid');
      expect(getTraumaSemantic(19)).toBe('Lucid');
      expect(getTraumaSemantic(-10)).toBe('Lucid');
    });

    it('returns "Shaken" for 20 <= trauma < 50', () => {
      expect(getTraumaSemantic(20)).toBe('Shaken');
      expect(getTraumaSemantic(49)).toBe('Shaken');
    });

    it('returns "Disturbed" for 50 <= trauma < 80', () => {
      expect(getTraumaSemantic(50)).toBe('Disturbed');
      expect(getTraumaSemantic(79)).toBe('Disturbed');
    });

    it('returns "Fractured" for trauma >= 80', () => {
      expect(getTraumaSemantic(80)).toBe('Fractured');
      expect(getTraumaSemantic(100)).toBe('Fractured');
      expect(getTraumaSemantic(150)).toBe('Fractured');
    });
  });
});
