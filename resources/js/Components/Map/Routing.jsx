import React, { useEffect } from "react";
import L from "leaflet";
import { useMap } from "react-leaflet";
import "leaflet-routing-machine";

const Routing = ({
    start,
    end,
    buildingIcons,
    color = "#4F46E5",
    showDirections = false,
}) => {
    const map = useMap();

    useEffect(() => {
        if (!map || !start || !end) return;

        // Create routing control
        const routingControl = L.Routing.control({
            waypoints: [L.latLng(start[0], start[1]), L.latLng(end[0], end[1])],
            lineOptions: {
                styles: [{ color: color, weight: 4, opacity: 0.7 }],
                extendToWaypoints: true,
                missingRouteTolerance: 0,
            },
            routeWhileDragging: false,
            addWaypoints: false,
            draggableWaypoints: false,
            createMarker: () => {
                return null;
            }, // Don't create markers (we already have them)
            fitSelectedRoutes: true,
            showAlternatives: false,
            show: showDirections, // Show the directions panel when requested
            collapsible: true, // Allow collapsing the directions panel
            router: L.Routing.osrmv1({
                serviceUrl: "https://router.project-osrm.org/route/v1",
                profile: "walking", // Set to walking mode for campus navigation
            }),
        }).addTo(map);

        // Clean up on unmount
        return () => {
            map.removeControl(routingControl);
        };
    }, [map, start, end, color, showDirections]);

    return null; // This component doesn't render anything directly
};

export default Routing;
