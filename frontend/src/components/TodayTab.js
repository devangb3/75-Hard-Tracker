import React from 'react';
import { Target, Flame, Trophy, TrendingUp, Dumbbell } from 'lucide-react';
import WaterTracker from './WaterTracker';
import TaskCard from './TaskCard';
import { 
  getCompletedTasksCount, 
  getTotalTasksCount, 
  getCompletionRate, 
  getRemainingTasks 
} from '../utils/helpers';
import { TASK_ICONS, TASK_NAMES } from '../constants/tasks';

const TodayTab = ({ progress, stats, onTaskChange, onWaterIncrement }) => {
  if (!progress || !progress.tasks) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-gray-600">Loading...</div>
      </div>
    );
  }

  const completedCount = getCompletedTasksCount(progress);
  const totalCount = getTotalTasksCount(progress);
  const completionRate = getCompletionRate(progress);
  const remainingTasks = getRemainingTasks(progress);

  return (
    <div className="space-y-6">
      {/* Progress Overview */}
      <div className="bg-white rounded-xl shadow-sm p-6">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-semibold text-gray-900">Today's Progress</h2>
          <div className="flex items-center gap-2">
            <span className="text-sm text-gray-600">
              {completedCount}/{totalCount} completed
            </span>
            <div className="w-16 h-2 bg-gray-200 rounded-full overflow-hidden">
              <div 
                className="h-full bg-gradient-to-r from-blue-500 to-green-500 transition-all duration-300"
                style={{ width: `${completionRate}%` }}
              ></div>
            </div>
          </div>
        </div>

        {/* Tasks Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Water tracker special UI */}
          <WaterTracker 
            progress={progress} 
            onWaterIncrement={onWaterIncrement} 
          />
          
          {/* Other tasks */}
          {Object.entries(progress.tasks)
            .filter(([task]) => task !== 'drink_gallon_water')
            .map(([task, completed]) => (
              <TaskCard
                key={task}
                task={task}
                completed={completed}
                onClick={() => onTaskChange(task)}
              />
            ))}
        </div>
      </div>

      {/* Remaining Tasks */}
      {remainingTasks.length > 0 && (
        <div className="bg-white rounded-xl shadow-sm p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
            <Target className="text-orange-500" size={20} />
            Still to do today:
          </h3>
          <div className="space-y-2">
            {remainingTasks.map((task) => {
              const Icon = TASK_ICONS[task] || Dumbbell;
              const taskName = TASK_NAMES[task] || task;
              return (
                <div key={task} className="flex items-center gap-3 p-3 bg-orange-50 rounded-lg">
                  <div className="p-1.5 rounded bg-orange-100">
                    {React.createElement(Icon, { size: 16, className: "text-orange-600" })}
                  </div>
                  <span className="text-orange-800 font-medium">{taskName}</span>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Quick Stats */}
      {stats && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="bg-white rounded-xl shadow-sm p-6">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-blue-100 rounded-lg">
                <Flame className="text-blue-600" size={20} />
              </div>
              <div>
                <p className="text-sm text-gray-600">Current Streak</p>
                <p className="text-2xl font-bold text-gray-900">{stats.current_streak} days</p>
              </div>
            </div>
          </div>
          <div className="bg-white rounded-xl shadow-sm p-6">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-green-100 rounded-lg">
                <Trophy className="text-green-600" size={20} />
              </div>
              <div>
                <p className="text-sm text-gray-600">Completion Rate</p>
                <p className="text-2xl font-bold text-gray-900">{stats.completion_rate}%</p>
              </div>
            </div>
          </div>
          <div className="bg-white rounded-xl shadow-sm p-6">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-purple-100 rounded-lg">
                <TrendingUp className="text-purple-600" size={20} />
              </div>
              <div>
                <p className="text-sm text-gray-600">Total Days</p>
                <p className="text-2xl font-bold text-gray-900">{stats.total_days}</p>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default TodayTab; 