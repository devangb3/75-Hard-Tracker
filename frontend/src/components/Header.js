import React from 'react';
import { Calendar, Target } from 'lucide-react';

const Header = ({ date, onDateChange }) => {
  return (
    <div className="bg-white shadow-sm border-b">
      <div className="max-w-4xl mx-auto px-4 py-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 flex items-center gap-3">
              <Target className="text-blue-600" size={32} />
              75 Hard Tracker
            </h1>
            <p className="text-gray-600 mt-1">Stay disciplined, stay consistent</p>
          </div>
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2 bg-blue-50 px-3 py-2 rounded-lg">
              <Calendar className="text-blue-600" size={20} />
              <input
                type="date"
                value={date}
                onChange={onDateChange}
                className="bg-transparent border-none text-blue-600 font-medium focus:outline-none"
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Header;