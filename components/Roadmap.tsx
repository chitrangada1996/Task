import React from 'react';
import { Task, User } from '../types';
import { PRIORITY_STYLES } from '../constants';
import { PriorityIcon } from './icons';

interface RoadmapProps {
  tasks: Task[];
  users: User[];
  onOpenTask: (task: Task) => void;
}

const getMonthYear = (dateString: string): string => {
    const date = new Date(dateString);
    return date.toLocaleString('default', { month: 'long', year: 'numeric' });
};

export const Roadmap: React.FC<RoadmapProps> = ({ tasks, users, onOpenTask }) => {
    const userMap = new Map(users.map(u => [u.id, u]));

    const sortedTasks = [...tasks].sort((a, b) => new Date(a.dueDate).getTime() - new Date(b.dueDate).getTime());

    const tasksByMonth = sortedTasks.reduce((acc, task) => {
        const monthYear = getMonthYear(task.dueDate);
        if (!acc[monthYear]) {
            acc[monthYear] = [];
        }
        acc[monthYear].push(task);
        return acc;
    }, {} as Record<string, Task[]>);
    
    const sortedMonths = Object.keys(tasksByMonth).sort((a, b) => {
        const dateA = new Date(a);
        const dateB = new Date(b);
        if (isNaN(dateA.getTime())) return 1;
        if (isNaN(dateB.getTime())) return -1;
        return dateA.getTime() - dateB.getTime();
    });

    return (
        <div className="h-full overflow-y-auto p-6">
            <div className="max-w-4xl mx-auto">
                {sortedMonths.map(month => (
                    <div key={month} className="mb-10 relative pl-8">
                        <div className="absolute left-[1px] h-full border-l-2 border-border"></div>
                        <div className="absolute -left-2.5 top-1 w-6 h-6 bg-primary rounded-full border-4 border-background"></div>
                        <h2 className="text-lg font-semibold text-foreground mb-4 -mt-1">{month}</h2>
                        <div className="space-y-3">
                            {tasksByMonth[month].map(task => {
                                const assignee = userMap.get(task.assigneeId);
                                const priorityStyle = PRIORITY_STYLES[task.priority];
                                return (
                                    <button 
                                        key={task.id}
                                        onClick={() => onOpenTask(task)}
                                        className="w-full text-left bg-secondary p-3 rounded-lg border border-transparent hover:border-primary/50 focus:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background cursor-pointer transition-all"
                                        aria-label={`Open task details for ${task.title}`}
                                    >
                                        <div className="flex justify-between items-center">
                                            <p className="font-medium text-foreground">{task.title}</p>
                                            <div className="flex items-center gap-4">
                                                <div className="flex items-center gap-1.5" title={`Priority: ${priorityStyle.label}`}>
                                                    <PriorityIcon priority={task.priority} className={priorityStyle.iconColor} />
                                                    <span className="text-sm text-muted-foreground hidden sm:inline">{priorityStyle.label}</span>
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
                                    </button>
                                );
                            })}
                        </div>
                    </div>
                ))}
                 {sortedMonths.length === 0 && (
                    <div className="text-center text-muted-foreground">
                        <p>No tasks with due dates to show on the roadmap.</p>
                    </div>
                )}
            </div>
        </div>
    );
};