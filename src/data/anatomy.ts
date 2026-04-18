/**
 * Elder Scrolls Gender-Specific Anatomy
 * Male/female body proportions, secondary characteristics, and
 * sprite rendering parameters for all 10 playable races.
 *
 * Values are relative ratios (0-1) or arbitrary units calibrated
 * for CSS-variable-based sprite rendering.
 */

export type MuscleMass = 'low' | 'moderate' | 'high' | 'extreme';
export type FatDistribution = 'even' | 'upper_heavy' | 'lower_heavy' | 'hips_thighs';
export type BodyTypeVariant = 'slim' | 'average' | 'athletic' | 'stocky' | 'curvy' | 'muscular';

export interface GenderSpecificAnatomy {
  /** Shoulder width as fraction of total height (0-1) */
  shoulder_width_ratio: number;
  /** Hip width as fraction of total height (0-1) */
  hip_width_ratio: number;
  /** Torso length as fraction of total height (0-1) */
  torso_length_ratio: number;
  /** Arm length as fraction of total height (0-1) */
  arm_length_ratio: number;
  /** Leg length as fraction of total height (0-1) */
  leg_length_ratio: number;
  /** Baseline muscle mass category */
  muscle_mass: MuscleMass;
  /** Where body fat tends to accumulate */
  body_fat_distribution: FatDistribution;
  /** Chest size range in arbitrary sprite units */
  chest_size_range: { min: number; max: number };
  /** Waist-to-hip ratio for male variant */
  waist_to_hip_ratio_male: number;
  /** Waist-to-hip ratio for female variant */
  waist_to_hip_ratio_female: number;
  /** Average weight in kg for male variant */
  average_weight_kg_male: number;
  /** Average weight in kg for female variant */
  average_weight_kg_female: number;
  /** Descriptive secondary sex characteristics */
  secondary_sex_characteristics: {
    /** Facial hair tendency for males */
    facial_hair_male: string;
    /** Bust/chest description for females */
    bust_female: string;
    /** Jawline shape for males */
    jawline_male: string;
    /** Jawline shape for females */
    jawline_female: string;
    /** Body hair tendencies */
    body_hair: string;
    /** Pelvic/hip shape differences */
    hip_shape_male: string;
    hip_shape_female: string;
    /** Additional gender-specific visual notes */
    additional_notes: string;
  };
}

/** Top-level map: race name -> { male, female } anatomy */
export type GenderSpecificRaceData = Record<string, { male: GenderSpecificAnatomy; female: GenderSpecificAnatomy }>;

/**
 * All gender-specific anatomy data for the 10 Elder Scrolls races.
 * Proportions are informed by canonical heights, builds, and lore.
 */
export const GENDER_SPECIFIC_ANATOMY: GenderSpecificRaceData = {

  /**
   * Nords -- tall, broad, muscular Scandinavian-inspired physiology.
   * Males are especially broad-shouldered with thick builds;
   * females retain a powerful, athletic frame with wider hips.
   */
  Nord: {
    male: {
      shoulder_width_ratio: 0.27,
      hip_width_ratio: 0.19,
      torso_length_ratio: 0.35,
      arm_length_ratio: 0.31,
      leg_length_ratio: 0.34,
      muscle_mass: 'extreme',
      body_fat_distribution: 'even',
      chest_size_range: { min: 110, max: 130 },
      waist_to_hip_ratio_male: 0.88,
      waist_to_hip_ratio_female: 0.82,
      average_weight_kg_male: 98,
      average_weight_kg_female: 72,
      secondary_sex_characteristics: {
        facial_hair_male: 'Thick, full beards common; Braided warrior beards cultural norm',
        bust_female: 'Full and athletic; sturdy ribcage with moderate bust',
        jawline_male: 'Very square and prominent; broad chin with thick bone structure',
        jawline_female: 'Strong and defined; wider jaw than typical women',
        body_hair: 'Heavy body hair on males; females moderate',
        hip_shape_male: 'Narrow pelvis, straight torso-to-hip line',
        hip_shape_female: 'Moderately wide pelvis with muscular thighs',
        additional_notes: 'Massive ribcage, thick necks, broad clavicles across both genders',
      },
    },
    female: {
      shoulder_width_ratio: 0.23,
      hip_width_ratio: 0.22,
      torso_length_ratio: 0.34,
      arm_length_ratio: 0.30,
      leg_length_ratio: 0.36,
      muscle_mass: 'high',
      body_fat_distribution: 'hips_thighs',
      chest_size_range: { min: 85, max: 115 },
      waist_to_hip_ratio_male: 0.88,
      waist_to_hip_ratio_female: 0.78,
      average_weight_kg_male: 98,
      average_weight_kg_female: 72,
      secondary_sex_characteristics: {
        facial_hair_male: 'Thick, full beards common; Braided warrior beards cultural norm',
        bust_female: 'Full and athletic; sturdy ribcage with moderate bust',
        jawline_male: 'Very square and prominent; broad chin with thick bone structure',
        jawline_female: 'Strong and defined; wider jaw than typical women',
        body_hair: 'Heavy body hair on males; females moderate',
        hip_shape_male: 'Narrow pelvis, straight torso-to-hip line',
        hip_shape_female: 'Moderately wide pelvis with muscular thighs',
        additional_notes: 'Massive ribcage, thick necks, broad clavicles across both genders',
      },
    },
  },

  /**
   * Imperials -- Mediterranean proportions, balanced and versatile.
   * Moderate builds with evenly distributed features.
   */
  Imperial: {
    male: {
      shoulder_width_ratio: 0.24,
      hip_width_ratio: 0.18,
      torso_length_ratio: 0.34,
      arm_length_ratio: 0.30,
      leg_length_ratio: 0.36,
      muscle_mass: 'moderate',
      body_fat_distribution: 'even',
      chest_size_range: { min: 95, max: 115 },
      waist_to_hip_ratio_male: 0.86,
      waist_to_hip_ratio_female: 0.80,
      average_weight_kg_male: 78,
      average_weight_kg_female: 62,
      secondary_sex_characteristics: {
        facial_hair_male: 'Moderate growth; clean-shaven common among nobility',
        bust_female: 'Moderate, well-proportioned; balanced frame',
        jawline_male: 'Defined but not overly broad; rounded chin',
        jawline_female: 'Soft oval shape with subtle definition',
        body_hair: 'Light to moderate body hair on males; sparse on females',
        hip_shape_male: 'Narrow-moderate pelvis; athletic taper',
        hip_shape_female: 'Noticeable hip curve with proportional thighs',
        additional_notes: 'Balanced golden-ratio proportions; athletic without extremes',
      },
    },
    female: {
      shoulder_width_ratio: 0.21,
      hip_width_ratio: 0.21,
      torso_length_ratio: 0.33,
      arm_length_ratio: 0.29,
      leg_length_ratio: 0.38,
      muscle_mass: 'moderate',
      body_fat_distribution: 'hips_thighs',
      chest_size_range: { min: 78, max: 100 },
      waist_to_hip_ratio_male: 0.86,
      waist_to_hip_ratio_female: 0.72,
      average_weight_kg_male: 78,
      average_weight_kg_female: 62,
      secondary_sex_characteristics: {
        facial_hair_male: 'Moderate growth; clean-shaven common among nobility',
        bust_female: 'Moderate, well-proportioned; balanced frame',
        jawline_male: 'Defined but not overly broad; rounded chin',
        jawline_female: 'Soft oval shape with subtle definition',
        body_hair: 'Light to moderate body hair on males; sparse on females',
        hip_shape_male: 'Narrow-moderate pelvis; athletic taper',
        hip_shape_female: 'Noticeable hip curve with proportional thighs',
        additional_notes: 'Balanced golden-ratio proportions; athletic without extremes',
      },
    },
  },

  /**
   * Bretons -- lighter-framed half-elf heritage.
   * Slimmer and less robust than pure human races with a more delicate appearance.
   */
  Breton: {
    male: {
      shoulder_width_ratio: 0.22,
      hip_width_ratio: 0.17,
      torso_length_ratio: 0.33,
      arm_length_ratio: 0.29,
      leg_length_ratio: 0.38,
      muscle_mass: 'low',
      body_fat_distribution: 'even',
      chest_size_range: { min: 85, max: 100 },
      waist_to_hip_ratio_male: 0.84,
      waist_to_hip_ratio_female: 0.78,
      average_weight_kg_male: 65,
      average_weight_kg_female: 52,
      secondary_sex_characteristics: {
        facial_hair_male: 'Light growth; many Breton men remain clean-shaven',
        bust_female: 'Small to moderate; delicate and lithe frame',
        jawline_male: 'Narrow and pointed rather than square; refined features',
        jawline_female: 'Delicate tapering jaw; heart-shaped face common',
        body_hair: 'Sparse body hair on males; very sparse on females',
        hip_shape_male: 'Narrow pelvis; boyish straight-line torso',
        hip_shape_female: 'Subtle curves; narrow but proportionally defined',
        additional_notes: 'Slender collarbones, fine bone structure throughout; subtle elven grace',
      },
    },
    female: {
      shoulder_width_ratio: 0.19,
      hip_width_ratio: 0.19,
      torso_length_ratio: 0.32,
      arm_length_ratio: 0.28,
      leg_length_ratio: 0.40,
      muscle_mass: 'low',
      body_fat_distribution: 'hips_thighs',
      chest_size_range: { min: 70, max: 88 },
      waist_to_hip_ratio_male: 0.84,
      waist_to_hip_ratio_female: 0.68,
      average_weight_kg_male: 65,
      average_weight_kg_female: 52,
      secondary_sex_characteristics: {
        facial_hair_male: 'Light growth; many Breton men remain clean-shaven',
        bust_female: 'Small to moderate; delicate and lithe frame',
        jawline_male: 'Narrow and pointed rather than square; refined features',
        jawline_female: 'Delicate tapering jaw; heart-shaped face common',
        body_hair: 'Sparse body hair on males; very sparse on females',
        hip_shape_male: 'Narrow pelvis; boyish straight-line torso',
        hip_shape_female: 'Subtle curves; narrow but proportionally defined',
        additional_notes: 'Slender collarbones, fine bone structure throughout; subtle elven grace',
      },
    },
  },

  /**
   * Redguards -- wiry, athletic, desert-adapted physiology.
   * Lean but powerfully built with high muscle definition and low body fat.
   */
  Redguard: {
    male: {
      shoulder_width_ratio: 0.25,
      hip_width_ratio: 0.18,
      torso_length_ratio: 0.34,
      arm_length_ratio: 0.30,
      leg_length_ratio: 0.36,
      muscle_mass: 'high',
      body_fat_distribution: 'even',
      chest_size_range: { min: 100, max: 118 },
      waist_to_hip_ratio_male: 0.85,
      waist_to_hip_ratio_female: 0.76,
      average_weight_kg_male: 80,
      average_weight_kg_female: 64,
      secondary_sex_characteristics: {
        facial_hair_male: 'Sparse to moderate; many shave for combat practicality',
        bust_female: 'Firm and compact; lean athletic build with toned chest',
        jawline_male: 'Chiseled and angular; strong jaw without excess width',
        jawline_female: 'Sharp cheekbones with defined but feminine jaw',
        body_hair: 'Minimal body hair on males; very sparse on females',
        hip_shape_male: 'Athletic V-taper; narrow hips under broad shoulders',
        hip_shape_female: 'Defined but not wide; toned and firm',
        additional_notes: 'Long lean muscles, visible tendon definition, low body fat year-round',
      },
    },
    female: {
      shoulder_width_ratio: 0.22,
      hip_width_ratio: 0.20,
      torso_length_ratio: 0.33,
      arm_length_ratio: 0.29,
      leg_length_ratio: 0.38,
      muscle_mass: 'high',
      body_fat_distribution: 'even',
      chest_size_range: { min: 75, max: 95 },
      waist_to_hip_ratio_male: 0.85,
      waist_to_hip_ratio_female: 0.70,
      average_weight_kg_male: 80,
      average_weight_kg_female: 64,
      secondary_sex_characteristics: {
        facial_hair_male: 'Sparse to moderate; many shave for combat practicality',
        bust_female: 'Firm and compact; lean athletic build with toned chest',
        jawline_male: 'Chiseled and angular; strong jaw without excess width',
        jawline_female: 'Sharp cheekbones with defined but feminine jaw',
        body_hair: 'Minimal body hair on males; very sparse on females',
        hip_shape_male: 'Athletic V-taper; narrow hips under broad shoulders',
        hip_shape_female: 'Defined but not wide; toned and firm',
        additional_notes: 'Long lean muscles, visible tendon definition, low body fat year-round',
      },
    },
  },

  /**
   * Dunmer (Dark Elves) -- wiry, ashland-adapted frames.
   * Lean and sinewy with a gaunt but powerful appearance.
   */
  Dunmer: {
    male: {
      shoulder_width_ratio: 0.23,
      hip_width_ratio: 0.17,
      torso_length_ratio: 0.34,
      arm_length_ratio: 0.30,
      leg_length_ratio: 0.36,
      muscle_mass: 'moderate',
      body_fat_distribution: 'upper_heavy',
      chest_size_range: { min: 90, max: 105 },
      waist_to_hip_ratio_male: 0.84,
      waist_to_hip_ratio_female: 0.78,
      average_weight_kg_male: 68,
      average_weight_kg_female: 55,
      secondary_sex_characteristics: {
        facial_hair_male: 'Sparse; a few ashlanders grow thin goatees',
        bust_female: 'Small and modest; lean frame with minimal body fat reserves',
        jawline_male: 'Angular and gaunt; prominent cheekbones create hollow cheeks',
        jawline_female: 'Elegant pointed features; angular but feminine',
        body_hair: 'Sparse body hair on both genders',
        hip_shape_male: 'Very narrow pelvis; straight-hipped',
        hip_shape_female: 'Narrow hips with subtle curve; wiry build dominates',
        additional_notes: 'Visible tendons, slender wrists and ankles; ashland toughness in lean frame',
      },
    },
    female: {
      shoulder_width_ratio: 0.20,
      hip_width_ratio: 0.19,
      torso_length_ratio: 0.33,
      arm_length_ratio: 0.29,
      leg_length_ratio: 0.38,
      muscle_mass: 'low',
      body_fat_distribution: 'upper_heavy',
      chest_size_range: { min: 70, max: 85 },
      waist_to_hip_ratio_male: 0.84,
      waist_to_hip_ratio_female: 0.74,
      average_weight_kg_male: 68,
      average_weight_kg_female: 55,
      secondary_sex_characteristics: {
        facial_hair_male: 'Sparse; a few ashlanders grow thin goatees',
        bust_female: 'Small and modest; lean frame with minimal body fat reserves',
        jawline_male: 'Angular and gaunt; prominent cheekbones create hollow cheeks',
        jawline_female: 'Elegant pointed features; angular but feminine',
        body_hair: 'Sparse body hair on both genders',
        hip_shape_male: 'Very narrow pelvis; straight-hipped',
        hip_shape_female: 'Narrow hips with subtle curve; wiry build dominates',
        additional_notes: 'Visible tendons, slender wrists and ankles; ashland toughness in lean frame',
      },
    },
  },

  /**
   * Altmer (High Elves) -- tallest race with statuesque, elongated proportions.
   * Tall, elegant, and refined with a regal bearing.
   */
  Altmer: {
    male: {
      shoulder_width_ratio: 0.24,
      hip_width_ratio: 0.16,
      torso_length_ratio: 0.33,
      arm_length_ratio: 0.31,
      leg_length_ratio: 0.36,
      muscle_mass: 'moderate',
      body_fat_distribution: 'even',
      chest_size_range: { min: 98, max: 115 },
      waist_to_hip_ratio_male: 0.82,
      waist_to_hip_ratio_female: 0.74,
      average_weight_kg_male: 82,
      average_weight_kg_female: 62,
      secondary_sex_characteristics: {
        facial_hair_male: 'Rare; Altmer cultural preference for clean faces',
        bust_female: 'Modest to moderate; elongated torso distributes mass gracefully',
        jawline_male: 'Long, elegant proportions; narrow jaw with regal angles',
        jawline_female: 'Refined and elongated; high cheekbones, narrow chin',
        body_hair: 'Virtually no body hair on either gender',
        hip_shape_male: 'Very narrow; elongated hip bones',
        hip_shape_female: 'Hip bones prominent with graceful curve; tall and statuesque',
        additional_notes: 'Long limbs, elongated necks and fingers; golden skin with lithe elegance',
      },
    },
    female: {
      shoulder_width_ratio: 0.21,
      hip_width_ratio: 0.19,
      torso_length_ratio: 0.32,
      arm_length_ratio: 0.30,
      leg_length_ratio: 0.38,
      muscle_mass: 'low',
      body_fat_distribution: 'even',
      chest_size_range: { min: 78, max: 95 },
      waist_to_hip_ratio_male: 0.82,
      waist_to_hip_ratio_female: 0.68,
      average_weight_kg_male: 82,
      average_weight_kg_female: 62,
      secondary_sex_characteristics: {
        facial_hair_male: 'Rare; Altmer cultural preference for clean faces',
        bust_female: 'Modest to moderate; elongated torso distributes mass gracefully',
        jawline_male: 'Long, elegant proportions; narrow jaw with regal angles',
        jawline_female: 'Refined and elongated; high cheekbones, narrow chin',
        body_hair: 'Virtually no body hair on either gender',
        hip_shape_male: 'Very narrow; elongated hip bones',
        hip_shape_female: 'Hip bones prominent with graceful curve; tall and statuesque',
        additional_notes: 'Long limbs, elongated necks and fingers; golden skin with lithe elegance',
      },
    },
  },

  /**
   * Bosmer (Wood Elves) -- smallest humanoid race, compact and agile.
   * Short, wiry frames built for forest agility and archery.
   */
  Bosmer: {
    male: {
      shoulder_width_ratio: 0.22,
      hip_width_ratio: 0.17,
      torso_length_ratio: 0.33,
      arm_length_ratio: 0.30,
      leg_length_ratio: 0.37,
      muscle_mass: 'moderate',
      body_fat_distribution: 'even',
      chest_size_range: { min: 82, max: 96 },
      waist_to_hip_ratio_male: 0.83,
      waist_to_hip_ratio_female: 0.76,
      average_weight_kg_male: 55,
      average_weight_kg_female: 44,
      secondary_sex_characteristics: {
        facial_hair_male: 'Sparse; some Green Pact Bosmer grow patchy beards',
        bust_female: 'Small and compact; petite frame overall',
        jawline_male: 'Compact and angular; narrow for stature',
        jawline_female: 'Petite and pointed; delicate facial structure',
        body_hair: 'Light body hair on males; females very sparse',
        hip_shape_male: 'Narrow; boyish and lithe',
        hip_shape_female: 'Subtly curved; small pelvis with proportionally wider hips',
        additional_notes: 'Slightly longer legs relative to torso for agility; lean and sinewy',
      },
    },
    female: {
      shoulder_width_ratio: 0.19,
      hip_width_ratio: 0.19,
      torso_length_ratio: 0.32,
      arm_length_ratio: 0.29,
      leg_length_ratio: 0.39,
      muscle_mass: 'low',
      body_fat_distribution: 'lower_heavy',
      chest_size_range: { min: 68, max: 82 },
      waist_to_hip_ratio_male: 0.83,
      waist_to_hip_ratio_female: 0.70,
      average_weight_kg_male: 55,
      average_weight_kg_female: 44,
      secondary_sex_characteristics: {
        facial_hair_male: 'Sparse; some Green Pact Bosmer grow patchy beards',
        bust_female: 'Small and compact; petite frame overall',
        jawline_male: 'Compact and angular; narrow for stature',
        jawline_female: 'Petite and pointed; delicate facial structure',
        body_hair: 'Light body hair on males; females very sparse',
        hip_shape_male: 'Narrow; boyish and lithe',
        hip_shape_female: 'Subtly curved; small pelvis with proportionally wider hips',
        additional_notes: 'Slightly longer legs relative to torso for agility; lean and sinewy',
      },
    },
  },

  /**
   * Orsimer (Orcs) -- most physically robust race with extreme muscle density.
   * Thick-boned, massively muscled, barrel-chested power builds.
   */
  Orsimer: {
    male: {
      shoulder_width_ratio: 0.30,
      hip_width_ratio: 0.21,
      torso_length_ratio: 0.36,
      arm_length_ratio: 0.31,
      leg_length_ratio: 0.33,
      muscle_mass: 'extreme',
      body_fat_distribution: 'upper_heavy',
      chest_size_range: { min: 120, max: 140 },
      waist_to_hip_ratio_male: 0.88,
      waist_to_hip_ratio_female: 0.80,
      average_weight_kg_male: 112,
      average_weight_kg_female: 85,
      secondary_sex_characteristics: {
        facial_hair_male: 'Thick heavy beards common; braided warrior beards; often integrated with tusks',
        bust_female: 'Large and full; heavy-chested with thick ribcage',
        jawline_male: 'Massive square jaw; tusks protrude prominently from lower lip',
        jawline_female: 'Broad jawline softened by facial fat; tusks visible on both genders',
        body_hair: 'Very heavy body hair on males; moderate to heavy on females',
        hip_shape_male: 'Blocky wide pelvis; massive lower frame to support muscular upper body',
        hip_shape_female: 'Very wide and powerful hips; thick thighs matching upper body mass',
        additional_notes: 'Exceptionally thick neck, bony brow ridge visible, green muscular bulk across entire frame',
      },
    },
    female: {
      shoulder_width_ratio: 0.25,
      hip_width_ratio: 0.25,
      torso_length_ratio: 0.35,
      arm_length_ratio: 0.30,
      leg_length_ratio: 0.35,
      muscle_mass: 'high',
      body_fat_distribution: 'hips_thighs',
      chest_size_range: { min: 95, max: 120 },
      waist_to_hip_ratio_male: 0.88,
      waist_to_hip_ratio_female: 0.76,
      average_weight_kg_male: 112,
      average_weight_kg_female: 85,
      secondary_sex_characteristics: {
        facial_hair_male: 'Thick heavy beards common; braided warrior beards; often integrated with tusks',
        bust_female: 'Large and full; heavy-chested with thick ribcage',
        jawline_male: 'Massive square jaw; tusks protrude prominently from lower lip',
        jawline_female: 'Broad jawline softened by facial fat; tusks visible on both genders',
        body_hair: 'Very heavy body hair on males; moderate to heavy on females',
        hip_shape_male: 'Blocky wide pelvis; massive lower frame to support muscular upper body',
        hip_shape_female: 'Very wide and powerful hips; thick thighs matching upper body mass',
        additional_notes: 'Exceptionally thick neck, bony brow ridge visible, green muscular bulk across entire frame',
      },
    },
  },

  /**
   * Khajiit -- feline digitigrade physiology with fur-covered bodies.
   * Tail, cat ears, muzzle, and digitigrade legs distinguish from humanoid races.
   * Proportions reflect lithe predatory builds.
   */
  Khajiit: {
    male: {
      shoulder_width_ratio: 0.25,
      hip_width_ratio: 0.16,
      torso_length_ratio: 0.32,
      arm_length_ratio: 0.30,
      leg_length_ratio: 0.38,
      muscle_mass: 'high',
      body_fat_distribution: 'even',
      chest_size_range: { min: 88, max: 105 },
      waist_to_hip_ratio_male: 0.80,
      waist_to_hip_ratio_female: 0.72,
      average_weight_kg_male: 70,
      average_weight_kg_female: 58,
      secondary_sex_characteristics: {
        facial_hair_male: 'No facial hair; fur pattern on cheeks/mane-like ruff more common on males',
        bust_female: 'Flat/male-pattern chest in most subtypes; slight swelling in larger forms',
        jawline_male: 'Pronounced feline muzzle; strong jawline with visible cheek whiskers',
        jawline_female: 'Slightly narrower muzzle; more tapered feline face',
        body_hair: 'Full body fur replaces hair; fur patterns vary by lunar birth-type',
        hip_shape_male: 'Very narrow digitigrade hip; feline tucked-abdomen silhouette',
        hip_shape_female: 'Slightly wider pelvis but still slim; digitigrade stance narrows visual hip',
        additional_notes: 'Digitigrade legs add height visually; long tail for balance; paw-like hands and feet',
      },
    },
    female: {
      shoulder_width_ratio: 0.22,
      hip_width_ratio: 0.19,
      torso_length_ratio: 0.31,
      arm_length_ratio: 0.29,
      leg_length_ratio: 0.40,
      muscle_mass: 'moderate',
      body_fat_distribution: 'even',
      chest_size_range: { min: 72, max: 90 },
      waist_to_hip_ratio_male: 0.80,
      waist_to_hip_ratio_female: 0.68,
      average_weight_kg_male: 70,
      average_weight_kg_female: 58,
      secondary_sex_characteristics: {
        facial_hair_male: 'No facial hair; fur pattern on cheeks/mane-like ruff more common on males',
        bust_female: 'Flat/male-pattern chest in most subtypes; slight swelling in larger forms',
        jawline_male: 'Pronounced feline muzzle; strong jawline with visible cheek whiskers',
        jawline_female: 'Slightly narrower muzzle; more tapered feline face',
        body_hair: 'Full body fur replaces hair; fur patterns vary by lunar birth-type',
        hip_shape_male: 'Very narrow digitigrade hip; feline tucked-abdomen silhouette',
        hip_shape_female: 'Slightly wider pelvis but still slim; digitigrade stance narrows visual hip',
        additional_notes: 'Digitigrade legs add height visually; long tail for balance; paw-like hands and feet',
      },
    },
  },

  /**
   * Argonian -- reptilian humanoid with scales, tail, snout, and head frills.
   * Amphibious physiology with a lithe but muscular aquatic build.
   */
  Argonian: {
    male: {
      shoulder_width_ratio: 0.24,
      hip_width_ratio: 0.17,
      torso_length_ratio: 0.34,
      arm_length_ratio: 0.30,
      leg_length_ratio: 0.36,
      muscle_mass: 'high',
      body_fat_distribution: 'even',
      chest_size_range: { min: 92, max: 108 },
      waist_to_hip_ratio_male: 0.82,
      waist_to_hip_ratio_female: 0.76,
      average_weight_kg_male: 75,
      average_weight_kg_female: 62,
      secondary_sex_characteristics: {
        facial_hair_male: 'No hair whatsoever; males may develop larger head frills or crest horns',
        bust_female: 'Flat reptilian chest; no mammary development; ribcage same for both genders',
        jawline_male: 'Broad lizard snout; heavy jaw structure with visible scale armor plates',
        jawline_female: 'Slightly narrower snout; head frills more ornamental than male',
        body_hair: 'No body hair; full scale coverage with species-specific color and pattern',
        hip_shape_male: 'Narrow reptilian pelvis; streamlined for swimming',
        hip_shape_female: 'Marginally wider for egg-laying anatomy; tail base accordingly broader',
        additional_notes: 'Long thick tail used for swimming and balance; clawed hands and feet; aquatic build',
      },
    },
    female: {
      shoulder_width_ratio: 0.21,
      hip_width_ratio: 0.20,
      torso_length_ratio: 0.33,
      arm_length_ratio: 0.29,
      leg_length_ratio: 0.38,
      muscle_mass: 'moderate',
      body_fat_distribution: 'lower_heavy',
      chest_size_range: { min: 75, max: 92 },
      waist_to_hip_ratio_male: 0.82,
      waist_to_hip_ratio_female: 0.74,
      average_weight_kg_male: 75,
      average_weight_kg_female: 62,
      secondary_sex_characteristics: {
        facial_hair_male: 'No hair whatsoever; males may develop larger head frills or crest horns',
        bust_female: 'Flat reptilian chest; no mammary development; ribcage same for both genders',
        jawline_male: 'Broad lizard snout; heavy jaw structure with visible scale armor plates',
        jawline_female: 'Slightly narrower snout; head frills more ornamental than male',
        body_hair: 'No body hair; full scale coverage with species-specific color and pattern',
        hip_shape_male: 'Narrow reptilian pelvis; streamlined for swimming',
        hip_shape_female: 'Marginally wider for egg-laying anatomy; tail base accordingly broader',
        additional_notes: 'Long thick tail used for swimming and balance; clawed hands and feet; aquatic build',
      },
    },
  },

};

/**
 * Look up anatomy data for a specific race and gender.
 * Falls back to Imperial if the race is unrecognized.
 */
export function getGenderAnatomy(
  race: string,
  gender: 'male' | 'female',
): GenderSpecificAnatomy {
  const normalized = race.trim();
  const data = GENDER_SPECIFIC_ANATOMY[normalized];
  if (data) {
    return gender === 'male' ? data.male : data.female;
  }
  // Case-insensitive fallback
  for (const [key, value] of Object.entries(GENDER_SPECIFIC_ANATOMY)) {
    if (key.toLowerCase() === normalized.toLowerCase()) {
      return gender === 'male' ? value.male : value.female;
    }
  }
  // Default to Imperial
  return gender === 'male'
    ? GENDER_SPECIFIC_ANATOMY.Imperial.male
    : GENDER_SPECIFIC_ANATOMY.Imperial.female;
}

/**
 * CSS variable name mapping for sprite rendering.
 * Each return value represents a CSS custom property suffix.
 */
export interface SpriteConfig {
  '--shoulder-width': string;
  '--hip-width': string;
  '--torso-length': string;
  '--arm-length': string;
  '--leg-length': string;
  '--muscle-mass': string;
  '--fat-distribution': string;
  '--chest-size': string;
  '--waist-hip-ratio': string;
  '--avg-weight': string;
  '--secondary-trait': string;
  '--body-type': string;
}

/**
 * Scaling modifiers applied to base anatomy values based on body type.
 * These shift proportions from the race baseline.
 */
export function getBodyTypeModifiers(bodyType: BodyTypeVariant): {
  shoulderScale: number;
  hipScale: number;
  muscleScale: number;
  chestScale: number;
} {
  const modifiers: Record<BodyTypeVariant, { shoulderScale: number; hipScale: number; muscleScale: number; chestScale: number }> = {
    slim:     { shoulderScale: 0.90, hipScale: 0.92, muscleScale: 0.75, chestScale: 0.88 },
    average:  { shoulderScale: 1.00, hipScale: 1.00, muscleScale: 1.00, chestScale: 1.00 },
    athletic: { shoulderScale: 1.08, hipScale: 0.95, muscleScale: 1.20, chestScale: 1.05 },
    stocky:   { shoulderScale: 1.10, hipScale: 1.08, muscleScale: 0.90, chestScale: 1.12 },
    curvy:    { shoulderScale: 0.95, hipScale: 1.15, muscleScale: 0.85, chestScale: 1.15 },
    muscular: { shoulderScale: 1.15, hipScale: 0.95, muscleScale: 1.35, chestScale: 1.10 },
  };
  return modifiers[bodyType] ?? modifiers.average;
}

/**
 * Build a complete sprite configuration object with CSS variable values
 * for a specific race, gender, and body type.
 *
 * Example output:
 *  '--shoulder-width': '0.2512',
 *  '--muscle-mass': '1.20',
 *  '--body-type': 'athletic',
 *  etc.
 */
export function buildSpriteConfig(
  race: string,
  gender: 'male' | 'female',
  bodyType: BodyTypeVariant,
): SpriteConfig {
  const anatomy = getGenderAnatomy(race, gender);
  const mods = getBodyTypeModifiers(bodyType);

  // Apply body type scaling to base ratios
  const shoulderWidth = anatomy.shoulder_width_ratio * mods.shoulderScale;
  const hipWidth = anatomy.hip_width_ratio * mods.hipScale;
  const muscleLevel = anatomy.muscle_mass === 'low' ? 0.5
    : anatomy.muscle_mass === 'moderate' ? 1.0
    : anatomy.muscle_mass === 'high' ? 1.5 : 2.0;
  const scaledMuscle = muscleLevel * mods.muscleScale;
  const scaledChest = ((anatomy.chest_size_range.min + anatomy.chest_size_range.max) / 2) * mods.chestScale;
  const waistHipRatio = gender === 'male'
    ? anatomy.waist_to_hip_ratio_male
    : anatomy.waist_to_hip_ratio_female;

  // Secondary trait label for CSS-driven styling decisions
  const sexDesc = anatomy.secondary_sex_characteristics;
  const secondaryTrait = gender === 'male'
    ? `${sexDesc.facial_hair_male}; ${sexDesc.jawline_male}`
    : `${sexDesc.bust_female}; ${sexDesc.jawline_female}`;

  return {
    '--shoulder-width': shoulderWidth.toFixed(4),
    '--hip-width': hipWidth.toFixed(4),
    '--torso-length': anatomy.torso_length_ratio.toFixed(4),
    '--arm-length': anatomy.arm_length_ratio.toFixed(4),
    '--leg-length': anatomy.leg_length_ratio.toFixed(4),
    '--muscle-mass': scaledMuscle.toFixed(4),
    '--fat-distribution': anatomy.body_fat_distribution,
    '--chest-size': scaledChest.toFixed(2),
    '--waist-hip-ratio': waistHipRatio.toFixed(4),
    '--avg-weight': (gender === 'male' ? anatomy.average_weight_kg_male : anatomy.average_weight_kg_female).toFixed(1),
    '--secondary-trait': secondaryTrait,
    '--body-type': bodyType,
  };
}
