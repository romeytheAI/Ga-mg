export const QUEST_NARRATIVES: Record<string, any> = {
  q_es2_bloodmoon_prophecy: {
    id: 'q_es2_bloodmoon_prophecy',
    title: 'The Bloodmoon Prophecy',
    description: 'A prophecy speaks of a blood-red moon that heralds the return of werewolves. As the moon grows red, attacks increase. Someone must stop the cycle.',
    steps: [
      {
        step: 'investigate_attacks',
        narrative: "You travel to the outskirts of Riften where the first attacks occurred. The scenes are brutal — livestock torn apart, farmers missing. Moonrise is approaching. You find claw marks that don't match any normal beast. The locals whisper of legends — werewolves that once ruled these lands before the Companions drove them into the deep forest. A priest of Arkay tells you the old pack was never destroyed, merely scattered. Now they've gathered again under a new alpha.",
        success_narrative: "You gather evidence of the attacks and piece together the legend. The pack is real and they're gathering.",
        fail_narrative: "You find nothing useful. The trail has gone cold."
      },
      {
        step: 'find_alpha',
        narrative: "Following the ancient legends, you journey to the Glen. The old Nords there remember the old ways — ways of the beast. An elder points you to the northern mountains where the pack gathers at the bloodmoon. The path is treacherous, filled with traps the werewolves have set. But you push through, driven by the knowledge that dozens will die if you fail.",
        success_narrative: "You locate the werewolf den in the mountains. Smoke rises from within — they've gathered.",
        fail_narrative: "You wander the mountains for days, finding only empty caves and old traps."
      },
      {
        step: 'confront_pack',
        narrative: "The den is a ruined fortress. Dozens of werewolves surround you. The alpha steps forward — a massive creature that was once a man. 'You come to kill us?''it speaks in a voice like grinding stones. 'We were here first. The Nords drove us out, killed our families. Now we return the favor.''The bloodmoon rises outside, painting everything red. You have seconds to decide.",
        success_narrative: "You defeat the alpha in combat, proving superior strength. The pack respects this.",
        fail_narrative: "You cannot defeat the alpha alone. You retreat, wounded, knowing you'll have to try again."
      },
      {
        step: 'resolution',
        narrative: "With the alpha dead or surrendered, the pack looks to you for leadership. Kill them all and end the threat forever, or offer them a pact — leave the settlements, hunt only in the deep wild. The choice will shape the future of these lands.",
        kill_narrative: "You slaughter the remaining werewolves. The threat is ended, but something in you dies with them.",
        pact_narrative: "You offer the pact. The pack accepts. They disperse into the wild, and the bloodmoon rises over empty hills."
      }
    ]
  },
  q_es3_shadows_of_malacath: {
    id: 'q_es3_shadows_of_malacath',
    title: 'Shadows of Malacath',
    description: 'Orc strongholds are being attacked from within. Someone is murdering Orcs and leaving their bodies as warnings. The tradition of the stronghold demands vengeance.',
    steps: [
      {
        step: 'investigate_stronghold',
        narrative: "The stronghold of Narzulbur is in mourning. Three Orcs have been killed, their bodies displayed at the gate with their weapons removed. The chief, Durogra, demands answers. 'We are under attack from a enemy we cannot see. Someone is killing us in our own home.''The wounds are precise — a killer who knows Orcish physiology.",
        success_narrative: "You examine the bodies. The wounds are consistent with an Orc blade — one of their own did this.",
        fail_narrative: "You find nothing useful. The deaths remain a mystery."
      },
      {
        step: 'track_killer',
        narrative: "Following the trail of blood, you discover hidden passages within the stronghold — tunnels that haven't been used in generations. At the end, you find a cache of stolen weapons and a journal written in broken Orcish. The killer is Roggvir, a disgraced Orc who was banished for cowardice. He's returned for revenge against those who exiled him.",
        success_narrative: "You find Roggvir's hideout. He prepares to fight, his eyes wild with grief and rage.",
        fail_narrative: "The trail goes cold. The tunnels are a maze."
      },
      {
        step: 'confront_killer',
        narrative: "Roggvir stands amidst his trophies — weapons of those he killed. 'They cast me out! Called me weak! Now they know what weak looks like.''His madness is complete. He sees you as another enemy. The fight begins.",
        success_narrative: "You defeat Roggvir. He falls, still cursing the names of those who wronged him.",
        fail_narrative: "Roggvir is stronger than he looks. You retreat to fight another day."
      },
      {
        step: 'justice',
        narrative: "With Roggvir dead, justice must be served. The chief asks what to do with the killer's body. Traditional Orcish law demands desecration, but you suggest a proper burial — even enemies deserve the care of Malacath. The chief considers.",
        desecrate_narrative: "The body is mutilated and displayed as an example. The Orcs nod grimly.",
        bury_narrative: "The chief agrees. Roggvir is buried with proper rites. 'You bring honor to our traditions,''the chief says."
      }
    ]
  },
  q_es4_dwemer_echoes: {
    id: 'q_es4_dwemer_echoes',
    title: 'Dwemer Echoes',
    description: 'Strange machinery is activating in an ancient Dwemer ruin. The metal men may be waking, or something worse has taken control.',
    steps: [
      {
        step: 'explore_ruin',
        narrative: "The ruin of Bthardamz lies in the mountains, its towers still standing after millennia. You enter carefully — Dwemer architecture is always dangerous. Steam hisses from vents, gears turn where no one should be. The central sphere glows with inner light. Something is activating.",
        success_narrative: "You navigate the traps and reach the central chamber. The machine is active.",
        fail_narrative: "You trigger a trap and barely escape. The entrance is lost."
      },
      {
        step: 'understand_machine',
        narrative: "The Dwemer created great machines. This one seems to be a supercomputer of sorts, processing something. You find logs in the Dwemer language — they've been calculating something for thousands of years. The answer is almost ready.",
        success_narrative: "You decipher enough to understand — it's calculating the location of the heart of a god.",
        fail_narrative: "The language is beyond you. You understand nothing."
      },
      {
        step: 'activation',
        narrative: "The machine completes its calculation. The great sphere cracks open, revealing a spherical entity — a missing piece of a greater machine. It speaks in tones that hurt your mind. 'I have waited. Now I shall rise again.''The Dwemer made devices to become gods. This is one.",
        destroy_narrative: "You smash the mechanism! The entity screams in frequencies that shatter stone. It dies.",
        control_narrative: "You touch the controls, trying to understand. The entity offers you a bargain — power beyond imagining.",
        ignore_narrative: "You leave it. Some things should not be disturbed. Behind you, the machine continues."
      }
    ]
  },
  q_es5_sanguine_carnival: {
    id: 'q_es5_sanguine_carnival',
    title: "Sanguine's Carnival",
    description: 'A traveling carnival appears in Skyrim, but something is wrong. People who enter do not come out, or come out... changed.',
    steps: [
      {
        step: 'find_carnival',
        narrative: "The carnival appears without warning — one day the fields are empty, the next day tents rise as if from nothing. The people there smile too much, move too smoothly. Children are drawn to it, but those who enter are not the same when they leave.",
        success_narrative: "You locate the carnival at dusk. The lights are already lit.",
        fail_narrative: "The carnival moves. You cannot find it."
      },
      {
        step: 'investigate',
        narrative: "Inside, everything is wondrous. Performers do impossible tricks, food tastes like memories, the music makes you want to dance forever. You barely remember why you came. A performer approaches — beautiful, impossible, wrong. 'Join us. Stay forever. Isn't this what you want?'",
        success_narrative: "You resist the charm, breaking through to see the truth.",
        fail_narrative: "The charm is too strong. You join the carnival. It's only later you understand what you've lost."
      },
      {
        step: 'confront_daedra',
        narrative: "In the back of the carnival, you find the master. Sanguine himself, Daedric Prince of debauchery. 'A mortal who resists! How delightful.''He's not here to harm — merely to collect those who would choose this. But the choice is being taken from them.",
        challenge_narrative: "You challenge Sanguine. He laughs and offers a game — win and the carnival leaves, lose and you stay forever.",
        negotiate_narrative: "You reason with the Prince. He listens, amused. 'Very well. A bargain.'"
      }
    ]
  },
  q_es6_blades_reborn: {
    id: 'q_es6_blades_reborn',
    title: 'The Blades Reborn',
    description: 'The ancient dragon hunters are returning. Their leader seeks to rebuild the order, but old wounds have not healed.',
    steps: [
      {
        step: 'delphine_approach',
        narrative: "Delphine runs the Sleeping Giant inn, but she's really the last of the Blades. She tests you carefully before revealing herself. 'The dragons are returning. We failed once — we cannot fail again.''She wants to rebuild the order, but there are enemies on all sides.",
        success_narrative: "You pass her tests. She reveals the Blades''secrets.",
        fail_narrative: "She doesn't trust you. You have more to prove."
      },
      {
        step: 'esbern_find',
        narrative: "Delphine sends you to find Esbern, another surviving Blade. He's hiding in Riften, traumatized by past failures. 'The dragons will kill us all. Why did we ever think we could fight them?''It takes time to convince him to help.",
        success_narrative: "You bring Esbern around. He agrees to help.",
        fail_narrative: "He's too broken. He refuses to leave his hole."
      },
      {
        step: 'rebuild',
        narrative: "Together, Delphine and Esbern begin training you in the old ways. But enemies approach — the Thalmor have learned of the Blades''return. They will not allow the order to reform.",
        success_narrative: "You defend the Blades, driving back the Thalmor attack.",
        fail_narrative: "The Thalmor are too strong. The Blades are scattered again."
      }
    ]
  },
  q_es7_heretiks_call: {
    id: 'q_es7_heretiks_call',
    title: "The Heretic's Call",
    description: 'A man claims to hear the voice of a dead god. His followers multiply. Is he mad, or is something speaking?',
    steps: [
      {
        step: 'find_heretic',
        narrative: "The heretic is called «». He was a priest of the Divines, now he preaches of a new god — one who speaks to him directly. His followers grow weekly. Some say he performs miracles. Others say he's dangerously insane.",
        success_narrative: "You locate the camp. «» preaches to a crowd of hundreds.",
        fail_narrative: "He's moved on. The trail continues."
      },
      {
        step: 'investigate',
        narrative: "You speak with «» directly. His eyes are wild, but his words make terrible sense. 'The old gods are dead. They left us to rot. A new god has risen — one who will actually speak to us.''He claims to receive visions, to speak with the dead god directly. The power he shows is undeniable.",
        success_narrative: "You see through the deception — he's channeling a Daedra, not a dead god.",
        fail_narrative: "His words affect you. You begin to believe."
      },
      {
        step: 'final_choice',
        narrative: "«»'s god is about to manifest. A portal opens, something reaches through. You can stop it, destroy «», or join him in welcoming the new god.",
        stop_narrative: "You close the portal, destroying «». The false god screams and vanishes.",
        join_narrative: "You step through the portal. The new god welcomes you. You are changed forever."
      }
    ]
  },
  q_es8_miraaks_whispers: {
    id: 'q_es8_miraaks_whispers',
    title: "Miraak's Whispers",
    description: 'The first Dragon Priest has awoken. He speaks to you in your dreams, offering power... or warning of your doom.',
    steps: [
      {
        step: 'first_dream',
        narrative: "You dream of a throne of black stone, a figure in dragon priest robes. 'I am Miraak. I was Dragonborn before you. You take what should be mine. We will meet soon.''You wake with the knowledge that something ancient has awakened.",
        success_narrative: "The dream is clear. Miraak is real and he knows you.",
        fail_narrative: "You dismiss it as nightmare. But the dreams continue."
      },
      {
        step: 'find_solstheim',
        narrative: "Miraak's temple is on the island of Solstheim. The journey is dangerous — the island is filled with new threats, creatures from the north. But there you will find answers about your own power.",
        success_narrative: "You reach Solstheim. The island is wild and dangerous.",
        fail_narrative: "The journey defeats you. You return to Skyrim, no closer to answers."
      },
      {
        step: 'confront_miraak',
        narrative: "In the temple, you finally meet Miraak. He's everything the legends said and more — a thousand years of knowledge, power beyond any mortal. 'You are strong. But you are young. I have waited so long, and now I will take what is mine — the power you carry.''The battle for your soul and the world begins.",
        defeat_narrative: "You defeat Miraak! His power flows into you, making you stronger than ever.",
        accept_narrative: "You cannot defeat him. You strike a bargain — share the power, serve him.",
        die_narrative: "Miraak is too strong. You fall, your power stolen."
      }
    ]
  }
};