# DnD 5.5e Interactive Character Sheet — Worklog

Project: Next.js 16 / TypeScript / Prisma (SQLite) / shadcn-ui / Tailwind 4

Source PDF: /home/z/my-project/upload/character-sheet (1).pdf
The official Wizards of the Coast DnD 5.5e (2024) character sheet — 2 pages, 411 form fields.
Example character already filled in: "Jichael Mackson", Bard, Elf, Level 2.

---
Task ID: 0
Agent: main
Task: Bootstrap — analyze the PDF, plan the build.

Work Log:
- Extracted PDF form fields via pdf.py → 411 fields total (135 page 1, 276 page 2). Identified all field semantics: ability scores, saving throws, skills (with proficiency checkboxes), weapons table, class features, species traits, feats, equipment training, spell slots (3x3 grid of diamond clusters), cantrips/prepared spells table, coins, languages, appearance, backstory, alignment.
- Rendered both PDF pages to PNG and ran VLM analysis on the layout. Mapped every panel to its grid position; identified signature visual DNA: chamfered panel corners, large circles with arrow pointers for ability modifiers, diamond trackers everywhere (death saves, spell slots, components, attunement), shield/oval/coin-purse silhouettes, graph-paper backgrounds on free-text areas.
- Decided architecture:
  - Single page (`/` route) rendering two "pages" of the character sheet side-by-side / stacked.
  - All fields are editable. Derived stats (modifiers, spell save DC, passive perception, initiative, spell attack) auto-calculate from base values, but every auto-derived value is also user-overrideable (matches the PDF behavior where derived values are written in by hand).
  - Interactive dice roller (d20 with adv/disadv, plus damage dice) embedded as a floating toolbar.
  - State via Zustand store. Persistence to localStorage (auto) AND to SQLite via /api/character (manual save).
  - Pre-populated with Jichael Mackson example so the sheet renders as a real character on first load.
  - Visual design: parchment-cream paper, ornate dark borders, chamfered corners via clip-path, diamonds, circles, graph-paper backgrounds — same look & feel as the official sheet.

Stage Summary:
- Field map complete. Layout map complete. Tech architecture decided.
- Ready to scaffold Prisma schema, types, and rule helpers.

---
Task ID: 1
Agent: main
Task: Build the entire interactive character sheet (frontend + backend + dice roller + persistence)

Work Log:
- Added `Character` model to `prisma/schema.prisma` (id, name, data JSON, createdAt, updatedAt). Pushed to SQLite via `bun run db:push`.
- Created `src/lib/dnd.ts` with all DnD 5.5e rule helpers: abilityModifier, proficiencyBonusByLevel, spellSaveDC, spellAttackBonus, passivePerception, skillCheckTotal, suggestedSpellSlots (full caster table), suggestedHPMax, plus constant tables (ABILITY_NAMES, SKILLS, SAVING_THROWS, ARMOR_TYPES, COIN_TYPES).
- Created `src/lib/character-defaults.ts` defining the `CharacterSheet` type (~50 fields covering all 411 PDF form fields) plus `defaultCharacter()` pre-populated with Jichael Mackson (Bard 2, Elf) — abilities, skills (Acrobatics, Deception, Perception, Performance, Persuasion, Sleight of Hand, Stealth proficient), 3 weapons, class features (Bardic Inspiration, Jack of All Trades, Song of Rest), species traits (Darkvision, Elf cantrip, advantage vs charm), Musician feat, full Bard spell list (Vicious Mockery, Prestidigitation, Mind Sliver, Charm Person, Color Spray, Bane, Cure Wounds, Sleep), 3 L1 spell slots, 128 gp.
- Created `src/store/character-store.ts` (Zustand + persist middleware) holding the full sheet state + roll history. Auto-saves to localStorage key `dnd-character-sheet-v1`.
- Created API routes:
  - `src/app/api/character/route.ts` — GET list / POST save (insert or update by id)
  - `src/app/api/character/[id]/route.ts` — GET load / DELETE
- Created components in `src/components/dnd/`:
  - `dice-roller.tsx` — floating toolbar with advantage/disadvantage toggle, d20 quick-rolls (initiative + 6 saves pulled from character), arbitrary NdM+K rolls, roll history with results list.
  - `sheet-toolbar.tsx` — New / Save / Load / Recalc / Export / Import / Example buttons + Load dialog (lists saved characters, allows delete).
  - `combat-header.tsx` — Page 1 top row: Character Name + Background/Class/Species/Subclass + Level oval + AC shield + HP (Temp/Current/Max) + Hit Dice (Spent/Max) + Death Saves (3 success + 3 failure diamonds).
  - `stats-bar.tsx` — 6-cell horizontal strip: PROFICIENCY BONUS / INTELLIGENCE / INITIATIVE / SPEED / SIZE / PASSIVE PERCEPTION.
  - `ability-card.tsx` — Big circular modifier with up-arrow pointer + trapezoidal score box + saving throw row + skill list with proficiency/expertise circles and per-skill totals. Renders all 6 abilities in a 2x3 grid.
  - `features-column.tsx` — Weapons table (with attack roll button), Damage Cantrips free text, Class Features, Species Traits, Feats (each with graph-paper background).
  - `proficiencies-row.tsx` — Heroic Inspiration shield badge + Armor Training diamonds (Light/Medium/Heavy/Shields) + Weapons/Tools proficiency lists.
  - `spellcasting-header.tsx` — Page 2 left: Spellcasting Ability/Modifier/Save DC/Spell Attack Bonus + Page 2 right: 3x3 spell slots grid with per-slot diamonds (clickable to mark expended) + auto-fill from full caster table.
  - `spells-table.tsx` — Cantrips & Prepared Spells table with Level dropdown, Name, Cast Time, Range, V/S/M component circles, Concentration & Ritual flags, Notes, roll button (auto-parses "1d8+3" damage notation from notes).
  - `character-sidebar.tsx` — Page 2 right sidebar: Appearance / Backstory & Personality + Alignment / Languages / Equipment / Magic Item Attunement / Coins (5 coin-purse shaped boxes for CP/SP/EP/GP/PP).
- Updated `src/app/page.tsx` to a 3-tab layout (Page 1 / Page 2 / All in one). Sticky footer with status text. Dice roller floating bottom-right.
- Updated `src/app/layout.tsx` to add Cinzel serif font (for the D&D banner) and switched Toaster to Sonner.
- Added parchment/ornate styling to `globals.css`: `.parchment-bg` (cream paper with subtle texture overlay), `.sheet-panel` (chamfered corner clip-path), `.sheet-shield`, `.sheet-oval`, `.sheet-coin` (coin-purse shape), `.sheet-grid` (graph-paper background), `.sheet-diamond` (death save / spell slot markers, click-to-fill), `.sheet-circle` (skill proficiency checkbox), `.sheet-modifier-circle` (large circle with up-arrow ::after for ability modifiers), `.sheet-score-box` (trapezoid for ability score), `.sheet-input-line`, `.sheet-input-box`, `.sheet-label` / `.sheet-label-lg`, `.sheet-star` (heroic inspiration), `.sheet-banner` (D&D logo typography with italic ampersand).
- Pre-populated state from the PDF so the page renders as a real character (Jichael Mackson) on first load.

Stage Summary:
- All 411 PDF form fields represented as editable inputs / circles / diamonds / textareas.
- Pre-populated example character is the same Bard 2 / Elf from the PDF.
- Sticky footer at the bottom of the page; tabs let the user see Page 1, Page 2, or both stacked.
- Dice roller floats bottom-right with badge counter for roll history.
- Save/Load to SQLite via API; Export/Import to JSON; Reset to example; New blank sheet; Recalc derived stats button.
- `bun run lint` passes with no warnings or errors.

---
Task ID: 2
Agent: main
Task: Self-verification with Agent Browser + final fixes.

Work Log:
- Opened `http://localhost:3000/` in agent-browser. Page returned HTTP 200, ~70KB HTML, no console errors.
- Took full-page screenshot confirming the parchment background, ornate borders, ability cards, weapons table all render correctly.
- Clicked the "Page 2" tab — verified spell slots grid (3x3) and spells table render with all 8 pre-loaded spells (Vicious Mockery, Prestidigitation, Mind Sliver, Charm Person, Color Spray, Bane, Cure Wounds, Sleep) and the spell-slot diamonds (3 at Level 1).
- Verified derived values: Spellcasting Modifier +4 (CHA 18 → +4), Spell Save DC 14 (8+2+4), Spell Attack +6 (2+4). Initial render showed wrong values because I had DEX=16/CHA=11 swapped from the PDF; fixed the defaults to STR 11, DEX 10, CON 15, INT 10, WIS 16, CHA 18 (matching the actual PDF field values Text63-68).
- Bumped localStorage key from `dnd-character-sheet-v1` to `v2` so the corrected defaults load on refresh (Zustand persist would otherwise restore the wrong cached state).
- Clicked "Save" button → confirmed POST /api/character returned 200; verified SQLite row inserted: id=cmuz718rc..., name='Jichael Mackson', 5339 bytes of JSON data.
- Clicked "Load" button → dialog opened showing the saved character with timestamp "10/8/2026, 7:06:51 AM" (sandbox system clock).
- Clicked the Dice Tower floating button → toolbar opened. Verified quick-roll buttons show correct save modifiers: CON save +4 (proficient + CON +2 + prof +2), WIS save +3 (WIS +3, not proficient), CHA save +4 (CHA +4, not proficient). Clicked CON save — roll recorded: d20+4 = 11 (natural 7).
- Clicked "Export" button — confirmed Jichael Mackson.json (7766 bytes) was downloaded to ~/Downloads/ with the full sheet state (including the death save I had toggled earlier).
- Clicked a death save diamond via JS eval — confirmed state toggled to `is-filled`.
- Clicked an armor training toggle (Light) via JS eval — confirmed background color changed from transparent to rgba(180, 138, 59, 0.15) (gold highlight) for Light/Medium/Shields, but not Heavy.
- Clicked the "All (single page)" tab via JS eval (tab click was tricky because Radix UI Tabs require focus + click in the right order) — confirmed both Page 1 and Page 2 content renders together, including EQUIPMENT TRAINING, SPELLCASTING, Alignment (Chaotic Good), EQUIPMENT, and Coins (cp=0, sp=0, ep=0, gp=128, pp=0).
- Tested mobile viewport (375x800) — layout stacked correctly, no horizontal overflow.
- `bun run lint` passes with 0 errors and 0 warnings.
- Dev server log shows only successful requests (GET / 200, POST /api/character 200, GET /api/character 200) — no runtime errors in the final state.

Stage Summary:
- Browser-verified: page renders, all 3 tabs work, all key interactions (dice roller, save, load, export, death saves, armor training, ability score editing, derived stat recalculation) work end-to-end.
- The character saves to SQLite via the API, loads back, and exports to a 7.7KB JSON file.
- Pre-loaded example (Jichael Mackson, Bard 2, Elf) renders identically to the filled-in PDF on first visit.
- Mobile-responsive (375px viewport works).
- Lint clean. Ready to deliver.

---
Task ID: 3
Agent: main
Task: User-requested refinements — remove dice roller, fix stat bar, auto-derive Initiative/PassivePerception, add JoAT toggle with flat +1.

Work Log:
- Removed `src/components/dnd/dice-roller.tsx` entirely (deleted the file).
- Removed `<DiceRoller />` import and usage from `src/app/page.tsx`. Updated the footer tip text from "click the red dice icon" to "Derived stats auto-update from ability scores".
- Removed the per-weapon "Roll attack" dice button from `src/components/dnd/features-column.tsx` (removed the `Dices` icon import, the `rollD20` selector, the `<div class="flex items-center">` wrapper, and bumped the grid columns from `[1fr_70px_120px_1fr_24px]` to `[1fr_90px_130px_1fr_24px]` to use the freed space).
- Removed the per-spell "Roll spell damage" dice button from `src/components/dnd/spells-table.tsx` (removed `Dices` icon import, `rollDice` selector, the wrapping `<div class="flex items-center">`, kept the simple `<input>` directly).
- Removed `rollD20`, `rollDice`, `pushRoll`, `clearRolls`, the `rolls` state array, and the `RollHistoryItem` type from `src/store/character-store.ts`. Also removed `recalcDerived` (no longer needed since derived stats compute on-the-fly).
- Bumped localStorage version to `v4` (cleared stale cached state with old schema fields like `intelligence`, `proficiencyBonus`, `initiative`, `passivePerception`, `spellSaveDC`, `spellAttackBonus`, `spellcastingModifier`).
- Removed `intelligence`, `proficiencyBonus`, `initiative`, `passivePerception`, `spellcastingModifier`, `spellSaveDC`, `spellAttackBonus` from the `CharacterSheet` interface in `src/lib/character-defaults.ts` (they're all computed at render time now). Removed from both `defaultCharacter()` and `blankCharacter()`.
- Added `jackOfAllTrades: boolean` field to the `CharacterSheet` interface. Defaulted to `true` in `defaultCharacter()` (since the example character is a Bard level 2 — Bards get JoAT at level 2). Defaulted to `false` in `blankCharacter()`.
- Added `toggleJackOfAllTrades` action to the Zustand store.
- Updated `src/lib/dnd.ts`:
  - Added `jackOfAllTradesBonus()` helper that returns a flat `1` (per user's explicit request: "JoAT adds flat +1 not PB/2").
  - Updated `skillCheckTotal(...)` to accept a `joat` parameter; when the character is not proficient and JoAT is on, returns `abilityMod + 1` (flat).
- Rewrote `src/components/dnd/stats-bar.tsx` to be a 5-cell bar (was 6) — removed the INTELLIGENCE cell entirely. New layout: PROFICIENCY BONUS (auto-derived from level) | INITIATIVE (auto-derived from DEX mod) | PASSIVE PERCEPTION (auto-derived from 10 + WIS mod + PB if Perception is proficient) | SPEED (editable) | SIZE (editable). The first three are read-only text displays; SPEED and SIZE are editable inputs.
- Rewrote `src/components/dnd/ability-card.tsx`:
  - Reads `joat = sheet.jackOfAllTrades` from the store.
  - Skill totals now call `skillCheckTotal(mod, prof, st.proficient, st.expertise, joat)`.
  - Saving throw totals also use `skillCheckTotal` (since saving throws are ability checks, JoAT applies when not proficient).
- Updated `src/components/dnd/proficiencies-row.tsx` to add a JoAT toggle button directly under the Heroic Inspiration shield badge. Uses the `Sparkles` lucide icon, shows "Jack of All Trades / +1 to non-proficient checks" label, highlights gold when active.
- Rewrote `src/components/dnd/spellcasting-header.tsx`:
  - Spellcasting Ability is now a `<select>` dropdown (Strength/Dexterity/Constitution/Intelligence/Wisdom/Charisma).
  - Spellcasting Modifier / Spell Save DC / Spell Attack Bonus are read-only computed displays (using `abilityModifier`, `proficiencyBonusByLevel`, `calcSpellSaveDC`, `calcSpellAttackBonus` from `dnd.ts`).
- Removed the "Recalc" button from `src/components/dnd/sheet-toolbar.tsx` (and removed the `Calculator` icon import and the `recalcDerived` selector) — derived stats auto-update live now, so manual recalc is unnecessary.

Verification (Agent Browser):
- Page loads with HTTP 200, no console errors, no runtime errors.
- Toolbar shows only: New / Save / Load / Export / Import / Example (no Recalc).
- Stats bar shows 5 cells: PROFICIENCY BONUS +2, INITIATIVE +0, PASSIVE PERCEPTION 15, SPEED 30, SIZE M (no INTELLIGENCE).
- Verified skill totals are correct:
  - With JoAT ON: Acrobatics (proficient) = +2, Animal Handling (not proficient) = +4 (WIS +3 + JoAT +1), Religion (not proficient) = +1 (INT +0 + JoAT +1), Deception (proficient) = +6, Intimidation (not proficient) = +5 (CHA +4 + JoAT +1).
  - After toggling JoAT OFF: proficient skills unchanged; non-proficient skills dropped by 1 (Animal Handling → +3, Intimidation → +4, Religion → +0).
- Verified spell stats auto-derive: with CHA 18 → Spellcasting Modifier +4, Spell Save DC 14, Spell Attack Bonus +6. After editing CHA to 20 → Spellcasting Modifier +5, Spell Save DC 15, Spell Attack Bonus +7 (all auto-updated without any "Recalc" button press).
- Verified Initiative auto-derives from DEX (10 → +0).
- Verified Passive Perception auto-derives: 10 + WIS(+3) + PB(+2 because Perception is proficient) = 15.
- `bun run lint` passes with 0 errors and 0 warnings.
- Dev server log shows only HTTP 200 responses, no runtime errors after the fixes.

Stage Summary:
- Dice roller entirely removed (file deleted, all references cleared).
- Stat bar reduced from 6 cells to 5 (INTELLIGENCE removed).
- Proficiency Bonus / Initiative / Passive Perception are now read-only auto-derived values computed from level / DEX / WIS + Perception proficiency.
- Skill totals auto-calc: proficient adds PB, expertise doubles PB, JoAT adds flat +1 to non-proficient ability checks.
- Jack of All Trades toggle added under the Heroic Inspiration shield.
- Spellcasting modifier / save DC / attack bonus also auto-derive from the chosen spellcasting ability + level.
- No more "Recalc" button — everything auto-updates at render time.

---
Task ID: 4
Agent: main
Task: User-requested fixes — JoAT for saving throws, clipped JoAT button, dark theme.

Work Log:
- Fixed JoAT so it does NOT apply to saving throws. In `src/components/dnd/ability-card.tsx`, changed `saveTotal = skillCheckTotal(mod, prof, isSaveProficient, false, joat)` to `saveTotal = mod + (isSaveProficient ? prof : 0)` (saving throws are no longer passed the `joat` flag). Updated the docstring to clarify: "Saving throws DO NOT benefit from Jack of All Trades — only skills do."
- Fixed the JoAT button being clipped by the shield shape. The `sheet-shield` class uses `clip-path: polygon(0 0, 100% 0, 100% 55%, 50% 100%, 0 55%)` — anything below 55% on the sides gets clipped. Restructured `src/components/dnd/proficiencies-row.tsx` left column from a single shield-with-both-elements to a flex column with TWO separate panels: (a) `sheet-shield` containing only the Heroic Inspiration star, (b) `sheet-panel` (rectangular with chamfered corners) below it containing the JoAT toggle. The JoAT button now sits inside its own rectangular panel that doesn't clip.
- Switched the entire GUI to a dark theme by updating `src/app/globals.css`:
  - Shadcn variables in `:root` (background, foreground, card, popover, primary, secondary, muted, accent, border, input, ring, sidebar) all set to dark-theme oklch values (deep warm brown background #1a1410, warm cream foreground, gold primary, bronze borders).
  - DnD-specific variables set to dark-friendly values:
    - `--parchment: #1a1410` (deep warm brown-black)
    - `--parchment-dark: #251c14` (slightly lighter for toolbar/footer)
    - `--ink: #e8dcc4` (warm cream text)
    - `--ink-soft: #b8a378` (warm beige)
    - `--ink-faint: #7a6a4f` (faded brown)
    - `--rule: #6b5a3a` (warm bronze border)
    - `--blood: #d4453f` (brighter red for dark bg)
    - `--gold: #d4a949` (brighter gold accent)
    - `--grid: rgba(212, 169, 73, 0.08)` (subtle warm gold graph lines)
  - Updated `.parchment-bg` texture for dark:
    - Radial gradients now produce a warm gold glow from the top (like torchlight) and darker corners (vignette effect).
    - The repeating-linear-gradient grain uses `rgba(255, 220, 150, 0.02)` (very subtle light grain) with `mix-blend-mode: screen` (makes light grain visible on dark, vs. the previous `multiply` for dark grain on light).
  - Updated `.sheet-banner` to add a soft `text-shadow: 0 0 20px rgba(212, 169, 73, 0.3)` for a warm glow on the D&D title.
  - Updated `.sheet-input-line:focus` and `.sheet-input-box:focus` background tints from hardcoded `rgba(58, 44, 20, 0.06)` (invisible on dark) to `rgba(212, 169, 73, 0.12)` (visible gold tint).
  - Added glowing box-shadows to active states: `.sheet-star.is-active`, `.sheet-diamond.is-filled`, `.sheet-circle.is-expertise` all get a subtle warm glow effect.
- Updated the armor-training gold tint in `src/components/dnd/proficiencies-row.tsx` from `rgba(180, 138, 59, 0.15)` (faded brown, was OK on light) to `rgba(212, 169, 73, 0.18)` (brighter gold, visible on dark). Same for the JoAT toggle button.

Verification (Agent Browser):
- Page loads with HTTP 200, no console errors, no runtime errors.
- Verified dark theme colors via getComputedStyle:
  - main background: `rgb(26, 20, 16)` = `#1a1410` (deep dark brown) ✓
  - panel background: same dark brown ✓
  - body color: LAB L=90.7 (warm cream) ✓
- Verified JoAT button is now visible (was previously clipped):
  - Button rect: 164px × 43.75px (non-zero, fully visible)
  - `btnInsideParent: true` (entirely contained in its parent panel, not clipped)
  - background: `rgba(212, 169, 73, 0.15)` (gold tint — active state)
  - color: `rgb(232, 220, 196)` (cream text)
- Verified JoAT no longer applies to saving throws (Bard example, JoAT ON):
  - STR save: +0 (not proficient, no JoAT bonus) ✓ was +1 before fix
  - DEX save: +0 (not proficient, no JoAT bonus) ✓ was +1 before fix
  - CON save: +4 (proficient: +2 mod + +2 PB) ✓
  - WIS save: +3 (not proficient, no JoAT bonus) ✓ was +4 before fix
  - CHA save: +4 (not proficient, no JoAT bonus) ✓ was +5 before fix
- Verified JoAT still applies to SKILLS:
  - Athletics (not proficient): +1 = 0 + 1 JoAT ✓
  - Religion (not proficient): +1 = 0 + 1 JoAT ✓
  - Intimidation (not proficient): +5 = 4 + 1 JoAT ✓
  - Acrobatics (proficient): +2 = 0 + 2 PB ✓ (no JoAT because proficient)
  - Perception (proficient): +5 = 3 + 2 PB ✓ (no JoAT because proficient)
- Verified spell stats still correct on dark theme: Spellcasting Modifier +4, Spell Save DC 14, Spell Attack Bonus +6 ✓
- Mobile viewport (375x800) dark theme renders correctly ✓
- `bun run lint` passes with 0 errors and 0 warnings.
- Dev server log: HTTP 200 responses only, no runtime errors.

Stage Summary:
- JoAT no longer applies to saving throws — only to skill checks. Matches the common house-rule interpretation.
- JoAT toggle button moved into its own panel below the Heroic Inspiration shield, fully visible (no longer clipped by the shield's pointed-bottom clip-path).
- Entire GUI is now dark-themed: deep warm brown background, warm cream text, bronze borders, gold accents, with subtle torchlight glow from the top and darker corners (vignette). All shadcn components (Dialog, Tabs, Buttons) inherit the dark theme via the updated CSS variables.

---
Task ID: 5
Agent: main
Task: Rework the spell tab from a table into spell cards that can display full descriptions.

Work Log:
- Added a new `description: string` field to the `SpellRowState` interface in `src/lib/character-defaults.ts` (kept the existing `notes` field for short mechanical summaries, added `description` for the full spell text).
- Populated the `description` field for all 8 example spells with their actual DnD 5e/5.5e spell text (Vicious Mockery, Prestidigitation, Mind Sliver, Charm Person, Color Spray, Bane, Cure Wounds, Sleep). Also slightly cleaned up the `notes` and `range` fields (e.g. Sleep's notes changed from the inaccurate "Wis save" to "5d8 HP slumber · no save" since Sleep has no save in 5e; Color Spray's range clarified to "15 ft cone"; Charm Person's notes to "Charm 1h · Wis save"; etc.).
- Updated the store's `addSpell` action to include `description: ''` so newly-added spells start with an empty description.
- Completely rewrote `src/components/dnd/spells-table.tsx` from a table layout into a card grid layout:
  - Spells are still grouped by level (Cantrips, Level 1 Spells, etc.) with a gold-accented level header showing the spell count.
  - Each spell is now a card (not a table row) with the following structure:
    - **Header bar**: Bronze/gold level badge (e.g. "C" or "L1") on the left, editable spell name input, concentration/ritual tag chips, and inline V/S/M component toggle letters on the right. Collapse/remove buttons stacked vertically on the far right.
    - **Metadata row**: Cast Time (with Clock icon) | Range (with Target icon) — both editable inputs in a 2-col grid.
    - **Quick notes row**: A short italic one-line input for the mechanical summary (e.g. "1d6 Psychic · Wis save · disadv next attack") — this is the old `notes` field, kept for at-a-glance combat info.
    - **Description area**: The main feature.
      - When collapsed: shows a non-editable preview (first ~80px of the description text) on a graph-paper background. Clicking the preview expands the card.
      - When expanded: shows a 10-row editable textarea with the full spell description (multi-paragraph, supports \n\n).
    - **Footer bar**: Three toggle buttons — Concentration (Flame icon, turns red when active), Ritual (Sparkles icon, turns gold when active), and a Level picker dropdown (Cantrip/L1..L9).
  - Cards are arranged in a responsive grid: 1 column on mobile, 2 columns on desktop (lg breakpoint).
  - The spell list container has a max-height (680px) with scroll overflow and a custom-styled scrollbar.
  - "Add spell" button is in the panel header (top-right), making it always visible regardless of scroll position.
- Bumped localStorage version to `v5` so the new schema (with `description` field) loads cleanly — old `v4` state without the description field is discarded and the example character (with full descriptions) loads instead.

Verification (Agent Browser):
- Page loads with HTTP 200, no console errors, no runtime errors.
- Verified the spell cards render with all 8 example spells on Page 2:
  - 3 cantrip cards under "Cantrips (3)" header: Vicious Mockery, Prestidigitation, Mind Sliver.
  - 5 spell cards under "Level 1 Spells (5)" header: Charm Person, Color Spray, Bane, Cure Wounds, Sleep.
- Each card shows: level badge, editable name, concentration/ritual tags where applicable, V/S/M component letters (with active/inactive styling), cast time + range metadata, italic quick notes line, and a clickable description preview.
- Clicked the description preview on Charm Person → card expanded to a 10-row textarea with the full text: "You attempt to charm a humanoid you can see within range. It must make a Wisdom saving throw, and does so with advantage if you or your companions are fighting it..." — fully editable.
- Clicked the chevron expand button on Prestidigitation → same expand behavior, full description "This spell is a minor magical trick that novice spellcasters use for practice. You create one of the following magical effects..." was displayed in the editable textarea.
- Tested "Add spell" button → a new empty spell card was added with empty name, "L1" badge, and placeholder text "Click to add full spell description…" in the description preview.
- Tested "Remove spell" button → the empty card was removed (count went 9 → 8).
- Verified responsive layout: at desktop (1280px viewport) the cards grid renders 2 columns (`419px + 419px`); at mobile (375px) it stacks to 1 column.
- `bun run lint` passes with 0 errors and 0 warnings.
- Dev server log: HTTP 200 responses only, no runtime errors.

Stage Summary:
- Spell tab is now a card grid (was a table).
- Each spell is a self-contained card showing all metadata + a fully-editable full description.
- Description is collapsed by default (saves screen space) but expands on click to a 10-row textarea where the user can read/edit the full spell text.
- All 8 example spells come pre-populated with their actual DnD 5e spell descriptions.
- Quick mechanical notes (the old `notes` field) are preserved as a separate one-line summary for at-a-glance combat reference.
- Cards group by level with gold-accented headers and spell counts.
- Mobile-responsive: 1 column on mobile, 2 columns on desktop.

---
Task ID: 6
Agent: main
Task: Rework Page 2 — give spells more screen real estate; delete redundant Appearance and Backstory & Personality panels.

Work Log:
- Removed the `AppearancePanel` function from `src/components/dnd/character-sidebar.tsx`.
- Removed the `BackstoryPanel` function from the same file.
- Moved the `Alignment` field into the `LanguagesPanel` (now sits below the Languages textarea, separated by a thin top border). Same character data, just a more sensible home.
- Restructured `CharacterSidebar` from a vertical flex column to a 3-column grid (`grid-cols-1 md:grid-cols-3`): Languages (with Alignment) | Equipment (with Magic Item Attunement) | Coins. Now sits as a compact bottom row instead of a tall right-hand sidebar.
- Reworked `Page2` in `src/app/page.tsx`:
  - Old: `SpellcastingHeader` + 2-col grid `[1fr_30%]` with `SpellsTable` (1fr) | `CharacterSidebar` (30%).
  - New: `SpellcastingHeader` + `SpellsTable` (full width) + `CharacterSidebar` (bottom 3-col row). Spells now own the entire middle vertical space of Page 2.
- Updated `SpellsTable` in `src/components/dnd/spells-table.tsx` for better readability:
  - Removed the `max-h-[680px] overflow-y-auto` constraint — the spells section now flows naturally with the page instead of having its own internal scrollbar.
  - Card grid changed from `grid-cols-1 lg:grid-cols-2` to `grid-cols-1 md:grid-cols-2 2xl:grid-cols-3` — 2 columns on desktop, 3 on very wide (≥1536px) screens.
  - Spell name input bumped from `text-sm` (14px) to `text-base` (16px).
  - Quick-notes input bumped from `text-[11px]` to `text-xs` (12px).
  - Cast Time / Range metadata labels bumped from `text-[8px]` to `text-[9px]`, values from `text-[11px]` to `text-xs`, padding from `px-2 py-1.5` to `px-2.5 py-2`.
  - Description text bumped from `text-[11px]` to `text-xs` (12px).
  - Collapsed description preview max-height bumped from `max-h-[80px]` (2 lines) to `max-h-[160px]` (~5 lines) — most spells' full descriptions are now readable without expanding.
  - Collapsed preview text color changed from `--ink-soft` (muted) to `--ink` (full strength) for readability.
  - Expanded textarea bumped from 10 rows to 12 rows, min-height from 160px to 220px, padding from `p-2` to `p-3`.
  - Padding on the card header bumped from `px-2 py-1.5` to `px-2.5 py-2`.
  - Collapse/Remove buttons bumped from `w-3.5 h-3.5` icons to `w-4 h-4` icons, padding from `px-2` to `px-2.5`.
  - Level-group headers bumped from `text-[10px]` to `text-[11px]`.
- Removed `appearanceNotes` and `backstoryNotes` from the `CharacterSheet` interface in `src/lib/character-defaults.ts`. Also removed them from `defaultCharacter()` and `blankCharacter()`.
- Bumped localStorage version to `v6` (cleared stale state with the old fields).

Verification (Agent Browser):
- Page loads with HTTP 200, no console errors, no runtime errors.
- Verified Appearance and Backstory panels are GONE: `hasAppearance: false`, `hasBackstory: false`.
- Verified Languages / Equipment / Coins / Alignment / Magic Item Attunement are still present.
- Verified Alignment now sits directly below Languages (snapshot shows `Languages` then `Alignment` textboxes adjacent).
- Verified the bottom-row layout: parent of the 3 sidebar panels has class `grid grid-cols-1 md:grid-cols-3 gap-2`, with `gridTemplateColumns: "413.328px 413.328px 413.344px"` — 3 equal columns at desktop.
- Verified spell descriptions are now FULLY visible in the collapsed preview (e.g. Prestidigitation shows the entire 6-bullet list of magical effects inline; Charm Person shows all 3 paragraphs without expanding).
- Verified spell cards are wider: each card is 612px at desktop (was 419px before — 46% wider).
- Verified responsive grid: at mobile 375px → 1 column (327px cards); at desktop 1280px → 2 columns (612px cards); at 2xl ≥1536px → 3 columns (configurable).
- `bun run lint` passes with 0 errors and 0 warnings.
- Dev server log: HTTP 200 responses only, no runtime errors.

Stage Summary:
- Page 2 reworked: spells now take the full page width below the spell slots, with sidebar items (Languages+Alignment, Equipment+Attunement, Coins) demoted to a compact 3-column bottom row.
- Appearance and Backstory & Personality panels deleted per user request.
- Alignment preserved by moving it into the Languages panel.
- Spell card readability improved: bigger name (16px), bigger description text (12px), bigger collapsed preview (now shows ~5 lines instead of 2), wider cards (612px vs 419px), bigger icons, more padding.
- Mobile: 1-col cards; desktop: 2-col cards; 2xl: 3-col cards.

---
Task ID: 7
Agent: main
Task: Restructure tabs (Page 2 solely spellcasting, replace "All" with "Page 3 · Miscellaneous"); make spell cards compact (description only visible when unfurled).

Work Log:
- Restructured the tabs in `src/app/page.tsx`:
  - Renamed "Page 2 · Spells & Equipment" → "Page 2 · Spellcasting" (now solely for spellcasting content).
  - Removed the "All (single page)" tab; replaced with "Page 3 · Miscellaneous".
  - The new "page3" tab value maps to a new `Page3` component.
- Reworked `Page2` component: removed the `<CharacterSidebar />` from the bottom (which had Languages/Equipment/Coins). Page 2 is now solely: `SpellcastingHeader` + `SpellsTable`.
- Added a new `Page3` component that hosts the `CharacterSidebar` (Languages + Alignment, Equipment + Magic Item Attunement, Coins) with a "MISCELLANEOUS" banner header. The sidebar panels now have a full page of vertical space (instead of being squeezed into a 3-col bottom row on Page 2).
- Made spell cards compact per user request:
  - Removed the always-visible description preview from collapsed cards entirely.
  - Collapsed cards now show only: header (level badge + name + concentration/ritual tags + V/S/M component toggles + collapse/remove buttons), metadata row (Cast Time | Range), quick-notes row (Sparkles + mechanical summary), and the footer (Concentration toggle | Ritual toggle | Level picker).
  - The full description textarea is hidden by default and only appears when the user clicks the chevron to "unfurl" the card. The textarea appears between the quick notes and the footer (with a top border for visual separation).
  - Added a small "READ" hint label (in gold) under the chevron on collapsed cards that have a description, so users know there's a description to expand.
- `bun run lint` passes with 0 errors and 0 warnings. No schema change, no localStorage version bump needed (the `description` field added in the previous step is still there; the cards just hide it by default now).

Verification (Agent Browser):
- Page loads with HTTP 200, no console errors, no runtime errors.
- Verified the three tabs render correctly:
  - "Page 1 · Combat & Abilities"
  - "Page 2 · Spellcasting"
  - "Page 3 · Miscellaneous"
- Verified Page 2 contains ONLY spellcasting content (SPELLCASTING panel + spell slots 3x3 + spell cards). No Languages/Equipment/Coins on Page 2.
- Verified Page 3 contains the MISCELLANEOUS banner + Languages + Alignment + Equipment + Magic Item Attunement + Coins.
- Verified all 8 collapsed spell cards are now 178px tall (was ~280px+ with the description preview). The page is much more compact — 8 cards fit in roughly the same vertical space as 5 did before.
- Verified `has_description_visible: false` for all 8 collapsed cards (descriptions are hidden by default).
- Clicked the expand chevron on Vicious Mockery → card expanded from 178px to 437px, showing the full description textarea with the actual spell text ("You unleash a string of insults laced with subtle enchantments at a creature you can see within range...").
- Verified mobile responsiveness: at 375px viewport, spell cards stack to 1 column (327px wide each).
- Dev server log: HTTP 200 responses only, no runtime errors.

Stage Summary:
- Page 2 is now solely for spellcasting (SpellcastingHeader + SpellsTable).
- Page 3 · Miscellaneous is a new dedicated page for Languages + Alignment, Equipment + Magic Item Attunement, and Coins (with a "MISCELLANEOUS" banner header). Sidebar panels now have a full page of vertical space.
- Spell cards are now compact by default: collapsed cards show only basic info (level, name, components, cast time, range, quick notes, footer toggles) — no description preview. The full description only appears when the user clicks the chevron to unfurl the card.
- "READ" hint label appears on collapsed cards that have a description, signaling that there's content to expand.
- Compact layout: 8 collapsed cards fit in the vertical space that previously held ~5 cards-with-previews.

---
Task ID: 8
Agent: main
Task: Add image-icon upload to spell cards (replacing the C / L1 text badge).

Work Log:
- Added a new `iconDataUrl: string` field to the `SpellRowState` interface in `src/lib/character-defaults.ts`. Stored as a base64 PNG data URL when an image is uploaded, or `''` when no icon is set.
- Added `iconDataUrl: ''` to all 8 example spells in `defaultCharacter()`.
- Updated the store's `addSpell` action in `src/store/character-store.ts` to include `iconDataUrl: ''` for newly-added spells.
- Bumped localStorage version to `v7` so stale v6 state (without the new field) is discarded.
- Reworked the spell card's level badge in `src/components/dnd/spells-table.tsx`:
  - Replaced the old static `<div>` showing "C" / "L1" / etc. with a new `LevelBadge` component.
  - When no icon is set: the badge looks identical to before — bronze background for cantrips, gold for leveled spells, with the level text. A small `ImagePlus` icon is shown below the text at 50% opacity, going to 100% on hover, hinting that the badge is clickable.
  - When the user clicks the badge (and there's no icon yet), a hidden `<input type="file" accept="image/*">` is triggered, opening the OS file picker.
  - The selected file is passed through a `resizeImageToDataUrl(file, 128)` helper that:
    1. Reads the file via `FileReader.readAsDataURL`.
    2. Loads the result into a hidden `Image`.
    3. Resizes it to fit within 128×128 (preserving aspect ratio; no upscale if the image is already smaller).
    4. Draws it onto a `<canvas>` and calls `canvas.toDataURL('image/png')` to get a PNG data URL (PNG preserves transparency).
    5. Returns the data URL, which is stored in `iconDataUrl`.
  - When an icon is set: the badge background switches to `parchment-dark` and the `<img>` is rendered with `object-cover` to fill the 48×N px badge area. A small red × button appears in the top-right corner of the badge (only on hover) — clicking it (with `stopPropagation` so the badge itself doesn't also fire) clears the icon and restores the text badge.
  - The badge is only clickable for upload when no icon is set; once an icon is set, clicking the badge does nothing (you have to clear the icon first via the × button to upload a different one).
- Removed the now-unused `levelAccent` variable from `SpellCard` (it's now computed inside `LevelBadge`).
- Added the necessary lucide-react icon imports: `ImagePlus` and `X`.

Verification (Agent Browser):
- Page loads with HTTP 200, no console errors, no runtime errors.
- Verified all 8 spell cards have a clickable level badge with a hidden file input and the title "Click to upload a custom icon image".
- Verified the badge background is bronze (`rgb(184, 163, 120)` = `--ink-soft`) for cantrips and gold (`rgb(212, 169, 73)` = `--gold`) for leveled spells.
- Created a test 32×32 PNG icon (red square with transparent center).
- Uploaded the test icon to the Vicious Mockery card via the file input:
  - Badge background changed from bronze → `rgb(37, 28, 20)` (parchment-dark) ✓
  - `has_img: true` ✓
  - `img_src_starts_with_data: true` ✓ (it's a base64 PNG data URL)
  - `img_src_length: 326` bytes (resized properly — original was 166 bytes on disk, encoded as base64 with PNG header ~326 chars) ✓
- Clicked the clear (×) button:
  - `has_img: false` ✓ (image gone)
  - Badge text restored to "C" ✓
  - Badge background restored to bronze ✓
- Verified icon persists across page reloads (Zustand persist middleware saves it to localStorage automatically).
- Verified icon survives a Save → Load roundtrip via the API:
  - Clicked "Save" button → POST /api/character 200 (saved to SQLite).
  - GET /api/character/[id] returned the character with `first_spell_has_icon: true`, `first_spell_icon_length: 326` bytes ✓ — the icon's base64 data URL is stored in the SQLite database as part of the spell JSON.
- `bun run lint` passes with 0 errors and 0 warnings.
- Dev server log: HTTP 200 responses only, no runtime errors. POST to `/api/character` and GET from `/api/character/[id]` both succeeded.

Stage Summary:
- Spell card level badges now support optional custom image icons.
- Click the badge → file picker opens → select any image → it's auto-resized to max 128×128, converted to PNG (preserving transparency), and stored as a base64 data URL.
- The image replaces the text badge ("C" / "L1" / etc.) on the card header.
- Hover over the badge to reveal a small red × button in the top-right corner — click it to clear the icon and restore the text badge.
- Icons persist across page reloads (localStorage) AND through Save → Load cycles (SQLite via the API).
- Image size is capped at 128×128 (auto-resized via canvas), keeping each icon's payload small (~300 bytes for a 32×32 icon, ~5–10 KB for a full 128×128 PNG) so multiple icons won't bloat the localStorage or DB.
