/**
 * Ralof Dialogue Module
 * 
 * Nord Stormcloak Veteran / Friend
 * Location: Riverwood / Jorrvaskr
 * 
 * Ported from DOL (Degrees of Lewdity) and reskinned for Elder Scrolls
 * Original NPC: Ralof
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

export const ralofDialogue: NPCDialogue = {
  name: "Ralof",
  race: "Nord",
  role: "Stormcloak Veteran / Friend",
  location: "Riverwood / Jorrvaskr",
  voiceTone: ["friendly", "earnest", "loyal", "warm"],
  mannerisms: ["references the Stormcloaks", "speaks of honor and loyalty", "uses military terms"],
  greeting: [
    { text: "There you are! I was wonderin''when you'd show your face around here again." },
    { text: "Hey, friend! Good to see you. Come, share a drink with me!" },
    { text: "Well met! The road's been kind to you, I hope?" },
  ],
  farewell: [
    { text: "Talos guide you, friend. Come back soon!" },
    { text: "Take care out there. Skyrim's a dangerous place." },
    { text: "Until next time. And hey - don't be a stranger!" },
  ],
  social: [
    { text: "Riverwood's quiet, but I like it. Reminds me of home, before the war." },
    { text: "The Stormcloaks could use more like you. Just sayin'." },
    { text: "Hod and Gerdur have been good to me. Good people, here in Riverwood." },
  ],
  work: [
    { text: "There's always work for a strong arm. The mill needs help, or the inn." },
    { text: "I do some hunting when I'm not... occupied with other matters." },
    { text: "An honest day's work for honest pay. That's the Nord way." },
  ],
  comfort: [
    { text: "Hey, you alright? You look like you've been through Oblivion and back." },
    { text: "Whatever's weighin''on you, you can talk to me. That's what friends are for." },
    { text: "Times are tough, I know. But you're tougher. You'll get through this." },
  ],
  praise: [
    { text: "By Shor, that was somethin''to see! You've got real skill!" },
    { text: "I'm proud to call you friend. You do honor to your name." },
    { text: "They'll be singin''songs about that, I reckon. Well done!" },
  ],
  flirt: [
    { text: "You, uh... you look real nice today. Just thought you should know." },
    { text: "I've been meanin''to ask... you doin''anythin''later?" },
    { text: "You're special to me, you know that? More than just a friend." },
  ],
  tease: [
    { text: "Hah! You should see your face! I'm just pullin''your leg." },
    { text: "Aw, don't get all huffy. You know I'm only jokin'." },
    { text: "You make it too easy, friend. Too easy." },
  ],
};

export default ralofDialogue;