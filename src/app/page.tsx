'use client'

import { useState, useEffect } from 'react'
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs'
import { SheetToolbar } from '@/components/dnd/sheet-toolbar'
import { CombatHeader } from '@/components/dnd/combat-header'
import { StatsBar } from '@/components/dnd/stats-bar'
import { AbilityGrid } from '@/components/dnd/ability-card'
import { FeaturesColumn } from '@/components/dnd/features-column'
import { ProficienciesRow } from '@/components/dnd/proficiencies-row'
import { SpellcastingHeader } from '@/components/dnd/spellcasting-header'
import { SpellsTable } from '@/components/dnd/spells-table'
import { CharacterSidebar } from '@/components/dnd/character-sidebar'
import { useCharacter } from '@/store/character-store'

export default function Home() {
  // hydration guard so SSR/CSR match
  const [hydrated, setHydrated] = useState(false)
  // eslint-disable-next-line react-hooks/set-state-in-effect
  useEffect(() => setHydrated(true), [])

  const level = useCharacter((s) => s.sheet.level)

  return (
    <main
      className="min-h-screen flex flex-col parchment-bg"
      style={{ backgroundColor: 'var(--parchment)' }}
    >
      <SheetToolbar />

      <div className="flex-1 relative z-10 px-3 py-3">
        <div className="max-w-7xl mx-auto">
          {/* D&D logo banner */}
          <div className="sheet-banner text-2xl md:text-4xl py-2 mb-2">
            DUNGEONS
            <span className="ampersand">&amp;</span>
            DRAGONS
            <span className="block text-xs md:text-sm font-normal tracking-normal mt-0.5"
                  style={{ color: 'var(--ink-soft)' }}>
              5.5e (2024) Interactive Character Sheet
            </span>
          </div>

          <Tabs defaultValue="page1" className="w-full">
            <TabsList className="bg-transparent border-b w-full justify-start h-auto p-0"
                      style={{ borderColor: 'var(--rule)' }}>
              <TabsTrigger
                value="page1"
                className="data-[state=active]:bg-transparent data-[state=active]:border-b-2 data-[state=active]:border-[var(--blood)] rounded-none"
                style={{ color: 'var(--ink)' }}
              >
                Page 1 · Combat &amp; Abilities
              </TabsTrigger>
              <TabsTrigger
                value="page2"
                className="data-[state=active]:bg-transparent data-[state=active]:border-b-2 data-[state=active]:border-[var(--blood)] rounded-none"
                style={{ color: 'var(--ink)' }}
              >
                Page 2 · Spellcasting
              </TabsTrigger>
              <TabsTrigger
                value="page3"
                className="data-[state=active]:bg-transparent data-[state=active]:border-b-2 data-[state=active]:border-[var(--blood)] rounded-none"
                style={{ color: 'var(--ink)' }}
              >
                Page 3 · Miscellaneous
              </TabsTrigger>
            </TabsList>

            <TabsContent value="page1" className="mt-2 focus-visible:outline-none">
              <Page1 />
            </TabsContent>
            <TabsContent value="page2" className="mt-2 focus-visible:outline-none">
              <Page2 />
            </TabsContent>
            <TabsContent value="page3" className="mt-2 focus-visible:outline-none">
              <Page3 />
            </TabsContent>
          </Tabs>

          <p className="sheet-copyright mt-4 mb-2">
            TM &amp; © 2024 Wizards of the Coast LLC. Interactive character
            sheet rendered from the official 5.5e PDF. For personal use.
          </p>
        </div>
      </div>

      <footer
        className="parchment-bg border-t py-2 px-3 mt-auto relative z-10"
        style={{
          backgroundColor: 'var(--parchment-dark)',
          borderColor: 'var(--rule)',
        }}
      >
        <div className="max-w-7xl mx-auto flex items-center justify-between text-[11px]">
          <span style={{ color: 'var(--ink-soft)' }}>
            Interactive DnD 5.5e Character Sheet · Level {level || 1} ·
            Edits auto-save locally · use the toolbar to save to the cloud.
          </span>
          <span style={{ color: 'var(--ink-faint)' }}>
            Derived stats (PB, Initiative, Passive Perception, spell DC) auto-update from ability scores.
          </span>
        </div>
      </footer>
    </main>
  )
}

function Page1() {
  return (
    <div className="flex flex-col gap-2">
      <CombatHeader />
      <StatsBar />
      <div className="grid grid-cols-1 md:grid-cols-[minmax(420px,40%)_1fr] gap-2">
        <AbilityGrid />
        <FeaturesColumn />
      </div>
      <ProficienciesRow />
    </div>
  )
}

function Page2() {
  // Page 2 is now solely for spellcasting — spell stats + spell slots + spell cards.
  // (Languages / Equipment / Coins moved to Page 3 · Miscellaneous.)
  return (
    <div className="flex flex-col gap-2">
      <SpellcastingHeader />
      <SpellsTable />
    </div>
  )
}

function Page3() {
  // Page 3 · Miscellaneous — Languages + Alignment, Equipment + Magic Item
  // Attunement, Coins. Given a full page now (instead of being a compact
  // bottom row) so the panels have more breathing room.
  return (
    <div className="flex flex-col gap-3">
      <div
        className="sheet-banner text-xl md:text-2xl py-2 mb-1"
      >
        MISCELLANEOUS
        <span className="block text-xs font-normal tracking-normal mt-0.5"
              style={{ color: 'var(--ink-soft)' }}>
          Languages, equipment, attunement &amp; coins
        </span>
      </div>
      <CharacterSidebar />
    </div>
  )
}
