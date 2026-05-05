const INITIAL_COLORS = [
  '#3B82F6', '#8B5CF6', '#10B981', '#F59E0B',
  '#EF4444', '#EC4899', '#06B6D4', '#84CC16',
  '#F97316', '#6366F1',
]

export function getInitialColor(char: string): string {
  const idx = (char?.toUpperCase().charCodeAt(0) ?? 65) - 65
  return INITIAL_COLORS[Math.abs(idx) % INITIAL_COLORS.length]
}

export function cn(...classes: (string | undefined | boolean | null)[]) {
  return classes.filter(Boolean).join(' ');
}
