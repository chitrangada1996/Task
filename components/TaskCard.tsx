import React from 'react';
import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { Task, User } from '../types';
import { Calendar, PriorityIcon, TaskIcon, CommentIcon } from './icons';
import { PRIORITY_STYLES } from '../constants';

interface TaskCardProps {
  task: Task;
  assignee?: User;
  expandedTaskId: string | null;
  onToggleExpand: (taskId: string) => void;
  onUpdateTask: (task: Task) => void;
}

export const TaskCard: React.FC<TaskCardProps> = ({ task, assignee, expandedTaskId, onToggleExpand, onUpdateTask }) => {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({ id: task.id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
  };
  
  const isExpanded = expandedTaskId === task.id;

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      onToggleExpand(task.id);
    }
  };

  const handleToggleSubtask = (subtaskId: string) => {
    const updatedSubtasks = task.subtasks?.map(subtask => 
        subtask.id === subtaskId ? { ...subtask, completed: !subtask.completed } : subtask
    );
    onUpdateTask({ ...task, subtasks: updatedSubtasks });
  };
  
  const priorityStyle = PRIORITY_STYLES[task.priority];
  const dueDate = new Date(task.dueDate);
  const isOverdue = dueDate < new Date();

  const completedSubtasks = task.subtasks?.filter(s => s.completed).length ?? 0;
  const totalSubtasks = task.subtasks?.length ?? 0;
  const totalComments = task.comments?.length ?? 0;

  return (
    <div
      ref={setNodeRef}
      style={style}
      {...attributes}
      className="bg-secondary rounded-lg shadow-sm border border-transparent focus-within:ring-2 focus-within:ring-ring focus-within:ring-offset-2 focus-within:ring-offset-background"
    >
      <div
        {...listeners}
        onClick={() => onToggleExpand(task.id)}
        onKeyDown={handleKeyDown}
        tabIndex={0}
        aria-expanded={isExpanded}
        aria-label={`Task: ${task.title}, Priority: ${priorityStyle.label}`}
        role="button"
        className="p-3 cursor-pointer focus:outline-none"
      >
        <p className="text-foreground font-medium leading-tight mb-2">{task.title}</p>
        {task.tags.length > 0 && (
          <div className="flex flex-wrap gap-1 mb-2">
              {task.tags.map(tag => (
                  <span key={tag} className="text-xs bg-background text-muted-foreground px-2 py-0.5 rounded-full border">{tag}</span>
              ))}
          </div>
        )}
        <div className="flex items-center justify-between text-muted-foreground text-sm">
          <div className="flex items-center gap-2">
              <div className="flex items-center gap-1" title={`Priority: ${priorityStyle.label}`}>
                   <PriorityIcon priority={task.priority} className={priorityStyle.iconColor} />
              </div>
              {totalSubtasks > 0 && (
                   <div className="flex items-center gap-1" title={`${completedSubtasks} of ${totalSubtasks} subtasks complete`}>
                      <TaskIcon className="w-4 h-4" />
                      <span>{completedSubtasks}/{totalSubtasks}</span>
                   </div>
              )}
              {totalComments > 0 && (
                   <div className="flex items-center gap-1" title={`${totalComments} comments`}>
                      <CommentIcon className="w-4 h-4" />
                      <span>{totalComments}</span>
                   </div>
              )}
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
      
      {isExpanded && (
        <div className="px-3 pb-3 border-t border-border">
          <div className="mt-3">
             <h3 className="text-xs font-semibold text-muted-foreground mb-1 uppercase">Description</h3>
             <p className="text-sm text-foreground/80 whitespace-pre-wrap">
               {task.description || <span className="italic text-muted-foreground">No description provided.</span>}
             </p>
          </div>
          {totalSubtasks > 0 && (
            <div className="mt-4">
              <h3 className="text-xs font-semibold text-muted-foreground mb-2 uppercase">Subtasks</h3>
              <div className="space-y-1">
                {task.subtasks?.map(subtask => (
                  <div key={subtask.id} className="flex items-center gap-2">
                    <input
                        type="checkbox"
                        id={`subtask-card-${subtask.id}`}
                        checked={subtask.completed}
                        onChange={() => handleToggleSubtask(subtask.id)}
                        onClick={(e) => e.stopPropagation()} // Prevent card from collapsing
                        className="w-4 h-4 rounded accent-primary bg-secondary border-border focus:ring-ring"
                    />
                    <label 
                      htmlFor={`subtask-card-${subtask.id}`} 
                      onClick={(e) => e.stopPropagation()} 
                      className={`flex-grow text-sm cursor-pointer ${subtask.completed ? 'line-through text-muted-foreground' : 'text-foreground'}`}
                    >
                        {subtask.title}
                    </label>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};
