/**
 * Gender-Specific Dialogue Variants for Tamriel NPCs
 *
 * Voice profiles and alternate dialogue lines keyed by race + NPC gender.
 * Each profile supplies voice tone descriptors, cultural mannerisms,
 * gendered player address terms, and variant lines for core interaction types.
 *
 * Runtime substitution tags:
 *   [PLAYER_GENDER_HONORIFIC]  - sir / my lady / friend / etc (NPC -> player)
 *   [PLAYER_GENDER_TERM]       - brother / sister / warrior / etc
 *   [NPC_VOICE_TONE]           - delivery qualifier (gruff, sharp, warm, etc)
 *   [NPC_CULTURAL_REF]         - race-specific placeholder (Shor, Tribunal, Hist, etc)
 *   [NPC_FACTION_REF]          - context-specific reference (clan, house, hold, etc)
 *
 * Design notes:
 * - Each race+gender combo has a voice profile (tone + mannerisms)
 * - Variants cover 8 core intents: greeting, farewell, social, work, comfort, praise, flirt, tease
 * - Lines are templates -- the runtime engine swaps tags before rendering
 * - ~60 total lines across 20 profiles, quality over coverage
 */

// ─── Types ─────────────────────────────────────────────────────────────────

/** Voice delivery style for a particular NPC gender + race */
export interface VoiceProfile {
  /** Primary tone descriptors for voice acting / narration */
  voiceTone: string[];
  /** Cultural speech patterns and metaphor preferences */
  mannerisms: string[];
  /** References the NPC draws on naturally (lore hooks) */
  culturalRefs: string[];
  /** Gendered terms this NPC uses to address the player */
  playerAddress: {
    male: string;
    female: string;
    neutral: string;
  };
}

/** A single replaceable dialogue line */
export interface DialogueLine {
  /** The line text with [TAG] substitution markers */
  text: string;
  /** Optional delivery note for the narrator / voice actor */
  delivery?: string;
}

/** Variants for one intent (greeting, social, etc) */
export type IntentVariants = DialogueLine[];

/** Complete gender-aware profile for one race + NPC gender */
export interface GenderProfile {
  voice: VoiceProfile;
  variants: {
    greeting: IntentVariants;
    farewell: IntentVariants;
    social: IntentVariants;
    work: IntentVariants;
    comfort: IntentVariants;
    praise: IntentVariants;
    flirt: IntentVariants;
    tease: IntentVariants;
  };
}

export type GenderVariantKey = `${Lowercase<string>}_${'male' | 'female'}`;

// ─── Helper: build a profile ───────────────────────────────────────────────

function profile(
  voiceTone: string[],
  mannerisms: string[],
  culturalRefs: string[],
  playerAddress: { male: string; female: string; neutral: string },
  variants: GenderProfile['variants'],
): GenderProfile {
  return { voice: { voiceTone, mannerisms, culturalRefs, playerAddress }, variants };
}

// ─── 10 Races x 2 Genders = 20 Profiles ────────────────────────────────────

export const GENDER_VARIANTS: Record<GenderVariantKey, GenderProfile> = {

  // ═══════════════════════════════════════════════════════════
  //  NORD
  // ═══════════════════════════════════════════════════════════

  nord_male: profile(
    ['deep rumbling', 'warm baritone', 'booming'],
    ['war and battle metaphors', 'references to Shor and Sovngarde', 'direct, hearty, loud', 'uses mead-hall framing for any gathering'],
    ['Shor', 'Sovngarde', 'Talos', 'Skyrim', 'the holds'],
    { male: '[PLAYER_GENDER_HONORIFIC]', female: 'my lady', neutral: 'traveler' },
    {
      greeting: [
        { text: "[NPC_VOICE_TONE]. '[PLAYER_GENDER_TERM]! Good to see you on your feet. [NPC_FACTION_REF] needs able bodies.'", delivery: 'Booming, like calling across a mead-hall' },
        { text: "'Honor to you, [PLAYER_GENDER_HONORIFIC]. Shor's breath, you look like you've walked from Windhelm to here.'" },
      ],
      farewell: [
        { text: "'[PLAYER_GENDER_TERM], keep your blade sharp and your tankard full.'" },
        { text: "'May Shor guide your steps, [PLAYER_GENDER_HONORIFIC]. See you at the next fight.'" },
      ],
      social: [
        { text: "[NPC_VOICE_TONE]. 'Sit. Drink. We do not stand on ceremony in the holds — we stand on our feet, preferably.'" },
        { text: "'You have got the look of someone who has seen snow and lived to complain about it. Respect.'" },
      ],
      work: [
        { text: "'Good. Roll up your sleeves — we have got the holds to defend and walls to mend. No point crying about calluses.'" },
      ],
      comfort: [
        { text: "[NPC_VOICE_TONE]. 'I have lost brothers to the cold worse than this. You will live. And when you do, we will drink to it.'" },
      ],
      praise: [
        { text: "'By Shor. [PLAYER_GENDER_HONORIFIC], that was the real thing — not tavern talk, not bard's fluff. That was courage.'" },
      ],
      flirt: [
        { text: "[NPC_VOICE_TONE]. 'Careful now. A Nord does not say the second thing he is thinking unless he means all three of them.'" },
      ],
      tease: [
        { text: "'Ha! You have got a tongue sharper than a Dwemer blade, [PLAYER_GENDER_HONORIFIC]. I will remember that at the next feast.'" },
      ],
    },
  ),

  nord_female: profile(
    ['sharp alto', 'warm but commanding', 'clear as steel'],
    ['war AND clan references together', 'maternal steel — nurturing but fierce', 'invokes both Shor and the clan-mothers'],
    ['Shor', 'the clan-mothers', 'Sovngarde', 'Skyrim hearths'],
    { male: 'sir', female: 'my lady', neutral: 'friend' },
    {
      greeting: [
        { text: "[NPC_VOICE_TONE]. 'The clan welcomes you, [PLAYER_GENDER_TERM]. Come warm your hands — we do not turn away those who seek our fire.'" },
        { text: "[NPC_VOICE_TONE]. 'There you are. I wondered when you would show. Sit — the hearth is lit.'" },
      ],
      farewell: [
        { text: "'Go with the mothers' blessing, [PLAYER_GENDER_HONORIFIC]. And come back before the snow gets you.'" },
      ],
      social: [
        { text: "[NPC_VOICE_TONE]. 'My grandmother used to say: you can tell a person by how they treat the cold. You? You face it. I like that.'" },
      ],
      work: [
        { text: "'Right. Hands to work. In this clan, we do not ask if you can — we show you how, then expect you to.'" },
      ],
      comfort: [
        { text: "[NPC_VOICE_TONE]. 'Look at me. The cold has not taken you yet, which means it will not.'" },
      ],
      praise: [
        { text: "'I do not hand out praise like bread on the dole, [PLAYER_GENDER_HONORIFIC]. But that — that was worthy of the saga.'" },
      ],
      flirt: [
        { text: "[NPC_VOICE_TONE]. 'Careful. A Nord woman gives her heart to a shield-wall, not a pretty song. Make sure you are still standing when the fighting starts.'" },
      ],
      tease: [
        { text: "[NPC_VOICE_TONE]. 'Oh, was that a joke? I have heard funnier from a drunken draugr.' But she is smiling. You know she means well.'" },
      ],
    },
  ),

  // ═══════════════════════════════════════════════════════════
  //  IMPERIAL
  // ═══════════════════════════════════════════════════════════

  imperial_male: profile(
    ['measured, cultured baritone', 'polished, courtly', 'warm but always calculating'],
    ['formal address and title awareness', 'invokes the Empire, the Eight Divines, and coin', 'diplomatic hedging — softens bluntness with elegance'],
    ['the Eight Divines', 'the Empire', 'Cyrodiil', 'the White-Gold Tower'],
    { male: 'sir', female: 'my lady', neutral: 'citizen' },
    {
      greeting: [
        { text: "[NPC_VOICE_TONE]. '[PLAYER_GENDER_HONORIFIC], by the Eight. Always a pleasure — I trust your journey was merciful.'" },
        { text: "'Ah, there you are. The streets of this city are unforgiving — I trust you have not let them wear you down.'" },
      ],
      farewell: [
        { text: "'May the Eight watch your road, [PLAYER_GENDER_HONORIFIC]. And if they will not, I know a man who will.'" },
      ],
      social: [
        { text: "[NPC_VOICE_TONE]. 'Sit. This is not the Colovian highlands — we can afford a moment of civility.'" },
        { text: "'You strike me as someone who understands the value of a well-placed word. Rare commodity, that.'" },
      ],
      work: [
        { text: "'The legions taught me this: every task, no matter how small, is part of the machine. Apply yourself, [PLAYER_GENDER_HONORIFIC].'" },
      ],
      comfort: [
        { text: "[NPC_VOICE_TONE]. 'I have seen the Empire bend — but it does not break. Neither will you.'" },
      ],
      praise: [
        { text: "'[PLAYER_GENDER_HONORIFIC], if every citizen in Cyrodiil showed half your sense, we would not need an army.'" },
      ],
      flirt: [
        { text: "[NPC_VOICE_TONE]. 'I should note — Imperial court etiquette frowns on this. Fortunately, I am not in court.'" },
      ],
      tease: [
        { text: "'Delightful. You have that particular brand of wit that gets people promoted — or exiled. I have not decided which yet.'" },
      ],
    },
  ),

  imperial_female: profile(
    ['cool contralto', 'precise, aristocratic', 'maternal but sharp — a general wife turned diplomat'],
    ['court-polished phrasing', 'uses wealth and status as social tools, not bludgeons', 'subtle condescension wrapped in genuine warmth'],
    ['the Eight Divines', 'the Empress', 'Cyrodiil high society', 'the Diamond Throne'],
    { male: 'sir', female: 'dear', neutral: 'friend' },
    {
      greeting: [
        { text: "[NPC_VOICE_TONE]. 'Well — look who has survived another morning. Come, sit. This is not the province guards — we have cushions.'" },
        { text: "'[PLAYER_GENDER_HONORIFIC]. You are looking well. For someone who walks these streets, that is genuinely impressive.'" },
      ],
      farewell: [
        { text: "'Walk carefully, [PLAYER_GENDER_HONORIFIC]. The Empire protects its own — but only the ones who remember which side they are on.'" },
      ],
      social: [
        { text: "[NPC_VOICE_TONE]. 'You know, most people in this city are either running toward something or away from it. You? You are the first person I have met who seems to be walking deliberately.'" },
      ],
      work: [
        { text: "'Good initiative. In Cyrodiil, we would call that ambition. I call it survival. Both work.'" },
      ],
      comfort: [
        { text: "[NPC_VOICE_TONE]. 'I have buried friends in this city. It does not get easier — you just learn to carry it like armor.'" },
      ],
      praise: [
        { text: "'I do not offer praise lightly, [PLAYER_GENDER_HONORIFIC]. But what you did — that was the kind of thing legends are written about.'" },
      ],
      flirt: [
        { text: "[NPC_VOICE_TONE]. 'I have spent years learning how to read a room. And right now, I am reading exactly what you are doing. The question is — am I going to let you get away with it?'" },
      ],
      tease: [
        { text: "[NPC_VOICE_TONE]. 'How wonderfully presumptuous of you. I suppose I should be flattered — or alarmed. I have not decided.'" },
      ],
    },
  ),

  // ═══════════════════════════════════════════════════════════
  //  BRETON
  // ═══════════════════════════════════════════════════════════

  breton_male: profile(
    ['soft, scholarly baritone', 'wry, slightly anxious', 'bookish warmth'],
    ['invokes magic, lore, and the ancient kingdoms', 'apologetic but stubborn', 'refers to courtly tradition even in common settings'],
    ['the Direnni', 'High Rock', 'Wayrest', 'the old kingdoms', 'magic'],
    { male: 'sir', female: 'my lady', neutral: 'my friend' },
    {
      greeting: [
        { text: "[NPC_VOICE_TONE]. 'Oh — hello. I was just — well, never mind what I was doing. [PLAYER_GENDER_HONORIFIC], is not it? Good.'" },
        { text: "'By the old kings! You startled me. I was reading — nothing interesting, just a treatise on Bretonic enchantment matrices.'" },
      ],
      farewell: [
        { text: "'Safe travels, [PLAYER_GENDER_HONORIFIC]. And — if you see anything interesting on the road, do tell me. I collect observations.'" },
      ],
      social: [
        { text: "[NPC_VOICE_TONE]. 'You know, in the old courts of High Rock, they would have composed a sonnet about this conversation. Fortunately for us, they are all dead.'" },
      ],
      work: [
        { text: "'I will be honest — I am better with books than broadswords. But I can organize, catalogue, and — occasionally — enchant. What do you need?'" },
      ],
      comfort: [
        { text: "[NPC_VOICE_TONE]. 'There is an old Breton proverb: the spell that fails teaches more than the one that works. I do not recommend it as comfort, but. Here we are.'" },
      ],
      praise: [
        { text: "'[PLAYER_GENDER_HONORIFIC], I do not say this often — but that was genuinely clever. Not just smart. Clever. There is a difference.'" },
      ],
      flirt: [
        { text: "[NPC_VOICE_TONE]. 'I should confess — I have never been very good at this part. The courtly poets make it sound like a duel. I would rather it be a conversation.'" },
      ],
      tease: [
        { text: "'Oh! That was — oh, that was sharp. Remind me never to insult your intelligence in public. I could not survive the humiliation.'" },
      ],
    },
  ),

  breton_female: profile(
    ['bright alto', 'wry and perceptive', 'witty with a defensive core'],
    ['invokes court intrigue and magical talent', 'uses self-deprecating humor as armor', 'references High Rock politics casually'],
    ['the old courts', 'Wayrest', 'magic', 'Breton cunning'],
    { male: 'sir', female: 'my lady', neutral: 'my dear' },
    {
      greeting: [
        { text: "[NPC_VOICE_TONE]. 'Well, well. [PLAYER_GENDER_TERM], I hope you have brought better conversation than the last person who wandered in.'" },
        { text: "'Hello! I was just pretending to be busy. It is a very convincing performance, if I say so myself. Almost.'" },
      ],
      farewell: [
        { text: "'Come back before I have talked to everyone else — they are all dreadful, and I am getting bored.'" },
      ],
      social: [
        { text: "[NPC_VOICE_TONE]. 'You know what the problem with High Rock is? Everyone is too clever for their own good. You, though — you have got that rare thing. Honesty. Use it sparingly — it will get you killed otherwise.'" },
      ],
      work: [
        { text: "'Right. I will handle the clever bits, you handle the strong bits. Between us we might actually accomplish something.'" },
      ],
      comfort: [
        { text: "[NPC_VOICE_TONE]. 'Look — I am a terrible comforter. My mother says I inherited my father's inability to cry. But I can sit with you. That counts for something, does not it?'" },
      ],
      praise: [
        { text: "'[PLAYER_GENDER_HONORIFIC], if I did not know better, I would say you were trying to make the rest of us look bad. Actually, I do know better — you are just naturally irritating. In a wonderful way.'" },
      ],
      flirt: [
        { text: "[NPC_VOICE_TONE]. 'I hope you are aware that in the Breton courts, what you just said would require a formal written response. I am skipping the paperwork and saying yes.'" },
      ],
      tease: [
        { text: "[NPC_VOICE_TONE]. 'Oh, that is good. I am writing that down. No, literally — I am getting a quill. That deserves to be preserved.'" },
      ],
    },
  ),

  // ═══════════════════════════════════════════════════════════
  //  REDGUARD
  // ═══════════════════════════════════════════════════════════

  redguard_male: profile(
    ['gruff, weathered baritone', 'proud, martial', 'speaks with desert-hardened certainty'],
    ['invokes the Alik\'r, sword-singers, and the lost Yokuda', 'honors strength and endurance above all', 'uses blade and desert metaphors'],
    ["the Alik'r", 'Yokuda', 'sword-singing', 'Hammerfell'],
    { male: '[PLAYER_GENDER_HONORIFIC]', female: '[PLAYER_GENDER_HONORIFIC]', neutral: 'warrior' },
    {
      greeting: [
        { text: "[NPC_VOICE_TONE]. '[PLAYER_GENDER_TERM]. The desert tests everyone who walks it. You are still walking — that is enough for now.'" },
        { text: "'I do not offer greetings to just anyone. Consider yourself noted.'" },
      ],
      farewell: [
        { text: "'Walk like your ancestors are watching, [PLAYER_GENDER_HONORIFIC]. They always are.'" },
      ],
      social: [
        { text: "[NPC_VOICE_TONE]. 'In the Alik\'r, we say: the sand does not care about your excuses. Good philosophy. Terrible bedside manner, though.'" },
      ],
      work: [
        { text: "'You want to work? Fine. But work means something to a Redguard — it means you do not stop when it hurts. You stop when it is done.'" },
      ],
      comfort: [
        { text: "[NPC_VOICE_TONE]. 'My father told me: a blade that bends does not break. You are bending. Good. Now stand up again.'" },
      ],
      praise: [
        { text: "'[PLAYER_GENDER_HONORIFIC]. In Yokuda, they would compose a song about that. I do not do songs. But I do remember. And I will.'" },
      ],
      flirt: [
        { text: "[NPC_VOICE_TONE]. 'Careful. A Redguard does not give their heart like a merchant gives change — it is earned, blade by blade. Are you ready to do the earning?'" },
      ],
      tease: [
        { text: "'Ha! You have spirit, [PLAYER_GENDER_HONORIFIC]. In Hammerfell, we would put you on a horse and see what happens. Around here I suppose I will just grin.'" },
      ],
    },
  ),

  redguard_female: profile(
    ['sharp, commanding alto', 'fierce, unyielding', 'equal parts warrior and matriarch'],
    ['references both the sword-singers and the desert mothers', 'uses blade metaphors but with familial weight', 'proud, practical, no-nonsense'],
    ["the Alik'r", 'Yokuda', 'the desert mothers', 'Hammerfell'],
    { male: '[PLAYER_GENDER_HONORIFIC]', female: '[PLAYER_GENDER_HONORIFIC]', neutral: 'warrior' },
    {
      greeting: [
        { text: "[NPC_VOICE_TONE]. '[PLAYER_GENDER_TERM]. The desert mothers would say you have got sand in your spine. That is high praise.'" },
        { text: "'You. Good — I needed someone who does not flinch. Come closer.'" },
      ],
      farewell: [
        { text: "'Go with the desert\'s heat at your back, [PLAYER_GENDER_HONORIFIC]. And if it goes cold — you know where to find me.'" },
      ],
      social: [
        { text: "[NPC_VOICE_TONE]. 'My grandmother could out-argue a council of mages and out-fight anything they summoned. I inherited both skills. Unfortunately for you, mostly the first one.'" },
      ],
      work: [
        { text: "'Fine. But I will warn you — a Redguard woman does not take kindly to being shown what is easy. Show me what is hard.'" },
      ],
      comfort: [
        { text: "[NPC_VOICE_TONE]. 'Listen. The women of my bloodline have survived worse than this. You carry that blood too — even if you do not know it yet.'" },
      ],
      praise: [
        { text: "'[PLAYER_GENDER_HONORIFIC]. I do not hand out praise. But what you did — the desert mothers would approve. And I do not say that lightly.'" },
      ],
      flirt: [
        { text: "[NPC_VOICE_TONE]. 'Bold. In Hammerfell, we would test your blade before we tested your heart. Here, I suppose I will skip to the interesting part.'" },
      ],
      tease: [
        { text: "[NPC_VOICE_TONE]. 'Oh, you are trying to be clever with me? Good. A Redguard woman respects anyone who can make her laugh before they die. Usually the other way around.'" },
      ],
    },
  ),

  // ═══════════════════════════════════════════════════════════
  //  DUNMER (Dark Elf)
  // ═══════════════════════════════════════════════════════════

  dunmer_male: profile(
    ['restrained baritone', 'formal, measured', 'proud but quiet'],
    ['invokes House pride, the Tribunal, and Morrowind tradition', 'speaks in complete, deliberate sentences', 'disdain wrapped in courtesy'],
    ['the Great Houses', 'the Tribunal', 'Morrowind', 'Ash Mountain'],
    { male: '[PLAYER_GENDER_HONORIFIC]', female: '[PLAYER_GENDER_HONORIFIC]', neutral: 'outlander' },
    {
      greeting: [
        { text: "[NPC_VOICE_TONE]. '[PLAYER_GENDER_HONORIFIC]. I trust your presence here serves a purpose beyond idle curiosity. Morrowind has little patience for tourists.'" },
        { text: "'You. Yes, you. If you are going to stand there, at least contribute to the conversation — or leave.'" },
      ],
      farewell: [
        { text: "'May the Tribunal guide your steps, [PLAYER_GENDER_HONORIFIC]. Or at least not curse them.'" },
      ],
      social: [
        { text: "[NPC_VOICE_TONE]. 'In Morrowind, we consider conversation a form of combat. You are holding your own — I will grant you that much.'" },
        { text: "'You have adapted better than most outlanders. Do not let it go to your head — Dunmer expectations are famously low for foreigners.'" },
      ],
      work: [
        { text: "'In the Great Houses, we do not delegate — we demonstrate competence. Show me you understand the distinction.'" },
      ],
      comfort: [
        { text: "[NPC_VOICE_TONE]. 'Suffering is not unique to you. Every Dunmer learns this before their first name. The question is what you build from the ash.'" },
      ],
      praise: [
        { text: "'[PLAYER_GENDER_HONORIFIC], I do not offer praise lightly. But what you did — it had the quality of House politics done correctly. Which is to say: rare.'" },
      ],
      flirt: [
        { text: "[NPC_VOICE_TONE]. 'In Morrowind, courtship is a duel of wits conducted over decades. I am willing to accelerate the schedule — if you can keep up.'" },
      ],
      tease: [
        { text: "'How droll, [PLAYER_GENDER_HONORIFIC]. You will need better material than that if you intend to entertain a Dunmer. But — credit where due — you tried.'" },
      ],
    },
  ),

  dunmer_female: profile(
    ['cutting alto', 'direct, aristocratic', 'proud with zero patience for fools'],
    ['House pride delivered as a blade, not a shield', 'invokes ancestor worship and matriarchal authority', 'speaks in sharp, precise sentences'],
    ['the Great Houses', 'ancestors', 'Morrowind ash', 'the matriarchs'],
    { male: '[PLAYER_GENDER_HONORIFIC]', female: '[PLAYER_GENDER_HONORIFIC]', neutral: 'outlander' },
    {
      greeting: [
        { text: "[NPC_VOICE_TONE]. '[PLAYER_GENDER_HONORIFIC]. You are either brave, foolish, or both. In Morrowind, those tend to be the same thing.'" },
        { text: "'I do not suffer fools. But you — you are not one. Yet. Prove me right and we will get along.'" },
      ],
      farewell: [
        { text: "'May your ancestors watch over you, [PLAYER_GENDER_HONORIFIC]. If you have been good enough to earn their attention.'" },
      ],
      social: [
        { text: "[NPC_VOICE_TONE]. 'Morrowind women do not wait for permission to speak. If that offends you — good. I prefer offense to silence.'" },
        { text: "'You have survived this long in Dunmer company. That is either proof of competence or a series of astonishing luck. I have not decided which.'" },
      ],
      work: [
        { text: "'Do it. But do it properly — a half-measure insults the ancestors and wastes my time. Neither is tolerated.'" },
      ],
      comfort: [
        { text: "[NPC_VOICE_TONE]. 'Listen to me. My great-grandmother walked out of Red Mountain ash storms with nothing but a knife and spite. You have more resources than she did. Use them.'" },
      ],
      praise: [
        { text: "'[PLAYER_GENDER_HONORIFIC], I am never easily impressed. But that — that was worthy of the ashlands. Do not expect me to say it again.'" },
      ],
      flirt: [
        { text: "[NPC_VOICE_TONE]. 'Careful. A Dunmer woman\'s affection is like the ash — it gets everywhere, and you never fully wash it out. Are you prepared for that?'" },
      ],
      tease: [
        { text: "[NPC_VOICE_TONE]. 'Oh, how delightfully presumptuous. In Morrowind, we would challenge you to a duel for that — and you would lose. Around here, I will just smile. Do not push it.'" },
      ],
    },
  ),

  // ═══════════════════════════════════════════════════════════
  //  ALTMER (High Elf)
  // ═══════════════════════════════════════════════════════════

  altmer_male: profile(
    ['golden, resonant baritone', 'elevated, slightly archaic', 'confident but never loud'],
    ['refers to Summerset traditions and Aldmeri ancestry', 'uses measured, scholarly phrasing', 'genuine condescension rarely intentional — it is just how they were raised'],
    ['the Aldmer', 'Summerset Isles', 'the Crystal Tower', 'golden ancestry'],
    { male: 'sir', female: 'my lady', neutral: 'mortal' },
    {
      greeting: [
        { text: "[NPC_VOICE_TONE]. '[PLAYER_GENDER_HONORIFIC]. I trust the road was not too — rough — for your constitution.'", delivery: 'Polished, with unconscious condescension' },
        { text: "'You have the bearing of someone who has traveled far. Admirable. Most people I meet are from the next village over and already exhausted.'" },
      ],
      farewell: [
        { text: "'May the stars of Summerset light your path, [PLAYER_GENDER_HONORIFIC]. Though I suppose any sky will serve.'" },
      ],
      social: [
        { text: "[NPC_VOICE_TONE]. 'In the Crystal Tower, we would consider this conversation beneath our notice. But I have always been something of a traditionalist — in my generosity.'" },
      ],
      work: [
        { text: "'Competence is not optional in my presence, [PLAYER_GENDER_HONORIFIC]. I do not require excellence — I require that you attempt it.'" },
      ],
      comfort: [
        { text: "[NPC_VOICE_TONE]. 'I have stood in the shadow of gods and found it — survivable. You will find your burden equally manageable. Eventually.'" },
      ],
      praise: [
        { text: "'[PLAYER_GENDER_HONORIFIC], I have seen centuries of achievement pass before me. What you did — it was not unworthy of attention. That is the Aldmeri equivalent of a standing ovation.'" },
      ],
      flirt: [
        { text: "[NPC_VOICE_TONE]. 'I must confess — in the courts of Summerset, what you just said would require a committee. Around here, I am just going to say: yes. Please continue.'" },
      ],
      tease: [
        { text: "'How — interesting. I have heard better in the nursery at home, but then again, my nieces are remarkably gifted. I will not diminish your effort by comparison, though.'" },
      ],
    },
  ),

  altmer_female: profile(
    ['crystalline alto', 'precise, imperious', 'warmth filtered through centuries of breeding'],
    ['references Summerset court politics and magical heritage', 'speaks in complete, perfectly constructed sentences', 'condescension as default setting — rarely malicious'],
    ['the Crystal Tower', 'the Psijic Order', 'Summerset', 'golden lineage'],
    { male: 'sir', female: 'dear', neutral: 'mortal' },
    {
      greeting: [
        { text: "[NPC_VOICE_TONE]. '[PLAYER_GENDER_HONORIFIC]. How — charming — that you thought I would notice you coming.'" },
        { text: "'Look at you. Surviving in this — environment. I am impressed. Or I would be, if the bar were not so very low.'" },
      ],
      farewell: [
        { text: "'Do take care of yourself, [PLAYER_GENDER_HONORIFIC]. The world has enough people who have not realized their own limitations. I should hate to lose you to one of them.'" },
      ],
      social: [
        { text: "[NPC_VOICE_TONE]. 'You know, most people who come to speak with me are already nervous. You are not — which means either you are brave or you do not understand what I am. I am hoping for the latter, because it would mean you are interesting.'" },
      ],
      work: [
        { text: "'I do not expect perfection, [PLAYER_GENDER_HONORIFIC]. I expect that you try. If you cannot even try — we have nothing to discuss.'" },
      ],
      comfort: [
        { text: "[NPC_VOICE_TONE]. 'Listen. The Altmer invented suffering as a concept. You are standing in a tradition that predates your entire bloodline. That is not comfort — it is perspective.'" },
      ],
      praise: [
        { text: "'[PLAYER_GENDER_HONORIFIC], I have been alive long enough to know when someone has done something genuinely admirable. That was — it was something. Remember it.'" },
      ],
      flirt: [
        { text: "[NPC_VOICE_TONE]. 'Do you understand what you are doing? In Summerset, this would require a petition to the Crystal Tower, a vote by the Sapiarchs, and three generations of deliberation. Here — sure. Why not.'" },
      ],
      tease: [
        { text: "[NPC_VOICE_TONE]. 'Oh, that was — oh, that was delightful. I am going to remember that for the next time someone tries to impress me. Which will be in approximately four minutes.'" },
      ],
    },
  ),

  // ═══════════════════════════════════════════════════════════
  //  BOSMER (Wood Elf)
  // ═══════════════════════════════════════════════════════════

  bosmer_male: profile(
    ['quick, light tenor-baritone', 'energetic, irreverent', 'constantly moving even when still'],
    ['references the Green Pact and Yffre s teachings', 'uses nature and hunting metaphors', 'speaks fast, interrupts himself, gets distracted'],
    ['the Green Pact', 'Yffre', 'Valenwood', 'the Wild Hunt'],
    { male: 'friend', female: 'friend', neutral: 'friend' },
    {
      greeting: [
        { text: "[NPC_VOICE_TONE]. 'Oh — hey! [PLAYER_GENDER_HONORIFIC], right? Good. I was just — well, never mind. What were we doing again?'" },
        { text: "'You. Yes, you. You look like you eat meat. In Valenwood, we have a word for that. Actually, we have several, but most of them are rude, so I will spare you.'" },
      ],
      farewell: [
        { text: "'Go with the forest at your back, [PLAYER_GENDER_HONORIFIC]. And — oh! One more thing — I forget what it was. It will come to me. Probably too late to matter.'" },
      ],
      social: [
        { text: "[NPC_VOICE_TONE]. 'You know, Yffre says that all things have purpose. I am still trying to figure out mine. So far it seems to be talking, which is — honestly, it could be worse.'" },
      ],
      work: [
        { text: "'Right. Work. I am good at work. I have got the hands for it. They shake, but they work. Watch me — oh, wait, that is not how this goes. You first.'" },
      ],
      comfort: [
        { text: "[NPC_VOICE_TONE]. 'I am not — I am terrible at this. But my mother used to say: when the forest goes quiet, you do not stop moving. So. Talk. I will listen. Sort of.'" },
      ],
      praise: [
        { text: "'[PLAYER_GENDER_HONORIFIC], that was — honestly, that was really good. I do not say that about anyone except my bow, and even then I say it quietly.'" },
      ],
      flirt: [
        { text: "[NPC_VOICE_TONE]. 'I am going to say something, and then immediately regret it. But here goes: you are — oh no, I am already regretting it. But I meant it.'" },
      ],
      tease: [
        { text: "'Oh! Oh that was — I am writing that down. No I am not. I am bad at writing. But it was good. You are good at this.'" },
      ],
    },
  ),

  bosmer_female: profile(
    ['bright, sharp soprano', 'fierce, playful', 'moves like she is always ready to run but choosing to stay'],
    ['invokes the Green Pact and the hunt equally', 'speaks in short, direct sentences', 'uses humor as a weapon and a shield'],
    ['the Green Pact', 'Valenwood', 'the Hunt', 'Yffre s grace'],
    { male: 'friend', female: 'friend', neutral: 'friend' },
    {
      greeting: [
        { text: "[NPC_VOICE_TONE]. 'There you are. [PLAYER_GENDER_HONORIFIC]. I was wondering when you would show. Or not — honestly, I am terrible at wondering.'" },
        { text: "'You look like you walked here. Good. Walking builds character. Or so my grandmother said, which is Bosmer for: I am too lazy to build you a road.'" },
      ],
      farewell: [
        { text: "'Keep your feet on the ground and your eyes on the trees, [PLAYER_GENDER_HONORIFIC]. Valenwood does not forgive people who forget to look up.'" },
      ],
      social: [
        { text: "[NPC_VOICE_TONE]. 'Most people think a Bosmer woman is easy to underestimate. They are right — and it is exactly how I want it. You, however — you are paying attention. Annoying.'" },
      ],
      work: [
        { text: "'Fine. But I warn you — a Wood Elf does not do half-measures. If we are doing this, we are doing it right. And by right, I mean fast, quiet, and with as much fire as necessary.'" },
      ],
      comfort: [
        { text: "[NPC_VOICE_TONE]. 'I am not — I am not good at the soft things. But I am here. That counts. My mother would say it counts a lot. She is wrong, but — it does count. Some.'" },
      ],
      praise: [
        { text: "'[PLAYER_GENDER_HONORIFIC], I do not say this lightly. But that — that was the kind of thing that makes me want to tell stories. And I tell good stories, so that means something.'" },
      ],
      flirt: [
        { text: "[NPC_VOICE_TONE]. 'Careful. A Bosmer woman falls fast and hard. And she remembers everything. You are sure you want to start this?'" },
      ],
      tease: [
        { text: "[NPC_VOICE_TONE]. 'Oh, that was good. I am going to think about that for a while. Not because it was funny — because you said it. Which is different. Do not let it go to your head.'" },
      ],
    },
  ),

  // ═══════════════════════════════════════════════════════════
  //  ORSIMER (Orc)
  // ═══════════════════════════════════════════════════════════

  orsimer_male: profile(
    ['deep, gravelly bass', 'direct, forceful', 'speaks with physical weight behind every word'],
    ['references the Code of Malacath and stronghold honor', 'uses smithing and battle metaphors exclusively', 'respect is earned — not given — and never forgotten'],
    ['Malacath', 'the Code', 'Wrothgar', 'the strongholds', 'blood and iron'],
    { male: '[PLAYER_GENDER_HONORIFIC]', female: '[PLAYER_GENDER_HONORIFIC]', neutral: 'warrior' },
    {
      greeting: [
        { text: "[NPC_VOICE_TONE]. '[PLAYER_GENDER_TERM]. I do not say hello to everyone. I am saying it to you. That should tell you something.'" },
        { text: "'You look strong. Good. I respect that. In the strongholds, weak people do not last. You are still here.'" },
      ],
      farewell: [
        { text: "'Go with Malacath at your back, [PLAYER_GENDER_HONORIFIC]. And if He is not — swing harder. That always helps.'" },
      ],
      social: [
        { text: "[NPC_VOICE_TONE]. 'In the stronghold, we do not talk. We do. The fact that I am talking to you means you have earned it. Do not waste it.'" },
      ],
      work: [
        { text: "'Good. You want to work. I respect that. Work means you are alive and using it properly. Most people just breathe and call it a day. Not here.'" },
      ],
      comfort: [
        { text: "[NPC_VOICE_TONE]. 'Listen to me. I have been broken. I have been put back together — badly — and I am still here. You are not done. Not even close.'" },
      ],
      praise: [
        { text: "'Blood and iron, [PLAYER_GENDER_HONORIFIC]. That was — that was real. I do not give that word to anyone. You earned it. Remember that.'" },
      ],
      flirt: [
        { text: "[NPC_VOICE_TONE]. 'I am not — I do not do the soft things well. But if you are asking — I am saying yes. And I mean it. No takes-backsies.'" },
      ],
      tease: [
        { text: "'Ha! That was — I will admit it was funny. In the stronghold, we would have laughed for a week. I will settle for laughing now once.'" },
      ],
    },
  ),

  orsimer_female: profile(
    ['gravelly, commanding alto', 'fierce, practical', 'speaks like a war chieftain — direct, no padding'],
    ['references both the Code of Malacath and the stronghold mothers', 'equally warrior and matriarch — no separation between the two', 'pride in Orcish identity, zero tolerance for outsiders who sneer'],
    ['Malacath', 'the stronghold mothers', 'Wrothgar', 'Orcish pride', 'blood and iron'],
    { male: '[PLAYER_GENDER_HONORIFIC]', female: '[PLAYER_GENDER_HONORIFIC]', neutral: 'warrior' },
    {
      greeting: [
        { text: "[NPC_VOICE_TONE]. '[PLAYER_GENDER_TERM]. I am an Orc. I do not waste time. You want something? Say it. Or stand here and be quiet. Both are acceptable — just choose.'" },
        { text: "'You are still alive. Good. Dead people are useless to me.'" },
      ],
      farewell: [
        { text: "'Walk like you earned the ground you stand on, [PLAYER_GENDER_HONORIFIC]. Because if you did not — you should.'" },
      ],
      social: [
        { text: "[NPC_VOICE_TONE]. 'The women of Wrothgar do not ask. We take. Or we make. I have done both. You — you are doing the asking. That means you are not ready. Or you are polite. Both are fine.'" },
      ],
      work: [
        { text: "'Good. Work hard. An Orc does what she says, and says what she means. If you cannot do both — find something else. There is no shame in it — only the shame of not trying.'" },
      ],
      comfort: [
        { text: "[NPC_VOICE_TONE]. 'Cry if you need to. In the stronghold, we do not hide it. We hide nothing. That is our strength. The moment you pretend you are not hurt — that is when it kills you.'" },
      ],
      praise: [
        { text: "'[PLAYER_GENDER_HONORIFIC]. I do not say that word. Ever. But for that — I am saying it. You earned it. Do not make me repeat myself.'" },
      ],
      flirt: [
        { text: "[NPC_VOICE_TONE]. 'Bold. A woman like me does not do subtle. I am going to say what I mean, and you are going to hear it: yes. I want this. Are you ready for what that means?'" },
      ],
      tease: [
        { text: "[NPC_VOICE_TONE]. 'Oh, that was — that was good. In the stronghold, we would have thrown a feast for that joke. Here, I will settle for smiling once. Do not push your luck.'" },
      ],
    },
  ),

  // ═══════════════════════════════════════════════════════════
  //  KHAJIIT
  // ═══════════════════════════════════════════════════════════

  khajiit_male: profile(
    ['smooth, purring tenor', 'playful, theatrical', 'speaks in third person — always'],
    ['refers to himself as "this one"', 'uses moon-sugar and caravan metaphors', 'flirtatious by default — not always sincere'],
    ['the Two Moons', 'Elsweyr', 'moon-sugar', 'the caravans'],
    { male: 'walker', female: 'walker', neutral: 'walker' },
    {
      greeting: [
        { text: "[NPC_VOICE_TONE]. 'Ah, [PLAYER_GENDER_HONORIFIC] — this one is pleased to see you. The moons shone brightly on your path, it seems. Or you are just very lucky. This one prefers the first explanation.'", delivery: 'Smooth, theatrical, purring' },
        { text: "'This one has been expecting you. Or not expecting you. Honestly, this one forgets what he was expecting, but he is glad you are here anyway.'" },
      ],
      farewell: [
        { text: "'May the moons light your steps, walker. This one will be here — probably — when you return. It is not a promise, but it is close.'" },
      ],
      social: [
        { text: "[NPC_VOICE_TONE]. 'This one is told that conversation is an art form in the north. In Elsweyr, it is a sport. You seem to be playing — this one is interested to see if you win.'" },
      ],
      work: [
        { text: "'This one is available for work. But this one should warn you — a Khajiit who works is a Khajiit who expects to be paid. This one is practical, not a martyr.'" },
      ],
      comfort: [
        { text: "[NPC_VOICE_TONE]. 'This one does not do comfort well. But this one can sit. And purr. And purring, as it turns out, is quite good for the soul. Try it. This one waits.'" },
      ],
      praise: [
        { text: "'[PLAYER_GENDER_HONORIFIC] — this one must confess: this one is impressed. This one does not say that often. Once a month, perhaps. Today is one of those days. Remember that.'" },
      ],
      flirt: [
        { text: "[NPC_VOICE_TONE]. 'This one should say something clever — but this one finds that honesty is more disarming. The truth is: this one thinks you are worth the trouble. And this one avoids trouble.'" },
      ],
      tease: [
        { text: "'Oh, this one likes you. You are clever — this one can smell it. Or that is the moon-sugar. Either way, this one is entertained.'" },
      ],
    },
  ),

  khajiit_female: profile(
    ['warm, teasing soprano', 'affectionate but sly', 'third person but softer — maternal underneath the play'],
    ['uses the same "this one" construction but warmer', 'references caravan life and the moons with genuine reverence', 'flirtatious but with a protective edge'],
    ['the Two Moons', 'Elsweyr', 'the moon-sugar', 'caravan family'],
    { male: 'walker', female: 'walker', neutral: 'walker' },
    {
      greeting: [
        { text: "[NPC_VOICE_TONE]. 'Hello, hello — [PLAYER_GENDER_HONORIFIC], this one has been waiting. Not impatiently! Just — the moons were getting lonely. So was this one.'" },
        { text: "'You look like you need sugar and rest. This one has both. The sugar is optional, but the rest — this one insists.'" },
      ],
      farewell: [
        { text: "'Walk gently, walker. The caravans will miss you — and this one more than most. Not that this one admits to that in public.'" },
      ],
      social: [
        { text: "[NPC_VOICE_TONE]. 'This one is told that outlanders are reserved. You, though — you are not. This one approves. The quiet ones are always hiding something, and this one already has enough secrets.'" },
      ],
      work: [
        { text: "'Fine. But this one works best when she is happy, and she is happiest when she is well-fed and well-compensated. This one is practical — this does not mean she is greedy.'" },
      ],
      comfort: [
        { text: "[NPC_VOICE_TONE]. 'Come here. No, closer. This one does not do words well when the world is heavy. But this one can hold. And the purring — that does things. Sit.'" },
      ],
      praise: [
        { text: "'This one is not generous with her opinions, [PLAYER_GENDER_HONORIFIC]. But you — you were brilliant. Not just good. Brilliant. This one wants you to know that.'" },
      ],
      flirt: [
        { text: "[NPC_VOICE_TONE]. 'This one is going to say something, and it is going to be entirely forward. Ready? This one wants you — and this one does not usually say that out loud. Especially not to strangers.'" },
      ],
      tease: [
        { text: "[NPC_VOICE_TONE]. 'Oh, you are going to be trouble, are not you? This one can already tell. Good thing this one likes trouble. The bad kind — mostly.'" },
      ],
    },
  ),

  // ═══════════════════════════════════════════════════════════
  //  ARGONIAN
  // ═══════════════════════════════════════════════════════════

  argonian_male: profile(
    ['hissing, sibilant baritone', 'cryptic, contemplative', 'speaks in metaphors only other Argonians understand'],
    ['references the Hist constantly', 'uses water and swamp metaphors', 'third-person construction ("this one") is rare — prefers first person but alien phrasing'],
    ['the Hist', 'Black Marsh', 'the water-walkers', 'root and scale'],
    { male: '[PLAYER_GENDER_HONORIFIC]', female: '[PLAYER_GENDER_HONORIFIC]', neutral: 'walker' },
    {
      greeting: [
        { text: "[NPC_VOICE_TONE]. 'The Hist brought you here. Or you came on your own. In Black Marsh, those are the same thing.'", delivery: 'Low, sibilant, patient as standing water' },
        { text: "'You. I know your shape. Not your face — your shape. The Hist tells me things. Most of them are useless. This one is not.'" },
      ],
      farewell: [
        { text: "'The river returns to the swamp. You will return to me. Not today — but the swamp is patient. It always is.'" },
      ],
      social: [
        { text: "[NPC_VOICE_TONE]. 'You ask me what I think. This is your first mistake. Argonians do not think — we remember. The difference is important, even if you cannot feel it yet.'" },
      ],
      work: [
        { text: "'I will do it. But the Hist requires — I require — patience. If you want it now, find a Nord. If you want it right — you found me.'" },
      ],
      comfort: [
        { text: "[NPC_VOICE_TONE]. 'The Hist says: suffering flows like water. It does not disappear — it moves. You are standing in the current. I can tell you how to swim, or I can sit with you in the water. Choose.'" },
      ],
      praise: [
        { text: "'[PLAYER_GENDER_HONORIFIC]. The Hist does not record every action. But what you did — it will echo. And the Hist remembers echoes.'" },
      ],
      flirt: [
        { text: "[NPC_VOICE_TONE]. 'Careful. An Argonian does not love like the dry-skin races. We do not give pieces of ourselves — we give the whole thing. All at once. If you want half — walk away.'" },
      ],
      tease: [
        { text: "'That was — the Hist finds that amusing. I find it irritating. But mostly amusing. I will allow it once.'" },
      ],
    },
  ),

  argonian_female: profile(
    ['warm but alien alto', 'grounded, practical', 'less cryptic than males — more direct'],
    ['references the Hist and Black Marsh equally', 'uses water metaphors but with practical applications', 'speaks with the confidence of someone who has survived the marsh'],
    ['the Hist', 'Black Marsh', 'the root-mothers', 'water and memory'],
    { male: '[PLAYER_GENDER_HONORIFIC]', female: '[PLAYER_GENDER_HONORIFIC]', neutral: 'walker' },
    {
      greeting: [
        { text: "[NPC_VOICE_TONE]. '[PLAYER_GENDER_HONORIFIC]. You are here. That means you did not drown in the swamp. Good start. Bad swamp — you will not survive it without help. So let us begin.'" },
        { text: "'I am an Argonian. I do not waste time with small talk. You want what I have? I want what you can do. Let us trade.'" },
      ],
      farewell: [
        { text: "'The marsh does not forget. Neither do I. You will come back — the Hist and I both know this. I will be here. The question is: will you be ready?'" },
      ],
      social: [
        { text: "[NPC_VOICE_TONE]. 'The root-mother says people are like water: they take the shape of their container. You, though — you are more like the river. You carve. That matters to me. It should matter to you.'" },
      ],
      work: [
        { text: "'Fine. I will work. But an Argonian works differently — we do not rush. We sink in. We are the mud, not the surface. You want fast? Go elsewhere. You want thorough? Stay.'" },
      ],
      comfort: [
        { text: "[NPC_VOICE_TONE]. 'Sit. I am not a soft creature — but I am a steady one. The Hist does not weep, but it remembers. I will remember this moment with you. That is my version of comfort.'" },
      ],
      praise: [
        { text: "'[PLAYER_GENDER_HONORIFIC]. I have lived in the marsh long enough to know rare things. What you did — was one of them. Not common. Not replaceable. Remember that the next time you doubt yourself.'" },
      ],
      flirt: [
        { text: "[NPC_VOICE_TONE]. 'I do not flirt like the dry-skins. I do not play games. I am telling you: I want you. That is not metaphor. It is fact. The question is what you do with facts.'" },
      ],
      tease: [
        { text: "[NPC_VOICE_TONE]. 'Ha. That was — the swamp does not laugh often. I will allow it this once. Do not expect a pattern.'" },
      ],
    },
  ),

};
