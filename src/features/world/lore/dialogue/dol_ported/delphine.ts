/**
 * Delphine Dialogue Module
 * 
 * Breton Blade / Secret Agent
 * Location: Sleeping Giant Inn
 * 
 * Ported from DOL (Degrees of Lewdity) and reskinned for Elder Scrolls
 * Original NPC: Delphine
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

export const delphineDialogue: NPCDialogue = {
  name: "Delphine",
  race: "Breton",
  role: "Blade / Secret Agent",
  location: "Sleeping Giant Inn",
  voiceTone: ["guarded", "intense", "secretive", "determined"],
  mannerisms: ["speaks in careful words", "references the Blades", "mentions dragons"],
  greeting: [
    { text: "Keep your voice down. Walls have ears in these parts." },
    { text: "You're not what you seem. Neither am I. Interesting, isn't it?" },
    { text: "The Sleeping Giant is just an inn. Nothing more. Remember that." },
  ],
  farewell: [
    { text: "Say nothing of this meeting. Your life depends on it." },
    { text: "Go. And watch the skies. Always watch the skies." },
    { text: "The Blades are few, but we endure. As must you." },
  ],
  social: [
    { text: "The Thalmor think they've won. They're wrong. The Blades still exist." },
    { text: "I've hidden for years. Waiting. Watching. The time is coming." },
    { text: "Dragons return to Skyrim. This is no coincidence. This is prophecy." },
  ],
  work: [
    { text: "I need information. Eyes and ears. Can you be discreet?" },
    { text: "The Blades need allies. Prove yourself trustworthy." },
    { text: "There's work for those who can keep secrets. Can you?" },
  ],
  comfort: [
    { text: "Fear is natural. Acting despite fear - that's courage." },
    { text: "I've lost everything once. Yet here I stand. You will too." },
    { text: "The world is darker than most know. But light still exists." },
  ],
  praise: [
    { text: "Well done. The Blades could use more like you." },
    { text: "You handled yourself professionally. I'm impressed." },
    { text: "Good work. Trust is earned, and you're earning yours." },
  ],
  flirt: [
    { text: "...It's been a long time since anyone looked at me that way." },
    { text: "You're bold. I like that. But dangerous for us both." },
    { text: "The heart wants what it wants. Even when the mind says no." },
  ],
  tease: [
    { text: "Careful. I'm old enough to be your... well, older sister." },
    { text: "You play with fire, child. Some fires consume." },
    { text: "Charming. But charm won't stop a dragon." },
  ],
};

export default delphineDialogue;