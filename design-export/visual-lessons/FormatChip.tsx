export function FormatChip({
  children,
  quiet = false,
}: {
  children: string
  quiet?: boolean
}) {
  return <span className={quiet ? 'vl-chip vl-chip-quiet' : 'vl-chip'}>{children}</span>
}
