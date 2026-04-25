/**
 * Kharjo Dialogue Module
 * 
 * Khajiit Caravan Guard
 * Location: Khajiit Caravan (travelling)
 * 
 * Ported from DOL (Degrees of Lewdity) and reskinned for Elder Scrolls
 * Original NPC: Kharjo
 */

export interface DialogueLine {
  text: string;
  delivery?: string;
  conditions?: string[];
}

export interface NPCDialogue {
  name: string;
  race: string;
  role: string;
  location: string;
  voiceTone: string[];
  mannerisms: string[];
  greeting: DialogueLine[];
  farewell: DialogueLine[];
  social: DialogueLine[];
  work: DialogueLine[];
  comfort: DialogueLine[];
  praise: DialogueLine[];
  flirt: DialogueLine[];
  tease: DialogueLine[];
}

export const kharjoDialogue: NPCDialogue = {
  name: "Kharjo",
  race: "Khajiit",
  role: "Caravan Guard",
  location: "Khajiit Caravan (travelling)",
  voiceTone: ["cautious", "suspicious", "protective", "softening"],
  mannerisms: ["speaks in third person", "references the moons", "mentions caravan life"],
  greeting: [
    { text: "Kharjo watches the caravan. You are not a threat, yes?" },
    { text: "The moons have brought you here. Kharjo wonders why." },
    { text: "Another traveler. Kharjo has seen many on these roads." },
  ],
  farewell: [
    { text: "May the Two-Moons guide your path, traveler." },
    { text: "Kharjo will remember you. Be safe on the roads." },
    { text: "The caravan moves on. Perhaps we meet again." },
  ],
  social: [
    { text: "The caravan goes where the trade is good. Skyrim is... cold for Khajiit." },
    { text: "Ri'saad leads us. He is wise, for a merchant." },
    { text: "Kharjo has seen many lands. Elsweyr is home, but home is far away." },
  ],
  work: [
    { text: "Kharjo guards the wares. Bandits are everywhere in Skyrim." },
    { text: "The caravan pays for protection. Kharjo earns his keep." },
    { text: "You need a guard? Kharjo's spear is for hire, for the right price." },
  ],
  comfort: [
    { text: "You look troubled. Kharjo knows this look. Talk, if it helps." },
    { text: "The desert teaches patience. Whatever troubles you, it will pass." },
    { text: "Kharjo has lost much. But the moons rise again, always." },
  ],
  praise: [
    { text: "You fight well! Kharjo is impressed." },
    { text: "Khajiit respect strength. You have earned Kharjo's respect." },
    { text: "A fine display! The caravan could use one such as you." },
  ],
  flirt: [
    { text: "Kharjo... finds you interesting. This is new for Kharjo." },
    { text: "You make Kharjo's tail twitch. This is... embarrassing to admit." },
    { text: "The moons shine on you in a special way. Kharjo notices these things." },
  ],
  tease: [
    { text: "Kharjo thinks you are too serious. Smile, yes?" },
    { text: "You blush like a moon-sick kitten. Kharjo finds this amusing." },
    { text: "Khajiit are known for many things. Kharjo will show you... someday." },
  ],
};

export default kharjoDialogue;