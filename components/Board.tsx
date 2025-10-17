import React, { useState, useEffect } from 'react';
import { DndContext, DragEndEvent, closestCorners, PointerSensor, useSensor, useSensors, DragOverlay, DragStartEvent } from '@dnd-kit/core';
import { Task, Status, User } from '../types';
import { STATUS_COLUMNS } from '../constants';
import { TaskColumn } from './TaskColumn';
import { useLocalStorage } from '../hooks/useLocalStorage';
import { TaskCard } from './TaskCard';

type BoardState = Record<Status, Task[]>;

interface BoardProps {
  initialTasks: Task[];
  users: User[];
  onUpdateTask: (task: Task) => void;
}

const initializeBoard = (tasks: Task[]): BoardState => {
  const board: BoardState = { todo: [], inprogress: [], blocked: [], done: [] };
  tasks.forEach(task => {
    if (board[task.status]) {
      board[task.status].push(task);
    }
  });
  return board;
};

export const Board: React.FC<BoardProps> = ({ initialTasks, users, onUpdateTask }) => {
  const [boardState, setBoardState] = useLocalStorage<BoardState>('taskmate_board_v1', initializeBoard(initialTasks));
  const [activeTask, setActiveTask] = useState<Task | null>(null);
  const [expandedTaskId, setExpandedTaskId] = useState<string | null>(null);

  useEffect(() => {
     setBoardState(initializeBoard(initialTasks));
      // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [initialTasks]);

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 8,
      },
    })
  );
  
  const userMap = new Map(users.map(u => [u.id, u]));

  const findTask = (taskId: string) => {
    for (const column of Object.values(boardState)) {
      const task = column.find(t => t.id === taskId);
      if (task) return task;
    }
    return null;
  };
  
  const findColumnForTask = (taskId: string): Status | null => {
      for (const [columnId, columnTasks] of Object.entries(boardState)) {
          if (columnTasks.some(task => task.id === taskId)) {
              return columnId as Status;
          }
      }
      return null;
  }
  
  const handleToggleExpand = (taskId: string) => {
    setExpandedTaskId(prevId => (prevId === taskId ? null : taskId));
  };


  const handleDragStart = (event: DragStartEvent) => {
    setExpandedTaskId(null); // Collapse any open task before dragging
    const { active } = event;
    const task = findTask(active.id.toString());
    setActiveTask(task);
  };

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
    setActiveTask(null);

    if (!over) return;
    if (active.id === over.id) return;

    const originalColumn = findColumnForTask(active.id.toString());
    const overIsColumn = Object.keys(STATUS_COLUMNS).includes(over.id.toString());
    const overColumn = overIsColumn ? over.id as Status : findColumnForTask(over.id.toString());

    if (!originalColumn || !overColumn) return;
    
    const taskToMove = findTask(active.id.toString());
    if (!taskToMove) return;

    const updatedTask = { ...taskToMove, status: overColumn };

    setBoardState(prev => {
      const newBoardState = { ...prev };
      const activeTaskIndex = newBoardState[originalColumn].findIndex(t => t.id === active.id);
      
      if (activeTaskIndex === -1) return prev; // Should not happen

      const [movedTask] = newBoardState[originalColumn].splice(activeTaskIndex, 1);
      
      movedTask.status = overColumn;

      if (originalColumn === overColumn) {
        // Moving within the same column
        const overTaskIndex = newBoardState[overColumn].findIndex(t => t.id === over.id);
        newBoardState[overColumn].splice(overTaskIndex, 0, movedTask);
      } else {
        // Moving to a different column
        if (overIsColumn) {
            newBoardState[overColumn].push(movedTask);
        } else {
            const overTaskIndex = newBoardState[overColumn].findIndex(t => t.id === over.id);
            newBoardState[overColumn].splice(overTaskIndex, 0, movedTask);
        }
      }
      return newBoardState;
    });

    onUpdateTask(updatedTask);
  };

  return (
    <DndContext sensors={sensors} collisionDetection={closestCorners} onDragEnd={handleDragEnd} onDragStart={handleDragStart}>
      <div className="flex gap-4 p-4 overflow-x-auto h-full">
        {Object.entries(STATUS_COLUMNS).map(([status, title]) => (
          <TaskColumn
            key={status}
            id={status as Status}
            title={title}
            tasks={boardState[status as Status] || []}
            users={users}
            expandedTaskId={expandedTaskId}
            onToggleExpand={handleToggleExpand}
            onUpdateTask={onUpdateTask}
          />
        ))}
      </div>
      <DragOverlay>
        {activeTask ? <TaskCard task={activeTask} assignee={userMap.get(activeTask.assigneeId)} expandedTaskId={null} onToggleExpand={() => {}} onUpdateTask={() => {}} /> : null}
      </DragOverlay>
    </DndContext>
  );
};
