import React from 'react';
import { CheckCircle, Circle, Dumbbell } from 'lucide-react';
import { TASK_ICONS, TASK_NAMES } from '../constants/tasks';

const TaskCard = ({ task, completed, onClick }) => {
  const Icon = TASK_ICONS[task] || Dumbbell;
  const taskName = TASK_NAMES[task] || task;
  
  return (
    <div
      onClick={onClick}
      className={`p-4 rounded-lg border-2 cursor-pointer transition-all duration-200 ${
        completed
          ? 'border-green-200 bg-green-50'
          : 'border-gray-200 bg-white hover:border-blue-200 hover:bg-blue-50'
      }`}
    >
      <div className="flex items-center gap-3">
        <div className={`p-2 rounded-lg ${
          completed ? 'bg-green-100 text-green-600' : 'bg-gray-100 text-gray-600'
        }`}>
          <Icon size={20} />
        </div>
        <div className="flex-1">
          <p className={`font-medium ${
            completed ? 'text-green-800' : 'text-gray-900'
          }`}>
            {taskName}
          </p>
        </div>
        {completed ? (
          <CheckCircle className="text-green-600" size={24} />
        ) : (
          <Circle className="text-gray-400" size={24} />
        )}
      </div>
    </div>
  );
};

export default TaskCard; 