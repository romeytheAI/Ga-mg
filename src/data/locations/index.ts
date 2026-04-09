/**
 * Elder Scrolls Locations - Ported from DOL
 * 
 * All locations reskinned from Degrees of Lewdity to fit Elder Scrolls lore
 */

export { templeOfMaraData } from './temple_of_mara';
export { ratwayData } from './ratway';
export { skyforgeData } from './skyforge';
export { darkSanctuaryData } from './dark_sanctuary';
export { sleepingGiantData } from './sleeping_giant';
export { khajiitCaravanData } from './khajiit_caravan';
export { jorrvaskrData } from './jorrvaskr';
export { blue_palaceData } from './blue_palace';
export { winking_skeeverData } from './winking_skeever';
export { bards_collegeData } from './bards_college';
export { castle_dourData } from './castle_dour';
export { solitude_marketData } from './solitude_market';
export { dragontideData } from './dragontide';

export type { LocationData, LocationEvent } from './temple_of_mara';

// Location registry
export const elderscrollsLocations = [
  { id: 'temple_of_mara', name: 'Temple of Mara', region: 'Riften' },
  { id: 'ratway', name: 'The Ratway', region: 'Riften' },
  { id: 'skyforge', name: 'Skyforge', region: 'Whiterun' },
  { id: 'dark_sanctuary', name: 'Dark Brotherhood Sanctuary', region: 'Dawnstar' },
  { id: 'sleeping_giant', name: 'Sleeping Giant Inn', region: 'Riverwood' },
  { id: 'khajiit_caravan', name: 'Khajiit Caravan', region: 'Travelling' },
  { id: 'jorrvaskr', name: 'Jorrvaskr', region: 'Whiterun' },
  { id: 'blue_palace', name: 'Blue Palace', region: 'Solitude' },
  { id: 'winking_skeever', name: 'The Winking Skeever', region: 'Solitude' },
  { id: 'bards_college', name: "Bard's College", region: 'Solitude' },
  { id: 'castle_dour', name: 'Castle Dour', region: 'Solitude' },
  { id: 'solitude_market', name: 'Solitude Market', region: 'Solitude' },
  { id: 'dragontide', name: 'Dragontide', region: 'Solitude' },
];

export default elderscrollsLocations;
