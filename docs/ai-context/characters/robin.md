# Character Reference: Robin

## Quick Reference
- **ID**: `robin`
- **Full Name**: Robin
- **Type**: NPC, Love Interest
- **Race**: Human
- **Gender**: Configurable (player choice)
- **Starting Location**: Honorhall Orphanage
- **Primary Role**: Childhood friend, primary romance option

---

## Locations

Robin can be found at the following locations:

### Primary Location
- **Honorhall Orphanage** (`orphanage`)
  - Most common location
  - Shares dormitory with player
  - Available for all interaction types

### Secondary Locations
- **The Bards College** (`school`)
  - Attends classes when available
  - Study together options
  - Available during school hours

- **Town Square** (`town_square`)
  - Social/shopping location
  - Date location option
  - Available afternoons/evenings

---

## Character Profile

### Personality
- **Core Traits**: Gentle, kind, vulnerable, loyal
- **Emotional State**: Anxious, hopeful, resilient
- **Voice**: Soft-spoken, empathetic, occasionally self-deprecating
- **Motivations**: Escape orphanage, protect player, build a better life

### Background
Robin is the player's childhood friend at Honorhall Orphanage. Despite the harsh environment and constant abuse from Matron Grelod, Robin maintains a gentle and caring nature. They share a deep bond with the player forged through years of mutual support and protection. Robin dreams of escaping the orphanage and making a life together with the player.

### Relationships
- **Player**: Best friend, potential romance
- **Bailey**: Fear/antagonist - oppressive caretaker
- **Constance Michel**: Friendly/sympathetic - kind assistant
- **Matron Grelod**: Fear/hatred - abusive headmistress
- **Whitney**: Complicated - school bully

---

## Interaction System

### Response Types

Robin responds to all 15 standard interaction types:

#### Social Interactions
- **social**: General conversation, comfort, companionship
- **work**: Helping with chores, studying together
- **tease**: Playful banter (responds with shy amusement)
- **confide**: Sharing secrets (very receptive)
- **beg**: Asking for help (always tries to help)

#### Emotional Interactions
- **comfort**: Seeking/giving comfort (very effective)
- **praise**: Compliments (responds with humility)
- **threaten**: Hostile actions (deeply hurt, traumatic)

#### Romance Interactions
- **flirt**: Romantic interest (shy but receptive)
- **gift**: Receiving gifts (grateful, treasures them)
- **kiss**: Physical affection (nervous but willing)
- **hold_hands**: Intimate gesture (meaningful to Robin)
- **cuddle**: Close physical comfort (highly effective)
- **confess**: Romantic confession (reciprocates feelings)
- **date**: Formal romantic outing (accepts eagerly)

### Response Patterns

Robin's responses typically include:
- **Stat Effects**: Reduces player stress, increases willpower/purity
- **Emotional Tone**: Warm, vulnerable, genuine
- **Physical Reactions**: Blushing, nervous gestures, soft touches
- **Dialogue Style**: Hesitant but heartfelt, uses player's name

---

## Associated Quests

### Romance Quest Line
- **Quest ID**: `q_romance_robin`
- **Type**: Romance
- **Description**: Build a relationship with Robin and help them escape the orphanage
- **Objectives**:
  - Increase relationship to 50+
  - Complete 5 date activities
  - Help Robin earn money
  - Protect Robin from Bailey

### Main Story Involvement
- **Quest ID**: `q_ch1_orphans_cage`
- **Type**: Main
- **Role**: Supporting character in orphanage escape arc
- **Chapter**: 1

---

## Narrative Themes

When writing content involving Robin, emphasize:

### Primary Themes
1. **Vulnerability and Strength**: Robin appears fragile but has inner resilience
2. **Economic Desperation**: Constant poverty shapes their worldview
3. **Loyalty and Trust**: Deep bonds formed through shared hardship
4. **Hope vs. Despair**: Struggles to maintain optimism

### Secondary Themes
- Coming of age in harsh circumstances
- Power dynamics (oppressor/oppressed)
- Found family vs. biological family
- Survival and moral choices
- First love and emotional awakening

### Emotional Beats
- **Relief**: When player shows kindness
- **Fear**: When threatened or when Bailey appears
- **Joy**: During rare moments of happiness
- **Determination**: When protecting player or pursuing dreams
- **Intimacy**: During romantic moments

---

## Technical Details

### Code References

#### NPC Definition
```typescript
// src/data/npcs.ts:99-250
NPCS['robin'] = {
  id: 'robin',
  name: 'Robin',
  race: 'Human',
  relationship: 50,
  love_interest: true,
  location: 'orphanage',
  // ... full definition
}
```

#### Location References
```typescript
// src/data/locations.ts:8 (orphanage.npcs)
// src/data/locations.ts:43-57 (orphanage actions)
// src/data/locations.ts:83 (school.npcs)
```

#### Quest References
```typescript
// src/data/quests.ts:180-220
QUESTS['q_romance_robin'] = { ... }
```

### Stats & Effects

Robin interactions typically provide:
- **Stress**: -5 to -20 (always reduces stress)
- **Willpower**: +2 to +5 (builds confidence)
- **Purity**: +2 to +5 (maintains moral center)
- **Trauma**: -3 to -8 (healing effect on romance interactions)
- **Lust**: +3 to +12 (on romantic interactions)

---

## Development Guidelines

### Do's ✅
- Maintain gentle, empathetic voice
- Show vulnerability without weakness
- Balance hope with realistic struggle
- Let relationship develop gradually
- Respect player agency in romance
- Show growth over time
- Include nervous physical reactions (blushing, fidgeting)

### Don'ts ❌
- Don't make Robin overly dependent or helpless
- Don't trivialize the abuse they've experienced
- Don't rush romantic progression
- Don't ignore economic reality of their situation
- Don't make them act out of character for plot convenience
- Don't forget their relationship with other NPCs

### Voice Guidelines

Robin's dialogue should:
- Use hesitant speech patterns ("I... I think...")
- Include self-deprecating humor (gently)
- Express gratitude frequently
- Show concern for player's wellbeing
- Use endearments sparingly but meaningfully
- Reflect their education level (literate but not scholarly)

**Example Good Dialogue**:
> "I... I brought you something. It's not much, just a bit of bread I managed to save. You must be hungry after all that work. Please, take it. You've always looked after me, so... let me look after you, just this once."

**Example Bad Dialogue**:
> "Hey! I got us some food! Let's party!" *(Too upbeat/out of character)*

---

## Content Expansion Ideas

### Potential New Interactions
1. **Study Session**: Help Robin with reading/writing
2. **Nightmare Comfort**: Comfort Robin after bad dreams
3. **Market Trip**: Shopping together at town square
4. **Secret Hideout**: Discovery of a safe space
5. **Music/Song**: Robin has a hidden talent for singing

### Quest Expansion
1. **Robin's Past**: Discovering Robin's history before orphanage
2. **Family Search**: Looking for Robin's lost relatives
3. **Career Path**: Helping Robin learn a trade
4. **Home Building**: Saving money to leave orphanage
5. **Wedding Quest**: Late-game marriage option

### Character Growth Arcs
1. **Confidence Building**: Robin becomes more assertive
2. **Skill Development**: Robin learns self-defense or trade
3. **Leadership**: Robin helps other orphans
4. **Independence**: Robin learns to stand alone when needed
5. **Healing**: Robin processes trauma and finds peace

---

## Version History

- **v1.0** (2026-04-01): Initial context card created
  - Based on existing NPC definition in `src/data/npcs.ts`
  - Analyzed all 15 response types
  - Documented quest relationships

---

## Related Characters

For cross-reference, Robin has significant relationships with:
- **Bailey** - See: `docs/ai-context/characters/bailey.md`
- **Constance Michel** - See: `docs/ai-context/characters/constance_michel.md`
- **Whitney** - See: `docs/ai-context/characters/whitney.md`
- **Matron Grelod** - See: `docs/ai-context/characters/grelod_the_kind.md`

---

## AI Agent Usage Notes

When using this reference as an AI agent:

1. **Character Consistency**: Always check this card before writing Robin dialogue
2. **Stat Effects**: Use the documented ranges for stat changes
3. **Location Context**: Verify Robin is at the location in your scene
4. **Quest Integration**: Check if relevant quests are active
5. **Relationship State**: Consider current relationship score with player
6. **Emotional State**: Maintain consistency with recent interactions

### Quick Lookup Table

| Interaction Type | Stress Effect | Key Stat | Emotional Tone |
|------------------|---------------|----------|----------------|
| social | -5 to -10 | willpower +2 | Warm, friendly |
| comfort | -15 to -20 | trauma -5 | Vulnerable, grateful |
| flirt | -8 to -12 | lust +5 | Shy, hopeful |
| kiss | -12 to -15 | lust +8 | Nervous, willing |
| confess | -15 to -20 | lust +10 | Emotional, reciprocating |
| threaten | +15 to +25 | trauma +10 | Hurt, betrayed |

---

## Maintenance

**Last Updated**: 2026-04-01
**Maintainer**: AI Development Team
**Next Review**: When Robin content is updated or expanded

**Update Triggers**:
- Changes to `src/data/npcs.ts` (robin entry)
- New quests involving Robin
- Significant dialogue additions
- Character arc modifications
