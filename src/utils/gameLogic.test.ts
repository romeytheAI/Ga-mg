import assert from 'node:assert';
import { getSynergies } from './gameLogic.ts';

function testGetSynergies() {
  console.log('Running final tests for getSynergies...');

  // 1. Individual synergies

  // Acrobatic Lover: athletics > 50, seduction > 50
  const acrobaticLover = getSynergies({ athletics: 51, seduction: 51 });
  assert.strictEqual(acrobaticLover.length, 1);
  assert.strictEqual(acrobaticLover[0].name, 'Acrobatic Lover');

  // Shadow Walker: skulduggery > 50, athletics > 50
  const shadowWalker = getSynergies({ skulduggery: 51, athletics: 51 });
  assert.strictEqual(shadowWalker.length, 1);
  assert.strictEqual(shadowWalker[0].name, 'Shadow Walker');

  // Aquatic Predator: swimming > 50, athletics > 50
  const aquaticPredator = getSynergies({ swimming: 51, athletics: 51 });
  assert.strictEqual(aquaticPredator.length, 1);
  assert.strictEqual(aquaticPredator[0].name, 'Aquatic Predator');

  // Domestic Bliss: housekeeping > 50, seduction > 50
  const domesticBliss = getSynergies({ housekeeping: 51, seduction: 51 });
  assert.strictEqual(domesticBliss.length, 1);
  assert.strictEqual(domesticBliss[0].name, 'Domestic Bliss');

  // Criminal Mastermind: school_grades > 50, skulduggery > 50
  const criminalMastermind = getSynergies({ school_grades: 51, skulduggery: 51 });
  assert.strictEqual(criminalMastermind.length, 1);
  assert.strictEqual(criminalMastermind[0].name, 'Criminal Mastermind');

  // 2. Multiple active synergies
  const multiple = getSynergies({ athletics: 51, seduction: 51, skulduggery: 51 });
  // Should trigger Acrobatic Lover (ath, sed) AND Shadow Walker (skul, ath)
  assert.strictEqual(multiple.length, 2);
  const names = multiple.map(s => s.name);
  assert.ok(names.includes('Acrobatic Lover'));
  assert.ok(names.includes('Shadow Walker'));

  // 3. Boundary values

  // Exactly 50 should not trigger
  const exactly50 = getSynergies({ athletics: 50, seduction: 50 });
  assert.strictEqual(exactly50.length, 0);

  // One above, one at 50 should not trigger
  const boundaryMixed = getSynergies({ athletics: 51, seduction: 50 });
  assert.strictEqual(boundaryMixed.length, 0);

  // 4. Empty or partial skills object

  const empty = getSynergies({});
  assert.strictEqual(empty.length, 0);

  const partial = getSynergies({ athletics: 100 });
  assert.strictEqual(partial.length, 0);

  console.log('All tests for getSynergies passed!');
}

try {
  testGetSynergies();
} catch (error) {
  console.error('Tests failed!');
  console.error(error);
  process.exit(1);
}
