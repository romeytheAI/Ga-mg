/**
 * ReadingSystem — handles book collection, literacy progress, and enlightenment.
 * Inspired by "The Elder Scrolls: Book Collect" and C0DA.
 */
import { GameState, Item } from '../types';

/**
 * Resolve the act of reading a book.
 * If illiterate, the text is garbled. If scholar, hidden meanings are revealed.
 */
export function readBook(state: GameState, book: Item): { newState: GameState, log: string } {
  const k = { ...state.player.knowledge };
  let log = "";

  // 1. Literacy Check
  if (k.literacy_level === 'illiterate') {
    log = `You pore over the pages of "${book.name}", but the symbols are nothing more than meaningless scratches of ink to your eyes.`;
    return { newState: state, log };
  }

  // 2. Identification & Discovery
  if (!k.discovered_items.includes(book.id)) {
    k.discovered_items = [...k.discovered_items, book.id];
  }

  // 3. Enlightenment & Skill Gain
  // Lore books grant enlightenment or skill XP
  const gain = 5;
  k.enlightenment = Math.min(100, k.enlightenment + gain);
  
  // 4. Literacy Progression
  if (k.enlightenment > 20 && k.literacy_level === 'basic') k.literacy_level = 'fluent';
  if (k.enlightenment > 50 && k.literacy_level === 'fluent') k.literacy_level = 'scholar';
  if (k.enlightenment > 90 && k.literacy_level === 'scholar') k.literacy_level = 'sage';

  log = `You read "${book.name}". ${book.lore || "The words fill your mind with new perspectives of Mundus."} Your understanding of the world deepens.`;

  return {
    newState: {
      ...state,
      player: { ...state.player, knowledge: k }
    },
    log
  };
}

/**
 * Add a book to the character's permanent library.
 */
export function collectBook(state: GameState, book: Item): GameState {
  const k = { ...state.player.knowledge };
  k.library_size += 1;
  
  // Removing book from inventory to "House" it in the library
  const nextInventory = state.player.inventory.filter(i => i.id !== book.id);

  return {
    ...state,
    player: {
      ...state.player,
      inventory: nextInventory,
      knowledge: k
    }
  };
}
