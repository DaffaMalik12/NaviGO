import React from 'react';
/**
 * List of buildings with filtering
 * @param {Object} props
 * @param {Array<Object>} props.buildings - List of building objects
 * @param {Function} props.onBuildingClick - Function called when a building is clicked
 */
const BuildingsList = ({ buildings, onBuildingClick }) => {
  return (
    <div className="space-y-2 mt-2 max-h-80 overflow-y-auto pr-1">
      {buildings.length > 0 ? (
        buildings.map((building, index) => (
          <div
            key={index}
            className="p-3 border border-gray-200 rounded-lg cursor-pointer hover:border-indigo-300 hover:bg-indigo-50 transition-colors"
            onClick={() => onBuildingClick(building)}
          >
            <div className="flex items-start">
              <div className={`h-2 w-2 rounded-full mt-2 mr-2 ${
                building.type === 'academic' ? 'bg-blue-500' :
                building.type === 'facility' ? 'bg-green-500' :
                building.type === 'parking' ? 'bg-orange-500' : 'bg-red-500'
              }`} />
              <div>
                <h4 className="font-medium text-gray-800">{building.name}</h4>
                <p className="text-sm text-gray-500 mt-1">{building.info}</p>
              </div>
            </div>
          </div>
        ))
      ) : (
        <div className="text-center py-6 text-gray-500">
          <p>Tidak ada gedung yang ditemukan</p>
        </div>
      )}
    </div>
  );
};

export default BuildingsList;