# DOL to Elder Scrolls Content Port

This directory contains all content ported from **Degrees of Lewdity (DOL)** and reskinned for **Elder Scrolls** lore.

## Overview

- **7 NPCs** with complete dialogue trees (greeting, farewell, social, work, comfort, praise, flirt, tease)
- **7 Locations** with activities, events, and NPCs
- **10 Encounter types** with multiple outcome paths

## NPC Mappings

| DOL NPC | Elder Scrolls Equivalent | Race | Role | Location |
|---------|-------------------------|------|------|----------|
| Sydney | Sigrid | Nord | Priestess of Mara | Temple of Mara (Riften) |
| Whitney | Wulfgar | Nord | Bandit Enforcer | The Ratway |
| Robin | Ralof | Nord | Stormcloak Veteran | Riverwood / Jorrvaskr |
| Kylar | Kharjo | Khajiit | Caravan Guard | Khajiit Caravan |
| Eden | Eorlund Gray-Mane | Nord | Master Blacksmith | Skyforge (Whiterun) |
| Avery | Astrid | Nord | Dark Brotherhood Leader | Dawnstar Sanctuary |
| Doren | Delphine | Breton | Blade Agent | Sleeping Giant Inn |

## Location Mappings

| DOL Location | Elder Scrolls Location | Region |
|--------------|------------------------|--------|
| loc-temple | Temple of Mara | Riften |
| loc-alley/sewers | The Ratway | Riften |
| special-eden | Skyforge | Whiterun |
| special-avery | Dark Brotherhood Sanctuary | Dawnstar |
| special-doren | Sleeping Giant Inn | Riverwood |
| special-kylar | Khajiit Caravan | Travelling |
| special-robin | Jorrvaskr | Whiterun |

## Encounter Mappings

| DOL Source | Elder Scrolls Encounter | Type |
|------------|------------------------|------|
| base-combat | Bandit Ambush | Combat |
| loc-wolfpack | Wolf Pack | Combat |
| loc-forest | Spriggan Attack | Combat |
| loc-cave | Draugr Awakening | Combat |
| loc-moor | Forsworn Raid | Combat |
| loc-alley | Guild Shakedown | Social |
| loc-police | Imperial Patrol | Social |
| special-kylar/stalk | Vampire Hunter | Social |
| flavour-text-generators | Seduction Attempt | Social |
| loc-prison | Corrupt Guard | Social |

## File Structure

```
src/data/
├── dialogue/
│   └── dol_ported/
│       ├── index.ts          # NPC registry and exports
│       ├── sigrid.ts         # Temple Priestess
│       ├── wulfgar.ts        # Bandit
│       ├── ralof.ts          # Companion
│       ├── kharjo.ts         # Caravan Guard
│       ├── eorlund.ts        # Blacksmith
│       ├── astrid.ts         # Dark Brotherhood
│       └── delphine.ts       # Blade Agent
├── locations/
│   ├── index.ts              # Location registry
│   ├── temple_of_mara.ts
│   ├── ratway.ts
│   ├── skyforge.ts
│   ├── dark_sanctuary.ts
│   ├── sleeping_giant.ts
│   ├── khajiit_caravan.ts
│   └── jorrvaskr.ts
├── encounters/
│   ├── index.ts              # Encounter registry
│   ├── bandit_ambush.ts
│   ├── wolf_pack.ts
│   ├── spriggan_attack.ts
│   ├── draugr_tomb.ts
│   ├── forsworn_raid.ts
│   ├── thieves_guild_shakedown.ts
│   ├── imperial_patrol.ts
│   ├── vampire_hunter.ts
│   ├── seduction_attempt.ts
│   └── corrupt_guard.ts
└── dolIntegration.ts         # Main integration module
```

## Usage

### Import NPC Dialogue

```typescript
import { sigridDialogue, DOLElderScrollsIntegration } from './data/dolIntegration';

// Get all dialogue for an NPC
console.log(sigridDialogue.greeting);

// Get random dialogue line
const greeting = DOLElderScrollsIntegration.getRandomDialogue('sigrid', 'greeting');
```

### Import Locations

```typescript
import { templeOfMaraData, elderscrollsLocations } from './data/dolIntegration';

// Get location data
console.log(templeOfMaraData.activities);
console.log(templeOfMaraData.events);
```

### Import Encounters

```typescript
import { banditAmbushEncounter, encountersByLocation } from './data/dolIntegration';

// Get encounter data
console.log(banditAmbushEncounter.outcomes);

// Get encounters for a location type
const roadEncounters = encountersByLocation['road'];
```

## Integration with Existing Ga-mg Systems

The ported content is designed to integrate with Ga-mg's existing systems:

- **Dialogue**: Uses the same `DialogueLine` interface as existing gender variants
- **Locations**: Compatible with the quest and activity systems
- **Encounters**: Works with the combat and encounter systems

## Elder Scrolls Lore Compliance

All content has been reskinned to fit Elder Scrolls lore:

- References to real-world religions replaced with Divines (Mara, Talos, etc.)
- Locations mapped to actual Skyrim places
- NPCs use appropriate racial speech patterns
- Cultural references match Elder Scrolls lore (Stormcloaks, Thalmor, etc.)
