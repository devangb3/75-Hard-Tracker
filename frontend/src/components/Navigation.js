import React from 'react';

const Navigation = ({ activeTab, onTabChange }) => {
  return (
    <nav className="bg-white shadow-sm border-b mb-6">
      <div className="max-w-4xl mx-auto px-4">
        <div className="flex gap-6">
          <button
            className={`py-4 px-2 border-b-2 font-medium transition-colors duration-200 ${activeTab === 'today' ? 'border-blue-600 text-blue-600' : 'border-transparent text-gray-600 hover:text-blue-600'}`}
            onClick={() => onTabChange('today')}
          >
            Today
          </button>
          <button
            className={`py-4 px-2 border-b-2 font-medium transition-colors duration-200 ${activeTab === 'history' ? 'border-blue-600 text-blue-600' : 'border-transparent text-gray-600 hover:text-blue-600'}`}
            onClick={() => onTabChange('history')}
          >
            History
          </button>
          <button
            className={`py-4 px-2 border-b-2 font-medium transition-colors duration-200 ${activeTab === 'gallery' ? 'border-blue-600 text-blue-600' : 'border-transparent text-gray-600 hover:text-blue-600'}`}
            onClick={() => onTabChange('gallery')}
          >
            Gallery
          </button>
          <button
            className={`py-4 px-2 border-b-2 font-medium transition-colors duration-200 ${activeTab === 'stats' ? 'border-blue-600 text-blue-600' : 'border-transparent text-gray-600 hover:text-blue-600'}`}
            onClick={() => onTabChange('stats')}
          >
            Stats
          </button>
        </div>
      </div>
    </nav>
  );
};

export default Navigation;