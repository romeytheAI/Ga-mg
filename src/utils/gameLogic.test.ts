import { describe, it, expect } from 'vitest';
import { getHealthSemantic, getStaminaSemantic, getTraumaSemantic } from './gameLogic';

describe('gameLogic semantic helpers', () => {
  describe('getHealthSemantic', () => {
    it('returns "Robust" for values > 80', () => {
      expect(getHealthSemantic(100)).toBe('Robust');
      expect(getHealthSemantic(81)).toBe('Robust');
    });

    it('returns "Battered" for values between 51 and 80', () => {
      expect(getHealthSemantic(80)).toBe('Battered');
      expect(getHealthSemantic(79)).toBe('Battered');
      expect(getHealthSemantic(51)).toBe('Battered');
    });

    it('returns "Bleeding" for values between 21 and 50', () => {
      expect(getHealthSemantic(50)).toBe('Bleeding');
      expect(getHealthSemantic(49)).toBe('Bleeding');
      expect(getHealthSemantic(21)).toBe('Bleeding');
    });

    it('returns "Death\'s Door" for values <= 20', () => {
      expect(getHealthSemantic(20)).toBe("Death's Door");
      expect(getHealthSemantic(19)).toBe("Death's Door");
      expect(getHealthSemantic(0)).toBe("Death's Door");
    });
  });

  describe('getStaminaSemantic', () => {
    it('returns "Energetic" for values > 80', () => {
      expect(getStaminaSemantic(100)).toBe('Energetic');
      expect(getStaminaSemantic(81)).toBe('Energetic');
    });

    it('returns "Winded" for values between 51 and 80', () => {
      expect(getStaminaSemantic(80)).toBe('Winded');
      expect(getStaminaSemantic(79)).toBe('Winded');
      expect(getStaminaSemantic(51)).toBe('Winded');
    });

    it('returns "Exhausted" for values between 21 and 50', () => {
      expect(getStaminaSemantic(50)).toBe('Exhausted');
      expect(getStaminaSemantic(49)).toBe('Exhausted');
      expect(getStaminaSemantic(21)).toBe('Exhausted');
    });

    it('returns "Collapsing" for values <= 20', () => {
      expect(getStaminaSemantic(20)).toBe('Collapsing');
      expect(getStaminaSemantic(19)).toBe('Collapsing');
      expect(getStaminaSemantic(0)).toBe('Collapsing');
    });
  });

  describe('getTraumaSemantic', () => {
    it('returns "Lucid" for values < 20', () => {
      expect(getTraumaSemantic(0)).toBe('Lucid');
      expect(getTraumaSemantic(19)).toBe('Lucid');
    });

    it('returns "Shaken" for values between 20 and 49', () => {
      expect(getTraumaSemantic(20)).toBe('Shaken');
      expect(getTraumaSemantic(21)).toBe('Shaken');
      expect(getTraumaSemantic(49)).toBe('Shaken');
    });

    it('returns "Disturbed" for values between 50 and 79', () => {
      expect(getTraumaSemantic(50)).toBe('Disturbed');
      expect(getTraumaSemantic(51)).toBe('Disturbed');
      expect(getTraumaSemantic(79)).toBe('Disturbed');
    });

    it('returns "Fractured" for values >= 80', () => {
      expect(getTraumaSemantic(80)).toBe('Fractured');
      expect(getTraumaSemantic(81)).toBe('Fractured');
      expect(getTraumaSemantic(100)).toBe('Fractured');
    });
  });
});
