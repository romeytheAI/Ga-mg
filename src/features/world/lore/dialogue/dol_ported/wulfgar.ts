/**
 * Wulfgar Dialogue Module
 * 
 * Nord Bandit Enforcer
 * Location: Riften Ratway / Criminal Underworld
 * 
 * Ported from DOL (Degrees of Lewdity) and reskinned for Elder Scrolls
 * Original NPC: Wulfgar
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

export const wulfgarDialogue: NPCDialogue = {
  name: "Wulfgar",
  race: "Nord",
  role: "Bandit Enforcer",
  location: "Riften Ratway / Criminal Underworld",
  voiceTone: ["rough", "gruff", "intimidating", "mocking"],
  mannerisms: ["uses threats casually", "speaks of strength and dominance", "mocking laughter"],
  greeting: [
    { text: "Well, well. Look what wandered into the wrong part of town." },
    { text: "You lost, milk-drinker? This ain't no place for your kind." },
    { text: "Heh. Fresh meat. What's your business down here?" },
  ],
  farewell: [
    { text: "Yeah, you better walk away. And don't come back without coin." },
    { text: "Get outta here before I change my mind about lettin''you go." },
    { text: "Scram. And remember - you saw nothin''down here." },
  ],
  social: [
    { text: "The Ratway's got its own rules. You follow 'em, you live. You don't... well." },
    { text: "I run protection for the Guild. Means people pay me, or they get hurt." },
    { text: "Skyrim's full of soft folk. Easy marks for someone with the guts to take what they want." },
  ],
  work: [
    { text: "Got a job needs doin'? Might be I know some people. For the right price." },
    { text: "The Guild always needs muscle. You look like you can handle yourself... maybe." },
    { text: "Work? Hah! I take what I need. That's the only work I do." },
  ],
  comfort: [
    { text: "Toughen up. The world don't care about your problems." },
    { text: "You whinin''to me? I ain't your mother. Deal with it." },
    { text: "Everyone's got scars. Wear 'em like armor, not like chains." },
  ],
  praise: [
    { text: "Not bad. For a softskin, you got some spine." },
    { text: "Heh. You handled yourself alright. Maybe you ain't useless after all." },
    { text: "Impressive. Don't let it go to your head, though." },
  ],
  flirt: [
    { text: "Oh, you wantin''somethin''more? Might be we can work somethin''out..." },
    { text: "You're playin''with fire, sweet thing. Sure you can handle the heat?" },
    { text: "Bold. I like that in a... companion." },
  ],
  tease: [
    { text: "Aww, look at you. Like a little rabbit in a wolf's den." },
    { text: "What's wrong? Scared? You should be." },
    { text: "You couldn't handle me, milk-drinker. Don't even try." },
  ],
};

export default wulfgarDialogue;