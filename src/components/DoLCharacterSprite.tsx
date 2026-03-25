import React from 'react';
import { motion } from 'motion/react';
import { GameState, Item, Cosmetics, CosmeticScar, CosmeticTattoo, CosmeticPiercing } from '../types';
import { resolveRace, RacialBodyFeatures } from '../data/races';

import {
  SLOT_COLORS, integrityStyle, BodyGeom, buildBodyGeom, resolveSkinColor,
  resolveEyeColor, resolveHairColor, EXPOSURE_INTEGRITY_THRESHOLD, AROUSAL_BLUSH_WEIGHT,
  STRESS_BLUSH_WEIGHT, MAX_BODY_WRITING_CHARS, normalizeScar, normalizeTattoo,
  normalizePiercing, getNippleColor, SpriteState
} from './dol/sprite/utils';
import { BaseBody } from './dol/sprite/BaseBody';
import { FaceAndHair } from './dol/sprite/FaceAndHair';
import { GenitalsAndChest } from './dol/sprite/GenitalsAndChest';
import { SkinPatterns } from './dol/sprite/SkinPatterns';
import { Clothing } from './dol/sprite/Clothing';
import { StatusEffects } from './dol/sprite/StatusEffects';

interface DoLCharacterSpriteProps {
  state: GameState;
  compact?: boolean;
}

export const DoLCharacterSprite: React.FC<DoLCharacterSpriteProps> = ({ state, compact = false }) => {
  const { clothing, identity, cosmetics, stats, biology } = state.player;
  const raceDef   = resolveRace(identity.race);
  const gender    = identity.gender || 'female';
  const geom      = buildBodyGeom(gender, raceDef);
  const skin      = resolveSkinColor(raceDef, cosmetics?.skin_tone || '');
  const eyeClr    = resolveEyeColor(raceDef, cosmetics?.eye_color || '');
  const hairClr   = resolveHairColor(raceDef, cosmetics?.hair_color || '');
  const accentClr = raceDef.accent_colors[0] || skin;

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
  const pregnancyBump    = biology.incubations
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

  // ── Encounter / combat animation state ─────────────────────────────────
  const encounter      = state.world.active_encounter;
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
  };
  const combatAnimClass = combatAnim ? COMBAT_ANIM_CLASSES[combatAnim] || '' : '';

  // Stance CSS class (persistent posture during encounter)
  const stanceClass = inEncounter
    ? playerStance === 'defensive' ? 'sprite-stance-defensive'
    : playerStance === 'aggressive' ? 'sprite-stance-aggressive'
    : playerStance === 'submissive' ? 'sprite-stance-submissive'
    : ''
    : '';

  // Debuff visual classes
  const debuffClass = [
    hasDebuff('slowed') ? 'sprite-debuff-slowed' : '',
    hasDebuff('weakened') ? 'sprite-debuff-weakened' : '',
  ].filter(Boolean).join(' ');

  // Body animation CSS classes
  const bodyAnimClass = [
    !combatAnimClass ? 'sprite-breathe' : '',     // breathing pauses during combat anims
    showTremble ? 'sprite-arousal-tremble' : '',
    showPainFlinch && !combatAnimClass ? 'sprite-pain-flinch' : '',
    combatAnimClass,
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
        {/* ── BODY ANIMATION WRAPPER (breathing / tremble / flinch) ── */}
        <g className={bodyAnimClass}>

          <BaseBody geom={geom} s={s} skin={skin} accentClr={accentClr} raceDef={raceDef} isMale={isMale} isFemale={isFemale} isChestExposed={isChestExposed} pregnancyBump={pregnancyBump} clothing={clothing} />

          <FaceAndHair geom={geom} s={s} skin={skin} eyeClr={eyeClr} hairClr={hairClr} accentClr={accentClr} raceDef={raceDef} isMale={isMale} isFemale={isFemale} cosmetics={cos} />

          <GenitalsAndChest geom={geom} s={s} skin={skin} hairClr={hairClr} raceDef={raceDef} isMale={isMale} isFemale={isFemale} isChestExposed={isChestExposed} isGroinExposed={isGroinExposed} isLegsExposed={isLegsExposed} isAroused={isAroused} isLactating={isLactating} nippleClr={nippleClr} />

          <SkinPatterns geom={geom} s={s} skin={skin} accentClr={accentClr} raceDef={raceDef} isFemale={isFemale} isChestExposed={isChestExposed} isGroinExposed={isGroinExposed} isLegsExposed={isLegsExposed} isArmsExposed={isArmsExposed} hasFreckles={hasFreckles} hasTanLines={hasTanLines} scars={scars} tattoos={tattoos} piercings={piercings} bodyWriting={bodyWriting} hasCollar={hasCollar} bodyPartsIntegrity={state.player.anatomy.body_parts} />

          <Clothing geom={geom} s={s} skin={skin} clothing={clothing} />

          <StatusEffects geom={geom} s={s} raceDef={raceDef} isChestExposed={isChestExposed} isLegsExposed={isLegsExposed} blushIntensity={blushIntensity} isSweating={isSweating} showHeartOverlay={showHeartOverlay} showCorruptionFx={showCorruptionFx} inEncounter={inEncounter} targetedPart={targetedPart} playerStance={playerStance} combatAnim={combatAnim} compact={compact} svgW={svgW} svgH={svgH} lowHealth={lowHealth} corruption={corruption} hallucination={stats.hallucination} parasites={biology.parasites} />

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
};
