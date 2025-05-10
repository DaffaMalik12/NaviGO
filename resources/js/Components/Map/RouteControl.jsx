import { useEffect } from 'react';
import { useMap } from 'react-leaflet';
import { createRoutingControl } from '../../utils/mapUtils';

/**
 * Component to handle routing on the map
 * @param {Object} props
 * @param {Array<number>} props.start - Starting point coordinates [lat, lng]
 * @param {Array<number>} props.end - Ending point coordinates [lat, lng]
 */
const RouteControl = ({ start, end }) => {
  const map = useMap();

  useEffect(() => {
    if (!start || !end) return;

    // Create the routing control
    const routingControl = createRoutingControl(start, end, map);

    // Cleanup function to remove the routing when component unmounts
    return () => {
      if (routingControl) {
        map.removeControl(routingControl);
      }
    };
  }, [start, end, map]);

  return null; // This component doesn't render anything
};

export default RouteControl;