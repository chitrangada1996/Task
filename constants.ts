
import { Priority, Status } from './types';

export const STATUS_COLUMNS: Record<Status, string> = {
  todo: 'To Do',
  inprogress: 'In Progress',
  blocked: 'Blocked',
  done: 'Done',
};

export const PRIORITIES: Priority[] = ['low', 'medium', 'high', 'critical'];

export const PRIORITY_STYLES: Record<Priority, { iconColor: string; label: string; ring: string }> = {
  low: { iconColor: 'text-green-500', label: 'Low', ring: 'ring-green-500/30' },
  medium: { iconColor: 'text-yellow-500', label: 'Medium', ring: 'ring-yellow-500/30' },
  high: { iconColor: 'text-orange-500', label: 'High', ring: 'ring-orange-500/30' },
  critical: { iconColor: 'text-red-500', label: 'Critical', ring: 'ring-red-500/30' },
};
