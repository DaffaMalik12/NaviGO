// App.jsx
import { useState, useEffect, useRef } from 'react';
import { MapContainer, TileLayer, Marker, Popup, useMap } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet-routing-machine';
import 'leaflet/dist/leaflet.css';
import 'leaflet-routing-machine/dist/leaflet-routing-machine.css';

// Fix default marker icons
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
});

const UIN_COORDS = [-6.3067, 106.7562];

export default function CampusMap() {
  const [startPoint, setStartPoint] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [userLocation, setUserLocation] = useState(null);
  const [watchId, setWatchId] = useState(null);
  const [selectedBuilding, setSelectedBuilding] = useState(null);
  const [showControlPanel, setShowControlPanel] = useState(true);
  const mapRef = useRef(null);
  // Tambahkan ref untuk memastikan panel telah dimounting
  const controlPanelRef = useRef(null);

  // Campus buildings data
  const campusBuildings = [
    { name: "Fakultas Sains dan Teknologi", position: [-6.3060, 106.7572], type: "academic", info: "Fakultas teknik dan sains dengan berbagai program studi" },
    { name: "Fakultas Kedokteran", position: [-6.214577, 106.836549], type: "academic", info: "Program studi kedokteran dan ilmu kesehatan" },
    { name: "Fakultas Ekonomi dan Bisnis", position: [-6.3080, 106.7552], type: "academic", info: "Program studi ekonomi, manajemen, dan akuntansi" },
    { name: "Fakultas Syariah dan Hukum", position: [-6.3073, 106.7575], type: "academic", info: "Program studi hukum dan syariah Islam" },
    { name: "Fakultas Ilmu Tarbiyah dan Keguruan", position: [-6.3065, 106.7545], type: "academic", info: "Program studi kependidikan dan pengajaran" },
    { name: "Perpustakaan Utama", position: [-6.3068, 106.7564], type: "facility", info: "Perpustakaan pusat dengan koleksi buku lengkap" },
    { name: "Masjid UIN", position: [-6.3067, 106.7560], type: "facility", info: "Masjid pusat kampus untuk ibadah" },
    { name: "Gedung Rektorat", position: [-6.3063, 106.7566], type: "administration", info: "Kantor administrasi dan rektorat utama" },
    { name: "Auditorium Harun Nasution", position: [-6.3070, 106.7568], type: "facility", info: "Aula utama untuk kegiatan besar kampus" },
    { name: "Kantin Utama", position: [-6.3055, 106.7558], type: "facility", info: "Kantin utama dengan berbagai makanan" },
    { name: "Parkir Utara", position: [-6.3050, 106.7565], type: "parking", info: "Area parkir kendaraan utama" },
    { name: "Parkir Selatan", position: [-6.3080, 106.7550], type: "parking", info: "Area parkir alternatif" },
    { name: "Klinik Kesehatan", position: [-6.3062, 106.7555], type: "facility", info: "Layanan kesehatan untuk mahasiswa" },
  ];

  const popularLocations = [
    { name: "Stasiun MRT Bendungan Hilir", position: [-6.2908, 106.7783] },
    { name: "Stasiun Sudirman", position: [-6.2876, 106.7991] },
    { name: "Stasiun Pondok Ranji", position: [-6.3040, 106.7635] },
    { name: "Monas", position: [-6.2410, 106.7967] },
    { name: "Mall Bintaro Xchange", position: [-6.3019, 106.7500] },
    { name: "AEON Mall BSD City", position: [-6.3100, 106.7382] },
  ];

  // Custom icons
  const buildingIcons = {
    academic: new L.Icon({
      iconUrl: 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-blue.png',
      iconSize: [25, 41],
      iconAnchor: [12, 41],
    }),
    facility: new L.Icon({
      iconUrl: 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-green.png',
      iconSize: [25, 41],
      iconAnchor: [12, 41],
    }),
    parking: new L.Icon({
      iconUrl: 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-orange.png',
      iconSize: [25, 41],
      iconAnchor: [12, 41],
    }),
    administration: new L.Icon({
      iconUrl: 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-red.png',
      iconSize: [25, 41],
      iconAnchor: [12, 41],
    }),
  };

  // Routing component
  const Routing = ({ start, end }) => {
    const map = useMap();

    useEffect(() => {
      if (!start || !end) return;

      const routingControl = L.Routing.control({
        waypoints: [
          L.latLng(start[0], start[1]),
          L.latLng(end[0], end[1])
        ],
        routeWhileDragging: true,
        showAlternatives: true,
        lineOptions: {
          styles: [
            { color: 'black', opacity: 0.15, weight: 9 },
            { color: 'white', opacity: 0.8, weight: 6 },
            { color: '#2e1ced', opacity: 0.5, weight: 4 }
          ]
        },
        createMarker: (i, wp, nWps) => {
          if (i === 0) {
            return L.marker(wp.latLng, {
              draggable: true,
              icon: buildingIcons.academic
            }).bindPopup('Titik Awal (Bisa digeser)');
          }
          return null;
        }
      }).addTo(map);

      return () => map.removeControl(routingControl);
    }, [start, end, map]);

    return null;
  };

  // Geocode address using Nominatim
  const geocodeAddress = async (address) => {
    try {
      const query = encodeURIComponent(address + ', Jakarta, Indonesia');
      const response = await fetch(`https://nominatim.openstreetmap.org/search?format=json&q=${query}&limit=1`);
      const data = await response.json();
      
      if (data && data.length > 0) {
        return [parseFloat(data[0].lat), parseFloat(data[0].lon)];
      }
      throw new Error('Lokasi tidak ditemukan');
    } catch (error) {
      console.error('Error during geocoding:', error);
      return null;
    }
  };

  // Handle route search
  const handleRouteSearch = async () => {
    if (!startPoint.trim()) {
      alert('Masukkan lokasi awal terlebih dahulu!');
      return;
    }

    setIsLoading(true);
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
  };

  // Handle reset
  const handleReset = () => {
    setUserLocation(null);
    setStartPoint('');
    if (mapRef.current) {
      mapRef.current.setView(UIN_COORDS, 15);
    }
  };
  
  // Effect untuk memastikan panel selalu terlihat
  useEffect(() => {
    // Pastikan control panel selalu muncul saat komponen dimount
    setShowControlPanel(true);
  }, []);

  // Handle live location tracking
  const toggleLiveLocation = () => {
    if (watchId) {
      navigator.geolocation.clearWatch(watchId);
      setWatchId(null);
      setUserLocation(null);
    } else if (navigator.geolocation) {
      setIsLoading(true);
      const id = navigator.geolocation.watchPosition(
        (position) => {
          const { latitude, longitude } = position.coords;
          setUserLocation([latitude, longitude]);
          setIsLoading(false);
        },
        (error) => {
          alert(`Error: ${error.message}`);
          setIsLoading(false);
        },
        { enableHighAccuracy: true, maximumAge: 10000, timeout: 5000 }
      );
      setWatchId(id);
    } else {
      alert('Browser Anda tidak mendukung geolokasi.');
    }
  };

  // Handle popular location click
  const handlePopularLocationClick = (position) => {
    setUserLocation(position);
  };

  // Toggle control panel visibility
  const toggleControlPanel = () => {
    setShowControlPanel(!showControlPanel);
  };

  return (
    <div className="relative h-screen w-full">
      {/* Map Container */}
      <MapContainer
        center={UIN_COORDS}
        zoom={15}
        scrollWheelZoom={true}
        style={{ height: '100%', width: '100%' }}
        ref={mapRef}
      >
        <TileLayer
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        />
        
        {/* UIN Main Marker */}
        <Marker position={UIN_COORDS}>
          <Popup>
            <div className="p-1">
              <h3 className="font-bold">UIN Syarif Hidayatullah Jakarta</h3>
              <p>Jl. Ir H. Juanda No.95, Ciputat, Tangerang Selatan</p>
            </div>
          </Popup>
        </Marker>
        
        {/* Campus Buildings */}
        {campusBuildings.map((building, index) => (
          <Marker
            key={index}
            position={building.position}
            icon={buildingIcons[building.type]}
            eventHandlers={{
              click: () => {
                setSelectedBuilding(building);
              },
            }}
          />
        ))}
        
        {/* User Location Marker */}
        {userLocation && (
          <Marker position={userLocation}>
            <Popup>Lokasi Anda</Popup>
          </Marker>
        )}
        
        {/* Routing */}
        {userLocation && <Routing start={userLocation} end={UIN_COORDS} />}
      </MapContainer>
      
      {/* Control Panel Toggle Button for Mobile */}
      <button
        onClick={toggleControlPanel}
        className="md:hidden fixed top-3 left-3 z-[1001] bg-blue-500 text-white p-2 rounded-md shadow-md"
      >
        {showControlPanel ? (
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
            <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
          </svg>
        ) : (
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
            <path fillRule="evenodd" d="M3 5a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm0 5a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm0 5a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1z" clipRule="evenodd" />
          </svg>
        )}
      </button>
      
      {/* Control Panel - Now fixed positioned with higher z-index */}
      <div 
        ref={controlPanelRef}
        className={`fixed top-3 left-3 z-[1000] bg-white p-4 rounded-lg shadow-md max-w-xs transition-transform duration-300 md:block ${
        showControlPanel ? 'translate-x-0' : '-translate-x-full md:translate-x-0'
      }`}>
        <h3 className="text-slate-800 mb-3 font-semibold">Rute ke UIN Jakarta</h3>
        
        {/* Search Input */}
        <div className="relative mb-3">
          <input
            type="text"
            value={startPoint}
            onChange={(e) => setStartPoint(e.target.value)}
            placeholder="Masukkan lokasi awal (alamat/area)"
            className="w-full p-2 pl-8 border border-gray-300 rounded-md"
          />
          <div className="absolute inset-y-0 left-0 flex items-center pl-2 pointer-events-none">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
          </div>
        </div>
        
        {/* Action Buttons */}
        <div className="flex space-x-2 mb-3">
          <button
            onClick={handleRouteSearch}
            className="flex-1 bg-blue-500 hover:bg-blue-600 text-white font-medium py-2 px-3 rounded-md cursor-pointer transition-colors"
            disabled={isLoading}
          >
            {isLoading ? 'Mencari...' : 'Cari Rute'}
          </button>
          <button
            onClick={handleReset}
            className="flex-1 bg-gray-500 hover:bg-gray-600 text-white font-medium py-2 px-3 rounded-md cursor-pointer transition-colors"
          >
            Reset
          </button>
        </div>
        
        {/* Live Location Toggle */}
        <button
          onClick={toggleLiveLocation}
          className={`w-full mb-3 font-medium py-2 px-3 rounded-md cursor-pointer transition-colors ${
            watchId ? 'bg-red-500 hover:bg-red-600 text-white' : 'bg-green-500 hover:bg-green-600 text-white'
          }`}
        >
          {watchId ? 'Hentikan Pelacakan' : 'Lacak Lokasi Saya'}
        </button>
        
        {/* Popular Locations */}
        <div className="mt-3">
          <h4 className="font-medium mb-1">Lokasi Populer:</h4>
          {popularLocations.map((location, index) => (
            <div
              key={index}
              className="location-item py-2 px-2 border-b border-gray-200 cursor-pointer hover:bg-gray-100"
              onClick={() => handlePopularLocationClick(location.position)}
            >
              {location.name}
            </div>
          ))}
        </div>
      </div>
      
      {/* Building Info Panel */}
      {selectedBuilding && (
        <div className="fixed top-3 right-3 z-[1000] bg-white p-4 rounded-lg shadow-md max-w-xs">
          <h3 className="font-bold text-lg mb-2">{selectedBuilding.name}</h3>
          <p className="text-sm mb-3">{selectedBuilding.info}</p>
          <button
            onClick={() => setSelectedBuilding(null)}
            className="w-full bg-blue-500 hover:bg-blue-600 text-white font-medium py-2 px-3 rounded-md cursor-pointer transition-colors"
          >
            Tutup
          </button>
        </div>
      )}
      
      {/* Live Location Button */}
      <button
        onClick={toggleLiveLocation}
        className={`fixed bottom-5 right-5 z-[1000] w-10 h-10 rounded-full flex items-center justify-center shadow-md cursor-pointer ${
          watchId ? 'bg-red-500' : 'bg-white'
        }`}
      >
        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill={watchId ? 'white' : '#3b82f6'} viewBox="0 0 16 16">
          <path d="M8 1a3 3 0 0 0-3 3v7a3 3 0 0 0 6 0V4a3 3 0 0 0-3-3z"/>
          <path d="M13 4.5a.5.5 0 0 1 .5.5v7a.5.5 0 0 1-1 0V5a.5.5 0 0 1 .5-.5zm-10 0A.5.5 0 0 1 3 5v7a.5.5 0 0 1-1 0V5a.5.5 0 0 1 .5-.5z"/>
          <path d="M5.5 13.5a.5.5 0 0 1 .5-.5h4a.5.5 0 0 1 0 1H6a.5.5 0 0 1-.5-.5z"/>
        </svg>
      </button>
      
      {/* Loading Indicator */}
      {isLoading && (
        <div className="fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 z-[1002] bg-white bg-opacity-90 p-5 rounded-lg shadow-md">
          <div className="flex items-center space-x-3">
            <svg className="animate-spin h-5 w-5 text-blue-500" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
            <span>Mencari rute...</span>
          </div>
        </div>
      )}
    </div>
  );
}