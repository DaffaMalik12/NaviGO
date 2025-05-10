import { useState, useEffect, useRef } from 'react';
import MapContainer from './Map/MapContainer';
import ControlPanel from './UI/ControlPanel';
import BuildingInfo from './UI/BuildingInfo';
import useGeolocation from '../../hooks/useGeolocation';
import { geocodeAddress } from '../../service/GeocodeService';
import RouteNotification from './UI/RouteNotification';
import { getAlternativeRoutes } from '../../service/RouteService'; // sesuaikan path-nya
import { UIN_COORDS } from '../../utils/mapUtils';

export default function CampusMap() {
  const [startPoint, setStartPoint] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [userLocation, setUserLocation] = useState(null);
  const [selectedBuilding, setSelectedBuilding] = useState(null);
  const [showControlPanel, setShowControlPanel] = useState(true);
  const [activeTab, setActiveTab] = useState('navigation');
  const [searchTerm, setSearchTerm] = useState('');
  const [recentSearches, setRecentSearches] = useState([]);
  const [showHistory, setShowHistory] = useState(false);
  const [alternativeRoutes, setAlternativeRoutes] = useState([]);
  const [selectedFilter, setSelectedFilter] = useState('all');
  const [showRouteNotification, setShowRouteNotification] = useState(false);
  const mapRef = useRef(null);
  
  // Hook for geolocation
  const { 
    watchId, 
    toggleLiveLocation, 
    stopLocationWatch 
  } = useGeolocation(setUserLocation, setIsLoading);

  // Handle route search
  const handleRouteSearch = async () => {
    if (!startPoint.trim()) {
      alert('Masukkan lokasi awal terlebih dahulu!');
      return;
    }

    setIsLoading(true);
    
    // Add to recent searches
    if (!recentSearches.includes(startPoint)) {
      setRecentSearches(prev => [startPoint, ...prev].slice(0, 5));
    }
    
    const coordinates = await geocodeAddress(startPoint);
    
    if (coordinates) {
      setUserLocation(coordinates);
    } else {
      alert('Lokasi tidak ditemukan. Mencoba dengan lokasi acak dekat kampus.');
      const randomLat = UIN_COORDS[0] + (Math.random() - 0.5) * 0.02;
      const randomLng = UIN_COORDS[1] + (Math.random() - 0.5) * 0.02;
      setUserLocation([randomLat, randomLng]);
    }
    setIsLoading(false);
    setShowHistory(false);
  };

  // Handle reset
  const handleReset = () => {
    setUserLocation(null);
    setStartPoint('');
    stopLocationWatch();
    if (mapRef.current) {
      mapRef.current.setView(UIN_COORDS, 15);
    }
  };
  
  // Handle popular location click
  const handlePopularLocationClick = (position, name) => {
    setUserLocation(position);
    setStartPoint(name);
  };

  // Toggle control panel visibility
  const toggleControlPanel = () => {
    setShowControlPanel(!showControlPanel);
  };
  
  // Effect to ensure control panel is always visible when component mounts
  useEffect(() => {
    setShowControlPanel(true);
  }, []);

  // Handle building selection
  const handleBuildingSelect = (building) => {
    setSelectedBuilding(building);
    setShowRouteNotification(true)
    if (mapRef.current) {
      mapRef.current.setView(building.position, 18);
    }
    if (window.innerWidth < 768) {
      setShowControlPanel(false);
    }
  };

  

  return (
    <div className="relative h-screen w-full bg-gray-50">
      {/* Map Container */}
      <MapContainer 
        mapRef={mapRef}
        userLocation={userLocation}
        selectedBuilding={selectedBuilding}
        searchTerm={searchTerm}
        selectedFilter={selectedFilter}
      />
      
      {/* Control Panel */}
      <ControlPanel
        showControlPanel={showControlPanel}
        toggleControlPanel={toggleControlPanel}
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        startPoint={startPoint}
        setStartPoint={setStartPoint}
        searchTerm={searchTerm}
        setSearchTerm={setSearchTerm}
        selectedFilter={selectedFilter}
        setSelectedFilter={setSelectedFilter}
        recentSearches={recentSearches}
        setRecentSearches={setRecentSearches}
        showHistory={showHistory}
        setShowHistory={setShowHistory}
        handleRouteSearch={handleRouteSearch}
        handleReset={handleReset}
        isLoading={isLoading}
        toggleLiveLocation={toggleLiveLocation}
        watchId={watchId}
        handlePopularLocationClick={handlePopularLocationClick}
        handleBuildingSelect={handleBuildingSelect}
        mapRef={mapRef}
      />

      {/* Building Info Panel (when a building is selected) */}
      {selectedBuilding && showControlPanel && (
        <BuildingInfo 
          selectedBuilding={selectedBuilding} 
          setSelectedBuilding={setSelectedBuilding}
          userLocation={userLocation}
        />
      )}

      {/* Rute Alternatif Notification */}
      {showRouteNotification && selectedBuilding && (
        <RouteNotification 
        building={selectedBuilding}
        onShowRoute={async (building) => {
          if (!userLocation) {
            alert('Tentukan lokasi Anda terlebih dahulu.');
            return;
          }
      
          setIsLoading(true);
      
          const routes = await getAlternativeRoutes(userLocation, building.position);
      
          setAlternativeRoutes(routes); // simpan rute untuk dikirim ke MapContainer
          setIsLoading(false);
          setShowRouteNotification(false);
        }}
        onClose={() => setShowRouteNotification(false)}
      />      
      )}

    </div>
  );
}