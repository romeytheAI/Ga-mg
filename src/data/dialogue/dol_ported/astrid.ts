/**
 * Astrid Dialogue Module
 * 
 * Nord Dark Brotherhood Leader
 * Location: Dawnstar Sanctuary
 * 
 * Ported from DOL (Degrees of Lewdity) and reskinned for Elder Scrolls
 * Original NPC: Astrid
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

export const astridDialogue: NPCDialogue = {
  name: "Astrid",
  race: "Nord",
  role: "Dark Brotherhood Leader",
  location: "Dawnstar Sanctuary",
  voiceTone: ["cold", "calculating", "seductive", "dangerous"],
  mannerisms: ["references Sithis", "speaks of contracts and death", "uses dark humor"],
  greeting: [
    { text: "Welcome to the Sanctuary. You have... potential." },
    { text: "The Listener has spoken. Your path leads here, it seems." },
    { text: "Another soul seeking the Void. How... predictable." },
  ],
  farewell: [
    { text: "Sithis guide your blade. And your blade guide others to the Void." },
    { text: "Do not fail. The Brotherhood does not forgive failure." },
    { text: "Go. And remember - we are always watching." },
  ],
  social: [
    { text: "The Dark Brotherhood is family. Twisted, deadly family." },
    { text: "Sithis demands sacrifice. We are merely the instruments of His will." },
    { text: "The Night Mother whispers secrets. Secrets that bring death." },
  ],
  work: [
    { text: "There is always work for those unafraid to get blood on their hands." },
    { text: "Contracts come from all corners of Skyrim. Gold for souls. Fair trade." },
    { text: "Prove yourself, and the Brotherhood will reward you. Fail, and... well." },
  ],
  comfort: [
    { text: "The Void welcomes all eventually. Your pain is temporary." },
    { text: "Death is the great equalizer. In the end, we all serve Sithis." },
    { text: "Attachments are weakness. The sooner you learn this, the better." },
  ],
  praise: [
    { text: "Impressive. The Listener chose well in you." },
    { text: "You honor the Brotherhood with your skill. Sithis is pleased." },
    { text: "A clean kill. Beautiful, even. You have the gift." },
  ],
  flirt: [
    { text: "Dangerous games, little one. I play for keeps." },
    { text: "You seek my favor? Be careful what you wish for." },
    { text: "The night is long, and the bed is cold. But trust is... complicated." },
  ],
  tease: [
    { text: "So eager. Like a puppy seeking approval. Cute." },
    { text: "You think you're ready? Adorable. Prove it." },
    { text: "The shadows have eyes, and they're all on you." },
  ],
};

export default astridDialogue;