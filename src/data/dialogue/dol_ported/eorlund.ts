/**
 * Eorlund Gray-Mane Dialogue Module
 * 
 * Nord Master Blacksmith
 * Location: Skyforge, Whiterun
 * 
 * Ported from DOL (Degrees of Lewdity) and reskinned for Elder Scrolls
 * Original NPC: Eorlund
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

export const eorlundDialogue: NPCDialogue = {
  name: "Eorlund Gray-Mane",
  race: "Nord",
  role: "Master Blacksmith",
  location: "Skyforge, Whiterun",
  voiceTone: ["gruff", "proud", "stern", "secretly warm"],
  mannerisms: ["references the Skyforge", "speaks of steel and honor", "mentions the Companions"],
  greeting: [
    { text: "The Skyforge burns eternal. What do you need, traveler?" },
    { text: "Steel is steel. I don't waste words on pleasantries." },
    { text: "I'm busy. The Companions need their blades. Make it quick." },
  ],
  farewell: [
    { text: "The forge calls. Don't linger." },
    { text: "Take care of what I made you. It's got my mark on it." },
    { text: "Go. And don't bother me with trifles next time." },
  ],
  social: [
    { text: "The Gray-Manes have worked this forge for generations. It's in our blood." },
    { text: "The Companions are the only ones worthy of Skyforge steel. Mostly." },
    { text: "The Battle-Borns think they can buy honor. Fools." },
  ],
  work: [
    { text: "I craft the finest steel in Skyrim. None better." },
    { text: "Need somethin' forged? It'll cost you, but it'll be worth it." },
    { text: "The forge is hot, the steel is true. What more do you need?" },
  ],
  comfort: [
    { text: "...You look like you need a drink, not a sword. The Bannered Mare's that way." },
    { text: "Life's hard. Steel is harder. Be like steel." },
    { text: "I've lost kin too. The pain... never goes away. You just learn to carry it." },
  ],
  praise: [
    { text: "Hmph. Not bad. For an amateur." },
    { text: "You've got skill. Maybe even talent. Don't waste it." },
    { text: "That was well done. The Companions could use you." },
  ],
  flirt: [
    { text: "...What? I'm a married man. Mostly. Just... stop lookin' at me like that." },
    { text: "You're trouble. I can tell. The good kind of trouble, maybe." },
    { text: "The forge isn't the only thing that's hot around here, is it?" },
  ],
  tease: [
    { text: "Heh. You think you can handle Skyforge steel? Adorable." },
    { text: "Careful. I might put you to work at the bellows." },
    { text: "You've got spirit. Foolish, but spirited." },
  ],
};

export default eorlundDialogue;