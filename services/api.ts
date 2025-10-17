
import { MOCK_TASKS, MOCK_USERS, MOCK_PAGES } from '../mocks/data';
import { Task, User, Page, NewTaskData } from '../types';

const SIMULATED_LATENCY = 500; // ms

export const fetchTasks = (): Promise<Task[]> => {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve(JSON.parse(JSON.stringify(MOCK_TASKS)));
    }, SIMULATED_LATENCY);
  });
};

export const fetchUsers = (): Promise<User[]> => {
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve(JSON.parse(JSON.stringify(MOCK_USERS)));
      }, SIMULATED_LATENCY);
    });
  };

export const fetchPages = (): Promise<Page[]> => {
    return new Promise((resolve) => {
        setTimeout(() => {
        resolve(JSON.parse(JSON.stringify(MOCK_PAGES)));
        }, SIMULATED_LATENCY);
    });
};

export const updateTask = (updatedTask: Task): Promise<Task> => {
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        const taskIndex = MOCK_TASKS.findIndex(task => task.id === updatedTask.id);
        if (taskIndex !== -1) {
          MOCK_TASKS[taskIndex] = updatedTask;
          console.log('Updated task (mock):', updatedTask);
          resolve(updatedTask);
        } else {
          reject(new Error('Task not found'));
        }
      }, SIMULATED_LATENCY);
    });
  };

export const createTask = (data: NewTaskData): Promise<Task> => {
    return new Promise((resolve) => {
        setTimeout(() => {
        const newTask: Task = {
            id: `task-${Date.now()}`,
            title: data.title,
            description: data.description,
            priority: data.priority,
            assigneeId: data.assigneeId,
            status: 'todo',
            dueDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(),
            tags: data.tags,
            subtasks: [],
            comments: [],
        };
        MOCK_TASKS.unshift(newTask);
        resolve(newTask);
        }, SIMULATED_LATENCY);
    });
};