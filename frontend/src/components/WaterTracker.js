import React from 'react';
import { Droplet, CheckCircle, Circle } from 'lucide-react';
import { isWaterComplete, getWaterProgress } from '../utils/helpers';
import { WATER_GOAL_ML } from '../constants/tasks';

const WaterTracker = ({ progress, onWaterIncrement }) => {
  const waterComplete = isWaterComplete(progress);
  const waterProgress = getWaterProgress(progress);
  const currentWater = progress?.tasks?.drink_gallon_water || 0;

  const handleIncrement = (amount) => {
    if ((currentWater + amount) <= WATER_GOAL_ML) {
      onWaterIncrement(amount);
    }
  };

  return (
    <div
      className={`p-4 rounded-lg border-2 transition-all duration-200 cursor-default min-w-[260px] w-full ${
        waterComplete
          ? 'border-green-200 bg-green-50'
          : 'border-blue-100 bg-blue-50'
      }`}
    >
      <div className="flex items-center gap-3 mb-2">
        <div className={`p-2 rounded-lg ${
          waterComplete ? 'bg-green-100 text-green-600' : 'bg-blue-100 text-blue-600'
        }`}>
          <Droplet size={20} />
        </div>
        <div className="flex-1">
          <p className={`font-medium ${
            waterComplete ? 'text-green-800' : 'text-gray-900'
          }`}>
            Drink 1 Gallon Water
          </p>
        </div>
        {waterComplete ? (
          <CheckCircle className="text-green-600" size={24} />
        ) : (
          <Circle className="text-blue-400" size={24} />
        )}
      </div>
      <div className="flex items-center justify-between gap-2 mb-2">
        <div className="flex gap-2 flex-wrap">
          <button
            className="px-3 py-1 bg-blue-500 text-white rounded hover:bg-blue-600 disabled:opacity-50"
            onClick={() => handleIncrement(35)}
            disabled={(currentWater + 35) > WATER_GOAL_ML}
          >
            +35ml
          </button>
          <button
            className="px-3 py-1 bg-blue-500 text-white rounded hover:bg-blue-600 disabled:opacity-50"
            onClick={() => handleIncrement(250)}
            disabled={(currentWater + 250) > WATER_GOAL_ML}
          >
            +250ml
          </button>
          <button
            className="px-3 py-1 bg-blue-500 text-white rounded hover:bg-blue-600 disabled:opacity-50"
            onClick={() => handleIncrement(500)}
            disabled={(currentWater + 500) > WATER_GOAL_ML}
          >
            +500ml
          </button>
          <button
            className="px-3 py-1 bg-blue-500 text-white rounded hover:bg-blue-600 disabled:opacity-50"
            onClick={() => handleIncrement(1000)}
            disabled={(currentWater + 1000) > WATER_GOAL_ML}
          >
            +1000ml
          </button>
        </div>
        <span className="text-blue-700 font-semibold whitespace-nowrap text-sm text-right flex-shrink-0">
          {currentWater} / {WATER_GOAL_ML}ml
        </span>
      </div>
      <div className="w-full h-2 bg-blue-100 rounded-full overflow-hidden">
        <div
          className="h-full bg-blue-500 transition-all duration-300"
          style={{ width: `${waterProgress}%` }}
        ></div>
      </div>
    </div>
  );
};

export default WaterTracker;