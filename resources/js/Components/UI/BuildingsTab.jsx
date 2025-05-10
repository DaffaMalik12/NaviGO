import { Search } from 'lucide-react';
import FilterButtons from './FilterButton';
import { campusBuildings } from '../../../data/buildingsData';

const BuildingsTab = ({
  searchTerm,
  setSearchTerm,
  selectedFilter,
  setSelectedFilter,
  handleBuildingSelect
}) => {
  // Filter gedung berdasarkan jenis
  const filteredBuildings = selectedFilter === 'all'
    ? campusBuildings
    : campusBuildings.filter(building => building.type === selectedFilter);

  // Filter berdasarkan keyword pencarian
  const searchedBuildings = searchTerm
    ? filteredBuildings.filter(building =>
        building.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        building.info.toLowerCase().includes(searchTerm.toLowerCase()))
    : filteredBuildings;

  return (
    <div className="space-y-4">
      <h3 className="text-lg font-semibold text-gray-800">Gedung Kampus</h3>

      {/* Search Bar */}
      <div className="relative">
        <input
          type="text"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          placeholder="Cari gedung atau fasilitas"
          className="w-full p-3 pl-10 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
        />
        <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
          <Search className="h-5 w-5 text-gray-400" />
        </div>
      </div>

      {/* Filter Buttons */}
      <FilterButtons
        selectedFilter={selectedFilter}
        onFilterChange={setSelectedFilter}
      />

      {/* List Gedung */}
      <div className="space-y-2 mt-2 max-h-80 overflow-y-auto pr-1">
        {searchedBuildings.length > 0 ? (
          searchedBuildings.map((building, index) => (
            <div
              key={index}
              className="p-3 border border-gray-200 rounded-lg cursor-pointer hover:border-indigo-300 hover:bg-indigo-50 transition-colors"
              onClick={() => handleBuildingSelect(building)}
            >
              <div className="flex items-start">
                <div
                  className={`h-2 w-2 rounded-full mt-2 mr-2 ${
                    building.type === 'academic'
                      ? 'bg-blue-500'
                      : building.type === 'facility'
                      ? 'bg-green-500'
                      : building.type === 'parking'
                      ? 'bg-orange-500'
                      : building.type === 'administration'
                      ? 'bg-red-500'
                      : 'bg-gray-400'
                  }`}
                />
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
    </div>
  );
};

export default BuildingsTab;
