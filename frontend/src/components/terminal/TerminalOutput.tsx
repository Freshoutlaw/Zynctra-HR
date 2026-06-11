import React from 'react';

export type TerminalLineType = 'stdout' | 'stderr' | 'info';

export interface TerminalOutputItem {
  id: string;
  timestamp: string;
  text: string;
  type?: TerminalLineType;
}

export interface TerminalOutputProps {
  lines: TerminalOutputItem[];
}

const typeMap: Record<TerminalLineType, string> = {
  stdout: 'text-slate-900 dark:text-slate-100',
  stderr: 'text-rose-600 dark:text-rose-300',
  info: 'text-slate-500 dark:text-slate-400',
};

const TerminalOutput: React.FC<TerminalOutputProps> = ({ lines }) => (
  <div className="space-y-3 overflow-y-auto px-3 py-4 text-sm leading-6 text-slate-800 dark:text-slate-200">
    {lines.length === 0 ? (
      <div className="rounded-3xl border border-dashed border-slate-300 bg-slate-50 p-6 text-center text-slate-500 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-400">
        Waiting for terminal output...
      </div>
    ) : (
      lines.map((line) => (
        <div key={line.id} className="space-y-1 rounded-2xl bg-slate-100/80 p-3 dark:bg-slate-950/70">
          <div className="flex items-center justify-between text-[11px] uppercase tracking-[0.2em] text-slate-500 dark:text-slate-500">
            <span>{line.type ?? 'stdout'}</span>
            <span>{line.timestamp}</span>
          </div>
          <pre className={`whitespace-pre-wrap break-words text-sm ${typeMap[line.type ?? 'stdout']}`}>{line.text}</pre>
        </div>
      ))
    )}
  </div>
);

export default TerminalOutput;
