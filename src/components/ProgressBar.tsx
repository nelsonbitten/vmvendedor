import React from 'react';

interface ProgressBarProps {
  current: number;
  max: number;
  isDarkMode: boolean;
}

const ProgressBar: React.FC<ProgressBarProps> = ({ current, max, isDarkMode }) => {
  const percentage = (current / max) * 100;

  return (
    <div className="mt-2">
      <div className={`flex justify-between text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-600'} mb-1`}>
        <span>Mensagens usadas: {current} / {max}</span>
        <span>{percentage.toFixed(1)}%</span>
      </div>
      <div className={`h-2 ${isDarkMode ? 'bg-gray-800' : 'bg-gray-100'} rounded-full overflow-hidden`}>
        <div
          className={`h-full ${isDarkMode ? 'bg-teal-500' : 'bg-teal-600'} transition-all duration-300 ease-in-out`}
          style={{ width: `${percentage}%` }}
        />
      </div>
    </div>
  );
}

export default ProgressBar