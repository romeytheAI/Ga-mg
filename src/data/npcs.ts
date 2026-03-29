export const NPCS: Record<string, any> = {
  'constance_michel': {
    id: 'constance_michel',
    name: "Sister Constance",
    race: "Human",
    relationship: 20,
    description: "The assistant at the orphanage. She is a young woman, barely out of her teens, who tries her best to be kind. However, she is clearly exhausted, overworked, and terrified of Matron Grelod. She often sneaks extra food to the younger children when Grelod isn't looking.",
    responses: {
      'social': { narrative_text: "She smiles sadly at you, her eyes darting nervously towards the matron's office. 'Eat quickly, little one. Before she sees you have extra.'", stat_deltas: { stress: -5, willpower: 2 } },
      'work': { narrative_text: "'Thank you for the help. You're a good child. I'll try to sneak you an extra blanket tonight, it's going to be freezing.'", stat_deltas: { stress: -10, purity: 2 } }
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
      'work': { narrative_text: "She inspects your work with a sneer, running a bony finger over a perfectly clean surface. 'You missed a spot. Do it again, all of it, or you'll sleep in the cellar with the rats!'", stat_deltas: { stamina: -15, stress: 10 } }
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
      'work': { narrative_text: "He watches you work with an amused expression. 'Keep your hands quick and your eyes open. The alleys are no place for the slow, and neither is this market.'", stat_deltas: { willpower: 5 } }
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
      'work': { narrative_text: "He hands you a small broom. 'I could use a hand organizing these wares and sweeping up, if you're looking for a few honest coins.'", stat_deltas: { stamina: -10 } }
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
      'work': { narrative_text: "Robin helps you with the chores, humming softly. Their presence makes the drudgery bearable. 'We'll get out of here someday,' they whisper. 'Together.'", stat_deltas: { stress: -10, willpower: 5 } }
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
      'work': { narrative_text: "Whitney watches you work with lazy amusement. 'You missed a spot, orphan.' They kick your bucket over and laugh as the dirty water spreads across the floor you just cleaned.", stat_deltas: { stress: 15, trauma: 3 } }
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
      'work': { narrative_text: "Eden watches you chop wood with a critical eye, then nods curtly. 'Not bad. You might survive out here yet.' High praise from them.", stat_deltas: { stamina: -10, willpower: 5 } }
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
      'work': { narrative_text: "Kylar silently appears beside you and begins helping without being asked. They don't speak, but they keep glancing at you with an intensity that makes you uncomfortable.", stat_deltas: { stress: 5, willpower: 2 } }
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
      'work': { narrative_text: "Avery watches you work with a mixture of pity and distaste. 'Manual labour. How... quaint. You know, you wouldn't need to do this if you'd simply accept my offer.'", stat_deltas: { stress: 10, willpower: 3 } }
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
      'work': { narrative_text: "Sydney carefully stamps and shelves returned books, humming a hymn under their breath. 'The library needs tidying if you'd like to help? I could use the company.'", stat_deltas: { stress: -5, willpower: 3, purity: 2 } }
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
      'work': { narrative_text: "Bailey tosses a mop at you. 'The basement needs cleaning. Again. And don't even think about slacking off — I'll be watching the cameras.'", stat_deltas: { stamina: -15, stress: 15 } }
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
      'work': { narrative_text: "Jordan passes you a watering can. 'The flowers in the meditation garden need tending. Work done in service of the divine is never wasted.'", stat_deltas: { stress: -10, purity: 3 } }
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
      'work': { narrative_text: "Harper gestures to a tray of instruments. 'I need someone to sterilize these. Mind the scalpels — they're sharper than they look. And don't touch the blue vials.'", stat_deltas: { stress: 5, stamina: -10 } }
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
      'work': { narrative_text: "Leighton assigns you detention. 'You will scrub every desk in this classroom until I can see my reflection in them. And if I find a single streak, you start over.'", stat_deltas: { stamina: -15, stress: 15, trauma: 5 } }
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
      'work': { narrative_text: "Landry watches you break rocks with cold satisfaction. 'Faster. The stone won't quarry itself. And stop whimpering — you brought this on yourself.'", stat_deltas: { stamina: -20, stress: 10, pain: 10 } }
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
      'work': { narrative_text: "Charlie claps their hands rhythmically. 'One-two-three, one-two-three! Feel the music, don't just hear it. Let your body speak.' They adjust your posture with firm but gentle hands.", stat_deltas: { stamina: -15, stress: -10, allure: 2 } }
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
      'work': { narrative_text: "Darryl nods towards the stage. 'If you want to dance, the rules are simple: no touching the customers, tips are yours, and if anyone gets aggressive, you call me. Understood?'", stat_deltas: { stress: 5, willpower: 5 } }
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
      'work': { narrative_text: "Wren leans back in their chair. 'I need someone to collect a debt for me. Nothing dangerous — probably. Interested? The pay is good.'", stat_deltas: { stress: 10, willpower: 5 } }
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
      'work': { narrative_text: "Winter hands you a soft cloth and a jar of polish. 'The bronze exhibit needs a gentle cleaning. Be careful with the Dwemer cogwheel — it's irreplaceable.'", stat_deltas: { stress: -5, stamina: -10, willpower: 3 } }
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
      'work': { narrative_text: "Sam gestures to a stack of dishes. 'I could use a hand today — the lunch rush was brutal. I'll pay you fair and you can eat whatever's left over. Deal?'", stat_deltas: { stamina: -10, stress: -5 } }
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
      'work': { narrative_text: "River nods encouragingly as you work through a problem set. 'Good, good. You're getting the hang of it. Don't be discouraged — mathematics is a marathon, not a sprint.'", stat_deltas: { stress: -5, willpower: 5 } }
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
      'work': { narrative_text: "Doren taps a stack of student essays. 'I need someone to help me sort these. The handwriting this year is absolutely atrocious. You have neat hands — would you help?'", stat_deltas: { stress: -5, stamina: -5 } }
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
      'work': { narrative_text: "Mason blows their whistle. 'Ten laps around the field, then push-ups until I say stop. No whining — it builds character.' They run alongside you, matching your pace.", stat_deltas: { stamina: -20, stress: -5, pain: 5 } }
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
      'work': { narrative_text: "Briar counts coins with practised fingers. 'Tonight was profitable. Here's your cut. And remember — what happens in these walls stays in these walls. Understood?'", stat_deltas: { stress: 10, purity: -5 } }
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
      'work': { narrative_text: "Alex hands you a pair of work gloves. 'The south field needs planting, the fence is broken again, and the chickens got out. Pick your poison.' They laugh, but there's exhaustion in their eyes.", stat_deltas: { stamina: -15, stress: -5, willpower: 5 } }
    }
  }
};
