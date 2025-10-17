import React, { useEffect, useRef, useState } from 'react';
import { Task, User, Priority, Subtask, Comment } from '../types';
import { CloseIcon, PriorityIcon, Calendar, TagIcon, UserIcon, CommentIcon } from './icons';
import { PRIORITY_STYLES, PRIORITIES } from '../constants';

interface TaskDetailModalProps {
  task: Task | null;
  users: User[];
  isOpen: boolean;
  onClose: () => void;
  onSave: (task: Task) => void;
}

const MetadataItem: React.FC<{ icon: React.ReactNode, label: string, children: React.ReactNode }> = ({ icon, label, children }) => (
    <div className="flex items-start justify-between py-3 border-b border-border text-sm">
        <div className="flex items-center gap-2 text-muted-foreground pt-1">
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
  const titleInputRef = useRef<HTMLInputElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const [currentTag, setCurrentTag] = useState('');
  const [isEditingTitle, setIsEditingTitle] = useState(false);
  const [editableTitle, setEditableTitle] = useState('');
  const [isEditingDescription, setIsEditingDescription] = useState(false);
  const [editableDescription, setEditableDescription] = useState('');
  const [newSubtaskTitle, setNewSubtaskTitle] = useState('');
  const [newComment, setNewComment] = useState('');

  useEffect(() => {
    if (task) {
        setEditableTitle(task.title || '');
        setIsEditingTitle(false);
        setEditableDescription(task.description || '');
        setIsEditingDescription(false);
        setNewSubtaskTitle('');
        setNewComment('');
    }
  }, [task]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && !isEditingDescription && !isEditingTitle) {
        onClose();
      }
    };

    if (isOpen) {
      setCurrentTag('');
      document.addEventListener('keydown', handleKeyDown);
      modalRef.current?.focus();
    }

    return () => {
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, [isOpen, onClose, isEditingDescription, isEditingTitle]);

  useEffect(() => {
    if (isEditingTitle && titleInputRef.current) {
        titleInputRef.current.focus();
        titleInputRef.current.select();
    }
  }, [isEditingTitle]);

  useEffect(() => {
    if (isEditingDescription && textareaRef.current) {
        textareaRef.current.focus();
        textareaRef.current.select();
    }
  }, [isEditingDescription]);
  
  const formatRelativeTime = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffInSeconds = Math.floor((now.getTime() - date.getTime()) / 1000);

    if (diffInSeconds < 60) return `${diffInSeconds}s ago`;
    const diffInMinutes = Math.floor(diffInSeconds / 60);
    if (diffInMinutes < 60) return `${diffInMinutes}m ago`;
    const diffInHours = Math.floor(diffInMinutes / 60);
    if (diffInHours < 24) return `${diffInHours}h ago`;
    const diffInDays = Math.floor(diffInHours / 24);
    if (diffInDays < 7) return `${diffInDays}d ago`;
    
    return date.toLocaleDateString();
  };

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

  const handleAddTag = () => {
    const newTag = currentTag.trim().toLowerCase();
    if (newTag && !task.tags.includes(newTag) && task.tags.length < 5) {
        onSave({ ...task, tags: [...task.tags, newTag] });
    }
    setCurrentTag('');
  };

  const handleTagInputKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
      if (e.key === 'Enter' || e.key === ',') {
          e.preventDefault();
          handleAddTag();
      }
  };

  const handleRemoveTag = (tagToRemove: string) => {
      onSave({ ...task, tags: task.tags.filter(tag => tag !== tagToRemove) });
  };
  
  const handleSaveTitle = () => {
    const trimmedTitle = editableTitle.trim();
    if (trimmedTitle && trimmedTitle !== task.title) {
        onSave({ ...task, title: trimmedTitle });
    }
    setIsEditingTitle(false);
  };

  const handleTitleInputKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
      if (e.key === 'Enter') {
          e.preventDefault();
          handleSaveTitle();
      }
      if (e.key === 'Escape') {
        setEditableTitle(task.title);
        setIsEditingTitle(false);
      }
  };
  
  const handleSaveDescription = () => {
    onSave({ ...task, description: editableDescription.trim() });
    setIsEditingDescription(false);
  };

  const handleCancelEditingDescription = () => {
    setEditableDescription(task.description || '');
    setIsEditingDescription(false);
  };
  
  const handleDescriptionKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
      if (e.key === 'Escape') {
        handleCancelEditingDescription();
      }
      if ((e.metaKey || e.ctrlKey) && e.key === 'Enter') {
          e.preventDefault();
          handleSaveDescription();
      }
  };

  const handleToggleSubtask = (subtaskId: string) => {
      const updatedSubtasks = task.subtasks?.map(subtask => 
          subtask.id === subtaskId ? { ...subtask, completed: !subtask.completed } : subtask
      );
      onSave({ ...task, subtasks: updatedSubtasks });
  };

  const handleAddSubtask = (e: React.FormEvent) => {
      e.preventDefault();
      if (newSubtaskTitle.trim()) {
          const newSubtask: Subtask = {
              id: `sub-${Date.now()}`,
              title: newSubtaskTitle.trim(),
              completed: false,
          };
          const updatedSubtasks = [...(task.subtasks || []), newSubtask];
          onSave({ ...task, subtasks: updatedSubtasks });
          setNewSubtaskTitle('');
      }
  };
  
  const handleDeleteSubtask = (subtaskId: string) => {
      const updatedSubtasks = task.subtasks?.filter(subtask => subtask.id !== subtaskId);
      onSave({ ...task, subtasks: updatedSubtasks });
  };
  
  const handlePostComment = (e: React.FormEvent) => {
    e.preventDefault();
    const content = newComment.trim();
    if (content && users.length > 0) {
        const newCommentObject: Comment = {
            id: `comment-${Date.now()}`,
            // For MVP, assume the first user is the one commenting.
            authorId: users[0].id,
            content,
            createdAt: new Date().toISOString(),
        };
        const updatedComments = [...(task.comments || []), newCommentObject];
        onSave({ ...task, comments: updatedComments });
        setNewComment('');
    }
  };
  
  const completedSubtasks = task.subtasks?.filter(s => s.completed).length ?? 0;
  const totalSubtasks = task.subtasks?.length ?? 0;
  const progressPercentage = totalSubtasks > 0 ? (completedSubtasks / totalSubtasks) * 100 : 0;

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
               <div className="mb-4">
                {isEditingTitle ? (
                    <input
                        ref={titleInputRef}
                        value={editableTitle}
                        onChange={(e) => setEditableTitle(e.target.value)}
                        onKeyDown={handleTitleInputKeyDown}
                        onBlur={handleSaveTitle}
                        className="w-full bg-secondary border border-border rounded-md p-1 focus:outline-none focus:ring-2 focus:ring-ring text-2xl font-bold text-foreground"
                        aria-label="Task title"
                    />
                ) : (
                    <h1 
                        id="task-title" 
                        onClick={() => setIsEditingTitle(true)} 
                        className="text-2xl font-bold text-foreground rounded-lg -m-2 p-2 hover:bg-secondary cursor-pointer"
                    >
                        {task.title}
                    </h1>
                )}
              </div>
              <h2 className="text-sm font-semibold text-muted-foreground mb-2 mt-6">Description</h2>
              {isEditingDescription ? (
                 <div>
                    <textarea
                        ref={textareaRef}
                        value={editableDescription}
                        onChange={(e) => setEditableDescription(e.target.value)}
                        onKeyDown={handleDescriptionKeyDown}
                        className="w-full bg-secondary border border-border rounded-md p-2 focus:outline-none focus:ring-2 focus:ring-ring resize-y min-h-[120px] text-foreground/90 prose prose-sm prose-invert max-w-none"
                        aria-label="Task description"
                    />
                    <div className="flex items-center gap-2 mt-2">
                        <button onClick={handleSaveDescription} className="px-3 py-1 rounded-md text-sm font-semibold bg-primary text-primary-foreground hover:opacity-90">Save</button>
                        <button onClick={handleCancelEditingDescription} className="px-3 py-1 rounded-md text-sm font-semibold text-foreground bg-secondary hover:bg-secondary/80">Cancel</button>
                    </div>
                </div>
              ) : (
                <div onClick={() => setIsEditingDescription(true)} className="p-2 -m-2 rounded-lg hover:bg-secondary cursor-pointer min-h-[50px]">
                    <p className="text-foreground/90 prose prose-sm prose-invert max-w-none">
                        {task.description ? task.description : <span className="text-muted-foreground italic">Add a description...</span>}
                    </p>
                </div>
              )}
              <div className="mt-6">
                <h2 className="text-sm font-semibold text-muted-foreground mb-2">Subtasks</h2>
                { (task.subtasks?.length ?? 0) > 0 && (
                    <div className="flex items-center gap-2 mb-2 text-xs text-muted-foreground">
                        <span>{Math.round(progressPercentage)}%</span>
                        <div className="w-full bg-secondary rounded-full h-1.5">
                            <div className="bg-primary h-1.5 rounded-full" style={{ width: `${progressPercentage}%` }}></div>
                        </div>
                        <span>{completedSubtasks}/{totalSubtasks}</span>
                    </div>
                )}
                 <div className="space-y-1">
                    {task.subtasks?.map(subtask => (
                        <div key={subtask.id} className="flex items-center gap-2 group hover:bg-secondary p-1 rounded-md -m-1">
                            <input
                                type="checkbox"
                                id={`subtask-${subtask.id}`}
                                checked={subtask.completed}
                                onChange={() => handleToggleSubtask(subtask.id)}
                                className="w-4 h-4 rounded accent-primary bg-secondary border-border focus:ring-ring"
                            />
                            <label htmlFor={`subtask-${subtask.id}`} className={`flex-grow text-sm ${subtask.completed ? 'line-through text-muted-foreground' : 'text-foreground'}`}>
                                {subtask.title}
                            </label>
                            <button onClick={() => handleDeleteSubtask(subtask.id)} className="opacity-0 group-hover:opacity-100 text-muted-foreground hover:text-foreground" aria-label={`Delete subtask: ${subtask.title}`}>
                                <CloseIcon className="w-4 h-4" />
                            </button>
                        </div>
                    ))}
                </div>
                 <form onSubmit={handleAddSubtask} className="mt-2">
                    <input
                        type="text"
                        value={newSubtaskTitle}
                        onChange={(e) => setNewSubtaskTitle(e.target.value)}
                        placeholder="Add a new subtask..."
                        className="w-full bg-secondary border-border text-sm rounded-md px-2 py-1 focus:outline-none focus:ring-1 focus:ring-ring"
                    />
                </form>
              </div>
              <div className="mt-8">
                <h2 className="text-sm font-semibold text-muted-foreground mb-3 flex items-center gap-2">
                    <CommentIcon className="w-4 h-4" />
                    Activity
                </h2>
                <div className="space-y-4">
                    <div className="flex items-start gap-3">
                        <img 
                            src={users[0]?.avatarUrl || ''}
                            alt={users[0]?.name || 'Current User'}
                            className="w-8 h-8 rounded-full mt-1"
                        />
                        <form onSubmit={handlePostComment} className="flex-grow">
                            <textarea
                                value={newComment}
                                onChange={(e) => setNewComment(e.target.value)}
                                placeholder="Add a comment..."
                                className="w-full bg-secondary border border-border rounded-md px-2 py-1.5 focus:outline-none focus:ring-2 focus:ring-ring text-sm resize-none"
                                rows={2}
                            />
                            {newComment.trim() && (
                                <div className="mt-2">
                                    <button type="submit" className="px-3 py-1 rounded-md text-sm font-semibold bg-primary text-primary-foreground hover:opacity-90">
                                        Comment
                                    </button>
                                </div>
                            )}
                        </form>
                    </div>
                    {task.comments?.slice().reverse().map(comment => {
                        const author = users.find(u => u.id === comment.authorId);
                        if (!author) return null;
                        return (
                            <div key={comment.id} className="flex items-start gap-3">
                                <img src={author.avatarUrl} alt={author.name} className="w-8 h-8 rounded-full" />
                                <div className="flex-grow">
                                    <div className="flex items-baseline gap-2">
                                        <span className="font-semibold text-foreground text-sm">{author.name}</span>
                                        <span className="text-xs text-muted-foreground">{formatRelativeTime(comment.createdAt)}</span>
                                    </div>
                                    <div className="text-sm text-foreground/90 bg-secondary px-3 py-2 rounded-lg mt-1 whitespace-pre-wrap">{comment.content}</div>
                                </div>
                            </div>
                        )
                    })}
                </div>
              </div>
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
                    <div className="flex flex-wrap gap-1 justify-end max-w-[220px]">
                        {task.tags.map(tag => (
                           <span key={tag} className="flex items-center gap-1 bg-secondary text-muted-foreground text-xs font-medium px-2 py-0.5 rounded-full">
                                {tag}
                                <button type="button" onClick={() => handleRemoveTag(tag)} className="text-muted-foreground hover:text-foreground">
                                    <CloseIcon className="w-3 h-3" />
                                </button>
                            </span>
                        ))}
                        <input
                            type="text"
                            value={currentTag}
                            onChange={(e) => setCurrentTag(e.target.value)}
                            onKeyDown={handleTagInputKeyDown}
                            onBlur={handleAddTag}
                            placeholder="Add tag..."
                            className="bg-secondary text-xs rounded-md px-2 py-0.5 w-20 focus:outline-none focus:ring-1 focus:ring-ring"
                            disabled={task.tags.length >= 5}
                        />
                    </div>
                </MetadataItem>

            </aside>
          </div>
        </main>
      </div>
    </div>
  );
};