import type { BackupPayload } from '../types'
import { TOPIC_BY_ID } from '../data/topics'

export function lessonsMarkdown(payload: BackupPayload) {
  const lines = [
    '# Randon lessons',
    '',
    `Exported ${payload.exportedAt.slice(0, 10)}.`,
    '',
  ]
  if (payload.cachedLessons.length === 0) {
    lines.push('_No cached lessons on this device._')
    return lines.join('\n')
  }
  for (const item of payload.cachedLessons) {
    const topic = TOPIC_BY_ID[item.lesson.topic]?.label ?? item.lesson.topic
    const percent = Math.round((item.finishedAt ? 1 : item.progress) * 100)
    lines.push(`## ${item.lesson.title}`)
    lines.push('')
    lines.push(`${topic} · ${percent}% · ${item.lesson.minutes} min`)
    lines.push('')
    lines.push(item.lesson.dek)
    lines.push('')
    for (const paragraph of item.lesson.body) {
      lines.push(paragraph)
      lines.push('')
    }
    lines.push(`**Takeaway.** ${item.lesson.takeaway}`)
    lines.push('')
  }
  return lines.join('\n')
}

export function historyCsv(payload: BackupPayload) {
  const header = 'date,lessonId,title,topic,wasDaily,progress,finished'
  const rows = payload.history.map((entry) => {
    const cache = payload.cachedLessons.find((item) => item.id === entry.lessonId)
    const title = csvCell(cache?.lesson.title ?? entry.lessonId)
    const topic = cache ? TOPIC_BY_ID[cache.lesson.topic]?.label ?? cache.lesson.topic : ''
    const progress = cache ? (cache.finishedAt ? 1 : cache.progress) : ''
    const finished = cache?.finishedAt ? 'yes' : 'no'
    return [
      entry.dateKey,
      entry.lessonId,
      title,
      topic,
      entry.wasDaily ? 'yes' : 'no',
      progress,
      finished,
    ].join(',')
  })
  return [header, ...rows].join('\n')
}

function csvCell(value: string) {
  if (/[",\n]/.test(value)) return `"${value.replaceAll('"', '""')}"`
  return value
}
