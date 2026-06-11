import React from 'react';

export interface ToastProps {
  title?: string;
  message: string;
  type?: 'success' | 'error' | 'warning' | 'info';
  onClose?: () => void;
}

const toneClasses: Record<NonNullable<ToastProps['type']>, string> = {
  success: 'bg-emerald-50 border-emerald-200 text-emerald-900',
  error: 'bg-rose-50 border-rose-200 text-rose-900',
  warning: 'bg-amber-50 border-amber-200 text-amber-900',
  info: 'bg-cyan-50 border-cyan-200 text-cyan-900',
};

const Toast: React.FC<ToastProps> = ({
  title,
  message,
  type = 'info',
  onClose,
}) => (
  <div className={`rounded-2xl border p-4 shadow-sm transition ${toneClasses[type]}`}>
    <div className="flex items-start justify-between gap-4">
      <div>
        {title ? <p className="font-semibold">{title}</p> : null}
        <p className="mt-1 text-sm leading-6">{message}</p>
      </div>
      {onClose ? (
        <button
          type="button"
          aria-label="Dismiss toast"
          onClick={onClose}
          className="rounded-full p-2 text-sm font-semibold transition hover:bg-slate-100 dark:hover:bg-slate-800"
        >
          ×
        </button>
      ) : null}
    </div>
  </div>
);

export default Toast;
