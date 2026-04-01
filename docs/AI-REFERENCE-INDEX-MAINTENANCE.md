# AI Reference Index - Maintenance Guide

## Overview

This guide explains how to maintain the AI Reference Index system, including updating indexes, validating references, and creating AI context cards.

---

## System Components

The reference index system consists of two main components:

### 1. Technical Index (Code-based)
- **Location**: `src/data/referenceIndex.ts`
- **Purpose**: Fast O(1) lookups for game code
- **Usage**: Runtime queries, validation, statistics
- **Maintenance**: Automatic rebuild on data changes

### 2. AI Context Cards (Documentation)
- **Location**: `docs/ai-context/`
- **Purpose**: Rich context for AI agents and developers
- **Usage**: Character reference, development guidelines
- **Maintenance**: Manual updates when content changes

---

## When to Update

### Automatic Index Updates

The technical index should be rebuilt when:

1. **Adding New Entities**
   - New NPC in `src/data/npcs.ts`
   - New location in `src/data/locations.ts`
   - New quest in `src/data/quests.ts`
   - New item in `src/data/items.ts`

2. **Modifying Relationships**
   - Changing NPC locations
   - Updating quest prerequisites
   - Modifying location connections
   - Changing quest rewards

3. **Data Structure Changes**
   - Adding new fields to NPCs
   - New response types
   - Additional quest types

**Action**: Index rebuilds automatically at runtime. No manual action needed.

### Manual Context Card Updates

AI context cards should be updated when:

1. **Character Content Changes**
   - New dialogue added
   - Personality shifts
   - New relationships established
   - Quest involvement changes

2. **Major Story Additions**
   - New quests featuring character
   - Character arc developments
   - Location additions
   - New interaction types

3. **Balance Changes**
   - Stat effect modifications
   - Relationship score adjustments
   - Reward changes

**Action**: Edit the character's markdown file in `docs/ai-context/characters/`

---

## Validation Workflow

### Pre-Commit Validation

Before committing changes to data files, run validation:

```bash
# Run TypeScript type checking
npm run lint

# Run tests (includes reference validation)
npm test

# Manual validation check
npm run validate-refs  # TODO: Add this script
```

### Continuous Integration

The CI/CD pipeline should:

1. Build the reference index
2. Run validation checks
3. Report broken references
4. Fail build if validation errors exist

**Example GitHub Action**:
```yaml
# .github/workflows/validate-references.yml
name: Validate References
on: [push, pull_request]

jobs:
  validate:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - uses: actions/setup-node@v3
      - run: npm install
      - run: npm run lint
      - run: npm test
      - run: npm run validate-refs
```

---

## Creating New AI Context Cards

### Step 1: Choose Template

Use the template based on entity type:
- **Characters/NPCs**: `docs/ai-context/templates/character-template.md`
- **Locations**: `docs/ai-context/templates/location-template.md`
- **Quests**: `docs/ai-context/templates/quest-template.md`

### Step 2: Extract Data

Gather information from source files:

```bash
# Find character definition
grep -A 50 "id: 'robin'" src/data/npcs.ts

# Find location references
grep -r "robin" src/data/locations.ts

# Find quest involvement
grep -r "robin" src/data/quests.ts
```

### Step 3: Fill Template

Required sections:
- ✅ Quick Reference (ID, name, type, race)
- ✅ Locations (where entity appears)
- ✅ Character Profile (personality, background)
- ✅ Interaction System (response types)
- ✅ Associated Quests
- ✅ Narrative Themes
- ✅ Code References
- ✅ Development Guidelines

Optional sections:
- Content expansion ideas
- Related characters
- AI usage notes
- Quick lookup tables

### Step 4: Validate Content

Before saving, check:
- [ ] All code references are accurate
- [ ] All IDs match source data exactly
- [ ] Stats and effects match game data
- [ ] Narrative description is accurate
- [ ] Cross-references work (other cards exist)
- [ ] Markdown renders properly

### Step 5: Add Cross-References

Link related entities:
```markdown
## Related Characters
- **Bailey** - See: `docs/ai-context/characters/bailey.md`
- **Constance** - See: `docs/ai-context/characters/constance_michel.md`
```

---

## Common Tasks

### Task 1: Add New Character

**Steps**:
1. Add character to `src/data/npcs.ts`
2. Add character to location's `npcs` array in `src/data/locations.ts`
3. Add location actions for character interactions
4. Create AI context card in `docs/ai-context/characters/[name].md`
5. Run validation tests
6. Commit changes

**Validation Checklist**:
- [ ] Character ID is unique
- [ ] All response types are defined
- [ ] Location references are valid
- [ ] Stats follow game balance
- [ ] Context card is complete

### Task 2: Modify Character Locations

**Example**: Move Robin from orphanage to school permanently

**Steps**:
1. Remove `'robin'` from `LOCATIONS.orphanage.npcs`
2. Add `'robin'` to `LOCATIONS.school.npcs`
3. Update `NPCS.robin.location = 'school'`
4. Remove orphanage actions for Robin
5. Update AI context card:
   ```markdown
   ### Primary Location
   - **The Bards College** (`school`)  # Changed from orphanage
   ```
6. Run tests to verify index updates automatically

### Task 3: Add New Quest

**Steps**:
1. Define quest in `src/data/quests.ts`
2. Set prerequisites array (if any)
3. Define rewards (items, gold, XP)
4. Add quest references to NPC context cards
5. Create quest context card (if major quest)
6. Validate quest dependencies

**Validation**:
```typescript
import { getQuestPrerequisites, validateReferences } from '@/data/referenceIndex';

// Check if prerequisites exist
const prereqs = getQuestPrerequisites('q_my_new_quest');
console.log('Prerequisites:', prereqs);

// Validate all references
const validation = validateReferences();
if (!validation.valid) {
  console.error('Errors:', validation.errors);
}
```

### Task 4: Fix Broken Reference

**Example Error**:
```
Location "orphanage" references non-existent NPC "robn" (typo)
```

**Fix**:
1. Find the error in `src/data/locations.ts`
2. Correct the typo: `"robn"` → `"robin"`
3. Run validation again
4. Commit fix

---

## Best Practices

### Data File Organization

**Do's**:
- ✅ Use consistent naming (snake_case for IDs)
- ✅ Keep related data together (all Robin actions grouped)
- ✅ Add comments for complex relationships
- ✅ Use TypeScript types for safety
- ✅ Keep files under 10,000 lines

**Don'ts**:
- ❌ Don't hardcode strings in multiple places
- ❌ Don't create circular dependencies
- ❌ Don't skip response types for NPCs
- ❌ Don't mix ID formats (e.g., 'robin' vs 'Robin')

### Context Card Quality

**Good Context Card**:
- Clear, scannable structure
- Accurate code references
- Narrative guidance
- Development do's/don'ts
- Cross-references to related entities
- Regular updates

**Bad Context Card**:
- Vague or missing information
- Outdated code references
- No usage guidelines
- Inconsistent with game data
- Missing cross-references

### Version Control

**Commit Messages**:
```bash
# Good
git commit -m "Add NPC: Add Merchant Marcus with 15 response types"
git commit -m "Fix: Correct Robin's school location reference"
git commit -m "Docs: Update Robin context card with new quest"

# Bad
git commit -m "Update stuff"
git commit -m "Changes"
```

**Pull Request Template**:
```markdown
## Changes
- Added new NPC: Marcus the Merchant
- Added Marcus to town_square location
- Created AI context card for Marcus

## Validation
- [x] All tests pass
- [x] Reference validation passes
- [x] Context card is complete
- [x] Cross-references added

## Related Issues
Closes #123
```

---

## Troubleshooting

### Issue: "NPC not found in location"

**Symptoms**: getNpcLocations() returns empty array

**Diagnosis**:
1. Check if NPC exists in `src/data/npcs.ts`
2. Check if location has NPC in `npcs` array
3. Check for typos in ID

**Fix**:
```typescript
// Verify NPC exists
console.log(NPCS['robin']); // Should not be undefined

// Verify location reference
console.log(LOCATIONS['orphanage'].npcs); // Should include 'robin'
```

### Issue: "Broken quest prerequisite"

**Symptoms**: Validation reports missing prerequisite

**Diagnosis**:
```typescript
const prereqs = QUESTS['my_quest'].prerequisites;
console.log('Prerequisites:', prereqs);

// Check if each prereq exists
prereqs.forEach(id => {
  if (!QUESTS[id]) {
    console.error(`Missing prerequisite: ${id}`);
  }
});
```

**Fix**: Either add the missing quest or remove the broken reference.

### Issue: "Context card out of date"

**Symptoms**: Card describes features that don't exist

**Diagnosis**:
1. Check "Last Updated" date in card
2. Compare with git history of `src/data/npcs.ts`
3. Look for recent commits that changed character

**Fix**:
1. Update card with current information
2. Update "Last Updated" and "Version History"
3. Commit with clear message

---

## Automation Opportunities

### Suggested Scripts

```json
// package.json
{
  "scripts": {
    "validate-refs": "tsx scripts/validateReferences.ts",
    "build-index": "tsx scripts/buildReferenceIndex.ts",
    "check-context": "tsx scripts/checkContextCards.ts",
    "export-index": "tsx scripts/exportIndexToJson.ts"
  }
}
```

### Pre-commit Hook

```bash
# .git/hooks/pre-commit
#!/bin/bash
npm run lint
npm run validate-refs
if [ $? -ne 0 ]; then
  echo "Reference validation failed. Commit aborted."
  exit 1
fi
```

### CI/CD Integration

Add to GitHub Actions:
```yaml
- name: Validate References
  run: npm run validate-refs

- name: Check Context Cards
  run: npm run check-context
```

---

## Future Improvements

### Phase 2
- Automated context card generation from code
- Visual graph of relationships
- Interactive index browser
- Performance monitoring dashboard

### Phase 3
- Real-time validation in IDE
- AI-assisted context card updates
- Automatic cross-reference linking
- Index versioning and migration tools

---

## Getting Help

### Documentation
- **Technical Spec**: `docs/REFERENCE-INDEX-SPEC.md`
- **Solution Design**: `docs/AI-REFERENCE-INDEX-SOLUTIONS.md`
- **Character Template**: `docs/ai-context/templates/character-template.md`

### Common Questions

**Q: How often should I update context cards?**
A: Update when character content changes significantly (new quests, dialogue, or relationships).

**Q: Can I skip validation?**
A: No. Validation catches errors before they reach players.

**Q: How do I test my changes locally?**
A: Run `npm test` and `npm run validate-refs`

**Q: What if validation is slow?**
A: Index building should be < 100ms. If slower, report performance issue.

---

## Appendix: Quick Reference

### Important Files
- `src/data/npcs.ts` - All NPC definitions
- `src/data/locations.ts` - All location definitions
- `src/data/quests.ts` - All quest definitions
- `src/data/referenceIndex.ts` - Index builder and API
- `docs/ai-context/characters/` - Character context cards

### Key Commands
```bash
npm run lint          # Type checking
npm test              # Run all tests
npm run validate-refs # Validate references
npm run dev           # Start dev server
```

### Contact
- Issues: GitHub Issues
- Discussions: GitHub Discussions
- Documentation: `docs/` directory
