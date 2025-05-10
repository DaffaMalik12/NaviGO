import React from 'react';

const RouteNotification = ({ selectedBuilding, onShowRoutes, onClose }) => {
  if (!selectedBuilding) return null;

  return (
    <div className="absolute bottom-6 left-1/2 transform -translate-x-1/2 bg-white shadow-lg p-4 rounded-xl w-11/12 md:w-1/3 z-50">
      <h4 className="font-bold text-gray-800">Rute ke {selectedBuilding.name}</h4>
      <p className="text-sm text-gray-600 mb-3">{selectedBuilding.info}</p>
      <div RouteNotificationclassName="flex justify-end space-x-2">
        <button
          onClick={onClose}
          className="px-3 py-1 bg-gray-200 text-gray-700 rounded hover:bg-gray-300"
        >
          Batal
        </button>
        <button
          onClick={() => onShowRoutes(selectedBuilding)}
          className="px-3 py-1 bg-indigo-600 text-white rounded hover:bg-indigo-700"
        >
          Tampilkan Rute Alternatif
        </button>
      </div>
    </div>
  );
};

export default RouteNotification;
