export interface DialogueChoice {
  id: string;
  label: string;
  intent?: string;
  next_node?: string;
  end_dialogue?: boolean;
  stat_deltas?: any;
  skill_deltas?: any;
  new_items?: any[];
  new_location?: string;
  skill_check?: { stat: string; difficulty: number };
}

export interface DialogueNode {
  id: string;
  narrative_text: string;
  choices: DialogueChoice[];
  image_url?: string;
}

export interface DialogueTree {
  id: string;
  npc_id?: string;
  start_node: string;
  nodes: Record<string, DialogueNode>;
}

interface DialogueBranchSpec {
  id: string;
  label: string;
  intent?: string;
  response: string;
  stat_deltas?: Record<string, number>;
  skill_deltas?: Record<string, number>;
  new_location?: string;
  skill_check?: { stat: string; difficulty: number };
  endLabel?: string;
}

function buildBranchingDialogueTree(config: {
  id: string;
  npc_id?: string;
  opening: string;
  branches: DialogueBranchSpec[];
}): DialogueTree {
  const nodes: Record<string, DialogueNode> = {
    start: {
      id: 'start',
      narrative_text: config.opening,
      choices: config.branches.map((branch) => ({
        id: branch.id,
        label: branch.label,
        intent: branch.intent,
        next_node: branch.id,
        skill_check: branch.skill_check,
      })),
    },
  };

  for (const branch of config.branches) {
    nodes[branch.id] = {
      id: branch.id,
      narrative_text: branch.response,
      choices: [
        {
          id: `${branch.id}_end`,
          label: branch.endLabel ?? 'Leave them with that thought',
          end_dialogue: true,
          stat_deltas: branch.stat_deltas,
          skill_deltas: branch.skill_deltas,
          new_location: branch.new_location,
        },
      ],
    };
  }

  return {
    id: config.id,
    npc_id: config.npc_id,
    start_node: 'start',
    nodes,
  };
}

const NPC_SOCIAL_TREES = Object.fromEntries(
  [
    buildBranchingDialogueTree({
      id: 'constance_michel_social',
      npc_id: 'constance_michel',
      opening: "Constance folds a stack of ragged linens with careful hands. When she notices you lingering nearby, her tired expression warms. 'If Grelod isn't watching for a moment, you may speak freely. What is it?'",
      branches: [
        {
          id: 'ask_kindness',
          label: 'Ask why she keeps helping',
          intent: 'social',
          response: "Constance lets out a quiet breath. 'Because if I stop, this place wins. I cannot save every child here, but I can refuse to become cruel myself. Some days that's the only victory I get.'",
          stat_deltas: { stress: -8, willpower: 4, purity: 4 },
        },
        {
          id: 'ask_escape',
          label: 'Ask what freedom might look like',
          intent: 'confide',
          response: "She glances toward the front doors and lowers her voice. 'Freedom is never one clean moment. It's a hundred frightened choices made anyway. If your chance comes, don't wait for certainty. Just be ready to run.'",
          stat_deltas: { stress: -5, willpower: 6 },
        },
        {
          id: 'offer_help',
          label: 'Offer to help with the younger children',
          intent: 'work',
          response: "For the first time all day, Constance smiles without flinching. 'That would matter more than you know.''Together you straighten blankets, share crusts, and for a little while the dormitory feels less like a cage.",
          stat_deltas: { stress: -10, purity: 5 },
          skill_deltas: { housekeeping: 2 },
        },
      ],
    }),
    buildBranchingDialogueTree({
      id: 'grelod_the_kind_social',
      npc_id: 'grelod_the_kind',
      opening: "Grelod sits like a spider at the center of the orphanage hall, cane across her knees. 'Well? Out with it. My patience is for paying benefactors, not whining brats.'",
      branches: [
        {
          id: 'probe_weakness',
          label: 'Ask what made her this hard',
          intent: 'social',
          response: "Her eyes narrow to slits. 'Weakness made me hard. The world breaks soft children and soft women first. Remember that, and perhaps you'll survive long enough to hate me properly.'",
          stat_deltas: { stress: 8, willpower: 5 },
        },
        {
          id: 'bait_pride',
          label: 'Stroke her pride to learn more',
          intent: 'praise',
          response: "Grelod straightens, pleased despite herself. 'At least one of you understands discipline. These little ingrates would freeze in a week without me. Say what you like — I keep them alive.''The lie curdles in the air.",
          stat_deltas: { stress: 5, purity: -3, willpower: 3 },
        },
        {
          id: 'study_patterns',
          label: 'Watch her habits instead of arguing',
          intent: 'stealth',
          response: "You say little and let her rant. In the silence between insults, you notice everything: where she keeps the keys, when her evening wine arrives, how long she lingers by the office stove. Information has a way of making fear feel useful.",
          stat_deltas: { stress: -3, willpower: 5 },
          skill_deltas: { skulduggery: 2 },
        },
      ],
    }),
    buildBranchingDialogueTree({
      id: 'brynjolf_social',
      npc_id: 'brynjolf',
      opening: "Brynjolf leans against a market post, coin rolling over his knuckles. His eyes flick over the crowd, then back to you. 'You're either bold, desperate, or clever. In this city, those tend to look the same. So — which are you?'",
      branches: [
        {
          id: 'ask_trade',
          label: 'Ask what he really trades in',
          intent: 'social',
          response: "He laughs under his breath. 'Opportunity, mostly. Sometimes stolen silver. Sometimes secrets. Usually it's people buying the illusion they still have choices.''He looks pleased that you asked the right question.",
          stat_deltas: { stress: -5, willpower: 5 },
          skill_deltas: { skulduggery: 2 },
        },
        {
          id: 'ask_test',
          label: 'Ask how someone proves themself',
          intent: 'work',
          response: "'By noticing what others miss,''Brynjolf says at once. 'A locked purse. A loose ledger. A guard looking the wrong way. Skill matters. Nerve matters more.''He flips the coin to you and lets you keep it.",
          stat_deltas: { stress: -4, willpower: 6 },
        },
        {
          id: 'ask_price',
          label: 'Ask what his help would cost',
          intent: 'confide',
          response: "Brynjolf's smile goes thinner, more honest. 'Nothing in Riften is free. But debts aren't always coin, and favours aren't always chains. Depends what sort of person you turn out to be.'",
          stat_deltas: { stress: 2, willpower: 4 },
        },
      ],
    }),
    buildBranchingDialogueTree({
      id: 'brand_shei_social',
      npc_id: 'brand_shei',
      opening: "Brand-Shei rearranges a line of imported trinkets with patient care. 'Take your time,''he says. 'Most people rush through markets. They rarely notice the most interesting things.'",
      branches: [
        {
          id: 'ask_origin',
          label: 'Ask where he learned that patience',
          intent: 'social',
          response: "He smiles faintly. 'From being displaced often enough to understand that rushing solves very little. When you are uprooted, you learn to value the few things that remain steady — craftsmanship, routine, kindness.'",
          stat_deltas: { stress: -8, willpower: 3, purity: 3 },
        },
        {
          id: 'ask_trust',
          label: 'Ask who he trusts in Riften',
          intent: 'confide',
          response: "Brand-Shei considers that for a while. 'A dangerous question in this city. Perhaps the answer is: people who do not force me to hurry my answer.''His gaze settles on you with quiet approval.",
          stat_deltas: { stress: -5, willpower: 4 },
        },
        {
          id: 'offer_stock',
          label: 'Offer to help sort stock',
          intent: 'work',
          response: "He hands you folded cloth and delicate wares, correcting your grip with surprising gentleness. By the time the stall is in order, he has shared half a dozen stories about caravans, border roads, and surviving by staying observant.",
          stat_deltas: { stress: -6 },
          skill_deltas: { housekeeping: 1, skulduggery: 1 },
        },
      ],
    }),
    buildBranchingDialogueTree({
      id: 'robin_social',
      npc_id: 'robin',
      opening: "Robin sits close enough that your shoulders nearly touch. They're carefully arranging dried lavender into a small linen sachet — one of the ones they sell at the Riften docks. They glance up with that small, careful smile they only show you. 'You look like you've got a lot on your mind.'",
      branches: [
        {
          id: 'dream_future',
          label: 'Ask what life they dream about',
          intent: 'social',
          response: "'Something ordinary,''Robin says after a moment. 'A room with a latch that works. Bread that doesn't need hiding. People who don't scare me when they raise their voices.''Their laugh is embarrassed, but honest. 'Maybe ordinary is enough.'",
          stat_deltas: { stress: -10, purity: 5 },
        },
        {
          id: 'plan_escape',
          label: 'Talk through a practical escape plan',
          intent: 'work',
          response: "Robin leans closer, whispering possibilities you've both clearly rehearsed in your heads before. What to carry. Which door sticks. Who can be trusted. Hope sharpens into a real plan.",
          stat_deltas: { stress: -5, willpower: 7 },
          skill_deltas: { skulduggery: 1 },
        },
        {
          id: 'promise_together',
          label: 'Promise you will not leave them behind',
          intent: 'confide',
          response: "Robin's eyes shine all at once. 'You can't promise things like that unless you mean them,''they whisper. When you don't take it back, they breathe out like they've been holding that breath for years.",
          stat_deltas: { stress: -12, purity: 6, willpower: 4 },
        },
      ],
    }),
    buildBranchingDialogueTree({
      id: 'whitney_social',
      npc_id: 'whitney',
      opening: "Whitney lounges like they own the corridor. When you approach, they flash a cutting grin. 'What? Here to hand over lunch money early, or did you suddenly decide you like my company?'",
      branches: [
        {
          id: 'joke_back',
          label: 'Match their sharp humor',
          intent: 'tease',
          response: "Whitney's smirk falters, then returns with real amusement under it. 'Careful,''they say, stepping closer. 'If you get funny, people might start liking you.''The words are cruel, but the edge is dulled. Almost playful.",
          stat_deltas: { stress: -4, willpower: 5 },
        },
        {
          id: 'press_truth',
          label: 'Ask why they pick on the weak',
          intent: 'social',
          response: "For half a heartbeat, the mask slips. 'Because someone always does,''Whitney mutters. Then the sneer is back. 'Don't get sentimental. It looks weird on you.''But you heard the answer anyway.",
          stat_deltas: { stress: 3, willpower: 5 },
        },
        {
          id: 'offer_pause',
          label: 'Offer a truce for one conversation',
          intent: 'comfort',
          response: "Whitney rolls their eyes so hard it should hurt, but they don't walk away. Instead they lean back against the stone pillars and talk about everything except anything that matters. That, somehow, feels like trust from them.",
          stat_deltas: { stress: -8, purity: 3 },
        },
      ],
    }),
    buildBranchingDialogueTree({
      id: 'eden_social',
      npc_id: 'eden',
      opening: "Eden feeds another log into the fire and watches the sparks rise into the rafters. 'You came back,''they say, not sounding surprised. 'Most people visit once, decide I'm unbearable, and leave. You're either stubborn or interesting.'",
      branches: [
        {
          id: 'ask_forest',
          label: 'Ask what the forest gives them',
          intent: 'social',
          response: "'Silence,''Eden says. 'And honesty. Trees don't pretend to be kinder than they are. Wolves don't hide their teeth. Out here, danger is simpler than people.''Their gaze slides back to you. 'Not always better. Just simpler.'",
          stat_deltas: { stress: -10, willpower: 5 },
        },
        {
          id: 'ask_stay',
          label: 'Ask why they let you stay',
          intent: 'confide',
          response: "Eden turns the question over for a long time. 'Because you listen before you speak. Because you don't beg the forest to become less wild for your sake. Because when you're cold, you still thank the fire.''They shrug. 'That counts.'",
          stat_deltas: { stress: -7, willpower: 6 },
        },
        {
          id: 'share_watch',
          label: 'Sit in companionable silence',
          intent: 'comfort',
          response: "You sit beside them without forcing conversation. Outside, the pines hiss in the wind. Inside, the fire cracks softly. When Eden eventually hands you a mug of broth without being asked, it feels like being accepted into something private and rare.",
          stat_deltas: { stress: -12, purity: 4 },
        },
      ],
    }),
    buildBranchingDialogueTree({
      id: 'kylar_social',
      npc_id: 'kylar',
      opening: "Kylar traces the Black Sacrament symbols on the sanctuary wall with their fingertips. 'If this is about the other novices, they don't want you here. If it's about what I want — that's different.'",
      branches: [
        {
          id: 'ask_survive',
          label: 'Ask how they handle pressure',
          intent: 'social',
          response: "'Move first,''Kylar says. 'The Night Mother teaches that hesitation is a weakness Sithis punishes. Doesn't matter if you're scared. Just don't stand still long enough for the shadows to claim you.'",
          stat_deltas: { stress: -3, willpower: 6 },
          skill_deltas: { athletics: 1 },
        },
        {
          id: 'ask_team',
          label: 'Ask who they trust',
          intent: 'confide',
          response: "Kylar catches the ball and doesn't throw it again. 'Not many. The Sanctuary teaches that trust is only for the marked.''Then they step closer to you instead. 'Try not to make me regret saying that.'",
          stat_deltas: { stress: -4, willpower: 4 },
        },
        {
          id: 'challenge_drill',
          label: 'Ask them to teach you something practical',
          intent: 'work',
          response: "Kylar immediately drags you into a stealth exercise that leaves your muscles aching and silent in the shadowed corridor. 'There,''they grin. 'Now if someone corners you, maybe you vanish before they see it.'",
          stat_deltas: { stamina: -8, stress: -4 },
          skill_deltas: { athletics: 2 },
        },
      ],
    }),
    buildBranchingDialogueTree({
      id: 'avery_social',
      npc_id: 'avery',
      opening: "Avery watches the room like they're tracking an invisible game board. When you interrupt, they smile in a way that could mean welcome or calculation. 'You've timed this deliberately. Good. That means you want something real.'",
      branches: [
        {
          id: 'ask_masks',
          label: 'Ask why they act differently in different places',
          intent: 'social',
          response: "'Because rooms have rules,''Avery says lightly. 'People do too, if you pay attention. The trick isn't lying. It's deciding which truth a room is ready for.''Their eyes search your face to see whether you understand.",
          stat_deltas: { stress: -4, willpower: 6 },
          skill_deltas: { skulduggery: 1 },
        },
        {
          id: 'ask_ambition',
          label: 'Ask what they really want',
          intent: 'confide',
          response: "For once, Avery answers without flourish. 'Enough leverage that nobody gets to decide my life for me again.''The sincerity lands heavier than any joke they could have made.",
          stat_deltas: { stress: -5, willpower: 5 },
        },
        {
          id: 'swap_rumors',
          label: 'Trade useful rumors',
          intent: 'work',
          response: "You exchange scraps of information like knives passed handle-first. By the end, Avery is visibly impressed. 'Not bad,''they murmur. 'You might survive this city yet.'",
          stat_deltas: { stress: -3 },
          skill_deltas: { skulduggery: 2 },
        },
      ],
    }),
    buildBranchingDialogueTree({
      id: 'sydney_social',
      npc_id: 'sydney',
      opening: "Sydney closes their prayer book over a finger to keep the page. 'I was hoping you might come by,''they admit. 'It's easier to think when I'm not thinking alone.'",
      branches: [
        {
          id: 'ask_doubt',
          label: 'Ask what they fear about doubt',
          intent: 'social',
          response: "'That if I pull at one thread, all of it comes apart,''Sydney says quietly. 'Not just faith. Identity. Duty. The future I built my whole self around.''They look relieved just to have said it aloud.",
          stat_deltas: { stress: -8, willpower: 5 },
        },
        {
          id: 'walk_together',
          label: 'Suggest a walk instead of another sermon',
          intent: 'comfort',
          response: "Sydney laughs softly and agrees at once. Away from altars and expectations, they talk more freely — about books, rain, and the strange calm of being seen as a person before a believer.",
          stat_deltas: { stress: -10, purity: 4 },
        },
        {
          id: 'share_question',
          label: 'Share one of your own unanswered questions',
          intent: 'confide',
          response: "You offer a truth without dressing it up. Sydney listens with startling intensity, then nods. 'Maybe faith isn't certainty,''they murmur. 'Maybe it's staying kind while you don't know.'",
          stat_deltas: { stress: -6, willpower: 6, purity: 3 },
        },
      ],
    }),
    buildBranchingDialogueTree({
      id: 'bailey_social',
      npc_id: 'bailey',
      opening: "Bailey lounges like the corridor belongs to them and probably believes it does. They tilt their head as you approach. 'Careful. Conversations with me tend to become obligations. Still interested?'",
      branches: [
        {
          id: 'ask_rules',
          label: 'Ask how their racket really works',
          intent: 'social',
          response: "'Fear, mostly,''Bailey says with a shrug. 'People pay to avoid uncertainty. I sell certainty with bruised knuckles attached.''They grin. 'Riften's built on the same principle. I'm just more honest about it.'",
          stat_deltas: { stress: 4, willpower: 5 },
        },
        {
          id: 'ask_debt',
          label: 'Ask whether they ever regret it',
          intent: 'confide',
          response: "The grin fades just enough to notice. 'Regret is a luxury for people with cushions to land on.''Bailey's gaze hardens. 'I learned early that if I didn't become the hand taking, I'd always be the one losing.'",
          stat_deltas: { stress: 2, willpower: 6 },
        },
        {
          id: 'offer_terms',
          label: 'Test whether they respect negotiation',
          intent: 'work',
          response: "Bailey laughs, but it's not mocking this time. You haggle over a purely hypothetical arrangement until both of you are smiling for all the wrong reasons. 'You've got teeth,''they decide. 'Keep them.'",
          stat_deltas: { stress: -3, willpower: 4 },
          skill_deltas: { skulduggery: 1 },
        },
      ],
    }),
    buildBranchingDialogueTree({
      id: 'jordan_social',
      npc_id: 'jordan',
      opening: "Jordan wipes damp soil from their hands and gestures for you to join them beneath the flowering trellis. 'The gardens are kinder company than most congregations,''they say. 'What weighs on you today?'",
      branches: [
        {
          id: 'ask_faith',
          label: 'Ask what faith feels like on hard days',
          intent: 'social',
          response: "'Like choosing gentleness on purpose,''Jordan answers. 'Not because the world deserves it, but because cruelty is always waiting for volunteers. I try not to volunteer.'",
          stat_deltas: { stress: -10, purity: 5 },
        },
        {
          id: 'ask_service',
          label: 'Ask why they keep serving others',
          intent: 'work',
          response: "Jordan smiles and presses a sprig of mint into your palm. 'Because care is practical. Hungry people need food. Hurt people need bandages. Lonely people need witness. Holiness is rarely dramatic.'",
          stat_deltas: { stress: -8, willpower: 4, purity: 4 },
        },
        {
          id: 'share_guilt',
          label: 'Admit something you are ashamed of',
          intent: 'confide',
          response: "Jordan listens without interruption, which somehow makes every word easier and harder to say. When you're done, they only ask, 'What kind of person do you want to be next?''It feels like absolution without pretending the wound was never there.",
          stat_deltas: { stress: -12, willpower: 5, purity: 3 },
        },
      ],
    }),
    buildBranchingDialogueTree({
      id: 'harper_social',
      npc_id: 'harper',
      opening: "Harper finishes tying off a bandage on another patient and finally exhales. 'If you're not bleeding, please tell me you're at least bringing interesting gossip. The hospital's short on both staff and entertainment.'",
      branches: [
        {
          id: 'ask_triage',
          label: 'Ask how they keep going',
          intent: 'social',
          response: "'Routine,''Harper says immediately. 'Clean tools. Clean sheets. One crisis at a time. If I let myself feel everything in real time, I'd drown before noon.''The honesty is clinical and painfully human.",
          stat_deltas: { stress: -5, willpower: 6 },
        },
        {
          id: 'offer_help_shift',
          label: 'Offer to help on a rough shift',
          intent: 'work',
          response: "Harper thrusts folded linens into your arms before you can change your mind. The work is messy and relentless, but by the end of it Harper is looking at you like someone worth relying on.",
          stat_deltas: { stress: -4, stamina: -6 },
          skill_deltas: { housekeeping: 2, tending: 1 },
        },
        {
          id: 'ask_cost',
          label: 'Ask what treating the city has cost them',
          intent: 'confide',
          response: "Harper leans against the counter, suddenly tired in the bones. 'Sleep. Illusions. Most of my patience for fools.''Then a small smile. 'Not all of it, apparently. You're still here.'",
          stat_deltas: { stress: -7, willpower: 4 },
        },
      ],
    }),
    buildBranchingDialogueTree({
      id: 'leighton_social',
      npc_id: 'leighton',
      opening: "Leighton clasps their hands neatly behind their back, every inch the Master of Initiation. 'An initiate seeking guidance should ask a precise question. Imprecision wastes everybody's time, and the College has little patience for fools.'",
      branches: [
        {
          id: 'ask_expectations',
          label: 'Ask what they expect from students',
          intent: 'social',
          response: "'Control,''Leighton says. 'Potential without discipline is merely raw talent that gets people killed in the field.''Their smile never reaches their eyes. 'The College rewards those who are useful, not merely earnest.'",
          stat_deltas: { stress: 5, willpower: 5 },
        },
        {
          id: 'probe_favoritism',
          label: 'Ask why some students get special treatment',
          intent: 'confide',
          response: "Leighton tilts their head, amused rather than offended. 'Because the College is a mirror of power, not fairness. You will learn faster once you stop mistaking the two — the mages don't.''The answer is frank enough to be unnerving.",
          stat_deltas: { stress: 6, willpower: 4 },
        },
        {
          id: 'request_extra_work',
          label: 'Ask for extra work instead of praise',
          intent: 'work',
          response: "Leighton studies you, then assigns a stack of exercises meant to break weaker students. Finishing them leaves your head aching, but the challenge teaches you something valuable about endurance — and about what sort of mentor Leighton chooses to be.",
          stat_deltas: { stress: 4, stamina: -4 },
          skill_deltas: { academy_grades: 2 },
        },
      ],
    }),
    buildBranchingDialogueTree({
      id: 'landry_social',
      npc_id: 'landry',
      opening: "Landry stands with keys at their belt and calculation in their stare. 'Speak quickly,''they say. 'Mercy doesn't keep this place orderly. Neither does boredom.'",
      branches: [
        {
          id: 'ask_order',
          label: 'Ask what order means to them',
          intent: 'social',
          response: "'Predictability,''Landry replies. 'Bars, schedules, consequences. People call it cruelty when the machinery is visible. They sleep fine when the same machinery wears silk and sits in keeps.'",
          stat_deltas: { stress: 3, willpower: 5 },
        },
        {
          id: 'ask_compromise',
          label: 'Ask whether they ever bend the rules',
          intent: 'confide',
          response: "Landry's mouth twitches. 'Rules bend all the time. They just bend toward people with names, coin, or leverage.''The keys jingle softly at their hip. 'The trick is knowing which kind you are.'",
          stat_deltas: { stress: 2, willpower: 5 },
        },
        {
          id: 'trade_information',
          label: 'Offer a useful piece of information',
          intent: 'work',
          response: "Landry hears you out, then gives the smallest nod. 'Useful. Keep that habit and the world may hurt you slightly less than average.''It's almost a compliment by prison standards.",
          stat_deltas: { stress: -3, willpower: 4 },
          skill_deltas: { skulduggery: 1 },
        },
      ],
    }),
    buildBranchingDialogueTree({
      id: 'charlie_social',
      npc_id: 'charlie',
      opening: "Charlie adjusts a student's fingering on the lute with exacting precision before turning to you. 'If you're here to talk, make it worthwhile. If you're here to complain about callused fingers, save us both the breath.'",
      branches: [
        {
          id: 'ask_discipline',
          label: 'Ask why they teach so hard',
          intent: 'social',
          response: "'Because a melody learned on comfort falls apart the moment your audience stops being patient,''Charlie says. 'Technique is what remains when inspiration abandons you. That's why I drill it until your fingers remember.'",
          stat_deltas: { stress: -4, willpower: 6 },
        },
        {
          id: 'ask_stage',
          label: 'Ask what the stage feels like',
          intent: 'confide',
          response: "Charlie's expression softens unexpectedly. 'Terrifying. Exposing. Sacred, if the fire's right.''They glance toward the hearth. 'You spend weeks learning a ballad, then one night you play it and the notes aren't yours anymore — they belong to the room. I think I chase that surrender.'",
          stat_deltas: { stress: -7, allure: 2 },
        },
        {
          id: 'request_drill',
          label: 'Ask for one brutal correction',
          intent: 'work',
          response: "Charlie obliges with frightening enthusiasm. By the time they're done correcting your fingering, breath, and rhythm, your fingertips are sore — but the chord finally sounds like music.",
          stat_deltas: { stamina: -6, stress: -5 },
          skill_deltas: { bardic_performance: 2, athletics: 1 },
        },
      ],
    }),
    buildBranchingDialogueTree({
      id: 'darryl_social',
      npc_id: 'darryl',
      opening: "Darryl polishes a glass that has long since become spotless. Their eyes take in the room, the crowd, the exits, and then you. 'Talk fast. Nights here turn mean without warning.'",
      branches: [
        {
          id: 'ask_business',
          label: 'Ask how they keep the place running',
          intent: 'social',
          response: "'By knowing what everyone wants before they ask for it,''Darryl says. 'Drink, money, a witness, an alibi, a little bit of dignity. Can't always provide the last one, but I try.'",
          stat_deltas: { stress: -4, willpower: 4 },
        },
        {
          id: 'ask_line',
          label: 'Ask what lines they refuse to cross',
          intent: 'confide',
          response: "Darryl's gaze cools. 'Children. Coercion dressed up as opportunity. And anyone too broken to tell me no.''They set the glass down. 'This city will test every boundary you have. Best decide yours in advance.'",
          stat_deltas: { stress: -6, willpower: 6, purity: 3 },
        },
        {
          id: 'offer_watch',
          label: 'Offer to help watch the floor',
          intent: 'work',
          response: "Darryl stations you where you can see the room without being seen too much yourself. By closing, you've learned which smiles are harmless, which are hungry, and how quickly charm turns violent when denied.",
          stat_deltas: { stress: -2, stamina: -5 },
          skill_deltas: { skulduggery: 2 },
        },
      ],
    }),
    buildBranchingDialogueTree({
      id: 'wren_social',
      npc_id: 'wren',
      opening: "Wren shuffles a deck with one hand while studying you over the cards. 'If you're about to ask whether the house cheats, save yourself the embarrassment. The answer is obviously yes. The better question is whether you can still win.'",
      branches: [
        {
          id: 'ask_odds',
          label: 'Ask what winning really means here',
          intent: 'social',
          response: "'Walking away on your own terms,''Wren says. 'Coin is nice. Coin is easy. Most gamblers lose something far more interesting before they notice the table was never the danger.'",
          stat_deltas: { stress: -5, willpower: 5 },
        },
        {
          id: 'ask_tell',
          label: 'Ask how to read people',
          intent: 'work',
          response: "Wren taps two fingers against the table. 'Watch the pause before the smile. Watch who touches their throat when they lie. Watch greed — it always thinks it's subtle.''You leave with a head full of useful little cruelties.",
          stat_deltas: { stress: -3 },
          skill_deltas: { skulduggery: 2 },
        },
        {
          id: 'offer_honesty',
          label: 'Offer one honest truth in return',
          intent: 'confide',
          response: "Wren seems amused by the trade and listens more closely than expected. 'Not bad,''they say when you're done. 'Most people at these tables only know how to wager masks. You put down something real.'",
          stat_deltas: { stress: -4, willpower: 4 },
        },
      ],
    }),
    buildBranchingDialogueTree({
      id: 'winter_social',
      npc_id: 'winter',
      opening: "Winter looks up from a cluttered desk in a storm of notes, gears, and misplaced enthusiasm. 'Perfect timing!''they say. 'I was just arguing with a dead civilization and losing. Please distract me before I insult the Dwemer again.'",
      branches: [
        {
          id: 'ask_discovery',
          label: 'Ask what keeps them searching',
          intent: 'social',
          response: "'The possibility that the next drawer, next ruin, next impossible mechanism changes everything,''Winter says with shining eyes. 'History is just a locked room full of people insisting the key no longer exists.'",
          stat_deltas: { stress: -8, willpower: 5 },
          skill_deltas: { academy_grades: 1 },
        },
        {
          id: 'ask_failure',
          label: 'Ask what discovery frightened them most',
          intent: 'confide',
          response: "Winter goes quiet. 'Finding proof that brilliant people can build marvels and still destroy themselves with them.''They turn a brass cog over in their palm. 'Old ruins are never only about the past.'",
          stat_deltas: { stress: -4, willpower: 6 },
        },
        {
          id: 'help_notes',
          label: 'Help them sort research notes',
          intent: 'work',
          response: "You spend an hour translating Winter's chaos into piles that can be used by mortal minds. They are so grateful they forget to be embarrassed by how much easier you made their work.",
          stat_deltas: { stress: -6 },
          skill_deltas: { academy_grades: 2, housekeeping: 1 },
        },
      ],
    }),
    buildBranchingDialogueTree({
      id: 'sam_social',
      npc_id: 'sam',
      opening: "Sam slides a fresh pastry onto a plate and nudges it your way before you can protest. 'Talk first, pay later,''they say. 'Or never. Depends whether the talk is any good.'",
      branches: [
        {
          id: 'ask_recipe',
          label: 'Ask how they make the café feel safe',
          intent: 'social',
          response: "Sam laughs softly. 'Butter helps. So does light. Mostly it's remembering what fear smells like and refusing to make people breathe it here.''They glance around the café with unmistakable protectiveness.",
          stat_deltas: { stress: -12, purity: 4 },
        },
        {
          id: 'ask_past',
          label: 'Ask whether they ever miss their old life',
          intent: 'confide',
          response: "Sam's smile turns wistful rather than false. 'Pieces of it. Never the cage hidden inside it.''They rest their hands on the counter. 'People think starting over means becoming someone new. Mostly it means deciding what you refuse to carry forward.'",
          stat_deltas: { stress: -7, willpower: 5 },
        },
        {
          id: 'offer_close',
          label: 'Offer to help close up for the night',
          intent: 'work',
          response: "You wipe tables, stack chairs, and package unsold bread while Sam hums under their breath. By the time the shutters are drawn, the café feels less like a business and more like a secret you have been trusted to protect.",
          stat_deltas: { stress: -10 },
          skill_deltas: { housekeeping: 2, cooking: 1 },
        },
      ],
    }),
    buildBranchingDialogueTree({
      id: 'river_social',
      npc_id: 'river',
      opening: "River closes a ledger with precise annoyance. 'If this is another complaint about the headmaster, you'll need evidence. If it isn't, congratulations — you've already made my day more interesting.'",
      branches: [
        {
          id: 'ask_academy',
          label: 'Ask what keeps the academy from collapsing',
          intent: 'social',
          response: "'Spite, paperwork, and the occasional competent student,''River says dryly. Then, more seriously: 'Institutions survive because somebody keeps dragging them toward decency even when it's unfashionable.'",
          stat_deltas: { stress: -5, willpower: 5 },
        },
        {
          id: 'ask_justice',
          label: 'Ask whether rules can actually protect anyone',
          intent: 'confide',
          response: "River taps the closed ledger. 'Rules don't protect people. People protect people. Rules are tools when used well, shields when used honestly, and weapons when used by cowards.'",
          stat_deltas: { stress: -4, willpower: 6 },
        },
        {
          id: 'offer_records',
          label: 'Offer to help sort records',
          intent: 'work',
          response: "River puts you to work on attendance books and disciplinary notices. It's dull until you start seeing the patterns hidden inside the paperwork. 'Exactly,''River says when you point one out. 'Now you're thinking like a witness.'",
          stat_deltas: { stress: -3 },
          skill_deltas: { academy_grades: 2, skulduggery: 1 },
        },
      ],
    }),
    buildBranchingDialogueTree({
      id: 'doren_social',
      npc_id: 'doren',
      opening: "Doren is midway through tightening the wraps on their hands when you approach. They look you over once, measuring. 'Talk while I work. Silence makes people honest, but talking makes them careless.'",
      branches: [
        {
          id: 'ask_training',
          label: 'Ask what training changed in them',
          intent: 'social',
          response: "'It taught me the difference between pain and panic,''Doren says. 'One is information. The other gets you sloppy.''They tug the wrap tight. 'Most people confuse the two.'",
          stat_deltas: { stress: -3, willpower: 6 },
          skill_deltas: { athletics: 1 },
        },
        {
          id: 'ask_control',
          label: 'Ask how they stay controlled',
          intent: 'confide',
          response: "Doren's mouth twists. 'I don't. I stay disciplined long enough to choose where the damage goes.''It's not reassurance, but it is the cleanest truth you've heard all day.",
          stat_deltas: { stress: -2, willpower: 7 },
        },
        {
          id: 'request_drill',
          label: 'Ask for a short sparring drill',
          intent: 'work',
          response: "Doren walks you through stance, breath, and when not to overcommit. The lesson is brutal in its simplicity, but by the end you feel harder to knock off balance.",
          stat_deltas: { stamina: -8, stress: -4 },
          skill_deltas: { athletics: 2 },
        },
      ],
    }),
    buildBranchingDialogueTree({
      id: 'mason_social',
      npc_id: 'mason',
      opening: "Mason is halfway through cleaning practice blades when they nod you closer. 'If you came to waste time, pick a different instructor. If you came to learn, stand up straight.'",
      branches: [
        {
          id: 'ask_standard',
          label: 'Ask what standard they hold people to',
          intent: 'social',
          response: "'The one they claim they want,''Mason says. 'People say they want discipline, loyalty, excellence. Usually they want praise without the bruises that come first.'",
          stat_deltas: { stress: -3, willpower: 5 },
        },
        {
          id: 'ask_respect',
          label: 'Ask what earns their respect',
          intent: 'confide',
          response: "Mason doesn't answer right away. 'Consistency. Coming back after a bad day. Keeping your word when no one rewards you for it.''They glance at you. 'You'd be surprised how rare that is.'",
          stat_deltas: { stress: -5, willpower: 5 },
        },
        {
          id: 'help_gear',
          label: 'Help maintain the training gear',
          intent: 'work',
          response: "You oil straps, stack pads, and check worn practice weapons for splinters. Mason corrects your grip twice, then leaves you to it — a quiet sign of trust from someone careful with it.",
          stat_deltas: { stress: -4 },
          skill_deltas: { housekeeping: 1, athletics: 1 },
        },
      ],
    }),
    buildBranchingDialogueTree({
      id: 'briar_social',
      npc_id: 'briar',
      opening: "Briar watches the room through a curtain of perfume and smoke, every movement in the brothel reflected in their eyes. 'If you've come for honesty, ask precisely. I charge extra for sentiment.'",
      branches: [
        {
          id: 'ask_power',
          label: 'Ask what power looks like here',
          intent: 'social',
          response: "'Choice,''Briar says. 'Real choice, not the little scraps desperate people call freedom. A locked door. A full purse. The ability to say yes and mean it.''Their smile sharpens. 'The tragedy is how few people ever get that.'",
          stat_deltas: { stress: 2, willpower: 5 },
        },
        {
          id: 'ask_cost',
          label: 'Ask what their empire has cost them',
          intent: 'confide',
          response: "Briar swirls their drink and looks almost bored with their own answer. 'Tenderness. Surprise. The luxury of believing charm is harmless.''Their gaze returns to you. 'Useful losses, mostly.'",
          stat_deltas: { stress: 3, corruption: 2, willpower: 4 },
        },
        {
          id: 'study_terms',
          label: 'Ask how contracts trap people',
          intent: 'work',
          response: "Briar explains debt, leverage, protection, and why desperation always signs faster than comfort. You leave unsettled, but much harder to manipulate by anyone using velvet words over iron terms.",
          stat_deltas: { stress: 4, willpower: 5 },
          skill_deltas: { skulduggery: 2 },
        },
      ],
    }),
    buildBranchingDialogueTree({
      id: 'alex_social',
      npc_id: 'alex',
      opening: "Alex wipes sweat and soil from their brow with the back of one arm. 'If this is another person telling me to rest, save it. If it's actual help, talk while you walk.'",
      branches: [
        {
          id: 'ask_burden',
          label: 'Ask what they are carrying alone',
          intent: 'social',
          response: "Alex stares out across the fields before answering. 'Too much. Taxes, weather, debt, grief, all of it.''Then they huff a dry laugh. 'Funny how land looks peaceful from far away. Up close it's always asking for blood.'",
          stat_deltas: { stress: -6, willpower: 5 },
        },
        {
          id: 'ask_home',
          label: 'Ask what makes the farm worth saving',
          intent: 'confide',
          response: "'Memory,''Alex says simply. 'And because if I lose this, the people who broke my family get to be right about what we deserved.''The anger in them is steady, not loud.",
          stat_deltas: { stress: -4, willpower: 6 },
        },
        {
          id: 'offer_hands',
          label: 'Offer an hour of real work',
          intent: 'work',
          response: "Alex puts you to work immediately, shoulder to shoulder in the dirt. It's exhausting, honest labor, and by the end of it their silence has changed from guarded to companionable.",
          stat_deltas: { stamina: -10, stress: -8 },
          skill_deltas: { tending: 2, athletics: 1 },
        },
      ],
    }),
  ].map((tree) => [tree.id, tree]),
);

const ENCOUNTER_STORY_TREES = Object.fromEntries(
  [
    {
      id: 'alley_mugger_story',
      opening: "A thug steps out of the shadows, twirling a rusted dagger. 'Hand over the coin, little bird, and maybe I won't clip your wings.'",
      branches: [
        {
          id: 'pay',
          label: 'Offer coin and keep talking',
          intent: 'submissive',
          response: "You keep your hands visible and your voice steady. The mugger snatches the coins, but greed makes him linger instead of leaving. 'Smart enough to survive,''he says. 'Maybe smart enough to tell me where you sleep too.'",
          choices: [
            { id: 'pay_exit', label: 'Back away while flattering his ego', end_dialogue: true, stat_deltas: { stress: 8, gold: -10, willpower: 3 } },
            { id: 'pay_lie', label: 'Feed him a false lead', next_node: 'pay_lie_result', intent: 'stealth''},
          ],
        },
        {
          id: 'stall',
          label: 'Stall and look for an opening',
          intent: 'stealth',
          response: "You keep him talking, eyes flicking between his stance, the alley mouth, and the loose pile of broken crates at his feet. He notices your hesitation and steps closer. 'Thinking won't save you unless you think faster.'",
          choices: [
            { id: 'stall_throw', label: 'Kick the crates into him and run', next_node: 'stall_throw_result', intent: 'stealth''},
            { id: 'stall_shout', label: 'Shout for the guard', next_node: 'stall_shout_result', intent: 'social''},
          ],
        },
        {
          id: 'fight',
          label: 'Square up and threaten him back',
          intent: 'aggressive',
          response: "You lift your chin and plant your feet. The mugger grins wider, but there's caution in it now. 'There it is,''he says. 'Some bite after all. Let's see if it's enough.'",
          choices: [
            { id: 'fight_commit', label: 'Lunge first', end_dialogue: true, stat_deltas: { stress: 10, willpower: 5 }, intent: 'aggressive''},
            { id: 'fight_feint', label: 'Feign a strike, then break away', next_node: 'fight_feint_result', intent: 'stealth''},
          ],
        },
      ],
      extraNodes: {
        pay_lie_result: {
          id: 'pay_lie_result',
          narrative_text: "You give him a fake address and a fake routine. He laughs, pockets the coin, and vanishes in the wrong direction. The lie buys you time — maybe more than time.",
          choices: [{ id: 'end', label: 'Slip away into the crowd', end_dialogue: true, stat_deltas: { stress: 5, gold: -10 }, skill_deltas: { skulduggery: 2 }, new_location: 'town_square''}],
        },
        stall_throw_result: {
          id: 'stall_throw_result',
          narrative_text: "The crates explode apart under your kick. He curses, stumbles, and by the time he recovers you're already sprinting toward the light of the market.",
          choices: [{ id: 'end', label: 'Keep running', end_dialogue: true, stat_deltas: { stamina: -10, stress: -4 }, new_location: 'town_square''}],
        },
        stall_shout_result: {
          id: 'stall_shout_result',
          narrative_text: "Your cry echoes louder than expected. Somewhere nearby, boots answer it. The mugger bolts with a snarl, and you are left shaking but upright in the alley mouth.",
          choices: [{ id: 'end', label: 'Use the distraction to leave', end_dialogue: true, stat_deltas: { stress: 6, willpower: 3 }, new_location: 'town_square''}],
        },
        fight_feint_result: {
          id: 'fight_feint_result',
          narrative_text: "You draw his guard high and then duck past him. His blade catches only cloth as you tear free and disappear into the canal-side before he can turn.",
          choices: [{ id: 'end', label: 'Do not look back', end_dialogue: true, stat_deltas: { stamina: -8, willpower: 4 }, new_location: 'town_square''}],
        },
      },
    },
    {
      id: 'creepy_noble_story',
      opening: "A finely dressed noble approaches you, all perfume and entitlement. 'You look wasted on these streets,''they purr. 'Come along. I'll improve your evening.'",
      branches: [
        {
          id: 'play_polite',
          label: 'Keep them talking without agreeing',
          intent: 'social',
          response: "You answer just warmly enough to keep them interested. The noble mistakes caution for vulnerability and starts bragging about their house, their servants, and all the locked doors waiting for you inside.",
          choices: [
            { id: 'polite_exit', label: 'Use the bragging to slip away into the crowd', end_dialogue: true, stat_deltas: { stress: -2, willpower: 4 } },
            { id: 'polite_learn', label: 'Memorize their name and crest', end_dialogue: true, stat_deltas: { stress: 3, willpower: 5 }, skill_deltas: { skulduggery: 1 } },
          ],
        },
        {
          id: 'rebuke',
          label: 'Reject them plainly',
          intent: 'aggressive',
          response: "Their expression hardens instantly. Courtesy falls away, revealing irritation sharpened by the expectation that refusal is a thing that happens to other people.",
          choices: [
            { id: 'rebuke_hold', label: 'Hold your ground until they leave first', end_dialogue: true, stat_deltas: { stress: 7, willpower: 6 } },
            { id: 'rebuke_public', label: 'Make the refusal loud enough for others to hear', end_dialogue: true, stat_deltas: { stress: 5, purity: 3, willpower: 5 } },
          ],
        },
        {
          id: 'flip_offer',
          label: 'Ask what they would pay for your time',
          intent: 'stealth',
          response: "The noble blinks, then smiles again — this time warier. 'Ah. So you do understand negotiation.''In trying to control the exchange, they've revealed exactly how transactional their interest was from the start.",
          choices: [
            { id: 'flip_mock', label: 'Mock them and walk off', end_dialogue: true, stat_deltas: { stress: -3, willpower: 4 } },
            { id: 'flip_extract', label: 'Extract a small gift, then vanish', end_dialogue: true, stat_deltas: { stress: 2, gold: 1 } },
          ],
        },
      ],
      extraNodes: {},
    },
    {
      id: 'school_bully_story',
      opening: "A knot of older students closes around you in the hallway. Their leader cracks his knuckles and grins. 'Inspection time, orphan. Empty your pockets.'",
      branches: [
        {
          id: 'comply',
          label: 'Buy time by pretending to comply',
          intent: 'submissive',
          response: "You move slowly, forcing them closer, greed making them sloppy. Their leader is already counting value before anything is even in his hand.",
          choices: [
            { id: 'comply_fake', label: 'Hand over something worthless and leave', end_dialogue: true, stat_deltas: { stress: 6, willpower: 3 } },
            { id: 'comply_trick', label: 'Drop your books and bolt while they laugh', end_dialogue: true, stat_deltas: { stamina: -6, stress: 4 }, skill_deltas: { athletics: 1 } },
          ],
        },
        {
          id: 'banter',
          label: 'Talk back without flinching',
          intent: 'social',
          response: "The corridor goes still for a beat. They expected fear, not poise. That uncertainty buys you more space than any shove would have.",
          choices: [
            { id: 'banter_cut', label: 'Turn their cruelty into a joke at their expense', end_dialogue: true, stat_deltas: { stress: 4, willpower: 5 } },
            { id: 'banter_name', label: 'Invoke a teacher who might come looking', end_dialogue: true, stat_deltas: { stress: 3, academy_grades: 0 } },
          ],
        },
        {
          id: 'strike',
          label: 'Shove through the smallest gap',
          intent: 'aggressive',
          response: "You commit before doubt can catch up. The first student hits the stone pillars, the second curses, and suddenly the neat little ambush is a scramble.",
          choices: [
            { id: 'strike_run', label: 'Run before they regroup', end_dialogue: true, stat_deltas: { stamina: -8, willpower: 4 } },
            { id: 'strike_stand', label: 'Dare them to try again in public', end_dialogue: true, stat_deltas: { stress: 8, willpower: 6 } },
          ],
        },
      ],
      extraNodes: {},
    },
    {
      id: 'beach_scavenger_story',
      opening: "A scarred scavenger steps out from behind the rocks, driftwood club in hand. 'Pockets out,''they snarl. 'The tide keeps what I leave behind.'",
      branches: [
        {
          id: 'barter',
          label: 'Offer a small trade instead of a robbery',
          intent: 'social',
          response: "The scavenger squints at you, suspicious and intrigued in equal measure. Hunger has made them dangerous, but not entirely stupid.",
          choices: [
            { id: 'barter_food', label: 'Trade food and move on', end_dialogue: true, stat_deltas: { stress: -3, purity: 2 } },
            { id: 'barter_info', label: 'Trade information about the shore', end_dialogue: true, stat_deltas: { stress: 2, willpower: 4 }, skill_deltas: { foraging: 1 } },
          ],
        },
        {
          id: 'threaten',
          label: 'Threaten to drag attention here',
          intent: 'aggressive',
          response: "The scavenger hesitates. They were counting on isolation, not noise. Their grip tightens on the club, but they are no longer certain they want the risk.",
          choices: [
            { id: 'threaten_hold', label: 'Keep pressing until they back off', end_dialogue: true, stat_deltas: { stress: 6, willpower: 5 } },
            { id: 'threaten_retreat', label: 'Use the hesitation to retreat yourself', end_dialogue: true, stat_deltas: { stress: 3, stamina: -4 }, new_location: 'lake''},
          ],
        },
        {
          id: 'dash',
          label: 'Sprint for the open shoreline',
          intent: 'stealth',
          response: "You kick sand into their eyes and break for the waterline. Pebbles shift dangerously underfoot, and the surf roars loud enough to swallow curses whole.",
          choices: [
            { id: 'dash_rocks', label: 'Cut across the rocks', end_dialogue: true, stat_deltas: { stamina: -8, pain: 3 }, skill_deltas: { athletics: 1 } },
            { id: 'dash_crowd', label: 'Run toward where fishers might see', end_dialogue: true, stat_deltas: { stress: -2, willpower: 3 }, new_location: 'docks''},
          ],
        },
      ],
      extraNodes: {},
    },
    {
      id: 'shopping_pickpocket_story',
      opening: "A slight figure slams into you and melts into the crowd with your purse. By the time outrage catches up, the chase is already on.",
      branches: [
        {
          id: 'pursue',
          label: 'Chase them immediately',
          intent: 'aggressive',
          response: "You shoulder through silk sleeves and offended nobles, never taking your eyes off the fleeing pickpocket. They are quick, but panic makes even quick hands predictable.",
          choices: [
            { id: 'pursue_tackle', label: 'Corner them at the alley mouth', end_dialogue: true, stat_deltas: { stamina: -8, willpower: 5 }, skill_deltas: { athletics: 1 } },
            { id: 'pursue_pressure', label: 'Shout thief and let the crowd turn on them', end_dialogue: true, stat_deltas: { stress: 3, willpower: 4 } },
          ],
        },
        {
          id: 'predict',
          label: 'Cut them off instead of following',
          intent: 'stealth',
          response: "You scan the district instead of the runner. Busy thieves prefer familiar exits; rich districts prefer narrow ones. The logic pays off when the pickpocket nearly runs straight into you.",
          choices: [
            { id: 'predict_wallet', label: 'Grab the purse and let them flee', end_dialogue: true, stat_deltas: { stress: -4, willpower: 4 }, skill_deltas: { skulduggery: 2 } },
            { id: 'predict_question', label: 'Ask who made them desperate enough to do this', end_dialogue: true, stat_deltas: { stress: 2, purity: 3 } },
          ],
        },
        {
          id: 'abandon',
          label: 'Stop and protect what remains',
          intent: 'neutral',
          response: "You force yourself to breathe and inventory the loss before anger chooses for you. The purse is gone, but not everything is, and rashness would only make the day more expensive.",
          choices: [
            { id: 'abandon_report', label: 'Warn nearby merchants instead', end_dialogue: true, stat_deltas: { stress: 2, purity: 2, willpower: 3 } },
            { id: 'abandon_learn', label: 'Commit the lesson to memory', end_dialogue: true, stat_deltas: { stress: -2, willpower: 4 }, skill_deltas: { skulduggery: 1 } },
          ],
        },
      ],
      extraNodes: {},
    },
    {
      id: 'tavern_brawl_story',
      opening: "A tankard explodes against the wall. Shouts rise, chairs scrape, and in the span of a breath the whole tavern turns into a wave of fists and panic rolling toward you.",
      branches: [
        {
          id: 'duck',
          label: 'Get low and use the tables as cover',
          intent: 'stealth',
          response: "You drop under the nearest table as boots thunder past. Beer rains down, someone curses above your head, and for a few precious seconds you have the advantage of being underestimated.",
          choices: [
            { id: 'duck_escape', label: 'Crawl toward the door', end_dialogue: true, stat_deltas: { stress: 4, stamina: -4 }, new_location: 'town_square''},
            { id: 'duck_help', label: 'Help another bystander up on the way', end_dialogue: true, stat_deltas: { stress: 5, purity: 4, willpower: 3 } },
          ],
        },
        {
          id: 'defuse',
          label: 'Shout for order and single out the instigator',
          intent: 'social',
          response: "Most people ignore you. The drunk who started it doesn't. His attention snaps to you, which is dangerous — and useful. Brawls often collapse once the crowd agrees on where to point its fury.",
          choices: [
            { id: 'defuse_point', label: 'Turn the room against him', end_dialogue: true, stat_deltas: { stress: 6, willpower: 5 } },
            { id: 'defuse_hulda', label: 'Back Hulda while she regains control', end_dialogue: true, stat_deltas: { stress: 4, purity: 3 } },
          ],
        },
        {
          id: 'swing',
          label: 'Hit first and carve space',
          intent: 'aggressive',
          response: "Your shoulder slams into one drunk and your elbow clips another. The brawl doesn't stop, but for one brief furious moment it bends around the fact that you are not easy prey.",
          choices: [
            { id: 'swing_exit', label: 'Use the opening to leave', end_dialogue: true, stat_deltas: { stamina: -8, willpower: 4 }, new_location: 'town_square''},
            { id: 'swing_stay', label: 'Keep swinging until someone breaks it up', end_dialogue: true, stat_deltas: { stamina: -12, stress: 8, willpower: 5 } },
          ],
        },
      ],
      extraNodes: {},
    },
    {
      id: 'noble_kidnapper_story',
      opening: "A gilded carriage halts beside you. Inside, shadow and velvet swallow the face of the person inviting you in. The coachman's stare tells you the softness on offer is only wrapping.",
      branches: [
        {
          id: 'pretend',
          label: 'Pretend to consider the offer',
          intent: 'social',
          response: "The voice inside grows more confident at your hesitation and starts offering details: a warm meal, a bath, a place to sleep. Too many details, too fast. A practiced lure.",
          choices: [
            { id: 'pretend_signal', label: 'Wave over a guard or passerby mid-pitch', end_dialogue: true, stat_deltas: { stress: 4, willpower: 4 } },
            { id: 'pretend_learn', label: 'Catch the crest on the carriage door', end_dialogue: true, stat_deltas: { stress: 3, willpower: 5 }, skill_deltas: { skulduggery: 1 } },
          ],
        },
        {
          id: 'refuse',
          label: 'Refuse and step back',
          intent: 'aggressive',
          response: "The voice turns colder. 'That was not a request,''it says, and the coachman moves at last. Whatever this is, it has happened before to people with fewer exits than you.",
          choices: [
            { id: 'refuse_run', label: 'Run for the busiest street', end_dialogue: true, stat_deltas: { stamina: -8, stress: 7 }, new_location: 'town_square''},
            { id: 'refuse_shout', label: 'Make the abduction attempt public', end_dialogue: true, stat_deltas: { stress: 5, purity: 2, willpower: 5 } },
          ],
        },
        {
          id: 'counter',
          label: 'Demand to know who sent them',
          intent: 'confide',
          response: "The question lands harder than you expected. There is a pause from within the carriage long enough to prove the name matters — and that they did not expect you to ask for it.",
          choices: [
            { id: 'counter_push', label: 'Press the silence until they flinch', end_dialogue: true, stat_deltas: { stress: 5, willpower: 6 } },
            { id: 'counter_leave', label: 'Use the pause to disengage cleanly', end_dialogue: true, stat_deltas: { stress: -2, willpower: 3 } },
          ],
        },
      ],
      extraNodes: {},
    },
    {
      id: 'desperate_beggar_story',
      opening: "A skeletal figure clutches your sleeve with shaking fingers. 'Please,''they rasp. 'A few septims. Food. Anything. I can still fix this if I just get through tonight.'",
      branches: [
        {
          id: 'give',
          label: 'Give what you can spare',
          intent: 'social',
          response: "Relief breaks across their face so quickly it hurts to see. For a second you can almost picture the person they were before hunger and skooma stripped everything down to need.",
          choices: [
            { id: 'give_food', label: 'Give food and send them toward help', end_dialogue: true, stat_deltas: { stress: -6, purity: 5 } },
            { id: 'give_coin', label: 'Give coin and keep moving', end_dialogue: true, stat_deltas: { stress: -3, purity: 2 }, new_items: [] },
          ],
        },
        {
          id: 'talk',
          label: 'Ask what happened to them',
          intent: 'confide',
          response: "Their answer comes in fragments: one bad debt, one wrong friend, one habit that grew teeth. The story is ordinary enough to be terrifying. Ruin, here, is rarely dramatic until it's too late.",
          choices: [
            { id: 'talk_warn', label: 'Take the warning and leave', end_dialogue: true, stat_deltas: { stress: 4, willpower: 6 } },
            { id: 'talk_help', label: 'Point them toward the temple or hospital', end_dialogue: true, stat_deltas: { stress: -2, purity: 4, willpower: 3 } },
          ],
        },
        {
          id: 'refuse',
          label: 'Pull free and refuse',
          intent: 'aggressive',
          response: "Shame and fury flash across their face so fast they become almost the same expression. They let go, but not before you see how thin the line is between pleading and violence when someone has nothing left.",
          choices: [
            { id: 'refuse_leave', label: 'Leave before it turns worse', end_dialogue: true, stat_deltas: { stress: 6, purity: -3 } },
            { id: 'refuse_watch', label: 'Keep them in view as you back away', end_dialogue: true, stat_deltas: { stress: 4, willpower: 4 } },
          ],
        },
      ],
      extraNodes: {},
    },
    {
      id: 'wandering_merchant_story',
      opening: "A Khajiit merchant smiles too wide from beside a cart that seems heavier on the inside than the outside should allow. 'Khajiit has wares,''they purr. 'And perhaps a bargain made exactly for you.'",
      branches: [
        {
          id: 'inspect',
          label: 'Inspect the wares instead of the smile',
          intent: 'stealth',
          response: "The trinkets on the cart shimmer subtly, as if each one is pretending to be more ordinary than it is. Whatever stands before you may trade in more than coin.",
          choices: [
            { id: 'inspect_decline', label: 'Decline before the bargain deepens', end_dialogue: true, stat_deltas: { stress: -2, willpower: 5 } },
            { id: 'inspect_probe', label: 'Ask what the hidden price is', end_dialogue: true, stat_deltas: { stress: 4, willpower: 6 } },
          ],
        },
        {
          id: 'bargain',
          label: 'Play along and bargain carefully',
          intent: 'social',
          response: "The merchant seems delighted that you understand the dance. Every answer they give feels true in the most dangerous possible way.",
          choices: [
            { id: 'bargain_terms', label: 'Demand precise terms', end_dialogue: true, stat_deltas: { stress: 2, willpower: 5 } },
            { id: 'bargain_leave', label: 'Smile, refuse, and keep your name to yourself', end_dialogue: true, stat_deltas: { stress: -3, purity: 2 } },
          ],
        },
        {
          id: 'challenge',
          label: 'Call out the illusion directly',
          intent: 'aggressive',
          response: "The merchant's smile never breaks, but the air around the cart changes — colder, older, amused. 'Sharp little mortal,''they murmur. 'Good. Those last longer.'",
          choices: [
            { id: 'challenge_exit', label: 'Leave before curiosity kills caution', end_dialogue: true, stat_deltas: { stress: 5, willpower: 6 } },
            { id: 'challenge_mark', label: 'Memorize the cart and road before moving on', end_dialogue: true, stat_deltas: { stress: 3 }, skill_deltas: { skulduggery: 1 } },
          ],
        },
      ],
      extraNodes: {},
    },
  ].map((config) => {
    const startNode: DialogueNode = {
      id: 'start',
      narrative_text: config.opening,
      choices: config.branches.map((branch) => ({
        id: branch.id,
        label: branch.label,
        intent: branch.intent,
        next_node: branch.id,
      })),
    };

    const nodes: Record<string, DialogueNode> = { start: startNode, ...(config.extraNodes as Record<string, DialogueNode>) };
    for (const branch of config.branches) {
      nodes[branch.id] = {
        id: branch.id,
        narrative_text: branch.response,
        choices: branch.choices,
      };
    }

    return [
      config.id,
      {
        id: config.id,
        start_node: 'start',
        nodes,
      } satisfies DialogueTree,
    ];
  }),
);

export const DIALOGUE_TREES: Record<string, DialogueTree> = {
  constance_secret_bread: {
    id: 'constance_secret_bread',
    npc_id: 'constance_michel',
    start_node: 'start',
    nodes: {
      start: {
        id: 'start',
        narrative_text: "Sister Constance glances nervously around the hallway. 'You look so thin. I shouldn't be doing this, but Matron is distracted in her office.''She pulls a slightly crushed sweetroll from her apron pocket.",
        choices: [
          { id: 'take_it', label: 'Take the sweetroll', intent: 'social', next_node: 'take_roll''},
          { id: 'refuse', label: "Refuse it. She could get in trouble.", intent: 'cautious', next_node: 'refuse_roll''},
          { id: 'demand_more', label: 'Demand more food.', intent: 'aggressive', next_node: 'demand''},
        ],
      },
      take_roll: {
        id: 'take_roll',
        narrative_text: "You quickly hide the sweetroll. She smiles, visibly relieved. 'Eat it quickly, before she comes back out.'",
        choices: [
          { id: 'end', label: 'Thank her and leave', end_dialogue: true, stat_deltas: { stamina: 10, stress: -5 } },
        ],
      },
      refuse_roll: {
        id: 'refuse_roll',
        narrative_text: "She looks heartbroken but nods. 'I understand. The risk is too great. But please, be careful.'",
        choices: [
          { id: 'end', label: 'Leave', end_dialogue: true, stat_deltas: { willpower: 5, purity: 5 } },
        ],
      },
      demand: {
        id: 'demand',
        narrative_text: "She shrinks back, clutching the roll. 'I... I don't have any more! Please, keep your voice down!''You've frightened her.",
        choices: [
          { id: 'end', label: 'Snatch it and run', end_dialogue: true, stat_deltas: { stamina: 10, trauma: 5, purity: -10 } },
        ],
      },
    },
  },
  alley_mugger_multi: {
    id: 'alley_mugger_multi',
    start_node: 'start',
    nodes: {
      start: {
        id: 'start',
        narrative_text: "A thug steps out of the shadows, twirling a rusted dagger. 'Hand over the coin, little bird, and maybe I won't clip your wings.'",
        choices: [
          { id: 'pay', label: 'Hand over 10 gold', intent: 'submissive', next_node: 'paid''},
          { id: 'fight', label: 'Fight back', intent: 'aggressive', next_node: 'combat_start''},
          { id: 'run', label: 'Try to run past', intent: 'stealth', skill_check: { stat: 'athletics', difficulty: 30 }, next_node: 'run_attempt''},
        ],
      },
      paid: {
        id: 'paid',
        narrative_text: "You drop the coins. He snatches them up with a greedy grin. 'Smart bird. Now fly away.'",
        choices: [
          { id: 'end', label: 'Leave quickly', end_dialogue: true, stat_deltas: { stress: 10, gold: -10 } },
        ],
      },
      combat_start: {
        id: 'combat_start',
        narrative_text: "You raise your fists. He laughs, 'Oh, we got a fighter!'",
        choices: [
          { id: 'end', label: 'Enter combat', end_dialogue: true, intent: 'aggressive''},
        ],
      },
      run_attempt: {
        id: 'run_attempt',
        narrative_text: 'You dash past him, narrowly dodging his grasping hand!',
        choices: [
          { id: 'end', label: 'Escape into the market', end_dialogue: true, new_location: 'town_square', stat_deltas: { stamina: -10 } },
        ],
      },
    },
  },
  ...NPC_SOCIAL_TREES,
  ...ENCOUNTER_STORY_TREES,
};
