  import { Search, RefreshCw, Compass, MapPin, ChevronRight, Clock } from 'lucide-react';
  import SearchBar from './searchBar';
  import { popularLocations } from '../../../data/popularLocationData';

  const NavigationTab = ({
    startPoint,
    setStartPoint,
    recentSearches,
    setRecentSearches,
    showHistory,
    setShowHistory,
    handleRouteSearch,
    handleReset,
    isLoading, // This comes from props
    watchId,
    setWatchId,           // ← Tambahkan ini
    setUserLocation, 
    toggleLiveLocation,
    handlePopularLocationClick
  }) => {
    // Remove any duplicate toggleLiveLocation function here

    return (
      <div className="space-y-4">
        <h3 className="text-lg font-semibold text-gray-800">Cari Rute ke UIN</h3>
        
        <SearchBar 
          value={startPoint}
          onChange={(value) => {
            setStartPoint(value);
            setShowHistory(true);
          }}
          onFocus={() => setShowHistory(true)}
          placeholder="Masukkan lokasi awal Anda"
          recentSearches={recentSearches}
          setRecentSearches={setRecentSearches}
          showHistory={showHistory}
          onRecentSearchClick={(search) => {
            setStartPoint(search);
            setShowHistory(false);
          }}
          icon={<Search className="h-5 w-5 text-gray-400" />}
        />
        
        <div className="grid grid-cols-2 gap-3">
          <button
            onClick={handleRouteSearch}
            className={`bg-indigo-600 hover:bg-indigo-700 text-white font-medium py-3 px-4 rounded-lg shadow transition-colors flex items-center justify-center ${isLoading ? 'opacity-70 cursor-not-allowed' : ''}`}
            disabled={isLoading}
          >
            {isLoading ? (
              <>
                <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
                <span>Mencari...</span>
              </>
            ) : (
              <>
                <Search className="h-4 w-4 mr-2" />
                <span>Cari Rute</span>
              </>
            )}
          </button>
          
          <button
            onClick={handleReset}
            className="bg-gray-200 hover:bg-gray-300 text-gray-700 font-medium py-3 px-4 rounded-lg shadow transition-colors flex items-center justify-center"
          >
            <RefreshCw className="h-4 w-4 mr-2" />
            <span>Reset</span>
          </button>
        </div>
        
        <button
          onClick={toggleLiveLocation}  // Using the prop here
          className={`w-full py-3 px-4 rounded-lg shadow font-medium flex items-center justify-center ${
            watchId 
              ? 'bg-red-500 hover:bg-red-600 text-white' 
              : 'bg-green-500 hover:bg-green-600 text-white'
          }`}
        >
          <Compass className="h-5 w-5 mr-2" />
          {watchId ? 'Hentikan Pelacakan Lokasi' : 'Gunakan Lokasi Saya'}
        </button>
        
        <div className="mt-6">
          <h4 className="font-medium text-gray-700 mb-3 flex items-center">
            <MapPin className="h-4 w-4 mr-1 text-gray-500" />
            Lokasi Populer:
          </h4>
          <div className="space-y-1 max-h-64 overflow-y-auto pr-1">
            {popularLocations.map((location, index) => (
              <div
                key={index}
                className="py-2 px-3 border border-gray-200 rounded-lg cursor-pointer hover:bg-gray-50 flex justify-between items-center transition-colors"
                onClick={() => handlePopularLocationClick(location.position, location.name)}
              >
                <span className="text-gray-700">{location.name}</span>
                <ChevronRight className="h-4 w-4 text-gray-400" />
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  };

  export default NavigationTab;