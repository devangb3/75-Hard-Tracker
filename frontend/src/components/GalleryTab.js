import React from 'react';
import LoadingSpinner from './LoadingSpinner';
import { formatDate } from '../utils/helpers';

const GalleryTab = ({ photos, loading }) => {
  if (loading) return <LoadingSpinner />;
  if (!photos || photos.length === 0) {
    return (
      <div className="bg-white rounded-xl shadow-sm p-6 text-center text-gray-500">
        No progress photos yet.
      </div>
    );
  }
  return (
    <div className="space-y-6">
      <div className="bg-white rounded-xl shadow-sm p-6">
        <h2 className="text-xl font-semibold text-gray-900 mb-6">Progress Photo Gallery</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
          {photos.map(photo => (
            <div key={photo.date} className="flex flex-col items-center">
              <img
                src={photo.image_url}
                alt={`Progress for ${photo.date}`}
                className="w-40 h-40 object-cover rounded-lg border-2 border-blue-400 mb-2"
              />
              <span className="text-sm text-gray-700">{formatDate(photo.date)}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default GalleryTab; 