/**
 * /frontend/src/components/ui/Table.tsx
 * Table component for displaying structured data
 */

import React from 'react';

interface TableProps {
  headers: string[];
  rows: (string | number | React.ReactNode)[][];
  striped?: boolean;
  hover?: boolean;
  compact?: boolean;
  onRowClick?: (rowIndex: number) => void;
}

export const Table: React.FC<TableProps> = ({
  headers,
  rows,
  striped = true,
  hover = true,
  compact = false,
}) => {
  return (
    <div className="w-full overflow-x-auto bg-white dark:bg-slate-800 rounded-lg border border-slate-200 dark:border-slate-700">
      <table className="w-full">
        <thead className="bg-slate-100 dark:bg-slate-700 border-b border-slate-200 dark:border-slate-600">
          <tr>
            {headers.map((header, idx) => (
              <th
                key={idx}
                className={`text-left font-semibold ${
                  compact ? 'px-3 py-2 text-xs' : 'px-6 py-3 text-sm'
                }`}
              >
                {header}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {rows.map((row, rowIdx) => (
            <tr
              key={rowIdx}
              className={`border-b border-slate-200 dark:border-slate-700 ${
                striped && rowIdx % 2 === 1
                  ? 'bg-slate-50 dark:bg-slate-800/50'
                  : ''
              } ${hover ? 'hover:bg-slate-50 dark:hover:bg-slate-700/50' : ''} transition-colors`}
            >
              {row.map((cell, cellIdx) => (
                <td
                  key={cellIdx}
                  className={`${compact ? 'px-3 py-2 text-xs' : 'px-6 py-3 text-sm'}`}
                >
                  {cell}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default Table;