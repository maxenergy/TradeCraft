'use client';

import React, { useState, useEffect, useRef } from 'react';
import { Card, CardContent } from '@/components/ui/Card';

interface CommandHistory {
  command: string;
  output: string;
  timestamp: Date;
  error?: boolean;
}

export default function TerminalPage() {
  const [history, setHistory] = useState<CommandHistory[]>([]);
  const [currentCommand, setCurrentCommand] = useState('');
  const [currentDirectory, setCurrentDirectory] = useState('~');
  const [loading, setLoading] = useState(false);
  const [sessionId] = useState(() => `session-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`);
  const terminalEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    terminalEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [history]);

  useEffect(() => {
    inputRef.current?.focus();
  }, []);

  const executeCommand = async (cmd: string) => {
    if (!cmd.trim()) return;

    setLoading(true);
    const timestamp = new Date();

    try {
      const response = await fetch('/api/terminal', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ command: cmd, sessionId }),
      });

      const data = await response.json();

      setHistory(prev => [
        ...prev,
        {
          command: cmd,
          output: data.output || data.error || 'Command executed',
          timestamp,
          error: !response.ok || data.error,
        },
      ]);

      if (data.cwd) {
        setCurrentDirectory(data.cwd);
      }
    } catch (error) {
      setHistory(prev => [
        ...prev,
        {
          command: cmd,
          output: `Error: $${'{'}error instanceof Error ? error.message : 'Unknown error'${'}'}`

,
          timestamp,
          error: true,
        },
      ]);
    } finally {
      setLoading(false);
      setCurrentCommand('');
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (currentCommand.trim()) {
      executeCommand(currentCommand);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'l' && e.ctrlKey) {
      e.preventDefault();
      setHistory([]);
    }
  };

  const formatTimestamp = (date: Date) => {
    return date.toLocaleTimeString('zh-CN', { 
      hour: '2-digit', 
      minute: '2-digit', 
      second: '2-digit' 
    });
  };

  return (
    <div className="min-h-screen bg-gray-900 p-4">
      <div className="max-w-6xl mx-auto">
        <Card className="bg-gray-800 border-gray-700 shadow-2xl">
          <CardContent className="p-0">
            <div className="bg-gray-700 px-4 py-2 border-b border-gray-600 flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <div className="flex space-x-2">
                  <div className="w-3 h-3 rounded-full bg-red-500"></div>
                  <div className="w-3 h-3 rounded-full bg-yellow-500"></div>
                  <div className="w-3 h-3 rounded-full bg-green-500"></div>
                </div>
                <span className="text-gray-300 text-sm ml-4">Web Terminal</span>
              </div>
              <div className="flex items-center space-x-4">
                <span className="text-gray-400 text-xs">{currentDirectory}</span>
                <button
                  onClick={() => setHistory([])}
                  className="text-gray-400 hover:text-gray-200 text-xs px-2 py-1 rounded hover:bg-gray-600 transition-colors"
                >
                  Clear (Ctrl+L)
                </button>
              </div>
            </div>

            <div className="bg-gray-900 p-4 font-mono text-sm h-[600px] overflow-y-auto">
              {history.length === 0 && (
                <div className="text-green-400 mb-4">
                  <p>Welcome to TradeCraft Web Terminal</p>
                  <p className="text-gray-500 mt-2">Type commands below. Press Ctrl+L to clear.</p>
                  <p className="text-gray-500">Current directory: {currentDirectory}</p>
                </div>
              )}

              {history.map((item, index) => (
                <div key={index} className="mb-4">
                  <div className="flex items-center text-gray-400 text-xs mb-1">
                    <span>{formatTimestamp(item.timestamp)}</span>
                  </div>
                  <div className="flex items-start">
                    <span className="text-green-400 mr-2">$</span>
                    <span className="text-gray-100">{item.command}</span>
                  </div>
                  {item.output && (
                    <pre
                      className={`mt-1 whitespace-pre-wrap break-words $${'{'}
                        item.error ? 'text-red-400' : 'text-gray-300'
                      ${'}'}`}
                    >
                      {item.output}
                    </pre>
                  )}
                </div>
              ))}

              {loading && (
                <div className="flex items-center text-yellow-400">
                  <span className="mr-2">⟳</span>
                  <span>Executing...</span>
                </div>
              )}

              <form onSubmit={handleSubmit} className="flex items-center">
                <span className="text-green-400 mr-2">$</span>
                <input
                  ref={inputRef}
                  type="text"
                  value={currentCommand}
                  onChange={(e) => setCurrentCommand(e.target.value)}
                  onKeyDown={handleKeyDown}
                  disabled={loading}
                  className="flex-1 bg-transparent text-gray-100 outline-none border-none"
                  placeholder="Enter command..."
                  autoComplete="off"
                  spellCheck="false"
                />
              </form>

              <div ref={terminalEndRef} />
            </div>

            <div className="bg-gray-700 px-4 py-2 border-t border-gray-600 flex items-center justify-between text-xs text-gray-400">
              <div>
                Commands: ls, cd, pwd, cat, echo, etc.
              </div>
              <div>
                Press Enter to execute | Ctrl+L to clear
              </div>
            </div>
          </CardContent>
        </Card>

        <div className="mt-4 text-gray-400 text-sm">
          <h3 className="font-semibold mb-2">Available Commands:</h3>
          <ul className="list-disc list-inside space-y-1 text-xs">
            <li><code className="bg-gray-800 px-1 py-0.5 rounded">ls [path]</code> - List directory contents</li>
            <li><code className="bg-gray-800 px-1 py-0.5 rounded">cd [path]</code> - Change directory</li>
            <li><code className="bg-gray-800 px-1 py-0.5 rounded">pwd</code> - Print working directory</li>
            <li><code className="bg-gray-800 px-1 py-0.5 rounded">cat [file]</code> - Display file contents</li>
            <li><code className="bg-gray-800 px-1 py-0.5 rounded">echo [text]</code> - Print text</li>
            <li><code className="bg-gray-800 px-1 py-0.5 rounded">npm run dev</code> - Start development server</li>
            <li><code className="bg-gray-800 px-1 py-0.5 rounded">git status</code> - Check git status</li>
          </ul>
        </div>
      </div>
    </div>
  );
}
