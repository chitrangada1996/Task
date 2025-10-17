import React from 'react';
import { PlusIcon, CommandIcon, SunIcon, MoonIcon } from './icons';

export type View = 'board' | 'roadmap' | 'docs';
export type Theme = 'light' | 'dark';

interface NavItemProps {
    title: string;
    view: View;
    activeView: View;
    onNavigate: (view: View) => void;
}

const NavItem: React.FC<NavItemProps> = ({ title, view, activeView, onNavigate }) => {
    const isActive = view === activeView;
    const commonClasses = 'block p-2 rounded-md w-full text-left';
    const activeClasses = 'bg-secondary text-primary-foreground font-semibold';
    const inactiveClasses = 'text-muted-foreground hover:bg-secondary/80';
    
    return (
        <li className="mb-2">
            <button onClick={() => onNavigate(view)} className={`${commonClasses} ${isActive ? activeClasses : inactiveClasses}`}>
                {title}
            </button>
        </li>
    );
};

interface AppShellProps {
  children: React.ReactNode;
  onCommandPaletteOpen: () => void;
  activeView: View;
  onNavigate: (view: View) => void;
  onNewTaskClick: () => void;
  theme: Theme;
  onThemeToggle: () => void;
}

const viewTitles: Record<View, string> = {
    board: 'Projects Board',
    roadmap: 'Roadmap',
    docs: 'Planning Docs',
};


export const AppShell: React.FC<AppShellProps> = ({ children, onCommandPaletteOpen, activeView, onNavigate, onNewTaskClick, theme, onThemeToggle }) => {
  return (
    <div className="flex h-screen bg-background text-foreground">
      <aside className="w-64 border-r border-border p-4 flex-shrink-0">
        <h1 className="text-xl font-bold mb-6">TaskMate</h1>
        <nav>
          <ul>
            <NavItem title="Projects Board" view="board" activeView={activeView} onNavigate={onNavigate} />
            <NavItem title="Roadmap" view="roadmap" activeView={activeView} onNavigate={onNavigate} />
            <NavItem title="Planning Docs" view="docs" activeView={activeView} onNavigate={onNavigate} />
          </ul>
        </nav>
      </aside>
      <div className="flex flex-col flex-grow">
        <header className="h-14 border-b border-border flex items-center justify-between px-6 flex-shrink-0">
            <div className="flex items-center gap-2 text-foreground font-semibold">
                <span>{viewTitles[activeView]}</span>
            </div>
            <div className="flex items-center gap-4">
                <button
                    onClick={onThemeToggle}
                    className="flex items-center text-sm text-muted-foreground p-1.5 rounded-md hover:bg-secondary focus:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                    aria-label={`Switch to ${theme === 'dark' ? 'light' : 'dark'} mode`}
                >
                    {theme === 'dark' ? <SunIcon className="w-5 h-5" /> : <MoonIcon className="w-5 h-5" />}
                </button>
                <button
                 onClick={onCommandPaletteOpen}
                 className="flex items-center gap-2 text-sm text-muted-foreground p-1.5 rounded-md hover:bg-secondary focus:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                 aria-label="Open command palette (Cmd/Ctrl + K)"
                >
                    <CommandIcon className="w-4 h-4" />
                    <kbd className="font-sans text-xs">⌘K</kbd>
                </button>
                <button 
                  onClick={onNewTaskClick}
                  className="p-1.5 bg-primary text-primary-foreground rounded-md hover:opacity-90 focus:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background"
                  aria-label="Create new task"
                 >
                    <PlusIcon className="w-5 h-5" />
                </button>
            </div>
        </header>
        <main className="flex-grow overflow-hidden">
          {children}
        </main>
      </div>
    </div>
  );
};