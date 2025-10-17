import React, { useState, useEffect, useRef, useCallback } from 'react';
import Fuse from 'fuse.js';
import { CommandPaletteItem } from '../types';
import { CommandIcon, TaskIcon, FileText } from './icons';

interface CommandPaletteProps {
  isOpen: boolean;
  onClose: () => void;
  items: CommandPaletteItem[];
}

export const CommandPalette: React.FC<CommandPaletteProps> = ({ isOpen, onClose, items }) => {
  const [query, setQuery] = useState('');
  const [activeIndex, setActiveIndex] = useState(0);
  const inputRef = useRef<HTMLInputElement>(null);
  const resultsRef = useRef<HTMLDivElement>(null);

  const fuse = new Fuse(items, {
    keys: ['title'],
    threshold: 0.4,
  });

  const results = query ? fuse.search(query).map(result => result.item) : items;

  useEffect(() => {
    if (isOpen) {
      inputRef.current?.focus();
      setQuery('');
    }
  }, [isOpen]);
  
  useEffect(() => {
    setActiveIndex(0);
  }, [query]);

  useEffect(() => {
    if (!resultsRef.current) return;
    const activeElement = resultsRef.current.children[activeIndex] as HTMLElement;
    if (activeElement) {
        activeElement.scrollIntoView({ block: 'nearest' });
    }
  }, [activeIndex]);

  const handleKeyDown = useCallback((e: React.KeyboardEvent) => {
    if (e.key === 'ArrowDown') {
      e.preventDefault();
      setActiveIndex(prev => (prev + 1) % results.length);
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      setActiveIndex(prev => (prev - 1 + results.length) % results.length);
    } else if (e.key === 'Enter') {
      if (results[activeIndex]) {
        results[activeIndex].action();
        onClose();
      }
    } else if (e.key === 'Escape') {
      onClose();
    }
  }, [results, activeIndex, onClose]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-background/80 backdrop-blur-sm z-50 flex items-start justify-center pt-20" onClick={onClose}>
      <div 
        className="w-full max-w-xl bg-card border border-border rounded-2xl shadow-2xl overflow-hidden"
        onClick={e => e.stopPropagation()}
        onKeyDown={handleKeyDown}
      >
        <div className="p-3 border-b border-border flex items-center gap-3">
          <CommandIcon className="w-5 h-5 text-muted-foreground"/>
          <input
            ref={inputRef}
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search tasks and pages..."
            className="w-full bg-transparent focus:outline-none text-foreground"
          />
        </div>
        <div ref={resultsRef} className="max-h-96 overflow-y-auto p-2">
          {results.length > 0 ? (
            results.map((item, index) => (
              <div
                key={item.id}
                onClick={() => { item.action(); onClose(); }}
                onMouseEnter={() => setActiveIndex(index)}
                className={`flex items-center gap-3 p-3 rounded-lg cursor-pointer text-foreground ${index === activeIndex ? 'bg-secondary' : ''}`}
                aria-selected={index === activeIndex}
                role="option"
              >
                {item.type === 'task' 
                    ? <TaskIcon className="w-4 h-4 text-muted-foreground" /> 
                    : <FileText className="w-4 h-4 text-muted-foreground" />
                }
                <span>{item.title}</span>
              </div>
            ))
          ) : (
            <p className="p-4 text-center text-muted-foreground">No results found.</p>
          )}
        </div>
      </div>
    </div>
  );
};