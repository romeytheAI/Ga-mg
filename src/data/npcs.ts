export const NPCS: Record<string, any> = {
  'constance_michel': {
    id: 'constance_michel',
    name: "Sister Constance",
    race: "Human",
    relationship: 20,
    description: "The assistant at the orphanage. She is a young woman, barely out of her teens, who tries her best to be kind. However, she is clearly exhausted, overworked, and terrified of Matron Grelod. She often sneaks extra food to the younger children when Grelod isn't looking.",
    responses: {
      'social': { narrative_text: "She smiles sadly at you, her eyes darting nervously towards the matron's office. 'Eat quickly, little one. Before she sees you have extra.'", stat_deltas: { stress: -5, willpower: 2 } },
      'work': { narrative_text: "'Thank you for the help. You're a good child. I'll try to sneak you an extra blanket tonight, it's going to be freezing.'", stat_deltas: { stress: -10, purity: 2 } },
      'flirt': { narrative_text: "Sister Constance blinks, colour rising in her tired cheeks. 'I... that's very kind of you to say.' She looks away quickly, smoothing her apron. 'You deserve kindness, not... I just hope things get better for you. Truly.' Her voice is soft, but her smile is genuine.", stat_deltas: { stress: -8, purity: 3, willpower: 2 } },
      'threaten': { narrative_text: "Sister Constance's face crumples with hurt. 'Please, don't... I'm doing my best. I know it isn't enough. I know.' Tears well in her eyes. 'I'm sorry I can't do more.' She retreats to the corner, trembling, and the shame of it sits heavy in your chest.", stat_deltas: { stress: 5, trauma: 3, purity: -3 } },
      'gift': { narrative_text: "Sister Constance stares at the small offering in her palm as if she's never received a gift before. Perhaps she hasn't. 'For me?' she whispers. Her lip trembles. 'Nobody ever...' She squeezes your hand briefly. 'Thank you. I'll treasure it. Now go before Grelod sees.'", stat_deltas: { stress: -12, purity: 5 } }
    }
  },
  'grelod_the_kind': {
    id: 'grelod_the_kind',
    name: "Matron Grelod",
    race: "Human",
    relationship: -50,
    description: "The headmistress of the orphanage, ironically nicknamed 'The Kind'. A bitter, cruel, and aging woman who takes sadistic pleasure in the suffering of the children in her care. Rumors say she was once a beautiful noblewoman who lost everything, though her current state of perpetual rage makes that hard to believe. She wields a heavy leather belt and a wooden cane, both of which she uses frequently and without hesitation.",
    responses: {
      'social': { narrative_text: "She glares at you, her face a mask of pure hatred, spittle flying from her lips. 'Back to work, you lazy, worthless brat! Or it's the belt for you, and no supper!' She raises her cane threateningly.", stat_deltas: { stress: 20, pain: 5, trauma: 5 } },
      'work': { narrative_text: "She inspects your work with a sneer, running a bony finger over a perfectly clean surface. 'You missed a spot. Do it again, all of it, or you'll sleep in the cellar with the rats!'", stat_deltas: { stamina: -15, stress: 10 } },
      'flirt': { narrative_text: "Grelod recoils as if you'd struck her. 'HOW DARE YOU!' Her cane whistles through the air. 'Insolent, disgusting wretch! To your room this instant, or I will lock you in the cellar for a WEEK!' Her face is purple with outrage.", stat_deltas: { stress: 30, trauma: 8, pain: 5 } },
      'threaten': { narrative_text: "Grelod sneers, utterly unimpressed. 'Threaten ME? You miserable little rat? I have friends in this city — magistrates, guardsmen, bailiffs. One word from me and you'll rot in a dungeon cell.' She steps forward. 'Now GET BACK TO WORK.'", stat_deltas: { stress: 25, trauma: 10 } },
      'gift': { narrative_text: "Grelod snatches the gift from your hand and inspects it with disdain. 'Trying to buy your way into my good graces? Pathetic.' She pockets it regardless. 'The answer is still no. Whatever it is you want, you'll earn it through suffering, same as everyone else.'", stat_deltas: { stress: 15, trauma: 3 } }
    }
  },
  'brynjolf': {
    id: 'brynjolf',
    name: "Brynjolf",
    race: "Human",
    relationship: 0,
    description: "A smooth-talking, charismatic rogue who seems to know everyone's business in the town. He usually hangs around the market square, looking for easy marks or potential recruits for his 'organization'. He wears fine, if slightly worn, leather armor.",
    responses: {
      'social': { narrative_text: "He leans against a stall, tossing a coin in the air. 'Never done an honest day's work in your life for all that coin you're carrying, eh lass? You've got the look of a survivor.'", stat_deltas: { stress: 5, lust: 5 } },
      'work': { narrative_text: "He watches you work with an amused expression. 'Keep your hands quick and your eyes open. The alleys are no place for the slow, and neither is this market.'", stat_deltas: { willpower: 5 } },
      'flirt': { narrative_text: "Brynjolf catches the coin mid-air and gives you a slow, appraising smile. 'Well, well. Bold as brass, aren't you?' He looks you up and down with undisguised interest. 'I like that in a partner. In business, I mean.' His grin suggests he means rather more than that.", stat_deltas: { lust: 8, stress: -5, allure: 3 } },
      'threaten': { narrative_text: "Brynjolf's easy smile doesn't waver, but his eyes sharpen to flint. 'Oh, that's a mistake, lass. A big one.' He leans in close, voice dropping to silk. 'The Thieves Guild has a long memory and a longer reach. Choose your next words with great care.'", stat_deltas: { stress: 20, willpower: -3 } },
      'gift': { narrative_text: "Brynjolf examines the gift with a practiced eye, then chuckles. 'Not bad quality. You've got taste.' He palms it and offers a coin in return. 'Consider us even on that little favour from last week. And listen — you've got potential. Don't waste it.'", stat_deltas: { stress: -5, willpower: 5 } }
    }
  },
  'brand_shei': {
    id: 'brand_shei',
    name: "Brand-Shei",
    race: "Elf",
    relationship: 10,
    description: "A Dark Elf merchant in the town square. Unlike many others, he seems genuinely kind and fair in his dealings. He sells a variety of exotic goods and often takes pity on the local orphans, occasionally offering them small tasks for decent pay.",
    responses: {
      'social': { narrative_text: "He offers a warm, genuine smile. 'Ah, a customer. Or just browsing? Either way, welcome to my humble stall. Stay out of trouble, young one.'", stat_deltas: { stress: -5 } },
      'work': { narrative_text: "He hands you a small broom. 'I could use a hand organizing these wares and sweeping up, if you're looking for a few honest coins.'", stat_deltas: { stamina: -10 } },
      'flirt': { narrative_text: "Brand-Shei blinks, then laughs warmly — not unkindly. 'Ha! You are bold, young one. In Morrowind, we have a saying: a flame that burns bright needs good wood to last.' He winks. 'Focus on your future first. But the compliment is appreciated, truly.'", stat_deltas: { stress: -8, purity: 3, willpower: 3 } },
      'threaten': { narrative_text: "Brand-Shei's composure hardens. He sets down his wares deliberately and folds his hands. 'You would threaten an honest merchant? In broad daylight?' His voice is quiet but carries weight. 'I have survived Morrowind's worst. I suggest you think carefully about your next action.'", stat_deltas: { stress: 10, willpower: -2 } },
      'gift': { narrative_text: "Brand-Shei accepts the gift with a respectful nod. 'You are generous. In Dark Elf custom, a gift given freely creates a bond of obligation — I owe you a kindness in return.' He produces a small pouch of herbs from under his stall. 'For you. And my door is always open.'", stat_deltas: { stress: -10, purity: 5 } }
    }
  },
  // ── DoL Love Interests ─────────────────────────────────────────────────
  'robin': {
    id: 'robin',
    name: "Robin",
    race: "Human",
    relationship: 30,
    love_interest: true,
    location: 'orphanage',
    description: "One of the other orphans — quiet, kind, and perpetually anxious. Robin has always looked up to you, offering shy smiles across the dormitory and saving you the best scraps at meal times. They spend their weekends selling lemonade at the beach to scrape together pennies. Their eyes hold a fragile hope that life might someday get better.",
    responses: {
      'social': { narrative_text: "Robin's face lights up when they see you. 'Oh! I saved you something...' They press a slightly squashed bread roll into your hands, blushing. 'It's not much, but...'", stat_deltas: { stress: -15, trauma: -5, purity: 3 } },
      'work': { narrative_text: "Robin helps you with the chores, humming softly. Their presence makes the drudgery bearable. 'We'll get out of here someday,' they whisper. 'Together.'", stat_deltas: { stress: -10, willpower: 5 } },
      'flirt': { narrative_text: "Robin turns scarlet, nearly dropping the dish they were washing. 'I... you... you really mean that?' They can barely meet your eyes, but a radiant smile breaks through. 'Nobody's ever said anything like that to me before.'", stat_deltas: { stress: -10, lust: 5, purity: -2 } },
      'threaten': { narrative_text: "Robin's eyes go wide with hurt, filling with tears. 'Why would you say that? I thought we were... I thought you cared.' They back away, hugging themselves. The guilt hits you like a physical blow.", stat_deltas: { stress: 10, purity: -5, trauma: 3 } },
      'gift': { narrative_text: "Robin takes the gift with trembling hands, their eyes shining. 'For me? Really?' They clutch it to their chest like treasure. 'I'll keep it forever. I promise.' Their smile could light up the entire orphanage.", stat_deltas: { stress: -10, purity: 3 } }
    }
  },
  'whitney': {
    id: 'whitney',
    name: "Whitney",
    race: "Human",
    relationship: -20,
    love_interest: true,
    location: 'school',
    description: "The school's most feared bully — tall, strong, and radiating casual menace. Whitney rules the hallways with an iron fist and a cruel tongue, flanked always by a gang of sycophantic cronies. Beneath the swagger, there are hints of a deeper pain — a broken home, perhaps, or something worse. They seem to find a perverse fascination in you specifically.",
    responses: {
      'social': { narrative_text: "Whitney corners you against a locker, one arm braced above your head. 'Where d'you think you're going, runt? You haven't paid your toll today.' Their grin is sharp and predatory.", stat_deltas: { stress: 20, trauma: 5, lust: 3 } },
      'work': { narrative_text: "Whitney watches you work with lazy amusement. 'You missed a spot, orphan.' They kick your bucket over and laugh as the dirty water spreads across the floor you just cleaned.", stat_deltas: { stress: 15, trauma: 3 } },
      'flirt': { narrative_text: "Whitney freezes, caught completely off-guard. For a split second, their tough facade cracks and you see genuine surprise — maybe even interest. Then the mask slams back down. 'You've got nerve, orphan. I'll give you that.' But they don't look away.", stat_deltas: { stress: 5, lust: 8, willpower: 3 } },
      'threaten': { narrative_text: "Whitney's eyes narrow dangerously. 'Did you just threaten me? ME?' They step closer, towering over you. 'You've got a death wish.' Their fist connects with the locker beside your head, denting the metal. 'Next time, it's your face.'", stat_deltas: { stress: 25, trauma: 8, pain: 5 } },
      'gift': { narrative_text: "Whitney stares at the gift, then at you, suspicion warring with confusion. '...What's the catch?' They take it roughly, but you notice their fingers are careful, almost gentle. 'Don't think this changes anything between us.' But they keep it.", stat_deltas: { stress: -5 } }
    }
  },
  'eden': {
    id: 'eden',
    name: "Eden",
    race: "Human",
    relationship: -10,
    love_interest: true,
    location: 'eden_cabin',
    description: "A reclusive hunter who lives alone in a cabin deep in the forest. Eden is powerfully built, quiet, and intensely private. They distrust the town and its people, preferring the company of the wilderness. Those who earn their trust find a fiercely loyal, if possessive, companion. Those who don't may find themselves on the wrong end of their hunting knife.",
    responses: {
      'social': { narrative_text: "Eden stares at you with intense, unreadable eyes. '...You came back.' There's surprise in their voice, and something else — relief, perhaps. They step aside to let you into the cabin.", stat_deltas: { stress: -10, willpower: 5 } },
      'work': { narrative_text: "Eden watches you chop wood with a critical eye, then nods curtly. 'Not bad. You might survive out here yet.' High praise from them.", stat_deltas: { stamina: -10, willpower: 5 } },
      'flirt': { narrative_text: "Eden goes very still, like a deer that's caught a scent. Their jaw tightens. For a long moment, only the crackle of the fire fills the silence. Then, very quietly: 'Don't say things you don't mean. Not out here. Not to me.' But their hand finds yours in the firelight.", stat_deltas: { stress: -5, lust: 5, willpower: 5 } },
      'threaten': { narrative_text: "Eden's hand moves to the hunting knife at their belt with practiced speed. 'Choose your next words very carefully.' Their voice is flat and cold as winter steel. The cabin suddenly feels very small, and the forest very, very far from help.", stat_deltas: { stress: 30, trauma: 5, willpower: -3 } },
      'gift': { narrative_text: "Eden takes the gift and turns it over in their calloused hands, studying it with the same careful attention they give to animal tracks. 'You didn't have to do that.' A pause. 'Thank you.' It's the most emotion you've ever heard in their voice.", stat_deltas: { stress: -10, willpower: 3 } }
    }
  },
  'kylar': {
    id: 'kylar',
    name: "Kylar",
    race: "Human",
    relationship: 5,
    love_interest: true,
    location: 'school',
    description: "A strange, quiet student who sits alone in every class and eats lunch by themselves in the library. Other students call them a freak and avoid them. Kylar seems to have developed an obsessive fixation on you — watching you from across the classroom, leaving anonymous gifts in your desk. Their eyes are intense and their smile, when it appears, is unsettlingly devoted.",
    responses: {
      'social': { narrative_text: "Kylar emerges from behind a bookshelf, clutching a small, handmade doll that looks disturbingly like you. 'I made this for you,' they whisper, pressing it into your hands. 'So you'll always have me with you.'", stat_deltas: { stress: 10, willpower: 3 } },
      'work': { narrative_text: "Kylar silently appears beside you and begins helping without being asked. They don't speak, but they keep glancing at you with an intensity that makes you uncomfortable.", stat_deltas: { stress: 5, willpower: 2 } },
      'flirt': { narrative_text: "Kylar's entire body goes rigid, their pupils dilating to swallow the iris. 'You... you feel it too?' they breathe, their voice trembling with desperate intensity. 'I knew it. I knew we were meant to be together. Forever.' They reach for you with both hands, their grip surprisingly strong.", stat_deltas: { stress: 15, lust: 5 } },
      'threaten': { narrative_text: "Kylar's expression doesn't change. They simply tilt their head, studying you with those unblinking eyes. 'You can't push me away. I won't let you.' There's no anger in their voice — just absolute, terrifying certainty. 'We belong together. You'll understand eventually.'", stat_deltas: { stress: 20, trauma: 5 } },
      'gift': { narrative_text: "Kylar accepts the gift with reverence, cradling it like a holy relic. Their eyes fill with tears. 'You thought of me? You actually thought of me?' They press the gift to their lips. 'I'll never let it go. Never. Just like I'll never let you go.'", stat_deltas: { stress: 5, willpower: 3 } }
    }
  },
  'avery': {
    id: 'avery',
    name: "Avery",
    race: "Human",
    relationship: 0,
    love_interest: true,
    location: 'town_square',
    description: "A wealthy, impeccably dressed businessperson who lives in a mansion on the affluent side of town. Avery is sophisticated, demanding, and possessive. They've taken an interest in you — whether out of genuine affection or a desire to 'collect' something beautiful is unclear. They offer expensive gifts and fancy dates, but expect absolute obedience in return.",
    responses: {
      'social': { narrative_text: "Avery adjusts the cuffs of their silk shirt and looks you over appraisingly. 'You look positively dreadful, darling. We must do something about those rags. Come, I'll take you somewhere proper.'", stat_deltas: { stress: 5, allure: 3 } },
      'work': { narrative_text: "Avery watches you work with a mixture of pity and distaste. 'Manual labour. How... quaint. You know, you wouldn't need to do this if you'd simply accept my offer.'", stat_deltas: { stress: 10, willpower: 3 } },
      'flirt': { narrative_text: "Avery's lips curl into a satisfied smile. 'Well, well. You do know how to please, don't you?' They step closer, trailing a manicured finger along your jaw. 'I could give you everything you've ever wanted. All you have to do is say yes.' Their perfume is intoxicating.", stat_deltas: { lust: 10, allure: 3, purity: -3 } },
      'threaten': { narrative_text: "Avery's expression hardens to ice. 'How dare you. Do you know who I am? Who I know? I could have you thrown in the dungeons with a single word.' They lean close. 'Don't mistake my interest for weakness, child. I own people far more dangerous than you.'", stat_deltas: { stress: 25, trauma: 5 } },
      'gift': { narrative_text: "Avery examines the gift with the appraising eye of someone who knows exactly what everything costs. 'How... thoughtful.' A genuine smile briefly cracks their polished facade. 'You know, most people only give me things because they want something. But you... you're different, aren't you?'", stat_deltas: { stress: -5, allure: 2 } }
    }
  },
  'sydney': {
    id: 'sydney',
    name: "Sydney",
    race: "Human",
    relationship: 15,
    love_interest: true,
    location: 'school',
    description: "A studious, deeply religious student who works as the school librarian's assistant. Sydney is unfailingly polite, bookish, and naïve. They spend their free time at the temple and genuinely believe in the goodness of people. Whether they remain pure or become corrupted depends entirely on your influence — they are remarkably impressionable.",
    responses: {
      'social': { narrative_text: "Sydney looks up from a thick tome, pushing their spectacles up their nose. 'Oh! Hello there. I was just reading about the founding of the temple. Did you know the original altar was carved from a single piece of marble?'", stat_deltas: { stress: -10, purity: 5 } },
      'work': { narrative_text: "Sydney carefully stamps and shelves returned books, humming a hymn under their breath. 'The library needs tidying if you'd like to help? I could use the company.'", stat_deltas: { stress: -5, willpower: 3, purity: 2 } },
      'flirt': { narrative_text: "Sydney's cheeks flush crimson and they nearly drop their book. 'I... that's... the temple teaches that...' They trail off, flustered. Then, very quietly, barely above a whisper: 'Do you really think so? About me?' Their eyes are wide and hopeful behind their spectacles.", stat_deltas: { lust: 3, purity: -2, stress: -5 } },
      'threaten': { narrative_text: "Sydney takes a step back, clutching their book to their chest like a shield. 'Violence is never the answer. Mara teaches forgiveness and...' Their voice wavers, but they stand their ground. 'I'll pray for you. Whatever darkness you're carrying, there's still light in you. I believe that.'", stat_deltas: { stress: 5, purity: 3 } },
      'gift': { narrative_text: "Sydney accepts the gift with both hands, examining it with genuine delight. 'Oh, how wonderful! You're so kind. The temple teaches that generosity is the highest virtue.' They beam at you. 'I'll treasure this. Let me find something to give you in return — I think I have a pressed flower from the garden...'", stat_deltas: { stress: -10, purity: 5 } }
    }
  },
  // ── DoL People of Interest ─────────────────────────────────────────────
  'bailey': {
    id: 'bailey',
    name: "Bailey",
    race: "Human",
    relationship: -30,
    location: 'orphanage',
    description: "The tyrannical caretaker of the orphanage. Bailey runs the institution like a protection racket, demanding weekly payments from every orphan under their roof. Those who can't pay face escalating punishments. Despite their cruelty, Bailey is shrewd and connected — they know everyone in town and have dirt on most of them.",
    responses: {
      'social': { narrative_text: "Bailey's cold eyes sweep over you. 'Where's my money? You owe me for another week. Don't make me ask again.' They crack their knuckles menacingly.", stat_deltas: { stress: 25, trauma: 5 } },
      'work': { narrative_text: "Bailey tosses a mop at you. 'The basement needs cleaning. Again. And don't even think about slacking off — I'll be watching the cameras.'", stat_deltas: { stamina: -15, stress: 15 } },
      'flirt': { narrative_text: "Bailey pauses, one eyebrow rising. Then a cold, humourless laugh. 'Oh, that's rich. You think batting your eyes is going to make me forget what you owe? Cute try, kid.' They lean close. 'But I decide who charms who around here. Don't forget it.'", stat_deltas: { stress: 15, lust: 3 } },
      'threaten': { narrative_text: "Bailey's expression doesn't change, but the temperature in the room drops. 'Did you just threaten me? In my own building?' They snap their fingers and two thugs materialize in the doorway. 'I think someone needs a reminder of who's in charge around here.' The thugs crack their knuckles.", stat_deltas: { stress: 30, trauma: 10, pain: 10 } },
      'gift': { narrative_text: "Bailey takes the gift, turns it over once, and pockets it. 'This doesn't cover your debt, if that's what you're thinking.' But their voice is fractionally less harsh than usual. 'But... it's noted. Now get back to work.'", stat_deltas: { stress: -5 } }
    }
  },
  'jordan': {
    id: 'jordan',
    name: "Jordan",
    race: "Human",
    relationship: 10,
    location: 'temple_gardens',
    description: "A devout monk/nun at the temple. Jordan is serene, composed, and deeply spiritual. They offer counsel, chastity devices, and blessing rituals to those who seek them. Their calm exterior hides a fierce conviction — they view corruption as a cancer to be excised and will go to great lengths to 'save' those they deem fallen.",
    responses: {
      'social': { narrative_text: "Jordan inclines their head peacefully. 'Peace be upon you, child. The temple is always open to those who seek refuge. Come, sit with me awhile.' Their voice is soft as a prayer.", stat_deltas: { stress: -15, purity: 5, trauma: -3 } },
      'work': { narrative_text: "Jordan passes you a watering can. 'The flowers in the meditation garden need tending. Work done in service of the divine is never wasted.'", stat_deltas: { stress: -10, purity: 3 } },
      'flirt': { narrative_text: "Jordan pauses their prayers, brow furrowing gently. 'These feelings you speak of... they are natural, but they must be tended carefully, like a garden. The heart is precious. So are you.' They fold their hands. 'Perhaps we should speak more. In the light of Mara's teaching, not the darkness of impulse.'", stat_deltas: { stress: -5, purity: 5, lust: 2 } },
      'threaten': { narrative_text: "Jordan's serenity is absolute in the face of your threat. They simply look at you with calm, deep eyes. 'You carry much pain. I understand. But this path leads only to more.' They gesture to the altar. 'The goddess does not judge. Come, whenever you are ready.'", stat_deltas: { stress: 5, purity: 3, trauma: -2 } },
      'gift': { narrative_text: "Jordan accepts the gift with both hands and bows their head. 'In the name of Mara, I receive this offering with gratitude.' They set it carefully on the altar. 'Your generosity will be remembered. May the divine guide your steps — and ease the weight you carry.'", stat_deltas: { stress: -12, purity: 8, trauma: -3 } }
    }
  },
  'harper': {
    id: 'harper',
    name: "Harper",
    race: "Human",
    relationship: 0,
    location: 'hospital',
    description: "The head physician at Nightingale Hospital. Brilliant, clinical, and unsettling. Harper's bedside manner veers between professional detachment and invasive curiosity. They treat the sick and injured with remarkable skill, but their methods sometimes feel more like experiments than treatments. They also run the asylum on the edge of town.",
    responses: {
      'social': { narrative_text: "Harper peers at you over their half-moon spectacles. 'Fascinating. Your pupil dilation is... unusual. Come, let me take some notes.' Their pen hovers over a clipboard.", stat_deltas: { stress: 10, health: 10, pain: -5 } },
      'work': { narrative_text: "Harper gestures to a tray of instruments. 'I need someone to sterilize these. Mind the scalpels — they're sharper than they look. And don't touch the blue vials.'", stat_deltas: { stress: 5, stamina: -10 } },
      'flirt': { narrative_text: "Harper tilts their head and scribbles something. 'Interesting response. You display classic attachment-seeking behaviour, likely a product of early trauma and inadequate nurturing.' They tap their pen against their lips. 'I'd like to observe you further. Purely clinically, you understand. Sit down.'", stat_deltas: { stress: 10, lust: 3 } },
      'threaten': { narrative_text: "Harper does not flinch. They look at you over their spectacles with the detached curiosity of someone cataloguing a rare specimen. 'Aggression noted. Possibly stress-induced or trauma-adjacent. I'm going to recommend a sedative.' They reach unhurriedly for a small vial. 'Do be still.'", stat_deltas: { stress: 15, trauma: 3 } },
      'gift': { narrative_text: "Harper examines the gift with meticulous interest. 'A gift. Prosocial behaviour — that's encouraging, given your history.' They pocket it neatly. 'I'll add it to your file. And I'll note that your interpersonal skills appear to be developing. Progress.' For Harper, that is high praise.", stat_deltas: { stress: -5, health: 5 } }
    }
  },
  'leighton': {
    id: 'leighton',
    name: "Leighton",
    race: "Human",
    relationship: -10,
    location: 'school',
    description: "The headmaster of the town school. Leighton is strict, authoritarian, and views discipline as the highest virtue. They patrol the hallways with a rigid posture and an eagle eye for rule-breakers. Punishment is swift and harsh — detention, caning, or worse. There are whispered rumours about what happens to students sent to their office after hours.",
    responses: {
      'social': { narrative_text: "Leighton looks down their nose at you. 'Loitering in the hallways again? Don't you have somewhere to be? This school has rules, and you will follow them.'", stat_deltas: { stress: 15, trauma: 3 } },
      'work': { narrative_text: "Leighton assigns you detention. 'You will scrub every desk in this classroom until I can see my reflection in them. And if I find a single streak, you start over.'", stat_deltas: { stamina: -15, stress: 15, trauma: 5 } },
      'flirt': { narrative_text: "Leighton's expression could curdle milk. 'How DARE you address a faculty member in that manner.' They reach for the punishment ledger. 'Three detentions, and if you ever speak to me like that again, I will have you expelled and reported to the magistrate. Am I clear?'", stat_deltas: { stress: 25, trauma: 8 } },
      'threaten': { narrative_text: "Leighton fixes you with a stare that has broken far tougher students. 'You think you can threaten me? I have been running this institution for twenty-two years.' They open the punishment ledger with deliberate calm. 'I will enjoy making the next months of your academic life unforgettable.'", stat_deltas: { stress: 20, trauma: 10 } },
      'gift': { narrative_text: "Leighton regards the gift as if it might be a trap. They inspect it thoroughly, then set it aside with stiff formality. 'Attempting to curry favour with faculty is a violation of Rule Seventeen.' A very long pause. 'However. I note your... effort.' They say nothing more, but they do not return the gift.", stat_deltas: { stress: -5, trauma: -2 } }
    }
  },
  'landry': {
    id: 'landry',
    name: "Landry",
    race: "Human",
    relationship: -15,
    location: 'prison',
    description: "The warden of the town prison. A stocky, weathered figure who runs the prison with brutal efficiency. Landry believes in punishment over rehabilitation and has no sympathy for those in their charge. They are rumoured to be in Bailey's pocket, accepting bribes and looking the other way.",
    responses: {
      'social': { narrative_text: "Landry jingles a heavy ring of keys. 'Another mouth to feed. Just what I needed. You'll earn your keep in the quarry, or you'll rot in solitary. Your choice.'", stat_deltas: { stress: 20, trauma: 5 } },
      'work': { narrative_text: "Landry watches you break rocks with cold satisfaction. 'Faster. The stone won't quarry itself. And stop whimpering — you brought this on yourself.'", stat_deltas: { stamina: -20, stress: 10, pain: 10 } },
      'flirt': { narrative_text: "Landry spits on the prison floor. 'You've got nerve, I'll give you that. Won't do you a lick of good in here.' They step close enough that you can smell tobacco and iron. 'There are no exceptions in my prison. Not for a pretty face. Not for anything. Get back to work.'", stat_deltas: { stress: 25, trauma: 5 } },
      'threaten': { narrative_text: "Landry laughs — a short, ugly sound. 'A threat. In my prison. That's almost impressive.' They crack their knuckles. 'I've got a nice quiet cell with your name on it. Solitary. No light, no company, no privileges. Say another word.'", stat_deltas: { stress: 30, trauma: 10, pain: 5 } },
      'gift': { narrative_text: "Landry glances at the bribe with practised nonchalance, then pockets it with the speed of long habit. 'I don't do favours. But I'm willing to forget I saw you in the wrong corridor tonight.' They turn their back. 'Don't push your luck.'", stat_deltas: { stress: -8 } }
    }
  },
  'charlie': {
    id: 'charlie',
    name: "Charlie",
    race: "Human",
    relationship: 10,
    location: 'dance_studio',
    description: "The local dance instructor, passionate and demanding. Charlie runs the dance studio with fierce dedication, pushing their students to excel. They are initially wary of newcomers but warm up quickly to those who show genuine effort and talent. Their teaching style is intense but encouraging.",
    responses: {
      'social': { narrative_text: "Charlie stretches gracefully at the barre. 'You want to learn? Good. It takes discipline, dedication, and a willingness to look foolish. Can you handle that?'", stat_deltas: { stress: -5, willpower: 5 } },
      'work': { narrative_text: "Charlie claps their hands rhythmically. 'One-two-three, one-two-three! Feel the music, don't just hear it. Let your body speak.' They adjust your posture with firm but gentle hands.", stat_deltas: { stamina: -15, stress: -10, allure: 2 } },
      'flirt': { narrative_text: "Charlie stops mid-plié, then straightens slowly with a measured look. 'Careful. Flattery is easy. What I want from you is the hard work — then we'll see.' But there's a softness at the corner of their mouth, and their next correction of your form is a little gentler than it needs to be.", stat_deltas: { stress: -10, lust: 5, allure: 3 } },
      'threaten': { narrative_text: "Charlie plants their feet — dancer's feet, impossibly balanced — and meets your gaze without flinching. 'You think intimidation works in a dance studio? The body tells every lie.' They fold their arms. 'I've seen the worst this city has to offer. You don't scare me. Leave — or put on your shoes and get to work.'", stat_deltas: { stress: 10, willpower: 3 } },
      'gift': { narrative_text: "Charlie accepts the gift with real surprise, turning it over in their nimble hands. 'You didn't have to do this.' The armour comes down just a little. 'I teach because I love it, not for thanks.' They meet your eyes. 'But it means something. Thank you.' They tuck it away carefully before going back to the barre.", stat_deltas: { stress: -10, allure: 2, willpower: 3 } }
    }
  },
  'darryl': {
    id: 'darryl',
    name: "Darryl",
    race: "Human",
    relationship: 5,
    location: 'strip_club',
    description: "The owner of the strip club. Darryl is a quiet, haunted figure who watches over their establishment from behind the bar. They've seen too much and done too much to be easily shocked. Despite the nature of their business, they try to protect their workers — a vestige of decency in a place soaked in exploitation. Their past is traumatic and rarely discussed.",
    responses: {
      'social': { narrative_text: "Darryl polishes a glass, staring at nothing. 'You're too young for a place like this, kid. But I won't turn you away. Everyone needs somewhere to go.' They pour you a glass of water.", stat_deltas: { stress: -5, willpower: 3 } },
      'work': { narrative_text: "Darryl nods towards the stage. 'If you want to dance, the rules are simple: no touching the customers, tips are yours, and if anyone gets aggressive, you call me. Understood?'", stat_deltas: { stress: 5, willpower: 5 } },
      'flirt': { narrative_text: "Darryl keeps polishing their glass, but the motion slows. 'Don't.' Their voice is quiet. 'Not here. Not with me.' They set down the glass and meet your eyes. 'I've been where you're standing. I know what you're trying. Just... come back tomorrow. Sober. We'll talk.' It's the kindest rejection you've ever received.", stat_deltas: { stress: -5, willpower: 3 } },
      'threaten': { narrative_text: "Darryl doesn't move. Doesn't raise their voice. Just reaches under the bar without breaking eye contact and rests their hand on something heavy and unseen. 'You don't want to finish that sentence.' The music seems louder, the shadows deeper. 'Door's behind you.'", stat_deltas: { stress: 20, trauma: 5 } },
      'gift': { narrative_text: "Darryl stares at the gift for a long moment. Something complicated moves across their face — old hurt and old warmth braided together. 'You're a strange one.' They pocket it slowly. 'Next time you come in, the first drink's on me.' They go back to polishing, but the distant look in their eyes is a little less distant.", stat_deltas: { stress: -12, willpower: 5 } }
    }
  },
  'wren': {
    id: 'wren',
    name: "Wren",
    race: "Human",
    relationship: -5,
    location: 'arcade',
    description: "The sharp-eyed operator of the arcade's high-stakes gambling tables. Wren is calculating, charming, and dangerous. They run rigged games with a smile and never lose their composure. Behind the friendly façade is a shrewd criminal who answers to darker powers. Getting on their bad side is extremely unwise.",
    responses: {
      'social': { narrative_text: "Wren shuffles a deck of cards with hypnotic dexterity. 'Care for a game? I promise I'll go easy on you. Scout's honour.' Their smile doesn't reach their eyes.", stat_deltas: { stress: 10 } },
      'work': { narrative_text: "Wren leans back in their chair. 'I need someone to collect a debt for me. Nothing dangerous — probably. Interested? The pay is good.'", stat_deltas: { stress: 10, willpower: 5 } },
      'flirt': { narrative_text: "Wren catches your eye and holds it, then fans out the deck. 'Pick a card. Don't show me.' You do. When they name it without looking, the smile finally reaches their eyes — just barely. 'I like games with interesting players. Come back when you want to raise the stakes.'", stat_deltas: { lust: 5, stress: 5, allure: 3 } },
      'threaten': { narrative_text: "Wren goes very still. The cards stop. In the sudden quiet, you become aware of the shadows at the back of the room — shapes that weren't there a moment ago. 'Interesting move,' Wren says softly. 'Terrible odds, though.' The cards resume. 'Walk away. I'll forget this happened.'", stat_deltas: { stress: 25, trauma: 8 } },
      'gift': { narrative_text: "Wren examines the gift with the same critical attention they give every hand of cards. 'Bribe, goodwill, or something else entirely?' They pocket it smoothly. 'I'll call it a gesture of good faith. You've bought yourself one future favour. Use it wisely — I don't offer second chances.'", stat_deltas: { stress: -5, willpower: 3 } }
    }
  },
  'winter': {
    id: 'winter',
    name: "Winter",
    race: "Human",
    relationship: 15,
    location: 'museum',
    description: "The curator of the town museum. A gentle, scholarly soul with a passion for ancient history and antiquities. Winter is one of the few people in town who treats everyone — orphan or noble — with equal respect and warmth. They pay well for genuine antiques and are always happy to share knowledge with those willing to listen.",
    responses: {
      'social': { narrative_text: "Winter's eyes light up behind their round spectacles. 'Oh, wonderful! Another curious mind! Come, let me show you something extraordinary — I just acquired a fragment of pre-imperial pottery!'", stat_deltas: { stress: -10, willpower: 5, purity: 2 } },
      'work': { narrative_text: "Winter hands you a soft cloth and a jar of polish. 'The bronze exhibit needs a gentle cleaning. Be careful with the Dwemer cogwheel — it's irreplaceable.'", stat_deltas: { stress: -5, stamina: -10, willpower: 3 } },
      'flirt': { narrative_text: "Winter's spectacles fog slightly as they flush. 'I... oh.' They polish a display case that is already spotless. 'I'm not very practised at... that is to say, I mostly talk to artefacts.' A soft laugh. 'But you're far more interesting than a shard of pottery. Though don't tell the pottery I said so.'", stat_deltas: { stress: -10, lust: 3, purity: 3 } },
      'threaten': { narrative_text: "Winter straightens to their full height, all gentle warmth gone. 'These artefacts belong to the world, not to you or anyone else who would threaten to steal or destroy them.' Their voice is unexpectedly firm. 'I have faced relic hunters, grave robbers, and corrupt officials. Leave. Now. Before I summon the guard.'", stat_deltas: { stress: 10, willpower: -2 } },
      'gift': { narrative_text: "Winter looks at the gift as if you've just placed a golden idol in their hands. 'Is this... genuine? Do you know what this is?' They rush for a magnifying glass. 'This could be from the Third Era! How did you— where did you—' They catch themselves. 'Forgive me. Thank you. Truly. This belongs in a proper exhibit, where everyone can see it.'", stat_deltas: { stress: -15, willpower: 5, purity: 5 } }
    }
  },
  'sam': {
    id: 'sam',
    name: "Sam",
    race: "Human",
    relationship: 20,
    location: 'cafe',
    description: "The warm, cheerful owner of the town café. Sam is one of the few genuinely kind people in town, always ready with a hot meal and a sympathetic ear. They came from humble beginnings themselves and have a soft spot for orphans and strays. The café is their life's work, and they take pride in making it a welcoming haven.",
    responses: {
      'social': { narrative_text: "Sam wipes their hands on their apron and beams. 'Well, if it isn't my favourite customer! Sit down, sit down. I've got fresh pastries just out of the oven. On the house — don't argue.'", stat_deltas: { stress: -15, trauma: -3 } },
      'work': { narrative_text: "Sam gestures to a stack of dishes. 'I could use a hand today — the lunch rush was brutal. I'll pay you fair and you can eat whatever's left over. Deal?'", stat_deltas: { stamina: -10, stress: -5 } },
      'flirt': { narrative_text: "Sam nearly upends the cream jug. 'Oh! I— well!' They press their flour-dusted hands to their cheeks. 'You certainly know how to make a baker flustered.' They busy themselves arranging pastries that are already arranged. 'You're a sweetheart. Now sit down before I burn something from distraction.'", stat_deltas: { stress: -12, lust: 3, purity: 5 } },
      'threaten': { narrative_text: "Sam sets down the rolling pin — slowly, deliberately. 'I want you to hear me clearly. I have built this place from nothing, survived worse things than you can imagine, and I will not be spoken to like that in my own café.' Their voice is quiet but absolute. 'Leave, or I will make you leave. And don't come back until you're ready to be decent.'", stat_deltas: { stress: 10, willpower: -2, purity: -3 } },
      'gift': { narrative_text: "Sam takes the gift and presses it to their heart. 'You darling thing.' Their eyes well up immediately. 'Nobody gives bakers gifts. We give everybody else food and nobody thinks to...' They pull you into a warm, flour-scented hug. 'You're always welcome here. Always. No matter what.'", stat_deltas: { stress: -18, trauma: -5, purity: 5 } }
    }
  },
  'river': {
    id: 'river',
    name: "River",
    race: "Human",
    relationship: 10,
    location: 'school',
    description: "A teacher at the town school. River teaches mathematics with genuine passion and patience, a rare combination in this harsh institution. They are one of the few teachers who actually care about their students' wellbeing, often staying late to help those struggling with their studies. Their quiet kindness is a beacon in the school's oppressive atmosphere.",
    responses: {
      'social': { narrative_text: "River looks up from a stack of papers and smiles. 'Having trouble with the homework? Pull up a chair — I was just going to brew some tea. We'll work through it together.'", stat_deltas: { stress: -10, willpower: 5 } },
      'work': { narrative_text: "River nods encouragingly as you work through a problem set. 'Good, good. You're getting the hang of it. Don't be discouraged — mathematics is a marathon, not a sprint.'", stat_deltas: { stress: -5, willpower: 5 } },
      'flirt': { narrative_text: "River's pen stills. They look at you over the papers for a long moment, and something shifts in their expression — warmth, and carefully managed caution. 'You're a student,' they say quietly. 'And I'm your teacher. Those things matter.' A gentle pause. 'But I'm not blind. And I'm... flattered.' They return to the papers. 'Focus on your studies first.'", stat_deltas: { stress: -5, lust: 3, willpower: 3 } },
      'threaten': { narrative_text: "River sets down their pen. 'I've been teaching in this school for eight years. I've seen students try every trick imaginable.' Their voice is steady, unafraid. 'Whatever you're trying to gain from this, it isn't worth it. Go home. Come back tomorrow, and we'll pretend this didn't happen.'", stat_deltas: { stress: 10, willpower: -2 } },
      'gift': { narrative_text: "River turns the gift over in their hands, genuinely touched. 'You didn't have to do this.' They look at you with the careful attention of someone who has learned to look for things people don't say out loud. 'Is everything all right at home?' A pause. 'My door is always open. For maths problems, and for anything else.'", stat_deltas: { stress: -10, willpower: 5, trauma: -2 } }
    }
  },
  'doren': {
    id: 'doren',
    name: "Doren",
    race: "Human",
    relationship: 5,
    location: 'school',
    description: "The English teacher at the town school. Doren is eccentric, dramatic, and surprisingly permissive compared to the other staff. They encourage creative expression and often turn a blind eye to minor rule infractions. Their classes are genuinely enjoyable, filled with lively discussions about literature and poetry.",
    responses: {
      'social': { narrative_text: "Doren spreads their arms theatrically. 'Ah, literature! The mirror of the soul! Tell me — if you were a character in a novel, what genre would your life be?' They seem genuinely interested in your answer.", stat_deltas: { stress: -10, willpower: 5 } },
      'work': { narrative_text: "Doren taps a stack of student essays. 'I need someone to help me sort these. The handwriting this year is absolutely atrocious. You have neat hands — would you help?'", stat_deltas: { stress: -5, stamina: -5 } },
      'flirt': { narrative_text: "Doren clasps their hands with delight. 'Aha! A declaration! In the grand tradition of Bronte and Austen!' They press a hand to their heart. 'You know, a poet once told me that the bravest act is expressing genuine feeling. I believe they were right.' A theatrical wink. 'I'm quite taken with you too, you know.'", stat_deltas: { stress: -10, lust: 3, willpower: 5 } },
      'threaten': { narrative_text: "Doren blinks once, then tilts their head with the expression of someone encountering a surprising plot twist. 'How very... antagonist of you.' They close their grade book. 'Every villain believes they are the hero of their own story. I wonder what yours says about you.' They don't seem frightened, only genuinely curious.", stat_deltas: { stress: 5, willpower: 3 } },
      'gift': { narrative_text: "Doren receives the gift with theatrical reverence, placing it on their desk like a museum piece. 'A token! A symbol! In the old tradition of giving meaning through objects!' Their eyes sparkle. 'You know, the best literature is about exactly this — the small gestures that carry great weight. You've inspired today's lesson. Thank you.'", stat_deltas: { stress: -12, willpower: 5 } }
    }
  },
  'mason': {
    id: 'mason',
    name: "Mason",
    race: "Human",
    relationship: 5,
    location: 'school',
    description: "The physical education teacher at the school. Mason is built like a wall and runs their classes with military precision, but they are fair and genuinely want their students to be healthy and strong. They have a particular interest in swimming and often take classes to the lake for lessons.",
    responses: {
      'social': { narrative_text: "Mason crosses their muscular arms. 'You look like you could use some exercise. Fresh air and physical activity — best medicine in the world. Want to join the morning run?'", stat_deltas: { stress: -5, willpower: 5 } },
      'work': { narrative_text: "Mason blows their whistle. 'Ten laps around the field, then push-ups until I say stop. No whining — it builds character.' They run alongside you, matching your pace.", stat_deltas: { stamina: -20, stress: -5, pain: 5 } },
      'flirt': { narrative_text: "Mason stares at you, then lets out a surprised bark of laughter. 'You've got fire. I like that.' They toss you a water bottle. 'Don't waste good energy on distractions, though. Channel it into training. You'll thank me in six months.' There's warmth in their eyes despite the deflection.", stat_deltas: { stress: -5, lust: 3, willpower: 5 } },
      'threaten': { narrative_text: "Mason sets down their whistle very deliberately and squares up — all of them. Their physical presence is considerable. 'That's not how we do things here.' Their voice is level, not aggressive. 'I've taught self-defence for fifteen years. I don't need it. But I'll demonstrate if you insist.'", stat_deltas: { stress: 20, pain: 5 } },
      'gift': { narrative_text: "Mason takes the gift and studies it with a coach's analytical eye. 'Thoughtful.' They nod slowly, as if approving a good training decision. 'You put effort in. That's what matters — effort.' They give you a firm handshake. 'Good form. Keep it up.' Coming from Mason, it means the world.", stat_deltas: { stress: -8, willpower: 5, stamina: 5 } }
    }
  },
  'briar': {
    id: 'briar',
    name: "Briar",
    race: "Human",
    relationship: -10,
    location: 'brothel',
    description: "The madam of the brothel hidden deep in the alleyways. Briar is calculating, business-minded, and utterly ruthless. They view everyone as either a commodity or a customer. Despite their cold exterior, they protect their workers with vicious efficiency — not out of kindness, but because damaged goods are bad for business.",
    responses: {
      'social': { narrative_text: "Briar looks you up and down with a merchant's appraising eye. 'Fresh meat. You're young, but that can work in your favour in this business. Interested in employment? The pay is... generous.'", stat_deltas: { stress: 15, lust: 5, purity: -3 } },
      'work': { narrative_text: "Briar counts coins with practised fingers. 'Tonight was profitable. Here's your cut. And remember — what happens in these walls stays in these walls. Understood?'", stat_deltas: { stress: 10, purity: -5 } },
      'flirt': { narrative_text: "Briar's eyebrow rises exactly one millimetre. 'You're flirting with me? Bold.' They study you the way a merchant studies a trade route — calculating profit and risk. 'Everything is a transaction here, darling. If you know that going in, we might just get along.' Their smile is sharp but not unkind.", stat_deltas: { lust: 8, stress: 5, purity: -3 } },
      'threaten': { narrative_text: "Briar laughs — a short, cold sound — and snaps their fingers. Two very large, very quiet figures appear from nowhere. 'In this establishment, I am the only person who makes threats.' They lean close. 'And I always collect.' The two figures step closer. 'Apologise, pay, or leave. Pick one.'", stat_deltas: { stress: 30, trauma: 8, pain: 5 } },
      'gift': { narrative_text: "Briar accepts the gift with the deadpan expression of someone who has received odder tributes. They weigh it in one hand. 'A gesture. Fine.' It disappears into a drawer. 'You've bought yourself a marginally more pleasant experience tonight. Don't expect warmth — but competence you'll get.' A pause. 'Good instincts, though.'", stat_deltas: { stress: -5, purity: -2 } }
    }
  },
  'alex': {
    id: 'alex',
    name: "Alex",
    race: "Human",
    relationship: 10,
    love_interest: true,
    location: 'farm',
    description: "A hardworking farmhand struggling to keep their family farm running after their parents' passing. Alex is earnest, kind, and perpetually exhausted. They need help — desperately — and will welcome anyone willing to put in an honest day's work. Building the farm up together can blossom into something deeper.",
    responses: {
      'social': { narrative_text: "Alex wipes sweat from their brow and manages a tired smile. 'Hey. Thanks for coming by. I know it's not glamorous work, but... it means a lot. More than you know.'", stat_deltas: { stress: -10, willpower: 5, purity: 3 } },
      'work': { narrative_text: "Alex hands you a pair of work gloves. 'The south field needs planting, the fence is broken again, and the chickens got out. Pick your poison.' They laugh, but there's exhaustion in their eyes.", stat_deltas: { stamina: -15, stress: -5, willpower: 5 } },
      'flirt': { narrative_text: "Alex goes bright red under their farmer's tan, fumbling the pitchfork. 'I... well... I mean...' They look down at their mud-caked boots and dirt-stained clothes. 'You sure you mean me? I'm not exactly a noble or anything.' But when they look back up, the hope in their eyes is unmistakable.", stat_deltas: { stress: -10, lust: 3, purity: 2 } },
      'threaten': { narrative_text: "Alex's expression hardens — you forget how strong farm work has made them. They plant the pitchfork in the ground and step forward, jaw set. 'I've fought off wolves, bandits, and drought. Don't think I can't handle you.' Their voice is steel. 'But I'd rather not. This doesn't have to be ugly.'", stat_deltas: { stress: 15, willpower: -3 } },
      'gift': { narrative_text: "Alex stares at the gift, then at you, their eyes glistening. 'You... you didn't have to...' Their voice cracks. 'Nobody's given me anything since Ma and Pa passed. Thank you.' They pull you into a brief, fierce hug that smells of hay and honest sweat.", stat_deltas: { stress: -15, purity: 5, willpower: 3 } }
    }
  }
};
