import React, { useEffect, useRef } from 'react';
import { Task, User, Priority } from '../types';
import { CloseIcon, PriorityIcon, Calendar, TagIcon, UserIcon } from './icons';
import { PRIORITY_STYLES, PRIORITIES } from '../constants';

interface TaskDetailModalProps {
  task: Task | null;
  users: User[];
  isOpen: boolean;
  onClose: () => void;
  onSave: (task: Task) => void;
}

const MetadataItem: React.FC<{ icon: React.ReactNode, label: string, children: React.ReactNode }> = ({ icon, label, children }) => (
    <div className="flex items-center justify-between py-3 border-b border-border text-sm">
        <div className="flex items-center gap-2 text-muted-foreground">
            {icon}
            <span>{label}</span>
        </div>
        <div className="text-foreground font-medium">
            {children}
        </div>
    </div>
);

export const TaskDetailModal: React.FC<TaskDetailModalProps> = ({ task, users, isOpen, onClose, onSave }) => {
  const modalRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose();
      }
    };

    if (isOpen) {
      document.addEventListener('keydown', handleKeyDown);
      modalRef.current?.focus();
    }

    return () => {
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, [isOpen, onClose]);

  if (!isOpen || !task) return null;

  const assignee = users.find(u => u.id === task.assigneeId);
  const priorityStyle = PRIORITY_STYLES[task.priority];
  const dueDate = new Date(task.dueDate);

  const handlePriorityChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    onSave({ ...task, priority: e.target.value as Priority });
  };
  
  const handleAssigneeChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    onSave({ ...task, assigneeId: e.target.value });
  };

  return (
    <div 
        className="fixed inset-0 bg-background/80 backdrop-blur-sm z-50 flex items-center justify-center"
        onClick={onClose}
    >
      <div
        ref={modalRef}
        tabIndex={-1}
        onClick={(e) => e.stopPropagation()}
        className="bg-card border border-border rounded-2xl shadow-2xl w-full max-w-3xl max-h-[80vh] flex flex-col focus:outline-none relative"
        role="dialog"
        aria-modal="true"
        aria-labelledby="task-title"
      >
        <button
            onClick={onClose}
            className="absolute top-3 right-3 p-1 rounded-md text-muted-foreground hover:bg-secondary hover:text-foreground focus:outline-none focus-visible:ring-2 focus-visible:ring-ring"
            aria-label="Close task detail modal"
          >
            <CloseIcon className="w-5 h-5" />
        </button>

        <main className="flex-grow overflow-y-auto p-6 md:p-8">
          <div className="grid grid-cols-1 md:grid-cols-3 md:gap-8">
            <div className="md:col-span-2">
              <h1 id="task-title" className="text-2xl font-bold text-foreground mb-4">{task.title}</h1>
              <h2 className="text-sm font-semibold text-muted-foreground mb-2 mt-6">Description</h2>
              <p className="text-foreground/90 prose prose-sm prose-invert max-w-none">{task.description || 'No description provided.'}</p>
            </div>
            <aside className="md:col-span-1 mt-6 md:mt-0 md:border-l md:pl-6 border-border/80">
                <MetadataItem icon={<UserIcon className="w-4 h-4"/>} label="Assignee">
                     <div className="relative">
                        <select 
                            id="assignee" 
                            value={task.assigneeId} 
                            onChange={handleAssigneeChange} 
                            className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                        >
                        {users.map(user => (
                            <option key={user.id} value={user.id}>{user.name}</option>
                        ))}
                        </select>
                        <div className="flex items-center gap-2 bg-secondary/80 px-2 py-1 rounded-md pointer-events-none">
                            {assignee && <img src={assignee.avatarUrl} alt={assignee.name} className="w-5 h-5 rounded-full" />}
                            <span>{assignee?.name || 'Unassigned'}</span>
                        </div>
                    </div>
                </MetadataItem>

                <MetadataItem icon={<PriorityIcon priority={task.priority} />} label="Priority">
                    <div className="relative">
                         <select 
                            id="priority" 
                            value={task.priority} 
                            onChange={handlePriorityChange}
                            className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                         >
                        {PRIORITIES.map(p => (
                            <option key={p} value={p}>{PRIORITY_STYLES[p].label}</option>
                        ))}
                        </select>
                        <div className={`flex items-center gap-2 bg-secondary/80 px-2 py-1 rounded-md pointer-events-none ${priorityStyle.ring} ring-1 ring-inset`}>
                            <PriorityIcon priority={task.priority} className={priorityStyle.iconColor} />
                            <span>{priorityStyle.label}</span>
                        </div>
                    </div>
                </MetadataItem>

                 <MetadataItem icon={<Calendar className="w-4 h-4"/>} label="Due Date">
                    <span>{dueDate.toLocaleDateString(undefined, { month: 'short', day: 'numeric' })}</span>
                </MetadataItem>
                
                <MetadataItem icon={<TagIcon className="w-4 h-4"/>} label="Tags">
                    <div className="flex flex-wrap gap-1 justify-end">
                        {task.tags.map(tag => (
                            <span key={tag} className="bg-secondary text-muted-foreground text-xs font-medium px-2 py-0.5 rounded-full">{tag}</span>
                        ))}
                    </div>
                </MetadataItem>

            </aside>
          </div>
        </main>
      </div>
    </div>
  );
};