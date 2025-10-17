import { Signal, SignalLow, SignalMedium, X, Calendar as CalendarIcon, Tag, Plus, Command, FileText as FileTextIcon, CheckSquare, Sun, Moon, User, MessageSquare } from 'lucide-react';
import React from 'react';
import { Priority } from '../types';

export const PriorityIcon: React.FC<{ priority: Priority; className?: string }> = ({ priority, className }) => {
  const iconProps = { className: `w-4 h-4 ${className}` };
  switch (priority) {
    case 'low':
      return <SignalLow {...iconProps} />;
    case 'medium':
      return <SignalMedium {...iconProps} />;
    case 'high':
      return <Signal {...iconProps} />;
    case 'critical':
      return <Signal {...iconProps} className={`${className} text-red-500`} />;
    default:
      return null;
  }
};

export const CloseIcon = X;
export const Calendar = CalendarIcon;
export const TagIcon = Tag;
export const PlusIcon = Plus;
export const CommandIcon = Command;
export const FileText = FileTextIcon;
export const TaskIcon = CheckSquare;
export const SunIcon = Sun;
export const MoonIcon = Moon;
export const UserIcon = User;
export const CommentIcon = MessageSquare;