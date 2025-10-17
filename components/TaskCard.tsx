
import React from 'react';
import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { Task, User } from '../types';
import { Calendar, PriorityIcon, TagIcon } from './icons';
import { PRIORITY_STYLES } from '../constants';

interface TaskCardProps {
  task: Task;
  assignee?: User;
  onOpen: (task: Task) => void;
}

export const TaskCard: React.FC<TaskCardProps> = ({ task, assignee, onOpen }) => {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({ id: task.id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      onOpen(task);
    }
  };
  
  const priorityStyle = PRIORITY_STYLES[task.priority];
  const dueDate = new Date(task.dueDate);
  const isOverdue = dueDate < new Date();

  return (
    <div
      ref={setNodeRef}
      style={style}
      {...attributes}
      {...listeners}
      tabIndex={0}
      onKeyDown={handleKeyDown}
      aria-label={`Task: ${task.title}, Priority: ${priorityStyle.label}`}
      className="bg-secondary p-3 rounded-lg shadow-sm border border-transparent hover:border-primary/50 focus:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background cursor-grab active:cursor-grabbing"
    >
      <p className="text-foreground font-medium leading-tight mb-2">{task.title}</p>
      <div className="flex items-center justify-between text-muted-foreground text-sm">
        <div className="flex items-center gap-2">
            <div className="flex items-center gap-1" title={`Priority: ${priorityStyle.label}`}>
                 <PriorityIcon priority={task.priority} className={priorityStyle.iconColor} />
            </div>
             {task.tags.length > 0 && <TagIcon className="w-4 h-4" />}
            <div className={`flex items-center gap-1 ${isOverdue ? 'text-red-400' : ''}`} title={`Due: ${dueDate.toLocaleDateString()}`}>
                <Calendar className="w-4 h-4"/>
            </div>
        </div>
        {assignee && (
            <img 
                src={assignee.avatarUrl} 
                alt={assignee.name} 
                className="w-6 h-6 rounded-full ring-2 ring-background"
                title={`Assigned to ${assignee.name}`}
            />
        )}
      </div>
    </div>
  );
};
