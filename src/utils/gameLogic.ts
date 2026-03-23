export function getSynergies(skills: any) {
  const synergies = [];
  if (skills.athletics > 50 && skills.seduction > 50) synergies.push({ name: "Acrobatic Lover", description: "Increased success in physical seduction and stamina retention." });
  if (skills.skulduggery > 50 && skills.athletics > 50) synergies.push({ name: "Shadow Walker", description: "Enhanced stealth and evasion in hostile encounters." });
  if (skills.swimming > 50 && skills.athletics > 50) synergies.push({ name: "Aquatic Predator", description: "Superior mobility and combat effectiveness in water." });
  if (skills.housekeeping > 50 && skills.seduction > 50) synergies.push({ name: "Domestic Bliss", description: "NPCs are more easily charmed in domestic settings." });
  if (skills.school_grades > 50 && skills.skulduggery > 50) synergies.push({ name: "Criminal Mastermind", description: "Unlocks advanced dialogue options for manipulation and planning." });
  return synergies;
}

export const getAgeTag = (age: number, race: string) => {
  const adult = race === 'Elf' ? 100 : 60;
  const elder = race === 'Elf' ? 500 : 200;
  if (age < adult) return "[Player is a young, developing adult]";
  if (age < elder) return "[Player is a mature adult]";
  return "[Player is a weathered elder]";
};

export function getFallbackResponse() {
  return {
    narrative_text: "The chaotic energies of Aetherius warp your perception. The outcome is unclear, but you feel a sense of dread settling into your bones.",
    stat_deltas: { health: -5, trauma: 5, stamina: -10 },
    new_affliction: null,
    equipment_integrity_delta: -5,
    hours_passed: 1,
    follow_up_choices: [
      { id: "f1", label: "Press onward cautiously", intent: "cautious", successChance: 50 },
      { id: "f2", label: "Rest and recover", intent: "defensive", successChance: 90 }
    ]
  };
}

export const getHealthSemantic = (h: number) => h > 80 ? 'Robust' : h > 50 ? 'Battered' : h > 20 ? 'Bleeding' : 'Death\\'s Door';
export const getStaminaSemantic = (s: number) => s > 80 ? 'Energetic' : s > 50 ? 'Winded' : s > 20 ? 'Exhausted' : 'Collapsing';
export const getTraumaSemantic = (t: number) => t < 20 ? 'Lucid' : t < 50 ? 'Shaken' : t < 80 ? 'Disturbed' : 'Fractured';
