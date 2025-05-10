import { useEffect } from 'react';
import { useMap } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet-routing-machine';
import 'leaflet-routing-machine/dist/leaflet-routing-machine.css';

const Routing = ({ start, end, buildingIcons }) => {
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
  }, [start, end, map, buildingIcons]);

  return null;
};

export default Routing;