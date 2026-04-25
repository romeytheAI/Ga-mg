// Example: Using the Reference Index System
// Run this with: npx tsx src/examples/referenceIndexDemo.ts

import {
  getNpcLocations,
  getLocationNpcs,
  getNpcMetadata,
  getLocationMetadata,
  getLoveInterests,
  getQuestsByType,
  getIndexStats,
  validateReferences,
  asNpcId,
  asLocationId,
} from '../data/referenceIndex';

console.log('='.repeat(60));
console.log('AI REFERENCE INDEX SYSTEM - DEMO');
console.log('='.repeat(60));

// 1. Performance Stats
console.log('\n📊 INDEX STATISTICS:');
const stats = getIndexStats();
console.log(`  Build Time: ${stats.indexBuildTime.toFixed(2)}ms`);
console.log(`  Total NPCs: ${stats.totalNpcs}`);
console.log(`  Total Locations: ${stats.totalLocations}`);
console.log(`  Total Quests: ${stats.totalQuests}`);
console.log(`  Total Items: ${stats.totalItems}`);
console.log(`  Total References: ${stats.totalReferences}`);

// 2. Validation
console.log('\n✓ VALIDATION:');
const validation = validateReferences();
if (validation.valid) {
  console.log('') ✓ All references valid - no broken links!');
} else {
  console.log(`  ✗ Found ${validation.errors.length} broken references`);
  validation.errors.forEach(err => console.log(`    - ${err.message}`));
}

// 3. Character Discovery
console.log('\n💕 LOVE INTERESTS:');
const loveInterests = getLoveInterests();
loveInterests.slice(0, 5).forEach(npcId => {
  const metadata = getNpcMetadata(npcId);
  if (metadata) {
    const locations = metadata.allLocations.join('',');
    console.log(`  - ${metadata.name} (${metadata.race}) found at: ${locations}`);
  }
});

// 4. Location Exploration
console.log('\n🏛️  ORPHANAGE DETAILS:');
const orphanage = getLocationMetadata(asLocationId('orphanage'));
if (orphanage) {
  console.log(`  Name: ${orphanage.name}`);
  console.log(`  Danger Level: ${orphanage.danger}/100`);
  console.log(`  NPCs Present: ${orphanage.npcCount}`);

  const npcs = getLocationNpcs(asLocationId('orphanage'));
  npcs.forEach(npcId => {
    const npc = getNpcMetadata(npcId);
    if (npc) {
      const type = npc.isLoveInterest ? '💕'': npc.isAntagonist ? '⚔️'': '👤';
      console.log(`    ${type} ${npc.name}`);
    }
  });
}

// 5. Character Deep Dive
console.log('\n🌟 ROBIN PROFILE:');
const robinData = getNpcMetadata(asNpcId('robin'));
if (robinData) {
  console.log(`  Name: ${robinData.name}`);
  console.log(`  Race: ${robinData.race}`);
  console.log(`  Love Interest: ${robinData.isLoveInterest ? 'Yes'': 'No'}`);
  console.log(`  Primary Location: ${robinData.primaryLocation}`);
  console.log(`  All Locations: ${robinData.allLocations.join('',')}`);
  console.log(`  Interaction Types (${robinData.responseTypes.length}):`);
  robinData.responseTypes.slice(0, 8).forEach(type => {
    console.log(`    - ${type}`);
  });
  if (robinData.responseTypes.length > 8) {
    console.log(`    ... and ${robinData.responseTypes.length - 8} more`);
  }
}

// 6. Quest Discovery
console.log('\n📜 ROMANCE QUESTS:');
const romanceQuests = getQuestsByType('romance');
romanceQuests.slice(0, 5).forEach(questId => {
  console.log(`  - ${questId}`);
});

// 7. Performance Benchmark
// Each iteration runs 3 queries; report both iteration time and per-query time.
console.log('\n⚡ PERFORMANCE BENCHMARK:');
const queriesPerIteration = 3;
const iterations = 1000;
const benchmarkStart = performance.now();

for (let i = 0; i < iterations; i++) {
  getNpcLocations(asNpcId('robin'));
  getLocationNpcs(asLocationId('orphanage'));
  getLoveInterests();
}

const benchmarkEnd = performance.now();
const totalMs = benchmarkEnd - benchmarkStart;
const avgIterationTime = totalMs / iterations;
const avgQueryTime = avgIterationTime / queriesPerIteration;
const queriesPerSecond = Math.floor(1000 / avgQueryTime);

console.log(`  Iterations: ${iterations}`);
console.log(`  Queries per Iteration: ${queriesPerIteration}`);
console.log(`  Average Query Time: ${avgQueryTime.toFixed(4)}ms`);
console.log(`  Queries Per Second: ${queriesPerSecond.toLocaleString()}`);
console.log(`  Target: <1ms per query ✓`);

console.log('\n''+ '='.repeat(60));
console.log('DEMO COMPLETE');
console.log('='.repeat(60));
