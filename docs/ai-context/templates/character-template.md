# Character Reference: [CHARACTER_NAME]

## Quick Reference
- **ID**: `[character_id]`
- **Full Name**: [Full Character Name]
- **Type**: [NPC, Love Interest, Antagonist, Merchant, etc.]
- **Race**: [Human, Elf, etc.]
- **Gender**: [Male, Female, Configurable, Non-binary]
- **Starting Location**: [Location Name]
- **Primary Role**: [Brief role description]

---

## Locations

[CHARACTER_NAME] can be found at the following locations:

### Primary Location
- **[Location Name]** (`location_id`)
  - [Description of when/why they're here]
  - [Available interaction types]
  - [Time restrictions if any]

### Secondary Locations
- **[Location Name 2]** (`location_id_2`)
  - [Description]

- **[Location Name 3]** (`location_id_3`)
  - [Description]

---

## Character Profile

### Personality
- **Core Traits**: [List 3-5 defining personality traits]
- **Emotional State**: [Default emotional state]
- **Voice**: [How they speak - tone, style, patterns]
- **Motivations**: [What drives this character]

### Background
[2-3 paragraph character background. Include:
- Their history
- Current situation
- Relationship to player
- Key life events
- Goals and fears]

### Relationships
- **[Character Name]**: [Relationship type] - [Description]
- **[Character Name]**: [Relationship type] - [Description]
- **Player**: [Relationship type] - [Description]

---

## Interaction System

### Response Types

[CHARACTER_NAME] responds to [X] of the 15 standard interaction types:

#### Social Interactions
- **social**: [How they respond to general conversation]
- **work**: [How they respond to work/collaboration]
- **tease**: [How they respond to teasing]
- **confide**: [How they respond to secrets/confessions]
- **beg**: [How they respond to pleas for help]

#### Emotional Interactions
- **comfort**: [How they respond to comfort]
- **praise**: [How they respond to compliments]
- **threaten**: [How they respond to threats/hostility]

#### Romance Interactions (if applicable)
- **flirt**: [How they respond to flirtation]
- **gift**: [How they respond to gifts]
- **kiss**: [How they respond to kissing]
- **hold_hands**: [How they respond to hand-holding]
- **cuddle**: [How they respond to cuddling]
- **confess**: [How they respond to romantic confession]
- **date**: [How they respond to date invitation]

### Response Patterns

[CHARACTER_NAME]'s responses typically include:
- **Stat Effects**: [What stats typically change - stress, willpower, etc.]
- **Emotional Tone**: [Typical emotional responses]
- **Physical Reactions**: [Typical body language/reactions]
- **Dialogue Style**: [Speech patterns and style notes]

---

## Associated Quests

### [Quest Type] Quest Line
- **Quest ID**: `quest_id`
- **Type**: [main/side/romance/daily]
- **Description**: [Brief quest description]
- **Objectives**:
  - [Objective 1]
  - [Objective 2]
  - [Objective 3]

### [Another Quest Type]
- **Quest ID**: `quest_id_2`
- **Type**: [type]
- **Role**: [Character's role in this quest]
- **Chapter**: [Chapter number if applicable]

---

## Narrative Themes

When writing content involving [CHARACTER_NAME], emphasize:

### Primary Themes
1. **[Theme 1]**: [Description of how this theme manifests]
2. **[Theme 2]**: [Description]
3. **[Theme 3]**: [Description]

### Secondary Themes
- [Theme A]
- [Theme B]
- [Theme C]

### Emotional Beats
- **[Emotion]**: [When/why this emotion appears]
- **[Emotion]**: [Description]
- **[Emotion]**: [Description]

---

## Technical Details

### Code References

#### NPC Definition
```typescript
// src/data/npcs.ts:[line_range]
NPCS['[character_id]'] = {
  id: '[character_id]',
  name: '[Character Name]',
  race: '[Race]',
  // ... full definition location
}
```

#### Location References
```typescript
// src/data/locations.ts:[line] ([location_id].npcs)
// src/data/locations.ts:[line_range] ([location_id] actions)
```

#### Quest References
```typescript
// src/data/quests.ts:[line_range]
QUESTS['[quest_id]'] = { ... }
```

### Stats & Effects

[CHARACTER_NAME] interactions typically provide:
- **Stress**: [range] ([always increases/decreases/varies])
- **Willpower**: [range] ([description])
- **Purity**: [range] ([description])
- **[Other stats]**: [range] ([description])

---

## Development Guidelines

### Do's ✅
- [Guideline 1 - what to do when writing this character]
- [Guideline 2]
- [Guideline 3]
- [Guideline 4]

### Don'ts ❌
- [Guideline 1 - what NOT to do]
- [Guideline 2]
- [Guideline 3]
- [Guideline 4]

### Voice Guidelines

[CHARACTER_NAME]'s dialogue should:
- [Voice guideline 1]
- [Voice guideline 2]
- [Voice guideline 3]
- [Voice guideline 4]

**Example Good Dialogue**:
> [Quote showing correct character voice]

**Example Bad Dialogue**:
> [Quote showing incorrect voice] *(Reason why it's wrong)*

---

## Content Expansion Ideas

### Potential New Interactions
1. **[Interaction Name]**: [Description]
2. **[Interaction Name]**: [Description]
3. **[Interaction Name]**: [Description]

### Quest Expansion
1. **[Quest Concept]**: [Description]
2. **[Quest Concept]**: [Description]
3. **[Quest Concept]**: [Description]

### Character Growth Arcs
1. **[Arc Name]**: [Description of character development]
2. **[Arc Name]**: [Description]
3. **[Arc Name]**: [Description]

---

## Version History

- **v1.0** ([YYYY-MM-DD]): Initial context card created
  - [Notable details about initial version]
  - [What was included]

---

## Related Characters

For cross-reference, [CHARACTER_NAME] has significant relationships with:
- **[Character Name]** - See: `docs/ai-context/characters/[filename].md`
- **[Character Name]** - See: `docs/ai-context/characters/[filename].md`

---

## AI Agent Usage Notes

When using this reference as an AI agent:

1. **Character Consistency**: [Guidelines for maintaining consistency]
2. **Stat Effects**: [Guidelines for stat changes]
3. **Location Context**: [Guidelines for location usage]
4. **Quest Integration**: [Guidelines for quest involvement]
5. **Relationship State**: [Guidelines for relationship tracking]
6. **Emotional State**: [Guidelines for emotional consistency]

### Quick Lookup Table

| Interaction Type | Stress Effect | Key Stat | Emotional Tone |
|------------------|---------------|----------|----------------|
| social | [range] | [stat] [change] | [tone] |
| comfort | [range] | [stat] [change] | [tone] |
| flirt | [range] | [stat] [change] | [tone] |
| kiss | [range] | [stat] [change] | [tone] |
| confess | [range] | [stat] [change] | [tone] |
| threaten | [range] | [stat] [change] | [tone] |

---

## Maintenance

**Last Updated**: [YYYY-MM-DD]
**Maintainer**: [Your name or team name]
**Next Review**: [When to review this card again]

**Update Triggers**:
- Changes to `src/data/npcs.ts` ([character_id] entry)
- New quests involving [CHARACTER_NAME]
- Significant dialogue additions
- Character arc modifications

---

## Template Instructions

When creating a new character context card:

1. **Copy this template** to `docs/ai-context/characters/[character_id].md`
2. **Replace all [PLACEHOLDERS]** with actual content
3. **Remove this Template Instructions section**
4. **Fill in all sections** - don't leave empty sections
5. **Validate all code references** - ensure line numbers are correct
6. **Test all cross-references** - make sure linked files exist
7. **Run spell-check** - maintain professional documentation
8. **Commit with descriptive message**: "Docs: Add [CHARACTER_NAME] context card"

### Quick Checklist
- [ ] All [PLACEHOLDERS] replaced
- [ ] Code references validated (file:line)
- [ ] Cross-references working
- [ ] Stats and effects match game data
- [ ] Voice examples provided
- [ ] Development guidelines clear
- [ ] Version history initialized
- [ ] Template instructions removed
