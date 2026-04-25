import React, { useCallback } from 'react';
import { GameState } from '../core/types';
import { resolveRace } from '../data/races';
import { buildBodyGeom, resolveSkinColor, SpriteState } from './dol/sprite/utils';
import { convertSvgToGltf, downloadGltf } from '../../shared/utils/svgToGltf';

interface GltfExportButtonProps {
  state: GameState;
}

/**
 * Small button that exports the current character sprite as a glTF 2.0 file.
 * Reads the same BodyGeom/SpriteState that DoLCharacterSprite uses, runs
 * the SVG→glTF converter, and triggers a browser download.
 */
export const GltfExportButton: React.FC<GltfExportButtonProps> = ({ state }) => {
  const handleExport = useCallback(() => {
    const { identity, cosmetics } = state.player;
    const raceDef = resolveRace(identity.race);
    const gender  = identity.gender || 'female';
    const geom    = buildBodyGeom(gender, raceDef);
    const skinColor = resolveSkinColor(raceDef, cosmetics?.skin_tone || ');

    // Replicate the sprite-state constants from DoLCharacterSprite
    const cx = 50;
    const headCY   = 21;
    const neckTopY = headCY + geom.headRY;
    const neckBotY = neckTopY + 9;
    const shldY    = neckBotY + 1;
    const waistY   = 98;
    const hipTopY  = 104;
    const crotchY  = 120;
    const kneeY    = 160;
    const ankleY   = 196;
    const footBotY = 206;

    const shLX = cx - geom.shoulderHW - geom.shoulderOutset;
    const shRX = cx + geom.shoulderHW + geom.shoulderOutset;
    const elLX = cx - geom.shoulderHW - geom.elbowOutset;
    const elRX = cx + geom.shoulderHW + geom.elbowOutset;
    const elY  = shldY + 40;
    const wrLX = cx - geom.shoulderHW - geom.wristOutset;
    const wrRX = cx + geom.shoulderHW + geom.wristOutset;
    const wrY  = elY + 28;
    const handCY = wrY + geom.handH / 2;

    const legLX = cx - geom.legSpread;
    const legRX = cx + geom.legSpread;

    const isDigi     = raceDef.leg_type === 'digitigrade';
    const digiKneeY  = kneeY - 18;
    const digiAnkleY = ankleY - 12;

    const spriteState: SpriteState = {
      cx, headCY, neckTopY, neckBotY, shldY, waistY, hipTopY, crotchY,
      kneeY, ankleY, footBotY,
      shLX, shRX, elLX, elRX, elY, wrLX, wrRX, wrY, handCY,
      legLX, legRX, isDigi, digiKneeY, digiAnkleY,
    };

    const gltfJson = convertSvgToGltf({ geom, spriteState, skinColor });
    const name = identity.name?.replace(/\s+/g, '_') || 'character';
    downloadGltf(gltfJson, `${name}.gltf`);
  }, [state]);

  return (
    <button
      onClick={handleExport}
      className="text-[7px] tracking-widest uppercase px-1.5 py-0.5 rounded-sm border transition-all bg-black/40 border-white/10 text-white/40 hover:text-white/70 hover:border-white/25"
      title="Export character as glTF 3D model"
    >
      glTF
    </button>
  );
};
