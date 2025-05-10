import React from 'react';
import { X, Navigation } from 'lucide-react';

/**
 * Display information about a selected building
 * @param {Object} props
 * @param {Object} props.building - The selected building object
 * @param {Function} props.onClose - Function to close the building info panel
 * @param {Function} props.onNavigate - Function to navigate to the building
 * @param {boolean} props.hasUserLocation - Whether user location is available
 */
const BuildingInfo = ({ building, onClose, onNavigate, hasUserLocation }) => {
  if (!building) return null;

  return (
    <div className="absolute bottom-0 left-0 right-0 bg-white border-t border-gray-200 p-4 shadow-lg">
      <div className="flex justify-between items-start mb-2">
        <h3 className="font-bold text-lg">{building.name}</h3>
        <button 
          onClick={onClose}
          className="p-1 hover:bg-gray-100 rounded-full"
        >
          <X className="h-5 w-5 text-gray-500" />
        </button>
      </div>
      <p className="text-gray-600 mb-3">{building.info}</p>
      <button
        onClick={() => {
          if (hasUserLocation) {
            onNavigate(building);
          } else {
            alert('Silakan tentukan lokasi awal Anda terlebih dahulu');
          }
        }}
        className="w-full bg-indigo-600 hover:bg-indigo-700 text-white py-2 px-4 rounded-lg font-medium"
      >
        <Navigation className="h-4 w-4 inline mr-2" />
        Cari Rute ke Sini
      </button>
    </div>
  );
};

export default BuildingInfo;