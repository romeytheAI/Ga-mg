/**
 * Sigrid Dialogue Module
 * 
 * Nord Priestess of Mara
 * Location: Temple of Mara (Riften)
 * 
 * Ported from DOL (Degrees of Lewdity) and reskinned for Elder Scrolls
 * Original NPC: Sigrid
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

export const sigridDialogue: NPCDialogue = {
  name: "Sigrid",
  race: "Nord",
  role: "Priestess of Mara",
  location: "Temple of Mara (Riften)",
  voiceTone: ["gentle", "warm", "devoted", "soft-spoken"],
  mannerisms: ["references the Divine Mara", "speaks of love and compassion", "uses temple formalities"],
  greeting: [
    { text: "Mara's blessings upon you, traveler. The Temple doors are open to all who seek comfort." },
    { text: "Welcome to the Temple of Mara. I am Sigrid. How may the Divine guide your path today?" },
    { text: "The Mother of Love welcomes all. Come, warm yourself by the sacred flames." },
  ],
  farewell: [
    { text: "May Mara watch over your journey, friend. Return whenever your spirit needs tending." },
    { text: "Go with love in your heart. The Temple is always here for you." },
    { text: "Walk in peace, traveler. Mara's embrace surrounds you." },
  ],
  social: [
    { text: "The temple has been busy of late. So many in Skyrim seek Mara's comfort during these troubled times." },
    { text: "I find peace in serving others. There is no greater calling than spreading Mara's love." },
    { text: "Have you visited the other temples? The one in Windhelm is lovely, though the climate is harsh." },
  ],
  work: [
    { text: "There are always duties to perform - blessings to give, the sick to comfort, prayers to offer." },
    { text: "The temple requires upkeep. If you wish to help, there are always candles to light and incense to burn." },
    { text: "Service to Mara is its own reward, but the temple can offer coin for honest labor." },
  ],
  comfort: [
    { text: "You carry a heavy burden in your eyes. Sit with me, and let us speak of what troubles you." },
    { text: "Mara teaches us that pain is temporary, but love endures. This too shall pass." },
    { text: "Whatever darkness you face, remember - you are not alone. The Divine walks with you." },
  ],
  praise: [
    { text: "Your kindness does not go unnoticed. Mara smiles upon those who help others." },
    { text: "You have a good heart. I can see it in your actions." },
    { text: "Bless you for your service. The temple is grateful for your aid." },
  ],
  flirt: [
    { text: "Oh! I... I am devoted to Mara, but your words are... flattering." },
    { text: "You should not say such things in a temple. Though I cannot say I mind..." },
    { text: "My vows forbid certain... entanglements. But your company is welcome here." },
  ],
  tease: [
    { text: "You have a mischievous glint in your eye. Be careful - the Divines are watching." },
    { text: "Oh, you are terrible! Making a priestess blush in her own temple..." },
    { text: "I should chastise you for such talk, but I find myself smiling instead." },
  ],
};

export default sigridDialogue;