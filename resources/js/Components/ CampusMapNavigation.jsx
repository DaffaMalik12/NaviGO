import { useState, useEffect, useRef } from 'react';
import { MapContainer, TileLayer, Marker, Popup, useMap } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet-routing-machine';
import 'leaflet/dist/leaflet.css';
import 'leaflet-routing-machine/dist/leaflet-routing-machine.css';
import { Search, Navigation, Map, X, MapPin, Menu, ChevronRight, Info, User, Compass, Clock, Building, RefreshCw } from 'lucide-react';

// Fix default marker icons
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
});

const UIN_COORDS = [-6.3109024, 106.75962103417];

export default function CampusMap() {
  const [startPoint, setStartPoint] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [userLocation, setUserLocation] = useState(null);
  const [watchId, setWatchId] = useState(null);
  const [selectedBuilding, setSelectedBuilding] = useState(null);
  const [showControlPanel, setShowControlPanel] = useState(true);
  const [activeTab, setActiveTab] = useState('navigation'); // navigation, buildings, info
  const [searchTerm, setSearchTerm] = useState('');
  const [recentSearches, setRecentSearches] = useState([]);
  const [showHistory, setShowHistory] = useState(false);
  const [selectedFilter, setSelectedFilter] = useState('all');
  const mapRef = useRef(null);
  const controlPanelRef = useRef(null);

  // Campus buildings data
  const campusBuildings = [
    // Fakultas
    { 
      name: "Fakultas Ilmu Tarbiyah dan Keguruan (FITK)", 
      position: [-6.306848723961019, 106.75522781019107], 
      type: "academic", 
      info: "Gedung utama FITK dengan program studi Pendidikan Agama Islam, PGMI, dan lainnya" 
    },
    { 
      name: "Fakultas Adab dan Humaniora", 
      position: [-6.313417220849284, 106.75536603471465], 
      type: "academic", 
      info: "Program studi Sastra Arab, Sejarah Peradaban Islam, dan Ilmu Perpustakaan" 
    },
    { 
      name: "Fakultas Syariah dan Hukum", 
      position: [-6.306643154612702, 106.7545141562287], 
      type: "academic", 
      info: "Gedung kuliah hukum Islam dan ekonomi syariah" 
    },
    { 
      name: "Fakultas Ushuluddin dan Filsafat", 
      position: [-6.306750787814986, 106.75383962553693], 
      type: "academic", 
      info: "Program studi Aqidah Filsafat dan Studi Agama" 
    },
    { 
      name: "Fakultas Dakwah dan Ilmu Komunikasi", 
      position: [-6.306812207340797, 106.75386148320993], 
      type: "academic", 
      info: "Gedung dakwah dengan studio broadcasting" 
    },
    { 
      name: "Fakultas Ekonomi dan Bisnis", 
      position: [-6.310959955496757, 106.75666884088291], 
      type: "academic", 
      info: "Program studi Ekonomi Syariah dan Perbankan Islam" 
    },
    { 
      name: "Fakultas Sains dan Teknologi", 
      position: [-6.305987362913285, 106.75277471936822 ], 
      type: "academic", 
      info: "Gedung laboratorium sains dan teknologi" 
    },
    { 
      name: "Fakultas Psikologi", 
      position: [-6.309691355236905, 106.75897155622877], 
      type: "academic", 
      info: "Program studi Psikologi Islam dan Klinis" 
    },
    { 
      name: "Fakultas Kedokteran dan Ilmu Kesehatan", 
      position: [-6.311769393670368, 106.76005459880741], 
      type: "academic", 
      info: "Gedung baru fakultas kedokteran dengan rumah sakit pendidikan" 
    },
    { 
      name: "Fakultas Ilmu Sosial dan Ilmu Politik", 
      position: [-6.309131291268278, 106.75925704088291], 
      type: "academic", 
      info: "Program studi Sosiologi dan Ilmu Politik" 
    },
    { 
      name: "Fakultas Dirosat Islamiyah", 
      position: [-6.305934062709272, 106.75642528135452], 
      type: "academic", 
      info: "Program internasional (bahasa pengantar Arab)" 
    },
  
    // Fasilitas Pendukung
    { 
      name: "Gedung Rektorat", 
      position: [-6.306534235056094, 106.75607619484514], 
      type: "administration", 
      info: "Pusat administrasi universitas" 
    },
    { 
      name: "Perpustakaan Utama", 
      position: [-6.306100298837985, 106.75372393902748], 
      type: "facility", 
      info: "Perpustakaan pusat 5 lantai dengan koleksi lengkap" 
    },
    { 
        name: "Rumah sakit UIN Jakarta", 
        position: [-6.307908289905879, 106.75665731052253], 
        type: "facility", 
        info: "Rumah sakit pendidikan untuk mahasiswa kedokteran" 
      },
    { 
      name: "Auditorium Harun Nasution", 
      position: [-6.306269246275675, 106.7556969967004], 
      type: "facility", 
      info: "Aula serbaguna untuk acara besar" 
    },
    { 
      name: "Student Center", 
      position: [-6.306392490651153, 106.754946067864], 
      type: "facility", 
      info: "Pusat kegiatan mahasiswa dan organisasi" 
    },
    { 
        name: "Masjid Al-Jami'ah", 
        position: [-6.306396995414675, 106.75473229676983], 
        type: "facility", 
        info: "Masjid utama kampus untuk ibadah" 
      },
    { 
      name: "Klinik Kesehatan", 
      position: [-6.312989356945269, 106.7557503193686], 
      type: "facility", 
      info: "Layanan kesehatan gratis untuk mahasiswa" 
    },
    { 
      name: "Asrama Mahasiswa", 
      position: [-6.308552460457808, 106.75803055733023], 
      type: "facility", 
      info: "Asrama putra dan putri" 
    },
    
    { 
      name: "Parkir Pusat", 
      position: [-6.306287444909209, 106.75392655653299], 
      type: "parking", 
      info: "Area parkir utama dekat Gedung FST" 
    },
    
    { 
      name: "Student Center", 
      position: [-6.306340234641485, 106.75495433364239], 
      type: "facility", 
      info: "Lapangan sepak bola, basket, dan voli" 
    }
  ];

  const popularLocations = [
    { name: "Stasiun MRT Bendungan Hilir", position: [-6.2154465, 106.8173187] },
    { name: "Stasiun Sudirman", position: [-6.2876, 106.7991] },
    { name: "Stasiun Pondok Ranji", position: [-6.2766831, 106.7446926] },
    { name: "Monas", position: [-6.175372, 106.827194
    ] },
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
    user: new L.Icon({
      iconUrl: 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-violet.png',
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
            { color: '#4f46e5', opacity: 0.5, weight: 4 }
          ]
        },
        createMarker: (i, wp, nWps) => {
          if (i === 0) {
            return L.marker(wp.latLng, {
              draggable: true,
              icon: buildingIcons.user
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
  const handlePopularLocationClick = (position, name) => {
    setUserLocation(position);
    setStartPoint(name);
  };

  // Toggle control panel visibility
  const toggleControlPanel = () => {
    setShowControlPanel(!showControlPanel);
  };
  
  // Filter buildings based on type
  const filteredBuildings = selectedFilter === 'all' 
    ? campusBuildings 
    : campusBuildings.filter(building => building.type === selectedFilter);
    
  // Filter buildings based on search term
  const searchedBuildings = searchTerm
    ? filteredBuildings.filter(building => 
        building.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        building.info.toLowerCase().includes(searchTerm.toLowerCase()))
    : filteredBuildings;

  return (
    <div className="relative h-screen w-full bg-gray-50">
      {/* Map Container */}
      <MapContainer
        center={UIN_COORDS}
        zoom={15}
        scrollWheelZoom={true}
        style={{ height: '100%', width: '100%' }}
        ref={mapRef}
        className="z-0"
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
        {searchedBuildings.map((building, index) => (
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
          <Marker position={userLocation} icon={buildingIcons.user}>
            <Popup>Lokasi Anda</Popup>
          </Marker>
        )}
        
        {/* Routing */}
        {userLocation && selectedBuilding 
          ? <Routing start={userLocation} end={selectedBuilding.position} />
          : userLocation && <Routing start={userLocation} end={UIN_COORDS} />
        }
      </MapContainer>
      
      
      
      {/* Control Panel Toggle Button */}
      <button
        onClick={toggleControlPanel}
        className="fixed top-4 left-4 z-50 bg-white p-3 rounded-full shadow-lg hover:bg-gray-100 transition-all duration-300"
      >
        {showControlPanel ? (
          <X className="h-5 w-5 text-gray-700" />
        ) : (
          <Menu className="h-5 w-5 text-gray-700" />
        )}
      </button>
      
      {/* Control Panel - Now with tabs and improved styling */}
      <div 
        ref={controlPanelRef}
        className={`fixed top-0 left-0 z-40 bg-white h-full w-80 shadow-xl transition-transform duration-300 ease-in-out overflow-hidden ${
          showControlPanel ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        {/* Panel Header */}
        <div className="p-4 bg-indigo-600 text-white">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <Map className="h-5 w-5" />
              <h2 className="font-bold text-lg">UIN Campus Navigator</h2>
            </div>
            <button 
              onClick={toggleControlPanel}
              className="p-1 hover:bg-indigo-500 rounded-full transition-colors"
            >
              <X className="h-5 w-5" />
            </button>
          </div>
        </div>
        
        {/* Navigation Tabs */}
        <div className="flex border-b border-gray-200">
          <button 
            className={`flex-1 py-3 text-sm font-medium ${activeTab === 'navigation' ? 'text-indigo-600 border-b-2 border-indigo-600' : 'text-gray-500 hover:text-gray-700'}`}
            onClick={() => setActiveTab('navigation')}
          >
            <div className="flex flex-col items-center">
              <Navigation className="h-4 w-4 mb-1" />
              <span>Navigasi</span>
            </div>
          </button>
          <button 
            className={`flex-1 py-3 text-sm font-medium ${activeTab === 'buildings' ? 'text-indigo-600 border-b-2 border-indigo-600' : 'text-gray-500 hover:text-gray-700'}`}
            onClick={() => setActiveTab('buildings')}
          >
            <div className="flex flex-col items-center">
              <Building className="h-4 w-4 mb-1" />
              <span>Gedung</span>
            </div>
          </button>
          <button 
            className={`flex-1 py-3 text-sm font-medium ${activeTab === 'info' ? 'text-indigo-600 border-b-2 border-indigo-600' : 'text-gray-500 hover:text-gray-700'}`}
            onClick={() => setActiveTab('info')}
          >
            <div className="flex flex-col items-center">
              <Info className="h-4 w-4 mb-1" />
              <span>Info</span>
            </div>
          </button>
        </div>
        
        {/* Tab Content */}
        <div className="p-4 h-[calc(100%-140px)] overflow-y-auto">
          {activeTab === 'navigation' && (
            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-gray-800">Cari Rute ke UIN</h3>
              
              {/* Search Input with History */}
              <div className="relative">
                <input
                  type="text"
                  value={startPoint}
                  onChange={(e) => {
                    setStartPoint(e.target.value);
                    setShowHistory(true);
                  }}
                  onFocus={() => setShowHistory(true)}
                  placeholder="Masukkan lokasi awal Anda"
                  className="w-full p-3 pl-10 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                />
                <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                  <Search className="h-5 w-5 text-gray-400" />
                </div>
                
                {/* Recent Searches Dropdown */}
                {showHistory && recentSearches.length > 0 && (
                  <div className="absolute w-full bg-white border border-gray-200 rounded-lg mt-1 shadow-lg z-50">
                    <div className="p-2 border-b border-gray-200 flex justify-between items-center">
                      <span className="text-sm font-medium text-gray-500">Pencarian Terakhir</span>
                      <button className="text-xs text-indigo-600 hover:text-indigo-800" onClick={() => setRecentSearches([])}>
                        Hapus Semua
                      </button>
                    </div>
                    {recentSearches.map((search, idx) => (
                      <div 
                        key={idx} 
                        className="p-2 hover:bg-gray-100 cursor-pointer flex items-center"
                        onClick={() => {
                          setStartPoint(search);
                          setShowHistory(false);
                        }}
                      >
                        <Clock className="h-4 w-4 text-gray-400 mr-2" />
                        <span>{search}</span>
                      </div>
                    ))}
                  </div>
                )}
              </div>
              
              {/* Action Buttons */}
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
              
              {/* Live Location Button */}
              <button
                onClick={toggleLiveLocation}
                className={`w-full py-3 px-4 rounded-lg shadow font-medium flex items-center justify-center ${
                  watchId 
                    ? 'bg-red-500 hover:bg-red-600 text-white' 
                    : 'bg-green-500 hover:bg-green-600 text-white'
                }`}
              >
                <Compass className="h-5 w-5 mr-2" />
                {watchId ? 'Hentikan Pelacakan Lokasi' : 'Gunakan Lokasi Saya'}
              </button>
              
              {/* Popular Locations */}
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
          )}
          
          {activeTab === 'buildings' && (
            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-gray-800">Gedung Kampus</h3>
              
              {/* Search Buildings */}
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
              <div className="flex space-x-2 overflow-x-auto py-2 scrollbar-hide">
                <button 
                  onClick={() => setSelectedFilter('all')} 
                  className={`px-3 py-1 rounded-full text-sm whitespace-nowrap ${
                    selectedFilter === 'all' 
                      ? 'bg-indigo-600 text-white' 
                      : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                  }`}
                >
                  Semua
                </button>
                <button 
                  onClick={() => setSelectedFilter('academic')} 
                  className={`px-3 py-1 rounded-full text-sm whitespace-nowrap ${
                    selectedFilter === 'academic' 
                      ? 'bg-blue-600 text-white' 
                      : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                  }`}
                >
                  Akademik
                </button>
                <button 
                  onClick={() => setSelectedFilter('facility')} 
                  className={`px-3 py-1 rounded-full text-sm whitespace-nowrap ${
                    selectedFilter === 'facility' 
                      ? 'bg-green-600 text-white' 
                      : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                  }`}
                >
                  Fasilitas
                </button>
                <button 
                  onClick={() => setSelectedFilter('administration')} 
                  className={`px-3 py-1 rounded-full text-sm whitespace-nowrap ${
                    selectedFilter === 'administration' 
                      ? 'bg-red-600 text-white' 
                      : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                  }`}
                >
                  Administrasi
                </button>
                <button 
                  onClick={() => setSelectedFilter('parking')} 
                  className={`px-3 py-1 rounded-full text-sm whitespace-nowrap ${
                    selectedFilter === 'parking' 
                      ? 'bg-orange-600 text-white' 
                      : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                  }`}
                >
                  Parkir
                </button>
              </div>
              
              {/* Buildings List */}
              <div className="space-y-2 mt-2 max-h-80 overflow-y-auto pr-1">
                {searchedBuildings.length > 0 ? (
                  searchedBuildings.map((building, index) => (
                    <div
                      key={index}
                      className="p-3 border border-gray-200 rounded-lg cursor-pointer hover:border-indigo-300 hover:bg-indigo-50 transition-colors"
                      onClick={() => {
                        setSelectedBuilding(building);
                        if (mapRef.current) {
                          mapRef.current.setView(building.position, 18);
                        }
                        if (window.innerWidth < 768) {
                          setShowControlPanel(false);
                        }
                      }}
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
            </div>
          )}
          
          {activeTab === 'info' && (
            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-gray-800">Informasi Kampus</h3>
              
              <div className="bg-indigo-50 p-4 rounded-lg border border-indigo-100">
                <h4 className="font-medium text-indigo-800 mb-2">Tentang UIN Syarif Hidayatullah</h4>
                <p className="text-sm text-gray-700">
                  UIN Syarif Hidayatullah Jakarta adalah salah satu perguruan tinggi Islam negeri terkemuka di Indonesia. 
                  Terletak di Ciputat, Tangerang Selatan, kampus ini memiliki berbagai fasilitas modern dan program studi unggulan.
                </p>
              </div>
              
              <div className="bg-white p-4 rounded-lg border border-gray-200">
                <h4 className="font-medium text-gray-800 mb-2">Jam Operasional</h4>
                <div className="space-y-1 text-sm">
                  <div className="flex justify-between">
                    <span>Senin - Jumat</span>
                    <span className="font-medium">07:30 - 16:00</span>
                    </div>
                  <div className="flex justify-between">
                    <span>Sabtu</span>
                    <span className="font-medium">08:00 - 15:00</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Minggu</span>
                    <span className="font-medium">Tutup</span>
                  </div>
                </div>
              </div>
              
              <div className="bg-white p-4 rounded-lg border border-gray-200">
                <h4 className="font-medium text-gray-800 mb-2">Kontak Penting</h4>
                <div className="space-y-2 text-sm">
                  <div>
                    <p className="text-gray-500">Rektorat</p>
                    <p className="font-medium">(021) 7401925</p>
                  </div>
                  <div>
                    <p className="text-gray-500">Bagian Akademik</p>
                    <p className="font-medium">(021) 7401926</p>
                  </div>
                  <div>
                    <p className="text-gray-500">Keamanan Kampus</p>
                    <p className="font-medium">(021) 7401927</p>
                  </div>
                </div>
              </div>
              
              <div className="bg-white p-4 rounded-lg border border-gray-200">
                <h4 className="font-medium text-gray-800 mb-2">Transportasi Umum</h4>
                <div className="space-y-3">
                  <div>
                    <p className="font-medium text-sm">Transjakarta</p>
                    <p className="text-sm text-gray-600">Koridor 8 (Harmoni - Lebak Bulus) - Turun di Terminal Pondok Ranji</p>
                  </div>
                  <div>
                    <p className="font-medium text-sm">KRL Commuter Line</p>
                    <p className="text-sm text-gray-600">Stasiun Pondok Ranji (5 menit jalan kaki dari kampus)</p>
                  </div>
                  <div>
                    <p className="font-medium text-sm">Angkot</p>
                    <p className="text-sm text-gray-600">T01 (Terminal Pondok Ranji - Ciputat)</p>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
        
        {/* Bottom Panel - Building Info */}
        {selectedBuilding && (
          <div className="absolute bottom-0 left-0 right-0 bg-white border-t border-gray-200 p-4 shadow-lg">
            <div className="flex justify-between items-start mb-2">
              <h3 className="font-bold text-lg">{selectedBuilding.name}</h3>
              <button 
                onClick={() => setSelectedBuilding(null)}
                className="p-1 hover:bg-gray-100 rounded-full"
              >
                <X className="h-5 w-5 text-gray-500" />
              </button>
            </div>
            <p className="text-gray-600 mb-3">{selectedBuilding.info}</p>
            <button
              onClick={() => {
                if (userLocation) {
                  setSelectedBuilding(selectedBuilding);
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
        )}
      </div>
    </div>
  );
}