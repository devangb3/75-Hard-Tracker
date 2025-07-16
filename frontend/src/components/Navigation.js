import React from 'react';

const Navigation = ({ activeTab, onTabChange }) => {
  const tabs = [
    { id: 'today', label: 'Today' },
    { id: 'history', label: 'History' },
    { id: 'stats', label: 'Stats' }
  ];

  return (
    <div className="max-w-4xl mx-auto px-4 py-4">
      <div className="flex space-x-1 bg-white p-1 rounded-lg shadow-sm">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => onTabChange(tab.id)}
            className={`flex-1 py-2 px-4 rounded-md font-medium transition-colors ${
              activeTab === tab.id
                ? 'bg-blue-600 text-white'
                : 'text-gray-600 hover:text-gray-900'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>
    </div>
  );
};

export default Navigation;