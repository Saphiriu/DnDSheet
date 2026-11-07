'use client'

import { useState, useRef } from 'react'
import { Plus, Trash2, ChevronDown, ChevronUp, Sparkles, Flame, Clock, Target, ImagePlus, X, BookOpen, Check } from 'lucide-react'
import { useCharacter } from '@/store/character-store'

const LEVELS = ['C', '1', '2', '3', '4', '5', '6', '7', '8', '9'] as const

type SpellFilter = 'all' | 'prepared' | 'spellbook'

/**
 * Page 2 center column: Cantrips & Prepared Spells.
 *
 * Spells are displayed as cards (not table rows) grouped by level. Each card
 * shows the spell name, level badge, components (V/S/M), concentration / ritual
 * tags, cast time + range, a short mechanical note, and a fully-editable
 * description (the full spell text). Cards can collapse to save space.
 *
 * A filter bar at the top lets you toggle between:
 *   - All spells (the full spellbook + prepared)
 *   - Prepared (spells memorized and castable today)
 *   - Spellbook (spells known but not currently prepared)
 * Cantrips are always considered "prepared" (they don't use spell slots).
 */
export function SpellsTable() {
  const sheet = useCharacter((s) => s.sheet)
  const addSpell = useCharacter((s) => s.addSpell)
  const updateSpell = useCharacter((s) => s.updateSpell)
  const removeSpell = useCharacter((s) => s.removeSpell)
  const toggleSpellPrepared = useCharacter((s) => s.toggleSpellPrepared)

  const [filter, setFilter] = useState<SpellFilter>('all')

  // Apply the active filter to the spell list.
  // Cantrips (level 'C') always count as "prepared" — they don't need preparation.
  const filteredSpells = sheet.spells.filter((s) => {
    if (filter === 'all') return true
    const effectivelyPrepared = s.prepared || s.level === 'C'
    if (filter === 'prepared') return effectivelyPrepared
    if (filter === 'spellbook') return !effectivelyPrepared
    return true
  })

  // Group the filtered spells by level
  const byLevel = LEVELS.map((lvl) => ({
    level: lvl,
    spells: filteredSpells.filter((s) => s.level === lvl),
  }))

  const preparedCount = sheet.spells.filter((s) => s.prepared || s.level === 'C').length
  const spellbookOnlyCount = sheet.spells.length - preparedCount

  return (
    <div className="sheet-panel p-2 flex flex-col">
      <div className="flex items-center justify-between mb-2 flex-wrap gap-2">
        <div className="sheet-label-lg">CANTRIPS &amp; PREPARED SPELLS</div>
        <button
          type="button"
          onClick={addSpell}
          className="text-[11px] flex items-center gap-1 px-2 py-1 border hover:bg-rule/10 transition-colors"
          style={{ color: 'var(--ink-soft)', borderColor: 'var(--rule)' }}
        >
          <Plus className="w-3 h-3" /> Add spell
        </button>
      </div>

      {/* Filter bar: All / Prepared / Spellbook */}
      <div className="flex items-center gap-1 mb-3 text-[10px] font-bold uppercase tracking-wider">
        <FilterPill
          active={filter === 'all'}
          onClick={() => setFilter('all')}
          label="All"
          count={sheet.spells.length}
        />
        <FilterPill
          active={filter === 'prepared'}
          onClick={() => setFilter('prepared')}
          label="Prepared"
          count={preparedCount}
          icon={<Check className="w-3 h-3" />}
          color="var(--gold)"
        />
        <FilterPill
          active={filter === 'spellbook'}
          onClick={() => setFilter('spellbook')}
          label="Spellbook"
          count={spellbookOnlyCount}
          icon={<BookOpen className="w-3 h-3" />}
          color="var(--ink-soft)"
        />
      </div>

      {filteredSpells.length === 0 ? (
        <div
          className="text-xs italic py-8 text-center"
          style={{ color: 'var(--ink-faint)' }}
        >
          {sheet.spells.length === 0
            ? 'No spells yet — click "Add spell" to start your grimoire.'
            : `No ${filter === 'prepared' ? 'prepared' : 'spellbook-only'} spells. Switch filter or add a spell.`}
        </div>
      ) : (
        <div className="flex flex-col gap-3 pr-1">
          {byLevel.map(({ level, spells }) =>
            spells.length === 0 ? null : (
              <div key={level} className="flex flex-col gap-2">
                <div
                  className="text-[11px] font-bold uppercase tracking-widest py-1 px-2 border-l-2"
                  style={{
                    color: 'var(--gold)',
                    borderColor: 'var(--gold)',
                  }}
                >
                  {level === 'C' ? 'Cantrips' : `Level ${level} Spells`}
                  <span
                    className="ml-2 opacity-60"
                    style={{ color: 'var(--ink-faint)' }}
                  >
                    ({spells.length})
                  </span>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 2xl:grid-cols-3 gap-2">
                  {spells.map((s) => (
                    <SpellCard
                      key={s.id}
                      spell={s}
                      onChange={(patch) => updateSpell(s.id, patch)}
                      onRemove={() => removeSpell(s.id)}
                      onTogglePrepared={() => toggleSpellPrepared(s.id)}
                    />
                  ))}
                </div>
              </div>
            )
          )}
        </div>
      )}
    </div>
  )
}

function FilterPill({
  active,
  onClick,
  label,
  count,
  icon,
  color,
}: {
  active: boolean
  onClick: () => void
  label: string
  count: number
  icon?: React.ReactNode
  color?: string
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="flex items-center gap-1 px-2 py-1 border transition-colors"
      style={{
        borderColor: active ? (color || 'var(--rule)') : 'var(--rule-light)',
        color: active ? (color || 'var(--ink)') : 'var(--ink-faint)',
        backgroundColor: active
          ? (color === 'var(--gold)' ? 'rgba(212, 169, 73, 0.15)' : 'rgba(184, 163, 120, 0.12)')
          : 'transparent',
      }}
      aria-pressed={active}
    >
      {icon}
      <span>{label}</span>
      <span className="opacity-60">({count})</span>
    </button>
  )
}

interface SpellCardProps {
  spell: import('@/lib/character-defaults').SpellRowState
  onChange: (patch: Partial<import('@/lib/character-defaults').SpellRowState>) => void
  onRemove: () => void
  onTogglePrepared: () => void
}

function SpellCard({ spell, onChange, onRemove, onTogglePrepared }: SpellCardProps) {
  const [expanded, setExpanded] = useState(false)
  const s = spell

  // Cantrips are always considered prepared (they don't use spell slots).
  const effectivelyPrepared = s.prepared || s.level === 'C'
  // Dim the card slightly when not prepared, to make prepared spells stand out.
  const cardOpacity = effectivelyPrepared ? 1 : 0.65

  return (
    <div
      className="relative border flex flex-col overflow-hidden transition-opacity"
      style={{
        borderColor: effectivelyPrepared ? 'var(--rule)' : 'var(--rule-light)',
        backgroundColor: 'var(--parchment)',
        opacity: cardOpacity,
      }}
    >
      {/* Card header — level badge (or uploaded icon) + name + tags + remove */}
      <div
        className="flex items-stretch border-b"
        style={{ borderColor: 'var(--rule)' }}
      >
        {/* Level badge — clickable to upload an icon image to replace it */}
        <LevelBadge
          level={s.level}
          iconDataUrl={s.iconDataUrl}
          onUploadIcon={(dataUrl) => onChange({ iconDataUrl: dataUrl })}
          onClearIcon={() => onChange({ iconDataUrl: '' })}
        />

        {/* Name + Concentration/Ritual tags */}
        <div className="flex-1 flex flex-col px-2.5 py-2 min-w-0">
          <input
            type="text"
            value={s.name}
            onChange={(e) => onChange({ name: e.target.value })}
            className="bg-transparent border-0 outline-none text-base font-bold"
            style={{ color: 'var(--ink)' }}
            placeholder="Spell name"
            aria-label="Spell name"
          />
          <div className="flex items-center gap-1.5 mt-0.5 flex-wrap">
            {s.concentration && (
              <Tag
                label="Concentration"
                color="var(--blood)"
                title="Concentration spell"
              />
            )}
            {s.ritual && (
              <Tag
                label="Ritual"
                color="var(--gold)"
                title="Can be cast as a ritual"
              />
            )}
            {/* Component tags */}
            <div className="flex items-center gap-1 ml-auto">
              <ComponentToggle
                letter="V"
                full="Verbal"
                active={s.components.c}
                onToggle={() =>
                  onChange({ components: { ...s.components, c: !s.components.c } })
                }
              />
              <ComponentToggle
                letter="S"
                full="Somatic"
                active={s.components.r}
                onToggle={() =>
                  onChange({ components: { ...s.components, r: !s.components.r } })
                }
              />
              <ComponentToggle
                letter="M"
                full="Material"
                active={s.components.m}
                onToggle={() =>
                  onChange({ components: { ...s.components, m: !s.components.m } })
                }
              />
            </div>
          </div>
        </div>

        {/* Collapse / Remove */}
        <div
          className="flex flex-col border-l"
          style={{ borderColor: 'var(--rule)' }}
        >
          <button
            type="button"
            onClick={() => setExpanded(!expanded)}
            className="flex-1 px-2.5 flex flex-col items-center justify-center gap-0.5 hover:bg-rule/10 transition-colors"
            style={{ color: 'var(--ink-soft)' }}
            aria-label={expanded ? 'Collapse description' : 'Expand description'}
            title={expanded ? 'Hide description' : 'Show full description'}
          >
            {expanded
              ? <ChevronUp className="w-4 h-4" />
              : <ChevronDown className="w-4 h-4" />}
            {!expanded && s.description && (
              <span
                className="text-[7px] font-bold uppercase tracking-wider leading-none"
                style={{ color: 'var(--gold)' }}
              >
                Read
              </span>
            )}
          </button>
          <button
            type="button"
            onClick={onRemove}
            className="flex-1 px-2.5 flex items-center justify-center hover:bg-rule/10 transition-colors border-t"
            style={{ color: 'var(--blood)', borderColor: 'var(--rule)' }}
            aria-label="Remove spell"
            title="Remove spell"
          >
            <Trash2 className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Metadata row: cast time | range */}
      <div
        className="grid grid-cols-2 border-b"
        style={{ borderColor: 'var(--rule)' }}
      >
        <MetaField
          icon={<Clock className="w-3.5 h-3.5" />}
          label="Cast Time"
          value={s.castingTime}
          onChange={(v) => onChange({ castingTime: v })}
          placeholder="1A"
        />
        <MetaField
          icon={<Target className="w-3.5 h-3.5" />}
          label="Range"
          value={s.range}
          onChange={(v) => onChange({ range: v })}
          placeholder="60 ft"
          borderLeft
        />
      </div>

      {/* Quick notes — short mechanical summary */}
      <div className="px-2.5 py-2 flex items-center gap-1.5 border-b"
           style={{ borderColor: 'var(--rule-light)' }}>
        <Sparkles className="w-3 h-3 flex-shrink-0" style={{ color: 'var(--gold)' }} />
        <input
          type="text"
          value={s.notes}
          onChange={(e) => onChange({ notes: e.target.value })}
          className="flex-1 bg-transparent border-0 outline-none text-xs italic"
          style={{ color: 'var(--ink-soft)' }}
          placeholder="Quick mechanical summary (e.g. 1d6 Psychic · Wis save)"
          aria-label="Quick mechanical summary"
        />
      </div>

      {/* Description — hidden when collapsed for a compact card layout.
          Only shows when the user unfurls the card via the chevron.
          Collapsed cards display just the basic info: name, level, components,
          cast time, range, and the quick mechanical notes. */}
      {expanded && (
        <textarea
          value={s.description}
          onChange={(e) => onChange({ description: e.target.value })}
          rows={12}
          placeholder="Full spell description (mechanics, scaling, flavor…)"
          className="w-full bg-transparent border-0 outline-none text-xs leading-relaxed p-3 resize-y sheet-grid min-h-[220px] border-t"
          style={{ color: 'var(--ink)', borderColor: 'var(--rule)' }}
          aria-label="Full spell description"
          autoFocus
        />
      )}

      {/* Footer — toggleable flags row.
          4 columns: Prepared (new) | Concentration | Ritual | Level.
          Cantrips always show Prepared as locked-on (they don't use slots). */}
      <div
        className="grid grid-cols-4 border-t"
        style={{ borderColor: 'var(--rule)' }}
      >
        <FooterToggle
          label="Prepared"
          active={effectivelyPrepared}
          onToggle={onTogglePrepared}
          color="var(--gold)"
          icon={<Check className="w-3 h-3" />}
          disabled={s.level === 'C'}
          title={
            s.level === 'C'
              ? 'Cantrips are always prepared (they do not use spell slots)'
              : effectivelyPrepared
                ? 'Prepared — can cast today using a spell slot'
                : 'In spellbook — known but not prepared today. Click to prepare.'
          }
        />
        <FooterToggle
          label="Concent."
          active={s.concentration}
          onToggle={() => onChange({ concentration: !s.concentration })}
          color="var(--blood)"
          icon={<Flame className="w-3 h-3" />}
          borderLeft
        />
        <FooterToggle
          label="Ritual"
          active={s.ritual}
          onToggle={() => onChange({ ritual: !s.ritual })}
          color="var(--gold)"
          icon={<Sparkles className="w-3 h-3" />}
          borderLeft
        />
        <LevelPicker
          value={s.level}
          onChange={(v) => onChange({ level: v })}
          borderLeft
        />
      </div>
    </div>
  )
}

function Tag({
  label,
  color,
  title,
}: {
  label: string
  color: string
  title?: string
}) {
  return (
    <span
      className="text-[8px] font-bold uppercase tracking-wider px-1.5 py-0.5 rounded-sm"
      style={{
        backgroundColor: color,
        color: 'var(--parchment)',
      }}
      title={title}
    >
      {label}
    </span>
  )
}

/**
 * The square badge on the left side of each spell card header. By default
 * shows the spell level ("C" for cantrip or "L1".."L9"). When the user
 * clicks it, a file picker opens; if they select an image, it gets resized
 * to max 128×128 (preserving aspect ratio), converted to PNG, and stored
 * as a base64 data URL in the spell's `iconDataUrl` field. The image then
 * replaces the text badge. A small × button appears on hover to clear
 * the icon and restore the text badge.
 */
function LevelBadge({
  level,
  iconDataUrl,
  onUploadIcon,
  onClearIcon,
}: {
  level: string
  iconDataUrl: string
  onUploadIcon: (dataUrl: string) => void
  onClearIcon: () => void
}) {
  const fileInputRef = useRef<HTMLInputElement>(null)

  // Cantrip accent = bronze-ish, leveled spells = gold
  const levelAccent = level === 'C' ? 'var(--ink-soft)' : 'var(--gold)'

  async function handleFileSelected(file: File) {
    try {
      const dataUrl = await resizeImageToDataUrl(file, 128)
      onUploadIcon(dataUrl)
    } catch (err) {
      console.error('Failed to load image:', err)
    }
  }

  return (
    <div
      className="relative flex items-center justify-center w-12 flex-shrink-0 cursor-pointer group"
      style={{ backgroundColor: iconDataUrl ? 'var(--parchment-dark)' : levelAccent }}
      onClick={() => {
        if (!iconDataUrl) fileInputRef.current?.click()
      }}
      title={
        iconDataUrl
          ? 'Custom icon · hover and click × to clear'
          : 'Click to upload a custom icon image'
      }
    >
      {iconDataUrl ? (
        <>
          <img
            src={iconDataUrl}
            alt=""
            className="w-full h-full object-cover"
            style={{ display: 'block' }}
            draggable={false}
          />
          {/* Clear button — only visible on hover */}
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation()
              onClearIcon()
            }}
            className="absolute top-0.5 right-0.5 w-4 h-4 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
            style={{
              backgroundColor: 'var(--blood)',
              color: 'var(--parchment)',
              borderRadius: '50%',
            }}
            aria-label="Clear custom icon"
            title="Clear custom icon"
          >
            <X className="w-2.5 h-2.5" strokeWidth={3} />
          </button>
        </>
      ) : (
        <div className="flex flex-col items-center gap-0.5">
          <span
            className="text-[10px] font-extrabold uppercase"
            style={{
              color: 'var(--parchment)',
              letterSpacing: '0.05em',
            }}
          >
            {level === 'C' ? 'C' : `L${level}`}
          </span>
          <ImagePlus
            className="w-3 h-3 opacity-50 group-hover:opacity-100 transition-opacity"
            style={{ color: 'var(--parchment)' }}
          />
        </div>
      )}
      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        className="hidden"
        onChange={(e) => {
          const file = e.target.files?.[0]
          if (file) void handleFileSelected(file)
          // Reset the input so the same file can be re-selected later
          e.target.value = ''
        }}
      />
    </div>
  )
}

/**
 * Read an image File, resize it to fit within `maxDim × maxDim` (preserving
 * aspect ratio), and return a PNG data URL. PNG preserves transparency for
 * icons that have transparent backgrounds. Throws if the file can't be loaded
 * as an image.
 */
function resizeImageToDataUrl(file: File, maxDim: number): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader()
    reader.onload = () => {
      const img = new Image()
      img.onload = () => {
        let { width, height } = img
        if (width > height) {
          if (width > maxDim) {
            height = Math.max(1, Math.round(height * (maxDim / width)))
            width = maxDim
          }
        } else {
          if (height > maxDim) {
            width = Math.max(1, Math.round(width * (maxDim / height)))
            height = maxDim
          }
        }
        const canvas = document.createElement('canvas')
        canvas.width = width
        canvas.height = height
        const ctx = canvas.getContext('2d')
        if (!ctx) {
          reject(new Error('Canvas 2d context unavailable'))
          return
        }
        // Fill with white so transparent images don't get black backgrounds
        // when later rendered on dark backgrounds via <img>. (PNG transparency
        // is still preserved if the source image had it.)
        ctx.drawImage(img, 0, 0, width, height)
        try {
          resolve(canvas.toDataURL('image/png'))
        } catch (err) {
          reject(err)
        }
      }
      img.onerror = () => reject(new Error('Failed to load image'))
      img.src = reader.result as string
    }
    reader.onerror = () => reject(new Error('Failed to read file'))
    reader.readAsDataURL(file)
  })
}

function ComponentToggle({
  letter,
  full,
  active,
  onToggle,
}: {
  letter: string
  full: string
  active: boolean
  onToggle: () => void
}) {
  return (
    <button
      type="button"
      onClick={onToggle}
      className="flex items-center gap-0.5 px-1 py-0.5"
      title={`${full} component`}
      aria-label={`Toggle ${full} component`}
      aria-pressed={active}
    >
      <span
        className="font-bold text-[9px]"
        style={{
          color: active ? 'var(--ink)' : 'var(--ink-faint)',
          textDecoration: active ? 'none' : 'line-through',
          opacity: active ? 1 : 0.5,
        }}
      >
        {letter}
      </span>
    </button>
  )
}

function MetaField({
  icon,
  label,
  value,
  onChange,
  placeholder,
  borderLeft = false,
}: {
  icon: React.ReactNode
  label: string
  value: string
  onChange: (v: string) => void
  placeholder?: string
  borderLeft?: boolean
}) {
  return (
    <div
      className={`flex items-center gap-2 px-2.5 py-2 ${borderLeft ? 'border-l' : ''}`}
      style={{ borderColor: 'var(--rule)' }}
    >
      <span style={{ color: 'var(--ink-faint)' }}>{icon}</span>
      <div className="flex-1 min-w-0">
        <div
          className="text-[9px] font-bold uppercase tracking-wider"
          style={{ color: 'var(--ink-faint)' }}
        >
          {label}
        </div>
        <input
          type="text"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          className="w-full bg-transparent border-0 outline-none text-xs font-bold"
          style={{ color: 'var(--ink)' }}
          placeholder={placeholder}
          aria-label={label}
        />
      </div>
    </div>
  )
}

function FooterToggle({
  label,
  active,
  onToggle,
  color,
  icon,
  borderLeft = false,
  disabled = false,
  title,
}: {
  label: string
  active: boolean
  onToggle: () => void
  color: string
  icon: React.ReactNode
  borderLeft?: boolean
  disabled?: boolean
  title?: string
}) {
  return (
    <button
      type="button"
      onClick={disabled ? undefined : onToggle}
      disabled={disabled}
      className={`flex items-center justify-center gap-1 py-1.5 text-[9px] font-bold uppercase tracking-wider transition-colors ${disabled ? 'cursor-not-allowed' : 'hover:bg-rule/10'} ${borderLeft ? 'border-l' : ''}`}
      style={{
        borderColor: 'var(--rule)',
        color: active ? color : 'var(--ink-faint)',
        opacity: disabled ? 0.7 : 1,
      }}
      aria-pressed={active}
      aria-label={`Toggle ${label}`}
      title={title}
    >
      {icon}
      <span>{label}</span>
    </button>
  )
}

function LevelPicker({
  value,
  onChange,
  borderLeft = false,
}: {
  value: string
  onChange: (v: string) => void
  borderLeft?: boolean
}) {
  return (
    <div
      className={`flex items-center justify-center gap-1 py-1.5 ${borderLeft ? 'border-l' : ''}`}
      style={{ borderColor: 'var(--rule)' }}
    >
      <span
        className="text-[8px] font-bold uppercase tracking-wider"
        style={{ color: 'var(--ink-faint)' }}
      >
        Lvl
      </span>
      <select
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="bg-transparent border-0 outline-none text-[11px] font-bold cursor-pointer"
        style={{ color: 'var(--ink)' }}
        aria-label="Spell level"
      >
        {LEVELS.map((l) => (
          <option key={l} value={l} style={{ color: '#000' }}>
            {l === 'C' ? 'Cantrip' : `L${l}`}
          </option>
        ))}
      </select>
    </div>
  )
}
