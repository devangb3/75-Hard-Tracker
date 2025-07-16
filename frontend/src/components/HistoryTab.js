import React from 'react';
import { History, CheckCircle, Circle } from 'lucide-react';
import { formatDate } from '../utils/helpers';

const HistoryTab = ({ history }) => {
  return (
    <div className="space-y-6">
      <div className="bg-white rounded-xl shadow-sm p-6">
        <h2 className="text-xl font-semibold text-gray-900 mb-6 flex items-center gap-2">
          <History className="text-blue-600" size={24} />
          Recent History
        </h2>
        <div className="space-y-3 max-h-96 overflow-y-auto">
          {history.map((day) => {
            const completedCount = Object.values(day.tasks).filter(Boolean).length;
            const totalCount = Object.keys(day.tasks).length;
            const isComplete = completedCount === totalCount;
            
            return (
              <div
                key={day.date}
                className={`p-4 rounded-lg border-2 ${
                  isComplete ? 'border-green-200 bg-green-50' : 'border-gray-200 bg-white'
                }`}
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className={`p-2 rounded-lg ${
                      isComplete ? 'bg-green-100 text-green-600' : 'bg-gray-100 text-gray-600'
                    }`}>
                      {isComplete ? <CheckCircle size={20} /> : <Circle size={20} />}
                    </div>
                    <div>
                      <p className={`font-medium ${
                        isComplete ? 'text-green-800' : 'text-gray-900'
                      }`}>
                        {formatDate(day.date)}
                      </p>
                      <p className="text-sm text-gray-600">
                        {completedCount}/{totalCount} tasks completed
                      </p>
                    </div>
                  </div>
                  <div className="w-20 h-2 bg-gray-200 rounded-full overflow-hidden">
                    <div 
                      className={`h-full transition-all duration-300 ${
                        isComplete ? 'bg-green-500' : 'bg-blue-500'
                      }`}
                      style={{ width: `${(completedCount / totalCount) * 100}%` }}
                    ></div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default HistoryTab; 