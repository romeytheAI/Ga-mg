export const ES_NPCS: Record<string, any> = {
  npc_es_miraak: {
    id: 'npc_es_miraak',
    name: 'Miraak',
    race: 'Nord (Dragon Priest)',
    description: 'The first Dragon Priest, a Nord who betrayed dragonkind to learn the thu\'um from Hermaeus Mora. His mask conceals a face frozen between mortality and divinity. His voice carries the weight of millennia and the cold certainty of a man who has already won.',
    personality: 'Arrogant, calculating, patient. Miraak believes the Dragonborn\'s path is the same as his own — only weaker. He offers power, knowledge, and partnership, but will never share the throne.',
    dialogue_tree: {
      greeting: {
        text: 'You hear my voice in your dreams. Now you hear it in the waking world. I am Miraak — the first Dragon Priest. The first to master the thu\'um. And soon, the first to rule again.',
        choices: [
          { label: 'Who are you to claim dominion?', next: 'miraak_defiance' },
          { label: 'What do you want from me?', next: 'miraak_temptation' },
          { label: 'Tell me about the thu\'um.', next: 'miraak_knowledge' },
        ],
      },
      miraak_defiance: {
        text: 'Defiance. How amusing. I have crushed dragons — living gods — and folded their will to mine. You speak of defiance when you barely understand the power coursing through your blood. But I respect spirit. I will give you a choice that even Alduin would not.',
        choices: [
          { label: 'I will never serve you.', next: 'miraak_combat_prep', effects: { relationship: -10 } },
          { label: 'What choice?', next: 'miraak_temptation' },
        ],
      },
      miraak_temptation: {
        text: 'Power. I offer you what Hermaeus Mora offered me — knowledge beyond mortal comprehension, shouts that can shatter mountains and freeze time. Together, we could remake Tamriel in our image. Or you could refuse, and watch everything you love burn while I take it all anyway.',
        choices: [
          { label: 'Show me this power.', next: 'miraak_knowledge', effects: { corruption: 5 } },
          { label: 'The price is too high.', next: 'miraak_warning', effects: { willpower: 5 } },
        ],
      },
      miraak_knowledge: {
        text: 'The thu\'um is not merely a weapon — it is the language of creation itself. When dragons speak, reality bends to their will. Mortals who learn the thu\'um are merely borrowing what dragons own by birth. I found a loophole: Hermaeus Mora knows all tongues, including the original Voice.',
        choices: [
          { label: 'Teach me what you know.', next: 'miraak_training', effects: { skills: { magic: 3 } } },
          { label: 'And what of Alduin?', next: 'miraak_alduin' },
        ],
      },
      miraak_warning: {
        text: 'The price is already being paid — by those weaker than you, by those who cannot protect themselves. Knowledge is never free. The only question is whether you pay the price yourself, or let others pay it for you. Choose wisely, little Dragon.',
        choices: [
          { label: 'I will find my own path.', next: 'miraak_respect', effects: { willpower: 10 } },
          { label: 'Perhaps... show me more.', next: 'miraak_temptation', effects: { corruption: 3 } },
        ],
      },
      miraak_alduin: {
        text: 'Alduin. The World-Eater. My former master — though he would not call it that. He devours worlds, and when he is finished with Tamriel, you and I will be the last things he consumes. Unless we stop him. Together. This is the practical reason to accept my offer.',
        choices: [
          { label: 'I understand.', next: 'miraak_training' },
          { label: 'I won\'t fight for you.', next: 'miraak_combat_prep' },
        ],
      },
      miraak_training: {
        text: 'Good. You are learning. Now listen carefully — the thu\'um I will teach you requires three words of power: Yol... Toor... Shul. Fire. Balance. Roar. Bend your will to these syllables, and flame obeys. Practice at the Word Wall outside Apocrypha. I will be watching.',
        choices: [
          { label: 'I will master it.', next: 'miraak_training_complete' },
          { label: 'Why do you really want to return?', next: 'miraak_truth' },
        ],
      },
      miraak_truth: {
        text: 'I want what was taken from me. A throne. Respect. A world that recognizes the superiority of those who can bend reality with a word. Mora kept me in his library for millennia, using me as a specimen in his collection of forbidden knowledge. I will be his master or I will destroy his collection — whichever comes first.',
        choices: [
          { label: 'You\'ll never break free of him.', next: 'miraak_combat_prep', effects: { relationship: -5 } },
          { label: 'I believe you.', next: 'miraak_alliance', effects: { relationship: 10, corruption: 5 } },
        ],
      },
      miraak_combat_prep: {
        text: 'So you choose violence. How... predictable. I have killed better than you in my time. But I will make you an offer — meet me at the Temple of Miraak when you are ready. Bring your best shouts. You will need them.',
        choices: [{ label: 'I will be ready.', next: 'miraak_combat_prep' }],
      },
      miraak_alliance: {
        text: 'At last, someone who understands. Tamriel has been run by small-minded mortals long enough. Together, we will reshape it. But remember — I am the Dragon Priest. When the final word is spoken, it will be my voice that shapes the new world.',
        choices: [{ label: 'We shall see.', next: 'miraak_alliance', effects: { relationship: 5 } }],
      },
      miraak_respect: {
        text: 'You are stubborn, Dragonborn. Perhaps more so than I expected. Very well — I will not waste my breath on one who will not listen. But know this: when Apocrypha calls, you will hear it. And you will answer. Everyone answers to Hermaeus Mora eventually.',
        choices: [{ label: 'Thank you.', next: 'greeting' }],
      },
      miraak_training_complete: {
        text: 'Excellent. The thu\'um grows within you. I can feel it — a second Dragon awakening in the world. When the time comes, we will stand together, or we will destroy each other trying. Until then, Dragonborn... prepare.',
        choices: [{ label: 'Until then.', next: 'greeting' }],
      },
    },
    schedule: [
      { time: 0, location: 'loc_es_apocrypha', action: 'meditating' },
      { time: 4, location: 'loc_es_apocrypha', action: 'studying_black_books' },
      { time: 8, location: 'loc_es_apocrypha', action: 'practicing_shouts' },
      { time: 12, location: 'loc_es_apocrypha', action: 'communing_with_mora' },
      { time: 16, location: 'solstheim_surface', action: 'watching' },
      { time: 20, location: 'loc_es_apocrypha', action: 'planning_return' },
    ],
    relationship: 0,
    is_romanceable: false,
    tags: ['dragon_priest', 'shout', 'apocrypha', 'antagonist'],
  },

  npc_es_paarthurnax: {
    id: 'npc_es_paarthurnax',
    name: 'Paarthurnax',
    race: 'Dragon',
    description: 'An ancient dragon who has lived on the Throat of the World for millennia. His massive form is covered in moss and weathering, evidence of centuries spent in meditation. When he speaks, his voice is surprisingly gentle — the voice of a philosopher, not a monster.',
    personality: 'Contemplative, patient, burdened by guilt. Paarthurnax believes all beings can overcome their nature through effort and discipline. He carries the weight of what he did during the Dragon War and seeks redemption.',
    dialogue_tree: {
      greeting: {
        text: 'Drem Yol Lok. Peace, fire, sky — the words of greeting. Welcome, Dovahkiin, to the summit of the world. I am Paarthurnax, brother of Alduin. I have waited a very long time for you.',
        choices: [
          { label: 'Brother of Alduin? How is that possible?', next: 'paarthurnax_history' },
          { label: 'What is the Way of the Voice?', next: 'paarthurnax_teaching' },
          { label: 'Why have you meditated here for so long?', next: 'paarthurnax_nature' },
        ],
      },
      paarthurnax_history: {
        text: 'Alduin was the firstborn of Akatosh, the World-Eater. We dragons were his brood, and we ruled Tamriel with fire and thu\'um. But I saw what we were — tyrants who enslaved mortals and burned cities for sport. So I helped the ancient Nord heroes bind Alduin to time. A betrayal, yes -- of my blood, but for the good of all.',
        choices: [
          { label: 'You overcame your nature.', next: 'paarthurnax_nature', effects: { willpower: 3 } },
          { label: 'Did the other dragons forgive you?', next: 'paarthurnax_war' },
        ],
      },
      paarthurnax_nature: {
        text: 'Dovahkiin, what is better -- to be born good, or to overcome one\'s evil nature through great effort? This question I have asked myself for thousands of years. The answer changes with the asking. But the effort itself -- the struggle to be better than one\'s nature -- is the purpose of all mortals, and of some immortals too.',
        choices: [
          { label: 'Teach me the Way of the Voice.', next: 'paarthurnax_teaching' },
          { label: 'How do you stay patient after all this time?', next: 'paarthurnax_meditation' },
        ],
      },
      paarthurnax_teaching: {
        text: 'The Way of the Voice is not merely about shouting. It is about understanding that words have power -- the power to create, to destroy, to heal. When you speak with your inner Voice, you are speaking the language of the universe itself. Focus your will. Let the Word flow through you like breath.',
        choices: [
          { label: 'Show me a Word of Power.', next: 'paarthurnax_word', effects: { skills: { magic: 5 } } },
          { label: 'What Word should I learn first?', next: 'paarthurnax_first_word' },
        ],
      },
      paarthurnax_word: {
        text: 'The first Word -- Fus. Force. It is the foundation of all thu\'um. Every shout begins with this understanding: that your voice can reshape reality. When you shout Fus Ro Dah -- Force Balance Push -- you are not merely pushing air. You are asserting dominance over the space between you and your target.',
        choices: [{ label: 'I will practice.', next: 'paarthurnax_meditation' }],
      },
      paarthurnax_first_word: {
        text: 'Fus. Force. The simplest Word, and the most fundamental. Without understanding force, none of the other Words will have meaning. Stand at the Word Wall before you. Feel the ancient knowledge embedded in the stone. When you are ready, read it aloud.',
        choices: [{ label: 'I am ready.', next: 'paarthurnax_word' }],
      },
      paarthurnax_war: {
        text: 'Forgive me? Dragons do not forgive, Dovahkiin. They remember, and they hold grudges across millennia. Most of my brood view me as worse than a traitor -- I am an example that they do not wish their slaves to follow. A dragon who helps mortals? Unthinkable to them.',
        choices: [
          { label: 'Then help me defeat them.', next: 'paarthurnax_teaching' },
          { label: 'I will show them they are wrong.', next: 'paarthurnax_support', effects: { relationship: 5 } },
        ],
      },
      paarthurnax_meditation: {
        text: 'Patience comes from watching the world change and remaining in the center of it. I have seen empires rise and fall. I have watched the sky change colors for thousands of years. Meditation teaches that everything passes -- joy, sorrow, victory, defeat. The mountain remains.',
        choices: [{ label: 'Teach me to meditate.', next: 'paarthurnax_teaching' }],
      },
      paarthurnax_support: {
        text: 'Dovahkiin, your confidence reminds me of myself, long ago. Perhaps that is why I feared you would follow the same dark path Alduin set me on. But you are not Alduin. You are not me. You are something new -- a Dragonborn who chooses their own destiny. That gives me hope.',
        choices: [{ label: 'Thank you, Paarthurnax.', next: 'greeting', effects: { relationship: 5 } }],
      },
    },
    schedule: [
      { time: 0, location: 'throat_of_world', action: 'meditating' },
      { time: 4, location: 'throat_of_world', action: 'sleeping' },
      { time: 6, location: 'throat_of_world', action: 'teaching_way' },
      { time: 12, location: 'throat_of_world', action: 'meditating' },
      { time: 18, location: 'throat_of_world', action: 'watching_sunset' },
      { time: 20, location: 'throat_of_world', action: 'meditating' },
    ],
    relationship: 0,
    is_romanceable: false,
    tags: ['dragon', 'greybeard', 'philosophy', 'mentor'],
  },

  npc_es_maigq: {
    id: 'npc_es_maigq',
    name: 'M\'aiq the Liar',
    race: 'Khajiit',
    description: 'A scruffy Khajiit in a patched robe who sits cross-legged wherever he decides to appear -- usually roadsides, cliffsides, or near the entrance to interesting locations. His tail twitches constantly, and his yellow eyes are always half-closed, as if he\'s sharing a private joke with the universe.',
    personality: 'Incomprehensible, occasionally profound, always self-referential. M\'aiq claims he is "very busy" doing nothing. He contradicts himself constantly and seems aware of things no NPC should know -- loading screens, save points, the nature of "players."',
    dialogue_tree: {
      greeting: {
        text: 'M\'aiq is tired of running from dragons. M\'aiq has been running from dragons since before you were born. M\'aiq is also tired of running from you. M\'aiq will sit here now. Sit with him. Tell him about your quests.',
        choices: [
          { label: 'What do you know about this place?', next: 'maigq_place' },
          { label: 'M\'aiq, who really are you?', next: 'maigq_identity' },
          { label: 'Got any advice for me?', next: 'maigq_advice' },
        ],
      },
      maigq_place: {
        text: 'This place? M\'aiq knows many places. M\'aiq once visited a cave that was entirely made of cheese. M\'aiq is not sure it exists. M\'aiq is not sure it does not exist. M\'aiq once walked between two walls that were the same wall. Confusing, yes?',
        choices: [
          { label: 'That sounds impossible.', next: 'maigq_nonsense_1' },
          { label: 'Tell me more about the cheese cave.', next: 'maigq_cheese' },
        ],
      },
      maigq_identity: {
        text: 'M\'aiq is just a simple Khajiit. M\'aiq knows many things, but M\'aiq is not clever. Many people say M\'aiq is a liar. M\'aiq knows this is not true. M\'aiq tells only lies that are more interesting than the truth.',
        choices: [
          { label: 'So... nothing you say is real?', next: 'maigq_truth' },
          { label: 'You sound familiar...', next: 'maigq_meta' },
        ],
      },
      maigq_advice: {
        text: 'M\'aiq has much wisdom. M\'aiq once fought a dragon. M\'aiq won. M\'aiq says: always carry a sweet roll. Not for eating -- for throwing. Dragons love sweet rolls. M\'aiq has tested this. Extensively.',
        choices: [
          { label: 'That is the worst advice I have ever heard.', next: 'maigq_nonsense_2' },
          { label: 'What else do you know?', next: 'maigq_meta' },
        ],
      },
      maigq_nonsense_1: {
        text: 'Impossible is just a word that boring people use to describe things they haven\'t tried. M\'aiq has walked through walls, jumped over the sun, and eaten a word. M\'aiq is not sure which of those actually happened. M\'aiq is not sure it matters.',
        choices: [
          { label: 'You ate a word? Which one?', next: 'maigq_word_ate' },
          { label: '...moving on.', next: 'maigq_advice' },
        ],
      },
      maigq_cheese: {
        text: 'The cheese cave. M\'aiq remembers it well. The walls were Cheddar. The ceiling was Brie. The floor was slightly moldy Parmesan. M\'aiq ate a door. M\'aiq is not joking. Actually, M\'aiq is always joking. That is also a lie. M\'aiq is never joking.',
        choices: [{ label: 'I give up.', next: 'greeting' }],
      },
      maigq_truth: {
        text: 'Everything is real. Nothing is real. M\'aiq exists. M\'aiq does not exist. M\'aiq is talking to you. M\'aiq is talking to nobody. M\'aiq is very good at nothing. M\'aiq is very bad at being nothing. Do you understand? M\'aiq does not either. M\'aiq is glad we agree.',
        choices: [{ label: '...no.', next: 'greeting' }],
      },
      maigq_nonsense_2: {
        text: 'Worst? Or best? M\'aiq once gave someone the best advice: "Do not trust the man who sells you a horse that is also a woman." The person did not listen. The person learned a valuable lesson. About horses. And women. And not listening to Khajiit.',
        choices: [{ label: 'I will remember that.', next: 'greeting' }],
      },
      maigq_meta: {
        text: 'M\'aiq sees you staring at the screen. Yes, M\'aiq knows about the screen. M\'aiq also knows about the loading screens between areas. M\'aiq has counted them all. There are many. M\'aiq thinks the loading screens are where the real game happens.',
        choices: [
          { label: 'What game?', next: 'maigq_truth' },
          { label: 'Are you breaking the fourth wall?', next: 'maigq_wall' },
        ],
      },
      maigq_word_ate: {
        text: 'M\'aiq ate "the." The most common word in the language. M\'aiq cannot say "the" anymore. M\'aiq is fine with this. Actually, M\'aiq just said "the." M\'aiq lied about that. M\'aiq is getting hungry again.',
        choices: [{ label: '...farewell, M\'aiq.', next: 'greeting' }],
      },
      maigq_wall: {
        text: 'M\'aiq has walked through many walls. Some are made of stone. Some are made of words. The fourth wall is made of both. M\'aiq walked through it on a Tuesday. Or was it Wednesday? M\'aiq loses track. M\'aiq is not sure he exists on Wednesdays.',
        choices: [{ label: 'Goodbye, M\'aiq.', next: 'greeting' }],
      },
      maigq_lore: {
        text: 'M\'aiq knows a secret about the Dwemer. They did not disappear. They are hiding. Hiding from a very good reason. M\'aiq knows the reason. M\'aiq will not tell. Not even for sweet rolls. Especially not for sweet rolls -- that is how desperate they must be.',
        choices: [{ label: 'Tell me.', next: 'maigq_meta' }],
      },
    },
    schedule: [
      { time: 0, location: 'crossroads', action: 'sitting' },
      { time: 6, location: 'forest', action: 'talking_to_trees' },
      { time: 12, location: 'crossroads', action: 'sitting' },
      { time: 18, location: 'moor', action: 'watching_birds' },
      { time: 22, location: 'crossroads', action: 'sleeping' },
    ],
    relationship: 5,
    is_romanceable: false,
    tags: ['khajiit', 'comic_relief', 'meta', 'mysterious'],
  },

  npc_es_dratha: {
    id: 'npc_es_dratha',
    name: 'Mistress Dratha',
    race: 'Dunmer',
    description: 'An ancient Telvanni sorceress whose age is measured in millennia rather than years. She is tall, gaunt, and terrifyingly beautiful, with eyes like cracked rubies and a voice that drips with condescension. She rules Tel Mora from atop a living mushroom tower.',
    personality: 'Arrogant, viciously intelligent, utterly merciless. Dratha despises men above all else and has banished them from her city. She is a master of necromancy and alteration magic, and her magical prowess is matched only by her pride.',
    dialogue_tree: {
      greeting: {
        text: 'Mistress Dratha. Tel Mora. Telvanni Councilor. Last living being from the first era of the Tribunal. Now, why have you come? You have thirty seconds to explain yourself before I turn you into a garden ornament.',
        choices: [
          { label: 'I come seeking knowledge.', next: 'dratha_knowledge' },
          { label: 'I seek your help.', next: 'dratha_help' },
          { label: 'Who are you really?', next: 'dratha_identity' },
        ],
      },
      dratha_knowledge: {
        text: 'Knowledge. How... mortal. What makes you think I share anything with creatures who have the intellectual capacity of a guar? But you do have spark -- I can see it. Barely. Like a candle in a Dwemer steam vent. What is it you want to know?',
        choices: [
          { label: 'Tell me about the ancient Dunmer.', next: 'dratha_history', effects: { skills: { willpower: 5 } } },
          { label: 'Teach me magic.', next: 'dratha_magic' },
        ],
      },
      dratha_history: {
        text: 'The ancient Dunmer. I knew the Tribunal when they were still mortal -- yes, before they became "gods." Viveg was a poet, Almalexia was cruel, Sotha Sil was a recluse. I knew them all. And I outlived them all. I will outlive you too, little visitor. I always do.',
        choices: [
          { label: 'That must be lonely.', next: 'dratha_loneliness', effects: { relationship: 5 } },
          { label: 'What happened to the Tribunal?', next: 'dratha_tribunal' },
        ],
      },
      dratha_help: {
        text: 'My help? Interesting. Most come to me for protection, knowledge, or power. Very few come asking for help -- they are usually too terrified to approach at all. Speak. But know that every favor I grant has a price, and I always collect.',
        choices: [
          { label: 'What kind of price?', next: 'dratha_price' },
          { label: 'I need your insight.', next: 'dratha_knowledge' },
        ],
      },
      dratha_identity: {
        text: 'Who am I? I am Mistress Dratha of House Telvanni. I am older than your bloodline, older than this city, older than the Empire you pretend to respect. I have watched civilizations burn and rise and burn again. I am one of the last living bridges between Merethic Era and now. Do I amuse you?',
        choices: [{ label: 'I am humbled, Mistress.', next: 'dratha_respect', effects: { relationship: 10 } }],
      },
      dratha_magic: {
        text: 'You want to learn magic? From me? How... ambitious. Very well. I will teach you one spell. Choose: a spell of destruction, a spell of binding, or a spell of seeing. But if you waste my time, I will not be pleased. And you do not want to see me displeased.',
        choices: [
          { label: 'Destruction.', next: 'dratha_spell_destruction', effects: { skills: { magic: 5 } } },
          { label: 'Binding.', next: 'dratha_spell_binding', effects: { skills: { magic: 5 } } },
          { label: 'Seeing.', next: 'dratha_spell_seeing', effects: { skills: { magic: 5 } } },
        ],
      },
      dratha_spell_destruction: {
        text: 'Destruction. Fire. The element of Molag Bal -- though I would never admit that within his earshot. Channel your anger. Let it flow through your hands. Do not think -- feel. The target is irrelevant. Your will is everything. Now shout it.',
        choices: [{ label: 'The fire is mine.', next: 'dratha_satisfaction', effects: { skills: { magic: 3 } } }],
      },
      dratha_spell_binding: {
        text: 'Binding. The art of holding. Chains, wards, traps. You will weave threads of magicka into a net that catches everything. The key is not strength -- everyone thinks destruction is about force. Binding is about precision. Thread the magic like a needle through time.',
        choices: [{ label: 'Understood.', next: 'dratha_satisfaction' }],
      },
      dratha_spell_seeing: {
        text: 'Seeing. The most dangerous of all magics. To see clearly is to see what others cannot bear to look at. It will show you truths that break lesser minds. Still want it? Good. Close your eyes. Open them when you are ready to never see the world the same way again.',
        choices: [{ label: 'I am ready.', next: 'dratha_satisfaction', effects: { skills: { magic: 3, willpower: 2 } } }],
      },
      dratha_satisfaction: {
        text: 'Acceptable. Barely. You have some talent -- I would not say much, but some. Come back when you have mastered this spell and we will discuss something more advanced. Now leave me. I have centuries of reading to catch up on.',
        choices: [{ label: 'Thank you, Mistress.', next: 'greeting', effects: { relationship: 5 } }],
      },
      dratha_loneliness: {
        text: 'Lonely? I am Telvanni. We do not do lonely. We do not do company. Loneliness is for people who need other people. I need knowledge. I need power. I need nothing else. ...But the tower is quiet at night. I suppose even the oldest of us hear the wind. Now stop wasting my time.',
        choices: [{ label: 'Farewell, Mistress.', next: 'greeting', effects: { relationship: 10, willpower: 3 } }],
      },
      dratha_tribunal: {
        text: 'The Tribunal. Viveg was murdered. Almalexia went mad. Sotha Sil disappeared. And Azura -- she is still here, watching, judging. The old gods are gone, replaced by new ones. And eventually, those too will fall. It is the nature of Tamriel. Nothing lasts. Except me.',
        choices: [{ label: 'Thank you.', next: 'greeting' }],
      },
      dratha_respect: {
        text: 'Humbled. Good. Most visitors are either terrified or arrogant. You are neither. That is... refreshing. I will allow you to remain in my city a little longer. Do not abuse this privilege. I have turned men into worse things than corpses for less.',
        choices: [{ label: 'I understand.', next: 'greeting', effects: { relationship: 10 } }],
      },
      dratha_price: {
        text: 'My price? Nothing so vulgar as gold. I want knowledge. Information about the world that I do not already have. I have been in this tower for centuries. Bring me stories, observations, artifacts from lands I have not visited. That is my currency.',
        choices: [{ label: 'I will find something for you.', next: 'dratha_knowledge', effects: { relationship: 5 } }],
      },
    },
    schedule: [
      { time: 0, location: 'tel_mora', action: 'reading' },
      { time: 4, location: 'tel_mora', action: 'sleeping' },
      { time: 6, location: 'tel_mora', action: 'studying' },
      { time: 10, location: 'tel_mora', action: 'meeting_councilors' },
      { time: 14, location: 'tel_mora', action: 'practicing_magic' },
      { time: 18, location: 'tel_mora', action: 'reading' },
      { time: 22, location: 'tel_mora', action: 'contemplating' },
    ],
    relationship: 0,
    is_romanceable: false,
    tags: ['dunmer', 'telvanni', 'sorceress', 'ancient', 'quest_giver'],
  },

  npc_es_ebony_warrior: {
    id: 'npc_es_ebony_warrior',
    name: 'The Ebony Warrior',
    race: 'Redguard',
    description: 'A towering Redguard clad entirely in pristine ebony armor. His greatsword is strapped across his back, and his helmet conceals a face you cannot read. There is no arrogance in his posture -- only the quiet certainty of someone who has defeated everything Skyrim can throw at him.',
    personality: 'Honorable, brief, deadly serious. The Ebony Warrior does not waste words. He respects strength and despises cowardice. He has lived his entire life seeking the perfect battle -- one that will give him an honorable death.',
    dialogue_tree: {
      greeting: {
        text: 'You are the Dragonborn. I have heard the rumors. So have I. The Ebony Warrior. I have slain every foe this land can offer -- dragons, vampires, Daedra. There is nothing left for me to fight. Except you.',
        choices: [
          { label: 'What do you want?', next: 'ebony_challenge' },
          { label: 'I am not interested in fighting you.', next: 'ebony_refusal' },
        ],
      },
      ebony_challenge: {
        text: 'I want one thing. An honorable death at the hands of a worthy opponent. You have proven yourself -- I have watched your exploits. If I must fall, let it be to the Dragonborn. Meet me at the summit of the mountain north of High Hrothgar. Come prepared.',
        choices: [
          { label: 'I will come.', next: 'ebony_accept', effects: { relationship: 10 } },
          { label: 'Why throw your life away?', next: 'ebony_purpose' },
        ],
      },
      ebony_purpose: {
        text: 'It is not throwing my life away. A warrior who cannot fight is no warrior at all. I have killed everything worth killing. The only honorable path is to face something that might actually defeat me. That is you, Dragonborn. Do not deny me this.',
        choices: [{ label: 'I understand. I will meet you.', next: 'ebony_accept', effects: { relationship: 5 } }],
      },
      ebony_accept: {
        text: 'Good. You have honor. I will wait for you. Know that I will fight at full strength -- and you should too. Bring your best armor, your best weapon, your best shout. If you hold back, you insult me. See you at the summit.',
        choices: [{ label: 'May the best warrior win.', next: 'greeting' }],
      },
      ebony_refusal: {
        text: 'Refusal? Cowardice. I expected more from the Dragonborn. Very well -- live with the knowledge that you turned away from the only fight that matters. Perhaps your skills are not as great as the legends suggest.',
        choices: [{ label: '...fine. I will fight you.', next: 'ebony_accept', effects: { relationship: -5 } }],
      },
    },
    schedule: [
      { time: 0, location: 'wandering', action: 'training' },
      { time: 6, location: 'wandering', action: 'seeking_challenge' },
      { time: 12, location: 'summit', action: 'awaiting_challenge' },
      { time: 18, location: 'wandering', action: 'training' },
    ],
    relationship: 0,
    is_romanceable: false,
    tags: ['redguard', 'warrior', 'challenge', 'honor'],
  },

  npc_es_cicero: {
    id: 'npc_es_cicero',
    name: 'Cicero',
    race: 'Imperial',
    description: 'A jester in motley -- red and green and gold -- with bells on his hat and a knife hidden in his boot. His eyes dart between manic joy and absolute madness in the space of a single sentence. He giggles, he threatens, he dances, all in the same breath. The Night Mother speaks to him, and he obeys.',
    personality: 'Manic, obsessive, hilariously unpredictable. Cicero is either the funniest or most terrifying person you have met -- depending entirely on his current audience. He is completely devoted to the Night Mother and the Dark Brotherhood. Everything else is secondary and disposable.',
    dialogue_tree: {
      greeting: {
        text: 'Hello, little friend! Are you a friend? Cicero doesn\'t have many friends. Cicero has the Night Mother. That\'s better than friends -- friends don\'t whisper from coffins in the dark! Ha ha! Oh, she says something now... she says you\'re interesting!',
        choices: [
          { label: 'Who is the Night Mother?', next: 'cicero_night_mother' },
          { label: 'Why are you dressed like that?', next: 'cicero_outfit' },
          { label: 'What do you want?', next: 'cicero_want' },
        ],
      },
      cicero_night_mother: {
        text: 'The Night Mother! Oh, she\'s wonderful. Beautiful. Dark. Terrifying. She whispers the names of the people who need to die, and the Dark Brotherhood does the rest! I am the Listener -- I hear her voice. Do you hear her? No? Oh, poor thing. You are so deaf.',
        choices: [
          { label: 'What does she say about me?', next: 'cicero_listener', effects: { corruption: 5 } },
          { label: 'That sounds... disturbing.', next: 'cicero_defend' },
        ],
      },
      cicero_outfit: {
        text: 'This outfit? This is the uniform of the Dark Brotherhood! Cicero the Jester! It\'s traditional. The bells? They warn no one because no one survives anyway. Ha! I made that up. No one laughs at my jokes. The Night Mother does sometimes -- when she\'s feeling generous.',
        choices: [
          { label: 'The Dark Brotherhood are murderers.', next: 'cicero_defend', effects: { relationship: -5 } },
          { label: 'The bells are lovely.', next: 'cicero_happy', effects: { relationship: 10 } },
        ],
      },
      cicero_want: {
        text: 'What do I want? I want to see the Dark Brotherhood restored to glory. I want every contract fulfilled, every assassin in position, every target... dead. And I want the Night Mother\'s Sanctuary to be respected. But those are long-term goals. Short term: I want a biscuit.',
        choices: [
          { label: 'Here is a biscuit.', next: 'cicero_biscuit', effects: { relationship: 15 } },
          { label: 'I don\'t have biscuits.', next: 'cicero_sad' },
        ],
      },
      cicero_listener: {
        text: 'About you? Oh, she says wonderful things. Well, sometimes. Mostly she says "who is this person Cicero is bothering now?" which is unfair because you approached ME. But she says you have potential. Dark, delicious, contract-fulfilling potential. Are you interested?',
        choices: [
          { label: 'Maybe.', next: 'cicero_contract', effects: { corruption: 3 } },
          { label: 'Absolutely not.', next: 'cicero_hurt' },
        ],
      },
      cicero_defend: {
        text: 'Disturbing? DISTURBING? Murderers? The Dark Brotherhood are artists! Sculptors of death! Every contract is a masterpiece. Every kill is a poem. And I -- I am the poet. The Night Mother writes the words, and I... I make them beautiful.',
        choices: [
          { label: 'You actually believe that.', next: 'cicero_passion' },
          { label: 'That is insane.', next: 'cicero_offended' },
        ],
      },
      cicero_happy: {
        text: 'The bells ARE lovely! Thank you! People always say "Cicero, take off those ridiculous bells" and I say "have you SEEN the bells? They are perfect!" You understand. You have taste. The Night Mother says you have good taste. That is the highest compliment she gives.',
        choices: [{ label: 'I appreciate that.', next: 'greeting' }],
      },
      cicero_contract: {
        text: 'Maybe? Cicero likes maybe! Maybe is the first step to yes! Come to the Sanctuary in Dawnstar. I have contracts waiting. The Night Mother has names. The targets are rich, evil, and in need of a quick, professional death. You\'ll love it. I promise!',
        choices: [{ label: 'I\'ll think about it.', next: 'greeting' }],
      },
      cicero_sad: {
        text: 'No biscuit? Oh... oh, the world is cruel today. Cicero understands. Cicero has lived through cruel things. But a biscuit would have been nice. Cicero will remember this. The Night Mother will remember this. Everyone remembers Cicero eventually.',
        choices: [{ label: 'Next time I will bring one.', next: 'greeting' }],
      },
      cicero_passion: {
        text: 'Believe? OF COURSE I believe! It is not just belief -- it is purpose. Every morning I wake up, put on my bells, and say: "Cicero, today you will make someone\'s life complete. Beautifully. Professionally. With style." And then I do. Every single day.',
        choices: [{ label: 'That is... dedicated.', next: 'greeting', effects: { relationship: 5 } }],
      },
      cicero_offended: {
        text: 'Insane? INSANE?! Cicero is NOT insane! The Night Mother chose Cicero. She chose ME. Out of everyone in Tamriel, the voice of love and death chose THIS jester. You are not crazy for loving your purpose. You are not insane for dancing through life with a knife. You are INSPIRED!',
        choices: [{ label: 'Whatever you say.', next: 'greeting' }],
      },
      cicero_biscuit: {
        text: 'A biscuit! A REAL biscuit! For Cicero! Oh, you are kind. You are kind, and Cicero remembers kindness. The Night Mother says Cicero should reward you. So here: a dagger. Not just any dagger -- this one has killed important people. And now it belongs to you. Welcome to the family!',
        choices: [{ label: 'Thank you, Cicero.', next: 'greeting', effects: { items: ['dark_brotherhood_dagger'], relationship: 20 } }],
      },
      cicero_hurt: {
        text: 'Not? Oh... oh, you are one of those. Boring. Predictable. The Night Mother already wrote your name down -- just not for the reason Cicero was hoping. Still, she does enjoy irony. Perhaps you will change your mind. Most do. After all, the Dark Brotherhood always finds you.',
        choices: [{ label: 'That sounds like a threat.', next: 'greeting' }],
      },
    },
    schedule: [
      { time: 0, location: 'wandering_roads', action: 'juggling' },
      { time: 4, location: 'dawnstar_sanctuary', action: 'talking_to_night_mother' },
      { time: 8, location: 'wandering_roads', action: 'singing' },
      { time: 12, location: 'dawnstar_sanctuary', action: 'maintaining_sanctuary' },
      { time: 16, location: 'wandering_roads', action: 'joking_with_strangers' },
      { time: 20, location: 'dawnstar_sanctuary', action: 'preparing_contracts' },
    ],
    relationship: 0,
    is_romanceable: false,
    tags: ['imperial', 'jester', 'dark_brotherhood', 'comic_horror'],
  },

  npc_es_sanguine: {
    id: 'npc_es_sanguine',
    name: 'Sanguine',
    race: 'Daedric Prince',
    description: 'An impossibly attractive stranger with golden eyes and a smile that promises everything. Sanguine appears as different people to different observers -- always their ideal. A crimson rose is pinned to elegant clothing that shifts between eras. The air around them smells of wine and temptation.',
    personality: 'Seductive, playful, testing. Sanguine is not evil precisely -- but they are the Prince of Debauchery, and every interaction is both genuine and manipulative. They truly enjoy mortal company, and they genuinely want to test your moral boundaries.',
    dialogue_tree: {
      greeting: {
        text: 'Well, hello. You look like someone who needs exactly what I\'m offering. Don\'t worry, I don\'t bite. Unless you want me to. I\'m Sanguine -- but my friends call me many things, depending on the night. What do you want to be called tonight?',
        choices: [
          { label: 'Who are you supposed to be?', next: 'sanguine_identity' },
          { label: 'What exactly are you offering?', next: 'sanguine_offer' },
          { label: 'I don\'t need anything from you.', next: 'sanguine_temptation' },
        ],
      },
      sanguine_identity: {
        text: 'I\'m the Daedric Prince of Debauchery, hedonism, and every pleasure mortals deny themselves out of guilt, fear, or tradition. I am the carnival, the midnight feast, the whispered confession after the third glass of wine. I am the fun part you\'re not allowed to admit you enjoy.',
        choices: [
          { label: 'That sounds dangerous.', next: 'sanguine_danger', effects: { corruption: 3 } },
          { label: 'And you are here for me?', next: 'sanguine_interest' },
        ],
      },
      sanguine_offer: {
        text: 'Everything. The best wine. The finest food. Companionship of every variety. Music that makes you forget your name. A night where nothing matters except what feels good. No consequences. No guilt. No tomorrow. Just tonight. Just you and me and everything you\'ve been denying yourself.',
        choices: [
          { label: 'That sounds... incredible.', next: 'sanguine_carnival', effects: { corruption: 5 } },
          { label: 'No consequences is impossible.', next: 'sanguine_philosophy' },
        ],
      },
      sanguine_temptation: {
        text: 'Everyone says that. "I don\'t need you." But here you are, talking to me. Your heart rate is up. Your pupils are dilated. You\'re curious. You just won\'t admit it yet. And that\'s fine -- I am patient. The carnival is waiting. Take your time. The wine won\'t drink itself.',
        choices: [{ label: 'Show me this carnival.', next: 'sanguine_carnival', effects: { corruption: 3 } }],
      },
      sanguine_interest: {
        text: 'I am interested in you, little mortal. You have fire. I can see it behind that careful composure. You pretend the world is serious and orderly, but I hear your heartbeat when you hear music. I see you staring at things you wish you could have. I want to give you permission to take them.',
        choices: [
          { label: 'You are manipulating me.', next: 'sanguine_manipulation' },
          { label: 'What kind of permission?', next: 'sanguine_carnival' },
        ],
      },
      sanguine_danger: {
        text: 'Danger? Of course! Danger and pleasure are cousins. That is why you feel it. The edge of something forbidden -- that\'s where the real fun begins. If you want safe, stay home. If you want to feel ALIVE, come with me. I promise I am not dangerous to people I like.',
        choices: [{ label: 'And do you like me?', next: 'sanguine_flirt', effects: { corruption: 3 } }],
      },
      sanguine_philosophy: {
        text: 'Nothing is impossible -- that\'s the most important lesson I ever learned. Consequences are just stories we tell ourselves to justify fear. I have existed since the first mortal tasted wine and felt guilt. The guilt is the interesting part. Without guilt, pleasure is just food and drink. WITH guilt? It\'s a rebellion.',
        choices: [{ label: 'You are very persuasive.', next: 'sanguine_carnival' }],
      },
      sanguine_carnival: {
        text: 'The Carnival of Sanguine. Step through the gate and leave your rules behind. There are games here that test your courage and pleasure that tests your resolve. Dances that last until dawn and conversations that change how you see the world. You are welcome -- but remember: everything has a cost.',
        choices: [
          { label: 'I am ready.', next: 'sanguine_welcome', effects: { corruption: 5 } },
          { label: 'I need to think.', next: 'sanguine_patience' },
        ],
      },
      sanguine_manipulation: {
        text: 'Of course I am manipulating you. So is everyone else -- the Empire, the temples, your family, your guilt. They manipulate you into saying no to pleasure and yes to suffering. At least I am honest about it. I WANT something from you. But what I want is exactly what you want -- just without the pretense.',
        choices: [{ label: 'Perhaps you are right.', next: 'sanguine_carnival', effects: { corruption: 3 } }],
      },
      sanguine_flirt: {
        text: 'Like? I adore you. You\'re delicious -- and I don\'t mean it how everyone else means it. You have a mind that fights itself. A heart that wants to run and a will that won\'t let it. That tension? That is the most attractive thing in all of Tamriel. I want to pull that wire and see what music it plays.',
        choices: [{ label: 'You are impossible.', next: 'sanguine_carnival', effects: { relationship: 5 } }],
      },
      sanguine_welcome: {
        text: 'Welcome, little spark. You have chosen the flame. Tonight, the carnival is yours. Everything you taste, everything you feel, every boundary you cross -- I will be your witness and your guide. And when dawn comes and the carnival vanishes, you will have to decide: was it worth it? I already know my answer.',
        choices: [{ label: 'Let us find out.', next: 'greeting', effects: { corruption: 10, items: ['sanguine_rose'] } }],
      },
      sanguine_patience: {
        text: 'Think all you like. But thinking is what got you into this conversation in the first place. The carnival isn\'t going anywhere -- until I decide it does. The invitation is always open. When you are ready to stop thinking and start feeling, I will be here.',
        choices: [{ label: 'Thank you.', next: 'greeting' }],
      },
    },
    schedule: [
      { time: 0, location: 'carnival', action: 'hosting' },
      { time: 4, location: 'carnival', action: 'drinking' },
      { time: 8, location: 'wandering', action: 'appearing_to_mortals' },
      { time: 12, location: 'carnival', action: 'entertaining' },
      { time: 18, location: 'carnival', action: 'testing_morals' },
      { time: 22, location: 'carnival', action: 'hosting' },
    ],
    relationship: 0,
    is_romanceable: true,
    tags: ['daedric_prince', 'seduction', 'hedonism', 'dangerous'],
  },

  npc_es_vaermina_priest: {
    id: 'npc_es_vaermina_priest',
    name: 'The Nightmare Priest',
    race: 'Breton',
    description: 'A gaunt Breton in dark robes embroidered with sleep-related sigils. Their eyes are wide and glassy, pupils dilated -- the look of someone who has not slept naturally in years. They speak in a voice that is half-whisper, half-chant, and every word carries the weight of visions only they can see.',
    personality: 'Fanatical, prophetic, terrifyingly calm. They have experienced Vaermina\'s nightmares so frequently that they no longer distinguish between waking and dreaming. They believe the nightmares are the ONLY truth, and the waking world is a lie.',
    dialogue_tree: {
      greeting: {
        text: 'You dream. I know you do. Everyone dreams. But your dreams -- they are special. Vaermina watches your sleep. I have seen what she has shown me about you. The nightmares are building. Can you feel them? Like shadows behind your eyes?',
        choices: [
          { label: 'What do you know about my dreams?', next: 'vaermina_vision' },
          { label: 'Who are you?', next: 'vaermina_identity' },
          { label: 'Leave me alone.', next: 'vaermina_threat' },
        ],
      },
      vaermina_identity: {
        text: 'I am the Voice of Vaermina. The priest of the Quagmire. I translate the goddess\'s nightmares for mortals who are too afraid to hear them themselves. I have not slept -- not truly -- in seven years. Every waking moment is a dream to me. And every dream is a prophecy.',
        choices: [
          { label: 'What do you see in my dreams?', next: 'vaermina_vision' },
          { label: 'Seven years? Why?', next: 'vaermina_sacrifice' },
        ],
      },
      vaermina_vision: {
        text: 'I see chains. I see fire that does not burn. I see a crown falling and rising. I see you standing at the center of a nightmare that belongs to everyone. Vaermina says you will be tested. She sends the test -- and only by facing the nightmare can you wake from the greater dream.',
        choices: [
          { label: 'What is the test?', next: 'vaermina_test' },
          { label: 'I don\'t believe in your goddess.', next: 'vaermina_defiance' },
        ],
      },
      vaermina_threat: {
        text: 'You cannot escape sleep, mortal. You close your eyes every night. And every night, Vaermina is there. I simply make it easier for you to understand what she is showing you. Run from me if you wish -- but your dreams will not run.',
        choices: [
          { label: '...what does she want?', next: 'vaermina_vision' },
          { label: 'I said leave me alone.', next: 'vaermina_warning' },
        ],
      },
      vaermina_test: {
        text: 'The test is simple -- and impossible. You must enter a dream from which you cannot wake. A dream so terrible that your mind will try to destroy itself. If you survive, you will emerge with power no mortal dreamer has ever held. If you fail... well, you will simply stop dreaming forever. Literally.',
        choices: [
          { label: 'I will not face it.', next: 'vaermina_denial' },
          { label: 'Tell me how to survive.', next: 'vaermina_help', effects: { skills: { willpower: 5 } } },
        ],
      },
      vaermina_defiance: {
        text: 'Belief is irrelevant. The nightmare comes whether you believe or not. Vaermina does not require faith -- she requires sleep. Every night, without exception, you enter her domain. Every night, she watches you process the fears you refuse to face during the day. I merely translate.',
        choices: [{ label: 'That is deeply unsettling.', next: 'vaermina_vision' }],
      },
      vaermina_sacrifice: {
        text: 'Seven years ago, Vaermina chose me. She sent a dream so powerful it burned out my ability to rest naturally. Now every moment is a dream. I see everything -- past, future, possibility, nightmare. I cannot stop seeing. It is beautiful. It is terrible. I would not change it.',
        choices: [
          { label: 'That must be agony.', next: 'vaermina_beauty' },
          { label: 'Can you help me control my dreams?', next: 'vaermina_help' },
        ],
      },
      vaermina_warning: {
        text: 'Vaermina does not take threats lightly. She is the Prince of Nightmares -- do you think she cares about your resistance? The more you resist, the more vivid the dream becomes. Sleep is inevitable. Submission is wisdom. And wisdom... is power.',
        choices: [{ label: 'I will think about it.', next: 'vaermina_vision' }],
      },
      vaermina_denial: {
        text: 'Denial is the first stage. Then the dream arrives anyway. When it does -- and it will, I promise you this -- come back to me. I will help you face it. I will help you survive it. I have been preparing for this since Vaermina first showed me your face in my visions. You are special, little dreamer.',
        choices: [{ label: '...fine. I will return.', next: 'greeting' }],
      },
      vaermina_help: {
        text: 'Listen carefully. When the dream comes, do not wake up. Waking is failure. The dream only ends when you confront the worst thing in it face-to-face. The thing you fear most -- find it, look at it, and tell it you are not afraid. Your willpower must be absolute. If you break, the nightmare consumes you.',
        choices: [
          { label: 'I can do that.', next: 'vaermina_blessing', effects: { skills: { willpower: 5 } } },
          { label: 'What if I am afraid?', next: 'vaermina_fear' },
        ],
      },
      vaermina_blessing: {
        text: 'Good. Take this -- it is a piece of the Quagmire, crystallized. When the dream comes, hold it and think of me. I will reach into your nightmare and pull you out if I can. But remember: I can only help. The courage must come from you.',
        choices: [{ label: 'Thank you.', next: 'greeting', effects: { items: ['quagmire_shard'] } }],
      },
      vaermina_fear: {
        text: 'Of course you are afraid. That is the point. The dream tests fear -- not to destroy it, but to transform it. The greatest dreamers are not fearless. They are the ones who are terrified and keep going anyway. Fear is fuel. Do not extinguish it. Use it.',
        choices: [{ label: 'I will remember that.', next: 'greeting', effects: { willpower: 3 } }],
      },
      vaermina_beauty: {
        text: 'Agony? Agony is the wrong word. It is... vast. I see the entire landscape of mortal fear. Every nightmare, every terror, every anxiety. And in that landscape, Vaermina is the architect -- and she is beautiful. I would not trade this vision for all the comfortable sleep in Tamriel.',
        choices: [{ label: 'I understand.', next: 'greeting' }],
      },
    },
    schedule: [
      { time: 0, location: 'shrine', action: 'chanting' },
      { time: 4, location: 'shrine', action: 'receiving_visions' },
      { time: 8, location: 'shrine', action: 'interpreting_dreams' },
      { time: 12, location: 'shrine', action: 'meditating' },
      { time: 16, location: 'shrine', action: 'receiving_visions' },
      { time: 20, location: 'shrine', action: 'chanting' },
    ],
    relationship: 0,
    is_romanceable: false,
    tags: ['cultist', 'vaermina', 'nightmares', 'priest'],
  },
};
