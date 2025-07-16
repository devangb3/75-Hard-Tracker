import { WATER_GOAL_ML } from '../constants/tasks';

export const formatDate = (dateString) => {
  if (typeof dateString === 'string' && dateString.match(/^\d{4}-\d{2}-\d{2}$/)) {
    const [year, month, day] = dateString.split('-');
    const date = new Date(parseInt(year), parseInt(month) - 1, parseInt(day));
    return date.toLocaleDateString('en-US', { 
      weekday: 'short', 
      month: 'short', 
      day: 'numeric' 
    });
  }
  
  const date = new Date(dateString);
  return date.toLocaleDateString('en-US', { 
    weekday: 'short', 
    month: 'short', 
    day: 'numeric' 
  });
};

export const getLocalDateString = () => {
  return new Date().toLocaleDateString('en-CA');
};

export const getCompletedTasksCount = (progress) => {
  if (!progress || !progress.tasks) return 0;
  return Object.values(progress.tasks).filter(Boolean).length;
};

export const getTotalTasksCount = (progress) => {
  if (!progress || !progress.tasks) return 0;
  return Object.keys(progress.tasks).length;
};

export const getCompletionRate = (progress) => {
  if (!progress || !progress.tasks) return 0;
  const completed = getCompletedTasksCount(progress);
  const total = getTotalTasksCount(progress);
  return Math.round((completed / total) * 100);
};

export const getRemainingTasks = (progress) => {
  if (!progress || !progress.tasks) return [];
  return Object.entries(progress.tasks)
    .filter(([_, completed]) => !completed)
    .map(([task, _]) => task);
};

export const isWaterComplete = (progress) => {
  return (progress?.tasks?.drink_gallon_water || 0) >= WATER_GOAL_ML;
};

export const getWaterProgress = (progress) => {
  const current = progress?.tasks?.drink_gallon_water || 0;
  return Math.min((current / WATER_GOAL_ML) * 100, 100);
};