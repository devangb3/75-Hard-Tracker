import React, { useState } from "react";
import Header from "./components/Header";
import Navigation from "./components/Navigation";
import TodayTab from "./components/TodayTab";
import HistoryTab from "./components/HistoryTab";
import StatsTab from "./components/StatsTab";
import LoadingSpinner from "./components/LoadingSpinner";
import GalleryTab from "./components/GalleryTab";
import { useProgress } from "./hooks/useProgress";
import { getLocalDateString } from "./utils/helpers";
import { progressPicAPI } from "./services/api";

function App() {
  const [date, setDate] = useState(getLocalDateString());
  const [activeTab, setActiveTab] = useState('today');
  const [galleryPhotos, setGalleryPhotos] = useState([]);
  const [galleryLoading, setGalleryLoading] = useState(false);

  const {
    progress,
    history,
    stats,
    loading,
    error,
    handleTaskChange,
    handleWaterIncrement
  } = useProgress(date);

  const handleDateChange = (e) => {
    setDate(e.target.value);
  };

  const handleTabChange = (tab) => {
    setActiveTab(tab);
    if (tab === 'gallery') {
      setGalleryLoading(true);
      progressPicAPI.fetchAll()
        .then(res => setGalleryPhotos(res.data))
        .finally(() => setGalleryLoading(false));
    }
  };

  if (loading) {
    return <LoadingSpinner />;
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-red-600">Error: {error}</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Header date={date} onDateChange={handleDateChange} />
      <Navigation activeTab={activeTab} onTabChange={handleTabChange} />

      <div className="max-w-4xl mx-auto px-4 pb-8">
        {activeTab === 'today' && (
          <TodayTab
            progress={progress}
            stats={stats}
            onTaskChange={handleTaskChange}
            onWaterIncrement={handleWaterIncrement}
          />
        )}

        {activeTab === 'history' && (
          <HistoryTab history={history} />
        )}

        {activeTab === 'gallery' && (
          <GalleryTab photos={galleryPhotos} loading={galleryLoading} />
        )}

        {activeTab === 'stats' && (
          <StatsTab stats={stats} history={history} />
        )}
      </div>
    </div>
  );
}

export default App;