import { generateBanditEncounter } from './encounters';

export const locations = [
  {
    id: 'seyda_neen_docks',
    name: 'Seyda Neen Docks',
    description: 'The smell of salt and marsh fills the air. A guard stands nearby, watching you lazily. The Census and Excise Office is to your right.',
    actions: [
      {
        label: 'Wait around',
        timeCost: 60,
        execute: (game: any) => {
          game.modifyStat('fatigue', 10);
          game.addLog('You wait for an hour.', 'neutral');

          if (Math.random() < 0.2) {
             game.startEncounter(generateBanditEncounter());
          }
        }
      },
      {
        label: 'Search the barrels',
        timeCost: 15,
        execute: (game: any) => {
          const rng = Math.random();
          if (rng < 0.3) {
             game.modifyStat('septims', 5);
             game.addLog('You found 5 septims hidden in a barrel.', 'good');
          } else if (rng < 0.6) {
             game.modifyStat('stress', 100);
             game.addLog('A rat bit you! Stress increased.', 'bad');
          } else {
             game.startEncounter(generateBanditEncounter());
          }
        }
      },
      {
        label: 'Head into town (Arrille\'s Tradehouse)',
        timeCost: 10,
        execute: (game: any) => {
          game.setLocation('seyda_neen_tradehouse');
          game.addLog('You walk into Arrille\'s Tradehouse.', 'neutral');
        }
      }
    ]
  },
  {
    id: 'seyda_neen_tradehouse',
    name: "Arrille's Tradehouse",
    description: 'A cozy tavern and shop in Seyda Neen. Arrille the Altmer stands behind the counter. A few locals drink in the corner.',
    actions: [
      {
        label: 'Return to Docks',
        timeCost: 10,
        execute: (game: any) => {
          game.setLocation('seyda_neen_docks');
        }
      },
      {
        label: 'Browse Wares',
        timeCost: 0,
        execute: (game: any) => {
          game.openShop('arrilles_tradehouse');
        }
      },
      {
        label: 'Rest in a bed (10 septims)',
        timeCost: 480, // 8 hours
        execute: (game: any) => {
          if (game.stats.septims >= 10) {
             game.modifyStat('septims', -10);
             game.setStat('fatigue', game.stats.maxFatigue);
             game.setStat('health', game.stats.maxHealth);
             game.modifyStat('stress', -500);
             game.addLog('You had a good night\'s rest in a safe bed.', 'good');
          } else {
             game.addLog('You cannot afford a room.', 'bad');
          }
        }
      }
    ]
  }
];
