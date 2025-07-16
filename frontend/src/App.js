import React, { useState, useEffect, useCallback } from "react";
import axios from "axios";
import { 
  Calendar, 
  CheckCircle, 
  Circle, 
  TrendingUp, 
  Target, 
  History, 
  BarChart3,
  Trophy,
  Flame,
  Droplet,
  Dumbbell,
  BookOpen,
  Snowflake,
  Apple,
  X,
  Camera
} from "lucide-react";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

function App() {
  const [progress, setProgress] = useState(null);
  const [history, setHistory] = useState([]);
  const [stats, setStats] = useState(null);
  const [date, setDate] = useState(new Date().toISOString().slice(0, 10));
  const [activeTab, setActiveTab] = useState('today');
  const [loading, setLoading] = useState(true);

  const taskIcons = {
    drink_gallon_water: Droplet,
    two_workouts: Dumbbell,
    read_ten_pages: BookOpen,
    five_min_cold_shower: Snowflake,
    follow_diet: Apple,
    no_alcohol_or_cheat_meals: X,
    take_progress_pic: Camera
  };

  const taskNames = {
    drink_gallon_water: "Drink 1 Gallon Water",
    two_workouts: "Two 45-Min Workouts",
    read_ten_pages: "Read 10 Pages",
    five_min_cold_shower: "5-Min Cold Shower",
    follow_diet: "Follow Diet",
    no_alcohol_or_cheat_meals: "No Alcohol/Cheat Meals",
    take_progress_pic: "Take Progress Picture"
  };

  const fetchData = useCallback(async () => {
    setLoading(true);
    try {
      const [progressRes, historyRes, statsRes] = await Promise.all([
        axios.get(`http://localhost:8917/progress/${date}`),
        axios.get('http://localhost:8917/progress/history'),
        axios.get('http://localhost:8917/progress/stats')
      ]);
      
      setProgress(progressRes.data);
      setHistory(historyRes.data);
      setStats(statsRes.data);
    } catch (error) {
      console.error("Error fetching data:", error);
    } finally {
      setLoading(false);
    }
  }, [date]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const handleDateChange = (e) => {
    setDate(e.target.value);
  };

  const handleTaskChange = async (task) => {
    const newTasks = { ...progress.tasks, [task]: !progress.tasks[task] };
    try {
      await axios.put(`http://localhost:8917/progress/${date}`, {
        tasks: newTasks,
      });
      setProgress({ ...progress, tasks: newTasks });
      const statsRes = await axios.get('http://localhost:8917/progress/stats');
      setStats(statsRes.data);
    } catch (error) {
      console.error("Error updating progress:", error);
    }
  };

  // Add water increment handler
  const handleWaterIncrement = async (amount) => {
    if (!progress) return;
    const current = progress.tasks.drink_gallon_water || 0;
    if (current >= 3785) return;
    try {
      const res = await axios.post(`http://localhost:8917/progress/${date}/water`, { amount });
      const newWater = res.data.water;
      setProgress({
        ...progress,
        tasks: {
          ...progress.tasks,
          drink_gallon_water: newWater
        }
      });
      const statsRes = await axios.get('http://localhost:8917/progress/stats');
      setStats(statsRes.data);
    } catch (error) {
      console.error("Error incrementing water:", error);
    }
  };

  // Helper for water completion
  const isWaterComplete = () => (progress?.tasks?.drink_gallon_water || 0) >= 3785;

  const getCompletedTasksCount = () => {
    if (!progress || !progress.tasks) return 0;
    return Object.values(progress.tasks).filter(Boolean).length;
  };

  const getTotalTasksCount = () => {
    if (!progress || !progress.tasks) return 0;
    return Object.keys(progress.tasks).length;
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { 
      weekday: 'short', 
      month: 'short', 
      day: 'numeric' 
    });
  };

  const getCompletionRate = () => {
    if (!progress || !progress.tasks) return 0;
    return Math.round((getCompletedTasksCount() / getTotalTasksCount()) * 100);
  };

  const getRemainingTasks = () => {
    if (!progress || !progress.tasks) return [];
    return Object.entries(progress.tasks)
      .filter(([_, completed]) => !completed)
      .map(([task, _]) => task);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  // Don't render main content if progress is still null
  if (!progress || !progress.tasks) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-gray-600">Loading...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
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
                  onChange={handleDateChange}
                  className="bg-transparent border-none text-blue-600 font-medium focus:outline-none"
                />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Navigation Tabs */}
      <div className="max-w-4xl mx-auto px-4 py-4">
        <div className="flex space-x-1 bg-white p-1 rounded-lg shadow-sm">
          <button
            onClick={() => setActiveTab('today')}
            className={`flex-1 py-2 px-4 rounded-md font-medium transition-colors ${
              activeTab === 'today'
                ? 'bg-blue-600 text-white'
                : 'text-gray-600 hover:text-gray-900'
            }`}
          >
            Today
          </button>
          <button
            onClick={() => setActiveTab('history')}
            className={`flex-1 py-2 px-4 rounded-md font-medium transition-colors ${
              activeTab === 'history'
                ? 'bg-blue-600 text-white'
                : 'text-gray-600 hover:text-gray-900'
            }`}
          >
            History
          </button>
          <button
            onClick={() => setActiveTab('stats')}
            className={`flex-1 py-2 px-4 rounded-md font-medium transition-colors ${
              activeTab === 'stats'
                ? 'bg-blue-600 text-white'
                : 'text-gray-600 hover:text-gray-900'
            }`}
          >
            Stats
          </button>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-4xl mx-auto px-4 pb-8">
        {activeTab === 'today' && (
          <div className="space-y-6">
            {/* Progress Overview */}
            <div className="bg-white rounded-xl shadow-sm p-6">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-xl font-semibold text-gray-900">Today's Progress</h2>
                <div className="flex items-center gap-2">
                  <span className="text-sm text-gray-600">
                    {getCompletedTasksCount()}/{getTotalTasksCount()} completed
                  </span>
                  <div className="w-16 h-2 bg-gray-200 rounded-full overflow-hidden">
                    <div 
                      className="h-full bg-gradient-to-r from-blue-500 to-green-500 transition-all duration-300"
                      style={{ width: `${getCompletionRate()}%` }}
                    ></div>
                  </div>
                </div>
              </div>

              {/* Tasks Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* Water tracker special UI */}
                <div
                  className={`p-4 rounded-lg border-2 transition-all duration-200 cursor-default ${
                    isWaterComplete()
                      ? 'border-green-200 bg-green-50'
                      : 'border-blue-100 bg-blue-50'
                  }`}
                >
                  <div className="flex items-center gap-3 mb-2">
                    <div className={`p-2 rounded-lg ${
                      isWaterComplete() ? 'bg-green-100 text-green-600' : 'bg-blue-100 text-blue-600'
                    }`}>
                      <Droplet size={20} />
                    </div>
                    <div className="flex-1">
                      <p className={`font-medium ${
                        isWaterComplete() ? 'text-green-800' : 'text-gray-900'
                      }`}>
                        Drink 1 Gallon Water
                      </p>
                    </div>
                    {isWaterComplete() ? (
                      <CheckCircle className="text-green-600" size={24} />
                    ) : (
                      <Circle className="text-blue-400" size={24} />
                    )}
                  </div>
                  <div className="flex items-center gap-2 mb-2">
                    <div className="flex gap-2">
                      <button
                        className="px-3 py-1 bg-blue-500 text-white rounded hover:bg-blue-600 disabled:opacity-50"
                        onClick={() => handleWaterIncrement(250)}
                        disabled={((progress?.tasks?.drink_gallon_water || 0) + 250) > 3785}
                      >
                        +250ml
                      </button>
                      <button
                        className="px-3 py-1 bg-blue-500 text-white rounded hover:bg-blue-600 disabled:opacity-50"
                        onClick={() => handleWaterIncrement(500)}
                        disabled={((progress?.tasks?.drink_gallon_water || 0) + 500) > 3785}
                      >
                        +500ml
                      </button>
                      <button
                        className="px-3 py-1 bg-blue-500 text-white rounded hover:bg-blue-600 disabled:opacity-50"
                        onClick={() => handleWaterIncrement(1000)}
                        disabled={((progress?.tasks?.drink_gallon_water || 0) + 1000) > 3785}
                      >
                        +1000ml
                      </button>
                    </div>
                    <span className="ml-4 text-blue-700 font-semibold">
                      {progress?.tasks?.drink_gallon_water || 0} / 3785ml
                    </span>
                  </div>
                  <div className="w-full h-2 bg-blue-100 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-blue-500 transition-all duration-300"
                      style={{ width: `${Math.min(((progress?.tasks?.drink_gallon_water || 0) / 3785) * 100, 100)}%` }}
                    ></div>
                  </div>
                </div>
                {/* Other tasks */}
                {Object.entries(progress.tasks)
                  .filter(([task]) => task !== 'drink_gallon_water')
                  .map(([task, completed]) => {
                    const Icon = taskIcons[task];
                    return (
                      <div
                        key={task}
                        onClick={() => handleTaskChange(task)}
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
                              {taskNames[task]}
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
                  })}
              </div>
            </div>

            {/* Remaining Tasks */}
            {getRemainingTasks().length > 0 && (
              <div className="bg-white rounded-xl shadow-sm p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
                  <Target className="text-orange-500" size={20} />
                  Still to do today:
                </h3>
                <div className="space-y-2">
                  {getRemainingTasks().map((task) => (
                    <div key={task} className="flex items-center gap-3 p-3 bg-orange-50 rounded-lg">
                      <div className="p-1.5 rounded bg-orange-100">
                        {React.createElement(taskIcons[task], { size: 16, className: "text-orange-600" })}
                      </div>
                      <span className="text-orange-800 font-medium">{taskNames[task]}</span>
                    </div>
                  ))}
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
        )}

        {activeTab === 'history' && (
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
        )}

        {activeTab === 'stats' && stats && (
          <div className="space-y-6">
            {/* Overall Stats */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              <div className="bg-white rounded-xl shadow-sm p-6">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-blue-100 rounded-lg">
                    <Target className="text-blue-600" size={20} />
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Total Days</p>
                    <p className="text-2xl font-bold text-gray-900">{stats.total_days}</p>
                  </div>
                </div>
              </div>
              <div className="bg-white rounded-xl shadow-sm p-6">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-green-100 rounded-lg">
                    <CheckCircle className="text-green-600" size={20} />
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Completed Days</p>
                    <p className="text-2xl font-bold text-gray-900">{stats.completed_days}</p>
                  </div>
                </div>
              </div>
              <div className="bg-white rounded-xl shadow-sm p-6">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-orange-100 rounded-lg">
                    <Flame className="text-orange-600" size={20} />
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Current Streak</p>
                    <p className="text-2xl font-bold text-gray-900">{stats.current_streak}</p>
                  </div>
                </div>
              </div>
              <div className="bg-white rounded-xl shadow-sm p-6">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-purple-100 rounded-lg">
                    <Trophy className="text-purple-600" size={20} />
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Longest Streak</p>
                    <p className="text-2xl font-bold text-gray-900">{stats.longest_streak}</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Task Performance */}
            <div className="bg-white rounded-xl shadow-sm p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-6 flex items-center gap-2">
                <BarChart3 className="text-blue-600" size={20} />
                Task Performance
              </h3>
              <div className="space-y-4">
                {Object.entries(stats.task_stats).map(([taskKey, taskStat]) => {
                  const Icon = taskIcons[taskKey];
                  return (
                    <div key={taskKey} className="flex items-center gap-4">
                      <div className="p-2 bg-gray-100 rounded-lg">
                        <Icon size={20} className="text-gray-600" />
                      </div>
                      <div className="flex-1">
                        <div className="flex justify-between items-center mb-1">
                          <span className="font-medium text-gray-900">{taskStat.name}</span>
                          <span className="text-sm text-gray-600">{taskStat.percentage}%</span>
                        </div>
                        <div className="w-full h-2 bg-gray-200 rounded-full overflow-hidden">
                          <div 
                            className="h-full bg-gradient-to-r from-blue-500 to-green-500 transition-all duration-300"
                            style={{ width: `${taskStat.percentage}%` }}
                          ></div>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Progress Chart */}
            {history.length > 0 && (
              <div className="bg-white rounded-xl shadow-sm p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-6">Progress Over Time</h3>
                <div className="h-64">
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={history.slice(-14).reverse()}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis 
                        dataKey="date" 
                        tickFormatter={(value) => formatDate(value)}
                        fontSize={12}
                      />
                      <YAxis domain={[0, 7]} />
                      <Tooltip 
                        labelFormatter={(value) => formatDate(value)}
                        formatter={(value) => [`${value}/7 tasks`, 'Completed']}
                      />
                      <Line 
                        type="monotone" 
                        dataKey={(data) => Object.values(data.tasks).filter(Boolean).length}
                        stroke="#3b82f6" 
                        strokeWidth={3}
                        dot={{ fill: '#3b82f6', strokeWidth: 2, r: 4 }}
                      />
                    </LineChart>
                  </ResponsiveContainer>
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

export default App;