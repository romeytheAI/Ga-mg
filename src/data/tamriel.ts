// =============================================================================
// TAMRIEL GAME DATA — Elder Scrolls Dark Fantasy RPG
// =============================================================================
// No human races. Only Mer (Elves), Beast races, and Daedra-touched.
// Tone: dark survival fantasy, adult themes, authentic ES lore.
// =============================================================================

// ---------------------------------------------------------------------------
// TYPE DEFINITIONS
// ---------------------------------------------------------------------------

export interface TamrielRace {
  id: string;
  name: string;
  /** UI alias for name — set on all entries */
  displayName: string;
  lore: string;
  /** UI alias for lore — optional, filled by RACES map */
  description?: string;
  stat_bonuses: Partial<Record<string, number>>;
  /** UI alias for stat_bonuses — optional, filled by RACES map */
  racialBonuses?: Partial<Record<string, number>>;
  skill_bonuses: Partial<Record<string, number>>;
  special_ability: string;
  appearance_notes: string;
  birthsign_affinity: string[];
  /** Starting location ids — set on all entries */
  startingLocations: string[];
}

export interface TamrielBirthsign {
  id: string;
  name: string;
  constellation: string;
  bonus: string;
  stat_bonuses: Partial<Record<string, number>>;
  lore: string;
}

export interface Action {
  id: string;
  label: string;
  intent: string;
  outcome?: string;
  fail_outcome?: string;
  skill_check?: { stat: string; difficulty: number };
  stat_deltas?: Record<string, number>;
  fail_stat_deltas?: Record<string, number>;
  new_items?: any[];
  new_location?: string;
}

export interface LocationData {
  id: string;
  name: string;
  province: string;
  atmosphere: string;
  danger: number;
  x: number;
  y: number;
  npcs: string[];
  description: string;
  actions: Action[];
}

export interface NpcData {
  id: string;
  name: string;
  race: string;
  relationship: number;
  description: string;
  responses: {
    social?: { narrative_text: string; stat_deltas: Record<string, number> };
    work?: { narrative_text: string; stat_deltas: Record<string, number> };
    aggressive?: { narrative_text: string; stat_deltas: Record<string, number> };
  };
}

export interface EncounterData {
  id: string;
  condition: string;
  danger_min?: number;
  location_ids?: string[];
  outcome: string;
  enemy_name: string;
  enemy_type: string;
  enemy_health: number;
  enemy_max_health: number;
  enemy_lust: number;
  enemy_max_lust: number;
  enemy_anger: number;
  enemy_max_anger: number;
}

export interface ItemData {
  id: string;
  name: string;
  type: 'weapon' | 'armor' | 'consumable' | 'misc' | 'clothing';
  slot?: 'head' | 'neck' | 'shoulders' | 'chest' | 'underwear' | 'legs' | 'feet' | 'hands' | 'waist';
  rarity: 'common' | 'uncommon' | 'rare' | 'epic' | 'legendary' | 'mythic';
  stats?: Record<string, number>;
  description: string;
  value: number;
  weight: number;
  integrity?: number;
  max_integrity?: number;
  lore?: string;
}

// ---------------------------------------------------------------------------
// RACES
// ---------------------------------------------------------------------------

export const TAMRIEL_RACES: TamrielRace[] = [
  {
    id: 'altmer',
    name: 'Altmer (High Elf)', displayName: 'Altmer (High Elf)',
    startingLocations: ['imperial_city_market', 'seyda_neen'],
    lore: 'The Altmer of Summerset Isle are the oldest and most magically gifted of all mer-kind, tracing their lineage to the Aldmer who first set foot on Tamriel. They cultivate an aristocratic disdain for lesser races, believing themselves closest to the divine Aedra. Their society is rigid, their magic formidable, and their pride a thing sharp as glass.',
    stat_bonuses: { willpower: 15, corruption: 10, health: -10, stamina: -5, purity: -5 },
    skill_bonuses: { school_grades: 20, seduction: 5 },
    special_ability: 'Highborn Magicka: Regenerates magicka at twice the normal rate. Begins each day with a burst of arcane vitality, but this potency frays the body — any magical mishap deals bonus trauma. Immune to minor enchantments but vulnerable to daedric corruption.',
    appearance_notes: 'Exceptionally tall and slender with golden-toned skin ranging from pale amber to deep bronze. High angular cheekbones, large almond eyes of amber or gold, swept-back pointed ears slightly taller than other mer. Regal bearing, often dressed in fine robes or light crystalline armor.',
    birthsign_affinity: ['the_mage', 'the_atronach', 'the_apprentice', 'the_ritual'],
  },
  {
    id: 'dunmer',
    name: 'Dunmer (Dark Elf)', displayName: 'Dunmer (Dark Elf)',
    startingLocations: ['seyda_neen', 'balmora'],
    lore: 'Once known as the Chimer — the Changed Ones — the Dunmer were transformed by the curse of the Tribunal into ash-skinned, red-eyed mer, a people defined by their resilience amid hardship. From the volcanic wastes of Morrowind they carved a civilization of cunning politics, ancestor worship, and devastating fire magic. They are survivors by nature, secretive by necessity, and proud to a fault.',
    stat_bonuses: { health: 5, stamina: 5, willpower: 5, corruption: 5 },
    skill_bonuses: { skulduggery: 10, seduction: 5, athletics: 5 },
    special_ability: 'Ancestor\'s Flame: Innate resistance to fire and magicka. Once per day may invoke an ancestral spirit for guidance — reduces stress and grants brief foresight. Long exposure to ash blights grants partial Blight resistance.',
    appearance_notes: 'Lean, wiry builds with ashen grey skin ranging from pale smoke to deep charcoal. Striking crimson or dark ruby eyes that glow faintly in low light. Sharp angular features, longer pointed ears. Often scarred from Morrowind\'s harsh environment. Favors dark, practical clothing and chitin armor.',
    birthsign_affinity: ['the_shadow', 'the_lord', 'the_warrior', 'the_thief'],
  },
  {
    id: 'bosmer',
    name: 'Bosmer (Wood Elf)', displayName: 'Bosmer (Wood Elf)',
    startingLocations: ['whiterun', 'seyda_neen'],
    lore: 'The Bosmer of Valenwood are bound by the Green Pact — a sacred covenant with Y\'ffre, god of the Forest, that forbids them from harming plant life or consuming vegetables. What they cannot grow, they must hunt, and what they hunt, they must consume entirely — including fallen enemies. This cannibalistic rite is observed with solemn reverence rather than savagery, though outsiders rarely see it that way.',
    stat_bonuses: { stamina: 10, health: -5, willpower: -5 },
    skill_bonuses: { skulduggery: 15, athletics: 15, swimming: 5 },
    special_ability: 'Wild Hunt Inheritance: Exceptional night vision and tracking instinct. +20 to evasion checks in forested or wilderness environments. Under extreme stress may partially invoke the Wild Hunt, gaining feral strength at the cost of temporary sanity (triggers hallucination event).',
    appearance_notes: 'Small and lithe, the shortest of the mer-races, with brown or olive skin toned like sun-worn bark. Quick darting eyes of green, brown, or amber. Short pointed ears, sharp features. Often tattooed with green-painted hunting marks. Moves with uncanny quiet grace.',
    birthsign_affinity: ['the_thief', 'the_shadow', 'the_steed', 'the_tower'],
  },
  {
    id: 'orsimer',
    name: 'Orsimer (Orc)', displayName: 'Orsimer (Orc)',
    startingLocations: ['whiterun', 'seyda_neen'],
    lore: 'The Orsimer were once Aldmer followers of the god Trinimac, transformed when Boethiah devoured and corrupted their deity, leaving them with tusked jaws, heavy frames, and a legacy of scorn from other mer-kin. They have built a civilization of brutal self-sufficiency in the strongholds of Orsinium, governed by a strict Code of Malacath — fight your own battles, honor your debts, and die with your weapon in hand.',
    stat_bonuses: { health: 20, stamina: 15, willpower: -10, purity: -10, corruption: 5 },
    skill_bonuses: { athletics: 10, housekeeping: 5 },
    special_ability: 'Berserk: Once per encounter, when health drops below 25%, enter a berserker state — stamina and damage multiplied, but defense drops to zero and the character cannot flee for 3 turns. Malacath\'s Endurance: Ignores the first point of pain each turn.',
    appearance_notes: 'Powerfully built with green to grey-green skin, pronounced lower tusks, and a heavy brow ridge. Broad-shouldered with muscular arms and thick torsos. Both male and female Orsimer carry visible battle scars as marks of honor. Favors heavy iron and steel armor, often adorned with Malacath\'s spike motifs.',
    birthsign_affinity: ['the_warrior', 'the_lord', 'the_lady', 'the_steed'],
  },
  {
    id: 'khajiit',
    name: 'Khajiit', displayName: 'Khajiit',
    startingLocations: ['riften', 'whiterun'],
    lore: 'The Khajiit of Elsweyr are a beast-folk whose form is determined by the phase of the moons at their birth — from the great lion-like Senche-raht to the near-humanoid Ohmes, with the most common, the Suthay-raht, standing roughly man-height with feline features and a prehensile tail. They are traders, wanderers, and consummate survivors, known for their dexterity and their complicated relationship with moon sugar and skooma. Do not leave them alone with your coin purse.',
    stat_bonuses: { stamina: 10, health: 5, corruption: 5 },
    skill_bonuses: { seduction: 20, skulduggery: 15, dancing: 10, athletics: 5 },
    special_ability: 'Night Eye: Can activate superior night vision at will, negating darkness penalties. Claws of the Jone and Jode: Natural weapons that deal minor damage without penalty in unarmed combat. Sweet Tooth: Moon sugar and skooma provide double the effect but carry double the addiction risk.',
    appearance_notes: 'Covered in short, fine fur ranging from sandy gold to dark tabby stripes, solid black or rare snow-white. Feline facial features with vertical-slit pupils, rounded ears, prominent whiskers, and a long tail. Suthay-raht build is lithe and wiry. Eyes often glow faintly amber, green, or pale blue in darkness. Favors light, layered silks and practical wraps.',
    birthsign_affinity: ['the_thief', 'the_shadow', 'the_lover', 'the_serpent'],
  },
  {
    id: 'argonian',
    name: 'Argonian', displayName: 'Argonian',
    startingLocations: ['blackwood_marsh', 'seyda_neen'],
    lore: 'The Argonians — or Saxhleel in their own tongue — are the reptilian people of Black Marsh, shaped and guided by the Hist: vast, ancient trees of alien intelligence that breathe the Argonian soul into being. They are uniquely resistant to disease and poison, breathe underwater, and can regrow lost limbs given time. The Hist observe all through their root-network, and Argonians feel a pull toward that collective consciousness that never entirely fades, even in exile.',
    stat_bonuses: { health: 10, purity: 15, willpower: 5, stamina: -5 },
    skill_bonuses: { swimming: 25, housekeeping: 5, athletics: 5 },
    special_ability: 'Histskin: Once per day, commune briefly with the Hist to rapidly regenerate health for 30 seconds. Immune to all diseases and resistant to poisons. Amphibious: breathe and move freely underwater without penalty. Hist Bond: Consuming hist sap grants double the effect but risks temporary loss of individual identity.',
    appearance_notes: 'Bipedal reptilian form with scales ranging from dark swamp-green to vivid teal, rust-red or even banded black-and-gold for rare bloodlines. Elongated skulls with bony head crests, slit-pupil eyes of amber, gold or pale green. Long clawed hands and a powerful tail. Build varies from lean and swift to heavyset and armored with natural scale-plates.',
    birthsign_affinity: ['the_ritual', 'the_lady', 'the_atronach', 'the_apprentice'],
  },
  {
    id: 'sload',
    name: 'Sload (Sea Slug Sorcerer)', displayName: 'Sload (Sea Slug Sorcerer)',
    startingLocations: ['anvil_docks', 'seyda_neen'],
    lore: 'The Sload of Thras are slug-like sea creatures of immense magical talent and utter moral vacancy — they regard all other life as either tools or food, and feel no emotion that others would recognize as such. They communicate in deep subsonic rumbles felt in the chest rather than heard, and their necromantic arts are considered among the most powerful and reviled in Tamriel. An encounter with a Sload is almost always deliberate on their part, and never in your favor.',
    stat_bonuses: { willpower: 20, corruption: 20, health: -20, stamina: -15, purity: -15 },
    skill_bonuses: { school_grades: 25, skulduggery: 10 },
    special_ability: 'Corprus Necromancy: Can animate one fallen creature per combat as a thrall at no cost. Slick Hide: Extremely difficult to grapple; evasion bonus against physical restraint. Amoral Calculus: Immune to social manipulation and charm effects but also cannot benefit from positive NPC relationship bonuses.',
    appearance_notes: 'Massive, pale, slug-like bodies without legs, moving on a muscular foot like a great snail. Sickly translucent flesh through which internal organs are dimly visible. Stubby, boneless arms and a wide, almost lipless mouth ringed with sensory tendrils. Eyes are small and jet-black, set wide on a flat, expressionless face. Often partially submerged or trailing slime wherever they go.',
    birthsign_affinity: ['the_atronach', 'the_mage', 'the_serpent', 'the_ritual'],
  },
  {
    id: 'falmer',
    name: 'Falmer (Snow Elf Descendant)', displayName: 'Falmer (Snow Elf Descendant)',
    startingLocations: ['windhelm', 'ratway'],
    lore: 'Once the Snow Elves of ancient Skyrim were a proud and graceful people, but when the ancient Atmoran settlers drove them into hiding they turned in desperation to the Dwemer, who enslaved them and fed them toxic fungi until they went blind and feral over generations. The Falmer that haunt Dwemer ruins and frozen caves today are barely recognizable as mer, their forms mutated, their language reduced to hisses and clicks — yet some few retain traces of ancestral Snow Elf intelligence, and these are the most dangerous of all.',
    stat_bonuses: { health: 10, stamina: 10, purity: -20, corruption: 15, willpower: -10 },
    skill_bonuses: { skulduggery: 10, athletics: 10, swimming: -5 },
    special_ability: 'Echoes of Auriel: Completely immune to hallucination effects and blindness penalties — Falmer navigate by sound and vibration as fluently as sight. Chitin Carapace: Natural armor rating from years of mutation. Cave Instinct: Superior tracking and ambush capability in underground or enclosed environments.',
    appearance_notes: 'Hunched, pale creatures with milky-white sightless eyes and elongated skulls, their features collapsed by generations of sensory adaptation. Skin is fish-belly white or pallid grey, stretched over visible bone protrusions. Fingers have lengthened into semi-clawed digits. The rarer intelligent Falmer may stand straighter with remnants of a more recognizable mer face, and tend to wear scraps of Dwemer metal.',
    birthsign_affinity: ['the_shadow', 'the_tower', 'the_warrior', 'the_serpent'],
  },
];

// ---------------------------------------------------------------------------
// BIRTHSIGNS
// ---------------------------------------------------------------------------

export const TAMRIEL_BIRTHSIGNS: TamrielBirthsign[] = [
  {
    id: 'the_warrior',
    name: 'The Warrior',
    constellation: 'The Warrior',
    bonus: 'Born under the sign of the Warrior, you are stronger in body and more resilient in combat. Stamina regenerates 25% faster and all physical skill checks receive a +5 bonus.',
    stat_bonuses: { stamina: 10, health: 5 },
    lore: 'The Warrior is the first Guardian constellation. Those born beneath his stars are said to be touched by the god Trinimac, granting them an instinct for conflict and the endurance to see it through.',
  },
  {
    id: 'the_mage',
    name: 'The Mage',
    constellation: 'The Mage',
    bonus: 'Born under the sign of the Mage, your magical aptitude is heightened. Willpower gains a permanent +10 bonus and all magicka-related skill checks are made at advantage.',
    stat_bonuses: { willpower: 15 },
    lore: 'The Mage is the second Guardian constellation, patron to scholars and sorcerers alike. Those born beneath her sign often display magical talents from birth, unsettling the simple folk around them.',
  },
  {
    id: 'the_thief',
    name: 'The Thief',
    constellation: 'The Thief',
    bonus: 'Born under the sign of the Thief, your luck runs deeper and your reflexes are quicker. Skulduggery and athletics skills begin 10 points higher. Once per day, automatically succeed on a single evasion or stealth check.',
    stat_bonuses: { stamina: 5, health: -5 },
    lore: 'The Thief is the third and most mischievous of the Guardian constellations. Her children are clever, quick, and touched by fortune — though that fortune has a habit of turning at the worst possible moment.',
  },
  {
    id: 'the_serpent',
    name: 'The Serpent',
    constellation: 'The Serpent',
    bonus: 'Born under the wandering Serpent sign, you carry venom in your blood and chaos in your wake. Your attacks can inflict a stacking poison effect. However, healing magic and potions have 50% reduced effectiveness on you.',
    stat_bonuses: { corruption: 10, purity: -10, stamina: 5 },
    lore: 'The Serpent has no fixed place in the sky, wandering between the other constellations. To be born under it is considered deeply unlucky by most cultures — or deeply dangerous, which amounts to the same thing.',
  },
  {
    id: 'the_lady',
    name: 'The Lady',
    constellation: 'The Lady',
    bonus: 'Born under the sign of the Lady, your presence is soothing and your endurance remarkable. Willpower regenerates 20% faster and all social interaction checks gain a +8 bonus.',
    stat_bonuses: { willpower: 10, purity: 5 },
    lore: 'Those born under the Lady are said to carry a warmth that sets others at ease, a remnant of Mara\'s gentle gaze. They make excellent diplomats, healers, and — in dark times — extraordinarily effective manipulators.',
  },
  {
    id: 'the_tower',
    name: 'The Tower',
    constellation: 'The Tower',
    bonus: 'Born under the sign of the Tower, you have a gift for unlocking what is locked and keeping locked what is yours. Skulduggery checks for picking locks and bypassing traps gain +15. Once per day, automatically detect any hidden mechanisms in your current location.',
    stat_bonuses: { willpower: 5, health: 5 },
    lore: 'The Tower represents both the Adamantine Tower of legend and the mortal ambition that built it. Those born beneath it are said to inherit both the tower\'s impregnability and the hubris that eventually brings all towers down.',
  },
  {
    id: 'the_atronach',
    name: 'The Atronach',
    constellation: 'The Atronach',
    bonus: 'Born under the sign of the Atronach, you absorb magical energy rather than generating it naturally. 50% chance to absorb and convert incoming spells into stamina. However, magicka does not regenerate on its own — it must be absorbed or restored by potion.',
    stat_bonuses: { willpower: 20, stamina: 10, health: -5 },
    lore: 'The Atronach, or Golem, is the most powerful and most treacherous of the Mage birthsigns. Its children are walking magical batteries — immensely powerful when charged, helpless when dry.',
  },
  {
    id: 'the_ritual',
    name: 'The Ritual',
    constellation: 'The Ritual',
    bonus: 'Born under the sign of the Ritual, you have an affinity for sacred and forbidden rites alike. Once per day, heal yourself or another for a significant amount. Purity and corruption effects on your character are doubled in both directions.',
    stat_bonuses: { purity: 10, corruption: 10, willpower: 5 },
    lore: 'The Ritual constellation is associated with Mara and Z\'en, but also with the more unsettling aspects of religious devotion. Its children walk a knife-edge between the sacred and the profane, often without realizing it.',
  },
  {
    id: 'the_lover',
    name: 'The Lover',
    constellation: 'The Lover',
    bonus: 'Born under the sign of the Lover, your presence stirs deep feelings in others. Seduction and dancing skills begin 15 points higher. Once per day, paralyze a target briefly with an overwhelming wave of desire or longing.',
    stat_bonuses: { corruption: 5, stamina: 5, stress: -5 },
    lore: 'The Lover is associated with Dibella, goddess of beauty, and her mark is unmistakable on those born beneath it. They move through the world trailing want and obsession, rarely understanding why others react so strongly to their mere presence.',
  },
  {
    id: 'the_lord',
    name: 'The Lord',
    constellation: 'The Lord',
    bonus: 'Born under the sign of the Lord, you regenerate health rapidly but carry a weakness to magic. Health regenerates at double the normal rate. All magic-based damage received is increased by 25%.',
    stat_bonuses: { health: 15, willpower: -5 },
    lore: 'The Lord is the most contradictory of the birthsigns — tremendous vitality paired with a deep vulnerability. Those born beneath his stars heal like trolls from wounds that would kill others, and die from spells that should only sting.',
  },
  {
    id: 'the_steed',
    name: 'The Steed',
    constellation: 'The Steed',
    bonus: 'Born under the sign of the Steed, you are faster and less encumbered than your peers. Movement speed is increased, carry capacity is doubled, and athletics checks gain +10. You do not suffer stamina penalties from heavy armor.',
    stat_bonuses: { stamina: 15, health: 5 },
    lore: 'Those born beneath the Steed are restless souls, always moving, never quite settling. Merchants value them as couriers; generals value them as scouts; lovers find them frustrating. They are built for the road.',
  },
  {
    id: 'the_apprentice',
    name: 'The Apprentice',
    constellation: 'The Apprentice',
    bonus: 'Born under the sign of the Apprentice, your magical talent is raw and volatile. Willpower begins 25 points higher but all spell magnitudes — including harmful ones cast on you — are doubled. You learn magical skills twice as fast but pay twice the price for failure.',
    stat_bonuses: { willpower: 25, health: -10, stamina: -5 },
    lore: 'The Apprentice is the greatest gamble of the birthsigns — tremendous potential paired with catastrophic vulnerability. Mages\' guild halls are full of cautionary tales about Apprentice-born who burned too bright.',
  },
  {
    id: 'the_shadow',
    name: 'The Shadow',
    constellation: 'The Shadow',
    bonus: 'Born under the sign of the Shadow, you can vanish from perception once per day for a significant duration. Stealth and skulduggery checks gain +15 permanently. You are drawn to dark places and dark work, and dark things are in turn drawn to you.',
    stat_bonuses: { stamina: 5, corruption: 10, purity: -5 },
    lore: 'The Shadow\'s blessing is Moonshadow — the ability to briefly slip between the visible world and the unseen. Those born beneath it tend toward secrecy, not always by choice. Something about them seems slightly absent even when present.',
  },
];

// ---------------------------------------------------------------------------
// LOCATIONS
// ---------------------------------------------------------------------------

export const TAMRIEL_LOCATIONS: Record<string, LocationData> = {
  seyda_neen: {
    id: 'seyda_neen',
    name: 'Seyda Neen',
    province: 'Morrowind',
    atmosphere: 'Grey estuary mist, creaking docks, the smell of salt and ash. Imperial bureaucracy overlaid on ancient Dunmer tradition.',
    danger: 15,
    x: 18,
    y: 72,
    npcs: ['arrille', 'jiub'],
    description: 'Seyda Neen is a small Imperial customs village perched on the grey estuary where the Odai River meets the Inner Sea. Low-slung reed-and-plaster buildings crouch beneath a perpetual morning haze, and the wooden docks jut into brackish water where Census boats bob alongside fishing skiffs. It is the first place many outlanders see of Morrowind — and for some, the last. The Imperial Census and Excise Office looms over the central square, its garrison bored and underpaid.',
    actions: [
      {
        id: 'seyda_neen_census_work',
        label: 'Work at the Census Office',
        intent: 'work',
        outcome: 'You spend the morning sorting arrival manifests and stamping papers for the bleary-eyed garrison scribe. Tedious work, but the coin is honest and the Imperial clerk seems grateful for the help.',
        stat_deltas: { stamina: -5, stress: 5, health: 2 },
        new_items: [{ id: 'septim', name: 'Gold Septim', quantity: 8 }],
      },
      {
        id: 'seyda_neen_explore',
        label: 'Explore the town',
        intent: 'neutral',
        outcome: 'You wander Seyda Neen\'s short muddy lanes, noting the trader Arrille\'s establishment, the lighthouse at the estuary mouth, and a smugglers\' cave entrance half-hidden beneath the dock pilings. The locals eye you with the flat wariness of border-town Dunmer.',
        stat_deltas: { stamina: -3, stress: -5 },
      },
      {
        id: 'seyda_neen_travel_balmora',
        label: 'Travel the road to Balmora',
        intent: 'travel',
        outcome: 'You set out on the road north, following the river through Morrowind\'s grey-green marshland. The journey takes most of the day and your boots are soaked through, but Balmora\'s torchlit walls appear as the sun sets behind the ashfields.',
        stat_deltas: { stamina: -15, stress: 3 },
        new_location: 'balmora',
      },
      {
        id: 'seyda_neen_swim_estuary',
        label: 'Swim in the estuary',
        intent: 'neutral',
        outcome: 'The brackish water is cold but clear near the mouth. You swim among the pylons and drift on the current, washing off road dust and ash-grit. Something large stirs in the deeper channel — a dreugh, probably — but it doesn\'t approach.',
        stat_deltas: { health: 5, stress: -8, stamina: -10, hygiene: 15 },
        skill_check: { stat: 'swimming', difficulty: 20 },
        fail_outcome: 'The current is stronger than it looks. You swallow a mouthful of brackish water and barely haul yourself back to the dock pilings, coughing and shaken.',
        fail_stat_deltas: { health: -5, stress: 10, stamina: -15, hygiene: 5 },
      },
      {
        id: 'seyda_neen_beg',
        label: 'Beg in the town square',
        intent: 'social',
        outcome: 'Most passersby ignore you — another outlander down on their luck is nothing new in Seyda Neen. A Dunmer woman presses a few coins into your hand with an expression caught between pity and contempt.',
        stat_deltas: { stress: 10, corruption: 2, purity: -3 },
        new_items: [{ id: 'septim', name: 'Gold Septim', quantity: 3 }],
      },
      {
        id: 'seyda_neen_sneak_outskirts',
        label: 'Sneak to the outskirts',
        intent: 'stealth',
        outcome: 'You slip past the census office perimeter and find a hidden cache among the mangrove roots — likely a smuggler\'s drop. Inside: a few vials and a folded note in Trade Argonian. Whatever this was, someone will be back for it.',
        skill_check: { stat: 'skulduggery', difficulty: 35 },
        stat_deltas: { stamina: -5 },
        new_items: [{ id: 'moon_sugar', name: 'Moon Sugar', quantity: 1 }],
        fail_outcome: 'A garrison guard spots your lurking and warns you off the restricted waterfront with a hand on his blade hilt. You retreat, heart hammering.',
        fail_stat_deltas: { stress: 12, stamina: -5 },
      },
    ],
  },

  balmora: {
    id: 'balmora',
    name: 'Balmora',
    province: 'Morrowind',
    atmosphere: 'Candlelit stone bridges over the Odai River, Hlaalu house banners, the ever-present smell of sujamma and incense.',
    danger: 30,
    x: 22,
    y: 60,
    npcs: ['caius_cosades', 'sugar_lips_habasi'],
    description: 'Balmora is the largest settlement in the Vvardenfell district of Morrowind, a Hlaalu stronghold built on both banks of the Odai River, connected by graceful stone bridges that glow amber in the evening torchlight. The city\'s merchant houses cluster along the river, while guildhalls — Fighters, Mages, and the whisper-quiet offices of the Morag Tong — occupy the upper terraces. The silt strider port brings traders and travelers from across the province, and beneath the cheerful market noise, sharper business is always underway.',
    actions: [
      {
        id: 'balmora_cornerclub',
        label: 'Visit the Lucky Lockup Cornerclub',
        intent: 'social',
        outcome: 'The Cornerclub reeks of sujamma and burnt saltrice. You drink until the room blurs pleasantly and try your luck at dice with a pair of Dunmer traders. They cheat expertly but so do you, and the evening ends roughly even.',
        stat_deltas: { stress: -15, stamina: -8, willpower: -5, corruption: 3 },
        new_items: [{ id: 'comberry_wine', name: 'Comberry Wine', quantity: 1 }],
      },
      {
        id: 'balmora_silt_strider',
        label: 'Work at the silt strider stable',
        intent: 'work',
        outcome: 'Silt striders require constant grooming — their chitin plating harbors parasites if neglected, and their biological control organs must be kept clean and responsive. The work is foul but the strider-master pays fairly and without questions.',
        stat_deltas: { stamina: -12, stress: 5, health: -3, hygiene: -10 },
        new_items: [{ id: 'septim', name: 'Gold Septim', quantity: 12 }],
      },
      {
        id: 'balmora_morag_tong',
        label: 'Approach the Morag Tong guild',
        intent: 'stealth',
        outcome: 'The contact acknowledges your approach with a barely perceptible nod. The Morag Tong deals in legal sanctioned murder, blessed by the Tribunal and bound by intricate professional code. They are interested in you — quietly, the way a blade is interested in a throat.',
        skill_check: { stat: 'skulduggery', difficulty: 50 },
        stat_deltas: { stress: 5, corruption: 5 },
        fail_outcome: 'The door to the Morag Tong office is answered by silence. Either there is no office here, or you were watched and found wanting before you even knocked.',
        fail_stat_deltas: { stress: 8 },
      },
      {
        id: 'balmora_travel_caldera',
        label: 'Travel north to Caldera',
        intent: 'travel',
        outcome: 'The road to Caldera winds through ashfields and past the ruins of an old Velothi tower. You arrive at the fortified mining town as dusk turns the sky the color of old blood.',
        stat_deltas: { stamina: -12, stress: 4 },
        new_location: 'vivec_city',
      },
      {
        id: 'balmora_mages_guild',
        label: 'Visit the Mages Guild',
        intent: 'neutral',
        outcome: 'The Balmora Mages Guild smells of alchemical reagents and old paper. The locals regard you with cool professional neutrality. The library contains fascinating and occasionally disturbing research notes on Dwemer ruins and Sixth House cult activity.',
        stat_deltas: { willpower: 5, stress: -5, school_grades: 3 },
      },
      {
        id: 'balmora_swamp_travel',
        label: 'Travel into the marsh-roads',
        intent: 'travel',
        outcome: 'You push south into the Bitter Coast swamps, following the river road toward the distant shimmer of Vivec\'s cantons on the horizon.',
        stat_deltas: { stamina: -18, health: -3, stress: 8 },
        new_location: 'vivec_city',
      },
    ],
  },

  vivec_city: {
    id: 'vivec_city',
    name: 'Vivec City',
    province: 'Morrowind',
    atmosphere: 'Colossal floating cantons of dark Velothi stone, gondoliers calling across canals, the oppressive divine aura of a living god.',
    danger: 45,
    x: 28,
    y: 80,
    npcs: ['vivec', 'serjo_godes_alvela'],
    description: 'Vivec City is a wonder and an atrocity in equal measure — a city-god\'s ego made architecture. Enormous canton-islands float impossibly on the Bay of Vivec, each a self-contained district connected by gondola and sorcerous bridgework. The Palace canton at the city\'s heart houses Vivec himself, the Warrior-Poet, one of the three living gods of the Tribunal. Pilgrims arrive daily to seek his blessing; spies arrive to monitor his power; and the desperate arrive to disappear into the labyrinthine under-cantons where the law is more of a suggestion.',
    actions: [
      {
        id: 'vivec_shrine_prayer',
        label: 'Pray at Vivec\'s shrine',
        intent: 'neutral',
        outcome: 'The shrine chamber is cool and smells of burnt offering and old stone. You kneel before Vivec\'s golden effigy and feel something vast and alien briefly turn its attention toward you — not unkind, but enormous. You leave lighter, somehow. Cleaner.',
        stat_deltas: { purity: 15, stress: -15, willpower: 8, corruption: -5 },
      },
      {
        id: 'vivec_steal_merchants',
        label: 'Steal from the Foreign Quarter market',
        intent: 'stealth',
        outcome: 'The Foreign Quarter is chaos — perfect for a skilled hand. You lift a fat purse from an Altmer merchant too busy arguing with a customs official to notice your casual brush past his hip.',
        skill_check: { stat: 'skulduggery', difficulty: 55 },
        stat_deltas: { corruption: 8, purity: -5 },
        new_items: [{ id: 'septim', name: 'Gold Septim', quantity: 20 }, { id: 'soul_gem', name: 'Soul Gem', quantity: 1 }],
        fail_outcome: 'A Temple guard\'s hand catches your wrist before it clears the merchant\'s belt. The resulting scene draws a crowd. You escape with your skin but not your dignity, and the Ordinators will remember your face.',
        fail_stat_deltas: { stress: 20, purity: -10, stamina: -10 },
      },
      {
        id: 'vivec_join_temple',
        label: 'Petition to join the Tribunal Temple',
        intent: 'social',
        outcome: 'The Temple examiner questions you for over an hour — doctrine, devotion, and your understanding of the Three. Your willpower holds under their penetrating scrutiny, and you are handed a novice\'s medallion.',
        skill_check: { stat: 'willpower', difficulty: 60 },
        stat_deltas: { purity: 20, willpower: 10, stress: -10, corruption: -5 },
        fail_outcome: 'The examiner finds your knowledge of the Tribunal wanting and your moral character questionable. You are turned away with barely concealed disdain.',
        fail_stat_deltas: { stress: 15, purity: -5 },
      },
      {
        id: 'vivec_foreign_quarter',
        label: 'Explore the Foreign Quarter',
        intent: 'neutral',
        outcome: 'The Foreign Quarter is where outlanders cluster, run their businesses, and try not to insult the Dunmer too overtly. You find information, rumors, and a surprisingly decent kwama egg stew.',
        stat_deltas: { stress: -8, health: 5, stamina: -5 },
      },
      {
        id: 'vivec_travel_ghostgate',
        label: 'Travel north to Ghostgate',
        intent: 'travel',
        outcome: 'The road to Ghostgate passes through increasingly blighted landscape as Red Mountain\'s corrupting influence seeps south. By the time the great barrier wall appears, the sky has turned an ugly amber and Blighted creatures are visible on the ashen plain.',
        stat_deltas: { stamina: -20, health: -5, stress: 15, corruption: 5 },
        new_location: 'ghostgate',
      },
    ],
  },

  ghostgate: {
    id: 'ghostgate',
    name: 'Ghostgate',
    province: 'Morrowind',
    atmosphere: 'Blight-storm amber sky, the constant grinding of Red Mountain\'s presence, ordinator patrols on ancient walls.',
    danger: 70,
    x: 35,
    y: 52,
    npcs: ['serjo_godes_alvela'],
    description: 'Ghostgate is the great barrier across the Ghostfence — the vast magical ward maintaining Dagoth Ur\'s prison around Red Mountain. Twin towers flank an enormous gate through which no sane person willingly passes. The Tribunal Temple stations its most devoted Ordinators here, hardened men and women who have spent years watching the Blight-twisted creatures that test the fence and listening to the distant grinding sorrow of a corrupted god. Blight storms roll in from the north without warning, carrying disease and despair on ash-grey winds.',
    actions: [
      {
        id: 'ghostgate_patrol',
        label: 'Patrol the Ghostfence walls',
        intent: 'work',
        outcome: 'You walk the long wall with a pair of Ordinator veterans who say little. The view of Red Mountain\'s ashen caldera is awe-inspiring and deeply wrong — a sickness in the land made visible. Your stamina flags by nightfall but the Ordinators respect your endurance.',
        skill_check: { stat: 'stamina', difficulty: 60 },
        stat_deltas: { stamina: -20, health: -5, stress: 15, corruption: 8 },
        new_items: [{ id: 'septim', name: 'Gold Septim', quantity: 15 }],
        fail_outcome: 'The Blight-wind finds a gap in your scarf and you breathe ash for three hours. By the end of the patrol you are wheezing, dehydrated, and the Ordinators regard you with thin contempt.',
        fail_stat_deltas: { health: -15, stamina: -25, stress: 20, corruption: 12 },
      },
      {
        id: 'ghostgate_enter_ruins',
        label: 'Enter the Red Mountain ruins',
        intent: 'stealth',
        outcome: 'Past the gate the world becomes something else entirely. The ash is alive with wrong sounds and the ruins of ancient Velothi towers groan under pressures you cannot see. You find fragments of a Sixth House shrine before pure fear drives you back.',
        stat_deltas: { health: -15, stamina: -20, corruption: 20, stress: 25, willpower: -10 },
        new_items: [{ id: 'daedric_amulet', name: 'Daedric Amulet', quantity: 1 }],
      },
      {
        id: 'ghostgate_flee_vivec',
        label: 'Flee back toward Vivec City',
        intent: 'flee',
        outcome: 'You turn your back on Red Mountain and walk fast and hard south. The amber light gradually fades from the sky and your breathing eases. Vivec\'s distant cantons glitter on the horizon like a promise.',
        stat_deltas: { stamina: -15, stress: -10 },
        new_location: 'vivec_city',
      },
      {
        id: 'ghostgate_tribunal_commune',
        label: 'Commune with the Tribunal spirit shrine',
        intent: 'neutral',
        outcome: 'The shrine in the gatehouse emanates a cold divine pressure. You press your palm to the stone and something immense looks at you — Almalexia\'s aspect, perhaps, or a fragment of her attention filtered through centuries of devotion. The experience leaves you shaken and oddly fortified.',
        stat_deltas: { willpower: 12, purity: 10, stress: 10, corruption: -8 },
      },
    ],
  },

  riften: {
    id: 'riften',
    name: 'Riften',
    province: 'Skyrim',
    atmosphere: 'Rotting dock-planks over a canal, mead-hall smoke, the ever-present sense of being watched and evaluated.',
    danger: 55,
    x: 72,
    y: 38,
    npcs: ['brynjolf', 'ungrien', 'ingun_black_briar', 'madesi'],
    description: 'Riften crouches at the edge of Lake Honrich in southeastern Skyrim, a city that smells of fish, mead, and quiet desperation. The Thieves Guild runs the city from the shadows with the Black-Briar family as their public face, and corruption seeps through every level of civic life like water through old wood. The covered market canal provides excellent pickpocketing opportunities. Beneath it all, beneath the city itself, the Ratway festers — a labyrinth of sewer tunnels where the truly desperate make their homes.',
    actions: [
      {
        id: 'riften_bee_barb',
        label: 'Work at the Bee & Barb tavern',
        intent: 'work',
        outcome: 'Keerava runs a tight establishment. You spend the evening hauling mead casks, cleaning tables, and deflecting the wandering hands of off-duty guards. The coin is good and a regular tips you a folded note with a Thieves Guild mark.',
        stat_deltas: { stamina: -10, stress: -5, hygiene: -8 },
        new_items: [{ id: 'septim', name: 'Gold Septim', quantity: 18 }],
      },
      {
        id: 'riften_pickpocket',
        label: 'Work the marketplace crowd',
        intent: 'stealth',
        outcome: 'The covered market is busy enough to work in. You brush through the crowd with practiced ease, lifting coin purses from a wool merchant, a visiting Khajiit trader, and an inattentive city guardsman.',
        skill_check: { stat: 'skulduggery', difficulty: 50 },
        stat_deltas: { stamina: -8, corruption: 8, purity: -5 },
        new_items: [{ id: 'septim', name: 'Gold Septim', quantity: 25 }],
        fail_outcome: 'The guardsman\'s hand snaps around your wrist with the reflexes of someone who has caught a hundred pickpockets. The subsequent arrest and fine eats your afternoon and most of your dignity.',
        fail_stat_deltas: { stress: 20, stamina: -15, purity: -10 },
      },
      {
        id: 'riften_enter_ratway',
        label: 'Enter the Ratway',
        intent: 'stealth',
        outcome: 'The hatch in the canal floor leads to a world of dripping stone and old violence. Something scurries away as you descend. The Ratway is more dangerous than it is navigable, and navigating it is already nearly impossible.',
        stat_deltas: { health: -8, stress: 15, stamina: -10 },
        new_location: 'ratway',
      },
      {
        id: 'riften_thieves_guild',
        label: 'Approach Brynjolf about the Thieves Guild',
        intent: 'social',
        outcome: 'Brynjolf watches you across the market with those dark Dunmer eyes and the particular expression of someone tallying your value before you open your mouth. He sets you a small test of skulduggery. You pass it, and he nods toward the Ratway with a slight smile.',
        skill_check: { stat: 'skulduggery', difficulty: 55 },
        stat_deltas: { corruption: 10, stress: 5 },
        fail_outcome: 'Brynjolf watches your fumbled attempt with polite contempt. "Not yet," he says, and turns away. You\'ll need more practice.',
        fail_stat_deltas: { stress: 12 },
      },
      {
        id: 'riften_travel_windhelm',
        label: 'Travel north to Windhelm',
        intent: 'travel',
        outcome: 'You take the northern road out of Riften, following the White River toward Windhelm. The weather turns cold and hostile within two hours. Windhelm\'s ancient dark walls appear on the horizon by late afternoon.',
        stat_deltas: { stamina: -20, health: -5, stress: 8 },
        new_location: 'windhelm',
      },
    ],
  },

  ratway: {
    id: 'ratway',
    name: 'The Ratway',
    province: 'Skyrim',
    atmosphere: 'Dripping stone tunnels, distant screams muffled by water, the smell of rot and something worse.',
    danger: 75,
    x: 72,
    y: 40,
    npcs: ['dirge'],
    description: 'The Ratway is the sewer labyrinth beneath Riften, a world of collapsed arches, flooded passages, and improvised camps where the city\'s forgotten make their last stands. Murderers who couldn\'t be proved upon in court, Guild members who failed their last contract, outlanders who arrived in Riften with nothing and found nothing waiting for them — they all end up here eventually. The deeper passages connect to a surprisingly sophisticated Thieves Guild headquarters, if you know which door not to die behind.',
    actions: [
      {
        id: 'ratway_scavenge',
        label: 'Scavenge for ingredients',
        intent: 'neutral',
        outcome: 'The Ratway\'s damp walls grow useful things — alchemical fungi, troll fat residue on old bones, ingredients that polite alchemists wouldn\'t ask too many questions about. You collect what you can stomach handling.',
        stat_deltas: { health: -5, stress: 8, stamina: -10, hygiene: -15 },
        new_items: [{ id: 'hackle_lo_berries', name: 'Hackle-Lo Berries', quantity: 2 }],
      },
      {
        id: 'ratway_ambush',
        label: 'Ambush travelers in the dark',
        intent: 'aggressive',
        outcome: 'You wait in a collapsed arch and take down a lost merchant who had no business being this far in. His purse is heavier than expected and his terror was, if you\'re honest with yourself, satisfying in a way that troubles you.',
        stat_deltas: { corruption: 15, purity: -15, stamina: -8 },
        new_items: [{ id: 'septim', name: 'Gold Septim', quantity: 22 }, { id: 'iron_shortsword', name: 'Iron Shortsword', quantity: 1 }],
      },
      {
        id: 'ratway_hide_guards',
        label: 'Hide from a patrol',
        intent: 'stealth',
        outcome: 'City guards occasionally sweep the upper Ratway levels with torches and a great deal of noise. You tuck into a crevice and hold your breath while armored boots splash past six feet away.',
        skill_check: { stat: 'skulduggery', difficulty: 40 },
        stat_deltas: { stamina: -5, stress: 8 },
        fail_outcome: 'A torch swings directly at your hiding spot. The guard hauls you out and you only escape a cell by running faster than he can follow through the twisting passages.',
        fail_stat_deltas: { health: -8, stamina: -15, stress: 20 },
      },
      {
        id: 'ratway_secret_passage',
        label: 'Search for the Guild entrance',
        intent: 'stealth',
        outcome: 'Behind a false wall of crumbling plaster you find the mark — a small carved Guild symbol, barely visible. The door beyond opens into a world considerably better lit and significantly more dangerous than the Ratway above.',
        skill_check: { stat: 'skulduggery', difficulty: 60 },
        stat_deltas: { stamina: -8 },
        fail_outcome: 'The walls of the Ratway stare back at you, offering nothing. The passage is either better hidden than you thought or the stories were wrong.',
        fail_stat_deltas: { stress: 10, stamina: -5 },
      },
      {
        id: 'ratway_travel_riften',
        label: 'Climb back up to Riften',
        intent: 'travel',
        outcome: 'You navigate back through the dripping tunnels to the hatch, hauling yourself up into the comparative brightness of Riften\'s canal district. You will need a bath.',
        stat_deltas: { stamina: -8, hygiene: -10 },
        new_location: 'riften',
      },
    ],
  },

  windhelm: {
    id: 'windhelm',
    name: 'Windhelm',
    province: 'Skyrim',
    atmosphere: 'Ancient dark stone against constant snow, Stormcloak guards, the smell of tallow and old stone.',
    danger: 40,
    x: 68,
    y: 22,
    npcs: ['aerin'],
    description: 'Windhelm is the oldest city in Skyrim, seat of the ancient Nordic Jarls and now capital of Ulfric Stormcloak\'s rebellion. Its grey stone walls are thick enough to resist siege and cold alike, and the streets are laid out in the manner of an ancient Nordic city — broad main roads feeding into narrow service alleys where the wind cuts like a blade. The Gray Quarter houses Windhelm\'s Dunmer population in barely concealed contempt, crammed into deteriorating buildings near the docks while Nordic citizens occupy the better districts.',
    actions: [
      {
        id: 'windhelm_docks_work',
        label: 'Work the Windhelm docks',
        intent: 'work',
        outcome: 'The dock master assigns you to unloading fish barrels from a vessel just in from Solstheim. The work is brutal in the cold — your fingers numb by mid-morning — but the dock workers are decent company and share their lunch mead without being asked.',
        stat_deltas: { stamina: -15, health: -3, hygiene: -8, stress: -5 },
        new_items: [{ id: 'septim', name: 'Gold Septim', quantity: 14 }],
      },
      {
        id: 'windhelm_gray_quarter',
        label: 'Walk through the Gray Quarter',
        intent: 'neutral',
        outcome: 'The Gray Quarter reeks of despair and the guttering candles of Dunmer shrines. Dark elf residents move with the particular wariness of people who have learned to take up as little space as possible. A Dunmer grandmother offers you a cup of sujamma and the kind of conversation that happens when there\'s nothing left to lose.',
        stat_deltas: { stress: -8, corruption: 3, purity: 3 },
        new_items: [{ id: 'sujamma', name: 'Sujamma', quantity: 1 }],
      },
      {
        id: 'windhelm_candlehearth',
        label: 'Visit Candlehearth Hall',
        intent: 'social',
        outcome: 'Elda Early-Dawn runs a tight Nord establishment — good mead, suspicious of outlanders, full of Stormcloak soldiers on leave nursing grievances. You listen more than you speak and learn the shape of the rebellion\'s morale.',
        stat_deltas: { stress: -12, stamina: -5, willpower: 3 },
      },
      {
        id: 'windhelm_travel_kynesgrove',
        label: 'Travel to Kynesgrove',
        intent: 'travel',
        outcome: 'The road south to Kynesgrove passes through frozen marshland and sparse pine forest. The village, when you reach it, is barely worth the description — a mine, an inn, and cold.',
        stat_deltas: { stamina: -15, health: -5, stress: 5 },
        new_location: 'whiterun',
      },
    ],
  },

  whiterun: {
    id: 'whiterun',
    name: 'Whiterun',
    province: 'Skyrim',
    atmosphere: 'Open tundra wind, the warmth of mead-halls, commerce and the distant howl of something enormous.',
    danger: 25,
    x: 52,
    y: 35,
    npcs: ['hulda', 'argis_the_bulwark'],
    description: 'Whiterun sits on a rocky promontory above the plains of Whiterun Hold, the trading and administrative heart of Skyrim. Three distinct districts climb the rock toward Dragonsreach at the summit: Whiterun\'s great Jarl\'s longhouse, a structure of ancient Nordic ambition. The marketplace at the city\'s gate is always busy regardless of the political situation. The Companions — Skyrim\'s legendary warriors\' guild — operate from Jorrvaskr, a great overturned ship-hall at the city\'s heart. Whatever is happening elsewhere in Skyrim, Whiterun remains open for business.',
    actions: [
      {
        id: 'whiterun_companions',
        label: 'Work for the Companions',
        intent: 'work',
        outcome: 'The Companions taskboard has a standing bounty on cave trolls near Helgen and a request for help with a wolf problem outside Rorikstead. You take the wolf contract and spend the afternoon on the tundra, returning successful and considerably colder.',
        stat_deltas: { health: -8, stamina: -20, stress: 5 },
        new_items: [{ id: 'septim', name: 'Gold Septim', quantity: 30 }],
      },
      {
        id: 'whiterun_gildergreen',
        label: 'Sit beneath the Gildergreen',
        intent: 'neutral',
        outcome: 'The great Gildergreen tree stands in Whiterun\'s Wind District, ancient and immense. Sitting beneath it while the tundra wind passes through its branches has the quality of a benediction. You feel genuinely at peace for a brief and precious time.',
        stat_deltas: { stress: -20, purity: 8, health: 5, willpower: 5 },
      },
      {
        id: 'whiterun_sell_goods',
        label: 'Sell goods at the market',
        intent: 'social',
        outcome: 'Belethor\'s General Goods and the open-air market stalls move most things without too many questions. You clear your pack of unwanted weight and turn a reasonable profit.',
        stat_deltas: { stamina: -5, stress: -5 },
        new_items: [{ id: 'septim', name: 'Gold Septim', quantity: 10 }],
      },
      {
        id: 'whiterun_jarls_longhouse',
        label: 'Visit Jarl Balgruuf\'s longhouse',
        intent: 'social',
        outcome: 'Dragonsreach is imposing even for those familiar with Nord architecture — great carved beams and a captured dragon skull at the entrance. The Jarl\'s steward eyes you with bureaucratic suspicion but allows an audience with a court wizard who pays well for alchemical ingredients.',
        stat_deltas: { stress: 5, willpower: 5 },
        new_items: [{ id: 'septim', name: 'Gold Septim', quantity: 8 }],
      },
      {
        id: 'whiterun_travel_riverwood',
        label: 'Travel south to Riverwood',
        intent: 'travel',
        outcome: 'The road to Riverwood follows the White River downstream through pine forest. The village is small and welcoming, and from there, paths split toward Falkreath and the border with Cyrodiil.',
        stat_deltas: { stamina: -10, stress: -3 },
        new_location: 'anvil_docks',
      },
    ],
  },

  anvil_docks: {
    id: 'anvil_docks',
    name: 'Anvil Docks',
    province: 'Cyrodiil',
    atmosphere: 'Salt wind off the Abecean Sea, gulls, the rattle of rigging and the noise of commerce.',
    danger: 35,
    x: 40,
    y: 68,
    npcs: ['arrille'],
    description: 'Anvil sits at the westernmost point of the Gold Coast on the Abecean Sea, its harbor one of the busiest in Cyrodiil. The dockside district is a working waterfront — fish stalls, rope merchants, sail-makers, and the Flowing Bowl tavern that caters to sailors of every race and reputation. The city proper is a pleasant Imperial coastal town, but the docks are their own world: rough, profitable, and only loosely attached to Imperial law. Khajiit trade caravans from Elsweyr offload moon sugar and silk here, carefully, and ships departing for Hammerfell or the Summerset Isles board passengers without excessive documentation.',
    actions: [
      {
        id: 'anvil_fish_work',
        label: 'Work sorting fish at the docks',
        intent: 'work',
        outcome: 'Dawn to mid-afternoon on the docks, sorting the night catch by size and species, packing salt-barrels, hauling ice from the cold-house. The dock-master is a retired Argonian sailor who pays fairly and without ceremony.',
        stat_deltas: { stamina: -15, health: -3, hygiene: -15, stress: 3 },
        new_items: [{ id: 'septim', name: 'Gold Septim', quantity: 12 }],
      },
      {
        id: 'anvil_flowing_bowl',
        label: 'Visit the Flowing Bowl tavern',
        intent: 'social',
        outcome: 'The Flowing Bowl is exactly what its name suggests — dark, loud, and extremely liquid in its social categories. You drink with a Khajiit caravan guard, a Redguard navigator, and a very drunk Altmer who appears to have made some life choices he is regretting.',
        stat_deltas: { stress: -15, stamina: -8, willpower: -5, seduction: 2 },
      },
      {
        id: 'anvil_pickpocket_sailors',
        label: 'Pickpocket the harbor crowd',
        intent: 'stealth',
        outcome: 'Dockworkers and sailors are often drunk, distracted, or both. You move through the crowd with practiced lightness and come away with a pleasingly heavy purse.',
        skill_check: { stat: 'skulduggery', difficulty: 40 },
        stat_deltas: { corruption: 5 },
        new_items: [{ id: 'septim', name: 'Gold Septim', quantity: 18 }],
        fail_outcome: 'The sailor you target turns out to be a retired Legionnaire with the reflexes of someone who has spent thirty years watching for trouble. Your wrist is nearly broken before you twist free.',
        fail_stat_deltas: { health: -10, stress: 15, stamina: -10 },
      },
      {
        id: 'anvil_swim_harbor',
        label: 'Swim the harbor',
        intent: 'neutral',
        outcome: 'The Abecean Sea is warmer than Morrowind\'s Inner Sea and significantly warmer than anything in Skyrim. You swim out past the moored vessels and float on your back, looking at the sky. You find a dropped anchor-chain with an interesting attachment.',
        skill_check: { stat: 'swimming', difficulty: 30 },
        stat_deltas: { health: 8, stress: -15, stamina: -10, hygiene: 20 },
        new_items: [{ id: 'ebony_ore', name: 'Ebony Ore', quantity: 1 }],
        fail_outcome: 'The harbor current is stronger than expected and a passing trading vessel\'s wake nearly swamps you. You pull yourself out onto a dock ladder, exhausted and embarrassed.',
        fail_stat_deltas: { health: -8, stamina: -20, stress: 12 },
      },
      {
        id: 'anvil_travel_imperial_city',
        label: 'Travel east to the Imperial City',
        intent: 'travel',
        outcome: 'The Gold Road runs east from Anvil along the Niben Bay coast. The journey takes two days of steady walking, through increasingly populated farmland, until the white towers of the Imperial City rise from their island in Lake Rumare.',
        stat_deltas: { stamina: -22, health: -5, stress: 5 },
        new_location: 'imperial_city_market',
      },
    ],
  },

  imperial_city_market: {
    id: 'imperial_city_market',
    name: 'Imperial City Market District',
    province: 'Cyrodiil',
    atmosphere: 'Marble and money, the roar of the Arena crowd, the scent of exotic goods from every corner of Tamriel.',
    danger: 30,
    x: 50,
    y: 60,
    npcs: ['caius_cosades'],
    description: 'The Imperial City rises from its island in Lake Rumare at the heart of Cyrodiil and by extension the heart of Tamriel\'s power. The Market District is the beating commercial heart of the city — shops ranging from common goods to the finest enchanted equipment, the offices of the Black Horse Courier newspaper, and the ever-popular Arena where citizens wager fortunes on gladiatorial combat. The White-Gold Tower is visible from everywhere in the city, a structure so ancient and strange that even Imperial architects hedge their explanations for how it was built.',
    actions: [
      {
        id: 'imperial_market_work',
        label: 'Work a merchant stall',
        intent: 'work',
        outcome: 'Merchant work in the Market District pays well for presentable individuals who can haggle. You spend the day selling an Altmer jeweler\'s wares to tourists and minor nobles, learning the rhythms of Imperial commerce.',
        stat_deltas: { stamina: -10, stress: -5, school_grades: 3 },
        new_items: [{ id: 'septim', name: 'Gold Septim', quantity: 20 }],
      },
      {
        id: 'imperial_arena_bet',
        label: 'Visit the Arena and place bets',
        intent: 'social',
        outcome: 'The Arena crowd is a cross-section of every citizen class, bound together by bloodlust and the possibility of easy coin. You study the odds, back the Khajiit blade-dancer against the Orsimer, and win handsomely on a technical knockout in the third exchange.',
        stat_deltas: { stress: -10, corruption: 5, stamina: -5 },
        new_items: [{ id: 'septim', name: 'Gold Septim', quantity: 35 }],
      },
      {
        id: 'imperial_courier',
        label: 'Browse the Black Horse Courier',
        intent: 'neutral',
        outcome: 'The Courier\'s board has notices pinned three deep — bounties, trade offers, missing persons, and an alarming number of pamphlets about Daedric cultist activity near the Ayleid ruins east of the city. You read until you know more than is probably good for you.',
        stat_deltas: { stress: 5, willpower: 3, school_grades: 5 },
      },
      {
        id: 'imperial_travel_elven_gardens',
        label: 'Travel to the Elven Gardens District',
        intent: 'travel',
        outcome: 'The Elven Gardens District is quieter than the Market — high walls, private gardens, and the residences of Imperial nobles and successful merchants. The Oblivion Crisis left some buildings still abandoned, their windows dark.',
        stat_deltas: { stamina: -5, stress: -5 },
        new_location: 'oblivion_gate_ruin',
      },
      {
        id: 'imperial_travel_anvil',
        label: 'Travel west on the Gold Road',
        intent: 'travel',
        outcome: 'You take the western gate and follow the Gold Road back toward Anvil and the sea. The road is well-maintained and heavily patrolled by Imperial Legion units.',
        stat_deltas: { stamina: -20, stress: 3 },
        new_location: 'anvil_docks',
      },
    ],
  },

  blackwood_marsh: {
    id: 'blackwood_marsh',
    name: 'Blackwood Marsh',
    province: 'Black Marsh (Argonia)',
    atmosphere: 'Infinite standing water, the subsonic hum of the Hist network, bioluminescent fungi in the dark.',
    danger: 65,
    x: 60,
    y: 80,
    npcs: ['sable'],
    description: 'Blackwood is the borderland where Cyrodiil bleeds into Black Marsh, a vast wetland ecosystem of infinite complexity and genuine hostility to outsiders. The Hist trees stand like drugged sentinels in the warm shallow water, their roots networked through hundreds of miles of marsh, their sap traded as a sacred substance. Non-Argonians rarely navigate more than a few miles before becoming hopelessly lost. The creatures that live here are thoroughly adapted to killing things that don\'t belong, and the deeper you go, the less the rules of the surface world seem to apply.',
    actions: [
      {
        id: 'blackwood_hist_sap',
        label: 'Gather hist sap',
        intent: 'work',
        outcome: 'The Hist tree you find stands alone in a shallow pool, its bark weeping luminescent amber sap with a sweetness that makes your teeth ache. Gathering requires patience and the specific permission of standing very still while the tree evaluates whether you are worth feeding.',
        stat_deltas: { health: 5, stamina: -10, corruption: 8, stress: 5 },
        new_items: [{ id: 'hist_sap', name: 'Hist Sap', quantity: 2 }],
      },
      {
        id: 'blackwood_swim_deep',
        label: 'Swim in the deep marsh channels',
        intent: 'neutral',
        outcome: 'The deep channels of Blackwood run dark and warm. You swim through submerged root-tangles and find a sunken Ayleid ruin only barely visible beneath the growth. Something large passes beneath you with sinuous, unhurried purpose.',
        skill_check: { stat: 'swimming', difficulty: 55 },
        stat_deltas: { health: 5, stamina: -15, corruption: 5 },
        new_items: [{ id: 'soul_gem', name: 'Soul Gem', quantity: 1 }],
        fail_outcome: 'The current takes you and the root tangles close around your legs. You surface gasping forty yards from where you entered, missing one boot and with no clear memory of the last two minutes.',
        fail_stat_deltas: { health: -15, stamina: -25, stress: 20, hallucination: 10 },
      },
      {
        id: 'blackwood_commune_hist',
        label: 'Commune with a Hist tree',
        intent: 'neutral',
        outcome: 'You press your palm to the Hist bark and the sap moves toward your touch. The contact is overwhelming — centuries of collective memory washing through you, Argonian births and deaths and the long patient thought of an alien intelligence. You are not Saxhleel and it knows this, but it allows the contact.',
        stat_deltas: { corruption: 15, willpower: 10, hallucination: 15, stress: -10, purity: -5 },
      },
      {
        id: 'blackwood_flee_gideon',
        label: 'Flee toward Gideon',
        intent: 'flee',
        outcome: 'You navigate by the sun and by desperate instinct toward the Ayleid ruins marking Gideon\'s position on the marsh edge. The journey takes hours and you arrive at the small border town covered in marsh mud and overwhelmingly relieved.',
        stat_deltas: { stamina: -25, health: -8, stress: 15 },
        new_location: 'imperial_city_market',
      },
      {
        id: 'blackwood_blood_horkers',
        label: 'Avoid the Blood Horker camp',
        intent: 'stealth',
        outcome: 'A Blood Horker pirate camp has been established on a dry hammock deep in the marsh — slavers using the wetlands as a staging area. You circle wide around their firelight and their noise, staying in the cold water up to your waist.',
        skill_check: { stat: 'skulduggery', difficulty: 50 },
        stat_deltas: { stamina: -15, health: -5 },
        fail_outcome: 'A Blood Horker sentry catches your silhouette against the bioluminescence and raises the alarm. You run through knee-deep water for what feels like hours before the sounds of pursuit fade.',
        fail_stat_deltas: { health: -15, stamina: -25, stress: 20 },
      },
    ],
  },

  oblivion_gate_ruin: {
    id: 'oblivion_gate_ruin',
    name: 'Oblivion Gate Ruin',
    province: 'Cyrodiil',
    atmosphere: 'Scorched earth, the residual wrongness of a place that was briefly elsewhere, twisted sigil-stone fragments.',
    danger: 90,
    x: 55,
    y: 58,
    npcs: [],
    description: 'The Oblivion Crisis left scars across Tamriel that have not fully healed in the decades since, and this collapsed gate ruin near the Imperial City is one of the worst. The gate itself is gone — closed at great cost — but the ground where it stood is still wrong: the soil won\'t grow anything, the air tastes of copper and distant fire, and creatures of Oblivion occasionally phase through what remains of the sigil stone\'s resonance, confused and violent. Archaeologists and Daedra worshippers visit for different reasons and with roughly equal life expectancies.',
    actions: [
      {
        id: 'oblivion_scavenge_artifacts',
        label: 'Scavenge for daedra artifacts',
        intent: 'stealth',
        outcome: 'Picking through the ruin\'s edge with your willpower clamped down hard against the resonance, you find fragments of daedric architecture: a broken shard of heartstone, a scrap of Daedric script, and something that might be a minor sigil fragment.',
        skill_check: { stat: 'willpower', difficulty: 65 },
        stat_deltas: { health: -5, corruption: 15, willpower: -5 },
        new_items: [{ id: 'daedric_amulet', name: 'Daedric Amulet', quantity: 1 }, { id: 'soul_gem', name: 'Soul Gem', quantity: 1 }],
        fail_outcome: 'The resonance catches you mid-search — a wave of wrongness that passes through your thoughts like a hand through water. You come to yourself twenty feet from where you started, shaking, with no memory of the last few minutes.',
        fail_stat_deltas: { health: -15, willpower: -15, corruption: 20, hallucination: 20, stress: 25 },
      },
      {
        id: 'oblivion_sigil_commune',
        label: 'Touch the sigil stone remnant',
        intent: 'neutral',
        outcome: 'The sigil stone remnant is still warm despite the cold air. Contact is an immediate torrent of Daedric sensation — you experience three seconds of what it feels like to be standing in Mehrunes Dagon\'s realm. You pull away. You are more corrupted than you were. But also, somehow, clearer.',
        stat_deltas: { corruption: 25, willpower: 15, purity: -20, hallucination: 15, health: -10 },
      },
      {
        id: 'oblivion_flee',
        label: 'Flee immediately',
        intent: 'flee',
        outcome: 'The only sensible action. You leave the ruin at speed and don\'t slow down until you can no longer smell copper in the air. A mile down the road your hands stop shaking.',
        stat_deltas: { stamina: -15, stress: -5, corruption: -2 },
        new_location: 'imperial_city_market',
      },
    ],
  },
};

// ---------------------------------------------------------------------------
// NPCS
// ---------------------------------------------------------------------------

export const TAMRIEL_NPCS: Record<string, NpcData> = {
  arrille: {
    id: 'arrille',
    name: 'Arrille',
    race: 'altmer',
    relationship: 5,
    description: 'Arrille is an Altmer trader who operates the only general store in Seyda Neen — a place of quiet competence amid the customs village\'s damp mediocrity. He is neither warm nor hostile, but professional in the specific way of mer who have spent decades dealing with desperate outlanders and have stopped being surprised by any of it. His prices are fair. His patience is finite.',
    responses: {
      social: {
        narrative_text: 'Arrille looks up from his stock-taking with the unhurried attention of someone who has learned to read desperation at a glance. "I have what you need, or I don\'t," he says. "Either way, coin is the conversation." But there\'s something almost approving in how he appraises your bearing — a fellow professional, perhaps.',
        stat_deltas: { stress: -5, stamina: -2 },
      },
      work: {
        narrative_text: 'Arrille considers you for a long moment. "I could use someone to inventory the Silt Strider cargo that arrived this morning. Don\'t touch the moon-sugar crate. Don\'t touch it, don\'t count it, don\'t look at it too long." He pays what he promises and not a drake more.',
        stat_deltas: { stamina: -8, stress: 3 },
      },
      aggressive: {
        narrative_text: 'Arrille\'s hand goes beneath the counter with the speed of someone who has been robbed before and made preparations. "S\'wit," he says, pleasantly. "There\'s a Legion garrison twenty feet from this door and I\'ve been here longer than you\'ve been alive. Make a different choice."',
        stat_deltas: { health: -5, stress: 15, corruption: 5 },
      },
    },
  },

  jiub: {
    id: 'jiub',
    name: 'Jiub',
    race: 'dunmer',
    relationship: 15,
    description: 'Jiub has the haunted, watchful quality of a Dunmer who has seen the inside of an Imperial prison cell and carries the specific damage that such an experience leaves behind. His red eyes are quick and his silences are louder than most people\'s conversations. He was freed from the same transport that brought outlanders to Seyda Neen and hasn\'t decided yet what to do with his freedom. He becomes, unexpectedly, a friend — the kind that tells you things you need to hear even when you don\'t want to.',
    responses: {
      social: {
        narrative_text: 'Jiub regards you from beneath his hood with an expression that\'s mostly wariness but has a thin vein of genuine curiosity. "Another outlander washing up in Seyda Neen," he says. "The Empire exports its problems here, did you know that?" He offers his flask without being asked. It\'s surprisingly good sujamma.',
        stat_deltas: { stress: -10, stamina: -3, purity: 3 },
      },
      work: {
        narrative_text: '"Work?" Jiub gives a hollow laugh. "I\'ve been working on getting out of Morrowind for the last week. If you help me with that, I\'ll help you with whatever you need." He means it. His gratitude, once given, is absolute.',
        stat_deltas: { stamina: -10, stress: -5 },
      },
      aggressive: {
        narrative_text: 'Jiub doesn\'t move, doesn\'t flinch, just watches you with those ember eyes until you\'re finished. "I\'ve been through worse than you," he says quietly. "Whatever you\'re trying to prove, I already know the answer." His calm is more unsettling than anger would have been.',
        stat_deltas: { stress: 10, corruption: 3, purity: -3 },
      },
    },
  },

  caius_cosades: {
    id: 'caius_cosades',
    name: 'Caius Cosades',
    race: 'bosmer',
    relationship: 0,
    description: 'Caius appears to be an unremarkable, slightly seedy Bosmer who lives in a middling house in Balmora and has a notable skooma habit — which is, of course, precisely the cover a senior agent of the Emperor\'s Blades is supposed to maintain. Behind the watery eyes and careful inattention is one of the most capable intelligence officers in the Imperial network, a person who survives specifically by being consistently underestimated.',
    responses: {
      social: {
        narrative_text: '"Come in and shut the door," Caius says, not looking up from whatever he\'s reading. The house smells of skooma and old leather and something medicinal. When he finally raises his eyes the performance of vagueness drops entirely and you are looking at a very dangerous Bosmer intelligence. "Now then," he says. "Tell me everything."',
        stat_deltas: { stress: 5, willpower: 5 },
      },
      work: {
        narrative_text: 'Caius has a job, and the job is not what it appears. He describes it in three sentences that each contain at least two lies, and you are reasonably sure by the end that you\'ve volunteered for something significantly more dangerous than he\'s implied. He pays upfront. The Blades always pay upfront.',
        stat_deltas: { stamina: -15, health: -5, corruption: 5 },
      },
      aggressive: {
        narrative_text: '"Son," Caius says, and he says it with the tired patience of a man who has ended lives more dramatic than this one, "I am the most connected person in this city and you have just made the most expensive decision of your morning." He doesn\'t reach for a weapon. He doesn\'t need to.',
        stat_deltas: { health: -10, stress: 20, willpower: -10 },
      },
    },
  },

  sugar_lips_habasi: {
    id: 'sugar_lips_habasi',
    name: 'Sugar-Lips Habasi',
    race: 'khajiit',
    relationship: -5,
    description: 'Sugar-Lips Habasi runs the South Wall Cornerclub in Balmora as a front for the local Thieves Guild operation, and she does it with the kind of cheerful menace that makes you remember she chose the name herself. She is silk and claws in equal measure — warm to those who are useful, coldly efficient with those who aren\'t, and absolutely immune to sentiment when business requires a different approach.',
    responses: {
      social: {
        narrative_text: 'Sugar-Lips stretches with feline satisfaction and fixes you with amber eyes that are calculating the weight of your purse. "This one is always pleased to meet new friends," she says, and the word \'friends\' has a very specific meaning in her voice. "What is it you require? Habasi may know where to find it. For the right arrangement."',
        stat_deltas: { stress: -5, corruption: 5, seduction: 3 },
      },
      work: {
        narrative_text: '"Work?" A slow blink. "There is always work for someone with quick hands and slow questions. South Wall does not ask where you learned your trade, outlander. Only whether you can do it." She names a percentage and it is non-negotiable and you both know it.',
        stat_deltas: { stamina: -12, corruption: 8 },
      },
      aggressive: {
        narrative_text: 'The smile doesn\'t move. That\'s the frightening part — it stays exactly where it was, while every other piece of her body language communicates that you have made a serious miscalculation. "Sweetling," Habasi says softly, "the Guild was handling problems like you before your grandmother was born. Shall we discuss terms?"',
        stat_deltas: { health: -12, stress: 18, corruption: 8 },
      },
    },
  },

  vivec: {
    id: 'vivec',
    name: 'Vivec',
    race: 'dunmer',
    relationship: 0,
    description: 'Vivec is a god — one of the three living Tribunal deities, warrior and poet and murderer and protector and monster and saint all at once, a being of such complexity and contradiction that proximity to him causes a physical sensation like standing too close to a lightning strike. He appears as an androgynous Dunmer of impossible beauty and presence, his skin gold and blue in impossible equal measure. An audience with Vivec is an event so rare and so unlikely that most residents of Vivec City will never experience it, and those who do rarely come away unchanged.',
    responses: {
      social: {
        narrative_text: 'Vivec regards you with eyes that contain multitudes you have no language for. When he speaks, the words arrive as meaning rather than sound, bypassing your ears entirely. "Little mortal," he says, or something that translates roughly to that, "you carry something interesting. It smells of fate. I have eaten fate. Would you like to hear how it tasted?" His attention is an enormous, crushing gift.',
        stat_deltas: { willpower: 20, purity: 15, corruption: 10, stress: 25, hallucination: 15 },
      },
      work: {
        narrative_text: 'Vivec looks at you for a long moment and something in his expression suggests he is simultaneously amused and calculating odds across seventeen possible futures. "Yes," he says at last. "There is a thing only something as beautifully temporary as you could accomplish. Let me tell you a poem about it."',
        stat_deltas: { willpower: 15, stamina: -20, health: -5, corruption: 15 },
      },
      aggressive: {
        narrative_text: 'Vivec watches your aggression with the serene interest of the immortal witnessing something a mayfly has decided to try. He does not move. The air around him becomes briefly something other than air. When it resolves, you find yourself on the floor, unhurt, with a profound and newly installed certainty that you do not want to do that again.',
        stat_deltas: { health: -20, stress: 30, willpower: -20, purity: 10, corruption: -10 },
      },
    },
  },

  serjo_godes_alvela: {
    id: 'serjo_godes_alvela',
    name: 'Serjo Godes Alvela',
    race: 'dunmer',
    relationship: -10,
    description: 'The Morag Tong operates through a network of assassins so disciplined they have become something closer to religious figures than criminals — murder as sacrament, each contract a writ of execution sanctioned by the Tribunal and carried out with ceremonial precision. Godes Alvela is one of their senior operatives: a lean, ash-grey Dunmer with the professional courtesy of someone who considers killing an art form and is quietly offended by amateurs. He is not cruel. Cruelty would be imprecise.',
    responses: {
      social: {
        narrative_text: 'Alvela\'s acknowledgment of your presence is the minimal gesture of a person for whom all social interaction is an exchange of information. "You want something," he says. Not a question. "State it simply. The Guild values efficiency and so do I." His hands are still throughout the entire conversation.',
        stat_deltas: { stress: 8, willpower: 3 },
      },
      work: {
        narrative_text: 'Alvela removes a folded writ from inside his robe with the deliberate motion of someone who has done this exactly this way every time for twenty years. "The Morag Tong requires a delivery. You carry it, you deliver it, you do not read it. The pay is sufficient for your discretion. Is your discretion sufficient?"',
        stat_deltas: { stamina: -15, corruption: 10, purity: -5 },
      },
      aggressive: {
        narrative_text: 'For the first and last time, you see surprise cross Godes Alvela\'s face. Then something shifts in his eyes and becomes purely professional. "A mercy killing, then," he says softly. "I\'ll make it clean." He is very, very good at his work.',
        stat_deltas: { health: -25, stamina: -20, stress: 30, corruption: 5 },
      },
    },
  },

  hulda: {
    id: 'hulda',
    name: 'Hulda',
    race: 'bosmer',
    relationship: 20,
    description: 'Hulda runs the Bannered Mare in Whiterun with the competent, slightly maternal warmth of a person who has been feeding strangers for thirty years and found that, by and large, they deserved it. She is the smallest person in her own tavern on any given night, and the undisputed center of gravity of it. She remembers names. She remembers orders. She remembers the look on your face the first time you walked in, and files it away in the vast and reliable archive of her professional kindness.',
    responses: {
      social: {
        narrative_text: 'Hulda slides a mead down the bar with the unerring accuracy of someone who could do it in her sleep, and probably has. "Sit down, let me look at you," she says, the way only mothers and innkeepers say it. "You look like you\'ve had a week of it. First one\'s on the house. Tell me about it." She means it.',
        stat_deltas: { stress: -20, health: 5, stamina: -3 },
      },
      work: {
        narrative_text: '"Can you carry and can you keep your temper?" Hulda asks. It\'s not insulting, just efficient. "Because those are the two things that matter in this work. Everything else I can teach." She puts you to work and the work is honest and the kitchen scraps are good.',
        stat_deltas: { stamina: -10, stress: -8, health: 3 },
      },
      aggressive: {
        narrative_text: 'Hulda sets down the cloth she was polishing the bar with and looks at you with the patient disappointment of someone who has ejected far more impressive people than you from this establishment. "Out," she says, "or Mikael gets involved and nobody wants that." The Bosmer innkeeper is barely five feet tall and completely unintimidated.',
        stat_deltas: { stress: 12, corruption: 3 },
      },
    },
  },

  brynjolf: {
    id: 'brynjolf',
    name: 'Brynjolf',
    race: 'dunmer',
    relationship: 5,
    description: 'Brynjolf is the Thieves Guild\'s primary recruiter and one of their most capable field operatives — a Dunmer with the particular charm of someone who has made deception so habitual it\'s become sincere, a voice that suggests conspiracy and intimacy in equal measure, and the specific self-awareness of a rogue who knows exactly how he comes across and has decided to lean into it rather than apologize for it. He is, within his considerable constraints, trustworthy.',
    responses: {
      social: {
        narrative_text: 'Brynjolf\'s crimson Dunmer eyes catch yours across the market with the specific attention of someone professionally interested in your potential. He tilts his head toward an empty corner. "You look like someone who appreciates opportunity," he says. "I look like someone who creates it. I think we might have something to discuss, lass — or lad. Matters not to me." His smile is genuinely warm and approximately forty percent honest.',
        stat_deltas: { stress: -8, corruption: 5, seduction: 3 },
      },
      work: {
        narrative_text: '"There\'s a job," Brynjolf says, "and it involves the skills I suspect you have, if that performance in the market was any indication. The Guild pays on completion, not before. But the Guild also keeps its word, which is more than you\'ll get from most." He outlines the contract in efficient sentences.',
        stat_deltas: { stamina: -12, corruption: 10 },
      },
      aggressive: {
        narrative_text: 'Brynjolf sighs. It\'s a specific kind of sigh — disappointed rather than threatened. "I\'ve been doing this work for twenty years," he says conversationally, "and the one thing I\'ve learned is that people who start conversations like this one don\'t have the follow-through for Guild work. I suggest you reconsider your morning."',
        stat_deltas: { health: -10, stress: 15, stamina: -10 },
      },
    },
  },

  aerin: {
    id: 'aerin',
    name: 'Aerin',
    race: 'bosmer',
    relationship: 25,
    description: 'Aerin is a Bosmer of gentle, somewhat awkward goodness — a person who saw someone in trouble on the road from Riften and couldn\'t walk past them, and has spent considerable time since wondering what to do with the responsibility of that kindness. He is earnest in a way that most people in Riften regard as either touching or suspicious, and he carries himself with the particular social wariness of someone who means well and has been punished for it often enough to be careful.',
    responses: {
      social: {
        narrative_text: 'Aerin\'s greeting is genuine and slightly clumsy in its warmth, the handshake of someone who hasn\'t quite calibrated the gap between their regard and their social ease. "I\'m glad you\'re here," he says. "I don\'t say that lightly. I mean — I know it sounds strange — I just mean I\'m glad you\'re not in trouble. Are you in trouble? Tell me if you need something."',
        stat_deltas: { stress: -12, purity: 5 },
      },
      work: {
        narrative_text: 'Aerin can\'t offer much — he is not a wealthy Bosmer and Riften has taken more from him than it\'s given. But he can ask around, carry a message, or share a meal without anything being owed for it. His help is the genuine kind: limited, offered without drama, and meant.',
        stat_deltas: { stamina: -5, stress: -8 },
      },
      aggressive: {
        narrative_text: 'Aerin looks at you with hurt rather than fear, which is somehow worse. He doesn\'t know how to be threatening. He just stands there with that expression until whatever you\'re doing with your anger begins to feel disproportionate.',
        stat_deltas: { stress: 10, purity: -8, corruption: 5 },
      },
    },
  },

  dirge: {
    id: 'dirge',
    name: 'Dirge',
    race: 'orsimer',
    relationship: -15,
    description: 'Dirge is the Ratway\'s unofficial guardian — a massive Orsimer with a face like a cliff face that has been argued with by bad weather for sixty years. He guards the lower Ratway entrance to the Thieves Guild Cistern with the kind of absolute physical authority that doesn\'t require explanation. He has a name that other Orsimer gave him because it suited him from birth, and he has never once felt the need to go by anything else.',
    responses: {
      social: {
        narrative_text: 'Dirge regards your attempt at social interaction with the vast indifference of a geological formation that has been standing in this doorway since before you were born. After a silence that has genuine weight to it, he says: "What." Not a question. An invitation to get to the point or leave.',
        stat_deltas: { stress: 5, stamina: -3 },
      },
      work: {
        narrative_text: '"You want to work," Dirge says. "In here." He looks at you for approximately three seconds. "Fine. If you\'re here, you\'re useful, or you leave. Same rule applies to everyone." He puts you to work doing something that probably shouldn\'t be asked about.',
        stat_deltas: { stamina: -15, corruption: 8, stress: 5 },
      },
      aggressive: {
        narrative_text: 'Dirge doesn\'t say anything. He doesn\'t need to. The motion is brief and completely professional, and you are on the ground before you\'ve registered what happened. He looks down at you with no particular emotion. "Leave," he says.',
        stat_deltas: { health: -20, stamina: -15, stress: 20 },
      },
    },
  },

  argis_the_bulwark: {
    id: 'argis_the_bulwark',
    name: 'Argis the Bulwark',
    race: 'orsimer',
    relationship: 15,
    description: 'Argis is a housecarl — a sworn protector — and the title fits him like armor: he was built for exactly this function and has never once questioned whether he should be doing something else. He is an Orsimer of few words and absolute loyalty, the kind of person who communicates primarily through the quality of his presence, which is considerable. He respects competence, distrusts unnecessary speech, and his version of care is expressed entirely through being physically between you and whatever is trying to harm you.',
    responses: {
      social: {
        narrative_text: 'Argis stands and nods with the economy of someone who has said everything necessary in that single motion. If you wait long enough, he might add: "You have need of me?" He means it not as a question but as an availability statement. He is available.',
        stat_deltas: { stress: -8, health: 3 },
      },
      work: {
        narrative_text: 'Argis follows without being asked twice, doing twice what is asked of him, and says nothing about any of it. The work goes faster. Things that might have become problems don\'t become problems because of his proximity to them. He accepts payment with a nod and the clear implication that he\'d have done it anyway.',
        stat_deltas: { stamina: -10, stress: -5, health: 5 },
      },
      aggressive: {
        narrative_text: 'Argis steps between you and whatever is happening with the unhurried certainty of someone who has made his calculations and they all arrived at the same place. "That will not continue," he says, simply. He is very large and very still and the stillness is more warning than movement would be.',
        stat_deltas: { health: -5, stress: 15, stamina: -8 },
      },
    },
  },

  ungrien: {
    id: 'ungrien',
    name: 'Ungrien',
    race: 'bosmer',
    relationship: -5,
    description: 'Ungrien is a Bosmer who made a series of small compromises that each seemed survivable at the time and arrived, collectively, at working for Maven Black-Briar\'s mead operation in Riften with a skooma habit he can\'t afford and a personality that has been steadily dissolved by self-contempt. He is not a bad person. He is a person who has given up on the distinction.',
    responses: {
      social: {
        narrative_text: 'Ungrien looks up with the guilty, grateful expression of someone who is touched that you acknowledged him at all. "Oh — hello. Yes. I\'m — fine. Just tired." His hands don\'t shake anymore, which means he had his morning dose. He smells faintly of skooma smoke and Maven Black-Briar\'s mead.',
        stat_deltas: { stress: -5, purity: -3, corruption: 3 },
      },
      work: {
        narrative_text: '"Maven — Maven would have to approve," Ungrien says. His eyes do the calculation of what Maven would say, then what Maven would do if she said it, and his shoulders drop about an inch. "I can\'t. I\'m sorry. I can\'t." He means this more broadly than the immediate question.',
        stat_deltas: { stress: 8, stamina: -5 },
      },
      aggressive: {
        narrative_text: 'Ungrien flinches before you\'ve done anything, the deep animal flinch of someone who has been in many rooms where bad things happened and has learned to anticipate them. He doesn\'t fight back. He just tries to make himself small.',
        stat_deltas: { corruption: 10, purity: -10, stress: 5 },
      },
    },
  },

  ingun_black_briar: {
    id: 'ingun_black_briar',
    name: 'Ingun Black-Briar',
    race: 'dunmer',
    relationship: -10,
    description: 'Ingun Black-Briar has the Black-Briar name and very little else in common with her family. Where Maven is a predator of power, Ingun is a predator of knowledge — specifically of alchemical knowledge, most specifically of how things die and what they leave behind when they do. She is not cruel for pleasure but she is genuinely, deeply disinterested in whether her experiments cause suffering, which achieves a similar result. She is brilliant, thorough, and has a collection of poisons that would stop a Hist tree\'s heart.',
    responses: {
      social: {
        narrative_text: 'Ingun looks up from her mortar with the interrupted-professional impatience of someone whose work has a natural rhythm and you have just broken it. Then she actually looks at you and something sharpens in her expression. "You\'ve been to interesting places," she says. "I can tell. The corruption markers are fascinating." She is complimenting you.',
        stat_deltas: { stress: 5, corruption: 3, school_grades: 5 },
      },
      work: {
        narrative_text: '"I need specimens," Ingun says without preamble. "Specific specimens from specific locations. The list is long and some of it is dangerous to acquire. The pay reflects this." She slides a paper across the table. The list is indeed long. Some of the items on it are illegal in three provinces.',
        stat_deltas: { stamina: -15, corruption: 10, health: -5 },
      },
      aggressive: {
        narrative_text: 'Ingun looks at your aggression with professional curiosity rather than fear. "Interesting," she says. "Your adrenal response is textbook. Do you know how long that takes to synthesize?" She is already reaching toward her equipment. Whether for a weapon or a sample jar is, for the moment, unclear.',
        stat_deltas: { health: -15, stamina: -10, stress: 20, corruption: 8 },
      },
    },
  },

  sable: {
    id: 'sable',
    name: 'Sable',
    race: 'sload',
    relationship: -20,
    description: 'Sable is very old, even by Sload reckoning, which means Sable has been observing Tamriel\'s various catastrophes with alien patience for several centuries. The Sload has established something resembling a residence in Blackwood Marsh — a collapsed Ayleid structure barely distinguishable from the surrounding wetland, filled with the products of centuries of necromantic research. Sable communicates in deep subsonic vibrations that translate approximately into language if you stand at the right distance. Nothing about the encounter is comfortable.',
    responses: {
      social: {
        narrative_text: 'The vibration that emanates from Sable\'s general direction resolves, after a moment, into something your mind translates as: "You are alive. This is notable. Most things that come here are not alive when they leave." The pale, enormous mass shifts in the dark water. "What is it you carry that you do not know you carry?" The question is rhetorical. Sable already knows.',
        stat_deltas: { stress: 20, corruption: 15, hallucination: 10, willpower: 5 },
      },
      work: {
        narrative_text: 'Sable communicates a proposition that takes three minutes to fully resolve into comprehensible terms. The work involves recovering something from a submerged location in exchange for arcane knowledge of a highly specific and disturbing kind. The offer is made with the complete disinterest of a being for whom your welfare is a variable but not a priority.',
        stat_deltas: { stamina: -20, corruption: 15, health: -10, willpower: 10 },
      },
      aggressive: {
        narrative_text: 'Sable is not surprised. Sable is never surprised. The vast pale body doesn\'t move, but the air around it does something that is not a motion — the necromantic field activating with the casual certainty of someone calling upon a power they have used for three hundred years. Three of the shapes in the water behind Sable begin to stir.',
        stat_deltas: { health: -20, stamina: -15, corruption: 20, stress: 25, willpower: -15 },
      },
    },
  },

  madesi: {
    id: 'madesi',
    name: 'Madesi',
    race: 'argonian',
    relationship: 10,
    description: 'Madesi is an Argonian jeweler who works the Riften market with a craftsman\'s quiet pride and the particular resilience of a being who knows that his work is excellent and will continue to be so regardless of whether the surrounding society decides to recognize it. He creates jewelry that incorporates Argonian design elements — Hist-wood inlays, scale-pattern silver work — with consummate skill. He is warm without being naive, professional without being cold, and one of the most straightforwardly decent people in Riften.',
    responses: {
      social: {
        narrative_text: 'Madesi looks up from the ring he is setting with the unhurried attention of a craftsman who measures worth in quality of attention rather than status. "Good day to you," he says. "Are you interested in jewelry, or in conversation, or — if the Hist is willing — both?" He has a Saxhleel accent that he has never bothered to modify for anyone.',
        stat_deltas: { stress: -8, purity: 5 },
      },
      work: {
        narrative_text: '"I need materials I cannot obtain myself," Madesi says. "The city makes it difficult for Saxhleel to move freely, as I expect you have noticed. If you can source flawless sapphires and mammoth tusk — I know it\'s a list — I will compensate you fairly and in advance." He means this.',
        stat_deltas: { stamina: -12, stress: -3 },
      },
      aggressive: {
        narrative_text: 'Madesi sets down his tools with deliberate care and looks at you with Argonian patience — the deep, unhurried assessment of a people who survived things that made everything else merely difficult. "I have dealt with worse than your mood today," he says. "Would you like to try something less counterproductive instead?"',
        stat_deltas: { stress: 8, purity: -5, corruption: 5 },
      },
    },
  },
};

// ---------------------------------------------------------------------------
// ENCOUNTERS
// ---------------------------------------------------------------------------

export const TAMRIEL_ENCOUNTERS: EncounterData[] = [
  {
    id: 'cliff_racer',
    condition: 'Triggers outdoors in Morrowind locations with danger above 20, especially near cliffs or volcanic terrain',
    danger_min: 20,
    location_ids: ['seyda_neen', 'balmora', 'vivec_city', 'ghostgate'],
    outcome: 'A Cliff Racer drops from the amber sky with a banshee shriek, its bladed tail whipping toward you. The creatures are universally reviled across Morrowind — their aggression is matched only by their irritating tendency to circle just out of easy reach before diving.',
    enemy_name: 'Cliff Racer',
    enemy_type: 'creature',
    enemy_health: 35,
    enemy_max_health: 35,
    enemy_lust: 0,
    enemy_max_lust: 0,
    enemy_anger: 80,
    enemy_max_anger: 100,
  },
  {
    id: 'nix_hound',
    condition: 'Triggers in Morrowind wilderness areas, hunting in pairs or small packs near settlements',
    danger_min: 15,
    location_ids: ['seyda_neen', 'balmora', 'vivec_city'],
    outcome: 'A Nix-Hound emerges from the saltgrass, its chitinous body clicking as it lowers its head toward you. Domesticated ones are loyal as dogs; wild ones are just hungry. This one\'s compound eyes are tracking you with the patient certainty of an obligate predator.',
    enemy_name: 'Nix-Hound',
    enemy_type: 'creature',
    enemy_health: 28,
    enemy_max_health: 28,
    enemy_lust: 0,
    enemy_max_lust: 0,
    enemy_anger: 60,
    enemy_max_anger: 100,
  },
  {
    id: 'dreugh',
    condition: 'Triggers near water, particularly in estuaries, coastal areas, and the marshes of Black Marsh',
    danger_min: 35,
    location_ids: ['seyda_neen', 'anvil_docks', 'blackwood_marsh'],
    outcome: 'The Dreugh hauls itself from the water on multiple tentacled limbs, its crab-like shell dripping and its central mass oriented toward you with the alien attention of a thing that evolved for a different kind of predation. They were once worshipped. Looking at it now, you can almost understand why.',
    enemy_name: 'Dreugh',
    enemy_type: 'creature',
    enemy_health: 55,
    enemy_max_health: 55,
    enemy_lust: 20,
    enemy_max_lust: 60,
    enemy_anger: 65,
    enemy_max_anger: 100,
  },
  {
    id: 'dremora',
    condition: 'Triggers in areas with high Daedric corruption, near Oblivion ruins, or when corruption stat exceeds 70',
    danger_min: 60,
    location_ids: ['oblivion_gate_ruin', 'ghostgate'],
    outcome: 'The Dremora steps through a shimmer in the air with the composed arrogance of a being for whom your entire world is a temporary inconvenience. Its Daedric armor is wrong — too dark, too articulated, with edges that suggest they were designed to cause distress rather than simply damage. It regards you with contempt that is deeply personal despite the fact that it does not know you.',
    enemy_name: 'Dremora Warrior',
    enemy_type: 'daedra',
    enemy_health: 75,
    enemy_max_health: 75,
    enemy_lust: 30,
    enemy_max_lust: 80,
    enemy_anger: 90,
    enemy_max_anger: 100,
  },
  {
    id: 'scamp',
    condition: 'Triggers near magical disturbances, Mages Guild incidents, or Daedric shrines',
    danger_min: 25,
    location_ids: ['balmora', 'imperial_city_market', 'oblivion_gate_ruin'],
    outcome: 'A Scamp skitters out from behind a collapsed wall, all teeth and misdirected malice, hurling a fire-burst in your general direction with the accuracy of something that hasn\'t quite figured out aiming. They\'re minor Daedra — barely intelligent, perpetually irritable, and capable of causing genuine damage through sheer frantic energy.',
    enemy_name: 'Scamp',
    enemy_type: 'daedra',
    enemy_health: 30,
    enemy_max_health: 30,
    enemy_lust: 15,
    enemy_max_lust: 40,
    enemy_anger: 75,
    enemy_max_anger: 100,
  },
  {
    id: 'atronach',
    condition: 'Triggers near arcane anomalies, in areas with magical residue, or when willpower stat is very high',
    danger_min: 45,
    location_ids: ['vivec_city', 'ghostgate', 'oblivion_gate_ruin', 'balmora'],
    outcome: 'The Flame Atronach coalesces from ambient magical energy — a roughly humanoid form of living fire constrained by some long-since-absent summoner\'s binding, now free and furious. It burns simply because that is what it is. There is no negotiation with elemental embodiment.',
    enemy_name: 'Flame Atronach',
    enemy_type: 'daedra',
    enemy_health: 60,
    enemy_max_health: 60,
    enemy_lust: 10,
    enemy_max_lust: 30,
    enemy_anger: 85,
    enemy_max_anger: 100,
  },
  {
    id: 'draugr',
    condition: 'Triggers in Nordic ruins, tombs, barrows, and ancient structures throughout Skyrim',
    danger_min: 30,
    location_ids: ['windhelm', 'whiterun', 'riften'],
    outcome: 'The Draugr stirs in the dark alcove as you pass — ancient Nord dead, animated by a curse so old it has become architectural, as much a part of these ruins as the carved stone walls. Its eyes open with a pale blue light that was once intelligence and is now only hunger. It has been waiting here for centuries. You are simply the latest person to walk past.',
    enemy_name: 'Draugr',
    enemy_type: 'undead',
    enemy_health: 45,
    enemy_max_health: 45,
    enemy_lust: 5,
    enemy_max_lust: 20,
    enemy_anger: 70,
    enemy_max_anger: 100,
  },
  {
    id: 'falmer_raider',
    condition: 'Triggers in underground areas, Dwemer ruins, or dark tunnels, especially in Skyrim',
    danger_min: 50,
    location_ids: ['ratway', 'windhelm'],
    outcome: 'The Falmer moves through the dark with the fluid certainty of a creature that has never needed sight. You hear it before you see it — the soft crunch of chitin, the click of its throat — and then it is very close, its milky eyes aimed precisely at you despite their blindness, its improvised spear leveled with unsettling accuracy.',
    enemy_name: 'Falmer Raider',
    enemy_type: 'creature',
    enemy_health: 50,
    enemy_max_health: 50,
    enemy_lust: 25,
    enemy_max_lust: 70,
    enemy_anger: 80,
    enemy_max_anger: 100,
  },
  {
    id: 'skeever',
    condition: 'Triggers in low-danger urban areas, sewers, cellars, and anywhere food is stored',
    danger_min: 5,
    location_ids: ['seyda_neen', 'balmora', 'ratway', 'riften', 'anvil_docks'],
    outcome: 'A Skeever the size of a small dog bursts from a grain sack and fixes you with the tiny, furious eyes of a creature that has decided you are either food or threat and is too stupid to calibrate which. They carry diseases. They bite faster than they look capable of. They are everywhere.',
    enemy_name: 'Giant Skeever',
    enemy_type: 'creature',
    enemy_health: 18,
    enemy_max_health: 18,
    enemy_lust: 0,
    enemy_max_lust: 0,
    enemy_anger: 55,
    enemy_max_anger: 100,
  },
  {
    id: 'thalmor_patrol',
    condition: 'Triggers when player has high purity or has interacted with the Aldmeri Dominion, in Skyrim or Cyrodiil',
    danger_min: 40,
    location_ids: ['whiterun', 'windhelm', 'riften', 'imperial_city_market'],
    outcome: 'Three Thalmor Justiciars round a corner in formation — gleaming golden armor, the Aldmeri sunburst prominent, and the specific expression of institutionalized arrogance that comes from representing an empire that considers itself above the one whose roads you\'re currently standing on. Their interest in you is cool, evaluative, and not friendly.',
    enemy_name: 'Thalmor Justiciar',
    enemy_type: 'faction',
    enemy_health: 65,
    enemy_max_health: 65,
    enemy_lust: 15,
    enemy_max_lust: 40,
    enemy_anger: 60,
    enemy_max_anger: 100,
  },
  {
    id: 'morag_tong_assassin',
    condition: 'Triggers when player has committed crimes, angered factions, or been in Morrowind locations with high danger',
    danger_min: 55,
    location_ids: ['vivec_city', 'balmora', 'ghostgate'],
    outcome: 'You find the Writ of Execution on your own body — tucked into your belt without your noticing, its Tribunal seal pristine. The Morag Tong assassin is already visible across the street, waiting with the professional patience of someone who has been paid and sees no reason to rush. The Writ is legal. The kill will be clean. Neither fact is particularly comforting.',
    enemy_name: 'Morag Tong Assassin',
    enemy_type: 'faction',
    enemy_health: 70,
    enemy_max_health: 70,
    enemy_lust: 20,
    enemy_max_lust: 50,
    enemy_anger: 75,
    enemy_max_anger: 100,
  },
  {
    id: 'hist_lurker',
    condition: 'Triggers deep in Black Marsh or when corruption and hist_sap consumption are both high',
    danger_min: 60,
    location_ids: ['blackwood_marsh'],
    outcome: 'The Hist Lurker emerges from the deep water with the slow terrible grace of something that was once Argonian and is now something else entirely — something the Hist grew from a willing vessel, a body extended beyond its original architecture into pure biological purpose. Its eyes still have the amber color of Saxhleel eyes. That makes it worse.',
    enemy_name: 'Hist Lurker',
    enemy_type: 'creature',
    enemy_health: 80,
    enemy_max_health: 80,
    enemy_lust: 60,
    enemy_max_lust: 100,
    enemy_anger: 50,
    enemy_max_anger: 100,
  },
];

// ---------------------------------------------------------------------------
// ITEMS
// ---------------------------------------------------------------------------

export const TAMRIEL_ITEMS: Record<string, ItemData> = {
  septim: {
    id: 'septim',
    name: 'Gold Septim',
    type: 'misc',
    rarity: 'common',
    description: 'The standard currency of the Septim Empire, stamped with the profile of whichever Emperor claimed the Ruby Throne when the die was cut. Tarnished, worn, passed through a thousand hands. Still good in most of Tamriel.',
    value: 1,
    weight: 0.01,
    lore: 'The Septim bears the Imperial Dragon seal on its reverse. Counterfeit Septims are punishable by death in Cyrodiil, though enforcement is sporadic in the outer provinces.',
  },

  skooma: {
    id: 'skooma',
    name: 'Skooma',
    type: 'consumable',
    rarity: 'uncommon',
    stats: { lust: 15, corruption: 12, willpower: -20, stress: -20, stamina: 10, hallucination: 10 },
    description: 'Skooma is refined from moon sugar through a process that transforms the mild euphoric into something genuinely addictive and dangerous — a crystalline substance that burns in a pipe and delivers a wave of euphoria and heightened sensation before the crash. It is illegal in most of Tamriel and widely available in all of it.',
    value: 25,
    weight: 0.3,
    lore: 'Moon sugar is sacred to the Khajiit and their lunar gods Jode and Jone. Skooma represents its profane distillation — the spiritual stripped out and only the physical pleasure left behind. Many Khajiit consider it a corruption of something holy.',
  },

  moon_sugar: {
    id: 'moon_sugar',
    name: 'Moon Sugar',
    type: 'consumable',
    rarity: 'common',
    stats: { lust: 8, stress: -15, corruption: 5, willpower: -8, hallucination: 5 },
    description: 'Raw moon sugar is a crystalline granule harvested in Elsweyr from the sugar cane grown in the light of Jode and Jone. It has a sweetness that ordinary sugar does not approach and a mild euphoric quality when consumed. Legal in some provinces, heavily taxed in others.',
    value: 12,
    weight: 0.1,
    lore: 'Khajiit culture considers moon sugar a gift from their lunar gods. The substance is central to religious rites, cuisine, and daily life in Elsweyr. Outside the province, it is regarded primarily as a controlled substance or as the raw material for skooma production.',
  },

  ash_yam: {
    id: 'ash_yam',
    name: 'Ash Yam',
    type: 'consumable',
    rarity: 'common',
    stats: { health: 5, stamina: 3, stress: -3 },
    description: 'A starchy root vegetable that grows in Morrowind\'s ashfields, its skin grey as pumice and its interior startlingly orange. It is a staple food for Dunmer of all classes — roasted, stewed, or ground into flour. Outsiders find the slight mineral aftertaste unusual. Dunmer find outsiders\' reaction condescending.',
    value: 2,
    weight: 0.5,
    lore: 'Ash yam cultivation is an ancient practice in Vvardenfell, adapted to the sulphurous soil of the ash wastelands over centuries of careful breeding. The variety grown near Red Mountain has a faint bitterness attributed to trace mineral absorption.',
  },

  saltrice: {
    id: 'saltrice',
    name: 'Saltrice',
    type: 'consumable',
    rarity: 'common',
    stats: { health: 3, stamina: 5, stress: -2 },
    description: 'A tough grain that grows in Morrowind\'s salt marshes, saltrice has a slightly briny flavor that makes it unusual as porridge but excellent with kwama egg and sujamma sauce. It is the most commonly traded food commodity in Vvardenfell.',
    value: 1,
    weight: 0.3,
    lore: 'The saltrice harvest determines the economic stability of the Bitter Coast villages more than almost any other factor. A bad harvest year means desperation; a good one means prosperity and, invariably, higher skooma production.',
  },

  hist_sap: {
    id: 'hist_sap',
    name: 'Hist Sap',
    type: 'consumable',
    rarity: 'rare',
    stats: { health: 20, corruption: 18, willpower: 10, purity: -8, hallucination: 12 },
    description: 'Amber-gold and sweetly luminescent, hist sap is the sacred fluid of the Hist trees — the alien plant network that forms the spiritual center of Argonian civilization. To non-Argonians it is intensely powerful and profoundly disorienting. To Saxhleel it is a communion sacrament. The line between gift and possession is thin.',
    value: 85,
    weight: 0.4,
    lore: 'The Hist does not give sap freely. Trees that allow their sap to be harvested are in some sense consenting to the taking — and the sap carries the tree\'s intent within it. What a Hist wants from those who drink its sap is a matter of some theological debate among Saxhleel scholars.',
  },

  sujamma: {
    id: 'sujamma',
    name: 'Sujamma',
    type: 'consumable',
    rarity: 'uncommon',
    stats: { stamina: 15, pain: -15, willpower: -12, stress: -10, corruption: 3 },
    description: 'Sujamma is the traditional Dunmer spirit — distilled from saltrice and matured in kwama-chitin casks, producing a clear liquor of extreme potency that smells of ash and tastes of fire going in and numbness coming out. It is a drink for people who have earned the right to be this tired.',
    value: 18,
    weight: 0.5,
    lore: 'Dunmer culture considers the sharing of sujamma a significant social gesture — it says that you are present enough, known enough, trusted enough to drink something this honest with another person. It is rarely offered to outlanders who haven\'t demonstrated some minimum threshold of suffering.',
  },

  comberry_wine: {
    id: 'comberry_wine',
    name: 'Comberry Wine',
    type: 'consumable',
    rarity: 'common',
    stats: { stamina: 5, stress: -8, willpower: -5 },
    description: 'Fermented from comberry, a tart red fruit of the Morrowind coast, this wine is an acquired taste — acidic, dark, and carrying a persistent mineral note that either grows on you or doesn\'t. The Dunmer favor it. The Cornerclubs serve it in clay cups without ceremony.',
    value: 8,
    weight: 0.6,
    lore: 'Comberry wine is unremarkable by most standards — the Dunmer make it because comberries are what grows here, and they have always made something from what grows here. Age does not improve it. It is what it is and it has never pretended otherwise.',
  },

  hackle_lo_berries: {
    id: 'hackle_lo_berries',
    name: 'Hackle-Lo Berries',
    type: 'consumable',
    rarity: 'uncommon',
    stats: { health: -15, stamina: -10, pain: 20, corruption: 5 },
    description: 'Small, glossy black berries that grow on low scrub in Morrowind\'s marsh-edge environments. They are intensely toxic to most species. Khajiit alchemists use them in poison work. Desperate people eat them by accident and regret it enormously.',
    value: 5,
    weight: 0.1,
    lore: 'The name \'Hackle-Lo\' comes from a corruption of an old Dunmeri phrase meaning \'bad remembering\' — the berries cause vivid, unpleasant sensory memories as part of their toxic syndrome, which the original namers apparently considered their defining feature.',
  },

  netch_leather_armor: {
    id: 'netch_leather_armor',
    name: 'Netch Leather Armor',
    type: 'armor',
    slot: 'chest',
    rarity: 'common',
    stats: { health: 5, stamina: -2 },
    description: 'Cured leather from the netch — the great floating jellyfish-creatures that drift through Morrowind\'s ashlands — forms the basis of Dunmer light armor. It is durable, relatively lightweight, and carries a faint bioluminescent quality in low light that most wearers come to find comforting.',
    value: 35,
    weight: 4.0,
    integrity: 100,
    max_integrity: 100,
    lore: 'Netch husbandry is one of the distinctive crafts of Morrowind — the great beasts are partly domesticated, their hides harvested after natural death or from wild specimens. Netch leather processed in Sadrith Mora has a particular quality that fetches higher prices elsewhere.',
  },

  chitin_helm: {
    id: 'chitin_helm',
    name: 'Chitin Helm',
    type: 'armor',
    slot: 'head',
    rarity: 'common',
    stats: { health: 3, willpower: -1 },
    description: 'Fabricated from the shell segments of Morrowind\'s insect life — cliff racer wing joints, kwama worker carapace, scaled in overlapping layers and riveted at the joins — chitin armor is the standard light protection of Vvardenfell\'s lower classes and guards alike. It is not beautiful. It keeps you alive.',
    value: 20,
    weight: 1.5,
    integrity: 100,
    max_integrity: 100,
    lore: 'The craft of chitin armorsmithing requires neither expensive materials nor advanced metallurgical knowledge, which has made it ubiquitous among Dunmer soldiers and civilians alike for centuries. Quality varies enormously by maker.',
  },

  glass_dagger: {
    id: 'glass_dagger',
    name: 'Glass Dagger',
    type: 'weapon',
    rarity: 'rare',
    stats: { health: -12, stamina: -3 },
    description: 'Morrowind\'s volcanic glass — a form of refined obsidian found only in the ashfields near Red Mountain — holds an edge sharper than any steel and with a quality of cut that leaves wounds slow to close. The blade\'s green-black translucence is genuinely beautiful. Most people who have seen one being used are not in a position to appreciate this.',
    value: 180,
    weight: 0.5,
    integrity: 80,
    max_integrity: 80,
    lore: 'Glass weapons are a uniquely Morrowind export — the volcanic glass cannot be found elsewhere in Tamriel in usable quantities, and its working requires techniques developed over centuries by Dunmer craftspeople. A genuine glass blade commands extraordinary prices outside the province.',
  },

  iron_shortsword: {
    id: 'iron_shortsword',
    name: 'Iron Shortsword',
    type: 'weapon',
    rarity: 'common',
    stats: { health: -8, stamina: -2 },
    description: 'A plain iron blade, double-edged, with a wrapped leather grip and a simple cross-guard. It is unremarkable in every particular. It will kill you if you are not careful around the person holding it.',
    value: 22,
    weight: 3.0,
    integrity: 100,
    max_integrity: 100,
    lore: 'Iron is the common currency of violence across Tamriel — cheap to produce, easy to replace, and sufficient to end a life if swung with conviction. The number of iron shortswords produced and discarded in Tamriel\'s history exceeds calculation.',
  },

  dunmer_robe: {
    id: 'dunmer_robe',
    name: 'Dunmer Ceremonial Robe',
    type: 'clothing',
    slot: 'chest',
    rarity: 'uncommon',
    stats: { willpower: 5, stress: -3 },
    description: 'Dark grey wool embroidered with Dunmeri ancestor sigils in red and black thread, the robe is simultaneously practical and ceremonially significant — worn for Temple observances, important social occasions, and any situation where a Dunmer wishes to be taken seriously. The cut is severe and elegant.',
    value: 45,
    weight: 1.0,
    integrity: 100,
    max_integrity: 100,
    lore: 'The ancestor sigils embroidered on Dunmer ceremonial clothing vary by family and tradition. Reading them, a knowledgeable Dunmer can determine the wearer\'s lineage, their primary ancestor-patron, and their social standing within the great house system.',
  },

  khajiit_silks: {
    id: 'khajiit_silks',
    name: 'Khajiit Silks',
    type: 'clothing',
    slot: 'chest',
    rarity: 'uncommon',
    stats: { seduction: 15, stress: -5, lust: 5 },
    description: 'Silk garments from the trade routes of Elsweyr, dyed in colors that do not exist in northern fabrics — deep orange, dusty rose, saffron, the specific blue of a Khajiit caravan tent at dusk. The cut is designed for a feline body but fits surprisingly well on other forms, clinging and flowing simultaneously.',
    value: 60,
    weight: 0.3,
    integrity: 80,
    max_integrity: 80,
    lore: 'Khajiit silk is produced in Elsweyr from the thread of sugar-moths, cultivated in massive moon-sugar groves. The dying process uses ingredients including processed moon sugar, which gives the fabric a faint luminescence under moonlight and a pleasant smell that is, some say, mildly intoxicating.',
  },

  hist_bark_loincloth: {
    id: 'hist_bark_loincloth',
    name: 'Hist-Bark Loincloth',
    type: 'clothing',
    slot: 'underwear',
    rarity: 'common',
    stats: { purity: 3, health: 2 },
    description: 'The traditional Argonian under-garment, woven from the processed inner bark of non-Hist wetland trees and treated with Hist-adjacent compounds for water resistance and durability. It is practical and culturally significant — the base layer of Saxhleel dress, unchanged in form for centuries.',
    value: 8,
    weight: 0.2,
    integrity: 100,
    max_integrity: 100,
    lore: 'Argonian bark-cloth is produced through a process that involves extended soaking in Hist-adjacent marsh water, imparting trace biological compounds that make the resulting fabric resistant to both rot and parasitic infection. It is one of Black Marsh\'s most quietly significant exports.',
  },

  slave_bracer: {
    id: 'slave_bracer',
    name: 'Iron Slave Bracer',
    type: 'clothing',
    slot: 'hands',
    rarity: 'common',
    stats: { control: -15, willpower: -10, purity: -8, corruption: 5 },
    description: 'A heavy iron bracer fitted with the locking mechanism of a slave restraint, broad enough to cover the wrist and bearing the brand-mark of a Morrowind slaver operation now supposedly defunct. They are illegal to manufacture and common to find. The weight is mostly psychological.',
    value: 3,
    weight: 1.5,
    integrity: 100,
    max_integrity: 100,
    lore: 'Morrowind\'s formal abolition of slavery was a complex political event that primarily served to drive the practice underground while leaving its infrastructure intact. Iron slave bracers, identifiable by their locking mechanisms, continue to circulate in black markets across the province.',
  },

  daedric_amulet: {
    id: 'daedric_amulet',
    name: 'Daedric Sigil Amulet',
    type: 'misc',
    rarity: 'rare',
    stats: { corruption: 20, willpower: 15, purity: -15, hallucination: 8 },
    description: 'A small disc of Daedric heartstone on a chain of a metal that predates nomenclature, engraved with a sigil that continues to mean something even when you\'ve turned away from it. The weight is wrong for its size. It is warm.',
    value: 250,
    weight: 0.1,
    lore: 'Daedric artifacts retain the resonance of their plane of origin indefinitely — a Sigil Amulet is always partly in Oblivion, always broadcasting its location to whatever named its power. Scholars debate whether the power is worth the attention.',
  },

  ebony_ore: {
    id: 'ebony_ore',
    name: 'Ebony Ore',
    type: 'misc',
    rarity: 'uncommon',
    description: 'Raw ebony ore, the dense dark stone mined from Morrowind\'s volcanic deposits and a few locations in Skyrim. In its raw state it is simply heavy and valuable. Processed by a skilled smith it becomes the basis of the finest non-enchanted armor and weapons in Tamriel.',
    value: 150,
    weight: 5.0,
    lore: 'Ebony mines are among the most vigorously defended properties in Morrowind, their deeds held by the great houses and the revenue flowing up through layers of guild and house obligation. The ore itself is said to be the physical remains of the Lorkhan, the Missing God — the myth explaining why working with it feels somehow transgressive.',
  },

  soul_gem: {
    id: 'soul_gem',
    name: 'Soul Gem',
    type: 'misc',
    rarity: 'uncommon',
    stats: { willpower: 5 },
    description: 'A faceted crystal of unknown geological origin, naturally hollow, capable of containing the essence of a creature\'s animus after death. The soul presses against the inside surface of the gem and can be seen as a faint glow. Enchanters use them to power permanent enchantments. The ethics of the practice are widely ignored.',
    value: 45,
    weight: 0.2,
    lore: 'Soul gems occur naturally in scattered deposits but are also manufactured — a process whose details the Mages Guilds guard carefully. The capacity of a gem determines what souls it can hold. Grand Soul Gems can contain the soul of a person; most guilds decline to acknowledge this application officially.',
  },

  sweetroll: {
    id: 'sweetroll',
    name: 'Sweetroll',
    type: 'consumable',
    rarity: 'common',
    stats: { health: 2, stamina: 5, stress: -5, purity: -1 },
    description: 'A glazed pastry baked in a bundt pan, with a hole in the center. The sweet icing drips down the sides. It is inexplicably popular across all provinces.',
    value: 3,
    weight: 0.1,
    lore: 'A common joke across Tamriel is that if someone looks upset, someone else must have stolen their sweetroll. It is a strangely universal pastry.',
  },

  lockpick: {
    id: 'lockpick',
    name: 'Lockpick',
    type: 'misc',
    rarity: 'common',
    description: 'A small, bent piece of metal used for bypassing tumblers in mechanical locks. Flimsy and prone to breaking.',
    value: 2,
    weight: 0.05,
    lore: 'The design of lockpicks has not changed much since the First Era, mostly because the design of locks hasn\'t either. Possession of lockpicks is technically illegal for non-Thieves Guild members in some jurisdictions.',
  },

  health_potion: {
    id: 'health_potion',
    name: 'Potion of Healing',
    type: 'consumable',
    rarity: 'common',
    stats: { health: 25 },
    description: 'A glass vial containing a crimson liquid that smells faintly of sulfur and blood. Drinking it accelerates natural healing processes painfully but effectively.',
    value: 15,
    weight: 0.5,
    lore: 'Alchemists debate the ideal base for health potions, but the fundamental principle—extracting restorative properties from flora and fauna—is universally practiced.',
  },

  magicka_potion: {
    id: 'magicka_potion',
    name: 'Potion of Magicka',
    type: 'consumable',
    rarity: 'common',
    stats: { willpower: 20 },
    description: 'A swirling blue liquid that tastes like ozone. It forcefully recharges the body\'s arcane reserves.',
    value: 15,
    weight: 0.5,
    lore: 'Restoring magicka artificially is a violent process for the nervous system, which is why frequent use leads to arcane toxicity.',
  },

  stamina_potion: {
    id: 'stamina_potion',
    name: 'Potion of Stamina',
    type: 'consumable',
    rarity: 'common',
    stats: { stamina: 30, stress: -5 },
    description: 'A bright green potion that tastes of pine and bitter herbs. Instantly banishes fatigue.',
    value: 15,
    weight: 0.5,
    lore: 'Often used by soldiers on forced marches, though the crash when it wears off can be debilitating.',
  },

  black_soul_gem: {
    id: 'black_soul_gem',
    name: 'Black Soul Gem',
    type: 'misc',
    rarity: 'rare',
    stats: { willpower: -10, corruption: 5, trauma: 2 },
    description: 'A soul gem corrupted by necromantic rituals, capable of trapping the souls of sentient beings (white souls). It feels cold to the touch and seems to absorb light.',
    value: 500,
    weight: 0.2,
    lore: 'Created by the Order of the Black Worm or through dark rituals at necromancer altars during a Shade of the Revenant. The Mages Guild bans them under penalty of death.',
  }
};

// ---------------------------------------------------------------------------
// ITEM PREFIXES & SUFFIXES
// ---------------------------------------------------------------------------

export const TAMRIEL_ITEM_PREFIXES: string[] = [
  'Ancient',
  'Ash-stained',
  'Enchanted',
  'Dwemer',
  'Tribunal',
  'Daedric',
  'Hist-soaked',
  'Blight-touched',
  'Lusty',
  'Stolen',
  'Ebony',
  'Glass',
  'Elven',
  'Orcish',
  'Stalhrim'
];

export const TAMRIEL_ITEM_SUFFIXES: string[] = [
  'of the Tribunal',
  'of Azura',
  'of Molag Bal',
  'of Mehrunes Dagon',
  'of the Hist',
  'of the Nerevarine',
  'of Vivec',
  'of Red Mountain',
  'of the Dragonborn',
  'of the Night Mother',
  'of Sithis',
  'of Sanguine'
];

// ---------------------------------------------------------------------------
// COMPATIBILITY HELPERS — used by App.tsx and TamrielStartMenu
// ---------------------------------------------------------------------------

/**
 * Race data shape expected by TamrielStartMenu and App.tsx:
 * displayName, description, racialBonuses, startingLocations
 */
export interface TamrielRaceCompat {
  id: string;
  displayName: string;
  description: string;
  lore: string;
  racialBonuses: Partial<Record<string, number>>;
  skillBonuses: Partial<Record<string, number>>;
  specialAbility: string;
  appearanceNotes: string;
  birthsignAffinity: string[];
  startingLocations: string[];
}

/** Map from race id to starting location(s) for character creation */
const RACE_STARTING_LOCATIONS: Record<string, string[]> = {
  altmer:   ['vivec_city', 'imperial_city_market'],
  dunmer:   ['seyda_neen', 'balmora'],
  bosmer:   ['balmora', 'whiterun'],
  orsimer:  ['whiterun', 'windhelm'],
  khajiit:  ['riften', 'anvil_docks'],
  argonian: ['blackwood_marsh', 'seyda_neen'],
  sload:    ['blackwood_marsh', 'oblivion_gate_ruin'],
  falmer:   ['ratway', 'windhelm'],
};

/**
 * Returns a race object with compatibility fields expected by the UI.
 */
export function getTamrielRace(id: string): TamrielRaceCompat {
  const race = TAMRIEL_RACES.find(r => r.id === id) ?? TAMRIEL_RACES[1]; // default dunmer
  return {
    id: race.id,
    displayName: race.name,
    description: race.lore,
    lore: race.lore,
    racialBonuses: race.stat_bonuses,
    skillBonuses: race.skill_bonuses,
    specialAbility: race.special_ability,
    appearanceNotes: race.appearance_notes,
    birthsignAffinity: race.birthsign_affinity,
    startingLocations: RACE_STARTING_LOCATIONS[race.id] ?? ['seyda_neen'],
  };
}

/**
 * Birthsign shape expected by TamrielStartMenu (uses BIRTHSIGNS as Record).
 */
export interface BirthsignCompat {
  id: string;
  name: string;
  constellation: string;
  description: string;
  bonus: string;
  bonuses: Partial<Record<string, number>>;
  lore: string;
}

/**
 * BIRTHSIGNS as a Record keyed by id, with compatibility `description` and `bonuses` fields.
 * TamrielStartMenu accesses: Object.values(BIRTHSIGNS), sign.description, sign.bonuses
 */
export const BIRTHSIGNS: Record<string, BirthsignCompat> = Object.fromEntries(
  TAMRIEL_BIRTHSIGNS.map(b => [
    b.id,
    {
      id: b.id,
      name: b.name,
      constellation: b.constellation,
      description: b.bonus,      // UI reads sign.description
      bonus: b.bonus,
      bonuses: b.stat_bonuses,   // UI reads sign.bonuses
      lore: b.lore,
    } satisfies BirthsignCompat,
  ])
);

/**
 * Look up a birthsign by id (used by App.tsx: getBirthsign).
 */
export function getBirthsign(id: string): BirthsignCompat {
  return BIRTHSIGNS[id] ?? BIRTHSIGNS['the_warrior'];
}

/**
 * Complete stat block for a new character combining race bonuses and birthsign bonuses.
 * Returns a GameState-compatible player object partial.
 */
export function generateTamrielCharacter(options: {
  race: string;
  birthsign: string;
  name: string;
  gender: string;
  startingLocation?: string;
}): {
  identity: { name: string; race: string; birthsign: string; origin: string; gender: string };
  stats: Record<string, number>;
  skills: Record<string, number>;
  starting_location: string;
} {
  const race = getTamrielRace(options.race);
  const sign = getBirthsign(options.birthsign);

  const BASE_STATS: Record<string, number> = {
    health: 100,
    stamina: 100,
    willpower: 100,
    lust: 0,
    trauma: 0,
    hygiene: 80,
    corruption: 0,
    allure: 20,
    arousal: 0,
    pain: 0,
    control: 100,
    stress: 0,
    hallucination: 0,
    purity: 50,
    max_health: 100,
    max_willpower: 100,
    max_stamina: 100,
  };

  const BASE_SKILLS: Record<string, number> = {
    seduction: 10,
    athletics: 10,
    skulduggery: 10,
    swimming: 10,
    dancing: 10,
    housekeeping: 10,
    school_grades: 10,
  };

  // Apply race stat bonuses
  const stats = { ...BASE_STATS };
  for (const [key, val] of Object.entries(race.racialBonuses)) {
    if (key in stats) {
      stats[key] = Math.max(0, Math.min(200, (stats[key] ?? 0) + (val ?? 0)));
    }
  }

  // Apply birthsign stat bonuses
  for (const [key, val] of Object.entries(sign.bonuses)) {
    if (key in stats) {
      stats[key] = Math.max(0, Math.min(200, (stats[key] ?? 0) + (val ?? 0)));
    }
  }

  // Apply race skill bonuses
  const skills = { ...BASE_SKILLS };
  for (const [key, val] of Object.entries(race.skillBonuses)) {
    if (key in skills) {
      skills[key] = Math.max(0, Math.min(100, (skills[key] ?? 0) + (val ?? 0)));
    }
  }

  const startingLocation = options.startingLocation ?? race.startingLocations[0] ?? 'seyda_neen';

  return {
    identity: {
      name: options.name || 'Traveler',
      race: options.race,
      birthsign: options.birthsign,
      origin: race.displayName,
      gender: options.gender,
    },
    stats,
    skills,
    starting_location: startingLocation,
  };
}

/**
 * RACES — compatibility Record keyed by race id.
 */
export const RACES: Record<string, TamrielRaceCompat> = Object.fromEntries(
  TAMRIEL_RACES.map((r) => [r.id, getTamrielRace(r.id)])
);

/** Convenience export — same as BIRTHSIGNS Record. */
export const BIRTHSIGN_BONUSES = BIRTHSIGNS;

/** Lore age of adulthood in days for each race. */
export const RACE_ADULT_AGES: Record<string, number> = {
  altmer:   10950,
  dunmer:   9125,
  bosmer:   7300,
  orsimer:  7300,
  khajiit:  6570,
  argonian: 5475,
  sload:    18250,
  falmer:   10950,
};

/** Province map display colors. */
export const PROVINCE_COLORS: Record<string, string> = {
  'Morrowind':             '#8B4513',
  'Skyrim':                '#4A6FA5',
  'Cyrodiil':              '#2E7D32',
  'Black Marsh':           '#1B5E20',
  'Black Marsh (Argonia)': '#1B5E20',
  'Valenwood':             '#388E3C',
  'Summerset Isles':       '#F9A825',
  'Elsweyr':               '#E65100',
  'Hammerfell':            '#BF360C',
  'High Rock':             '#4527A0',
  'Oblivion':              '#B71C1C',
};

/** Ascension states (lore outcomes for extreme playthroughs). */
export const ASCENSION_STATES: Record<string, { title: string; lore: string; condition: string }> = {
  pure_soul: {
    title: 'Soul of Auri-El',
    lore: "The Crystal Tower knows your name. You have walked a path of such uncommon grace and integrity that Auri-El himself takes notice — your soul glows with the resonance of someone who chose difficult goodness over easy compromise. The ancient Snow Elves would recognize in you what they once were.",
    condition: "Achieved through sustained purity, piety, and kindness. Requires: purity > 80, corruption < 10, trauma < 20.",
  },
  void_lord: {
    title: 'Champion of Molag Bal',
    lore: "The Coldharbour cold runs through your veins now. You have broken and dominated and taken until Molag Bal's interest turned to something warmer — possession. You are his champion, his proof that all things bend or break. The City of Ash calls your name.",
    condition: "Achieved through domination, corruption, and cruelty. Requires: corruption > 80, control > 70, purity < 10.",
  },
  broodmother: {
    title: 'Favored of Hircine',
    lore: "The Hunting Grounds have a new prey: the hunter. Hircine has marked you through your parasitic burdens, your beast-close biology, the way you now move through spaces as predator and prey simultaneously. You are the paradox he loves best.",
    condition: "Achieved through parasite infection, biological transformation, and predatory behavior. Requires active parasites, heat cycles active.",
  },
  asylum: {
    title: "Sheogorath's Touched",
    lore: "The Madgod noticed you. He finds your particular unraveling delightful — the texture of your fractured reality, the colors your trauma has added to the world, the way cheese has started appearing in your peripheral vision. 'You're not broken,' he tells you. 'You're INTERESTING.'",
    condition: "Achieved through accumulated trauma and hallucination. Requires: trauma > 80, hallucination > 60, stress > 90.",
  },
};
