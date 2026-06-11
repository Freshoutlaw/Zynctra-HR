import React from 'react';

export interface TerminalInputProps {
  value: string;
  placeholder?: string;
  disabled?: boolean;
  onChange: (value: string) => void;
  onSubmit: (value: string) => void;
}

const TerminalInput: React.FC<TerminalInputProps> = ({
  value,
  placeholder = 'Enter command...',
  disabled = false,
  onChange,
  onSubmit,
}) => {
  const handleKeyDown = (event: React.KeyboardEvent<HTMLInputElement>) => {
    if (event.key === 'Enter') {
      event.preventDefault();
      onSubmit(value);
    }
  };

  return (
    <div className="flex items-center gap-3 rounded-3xl border border-slate-300 bg-slate-50 p-3 dark:border-slate-700 dark:bg-slate-800">
      <span className="text-sm font-semibold text-slate-600 dark:text-slate-300">$</span>
      <input
        type="text"
        className="flex-1 bg-transparent text-sm text-slate-900 outline-none placeholder:text-slate-400 dark:text-slate-100 dark:placeholder:text-slate-500"
        value={value}
        placeholder={placeholder}
        disabled={disabled}
        onChange={(event) => onChange(event.target.value)}
        onKeyDown={handleKeyDown}
      />
    </div>
  );
};

export default TerminalInput;
