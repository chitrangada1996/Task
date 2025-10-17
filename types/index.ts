
export type Priority = 'low' | 'medium' | 'high' | 'critical';
export type Status = 'todo' | 'inprogress' | 'blocked' | 'done';

export interface User {
  id: string;
  name: string;
  avatarUrl: string;
}

export interface Task {
  id: string;
  title: string;
  priority: Priority;
  status: Status;
  assigneeId: string;
  dueDate: string;
  tags: string[];
  description: string;
}

export interface Page {
    id: string;
    title: string;
    type: 'page';
}

export interface CommandPaletteItem {
    id: string;
    title: string;
    type: 'task' | 'page';
    action: () => void;
}

export type NewTaskData = {
    title: string;
    description: string;
    priority: Priority;
    assigneeId: string;
};
