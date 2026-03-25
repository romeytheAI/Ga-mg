import { useLocationStore, LocationInfo } from '../store/locationStore';
import { useGameStore } from '../store/gameStore';

export const initStartingLocations = () => {
  const addLocation = useLocationStore.getState().addLocation;

  // Seyda Neen Docks
  const seydaNeenDocks: LocationInfo = {
    id: 'seyda_neen_docks',
    name: 'Seyda Neen Docks',
    description: () => {
      const time = useGameStore.getState().time;
      let timeDesc = '';
      if (time.hour >= 6 && time.hour < 12) timeDesc = 'The morning fog clings to the stagnant water.';
      else if (time.hour >= 12 && time.hour < 18) timeDesc = 'The midday sun beats down on the wooden planks.';
      else if (time.hour >= 18 && time.hour < 20) timeDesc = 'The sun begins to set over the Inner Sea.';
      else timeDesc = 'The docks are dark and quiet under the light of Masser and Secunda.';

      return `You stand on the wooden docks of Seyda Neen, a small Imperial outpost in Vvardenfell. The smell of salt and swamp water fills the air. ${timeDesc}\n\nGuards in bonemold armor patrol lazily. To the north lies the Census and Excise Office, your first stop in this unfamiliar land. To the east, the swamp stretches out infinitely.`;
    },
    actions: [
      {
        label: 'Observe the water',
        description: 'Take a moment to look into the murky depths of the Inner Sea.',
        timeCost: 15,
        onExecute: () => {
          const game = useGameStore.getState();
          game.modifyStat('stress', -100); // Reduce stress a bit
          game.modifyStat('arousal', 50); // Maybe seeing an argonian swimming makes you feel something? (DoL logic)
        }
      },
      {
        label: 'Work on the docks',
        description: 'Help the local dockworkers move some crates for a few septims.',
        timeCost: 120, // 2 hours
        conditions: () => {
          const game = useGameStore.getState();
          return game.time.hour >= 8 && game.time.hour < 18 && game.stats.fatigue > 20;
        },
        onExecute: () => {
          const game = useGameStore.getState();
          game.modifyStat('fatigue', -30);
          game.modifyStat('septims', 15);
          game.modifyStat('stress', 200);
        }
      }
    ],
    exits: [
      { id: 'census_office', label: 'Census and Excise Office', timeCost: 5 },
      { id: 'bitter_coast_swamp', label: 'Bitter Coast Swamp', timeCost: 20 }
    ]
  };

  // Census and Excise Office
  const censusOffice: LocationInfo = {
    id: 'census_office',
    name: 'Census and Excise Office',
    description: () => {
      return `The interior of the office is cramped and smells of old parchment and cheap incense. An Imperial officer sits behind a heavy wooden desk, eyeing you suspiciously.\n\n"You've finally arrived, but our records don't show from where," he mutters.`;
    },
    actions: [
      {
        label: 'Speak with Socucius Ergalla',
        description: 'Answer the Imperial agent\'s questions.',
        timeCost: 30,
        onExecute: () => {
          const game = useGameStore.getState();
          game.modifyStat('stress', 50);
        }
      },
      {
        label: 'Steal a Limeware Platter',
        description: 'A valuable platter sits unattended on a shelf. It\'s risky.',
        timeCost: 5,
        conditions: () => {
          // Can only steal if we haven't already (simplified condition: if we have less than 50 septims, assume we didn't sell it yet)
          return useGameStore.getState().stats.septims < 50;
        },
        onExecute: () => {
          const game = useGameStore.getState();
          // High risk, high reward DoL style
          if (Math.random() > 0.5) {
            // Success
            game.modifyStat('septims', 300);
            game.modifyStat('stress', 500); // Heart pounding
          } else {
            // Failure (Caught) - DoL punishment logic
            game.modifyStat('stress', 1500);
            game.modifyStat('trauma', 500);
            game.modifyStat('arousal', 200); // Punishment arousal trope
            // In a real DoL implementation, this would trigger a 'struggle' or 'event' scene.
            // For now, it just damages stats heavily.
            game.modifyStat('health', -20);
          }
        }
      }
    ],
    exits: [
      { id: 'seyda_neen_docks', label: 'Back to Docks', timeCost: 5 },
      { id: 'arrilles_tradehouse', label: 'Arrille\'s Tradehouse', timeCost: 10 }
    ]
  };

  // Arrille's Tradehouse
  const arrillesTradehouse: LocationInfo = {
    id: 'arrilles_tradehouse',
    name: 'Arrille\'s Tradehouse',
    description: () => {
       return `A warm, smoky tavern and general store. Locals gather around the central fire pit, drinking mazte and gossiping in hushed tones. Arrille, an Altmer merchant, stands behind the bar.`;
    },
    actions: [
      {
        label: 'Rent a bed (10 Septims)',
        description: 'Pay for a warm bed to rest and recover fatigue.',
        timeCost: 480, // Sleep for 8 hours
        conditions: () => useGameStore.getState().stats.septims >= 10,
        onExecute: () => {
          const game = useGameStore.getState();
          game.modifyStat('septims', -10);
          game.setStat('fatigue', game.stats.maxFatigue);
          game.setStat('health', game.stats.maxHealth);
          game.modifyStat('stress', -2000);
          game.modifyStat('arousal', -1000); // Sleeping reduces arousal naturally
        }
      },
      {
        label: 'Drink Sujamma (20 Septims)',
        description: 'A potent local brew. High stress relief, but increases hallucination and lowers inhibitions.',
        timeCost: 60,
        conditions: () => useGameStore.getState().stats.septims >= 20,
        onExecute: () => {
           const game = useGameStore.getState();
           game.modifyStat('septims', -20);
           game.modifyStat('stress', -3000);
           game.modifyStat('hallucination', 500);
           game.modifyStat('fatigue', -10);
        }
      }
    ],
    exits: [
      { id: 'census_office', label: 'Census Office', timeCost: 10 },
      { id: 'bitter_coast_swamp', label: 'Leave town to the Swamp', timeCost: 15 }
    ]
  };

  // Bitter Coast Swamp
  const bitterCoastSwamp: LocationInfo = {
    id: 'bitter_coast_swamp',
    name: 'Bitter Coast Swamp',
    description: () => {
      const time = useGameStore.getState().time;
      let desc = `The stagnant air of the Bitter Coast chokes you. Giant mushrooms loom over murky pools of water. Strange insects buzz incessantly.`;

      if (time.hour >= 20 || time.hour < 5) {
        desc += `\n\nIt is night. Shadows dance among the trees, and the croaks of unseen creatures echo ominously. You feel incredibly vulnerable out here.`;
      }
      return desc;
    },
    actions: [
      {
        label: 'Forage for mushrooms',
        description: 'Spend time looking for alchemical ingredients. Might be dangerous.',
        timeCost: 120,
        onExecute: () => {
          const game = useGameStore.getState();
          game.modifyStat('fatigue', -20);

          const roll = Math.random();
          if (roll < 0.3) {
             // Found something valuable
             game.modifyStat('septims', 25);
             game.modifyStat('stress', -100);
          } else if (roll > 0.8) {
             // Encounter! (DoL style minor hazard)
             game.modifyStat('stress', 800);
             game.modifyStat('trauma', 200);
             game.modifyStat('health', -15);
             // Damage clothing
             game.damageClothing('upper', 10);
             game.damageClothing('lower', 10);
          } else {
             // Nothing much
             game.modifyStat('stress', 100);
          }
        }
      },
      {
        label: 'Wander deeper (Increase Corruption)',
        description: 'Something draws you further into the swamp, towards an ancient ruin pulsing with dark energy.',
        timeCost: 60,
        onExecute: () => {
           const game = useGameStore.getState();
           game.modifyStat('corruption', 1500); // Fast track to late game
           game.modifyStat('stress', 1000);
           game.modifyStat('hallucination', 300);
        }
      }
    ],
    exits: [
      { id: 'seyda_neen_docks', label: 'Flee back to town', timeCost: 30 }
    ]
  };

  addLocation(seydaNeenDocks);
  addLocation(censusOffice);
  addLocation(arrillesTradehouse);
  addLocation(bitterCoastSwamp);
};
