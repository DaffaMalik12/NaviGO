import L from 'leaflet';
import { buildingIcons } from '../js/Components/Icons/MarkerIcons';

// Koordinat UIN (Diekspor langsung)
export const UIN_COORDS = [-6.3109024, 106.75962103417];

/**
 * Membuat routing control untuk peta
 * @param {Array<number>} start - Koordinat awal [lat, lng]
 * @param {Array<number>} end - Koordinat tujuan [lat, lng]
 * @param {Object} map - Instance peta Leaflet
 * @returns {Object} - Leaflet routing control
 */
export const createRoutingControl = (start, end, map) => {
  if (!start || !end || !map) return null;

  return L.Routing.control({
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
};

/**
 * Filter gedung berdasarkan jenis dan kata kunci pencarian
 * @param {Array<Object>} buildings - Daftar gedung
 * @param {string} filter - Jenis gedung (all, academic, facility, dll)
 * @param {string} searchTerm - Kata kunci pencarian
 * @returns {Array<Object>} - Gedung yang sudah difilter
 */
export const filterBuildings = (buildings, filter, searchTerm) => {
  // Filter berdasarkan jenis
  const typeFiltered = filter === 'all' 
    ? buildings 
    : buildings.filter(building => building.type === filter);
    
  // Filter berdasarkan kata kunci (jika ada)
  return searchTerm
    ? typeFiltered.filter(building => 
        building.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        building.info.toLowerCase().includes(searchTerm.toLowerCase()))
    : typeFiltered;
};