'use client'

import { useState, useEffect } from 'react'
import {
  Save,
  FolderOpen,
  RotateCcw,
  FilePlus,
  Trash2,
  Download,
  Upload,
} from 'lucide-react'
import { useCharacter } from '@/store/character-store'
import { toast } from 'sonner'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import type { CharacterSheet } from '@/lib/character-defaults'

interface SavedCharacterMeta {
  id: string
  name: string
  updatedAt: string
  createdAt: string
}

/**
 * Top action toolbar: New / Save / Load / Export / Import / Reset.
 * Derived stats auto-update at render time, so no Recalc button needed.
 */
export function SheetToolbar() {
  const sheet = useCharacter((s) => s.sheet)
  const savedCharId = useCharacter((s) => s.savedCharId)
  const setSheet = useCharacter((s) => s.setSheet)
  const setSavedId = useCharacter((s) => s.setSavedId)
  const resetDefault = useCharacter((s) => s.resetDefault)
  const newBlank = useCharacter((s) => s.newBlank)

  const [loadOpen, setLoadOpen] = useState(false)
  const [savedList, setSavedList] = useState<SavedCharacterMeta[]>([])
  const [loadingList, setLoadingList] = useState(false)

  // Track whether hydration from localStorage has happened to avoid
  // SSR/hydration mismatches.
  const [hydrated, setHydrated] = useState(false)
  useEffect(() => {
    setHydrated(true)
  }, [])

  async function handleSave() {
    try {
      const payload = {
        id: savedCharId ?? undefined,
        name: sheet.characterName || 'Unnamed Character',
        data: sheet,
      }
      const res = await fetch('/api/character', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      })
      const json = await res.json()
      if (json.ok) {
        setSavedId(json.character.id)
        toast.success(`Saved "${json.character.name}"`)
      } else {
        toast.error(json.error || 'Save failed')
      }
    } catch (err) {
      console.error(err)
      toast.error('Network error during save')
    }
  }

  async function fetchList() {
    setLoadingList(true)
    try {
      const res = await fetch('/api/character')
      const json = await res.json()
      if (json.ok) {
        setSavedList(json.characters)
        setLoadOpen(true)
      } else {
        toast.error(json.error || 'Failed to load list')
      }
    } catch (err) {
      console.error(err)
      toast.error('Network error')
    } finally {
      setLoadingList(false)
    }
  }

  async function loadCharacter(id: string, name: string) {
    try {
      const res = await fetch(`/api/character/${id}`)
      const json = await res.json()
      if (json.ok && json.character?.data) {
        setSheet(json.character.data as CharacterSheet)
        setSavedId(json.character.id)
        setLoadOpen(false)
        toast.success(`Loaded "${name}"`)
      } else {
        toast.error(json.error || 'Load failed')
      }
    } catch (err) {
      console.error(err)
      toast.error('Network error during load')
    }
  }

  async function deleteCharacter(id: string, name: string) {
    if (!confirm(`Delete "${name}"? This cannot be undone.`)) return
    try {
      const res = await fetch(`/api/character/${id}`, { method: 'DELETE' })
      const json = await res.json()
      if (json.ok) {
        setSavedList((prev) => prev.filter((c) => c.id !== id))
        if (savedCharId === id) setSavedId(null)
        toast.success(`Deleted "${name}"`)
      } else {
        toast.error(json.error || 'Delete failed')
      }
    } catch (err) {
      console.error(err)
      toast.error('Network error during delete')
    }
  }

  function exportJson() {
    const blob = new Blob([JSON.stringify(sheet, null, 2)], {
      type: 'application/json',
    })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `${sheet.characterName || 'character'}.json`
    a.click()
    URL.revokeObjectURL(url)
    toast.success('Character exported as JSON')
  }

  function importJson() {
    const input = document.createElement('input')
    input.type = 'file'
    input.accept = 'application/json'
    input.onchange = () => {
      const file = input.files?.[0]
      if (!file) return
      const reader = new FileReader()
      reader.onload = () => {
        try {
          const data = JSON.parse(reader.result as string) as CharacterSheet
          setSheet(data)
          setSavedId(null)
          toast.success(`Imported "${data.characterName || 'character'}"`)
        } catch {
          toast.error('Invalid JSON file')
        }
      }
      reader.readAsText(file)
    }
    input.click()
  }

  return (
    <div
      className="w-full px-3 py-2 flex flex-wrap items-center gap-2 border-b sheet-ink print:hidden"
      style={{
        backgroundColor: 'var(--parchment-dark)',
        borderColor: 'var(--rule)',
      }}
    >
      <span
        className="text-xs font-bold uppercase tracking-wider mr-2"
        style={{ color: 'var(--ink)' }}
      >
        DnD 5.5e Sheet
      </span>

      <Button
        size="sm"
        variant="outline"
        onClick={newBlank}
        className="h-8 text-xs"
      >
        <FilePlus className="w-3.5 h-3.5 mr-1" />
        New
      </Button>
      <Button
        size="sm"
        variant="outline"
        onClick={handleSave}
        className="h-8 text-xs"
        disabled={!hydrated}
      >
        <Save className="w-3.5 h-3.5 mr-1" />
        Save
      </Button>
      <Button
        size="sm"
        variant="outline"
        onClick={fetchList}
        className="h-8 text-xs"
        disabled={!hydrated || loadingList}
      >
        <FolderOpen className="w-3.5 h-3.5 mr-1" />
        Load
      </Button>
      <Button
        size="sm"
        variant="outline"
        onClick={exportJson}
        className="h-8 text-xs"
      >
        <Download className="w-3.5 h-3.5 mr-1" />
        Export
      </Button>
      <Button
        size="sm"
        variant="outline"
        onClick={importJson}
        className="h-8 text-xs"
      >
        <Upload className="w-3.5 h-3.5 mr-1" />
        Import
      </Button>
      <Button
        size="sm"
        variant="outline"
        onClick={() => {
          if (confirm('Reset to the example "Jichael Mackson" character? Current edits will be lost.')) {
            resetDefault()
            toast.success('Reset to example character')
          }
        }}
        className="h-8 text-xs"
      >
        <RotateCcw className="w-3.5 h-3.5 mr-1" />
        Example
      </Button>

      <div className="ml-auto text-xs" style={{ color: 'var(--ink-soft)' }}>
        {savedCharId ? (
          <span>
            Saved as <span className="font-bold" style={{ color: 'var(--ink)' }}>{sheet.characterName || 'Unnamed'}</span>
            {' '}· autosaved locally
          </span>
        ) : (
          <span>unsaved · autosaved locally</span>
        )}
      </div>

      {/* Load dialog */}
      <Dialog open={loadOpen} onOpenChange={setLoadOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Saved Characters</DialogTitle>
          </DialogHeader>
          <div className="max-h-[60vh] overflow-y-auto sheet-scroll">
            {savedList.length === 0 ? (
              <p className="text-sm text-muted-foreground p-4 text-center">
                No saved characters yet. Click &ldquo;Save&rdquo; to create one.
              </p>
            ) : (
              <ul className="space-y-1">
                {savedList.map((c) => (
                  <li
                    key={c.id}
                    className="flex items-center justify-between p-2 rounded border"
                  >
                    <div>
                      <div className="font-bold text-sm">{c.name}</div>
                      <div className="text-xs text-muted-foreground">
                        updated {new Date(c.updatedAt).toLocaleString()}
                      </div>
                    </div>
                    <div className="flex gap-2">
                      <Button
                        size="sm"
                        onClick={() => loadCharacter(c.id, c.name)}
                      >
                        Load
                      </Button>
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => deleteCharacter(c.id, c.name)}
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </Button>
                    </div>
                  </li>
                ))}
              </ul>
            )}
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setLoadOpen(false)}>
              Close
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
