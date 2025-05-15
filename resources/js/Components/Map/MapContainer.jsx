import React, { forwardRef, useEffect, useState } from "react";
import {
    MapContainer as LeafletMapContainer,
    TileLayer,
    Marker,
    Popup,
    Polyline,
    Tooltip,
    useMap,
} from "react-leaflet";
import Routing from "./Routing";
import { UIN_COORDS } from "../../../utils/mapUtils";
import { getBuildingIcons } from "../Icons/MarkerIcons";
import { campusBuildings } from "../../../data/buildingsData";
import GuestClickableMarker from "../UI/GuestClickableMarker"; // Import komponen baru

// Component to render alternative routes with directions
const AlternativeRoutes = ({ routes, userLocation, selectedRoute }) => {
    const map = useMap();

    useEffect(() => {
        if (routes && routes.length > 0) {
            // Create bounds to fit all routes
            const points = routes.flatMap((route) => route.points);
            if (points.length > 0) {
                const bounds = points.reduce(
                    (bounds, point) => bounds.extend(point),
                    map.getBounds()
                );
                map.fitBounds(bounds, { padding: [50, 50] });
            }
        }
    }, [routes, map]);

    if (!routes || routes.length === 0) return null;

    const colors = ["#4F46E5", "#10B981", "#F59E0B"]; // Blue, Green, Orange

    return (
        <>
            {routes.map((route, index) => (
                <React.Fragment key={`route-${index}`}>
                    <Polyline
                        positions={route.points}
                        pathOptions={{
                            color: colors[index % colors.length],
                            weight: 5,
                            opacity: selectedRoute === index ? 0.9 : 0.5,
                        }}
                    >
                        <Tooltip permanent direction="top" offset={[0, -15]}>
                            {route.description}
                        </Tooltip>
                    </Polyline>

                    {/* Routing for selected alternative route */}
                    {selectedRoute === index &&
                        userLocation &&
                        route.points.length > 0 && (
                            <Routing
                                start={userLocation}
                                end={route.points[route.points.length - 1]}
                                color={colors[index % colors.length]}
                                showDirections={true}
                            />
                        )}
                </React.Fragment>
            ))}
        </>
    );
};

// Custom control component for routes panel
const RoutesControl = ({
    alternativeRoutes,
    selectedRouteIndex,
    handleRouteSelect,
}) => {
    const map = useMap();

    useEffect(() => {
        // Create a custom control
        const routesControlDiv = L.DomUtil.create(
            "div",
            "leaflet-control-routes leaflet-control"
        );

        // Prevent propagation of mouse events to map
        L.DomEvent.disableClickPropagation(routesControlDiv);
        L.DomEvent.disableScrollPropagation(routesControlDiv);

        return () => {
            // Clean up if needed
        };
    }, [map]);

    return null;
};

const MapContainer = forwardRef(
    (
        {
            userLocation,
            selectedBuilding,
            searchTerm,
            selectedFilter,
            alternativeRoutes = [],
            // Tambahan props untuk guest
            isGuest = false,
            guestMarkers = [],
            setGuestMarkers,
            onGuestMarkerClick,
        },
        ref
    ) => {
        const [selectedRouteIndex, setSelectedRouteIndex] = useState(null);
        const buildingIcons = getBuildingIcons();

        // Filter buildings based on type and search term
        const filteredBuildings =
            selectedFilter === "all"
                ? campusBuildings
                : campusBuildings.filter(
                      (building) => building.type === selectedFilter
                  );

        const searchedBuildings = searchTerm
            ? filteredBuildings.filter(
                  (building) =>
                      building.name
                          .toLowerCase()
                          .includes(searchTerm.toLowerCase()) ||
                      building.info
                          .toLowerCase()
                          .includes(searchTerm.toLowerCase())
              )
            : filteredBuildings;

        // Determine whether to show normal routing or alternative routes
        const showNormalRouting =
            userLocation && selectedBuilding && alternativeRoutes.length === 0;
        const showDefaultRouting =
            userLocation && !selectedBuilding && alternativeRoutes.length === 0;
        const showAlternativeRoutes =
            alternativeRoutes && alternativeRoutes.length > 0;

        // Handle route selection
        const handleRouteSelect = (index) => {
            setSelectedRouteIndex(index === selectedRouteIndex ? null : index);
        };

        // Handle guest routes (khusus untuk lokasi yang dipilih guest)
        const showGuestRouting =
            isGuest &&
            userLocation &&
            guestMarkers.length > 0 &&
            alternativeRoutes.length === 0;

        return (
            <LeafletMapContainer
                center={UIN_COORDS}
                zoom={15}
                scrollWheelZoom={true}
                style={{ height: "100%", width: "100%" }}
                ref={ref}
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
                            <h3 className="font-bold">
                                UIN Syarif Hidayatullah Jakarta
                            </h3>
                            <p>
                                Jl. Ir H. Juanda No.95, Ciputat, Tangerang
                                Selatan
                            </p>
                        </div>
                    </Popup>
                </Marker>

                {/* Campus Buildings */}
                {searchedBuildings.map((building, index) => (
                    <Marker
                        key={`${building.id || building.name}-${index}`}
                        position={building.position}
                        icon={buildingIcons[building.type]}
                    >
                        <Popup>
                            <div className="p-1">
                                <h3 className="font-bold">{building.name}</h3>
                                <p>{building.info}</p>
                            </div>
                        </Popup>
                    </Marker>
                ))}

                {/* User Location Marker */}
                {userLocation && (
                    <Marker position={userLocation} icon={buildingIcons.user}>
                        <Popup>Lokasi Anda</Popup>
                    </Marker>
                )}

                {/* Tambahan: Guest Clickable Marker - Hanya tampil jika user adalah guest */}
                {isGuest && (
                    <GuestClickableMarker
                        guestMarkers={guestMarkers}
                        setGuestMarkers={setGuestMarkers}
                        onMarkerClick={onGuestMarkerClick}
                    />
                )}

                {/* Normal Routing - only show if we don't have alternative routes */}
                {showNormalRouting && (
                    <Routing
                        start={userLocation}
                        end={selectedBuilding.position}
                        buildingIcons={buildingIcons}
                        showDirections={true}
                    />
                )}

                {/* Default routing to UIN */}
                {showDefaultRouting && (
                    <Routing
                        start={userLocation}
                        end={UIN_COORDS}
                        buildingIcons={buildingIcons}
                        showDirections={true}
                    />
                )}

                {/* Guest routing to clicked marker */}
                {showGuestRouting && guestMarkers.length > 0 && (
                    <Routing
                        start={userLocation}
                        end={guestMarkers[0].position}
                        buildingIcons={buildingIcons}
                        showDirections={true}
                    />
                )}

                {/* Alternative Routes */}
                {showAlternativeRoutes && userLocation && (
                    <AlternativeRoutes
                        routes={alternativeRoutes}
                        userLocation={userLocation}
                        selectedRoute={selectedRouteIndex}
                    />
                )}

                {/* Route information panel - Using React Portal for better z-index handling */}
                {showAlternativeRoutes && alternativeRoutes.length > 0 && (
                    <div
                        className="leaflet-bottom leaflet-right"
                        style={{ pointerEvents: "auto", zIndex: 1000 }}
                    >
                        <div className="leaflet-control leaflet-bar bg-white p-4 rounded-lg shadow-md max-w-sm m-4">
                            <h3 className="font-semibold text-lg mb-2">
                                Rute Alternatif
                            </h3>
                            <ul className="space-y-2">
                                {alternativeRoutes.map((route, index) => {
                                    const colors = [
                                        "bg-indigo-100 border-indigo-500",
                                        "bg-green-100 border-green-500",
                                        "bg-yellow-100 border-yellow-500",
                                    ];
                                    const textColors = [
                                        "text-indigo-800",
                                        "text-green-800",
                                        "text-yellow-800",
                                    ];
                                    const isSelected =
                                        selectedRouteIndex === index;

                                    return (
                                        <li
                                            key={`route-info-${index}`}
                                            className={`p-2 border-l-4 rounded cursor-pointer transition-all ${
                                                colors[index % colors.length]
                                            } ${
                                                isSelected
                                                    ? "ring-2 ring-offset-2 ring-blue-500"
                                                    : ""
                                            }`}
                                            onClick={() =>
                                                handleRouteSelect(index)
                                            }
                                            style={{ pointerEvents: "auto" }}
                                        >
                                            <p
                                                className={`font-medium ${
                                                    textColors[
                                                        index %
                                                            textColors.length
                                                    ]
                                                }`}
                                            >
                                                {route.description}
                                            </p>
                                            {route.distance &&
                                                route.duration && (
                                                    <p className="text-sm text-gray-600">
                                                        {(
                                                            route.distance /
                                                            1000
                                                        ).toFixed(1)}{" "}
                                                        km •{" "}
                                                        {Math.round(
                                                            route.duration / 60
                                                        )}{" "}
                                                        menit
                                                    </p>
                                                )}
                                            {isSelected && (
                                                <p className="text-xs font-medium text-blue-600 mt-1">
                                                    Menampilkan petunjuk arah
                                                </p>
                                            )}
                                        </li>
                                    );
                                })}
                            </ul>
                        </div>
                    </div>
                )}

                {/* Instruksi untuk guest */}
                {isGuest &&
                    guestMarkers.length === 0 &&
                    !showAlternativeRoutes && (
                        <div
                            className="leaflet-top leaflet-center"
                            style={{
                                pointerEvents: "auto",
                                zIndex: 1000,
                                top: "20px",
                                right: "50%",
                            }}
                        >
                            <div className="leaflet-control leaflet-bar bg-white p-3 rounded-lg shadow-md text-center transform -translate-x-1/2">
                                <p className="text-gray-700 font-medium">
                                    Klik di mana saja pada peta untuk melihat
                                    rute
                                </p>
                            </div>
                        </div>
                    )}
            </LeafletMapContainer>
        );
    }
);

export default MapContainer;
