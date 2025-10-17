import React from 'react';
import { useDroppable } from '@dnd-kit/core';
import { SortableContext, verticalListSortingStrategy } from '@dnd-kit/sortable';
import { Status, Task, User } from '../types';
import { TaskCard } from './TaskCard';

interface TaskColumnProps {
  id: Status;
  title: string;
  tasks: Task[];
  users: User[];
  onOpenTask: (task: Task) => void;
}

export const TaskColumn: React.FC<TaskColumnProps> = ({ id, title, tasks, users, onOpenTask }) => {
  const { setNodeRef, isOver } = useDroppable({ id });
  
  const userMap = new Map(users.map(u => [u.id, u]));

  return (
    <div className="flex flex-col w-72 md:w-80 flex-shrink-0">
        <div className="flex items-center gap-2 p-2 mb-2">
            <span className="text-sm font-medium text-muted-foreground bg-secondary px-2 py-0.5 rounded-full">{tasks.length}</span>
            <h2 className={`font-semibold ${id === 'done' ? 'text-muted-foreground' : 'text-foreground'}`}>{title}</h2>
        </div>
      <SortableContext id={id} items={tasks.map(t => t.id)} strategy={verticalListSortingStrategy}>
        <div
          ref={setNodeRef}
          className={`flex-grow p-2 rounded-xl transition-colors ${isOver ? 'bg-secondary/80' : 'bg-secondary/40'}`}
        >
          <div className="space-y-3">
            {tasks.map(task => (
              <TaskCard key={task.id} task={task} assignee={userMap.get(task.assigneeId)} onOpen={onOpenTask} />
            ))}
          </div>
        </div>
      </SortableContext>
    </div>
  );
};