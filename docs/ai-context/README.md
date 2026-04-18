# AI Context Cards

This directory contains rich context documentation for game entities, optimized for consumption by AI agents and developers.

## Purpose

AI context cards provide comprehensive reference material for characters, locations, and quests in a format that's easy for both AI agents and human developers to understand and use.

### Benefits
- **Fast Reference**: Find all character info in one place
- **Consistency**: Maintain character voice and themes across content
- **AI-Friendly**: Structured format optimized for LLM consumption
- **Cross-Referenced**: Links to related characters and code
- **Development Guidance**: Do's/don'ts, voice examples, and tips

## Directory Structure

```
ai-context/
├── README.md                    # This file
├── characters/                  # Character context cards
│   ├── robin.md                # Example: Robin character card
│   └── [more characters...]
├── locations/                   # Location context cards (future)
├── quests/                      # Quest context cards (future)
└── templates/                   # Templates for creating new cards
    └── character-template.md   # Character card template
```

## Using Context Cards

### For AI Agents

When generating content for a character:
1. Read the character's context card
2. Follow the voice guidelines
3. Use the stat effects as reference
4. Maintain consistency with narrative themes
5. Check cross-references for relationships

**Example Prompt**:
```
I'm writing dialogue for Robin. Let me reference the context card at
docs/ai-context/characters/robin.md to ensure consistency with their
established voice, personality, and response patterns.
```

### For Developers

When creating new content:
1. Reference the character card for accuracy
2. Use the quick lookup table for stat effects
3. Follow development guidelines (Do's/Don'ts)
4. Update the card if you add new content
5. Cross-reference related characters

## Creating New Context Cards

### Step 1: Choose Template
Start with the appropriate template:
- **Character/NPC**: `templates/character-template.md`
- **Location**: `templates/location-template.md` (coming soon)
- **Quest**: `templates/quest-template.md` (coming soon)

### Step 2: Copy Template
```bash
cp templates/character-template.md characters/[character_id].md
```

### Step 3: Fill In Details
Replace all `[PLACEHOLDERS]` with actual content:
- Extract data from `src/data/npcs.ts`
- Document personality and voice
- List all locations and interactions
- Add code references with line numbers
- Include development guidelines

### Step 4: Validate
- [ ] All placeholders replaced
- [ ] Code references accurate
- [ ] Cross-references working
- [ ] Stats match game data
- [ ] Voice examples included
- [ ] Development guidelines clear

### Step 5: Commit
```bash
git add docs/ai-context/characters/[character_id].md
git commit -m "Docs: Add [CHARACTER_NAME] context card"
```

## Context Card Structure

Every character context card includes:

1. **Quick Reference** - Basic info (ID, name, race, role)
2. **Locations** - Where the character appears
3. **Character Profile** - Personality, background, relationships
4. **Interaction System** - Response types and patterns
5. **Associated Quests** - Quests involving the character
6. **Narrative Themes** - Writing guidelines and themes
7. **Technical Details** - Code references and stat effects
8. **Development Guidelines** - Do's, don'ts, and voice examples
9. **Content Expansion Ideas** - Future possibilities
10. **Related Characters** - Cross-references
11. **AI Usage Notes** - Quick lookup table and tips
12. **Maintenance Info** - Version history and update triggers

## Example: Robin Character Card

The `characters/robin.md` file demonstrates a complete context card:
- 400+ lines of comprehensive documentation
- All 15 interaction types documented
- Code references to exact line numbers
- Voice examples (good and bad)
- Quick lookup table for stat effects
- Cross-references to 4 related characters

## Maintenance

### When to Update
Update context cards when:
- Character dialogue changes
- New quests involve the character
- Stat effects are rebalanced
- New locations are added
- Character relationships change
- Voice or personality evolves

### How to Update
1. Open the character's `.md` file
2. Update the relevant section(s)
3. Update "Last Updated" date
4. Add entry to "Version History"
5. Commit with descriptive message

### Validation
Check that:
- Code references still point to correct lines
- Stats match current game balance
- Cross-references still exist
- No broken links
- Markdown renders correctly

## Best Practices

### Writing Style
- ✅ Be concise but comprehensive
- ✅ Use clear section headers
- ✅ Include specific examples
- ✅ Provide code references
- ✅ Explain *why*, not just *what*

### Code References
```markdown
#### NPC Definition
```typescript
// src/data/npcs.ts:99-250
NPCS['robin'] = { ... }
```
```

- Always include file path
- Include line numbers or ranges
- Update when code moves
- Use relative paths from repo root

### Cross-References
```markdown
- **Bailey** - See: `docs/ai-context/characters/bailey.md`
```

- Use relative paths
- Verify linked file exists
- Keep links up to date
- Bidirectional linking preferred

## Integration with Reference Index

Context cards complement the technical reference index:

### Reference Index (`src/data/referenceIndex.ts`)
- Fast O(1) runtime lookups
- Type-safe API
- Validation and integrity checking
- Used by game code

### Context Cards (`docs/ai-context/`)
- Rich narrative context
- Development guidelines
- AI comprehension
- Used by AI agents and developers

**Together they provide**:
- Fast technical access (index)
- Rich contextual understanding (cards)
- Complete documentation system

## Contributing

### Adding New Characters
1. Check if character exists in `src/data/npcs.ts`
2. Use `templates/character-template.md`
3. Fill all required sections
4. Validate accuracy
5. Submit PR with clear description

### Improving Existing Cards
1. Identify what needs updating
2. Make changes to relevant section(s)
3. Update version history
4. Test all links and references
5. Submit PR

### Creating New Templates
1. Identify need (location, quest, etc.)
2. Study existing template structure
3. Include all standard sections
4. Add placeholder guidance
5. Document usage instructions

## Resources

### Documentation
- **Technical Spec**: `../REFERENCE-INDEX-SPEC.md`
- **Solution Design**: `../AI-REFERENCE-INDEX-SOLUTIONS.md`
- **Maintenance Guide**: `../AI-REFERENCE-INDEX-MAINTENANCE.md`
- **Implementation Summary**: `../AI-REFERENCE-INDEX-SUMMARY.md`

### Examples
- **Complete Character Card**: `characters/robin.md`
- **Character Template**: `templates/character-template.md`

### Source Data
- **NPC Definitions**: `../../src/data/npcs.ts`
- **Location Data**: `../../src/data/locations.ts`
- **Quest Data**: `../../src/data/quests.ts`

## FAQ

**Q: Why separate context cards from code?**
A: Context cards provide narrative and thematic guidance that doesn't belong in code. They're optimized for human/AI reading, not execution.

**Q: How do I keep cards synchronized with code?**
A: Update cards when you update related code. Use git to track when code changes. Set up reminders for quarterly reviews.

**Q: What if a character's code reference moves?**
A: Update the line numbers in the context card. Consider using git blame to track history.

**Q: Can I write context cards in other formats?**
A: Markdown is preferred for readability and git-friendliness. If you need another format, discuss with the team first.

**Q: How detailed should voice examples be?**
A: Include 1-2 good examples and 1 bad example with explanation. Show key aspects of character voice.

**Q: Do minor characters need context cards?**
A: Priority is major characters (love interests, main quest NPCs). Minor characters can share a collective card or skip until needed.

## Support

For questions or issues:
- Open a GitHub issue
- Check the maintenance guide
- Review the technical specification
- Reference the example (Robin card)

## Version History

- **v1.0** (2026-04-01): Initial README created
  - Established directory structure
  - Documented usage patterns
  - Created character template
  - Wrote Robin example card

---

**Maintained by**: AI Development Team
**Last Updated**: 2026-04-01
**Status**: Active, ready for expansion
