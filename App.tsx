import React, { useState, useEffect, useCallback } from 'react';
import { AppShell, View, Theme } from './components/AppShell';
import { Board } from './components/Board';
import { TaskDetailModal } from './components/TaskDetailModal';
import { CommandPalette } from './components/CommandPalette';
import { fetchTasks, fetchUsers, updateTask, createTask, fetchPages } from './services/api';
import { Task, User, CommandPaletteItem, Page, NewTaskData } from './types';
import { Roadmap } from './components/Roadmap';
import { PlanningDocs } from './components/PlanningDocs';
import { NewTaskModal } from './components/NewTaskModal';
import { useLocalStorage } from './hooks/useLocalStorage';

function App() {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [users, setUsers] = useState<User[]>([]);
  const [pages, setPages] = useState<Page[]>([]);
  const [loading, setLoading] = useState(true);
  
  const [selectedTask, setSelectedTask] = useState<Task | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isCommandPaletteOpen, setIsCommandPaletteOpen] = useState(false);
  const [isNewTaskModalOpen, setIsNewTaskModalOpen] = useState(false);
  const [activeView, setActiveView] = useState<View>('board');
  const [theme, setTheme] = useLocalStorage<Theme>('taskmate_theme_v1', 'dark');

  useEffect(() => {
    const root = window.document.documentElement;
    root.classList.remove('light', 'dark');
    root.classList.add(theme);
  }, [theme]);

  const handleThemeToggle = () => {
    setTheme(prevTheme => (prevTheme === 'dark' ? 'light' : 'dark'));
  };

  const loadData = useCallback(async () => {
    try {
      setLoading(true);
      const [fetchedTasks, fetchedUsers, fetchedPages] = await Promise.all([fetchTasks(), fetchUsers(), fetchPages()]);
      setTasks(fetchedTasks);
      setUsers(fetchedUsers);
      setPages(fetchedPages);
    } catch (error) {
      console.error("Failed to load data", error);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadData();
  }, [loadData]);

  const handleOpenTask = (task: Task) => {
    setSelectedTask(task);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setSelectedTask(null);
  };
  
  const handleUpdateTask = async (updatedTask: Task) => {
    try {
      // Optimistic UI update
      setTasks(prevTasks => 
        prevTasks.map(task => (task.id === updatedTask.id ? updatedTask : task))
      );

      if (selectedTask && selectedTask.id === updatedTask.id) {
        setSelectedTask(updatedTask);
      }
      // API call
      await updateTask(updatedTask);

    } catch (error) {
      console.error("Failed to save task", error);
      // Revert UI on error if needed
      loadData();
    }
  };

  const handleAddTask = async (taskData: NewTaskData) => {
    try {
      const newTask = await createTask(taskData);
      setTasks(prevTasks => [newTask, ...prevTasks]);
    } catch (error) {
      console.error("Failed to create task", error);
    }
  };

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        setIsCommandPaletteOpen(true);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  const commandPaletteItems: CommandPaletteItem[] = [
    ...tasks.map(task => ({
      id: task.id,
      title: task.title,
      type: 'task' as const,
      action: () => handleOpenTask(task),
    })),
    ...pages.map(page => ({
        id: page.id,
        title: page.title,
        type: 'page' as const,
        action: () => {
            setActiveView('docs');
            // In a real app, you might navigate to a specific page route.
            // For now, we'll navigate to the general docs page and show an alert.
            setTimeout(() => alert(`Navigated to page: ${page.title}`), 100);
        },
    })),
  ];

  const renderContent = () => {
    if (loading) {
      return (
        <div className="flex items-center justify-center h-full">
          <p className="text-muted-foreground">Loading...</p>
        </div>
      );
    }

    switch (activeView) {
      case 'roadmap':
        return <Roadmap tasks={tasks} users={users} onOpenTask={handleOpenTask} />;
      case 'docs':
        return <PlanningDocs />;
      case 'board':
      default:
        return <Board initialTasks={tasks} users={users} onUpdateTask={handleUpdateTask} />;
    }
  };


  return (
    <>
      <AppShell
        activeView={activeView}
        onNavigate={setActiveView}
        onCommandPaletteOpen={() => setIsCommandPaletteOpen(true)}
        onNewTaskClick={() => setIsNewTaskModalOpen(true)}
        theme={theme}
        onThemeToggle={handleThemeToggle}
      >
        {renderContent()}
      </AppShell>
      
      <TaskDetailModal 
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        task={selectedTask}
        users={users}
        onSave={handleUpdateTask}
      />

      <NewTaskModal
        isOpen={isNewTaskModalOpen}
        onClose={() => setIsNewTaskModalOpen(false)}
        onSave={handleAddTask}
        users={users}
      />

      <CommandPalette
        isOpen={isCommandPaletteOpen}
        onClose={() => setIsCommandPaletteOpen(false)}
        items={commandPaletteItems}
      />
    </>
  );
}

export default App;
