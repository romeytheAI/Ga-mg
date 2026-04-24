import React, { useMemo } from 'react';
import { motion } from 'motion/react';
import { GameState, Item, Cosmetics, CosmeticScar, CosmeticTattoo, CosmeticPiercing } from '../types';
import { resolveRace, RacialBodyFeatures } from '../data/races';

import {
  SLOT_COLORS, integrityStyle, BodyGeom, buildBodyGeom, resolveSkinColor,
  resolveEyeColor, resolveHairColor, EXPOSURE_INTEGRITY_THRESHOLD, AROUSAL_BLUSH_WEIGHT,
  STRESS_BLUSH_WEIGHT, MAX_BODY_WRITING_CHARS, normalizeScar, normalizeTattoo,
  normalizePiercing, getNippleColor, SpriteState, applyPoseTransform
} from './sprite/utils';
import { SpriteDefs, deriveSkinTones, deriveHairHighlight } from './sprite/SpriteDefs';
import { LayeredBody } from './sprite/LayeredBody';
import { FaceAndHair, deriveExpression } from './sprite/FaceAndHair';
import { GenitalsAndChest } from './sprite/GenitalsAndChest';
import { SkinPatterns } from './sprite/SkinPatterns';
import { Clothing } from './sprite/Clothing';
import { FluidEffects } from './sprite/FluidEffects';
import { MuscleDefinition } from './sprite/MuscleDefinition';
import { StatusEffects } from './sprite/StatusEffects';
import { XRayOverlay } from './sprite/XRayOverlay';
import { RestraintLayer } from './sprite/RestraintLayer';

interface CharacterSprite2DProps {
  state: GameState;
  compact?: boolean;
  showXRay?: boolean;
}

export const CharacterSprite2D: React.FC<CharacterSprite2DProps> = React.memo(({ state, compact = false, showXRay = false }) => {
  const { clothing, clothing_state, identity, cosmetics, stats, biology } = state.player;
  const graphicsQuality = state?.ui?.graphics_quality || { sprite_quality: { gradient_shading: true, cosmetic_details: true, muscle_detail_level: 0, fluid_effects: false, xray_overlay: false } };
  const raceDef   = resolveRace(identity.race);
  const gender    = identity.gender || 'female';
  const geom      = buildBodyGeom(gender, raceDef);
  const skin      = resolveSkinColor(raceDef, cosmetics?.skin_tone || '');
  const eyeClr    = resolveEyeColor(raceDef, cosmetics?.eye_color || '');
  const hairClr   = resolveHairColor(raceDef, cosmetics?.hair_color || '');
  const accentClr = raceDef.accent_colors[0] || skin;

  // Hikari-quality derived tones for gradient shading
  const skinTones   = deriveSkinTones(skin);
  const hairHiClr   = deriveHairHighlight(hairClr);

  const hasExposure  = !clothing.chest && !clothing.underwear;
  const arousalHigh  = stats.arousal > 40 || stats.lust > 50;
  const corruption   = stats.corruption > 60;
  const lowHealth    = stats.health < 35;

  // Y-axis anchors (viewBox 0 0 100 225)
  const cx = 50;
  const headCY  = 21;
  const neckTopY = headCY + geom.headRY;
  const neckBotY = neckTopY + 9;
  const shldY    = neckBotY + 1;
  const waistY   = 98;
  const hipTopY  = 104;
  const crotchY  = 120;
  const kneeY    = 160;
  const ankleY   = 196;
  const footBotY = 206;

  // Arm X positions
  const shLX = cx - geom.shoulderHW - geom.shoulderOutset;
  const shRX = cx + geom.shoulderHW + geom.shoulderOutset;
  const elLX = cx - geom.shoulderHW - geom.elbowOutset;
  const elRX = cx + geom.shoulderHW + geom.elbowOutset;
  const elY  = shldY + 40;
  const wrLX = cx - geom.shoulderHW - geom.wristOutset;
  const wrRX = cx + geom.shoulderHW + geom.wristOutset;
  const wrY  = elY + 28;
  const handCY = wrY + geom.handH / 2;

  // Leg X positions
  const legLX = cx - geom.legSpread;
  const legRX = cx + geom.legSpread;

  // Digitigrade (Khajiit)
  const isDigi     = raceDef.leg_type === 'digitigrade';
  const digiKneeY  = kneeY - 18;
  const digiAnkleY = ankleY - 12;

  const s: SpriteState = {
    cx, headCY, neckTopY, neckBotY, shldY, waistY, hipTopY, crotchY, kneeY, ankleY, footBotY,
    shLX, shRX, elLX, elRX, elY, wrLX, wrRX, wrY, handCY, legLX, legRX, isDigi, digiKneeY, digiAnkleY
  };

  // ── DoL-parity enhanced pose transformation system ──────────────────────
  // Apply dynamic body repositioning based on encounter_action
  const encounter      = state.world.active_encounter;
  const encounterAction = encounter?.encounter_action || 'none';

  // Transform sprite state for encounter poses (bent_over, prone, lifted, etc.)
  const finalSpriteState = applyPoseTransform(s, encounterAction);

  const bodyFilter = corruption ? 'hue-rotate(270deg) saturate(1.3)'
    : arousalHigh ? 'hue-rotate(-12deg) saturate(1.2)' : undefined;

  // ── Gender / anatomy state ───────────────────────────────────────────────
  const isMale   = gender === 'male';
  const isFemale = gender === 'female';
  // Chest exposed when slot is empty OR clothing integrity fully destroyed
  const isChestExposed   = !clothing.chest   || (clothing.chest.integrity   ?? 100) <= EXPOSURE_INTEGRITY_THRESHOLD;
  const isGroinExposed   = !clothing.underwear || (clothing.underwear.integrity ?? 100) <= EXPOSURE_INTEGRITY_THRESHOLD;
  const nippleClr        = getNippleColor(skin, raceDef.skin_type);
  const isLactating      = biology.lactation_level > 0;
  const isAroused        = stats.arousal > 50 || stats.lust > 60;
  // Pregnancy bump (0–1) derived from incubations tagged with "preg"
  const pregnancyBump    = (biology.incubations || [])
    .filter(i => i.type.toLowerCase().includes('preg'))
    .reduce((max, i) => Math.max(max, i.progress / 100), 0);

  // ── DoL-parity cosmetic state ──────────────────────────────────────────
  const cos = (cosmetics || {}) as Partial<Cosmetics>;
  const hasFreckles   = !!cos.freckles;
  const hasTanLines   = !!cos.tan_lines;

  const scars: CosmeticScar[] = (cos.scars || []).map(normalizeScar);
  const tattoos: CosmeticTattoo[] = (cos.tattoos || []).map(normalizeTattoo);
  const piercings: CosmeticPiercing[] = (cos.piercings || []).map(normalizePiercing);
  const bodyWriting = cos.body_writing || [];
  const hasCollar    = (cos.body_mods || []).some(m => m.toLowerCase().includes('collar') || m.toLowerCase().includes('choker'));

  const blushIntensity = Math.min(1, (stats.arousal / 100 + stats.lust / 100) * AROUSAL_BLUSH_WEIGHT + (stats.stress / 100) * STRESS_BLUSH_WEIGHT);
  const isLegsExposed  = !clothing.legs || (clothing.legs.integrity ?? 100) <= EXPOSURE_INTEGRITY_THRESHOLD;
  const isSweating     = stats.stamina < 30 || stats.arousal > 70;
  const isArmsExposed  = !clothing.shoulders;

  // ── DoL-parity animation state ──────────────────────────────────────────
  const painLevel     = stats.pain;
  const showTremble   = isAroused && stats.arousal > 65;
  const showPainFlinch = painLevel > 40;
  const showHeartOverlay = stats.lust > 70 || stats.arousal > 75;
  const showCorruptionFx = stats.corruption > 50;

  // ── Expression system (DoL-parity 6+ states) ──────────────────────────
  const expression = deriveExpression(stats);

  // ── Encounter / combat animation state ─────────────────────────────────
  const combatAnim     = state.ui.combat_animation;
  const inEncounter    = !!encounter;
  const playerStance   = encounter?.player_stance || 'neutral';
  const targetedPart   = encounter?.targeted_part || state.ui.targeted_part;
  const hasDebuff      = (type: string) => encounter?.debuffs?.some(d => d.type === type) ?? false;

  // Map combat_animation to CSS class
  const COMBAT_ANIM_CLASSES: Record<string, string> = {
    attack: 'sprite-attack-lunge',
    special_attack: 'sprite-special-attack',
    dodge: 'sprite-dodge',
    spellcast: 'sprite-spellcast',
    lust_action: 'sprite-submit',
    parry: 'sprite-parry',
    hit_received: 'sprite-hit-received',
    struggle: 'sprite-struggle',
    restrained: 'sprite-restrained',
  };
  const combatAnimClass = combatAnim ? COMBAT_ANIM_CLASSES[combatAnim] || '' : '';

  // DoL encounter action → CSS class (body-part specific animations)
  const ENC_ACTION_CLASSES: Record<string, string> = {
    grabbed:         'sprite-enc-grabbed',
    groped:          'sprite-enc-groped',
    thrust:          'sprite-enc-thrust',
    oral:            'sprite-enc-oral',
    kissed:          'sprite-enc-kissed',
    climax:          'sprite-enc-climax',
    resist_break:    'sprite-enc-resist-break',
    clothing_tear:   'sprite-enc-clothing-tear',
    leg_spread:      'sprite-enc-leg-spread',
    arms_pinned:     'sprite-enc-arms-pinned',
    prone:           'sprite-enc-prone',
    bent_over:       'sprite-enc-bent-over',
    lifted:          'sprite-enc-lifted',
    caressed:        'sprite-enc-caressed',
    bitten:          'sprite-enc-bitten',
    spanked:         'sprite-enc-spanked',
    choked:          'sprite-enc-choked',
    hair_pulled:     'sprite-enc-hair-pulled',
    scratched:       'sprite-enc-scratched',
    licked:          'sprite-enc-licked',
    restrained_tied: 'sprite-enc-restrained-tied',
    mounted:         'sprite-enc-mounted',
  };
  const encActionClass = encounterAction !== 'none' ? ENC_ACTION_CLASSES[encounterAction] || '' : '';

  // Stance CSS class (persistent posture during encounter)
  const stanceClass = inEncounter
    ? playerStance === 'defensive' ? 'sprite-stance-defensive'
    : playerStance === 'aggressive' ? 'sprite-stance-aggressive'
    : playerStance === 'submissive' ? 'sprite-stance-submissive'
    : ''
    : '';

  // Debuff visual classes (encounter-specific)
  const debuffClass = [
    hasDebuff('slowed') ? 'sprite-debuff-slowed' : '',
    hasDebuff('weakened') ? 'sprite-debuff-weakened' : '',
    hasDebuff('stunned') ? 'sprite-debuff-stunned' : '',
    hasDebuff('poisoned') ? 'sprite-debuff-poisoned' : '',
    hasDebuff('bleeding') ? 'sprite-debuff-bleeding' : '',
  ].filter(Boolean).join(' ');

  // ── Activity-based animation (DoL-parity: walking, sleeping, swimming, etc.) ──
  const lastIntent = state.world.last_intent;
  const logEntries = state.ui.currentLog;
  const lastLogText = logEntries.length > 0 ? logEntries[logEntries.length - 1].text : '';
  const actionText = useMemo(() => (lastLogText ?? '').toLowerCase(), [lastLogText]);
  const activityClass = (() => {
    if (inEncounter || combatAnimClass || encActionClass) return '';
    // Detect activity from last_intent + action text keywords
    if (lastIntent === 'travel') return 'sprite-walk';
    if (lastIntent === 'flee') return 'sprite-walk';
    if (actionText.includes('sleep') || actionText.includes('rest') || actionText.includes('nap')) return 'sprite-sleep';
    if (actionText.includes('swim') || actionText.includes('bath') || actionText.includes('wash')) return 'sprite-swim';
    if (actionText.includes('exercise') || actionText.includes('run') || actionText.includes('jog') || actionText.includes('train')) return 'sprite-exercise';
    if (actionText.includes('eat') || actionText.includes('drink') || actionText.includes('food') || actionText.includes('bread') || actionText.includes('ale') || actionText.includes('milk')) return 'sprite-eat';
    if (lastIntent === 'education' || actionText.includes('study') || actionText.includes('read') || actionText.includes('book')) return 'sprite-study';
    if (lastIntent === 'stealth' || actionText.includes('sneak') || actionText.includes('hide') || actionText.includes('stalk')) return 'sprite-sneak';
    if (lastIntent === 'work') return 'sprite-work';
    return '';
  })();

  // ── Weather-reactive animation (DoL-parity) ──
  const weather = state.world.weather;
  const weatherClass = (() => {
    if (inEncounter) return '';
    if (weather === 'Blizzard' || weather === 'Freezing' || weather === 'Clear and Cold' || weather === 'Light Snow') return 'sprite-shiver';
    if (weather === 'Scorching' || weather === 'Hot') return 'sprite-heat-wilt';
    if (weather === 'Rainy' || weather === 'Cold Rain' || weather === 'Drizzle' || weather === 'Thunderstorm') return 'sprite-wet';
    return '';
  })();

  // ── Status-reactive animations (DoL-parity: exhaustion, fear, limp, hunger) ──
  const needs = state.player.life_sim.needs;
  const statusAnimClass = (() => {
    if (inEncounter) return '';
    // Ecstasy tremor overrides other status (extreme arousal)
    if (stats.arousal > 85 || (stats.lust > 85 && stats.arousal > 60)) return 'sprite-ecstasy';
    // Exhaustion — very low energy
    if (needs.energy <= 15 || stats.stamina < 15) return 'sprite-exhausted';
    // Fear tremor — high trauma or extreme stress
    if (stats.trauma > 70 || stats.stress > 80) return 'sprite-fear-tremble';
    // Limping — low health during any movement activity
    const isMoving = activityClass === 'sprite-walk' || activityClass === 'sprite-exercise' || activityClass === 'sprite-sneak';
    if (stats.health < 25 && isMoving) return 'sprite-limp';
    // Hunger weakness
    if (needs.hunger <= 10) return 'sprite-hungry';
    // Intoxicated (can be triggered by afflictions)
    if (state.player.afflictions.some((a: string) => a.toLowerCase().includes('drunk') || a.toLowerCase().includes('drugged') || a.toLowerCase().includes('intoxicat'))) return 'sprite-drunk';
    return '';
  })();

  // Body animation CSS classes (priority-ordered composition)
  const bodyAnimClass = [
    // Base idle breathing (pauses during activity/combat/encounter)
    !combatAnimClass && !encActionClass && !activityClass && !statusAnimClass ? 'sprite-breathe' : '',
    // Idle sway when standing with nothing else happening
    !combatAnimClass && !encActionClass && !activityClass && !statusAnimClass && !inEncounter ? 'sprite-idle-sway' : '',
    // Status/condition reactive (DoL-parity)
    showTremble && !statusAnimClass ? 'sprite-arousal-tremble' : '',
    showPainFlinch && !combatAnimClass ? 'sprite-pain-flinch' : '',
    // Activity animation (travel/sleep/swim/work/etc.)
    activityClass,
    // Status animation (exhaustion/fear/limp/hunger/drunk)
    statusAnimClass,
    // Weather reactive
    weatherClass,
    // Combat/encounter animations (highest priority)
    combatAnimClass,
    encActionClass,
    stanceClass,
    debuffClass,
    inEncounter ? 'sprite-danger-aura' : '',
  ].filter(Boolean).join(' ');

  const svgH = compact ? 144 : 225;
  const svgW = compact ? 80  : 100;

  return (
    <div className="flex flex-col items-center gap-0.5">
      <motion.svg
        viewBox="0 0 100 225"
        width={svgW} height={svgH}
        style={{ filter: bodyFilter, overflow: 'visible' }}
        initial={{ opacity: 0, y: -8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.45 }}
      >
        {/* ── Hikari-quality SVG definitions (gradients, filters) ── */}
        {graphicsQuality.sprite_quality.gradient_shading && (
          <SpriteDefs
            skin={skin}
            skinShadow={skinTones.shadow}
            skinHighlight={skinTones.highlight}
            hairClr={hairClr}
            hairHighlight={hairHiClr}
            eyeClr={eyeClr}
          />
        )}

        {/* ── BODY ANIMATION WRAPPER (breathing / tremble / flinch) ── */}
        <g className={bodyAnimClass}>

          <LayeredBody geom={geom} s={finalSpriteState} skin={skin} accentClr={accentClr} raceDef={raceDef} isMale={isMale} isFemale={isFemale} isChestExposed={isChestExposed} pregnancyBump={pregnancyBump} clothing={clothing} encounterAction={encounterAction} />

          <FaceAndHair geom={geom} s={finalSpriteState} skin={skin} eyeClr={eyeClr} hairClr={hairClr} accentClr={accentClr} raceDef={raceDef} isMale={isMale} isFemale={isFemale} cosmetics={cos} expression={expression} />

          <GenitalsAndChest geom={geom} s={finalSpriteState} skin={skin} hairClr={hairClr} raceDef={raceDef} isMale={isMale} isFemale={isFemale} isChestExposed={isChestExposed} isGroinExposed={isGroinExposed} isLegsExposed={isLegsExposed} isAroused={isAroused} isLactating={isLactating} nippleClr={nippleClr} />

          {graphicsQuality.sprite_quality.cosmetic_details && (
            <SkinPatterns geom={geom} s={finalSpriteState} skin={skin} accentClr={accentClr} raceDef={raceDef} isFemale={isFemale} isChestExposed={isChestExposed} isGroinExposed={isGroinExposed} isLegsExposed={isLegsExposed} isArmsExposed={isArmsExposed} hasFreckles={hasFreckles} hasTanLines={hasTanLines} scars={scars} tattoos={tattoos} piercings={piercings} bodyWriting={bodyWriting} hasCollar={hasCollar} bodyPartsIntegrity={state.player.anatomy.body_parts} />
          )}

          {/* ── MUSCLE DEFINITION (enhanced DoL-parity detail levels) ── */}
          {graphicsQuality.sprite_quality.muscle_detail_level > 0 && (
            <MuscleDefinition
              geom={geom}
              s={finalSpriteState}
              skin={skin}
              build={raceDef.build}
              isChestExposed={isChestExposed}
              shouldersExposed={!clothing.shoulders}
              legsExposed={isLegsExposed}
              detailLevel={graphicsQuality.sprite_quality.muscle_detail_level}
            />
          )}

          <Clothing geom={geom} s={finalSpriteState} skin={skin} clothing={clothing} clothingState={clothing_state} />

          {/* ── RESTRAINT LAYER (bindings, cuffs, rope — above clothing) ── */}
          <RestraintLayer geom={geom} s={finalSpriteState} restraints={state.player.restraints} />

          {/* ── FLUID EFFECTS (enhanced DoL-parity rendering) ── */}
          {graphicsQuality.sprite_quality.fluid_effects && (
            <FluidEffects
              geom={geom}
              s={finalSpriteState}
              body_fluids={state.player.body_fluids}
              isChestExposed={isChestExposed}
              isGroinExposed={isGroinExposed}
              isLegsExposed={isLegsExposed}
              isFemale={isFemale}
            />
          )}

          <StatusEffects geom={geom} s={finalSpriteState} raceDef={raceDef} isChestExposed={isChestExposed} isLegsExposed={isLegsExposed} blushIntensity={blushIntensity} isSweating={isSweating} showHeartOverlay={showHeartOverlay} showCorruptionFx={showCorruptionFx} inEncounter={inEncounter} targetedPart={targetedPart} playerStance={playerStance} combatAnim={combatAnim} encounterAction={encounterAction} compact={compact} svgW={svgW} svgH={svgH} lowHealth={lowHealth} corruption={corruption} hallucination={stats.hallucination} parasites={biology.parasites} />

          {/* ── X-RAY OVERLAY (internal skeleton + organs view) ── */}
          {showXRay && graphicsQuality.sprite_quality.xray_overlay && (
            <XRayOverlay
              geom={geom}
              s={finalSpriteState}
              isFemale={isFemale}
              organs={state.player.anatomy.organs}
              bones_integrity={state.player.anatomy.bones_integrity}
            />
          )}

        </g>
      </motion.svg>

      {hasExposure && !compact && (
        <div className="text-[8px] tracking-widest uppercase text-red-400/70 animate-pulse text-center">⚠ Exposed</div>
      )}
      {biology.heat_rut_active && !compact && (
        <div className="text-[8px] tracking-widest uppercase text-pink-400/70 animate-pulse text-center">♥ Heat</div>
      )}
      {inEncounter && !compact && (
        <div className={`text-[7px] tracking-widest uppercase text-center ${
          playerStance === 'aggressive' ? 'text-red-400/70' :
          playerStance === 'defensive' ? 'text-blue-400/70' :
          playerStance === 'submissive' ? 'text-purple-400/70' :
          'text-white/40'
        }`}>
          ⚔ {playerStance}
        </div>
      )}
    </div>
  );
});
