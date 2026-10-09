export const ASSIGNEE_COLORS = [
  { background: '#F44336', text: '#FFFFFF' },
  { background: '#2196F3', text: '#FFFFFF' },
  { background: '#4CAF50', text: '#FFFFFF' },
  { background: '#FF9800', text: '#141416' },
  { background: '#9C27B0', text: '#FFFFFF' },
  { background: '#009688', text: '#FFFFFF' },
  { background: '#3F51B5', text: '#FFFFFF' },
  { background: '#E91E63', text: '#FFFFFF' },
] as const;

export function getAssigneeColor(id: string): {
  background: string;
  text: string;
} {
  let hash = 0;

  for (let i = 0; i < id.length; i++) {
    hash = (hash * 31 + id.charCodeAt(i)) | 0;
  }

  return ASSIGNEE_COLORS[Math.abs(hash) % ASSIGNEE_COLORS.length];
}
