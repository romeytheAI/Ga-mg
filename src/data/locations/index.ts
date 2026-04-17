/**
 * Elder Scrolls Locations - Ported from DOL
 * 
 * All locations reskinned from Degrees of Lewdity to fit Elder Scrolls lore
 */

export { temple_of_maraData as templeOfMaraData } from './temple_of_mara';
export { ratwayData } from './ratway';
export { skyforgeData } from './skyforge';
export { dark_sanctuaryData as darkSanctuaryData } from './dark_sanctuary';
export { sleeping_giantData as sleepingGiantData } from './sleeping_giant';
export { khajiit_caravanData as khajiitCaravanData } from './khajiit_caravan';
export { jorrvaskrData } from './jorrvaskr';
export { senchalData } from './senchal';
export { rimmenData } from './rimmen';
export { orcrestData } from './orcrest';
export { duneData } from './dune';

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

  { id: 'silvenar', name: 'Silvenar', region: 'Valenwood' },
  { id: 'elden_grove', name: 'Elden Grove', region: 'Valenwood' },
  { id: 'arenthia', name: 'Arenthia', region: 'Valenwood' },
  { id: 'cormount', name: 'Cormount', region: 'Valenwood' },
];

export default elderscrollsLocations;
