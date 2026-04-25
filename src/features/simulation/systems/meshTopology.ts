/**
 * 3D Mesh Topology Data for Elder Scrolls Character Models
 *
 * Comprehensive mesh topology definitions for male and female body anatomy
 * across all 10 playable races. Designed for 3D modelers, rigging artists,
 * and technical animators building humanoid body meshes.
 */

import type { RaceId } from './races';

// ─────────────────────────────────────────
// 1. TYPE DEFINITIONS
// ─────────────────────────────────────────

export type MeshZone =
  | 'head'
  | 'neck'
  | 'torso'
  | 'chest'
  | 'abdomen'
  | 'pelvis'
  | 'upper_arm'
  | 'lower_arm'
  | 'hand'
  | 'upper_leg'
  | 'lower_leg'
  | 'foot'
  | 'shoulders'
  | 'hips'
  | 'glutes'
  | 'male_genitalia';

export type MeshEdgeLoop = {
  /** Name describing the loop position */
  name: string;
  /** Which anatomical zone this loop wraps around */
  zone: MeshZone;
  /** Approximate position as percentage from top to bottom of zone (0=top, 100=bottom) */
  position: number;
  /** Approximate vertex count in this loop circle */
  vertexCount: number;
  /** Special notes */
  notes?: string;
};

export type MeshTopologyData = {
  targetTriangleCount: { low: number; medium: number; high: number };
  zoneWeight: Record<MeshZone, number>;
  edgeLoops: MeshEdgeLoop[];
};

export type GenderMeshDifferences = {
  femaleIncreasedZones: { zone: MeshZone; reason: string; addedPercent: number }[];
  maleIncreasedZones: { zone: MeshZone; reason: string; addedPercent: number }[];
  jointDifferences: {
    joint: string;
    axis: 'X''| 'Y''| 'Z';
    femaleOffset: string;
    maleOffset: string;
    reason: string;
  }[];
};

export type RaceMeshModifications = {
  morphTargets: string[];
  shapeDifferences: {
    zone: MeshZone;
    description: string;
    severity: 'subtle''| 'moderate''| 'extreme';
  }[];
  extraSections: {
    name: string;
    parentZone: MeshZone;
    triangleCount: number;
    notes: string;
  }[];
};

// ── Body Build & Size Tiers (DoL-inspired) ──

export type BodyBuildTier = 'tiny''| 'small''| 'normal''| 'large';
export type BodyPartSize = 'micro''| 'mini''| 'tiny''| 'small''| 'normal''| 'large''| 'enormous';
export type BreastSizeName = 'Flat''| 'A''| 'B''| 'C''| 'D''| 'E''| 'F''| 'G''| 'H''| 'I''| 'J''| 'K''| 'Enormous';
export type AssSizeName = 'Tiny''| 'Small''| 'Petite''| 'Average''| 'Medium''| 'Athletic''| 'Large''| 'Thick''| 'Enormous';

export type BodyBuildData = {
  tier: BodyBuildTier;
  physique_cap: number;
  damage_modifier: string;
  scale_multipliers: Record<'height''| 'width''| 'muscle_mass''| 'subcutaneous_fat', number>;
  mesh_zones_affected: { zone: MeshZone; scale_factor: number }[];
};

export type SizeReferenceEntry = {
  size: string;
  scale_factor: number;
  vertex_range?: [number, number];
  affected_zones: MeshZone[];
  notes?: string;
};

export type MaleAnatomyData = {
  flaccid: {
    length_range_cm: [number, number];
    girth_range_cm: [number, number];
    vertical_drop_cm: number;
    morph_targets: { translation_y: number; translation_z: number; scale_xyz: [number, number, number] };
    vertex_count_tier: Record<'micro''| 'mini''| 'tiny''| 'small''| 'normal''| 'large''| 'enormous', number>;
  };
  erect: {
    length_expansion_percent: number;
    girth_expansion_percent: number;
    lift_angle_degrees: number;
    morph_targets: { translation_y: number; translation_z: number; scale_xyz: [number, number, number] };
    vertex_count_tier: Record<'micro''| 'mini''| 'tiny''| 'small''| 'normal''| 'large''| 'enormous', number>;
  };
  scrotum: {
    vertex_count: number;
    left_lower_offset_cm: number;
    temperature_response: { cold: string; warm: string };
    morph_targets: { hang_relaxed: [number, number, number]; tensed: [number, number, number] };
  };
  temperature_effects: {
    cold_response: 'cremaster_reflex_contraction';
    skin_contraction_percent: number;
    surface_area_reduction: number;
    color_shift: 'darker_and_rounder';
  };
  warm_response: {
    skin_relaxation_percent: number;
    surface_area_increase: number;
    hang_position_lower: boolean;
  };
  animation_data: {
    walk_cycle: {
      swing_amplitude_degrees: Record<BodyBuildTier, number>;
      collision_margin_cm: number;
      inner_thigh_contact_zones: MeshZone[];
    };
    combat_stance: {
      tension_scale: number;
      protective_tuck_percent: number;
      armor_clearance_cm: number;
    };
    run_cycle: {
      swing_amplitude_degrees: Record<BodyBuildTier, number>;
      vertical_bounce_mm: number;
    };
    swim_cycle: {
      drag_coefficient_change: number;
      buoyancy_offset_mm: number;
    };
  };
  clothing_collision: {
    briefs: { contact_vertices: number[]; compression_percent: number; mesh_name: string };
    underwear_loose: { contact_vertices: number[]; clearance_mm: number; mesh_name: string };
    armor_lower: { collision_shell_name: string; clearance_mm: number; priority_zones: MeshZone[] };
  };
};

// ─────────────────────────────────────────
// 2. EDGE LOOP TOPOLOGY DATA
// ─────────────────────────────────────────

export const MESH_EDGE_LOOPS: MeshEdgeLoop[] = [
  // ━━━ HEAD ━━━ (8 loops)
  {
    name: 'cranium_crown',
    zone: 'head',
    position: 5,
    vertexCount: 24,
    notes: 'Top of skull; circular crown loops prevent flattening during head tilt animations',
  },
  {
    name: 'upper_cranium',
    zone: 'head',
    position: 15,
    vertexCount: 26,
    notes: 'Expands slightly near parietal bone on Altmer/Dunmer elongated skulls; maintain even vertex spacing for ear placement',
  },
  {
    name: 'temporals',
    zone: 'head',
    position: 25,
    vertexCount: 28,
    notes: 'Temporal muscle region; vertices compress during jaw movement - keep 4-6 edge loops between here and jawline',
  },
  {
    name: 'eye_sockets',
    zone: 'head',
    position: 35,
    vertexCount: 28,
    notes: 'Orbit rings; 14 vertices per eye socket. Critical for blink deformation - ensure concentric loops around each orbital rim',
  },
  {
    name: 'cheek_mouth',
    zone: 'head',
    position: 50,
    vertexCount: 24,
    notes: 'Cheekbone line; passes through zygomatic arch. Vertices here deform heavily during smile/frown expressions',
  },
  {
    name: 'mouth_ring',
    zone: 'head',
    position: 60,
    vertexCount: 20,
    notes: 'Orbicularis oris muscle ring; minimum 16 vertices required for clean lip curl/deform. Place 8 for upper lip, 8 for lower (Khajiit/Argonian need 24 for muzzle extension)',
  },
  {
    name: 'jaw_line',
    zone: 'head',
    position: 72,
    vertexCount: 32,
    notes: 'Mandible edge; runs from ear to chin and back. Highest vertex density on face - needed for jaw hinge rotation and chewing animations. Orsimer needs 36 vertices to accommodate jaw width',
  },
  {
    name: 'chin_underline',
    zone: 'head',
    position: 85,
    vertexCount: 24,
    notes: 'Under-chin to lower jaw; connects to neck base. Vertices here must flex with neck rotation and mouth opening',
  },

  // ━━━ NECK ━━━ (4 loops)
  {
    name: 'submental',
    zone: 'neck',
    position: 5,
    vertexCount: 24,
    notes: 'Under-chin junction; transitions from head zone to neck. Must flex smoothly during head nod - avoid long triangles',
  },
  {
    name: 'mid_neck',
    zone: 'neck',
    position: 50,
    vertexCount: 20,
    notes: 'Throat/Adam\'s apple level; 20 vertices adequate for cylinder. Male mesh may need bulge verts at thyroid cartilage. Compresses during head extension',
  },
  {
    name: 'sternocleidomastoid',
    zone: 'neck',
    position: 65,
    vertexCount: 22,
    notes: 'SCM muscle mounts; vertices shift when head turns - need sliding deformation. Male mesh: add 2 verts per side for thicker muscle definition',
  },
  {
    name: 'neck_base',
    zone: 'neck',
    position: 90,
    vertexCount: 24,
    notes: 'Collar/neck base junction; transitions to torso. Expand to 27 vertices for male thick neck profile. Must blend smoothly into shoulder/upper-chest loops',
  },

  // ━━━ SHOULDERS ━━━ (3 loops)
  {
    name: 'collarbone_line',
    zone: 'shoulders',
    position: 15,
    vertexCount: 32,
    notes: 'Clavicle ridge line; runs shoulder-to-shoulder across upper chest. Vertices must slide during arm raise - this loop deforms significantly (+30% stretch) at extremes',
  },
  {
    name: 'shoulder_cap',
    zone: 'shoulders',
    position: 0,
    vertexCount: 20,
    notes: 'Deltoid dome - one per shoulder (20 each, 40 total). Must be fully circular to allow smooth shoulder rotation. Highest vertex density for arm abduction. Female: narrower span, male: wider span',
  },
  {
    name: 'shoulder_blade_mounts',
    zone: 'shoulders',
    position: 50,
    vertexCount: 18,
    notes: 'Scapula area (back only); 9 vertices per shoulder blade region. Vertices shift outward during arm forward reach. Critical for proper back muscle flex in combat animations',
  },

  // ━━━ CHEST ━━━ (5 loops)
  {
    name: 'upper_chest',
    zone: 'chest',
    position: 15,
    vertexCount: 28,
    notes: 'Top of pectoral plate below clavicles. Relatively stable loop - minimal deformation except during deep inhalation (+5% expansion) and arm crossing',
  },
  {
    name: 'chest_mid',
    zone: 'chest',
    position: 50,
    vertexCount: 32,
    notes: 'Pectoral mass center; male: defined pec line down center. Female: breast fold line - 36 vertices instead of 32 to accommodate curvature and breast tissue deformation',
  },
  {
    name: 'breast_underfold',
    zone: 'chest',
    position: 75,
    vertexCount: 36,
    notes: 'UNDER BREAST fold - female priority zone. 36 vertices for natural breast drape and jiggle physics. Male uses standard chest_lower at 28 vertices. Highest-priority loop for female breast physics',
  },
  {
    name: 'rib_cage',
    zone: 'chest',
    position: 80,
    vertexCount: 32,
    notes: 'Lower rib cage; expands during inhalation (+4-8% vertex displacement). Place vertices along costal arch. Must accommodate breathing idle animation',
  },
  {
    name: 'chest_lower',
    zone: 'chest',
    position: 92,
    vertexCount: 30,
    notes: 'Sternum base to lower ribs for male (use 28). For female this merges with under-boob fold. Connects to abdominal zone',
  },

  // ━━━ ABDOMEN ━━━ (4 loops)
  {
    name: 'upper_abs',
    zone: 'abdomen',
    position: 15,
    vertexCount: 28,
    notes: 'Xiphoid to upper rectus abdominis. Male: may need edge for 6-pack definition between vert pairs. Female: smoother transition. Both expand on inhalation',
  },
  {
    name: 'navel_line',
    zone: 'abdomen',
    position: 45,
    vertexCount: 28,
    notes: 'Umbilicus level; relatively stable cylinder. Compresses when character bends forward and expands during back arch. Use vertex displacement not topology gap at navel',
  },
  {
    name: 'lower_abs',
    zone: 'abdomen',
    position: 70,
    vertexCount: 30,
    notes: 'Lower rectus to iliac crest; female mesh needs more verts for softer curve (32). Male can use 28 with sharper edge definition at abdominal wall',
  },
  {
    name: 'waist',
    zone: 'abdomen',
    position: 90,
    vertexCount: 28,
    notes: 'Narrowest point between ribs and hips. Female: 28 vertices with inward pinch at sides for hourglass silhouette. Male: 30 vertices for more cylindrical torso. Compresses when bending sideways',
  },

  // ━━━ PELVIS / HIPS ━━━ (5 loops)
  {
    name: 'iliac_crest',
    zone: 'pelvis',
    position: 10,
    vertexCount: 32,
    notes: 'Hip bone ridge; 32 vertices for smooth pelvic curve. Female mesh extends vertices laterally for wider ASIS. Critical loop for belt/waistband collision',
  },
  {
    name: 'hip_joints',
    zone: 'hips',
    position: 30,
    vertexCount: 30,
    notes: 'Femoral head level; acetabulum mounts on each side. Extra loop ring around each hip socket (12 verts per joint). Female: joints set wider apart',
  },
  {
    name: 'groin_junction',
    zone: 'pelvis',
    position: 50,
    vertexCount: 24,
    notes: 'Pubic symphysis/groin; complex 5-way junction (2 legs + front + 2 abdomen). Must allow leg spread animation up to 90 degrees. Serves as attachment origin for male_genitalia zone.',
  },

  // ━━━ MALE GENITALIA ━━━ (10 loops)
  {
    name: 'penis_root',
    zone: 'male_genitalia',
    position: 0,
    vertexCount: 8,
    notes: 'Base attachment at pubic symphysis below groin_junction. Size: Micro=6,Mini=7,Tiny=8,Small=9,Normal=10,Large=10,Enormous=10. Suspensory ligament ring. Erection morph: +25% circumference, base widens 15%. Skin: pubic-to-glabrous transition. Physics: fixed anchor, zero swing. Collision: inner thigh at adduction>45deg.',
  },
  {
    name: 'penis_shaft_proximal',
    zone: 'male_genitalia',
    position: 25,
    vertexCount: 9,
    notes: 'Proximal shaft. Size: Micro=7,Mini=8,Tiny=8,Small=9,Normal=9,Large=10,Enormous=10. Circular cross-section (2.5-7cm). Erection: +40% length, +25% girth. Tunica albuginea via displacement. Skin: thin glabrous epidermis, dorsal vein loop. Physics: pendulum, 8-15deg swing during walk. Collision: 3mm clearance from upper_leg.',
  },
  {
    name: 'penis_shaft_mid',
    zone: 'male_genitalia',
    position: 50,
    vertexCount: 9,
    notes: 'Mid-shaft. Size: Micro=7,Mini=8,Tiny=9,Small=9,Normal=9,Large=10,Enormous=10. Ventral curve 5-10deg hang. Erection: straightens to 80-90deg. Dorsal vein +2mm erect. Physics: swing Micro=3-5deg,Normal=8-12deg,Enormous=15-20deg. Collision: bilateral thigh, 18-24 briefs contact points.',
  },
  {
    name: 'penis_shaft_distal',
    zone: 'male_genitalia',
    position: 75,
    vertexCount: 9,
    notes: 'Distal shaft tapering to glans. Size: Micro=7,Mini=8,Tiny=8,Small=9,Normal=9,Large=10,Enormous=10. Circular-to-ovoid transition. Erection: +40% length, distal translates +3-8cm superiorly. Skin: shaft-to-mucosa gradient. Physics: largest swing arc, 12mm lateral deviation. Collision: thigh/underwear during run/sprint.',
  },
  {
    name: 'glans_corona',
    zone: 'male_genitalia',
    position: 90,
    vertexCount: 13,
    notes: 'Corona ridge, widest point. Size: Micro=10,Mini=11,Tiny=12,Small=12,Normal=13,Large=14,Enormous=14. 20-30% wider than shaft. Erection: +25% circumference. Backface culling disabled for rim. Skin: mucosal, high vascularity. Physics: largest collision surface when erect. Collision: underwear waistband/armor rim.',
  },
  {
    name: 'glans_tip',
    zone: 'male_genitalia',
    position: 98,
    vertexCount: 7,
    notes: 'Glans apex/urethral meatus. Size: Micro=5,Mini=6,Tiny=6,Small=7,Normal=7,Large=8,Enormous=8. Meatus slit: 2 opening verts+4-6 rim. Erection: tip flattens, meatus expands. Skin: mucosal, smoothest. Physics: distal pendulum endpoint. Collision: 4-6 priority verts vs underwear fabric.',
  },
  {
    name: 'scrotum_sac',
    zone: 'male_genitalia',
    position: 40,
    vertexCount: 15,
    notes: 'Scrotal body with testicles. Size: Micro=12,Mini=13,Tiny=14,Small=15,Normal=15,Large=16,Enormous=16. Left hangs 0.5-1cm lower. Temp: cold=cremaster +20% contraction; warm=relaxed +15% elongation. Physics: independent soft-body, damped swing. Collision: 0.5-2mm from medial thighs, 30-40 briefs contacts.',
  },
  {
    name: 'scrotum_raphe',
    zone: 'male_genitalia',
    position: 50,
    vertexCount: 6,
    notes: 'Median raphe seam. Fixed 6 verts: perineal root, mid-sacral ant, midpoint, mid-sacral post, frenulum approach, penile underside. Texture/edge definition. Stretches during erection. Raised ridge 1-2mm. UV seam boundary for symmetrical texture.',
  },
  {
    name: 'testicle_left',
    zone: 'male_genitalia',
    position: 45,
    vertexCount: 10,
    notes: 'Left testicle. Size: Micro=8,Mini=9,Tiny=9,Small=10,Normal=10,Large=10,Enormous=10. Ellipsoidal 4.5x3x2.5cm. 0.5-1cm lower than right. Cold: elevates+1-2cm. Warm: descends+1-2cm. Arousal:+5% volume. Not visible (under scrotum_sac). Physics: soft-body, combat impact. Varicocele variant available.',
  },
  {
    name: 'testicle_right',
    zone: 'male_genitalia',
    position: 42,
    vertexCount: 10,
    notes: 'Right testicle. Size: Micro=8,Mini=9,Tiny=9,Small=10,Normal=10,Large=10,Enormous=10. Ellipsoidal 4.5x3x2.5cm. 0.5-1cm higher than left. Stronger cremasteric reflex. Morphs mirror left. Covered by scrotum_sac. Asymmetry visible in nude rendering.',
  },

  // ━━━ PELVIS continued ━━━
  {
    name: 'sit_bones',
    zone: 'pelvis',
    position: 70,
    vertexCount: 26,
    notes: 'Ischial tuberosity (sit bones); 13 vertices per side of rear pelvis. Flat plane for seated animations. Deforms heavily during crouch',
  },
  {
    name: 'lower_pelvis',
    zone: 'pelvis',
    position: 90,
    vertexCount: 28,
    notes: 'Pelvic floor transition to upper thigh. Male: narrower triangle at pubic arch. Female: wider arch. Connects to gluteal zone',
  },

  // ━━━ GLUTES ━━━ (3 loops)
  {
    name: 'gluteal_fold_top',
    zone: 'glutes',
    position: 10,
    vertexCount: 28,
    notes: 'Upper gluteal shelf at iliac crest transition. Female: pronounced shelf loop, 32 vertices. Male: 24 vertices, flatter transition. Pushes outward during hip extension',
  },
  {
    name: 'gluteal_max',
    zone: 'glutes',
    position: 50,
    vertexCount: 26,
    notes: 'Gluteus maximus center; broadest part. 26 vertices wrap from hip side to cleft (52 bilateral). Avoid flat polygons for proper shadowing',
  },
  {
    name: 'gluteal_fold_bottom',
    zone: 'glutes',
    position: 85,
    vertexCount: 24,
    notes: 'Infragluteal fold (butt cheek to thigh); compresses when sitting and stretches when running. Connects to upper leg zone',
  },

  // ━━━ UPPER ARMS ━━━ (4 loops per arm)
  {
    name: 'deltoid_mount',
    zone: 'upper_arm',
    position: 5,
    vertexCount: 20,
    notes: 'Where deltoid meets bicep; 20 vertices per arm. Bulges when arm flexes. Male: +4 vertices for larger deltoid mass',
  },
  {
    name: 'bicep_bulge',
    zone: 'upper_arm',
    position: 35,
    vertexCount: 18,
    notes: 'Maximum bicep diameter; 18 per arm. Male: bulges +8% on flex (20 verts for morph). Female: flatter profile stays at 16 vertices',
  },
  {
    name: 'triceps_flat',
    zone: 'upper_arm',
    position: 60,
    vertexCount: 16,
    notes: 'Posterior arm; flatter than anterior bicep. 16 vertices per arm. Vertices compress when elbow extends, expand when flexed',
  },
  {
    name: 'elbow_hinge',
    zone: 'upper_arm',
    position: 90,
    vertexCount: 16,
    notes: 'Elbow joint; 16 vertices per arm wrapping distal humerus. Critical deformation zone - concentric rings (3+) around hinge. Olecranon tip is vertex star on back',
  },

  // ━━━ LOWER ARMS ━━━ (4 loops per arm)
  {
    name: 'proximal_forearm',
    zone: 'lower_arm',
    position: 10,
    vertexCount: 16,
    notes: 'Below elbow; radius/ulna region. 16 per arm. Pronation/supination rotates vertices ~180 degrees - even distribution required',
  },
  {
    name: 'forearm_belly',
    zone: 'lower_arm',
    position: 45,
    vertexCount: 16,
    notes: 'Flexor muscle mass; thickest part. Expands during finger grip/weapon hold. Vertices shift distally during pronation',
  },
  {
    name: 'distal_forearm',
    zone: 'lower_arm',
    position: 80,
    vertexCount: 14,
    notes: 'Near wrist taper; 14 per arm. Transition from cylindrical forearm to complex wrist. Narrows anteriorly for palmar side',
  },
  {
    name: 'wrist',
    zone: 'lower_arm',
    position: 95,
    vertexCount: 14,
    notes: 'Wrist joint; carpal bone level. 14 per arm. Allows flexion/extension up to 90 degrees each direction plus ulnar/radial deviation',
  },

  // ━━━ HANDS ━━━ (5 loops per hand)
  {
    name: 'palm_base',
    zone: 'hand',
    position: 5,
    vertexCount: 18,
    notes: 'Base of palm at wrist; 18 per hand. Includes thenar and hypothenar eminence. Expands when fingers spread wide',
  },
  {
    name: 'palm_center',
    zone: 'hand',
    position: 40,
    vertexCount: 16,
    notes: 'Center of palm; relatively flat. 16 per hand. Vertices push outward around knuckles when fist closes',
  },
  {
    name: 'knuckle_line',
    zone: 'hand',
    position: 70,
    vertexCount: 24,
    notes: 'MCP joints (knuckles); 24 per hand wrapping across 5 finger bases (~4 verts per finger root). Highest hand deformation zone',
  },
  {
    name: 'finger_rings',
    zone: 'hand',
    position: 85,
    vertexCount: 60,
    notes: 'Finger segments: 12 per finger (4x12=48) + 8 for thumb = 56-64 total. Each finger: 3 rings x 4 verts. Thumb: 2 rings x 4 verts',
  },
  {
    name: 'fingertips',
    zone: 'hand',
    position: 98,
    vertexCount: 20,
    notes: 'Fingertip caps; 4 vertices per digit x 5 = 20 endpoints. Khajiit: add claw extension geometry (4 more per digit = 40 total)',
  },

  // ━━━ UPPER LEGS ━━━ (5 loops per leg)
  {
    name: 'thigh_top',
    zone: 'upper_leg',
    position: 5,
    vertexCount: 24,
    notes: 'Proximal femur/greater trochanter level; 24 per thigh. Male: 26 for quad mass. Female: 22 for narrower upper thigh',
  },
  {
    name: 'quadricep_bulge',
    zone: 'upper_leg',
    position: 30,
    vertexCount: 22,
    notes: 'Maximum thigh girth; 22 per leg. Male: pronounced rectus femoris bulge - may need 24 for defined quad separation',
  },
  {
    name: 'hamstring_flat',
    zone: 'upper_leg',
    position: 55,
    vertexCount: 20,
    notes: 'Posterior thigh; flatter than anterior quad. 20 per leg. Compresses when sitting - inner hamstring vertices push together',
  },
  {
    name: 'thigh_lower',
    zone: 'upper_leg',
    position: 75,
    vertexCount: 20,
    notes: 'Distal femur; transitions from cylindrical thigh to knee. 20 per leg. Slightly ovoid cross-section (flatter front-to-back)',
  },
  {
    name: 'suprapatellar',
    zone: 'upper_leg',
    position: 92,
    vertexCount: 18,
    notes: 'Just above patella; 18 per leg. Prepatellar bursa region - compresses when knee bends to 90+ degrees. Add reinforcing loop',
  },

  // ━━━ LOWER LEGS ━━━ (4 loops per leg)
  {
    name: 'patella',
    zone: 'lower_leg',
    position: 5,
    vertexCount: 20,
    notes: 'Kneecap region; 20 per leg wrapping patella and tibia plateau. Patella slides forward 20+ mm during knee bend without mesh distortion',
  },
  {
    name: 'tibial_tuberosity',
    zone: 'lower_leg',
    position: 20,
    vertexCount: 18,
    notes: 'Below kneecap, tibial bump; 18 per leg. Anterior surface has sharp shin edge - 4 verts flat anterior, 7 per side curved posterior. Female: softer shin',
  },
  {
    name: 'calf_belly',
    zone: 'lower_leg',
    position: 50,
    vertexCount: 18,
    notes: 'Maximum calf girth; 18 per leg. Gastrocnemius shifts posterior during ankle plantarflexion. Male: may need 20 verts',
  },
  {
    name: 'distal_calf',
    zone: 'lower_leg',
    position: 85,
    vertexCount: 16,
    notes: 'Lower calf before ankle; 16 per leg. Achilles tendon region - flatter cross-section. Compresses around malleolus during ankle rotation',
  },

  // ━━━ FEET ━━━ (4 loops per foot)
  {
    name: 'ankle',
    zone: 'foot',
    position: 5,
    vertexCount: 14,
    notes: 'Ankle joint; 14 per foot wrapping malleoli and Achilles. Allows dorsiflexion/plantarflexion up to 30 degrees. Khajiit/Argonian: replaced by digitigrade ankle',
  },
  {
    name: 'metatarsal',
    zone: 'foot',
    position: 35,
    vertexCount: 16,
    notes: 'Metatarsal arch; 16 per foot. Arch flattens during barefoot stance but maintains curve in boots. Vertices splay during weight bearing',
  },
  {
    name: 'toe_base',
    zone: 'foot',
    position: 75,
    vertexCount: 18,
    notes: 'Toe knuckles (MTP joints); 18 per foot wrapping 5 toes. ~3 verts per toe base + 3 for toe webs. Argonian: reduced to 12 for 3-toed config',
  },
  {
    name: 'toe_tips',
    zone: 'foot',
    position: 95,
    vertexCount: 15,
    notes: 'Toe tips; 3 per toe x 5 = 15 endpoints. Khajiit/Argonian digitigrade: elongated metatarsal with longer toes. Argonian 3-toed: 9 vertices total',
  },

  // ━━━ BACK / SPINE ━━━ (4 loops)
  {
    name: 'upper_back',
    zone: 'torso',
    position: 20,
    vertexCount: 26,
    notes: 'Between shoulder blades; 26 vertices. Trapezius and rhomboid region. Scapula slides up to 8cm during shoulder elevation',
  },
  {
    name: 'mid_back',
    zone: 'torso',
    position: 50,
    vertexCount: 24,
    notes: 'Thoracic spine level; 24 vertices. Relatively stable. Expands 2-4% during deep inhalation. Compresses on one side during lateral flexion',
  },
  {
    name: 'lower_back',
    zone: 'abdomen',
    position: 70,
    vertexCount: 24,
    notes: 'Lumbar region; 24 vertices. Lordotic curve creates natural arch. Posterior vertices have slightly longer spacing. Compresses during forward bend (40+%)',
  },
  {
    name: 'sacral',
    zone: 'glutes',
    position: 10,
    vertexCount: 22,
    notes: 'Sacrum/coccyx; 22 vertices. Triangular bone plate - mesh should flatten here. Connects gluteal cleft to pelvic floor. Compresses when crouching',
  },

];
// ─────────────────────────────────────────
// 3. ZONE WEIGHTS
// ─────────────────────────────────────────

/** Triangle allocation percentage per zone. Sum: 100%. */
export const MESH_ZONE_WEIGHTS: Record<MeshZone, number> = {
  head: 18,
  neck: 3,
  torso: 8,
  chest: 11,
  abdomen: 5,
  pelvis: 6,
  shoulders: 5,
  upper_arm: 7,
  lower_arm: 4,
  hand: 3,
  upper_leg: 9,
  lower_leg: 6,
  foot: 3,
  hips: 5,
  glutes: 5,
  male_genitalia: 2,
  // Total: 100% (18+3+8+11+5+6+5+7+4+3+9+6+3+5+5+2 = 100)
};

// ─────────────────────────────────────────
// 4. GENDER MESH DIFFERENCES
// ─────────────────────────────────────────

export const GENDER_MESH_DIFFERENCES: GenderMeshDifferences = {
  femaleIncreasedZones: [
    { zone: 'chest', reason: 'Breast geometry needs additional vertices for natural curvature, breast fold, and deformation during movement and physics simulation', addedPercent: 8 },
    { zone: 'hips', reason: 'Wider pelvic inlet (gynecoid shape) requires more vertices for smooth hip curve transition and proper iliac crest silhouette', addedPercent: 6 },
    { zone: 'pelvis', reason: 'Broader pelvic bone structure with wider ASIS and hip joint positioning for Q-angle', addedPercent: 5 },
    { zone: 'glutes', reason: 'More pronounced gluteal curvature and deeper infragluteal fold require additional topology for proper shading', addedPercent: 4 },
    { zone: 'abdomen', reason: 'Softer abdominal contouring with gradual taper; additional loops for natural waist-hip ratio and clothing drape', addedPercent: 3 },
  ],
  maleIncreasedZones: [
    { zone: 'chest', reason: 'Pectoral muscle definition with sharper edge lines between pecs and along inferior pec border', addedPercent: 4 },
    { zone: 'shoulders', reason: 'Broader clavicle span and larger deltoid mass require additional vertices for muscle definition and shoulder cap volume', addedPercent: 5 },
    { zone: 'torso', reason: 'V-taper torso with latissimus dorsi width, more defined serratus anterior and rib cage geometry', addedPercent: 4 },
    { zone: 'upper_arm', reason: 'Bicep/tricep muscle volume with defined muscle separation requires more topology for proper flex animation', addedPercent: 4 },
    { zone: 'abdomen', reason: 'Defined rectus abdominis (6-pack) geometry with visible linea alba and tendinous intersections', addedPercent: 3 },
    { zone: 'upper_leg', reason: 'Larger quadriceps femoris group and more defined hamstring separation require increased vertex density', addedPercent: 3 },
    { zone: 'neck', reason: 'Thicker neck with visible sternocleidomastoid muscle definition and prominent thyroid cartilage', addedPercent: 2 },
    { zone: 'male_genitalia', reason: 'External genitalia geometry: penile shaft (3 loop segments), glans, scrotal sac with bilateral testicles, median raphe, morph targets for flaccid/erect states (40% length / 25% girth expansion). Vertex density scales with size tier.', addedPercent: 6 },
  ],
  jointDifferences: [
    { joint: 'shoulder', axis: 'X', femaleOffset: '+2 (narrower biacromial width)', maleOffset: '+6 (broader biacromial width)', reason: 'Male clavicles are wider and more laterally angled, producing a broader shoulder silhouette''},
    { joint: 'hip', axis: 'X', femaleOffset: '+4 (wider bi-iliac)', maleOffset: '+1 (narrower)', reason: 'Female pelvis is wider and shallower with greater bi-iliac width for birthing - creates the Q-angle''},
    { joint: 'knee', axis: 'Z', femaleOffset: '+1 (valgus angle)', maleOffset: '0 (straight alignment)', reason: 'Female knee has natural valgus angle (Q-angle) due to wider hip joints pulling femur inward''},
    { joint: 'waist', axis: 'Y', femaleOffset: '-2 (shorter torso)', maleOffset: '0 (longer)', reason: 'Female torso is proportionally shorter relative to leg length; male waist sits lower''},
    { joint: 'center_of_gravity', axis: 'Y', femaleOffset: '-3 (lower COM)', maleOffset: '+2 (higher COM)', reason: 'Female center of mass is lower due to wider hips and distal thigh mass distribution''},
    { joint: 'chest_mount', axis: 'Y', femaleOffset: '+3 (higher breast mass)', maleOffset: '-1 (lower pectoral insertion)', reason: 'Female breast mass sits higher on pectoral plate for natural drape; male pec inserts lower''},
  ],
};

// ─────────────────────────────────────────
// 5. BODY BUILD DATA (DoL-inspired)
// ─────────────────────────────────────────

export const BODY_BUILD_DATA: Record<BodyBuildTier, BodyBuildData> = {
  tiny: {
    tier: 'tiny',
    physique_cap: 6000,
    damage_modifier: '-20% physical damage',
    scale_multipliers: { height: 0.90, width: 0.85, muscle_mass: 0.70, subcutaneous_fat: 0.80 },
    mesh_zones_affected: [
      { zone: 'chest', scale_factor: 0.85 },
      { zone: 'shoulders', scale_factor: 0.80 },
      { zone: 'upper_arm', scale_factor: 0.78 },
      { zone: 'torso', scale_factor: 0.88 },
      { zone: 'upper_leg', scale_factor: 0.82 },
      { zone: 'male_genitalia', scale_factor: 0.65 },
    ],
  },
  small: {
    tier: 'small',
    physique_cap: 10000,
    damage_modifier: '-10% physical damage',
    scale_multipliers: { height: 0.94, width: 0.92, muscle_mass: 0.85, subcutaneous_fat: 0.90 },
    mesh_zones_affected: [
      { zone: 'chest', scale_factor: 0.92 },
      { zone: 'shoulders', scale_factor: 0.90 },
      { zone: 'upper_arm', scale_factor: 0.88 },
      { zone: 'torso', scale_factor: 0.94 },
      { zone: 'upper_leg', scale_factor: 0.90 },
      { zone: 'male_genitalia', scale_factor: 0.80 },
    ],
  },
  normal: {
    tier: 'normal',
    physique_cap: 12000,
    damage_modifier: '0% (baseline)',
    scale_multipliers: { height: 1.00, width: 1.00, muscle_mass: 1.00, subcutaneous_fat: 1.00 },
    mesh_zones_affected: [
      { zone: 'chest', scale_factor: 1.00 },
      { zone: 'shoulders', scale_factor: 1.00 },
      { zone: 'upper_arm', scale_factor: 1.00 },
      { zone: 'torso', scale_factor: 1.00 },
      { zone: 'upper_leg', scale_factor: 1.00 },
      { zone: 'male_genitalia', scale_factor: 1.00 },
    ],
  },
  large: {
    tier: 'large',
    physique_cap: 16000,
    damage_modifier: '+15% physical damage',
    scale_multipliers: { height: 1.06, width: 1.12, muscle_mass: 1.25, subcutaneous_fat: 1.10 },
    mesh_zones_affected: [
      { zone: 'chest', scale_factor: 1.15 },
      { zone: 'shoulders', scale_factor: 1.18 },
      { zone: 'upper_arm', scale_factor: 1.20 },
      { zone: 'torso', scale_factor: 1.08 },
      { zone: 'upper_leg', scale_factor: 1.12 },
      { zone: 'male_genitalia', scale_factor: 1.10 },
    ],
  },
};
// ─────────────────────────────────────────
// 6. SIZE REFERENCE TABLES
// ─────────────────────────────────────────

export const BREAST_SIZE_DATA: SizeReferenceEntry[] = [
  { size: 'Flat', scale_factor: 0.00, affected_zones: ['chest'], notes: 'No breast volume; flat pectoral surface''},
  { size: 'A', scale_factor: 0.10, vertex_range: [28, 30], affected_zones: ['chest'], notes: 'Minimal projection, 1000pt baseline''},
  { size: 'B', scale_factor: 0.20, vertex_range: [30, 34], affected_zones: ['chest'], notes: 'Modest projection, 36 vertices at chest_mid''},
  { size: 'C', scale_factor: 0.35, vertex_range: [34, 38], affected_zones: ['chest'], notes: 'Moderate projection, breast_underfold becomes visible''},
  { size: 'D', scale_factor: 0.50, vertex_range: [36, 42], affected_zones: ['chest'], notes: 'Full projection, under-boob fold prominent''},
  { size: 'E', scale_factor: 0.65, vertex_range: [38, 44], affected_zones: ['chest'], notes: 'Heavy projection, significant jiggle physics''},
  { size: 'F', scale_factor: 0.80, vertex_range: [40, 46], affected_zones: ['chest'], notes: 'Very heavy, upper back strain considerations''},
  { size: 'G', scale_factor: 1.00, vertex_range: [42, 48], affected_zones: ['chest'], notes: '1000pt increment base, requires additional support geometry''},
  { size: 'H', scale_factor: 1.20, vertex_range: [44, 50], affected_zones: ['chest','abdomen'], notes: 'Impacts abdominal silhouette as well''},
  { size: 'I', scale_factor: 1.40, vertex_range: [46, 52], affected_zones: ['chest','abdomen'], notes: 'Major mesh deformation, collision with arms''},
  { size: 'J', scale_factor: 1.60, vertex_range: [48, 54], affected_zones: ['chest','abdomen','torso'], notes: 'Affects torso back geometry for counterbalance''},
  { size: 'K', scale_factor: 1.80, vertex_range: [50, 56], affected_zones: ['chest','abdomen','torso'], notes: 'Extreme projection, full upper body topology changes''},
  { size: 'Enormous', scale_factor: 2.00, vertex_range: [52, 58], affected_zones: ['chest','abdomen','torso','neck'], notes: 'Maximum size tier, affects all upper body zones''},
];

export const ASS_SIZE_DATA: SizeReferenceEntry[] = [
  { size: 'Tiny', scale_factor: 0.50, affected_zones: ['glutes'], notes: 'Minimal gluteal projection''},
  { size: 'Small', scale_factor: 0.70, affected_zones: ['glutes'], notes: 'Slight gluteal roundness''},
  { size: 'Petite', scale_factor: 0.85, affected_zones: ['glutes'], notes: 'Narrow but defined''},
  { size: 'Average', scale_factor: 1.00, affected_zones: ['glutes'], notes: 'Baseline gluteal geometry''},
  { size: 'Medium', scale_factor: 1.15, affected_zones: ['glutes','hips'], notes: 'Moderate projection, slight hip widening''},
  { size: 'Athletic', scale_factor: 1.30, affected_zones: ['glutes','hips'], notes: 'Muscular projection, defined gluteal fold''},
  { size: 'Large', scale_factor: 1.50, affected_zones: ['glutes','hips','upper_leg'], notes: 'Significant projection, upper thigh contact''},
  { size: 'Thick', scale_factor: 1.75, affected_zones: ['glutes','hips','upper_leg','abdomen'], notes: 'Heavy projection, full lower body impact''},
  { size: 'Enormous', scale_factor: 2.00, affected_zones: ['glutes','hips','upper_leg','abdomen'], notes: 'Maximum projection, affects seated animation clearance''},
];

export const PENIS_SIZE_DATA: SizeReferenceEntry[] = [
  { size: 'micro', scale_factor: 0.40, vertex_range: [6, 8], affected_zones: ['male_genitalia'], notes: 'Smallest tier (Micro): flaccid ~3-5cm, all genitalia loops at minimum vertices''},
  { size: 'mini', scale_factor: 0.55, vertex_range: [7, 9], affected_zones: ['male_genitalia'], notes: 'Mini tier: flaccid ~5-7cm, slight scrotal reduction''},
  { size: 'tiny', scale_factor: 0.70, vertex_range: [8, 10], affected_zones: ['male_genitalia'], notes: 'Tiny tier: flaccid ~7-9cm, standard glans proportions''},
  { size: 'small', scale_factor: 0.85, vertex_range: [9, 11], affected_zones: ['male_genitalia'], notes: 'Small tier: flaccid ~9-11cm, visible shaft curvature''},
  { size: 'normal', scale_factor: 1.00, vertex_range: [10, 13], affected_zones: ['male_genitalia'], notes: 'Normal tier: flaccid ~11-13cm, baseline erect +40%/+25%''},
  { size: 'large', scale_factor: 1.20, vertex_range: [11, 14], affected_zones: ['male_genitalia'], notes: 'Large tier: flaccid ~13-16cm, prominent corona, heavier scrotum''},
  { size: 'enormous', scale_factor: 1.45, vertex_range: [12, 14], affected_zones: ['male_genitalia','upper_leg'], notes: 'Enormous tier: flaccid ~16-20cm+, impacts inner thigh collision during walk/run''},
];
// ─────────────────────────────────────────
// 7. MALE ANATOMY DATA
// ─────────────────────────────────────────

export const MALE_ANATOMY_DATA: MaleAnatomyData = {
  flaccid: {
    length_range_cm: [4, 16],
    girth_range_cm: [5, 13],
    vertical_drop_cm: 3,
    morph_targets: {
      translation_y: -3.0,
      translation_z: 0.5,
      scale_xyz: [1.0, 1.0, 0.95],
    },
    vertex_count_tier: {
      micro: 62, mini: 72, tiny: 80, small: 88,
      normal: 96, large: 106, enormous: 114,
    },
  },
  erect: {
    length_expansion_percent: 40,
    girth_expansion_percent: 25,
    lift_angle_degrees: 85,
    morph_targets: {
      translation_y: 2.5,
      translation_z: 4.0,
      scale_xyz: [1.25, 1.40, 1.0],
    },
    vertex_count_tier: {
      micro: 72, mini: 84, tiny: 94, small: 104,
      normal: 112, large: 124, enormous: 132,
    },
  },
  scrotum: {
    vertex_count: 26,
    left_lower_offset_cm: 0.8,
    temperature_response: {
      cold: 'Cremasteric reflex contracts: scrotum shortens 20%, testicles elevate +1-2cm toward body',
      warm: 'Dartos muscle relaxation: scrotum elongates 15%, testicles descend +1-2cm below baseline',
    },
    morph_targets: {
      hang_relaxed: [1.0, 1.15, 1.0],
      tensed: [0.85, 0.80, 0.9],
    },
  },
  temperature_effects: {
    cold_response: 'cremaster_reflex_contraction',
    skin_contraction_percent: 20,
    surface_area_reduction: 0.15,
    color_shift: 'darker_and_rounder',
  },
  warm_response: {
    skin_relaxation_percent: 15,
    surface_area_increase: 0.12,
    hang_position_lower: true,
  },
  animation_data: {
    walk_cycle: {
      swing_amplitude_degrees: {
        tiny: 4, small: 6, normal: 10, large: 14,
      },
      collision_margin_cm: 0.3,
      inner_thigh_contact_zones: ['upper_leg','pelvis'],
    },
    combat_stance: {
      tension_scale: 1.3,
      protective_tuck_percent: 15,
      armor_clearance_cm: 1.5,
    },
    run_cycle: {
      swing_amplitude_degrees: {
        tiny: 8, small: 12, normal: 18, large: 24,
      },
      vertical_bounce_mm: 4,
    },
    swim_cycle: {
      drag_coefficient_change: 0.05,
      buoyancy_offset_mm: 2,
    },
  },
  clothing_collision: {
    briefs: {
      contact_vertices: [0,1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17,18,19,20,21,22,23,24,25,26,27,28,29,30,31,32,33,34],
      compression_percent: 12,
      mesh_name: 'male_genitalia_briefs_support',
    },
    underwear_loose: {
      contact_vertices: [2, 5, 8, 11, 14],
      clearance_mm: 8,
      mesh_name: 'male_genitalia_underwear_loose',
    },
    armor_lower: {
      collision_shell_name: 'armor_groin_plate',
      clearance_mm: 15,
      priority_zones: ['male_genitalia','pelvis'],
    },
  },
};
// ─────────────────────────────────────────
// 8. RACE MESH MODIFICATIONS
// ─────────────────────────────────────────

export const RACE_MESH_MODIFICATIONS: Record<RaceId, RaceMeshModifications> = {
  nord: {
    morphTargets: ['broader_face','thicker_neck','heavy_build'],
    shapeDifferences: [
      { zone: 'chest', description: '+5% chest volume and broader pectoral span compared to Imperial baseline', severity: 'subtle''},
      { zone: 'shoulders', description: '+8% shoulder width with increased deltoid mass and broader clavicle angle', severity: 'moderate''},
      { zone: 'neck', description: 'Thicker neck circumference for heavy muscular build', severity: 'subtle''},
      { zone: 'torso', description: 'Barrel chest with expanded rib cage volume for lung capacity in cold climate', severity: 'subtle''},
    ],
    extraSections: [],
  },
  imperial: {
    morphTargets: ['standard_face','baseline_build'],
    shapeDifferences: [],
    extraSections: [],
  },
  redguard: {
    morphTargets: ['angular_face','narrow_frame','lean_muscle'],
    shapeDifferences: [
      { zone: 'head', description: 'More angular facial features with sharper jawline and higher cheekbone definition', severity: 'subtle''},
      { zone: 'torso', description: 'Leaner build with reduced subcutaneous fat volume - +3% muscle definition zones', severity: 'subtle''},
      { zone: 'upper_arm', description: 'Wiry muscular definition rather than bulky - sharper muscle separation edges', severity: 'subtle''},
      { zone: 'upper_leg', description: 'Athletic lean thighs - reduced volume but more defined muscle separations', severity: 'subtle''},
    ],
    extraSections: [],
  },
  breton: {
    morphTargets: ['softer_features','shorter_stature'],
    shapeDifferences: [
      { zone: 'upper_leg', description: '-3% femur length; shorter leg proportions relative to torso', severity: 'subtle''},
      { zone: 'lower_leg', description: '-3% tibia length matching shorter overall stature', severity: 'subtle''},
      { zone: 'head', description: 'Slightly rounder facial features with softer maxillary bone expression', severity: 'subtle''},
    ],
    extraSections: [],
  },
  dunmer: {
    morphTargets: ['sharp_cheekbones','pointed_ears','ash_skin_tone'],
    shapeDifferences: [
      { zone: 'head', description: 'Sharp angular cheekbones with prominent zygomatic arches; pointed ears extend 8-12cm laterally', severity: 'moderate''},
      { zone: 'torso', description: 'Slightly leaner/wiry frame - reduced chest and abdomen volume by ~5% vs Imperial', severity: 'subtle''},
      { zone: 'neck', description: 'More slender neck profile with elongated cervical appearance', severity: 'subtle''},
    ],
    extraSections: [
      { name: 'pointed_ears', parentZone: 'head', triangleCount: 120, notes: 'Elongated pointed ears from temporal bone. 60 triangles per ear with 12-vertex outer edge tapering to sharp tip''},
    ],
  },
  altmer: {
    morphTargets: ['elongated_features','pointed_ears','taller_stature'],
    shapeDifferences: [
      { zone: 'upper_leg', description: '+5% femur length; tallest race with elongated leg proportions. All leg vertices scale linearly', severity: 'moderate''},
      { zone: 'lower_leg', description: '+5% tibia/fibula length proportional to femur elongation', severity: 'moderate''},
      { zone: 'head', description: 'Elongated facial features with longer maxilla/mandible; pointed ears extend 12-15cm laterally', severity: 'moderate''},
      { zone: 'torso', description: 'Proportionally longer torso but slightly narrower shoulders relative to height', severity: 'subtle''},
      { zone: 'hand', description: 'Longer fingers with +8% phalanx length; elegant hand proportions', severity: 'subtle''},
    ],
    extraSections: [
      { name: 'pointed_ears', parentZone: 'head', triangleCount: 150, notes: 'Very long pointed ears (longest of all races). 75 triangles per ear with 14-vertex outer edge over 12-15cm''},
    ],
  },
  bosmer: {
    morphTargets: ['round_face','pointed_ears','lean_frame','shorter_stature'],
    shapeDifferences: [
      { zone: 'head', description: 'Rounder facial features with softer maxillary contours but pointed ears (shorter, 4-6cm projection)', severity: 'moderate''},
      { zone: 'upper_leg', description: '-4% femur length; shortest race. Overall reduced limb proportions', severity: 'subtle''},
      { zone: 'lower_leg', description: '-4% tibial length; compact lower leg', severity: 'subtle''},
      { zone: 'torso', description: 'Lean wiry frame optimized for agility over strength', severity: 'subtle''},
    ],
    extraSections: [
      { name: 'pointed_ears', parentZone: 'head', triangleCount: 100, notes: 'Short pointed ears (smallest of Mer races). 50 triangles per ear with 10-vertex outer edge, 4-6cm projection''},
    ],
  },
  orsimer: {
    morphTargets: ['broad_flat_nose','underbite_tusks','thick_neck','heavy_muscular_build'],
    shapeDifferences: [
      { zone: 'shoulders', description: '+10% shoulder width with massive trapezius and broad clavicle span. Broadest of all races', severity: 'extreme''},
      { zone: 'chest', description: '+10% chest volume with expanded rib cage and heavy pectoral development', severity: 'extreme''},
      { zone: 'head', description: 'Broad flat nose with widened nostrils; heavy brow ridge projecting 3-4mm; underbite with jutting mandible', severity: 'extreme''},
      { zone: 'upper_arm', description: 'Massive bicep and tricep development; +10% arm circumference', severity: 'moderate''},
      { zone: 'upper_leg', description: 'Thick muscular thighs with heavy quadriceps development', severity: 'moderate''},
      { zone: 'neck', description: 'Very thick neck (wider than head width) with prominent SCM and trapezius', severity: 'moderate''},
    ],
    extraSections: [
      { name: 'tusks', parentZone: 'head', triangleCount: 80, notes: 'Lower tusks from mandibular canine. 40 triangles per tusk with 8-vertex circular base tapering to 2-vertex tip at 1.5-2cm''},
      { name: 'heavy_brow_ridge', parentZone: 'head', triangleCount: 60, notes: 'Pronounced supraorbital ridge adding 30 triangles per brow side. Deep-set eye appearance''},
    ],
  },
  khajiit: {
    morphTargets: ['cat_skull','digitigrade_legs','tail','digitigrade_foot','feline_muzzle','cat_ears','fur_texture_base'],
    shapeDifferences: [
      { zone: 'lower_leg', description: 'DIGITIGRADE RECONSTRUCTION - human ankle becomes elevated joint. Heel moves up leg 60% of tibial length', severity: 'extreme''},
      { zone: 'foot', description: 'DIGITIGRADE FOOT - paw structure with digitigrade stance. Metatarsal becomes weight-bearing. Entire topology differs from plantigrade', severity: 'extreme''},
      { zone: 'head', description: 'Feline skull with shortened muzzle projecting 4-6cm forward; cat ear placement on top of head; whisker follicle points on cheek', severity: 'extreme''},
      { zone: 'chest', description: 'Narrower rib cage with deeper but less wide chest profile vs human', severity: 'moderate''},
      { zone: 'torso', description: 'More flexible spine with additional lumbar curvature for feline agility ROM', severity: 'moderate''},
      { zone: 'hand', description: 'Pawed hand structure with retractile claw slots; pads instead of palm skin; 4 functional digits', severity: 'moderate''},
    ],
    extraSections: [
      { name: 'tail', parentZone: 'pelvis', triangleCount: 500, notes: 'Feline tail from S1/Coccyx. 500 triangles over 50-65cm with 8 bone segments for physics: base (60 tris) to mid-body (80 tris) to tip taper (30 tris)''},
      { name: 'cat_ears', parentZone: 'head', triangleCount: 200, notes: 'Cat ears on top of skull (not lateral). 100 triangles per ear with triangular outer edge, inner folds, and ear tufts''},
      { name: 'digitigrade_rear_legs', parentZone: 'lower_leg', triangleCount: 400, notes: 'Complete digitigrade reconstruction. ~200 tris per leg: elongated metatarsal (elevated heel), padded paw base, toe pads with claws''},
      { name: 'whisker_follicles', parentZone: 'head', triangleCount: 60, notes: 'Whisker base points along muzzle sides: 30 per side (3 rows of 10). 2-triangle base each''},
    ],
  },
  argonian: {
    morphTargets: ['elongated_skull','snout','tail','digitigrade_legs','reptilian_scales','three_toed_foot','head_frills','reptilian_eye_sockets'],
    shapeDifferences: [
      { zone: 'head', description: 'Elongated reptilian skull with snout projecting 8-10cm; no external ears; elongated eye sockets for slit pupils; head frills/horns', severity: 'extreme''},
      { zone: 'lower_leg', description: 'DIGITIGRADE RECONSTRUCTION - elevated ankle like Khajiit but more pronounced. Scaled surface adds displacement layer', severity: 'extreme''},
      { zone: 'foot', description: 'THREE-TOED DIGITIGRADE FOOT - three weight-bearing digits with claws (2-1-2 arrangement), reduced metatarsal, scaly sole', severity: 'extreme''},
      { zone: 'chest', description: 'Narrower deeper chest with less pectoral definition; cylindrical rib cage for reptilian breathing', severity: 'moderate''},
      { zone: 'torso', description: 'Scale pattern overlay across entire torso; dorsal ridge scales along spine', severity: 'moderate''},
      { zone: 'hand', description: 'Heavy clawed hand with 4 functional fingers and prominent talon-like claws on digits 2-4; webbing between fingers', severity: 'moderate''},
      { zone: 'neck', description: 'Thicker neck with less defined SCM; dorsal frill attachments along posterior neck', severity: 'moderate''},
    ],
    extraSections: [
      { name: 'tail', parentZone: 'pelvis', triangleCount: 300, notes: 'Reptilian tail: thicker base (3cm) but shorter (40-50cm) than Khajiit. 300 triangles across 6 bone segments''},
      { name: 'head_frills', parentZone: 'head', triangleCount: 180, notes: 'Bony head frills/ridges along parietal and occipital crest. 6-8 frill plates, each 20-25 triangles''},
      { name: 'dorsal_spine_ridge', parentZone: 'torso', triangleCount: 120, notes: 'Dorsal ridge scales from C7 to S2 along spine. 60 triangles per side in diamond scale pattern''},
      { name: 'digitigrade_rear_legs', parentZone: 'lower_leg', triangleCount: 450, notes: 'Digitigrade reconstruction for 3-toed foot. ~225 tris per leg with three-digit clawed paw''},
      { name: 'ventral_belly_scales', parentZone: 'abdomen', triangleCount: 100, notes: 'Smooth ventral belly scales - larger flatter scales than dorsal side. Overlapping diamond grid pattern''},
    ],
  },
};
// ─────────────────────────────────────────
// 9. TARGET TRIANGLE COUNTS
// ─────────────────────────────────────────

export const MESH_TARGET_COUNTS = {
  human_low: { vertices: 2500, triangles: 5000 },
  human_medium: { vertices: 5000, triangles: 10000 },
  human_high: { vertices: 10000, triangles: 20000 },
  beast_low: { vertices: 3000, triangles: 6000 },
  beast_medium: { vertices: 6000, triangles: 12000 },
  beast_high: { vertices: 12000, triangles: 24000 },
};

const BEAST_RACES: readonly RaceId[] = ['khajiit','argonian'] as const;

// ─────────────────────────────────────────
// 10. HELPER FUNCTIONS
// ─────────────────────────────────────────

export function getEdgeLoopsForZone(zone: MeshZone): MeshEdgeLoop[] {
  return MESH_EDGE_LOOPS.filter((loop) => loop.zone === zone);
}

export function getRaceTriangleBudget(
  raceId: RaceId,
  quality: 'low''| 'medium''| 'high',
): { vertices: number; triangles: number } {
  const isBeast = BEAST_RACES.includes(raceId);
  const key = `${isBeast ? 'beast'': 'human'}_${quality}` as keyof typeof MESH_TARGET_COUNTS;
  const budget = MESH_TARGET_COUNTS[key];
  return budget ?? MESH_TARGET_COUNTS.human_medium;
}

export function getGenderVertexDistribution(
  baseCount: number,
  gender: 'male''| 'female',
): Record<MeshZone, number> {
  const weights = { ...MESH_ZONE_WEIGHTS };

  if (gender === 'female') {
    weights.chest += 8;
    weights.hips += 6;
    weights.pelvis += 5;
    weights.glutes += 4;
    weights.abdomen += 3;
    weights.shoulders -= 5;
    weights.upper_arm -= 4;
    weights.torso -= 4;
    weights.upper_leg -= 3;
    weights.chest -= 4;
    weights.neck -= 2;
    weights.foot -= 2;
  } else {
    weights.chest += 4;
    weights.shoulders += 5;
    weights.torso += 4;
    weights.upper_arm += 4;
    weights.abdomen += 3;
    weights.upper_leg += 3;
    weights.neck += 2;
    weights.hips -= 6;
    weights.pelvis -= 5;
    weights.glutes -= 4;
    weights.abdomen -= 3;
    weights.chest -= 2;
    weights.foot -= 2;
    // male_genitalia zone: no adjustment (already accounted for in base)
  }

  const totalWeight = Object.values(weights).reduce((s, v) => s + v, 0);
  const normalized: Record<MeshZone, number> = {} as Record<MeshZone, number>;
  for (const zone of Object.keys(weights) as MeshZone[]) {
    normalized[zone] = Math.round((weights[zone] // totalWeight) * 100);
  }

  const drift = 100 - Object.values(normalized).reduce((s, v) => s + v, 0);
  if (drift !== 0) {
    let heaviest: MeshZone = 'head';
    for (const z of Object.keys(normalized) as MeshZone[]) {
      if (normalized[z] > normalized[heaviest]) heaviest = z;
    }
    normalized[heaviest] += drift;
  }

  const result: Record<MeshZone, number> = {} as Record<MeshZone, number>;
  for (const zone of Object.keys(MESH_ZONE_WEIGHTS) as MeshZone[]) {
    result[zone] = Math.round((normalized[zone] // 100) * baseCount);
  }
  return result;
}

export function getRaceMorphTargets(raceId: RaceId): string[] {
  return RACE_MESH_MODIFICATIONS[raceId]?.morphTargets ?? [];
}

export function hasExtraMeshSections(raceId: RaceId): boolean {
  return BEAST_RACES.includes(raceId);
}

export function getRaceExtraSections(raceId: RaceId): RaceMeshModifications["extraSections"] {
  return RACE_MESH_MODIFICATIONS[raceId]?.extraSections ?? [];
}

export function getTotalRaceTriangleBudget(
  raceId: RaceId,
  quality: 'low''| 'medium''| 'high',
): { vertices: number; triangles: number; extraSectionTriangles: number } {
  const base = getRaceTriangleBudget(raceId, quality);
  const extras = getRaceExtraSections(raceId);
  const extraTris = extras.reduce((sum, s) => sum + s.triangleCount, 0);
  return { ...base, extraSectionTriangles: extraTris, triangles: base.triangles + extraTris };
}

export function getRaceShapeDifferences(
  raceId: RaceId,
  zone?: MeshZone,
): RaceMeshModifications['shapeDifferences'] {
  const diffs = RACE_MESH_MODIFICATIONS[raceId]?.shapeDifferences ?? [];
  return zone ? diffs.filter((d) => d.zone === zone) : diffs;
}