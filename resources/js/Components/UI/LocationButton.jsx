import React from 'react';
import { Compass } from 'lucide-react';

/**
 * Live location tracking button
 * @param {Object} props
 * @param {boolean} props.isTracking - Whether tracking is active
 * @param {Function} props.onToggle - Function called when button is clicked
 */
const LocationButton = ({ isTracking, onToggle }) => {
  return (
    <button
      onClick={onToggle}
      className={`w-full py-3 px-4 rounded-lg shadow font-medium flex items-center justify-center ${
        isTracking 
          ? 'bg-red-500 hover:bg-red-600 text-white' 
          : 'bg-green-500 hover:bg-green-600 text-white'
      }`}
    >
      <Compass className="h-5 w-5 mr-2" />
      {isTracking ? 'Hentikan Pelacakan Lokasi' : 'Gunakan Lokasi Saya'}
    </button>
  );
};

export default LocationButton;
