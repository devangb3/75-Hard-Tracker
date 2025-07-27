import React, { useRef, useState, useEffect } from 'react';
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
import { progressPicAPI } from '../services/api';

const TodayTab = ({ progress, stats, onTaskChange, onWaterIncrement }) => {
  const [showCamera, setShowCamera] = useState(false);
  const [cameraLoading, setCameraLoading] = useState(false);
  const videoRef = useRef();
  const canvasRef = useRef();
  let streamRef = useRef();
  const [pendingTaskClick, setPendingTaskClick] = useState(null);

  useEffect(() => {
    if (!progress || !progress.date) return;
    progressPicAPI.fetchByDate(progress.date)
      .then(res => {
        if (res.status === 200) {
          return res.data;
        }
        if(res.status === 204) {
          return null;
        }
        throw new Error('No progress pic');
      });
  }, [progress, progress?.date]);

  const startCamera = async () => {
    setCameraLoading(true);
    setShowCamera(true);
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ video: true });
      streamRef.current = stream;
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        videoRef.current.play();
      }
    } catch (err) {
      alert('Could not access camera.');
      setShowCamera(false);
    }
    setCameraLoading(false);
  };

  const stopCamera = () => {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach(track => track.stop());
      streamRef.current = null;
    }
    setShowCamera(false);
    setPendingTaskClick(null);
  };

  const handleCaptureAndSave = async () => {
    const video = videoRef.current;
    const canvas = canvasRef.current;
    if (!video || !canvas) return;
    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;
    const ctx = canvas.getContext('2d');
    ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
    canvas.toBlob(async (blob) => {
      if (!blob || !progress || !progress.date) return;
      try {
        await progressPicAPI.upload(progress.date, blob);
        await progressPicAPI.fetchByDate(progress.date);
      } catch (e) {
        alert('Failed to upload progress pic');
      }
      stopCamera();
      if (pendingTaskClick) onTaskChange(pendingTaskClick);
    }, 'image/jpeg');
  };

  const handleTaskClick = (task) => {
    if (task === 'take_progress_pic') {
      setPendingTaskClick(task);
      startCamera();
    } else {
      onTaskChange(task);
    }
  };

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
                onClick={() => handleTaskClick(task)}
              />
            ))}
        </div>
      </div>

      {/* Camera Modal for Progress Pic */}
      {showCamera && (
        <div className="fixed inset-0 bg-black bg-opacity-70 flex flex-col items-center justify-center z-50">
          <div className="bg-white p-4 rounded-lg flex flex-col items-center">
            <video ref={videoRef} autoPlay playsInline className="w-64 h-64 object-cover rounded mb-2" />
            <canvas ref={canvasRef} style={{ display: 'none' }} />
            <div className="flex gap-4 mt-2">
              <button
                className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700"
                onClick={handleCaptureAndSave}
                disabled={cameraLoading}
              >
                Save
              </button>
              <button
                className="px-4 py-2 bg-gray-400 text-white rounded hover:bg-gray-500"
                onClick={stopCamera}
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}

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