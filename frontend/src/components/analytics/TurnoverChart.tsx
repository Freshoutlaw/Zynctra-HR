import React from 'react';

interface TurnoverPoint {
  month: string;
  turnover: number;
}

const data: TurnoverPoint[] = [
  { month: 'Jan', turnover: 4.1 },
  { month: 'Feb', turnover: 3.8 },
  { month: 'Mar', turnover: 4.5 },
  { month: 'Apr', turnover: 4.0 },
  { month: 'May', turnover: 3.7 },
];

const TurnoverChart: React.FC = () => {
  const max = Math.max(...data.map((item) => item.turnover));

  return (
    <section className="rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 p-6">
      <div className="mb-4 flex items-center justify-between">
        <div>
          <h3 className="text-lg font-semibold text-slate-900 dark:text-slate-100">Employee Turnover</h3>
          <p className="text-sm text-slate-500 dark:text-slate-400">Monthly turnover rate for the current fiscal quarter.</p>
        </div>
        <span className="rounded-full bg-cyan-100 px-3 py-1 text-xs font-semibold text-cyan-700 dark:bg-cyan-900/30 dark:text-cyan-200">Trend</span>
      </div>
      <div className="space-y-4">
        {data.map((item) => (
          <div key={item.month} className="space-y-2">
            <div className="flex items-center justify-between text-sm text-slate-600 dark:text-slate-300">
              <span>{item.month}</span>
              <span>{item.turnover.toFixed(1)}%</span>
            </div>
            <div className="h-3 rounded-full bg-slate-100 dark:bg-slate-800 overflow-hidden">
              <div
                className="h-full rounded-full bg-cyan-500 transition-all"
                style={{ width: `${(item.turnover / max) * 100}%` }}
              />
            </div>
          </div>
        ))}
      </div>
    </section>
  );
};

export default TurnoverChart;
