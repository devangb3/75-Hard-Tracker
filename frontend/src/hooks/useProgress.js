import { useState, useEffect, useCallback } from 'react';
import { progressAPI } from '../services/api';

export const useProgress = (date) => {
  const [progress, setProgress] = useState(null);
  const [history, setHistory] = useState([]);
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchData = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const [progressRes, historyRes, statsRes] = await Promise.all([
        progressAPI.getByDate(date),
        progressAPI.getHistory(),
        progressAPI.getStats()
      ]);
      
      setProgress(progressRes.data);
      setHistory(historyRes.data);
      setStats(statsRes.data);
    } catch (err) {
      console.error("Error fetching data:", err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, [date]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const handleTaskChange = async (task) => {
    if (!progress) return;
    
    const newTasks = { ...progress.tasks, [task]: !progress.tasks[task] };
    try {
      await progressAPI.update(date, newTasks);
      setProgress({ ...progress, tasks: newTasks });
      
      // Refresh stats after task change
      const statsRes = await progressAPI.getStats();
      setStats(statsRes.data);
    } catch (err) {
      console.error("Error updating progress:", err);
      setError(err.message);
    }
  };

  const handleWaterIncrement = async (amount) => {
    if (!progress) return;
    
    const current = progress.tasks.drink_gallon_water || 0;
    if (current >= 3785) return;
    
    try {
      const res = await progressAPI.incrementWater(date, amount);
      const newWater = res.data.water;
      setProgress({
        ...progress,
        tasks: {
          ...progress.tasks,
          drink_gallon_water: newWater
        }
      });
      
      // Refresh stats after water increment
      const statsRes = await progressAPI.getStats();
      setStats(statsRes.data);
    } catch (err) {
      console.error("Error incrementing water:", err);
      setError(err.message);
    }
  };

  const refreshData = () => {
    fetchData();
  };

  return {
    progress,
    history,
    stats,
    loading,
    error,
    handleTaskChange,
    handleWaterIncrement,
    refreshData
  };
}; 