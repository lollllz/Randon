import type { BackupPayload } from '../types'
import { parseBackup } from './db'

function downloadBlob(blob: Blob, filename: string) {
  const url = URL.createObjectURL(blob)
  const anchor = document.createElement('a')
  anchor.href = url
  anchor.download = filename
  anchor.rel = 'noopener'
  document.body.append(anchor)
  anchor.click()
  anchor.remove()
  URL.revokeObjectURL(url)
}

export function backupFilename(exportedAt: string) {
  return `randon-backup-${exportedAt.slice(0, 10)}.json`
}

export async function saveBackupJson(payload: BackupPayload): Promise<'saved' | 'aborted'> {
  const filename = backupFilename(payload.exportedAt)
  const text = JSON.stringify(payload, null, 2)
  const blob = new Blob([text], { type: 'application/json' })

  if (typeof window.showSaveFilePicker === 'function') {
    try {
      const handle = await window.showSaveFilePicker({
        suggestedName: filename,
        types: [
          {
            description: 'Randon backup',
            accept: { 'application/json': ['.json'] },
          },
        ],
      })
      const writable = await handle.createWritable()
      await writable.write(blob)
      await writable.close()
      return 'saved'
    } catch (error) {
      if (isAbort(error)) return 'aborted'
    }
  }

  downloadBlob(blob, filename)
  return 'saved'
}

export async function saveBackupToFolder(
  payload: BackupPayload,
): Promise<'saved' | 'aborted' | 'unsupported' | 'denied'> {
  if (typeof window.showDirectoryPicker !== 'function') {
    return 'unsupported'
  }
  try {
    const directory = await window.showDirectoryPicker({ mode: 'readwrite' })
    const handle = await directory.getFileHandle('randon-data.json', {
      create: true,
    })
    const writable = await handle.createWritable()
    await writable.write(JSON.stringify(payload, null, 2))
    await writable.close()
    return 'saved'
  } catch (error) {
    if (isAbort(error)) return 'aborted'
    if (isDenied(error)) return 'denied'
    throw error
  }
}

export async function pickBackupFile(): Promise<BackupPayload> {
  if (typeof window.showOpenFilePicker === 'function') {
    try {
      const [handle] = await window.showOpenFilePicker({
        types: [
          {
            description: 'Randon backup',
            accept: { 'application/json': ['.json'] },
          },
        ],
      })
      const file = await handle.getFile()
      return parseBackup(await file.text())
    } catch (error) {
      if (isAbort(error)) {
        throw new DOMException('The user canceled picking a file.', 'AbortError')
      }
      throw error
    }
  }

  return new Promise((resolve, reject) => {
    const input = document.createElement('input')
    input.type = 'file'
    input.accept = 'application/json,.json'
    input.addEventListener('change', () => {
      const file = input.files?.[0]
      if (!file) {
        reject(new DOMException('No file selected.', 'AbortError'))
        return
      }
      void file
        .text()
        .then((text) => resolve(parseBackup(text)))
        .catch(reject)
    })
    input.click()
  })
}

export function supportsDirectoryPicker() {
  return typeof window.showDirectoryPicker === 'function'
}

export function downloadTextFile(filename: string, contents: string, type = 'text/plain') {
  downloadBlob(new Blob([contents], { type }), filename)
}

export async function saveNamedText(
  filename: string,
  contents: string,
  mime: string,
  accept: Record<string, string[]>,
): Promise<'saved' | 'aborted'> {
  const blob = new Blob([contents], { type: mime })
  if (typeof window.showSaveFilePicker === 'function') {
    try {
      const handle = await window.showSaveFilePicker({
        suggestedName: filename,
        types: [{ description: filename, accept }],
      })
      const writable = await handle.createWritable()
      await writable.write(blob)
      await writable.close()
      return 'saved'
    } catch (error) {
      if (isAbort(error)) return 'aborted'
    }
  }
  downloadBlob(blob, filename)
  return 'saved'
}

function isAbort(error: unknown) {
  return error instanceof DOMException && error.name === 'AbortError'
}

function isDenied(error: unknown) {
  return (
    error instanceof DOMException &&
    (error.name === 'NotAllowedError' || error.name === 'SecurityError')
  )
}
