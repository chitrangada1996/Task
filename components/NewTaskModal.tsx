import React, { useState, useEffect, useRef } from 'react';
import { User, Priority, NewTaskData } from '../types';
import { CloseIcon } from './icons';
import { PRIORITY_STYLES, PRIORITIES } from '../constants';

interface NewTaskModalProps {
  isOpen: boolean;
  users: User[];
  onClose: () => void;
  onSave: (taskData: NewTaskData) => void;
}

export const NewTaskModal: React.FC<NewTaskModalProps> = ({ isOpen, users, onClose, onSave }) => {
  const modalRef = useRef<HTMLDivElement>(null);
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [priority, setPriority] = useState<Priority>('medium');
  const [assigneeId, setAssigneeId] = useState<string>('');
  const [error, setError] = useState('');

  useEffect(() => {
    if (isOpen) {
      // Reset form on open
      setTitle('');
      setDescription('');
      setPriority('medium');
      setAssigneeId(users[0]?.id || '');
      setError('');
      modalRef.current?.focus();
    }
  }, [isOpen, users]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose();
      }
    };

    if (isOpen) {
      document.addEventListener('keydown', handleKeyDown);
    }

    return () => {
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, [isOpen, onClose]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) {
      setError('Title is required.');
      return;
    }
    onSave({ title, description, priority, assigneeId });
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div 
        className="fixed inset-0 bg-background/80 backdrop-blur-sm z-50 flex items-center justify-center"
        onClick={onClose}
    >
      <div
        ref={modalRef}
        tabIndex={-1}
        onClick={(e) => e.stopPropagation()}
        className="bg-card border border-border rounded-2xl shadow-2xl w-full max-w-2xl flex flex-col focus:outline-none"
        role="dialog"
        aria-modal="true"
        aria-labelledby="new-task-title"
      >
        <header className="p-4 border-b border-border flex items-center justify-between flex-shrink-0">
          <h2 id="new-task-title" className="text-lg font-semibold text-foreground">Create New Task</h2>
          <button
            onClick={onClose}
            className="p-1 rounded-md text-muted-foreground hover:bg-secondary hover:text-foreground focus:outline-none focus-visible:ring-2 focus-visible:ring-ring"
            aria-label="Close create new task modal"
          >
            <CloseIcon className="w-5 h-5" />
          </button>
        </header>
        <form onSubmit={handleSubmit}>
          <main className="p-6 flex-grow space-y-4">
            <div>
              <label htmlFor="title" className="text-sm font-semibold text-muted-foreground block mb-1">Title <span className="text-red-500">*</span></label>
              <input 
                id="title" 
                type="text" 
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="e.g., Design the new landing page"
                className="w-full bg-secondary border border-border rounded-md px-2 py-1.5 focus:outline-none focus:ring-2 focus:ring-ring"
                required
              />
              {error && <p className="text-red-500 text-sm mt-1">{error}</p>}
            </div>
             <div>
              <label htmlFor="description" className="text-sm font-semibold text-muted-foreground block mb-1">Description</label>
              <textarea
                id="description"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                rows={4}
                placeholder="Add more details about the task..."
                className="w-full bg-secondary border border-border rounded-md px-2 py-1.5 focus:outline-none focus:ring-2 focus:ring-ring"
              />
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                    <label htmlFor="new-assignee" className="text-sm font-semibold text-muted-foreground block mb-1">Assignee</label>
                    <select id="new-assignee" value={assigneeId} onChange={(e) => setAssigneeId(e.target.value)} className="w-full bg-secondary border border-border rounded-md px-2 py-1.5 focus:outline-none focus:ring-2 focus:ring-ring">
                    {users.map(user => (
                        <option key={user.id} value={user.id}>{user.name}</option>
                    ))}
                    </select>
                </div>
                <div>
                    <label htmlFor="new-priority" className="text-sm font-semibold text-muted-foreground block mb-1">Priority</label>
                    <select id="new-priority" value={priority} onChange={(e) => setPriority(e.target.value as Priority)} className="w-full bg-secondary border border-border rounded-md px-2 py-1.5 focus:outline-none focus:ring-2 focus:ring-ring">
                    {PRIORITIES.map(p => (
                        <option key={p} value={p}>{PRIORITY_STYLES[p].label}</option>
                    ))}
                    </select>
                </div>
            </div>
          </main>
          <footer className="p-4 border-t border-border flex justify-end gap-2">
            <button type="button" onClick={onClose} className="px-4 py-2 rounded-md text-sm font-semibold text-foreground bg-secondary hover:bg-secondary/80">Cancel</button>
            <button type="submit" className="px-4 py-2 rounded-md text-sm font-semibold bg-primary text-primary-foreground hover:opacity-90">Create Task</button>
          </footer>
        </form>
      </div>
    </div>
  );
};
