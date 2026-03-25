import { ActiveEncounter, GameActionState } from '../store/gameStore';

export const generateBanditEncounter = (): Omit<ActiveEncounter, 'turn'> => ({
  id: 'encounter_bandit_' + Date.now(),
  name: 'Bandit Ambush',
  description: 'A rough-looking bandit steps out from behind a rock, blocking your path. He eyes you up and down, a cruel smirk on his face.',
  enemyHealth: 100,
  enemyLust: 0,
  choices: [
    {
      label: 'Fight',
      description: 'Draw your weapon and attack.',
      statReq: { stat: 'fatigue', min: 20 },
      onChoose: (game: GameActionState) => {
         const { activeEncounter } = game;
         if (!activeEncounter) return;

         game.modifyStat('fatigue', -20);
         game.modifyStat('stress', 50);

         const dmg = Math.floor(Math.random() * 30) + 10;
         const enemyHealth = Math.max(0, (activeEncounter.enemyHealth || 100) - dmg);

         if (enemyHealth === 0) {
            game.endEncounter("You defeated the bandit! You quickly leave before others arrive.");
            game.modifyStat('septims', Math.floor(Math.random() * 20) + 5);
         } else {
            // Enemy attacks back
            const takenDmg = Math.floor(Math.random() * 20) + 5;
            game.modifyStat('health', -takenDmg);
            game.updateEncounter({
                enemyHealth,
                turn: activeEncounter.turn + 1,
                description: `You strike the bandit for ${dmg} damage! He retaliates, hitting you for ${takenDmg} damage. He looks furious.`
            });
         }
      }
    },
    {
      label: 'Flee',
      description: 'Turn and run as fast as you can.',
      statReq: { stat: 'fatigue', min: 40 },
      onChoose: (game: GameActionState) => {
         game.modifyStat('fatigue', -40);

         if (Math.random() > 0.4) {
            game.endEncounter("You managed to outrun the bandit, gasping for air.");
            game.modifyStat('stress', 100);
         } else {
            game.modifyStat('health', -15);
            game.updateEncounter({
                turn: game.activeEncounter!.turn + 1,
                description: `You try to run, but the bandit tackles you to the ground! You take 15 damage.`
            });
         }
      }
    },
    {
      label: 'Submit',
      description: 'Drop to your knees and surrender.',
      onChoose: (game: GameActionState) => {
         game.modifyStat('trauma', 500);
         game.modifyStat('stress', 200);
         game.modifyStat('arousal', 300);

         // In a real DoL engine this would trigger a sexual sub-encounter phase
         game.damageClothing('upper', 30);
         game.damageClothing('lower', 30);

         game.updateEncounter({
            turn: game.activeEncounter!.turn + 1,
            description: `You submit. The bandit forcefully gropes you, tearing at your clothes. He laughs mockingly before kicking you to the dirt.`
         });

         setTimeout(() => {
            game.endEncounter("The bandit leaves you humiliated in the dirt.");
         }, 3000);
      }
    },
    {
      label: 'Plead',
      description: 'Beg for mercy and offer septims.',
      statReq: { stat: 'septims', min: 10 },
      onChoose: (game: GameActionState) => {
         game.modifyStat('septims', -10);
         game.modifyStat('stress', 50);

         if (Math.random() > 0.5) {
            game.endEncounter("The bandit snatches the coins and tells you to get lost.");
         } else {
            game.updateEncounter({
                turn: game.activeEncounter!.turn + 1,
                description: `The bandit takes your coins but demands more. "That's not enough," he sneers.`
            });
         }
      }
    }
  ]
});
