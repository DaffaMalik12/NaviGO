import { useState, useEffect, useRef } from "react";
import MapContainer from "./Map/MapContainer";
import ControlPanel from "./UI/ControlPanel";
import BuildingInfo from "./UI/BuildingInfo";
import useGeolocation from "../../hooks/useGeolocation";
import { geocodeAddress } from "../../service/GeocodeService";
import RouteNotification from "./UI/RouteNotification";
import { getAlternativeRoutes } from "../../service/RouteService";
import NavbarTransparen from "../Components/UI/NavbarTransparen";
import { UIN_COORDS } from "../../utils/mapUtils";
import LogoutNavbar from "./UI/LogoutNavbar";

export default function CampusMap({ auth }) {
    const [startPoint, setStartPoint] = useState("");
    const [isLoading, setIsLoading] = useState(false);
    const [userLocation, setUserLocation] = useState(null);
    const [selectedBuilding, setSelectedBuilding] = useState(null);
    const [showControlPanel, setShowControlPanel] = useState(true);
    const [activeTab, setActiveTab] = useState("navigation");
    const [searchTerm, setSearchTerm] = useState("");
    const [recentSearches, setRecentSearches] = useState([]);
    const [showHistory, setShowHistory] = useState(false);
    const [alternativeRoutes, setAlternativeRoutes] = useState([]);
    const [selectedFilter, setSelectedFilter] = useState("all");
    const [showRouteNotification, setShowRouteNotification] = useState(false);
    const mapRef = useRef(null);

    // Hook for geolocation
    const { watchId, toggleLiveLocation, stopLocationWatch } = useGeolocation(
        setUserLocation,
        setIsLoading
    );

    const handleRouteSearch = async () => {
        if (!startPoint.trim()) {
            alert("Masukkan lokasi awal terlebih dahulu!");
            return;
        }

        setIsLoading(true);

        if (!recentSearches.includes(startPoint)) {
            setRecentSearches((prev) => [startPoint, ...prev].slice(0, 5));
        }

        const coordinates = await geocodeAddress(startPoint);

        if (coordinates) {
            setUserLocation(coordinates);
        } else {
            alert(
                "Lokasi tidak ditemukan. Mencoba dengan lokasi acak dekat kampus."
            );
            const randomLat = UIN_COORDS[0] + (Math.random() - 0.5) * 0.02;
            const randomLng = UIN_COORDS[1] + (Math.random() - 0.5) * 0.02;
            setUserLocation([randomLat, randomLng]);
        }

        setIsLoading(false);
        setShowHistory(false);
    };

    const handleReset = () => {
        setUserLocation(null);
        setStartPoint("");
        setAlternativeRoutes([]);
        stopLocationWatch();
        if (mapRef.current) {
            mapRef.current.setView(UIN_COORDS, 15);
        }
    };

    const handlePopularLocationClick = (position, name) => {
        setUserLocation(position);
        setStartPoint(name);
    };

    const toggleControlPanel = () => {
        setShowControlPanel(!showControlPanel);
    };

    useEffect(() => {
        setShowControlPanel(true);
    }, []);

    const handleBuildingSelect = (building) => {
        setSelectedBuilding(building);
        setShowRouteNotification(true);
        if (mapRef.current) {
            mapRef.current.setView(building.position, 18);
        }
        if (window.innerWidth < 768) {
            setShowControlPanel(false);
        }
    };

    const handleShowAlternativeRoutes = async (building) => {
        if (!userLocation) {
            alert("Tentukan lokasi Anda terlebih dahulu.");
            return;
        }

        setIsLoading(true);

        try {
            const routes = await getAlternativeRoutes(
                userLocation,
                building.position
            );

            if (routes && routes.length > 0) {
                setAlternativeRoutes(routes);
                console.log("Alternative routes loaded:", routes);
            } else {
                alert("Tidak dapat menemukan rute alternatif.");
            }
        } catch (error) {
            console.error("Error fetching alternative routes:", error);
            alert("Gagal memuat rute alternatif. Silakan coba lagi.");
        }

        setIsLoading(false);
        setShowRouteNotification(false);
    };

    return (
        <div className="relative h-screen w-full bg-gray-50">
            {/* Map */}
            <MapContainer
                mapRef={mapRef}
                userLocation={userLocation}
                selectedBuilding={selectedBuilding}
                searchTerm={searchTerm}
                selectedFilter={selectedFilter}
                alternativeRoutes={alternativeRoutes}
            />

            {/* ✅ Tampilkan Control Panel hanya jika SUDAH LOGIN */}
            {auth?.user && (
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
            )}

            {/* ✅ Building Info hanya jika login dan ada gedung dipilih */}
            {auth?.user && selectedBuilding && showControlPanel && (
                <BuildingInfo
                    selectedBuilding={selectedBuilding}
                    setSelectedBuilding={setSelectedBuilding}
                    userLocation={userLocation}
                />
            )}

            {/* ✅ Rute alternatif juga hanya jika login */}
            {auth?.user && showRouteNotification && selectedBuilding && (
                <RouteNotification
                    building={selectedBuilding}
                    onShowRoute={handleShowAlternativeRoutes}
                    onClose={() => setShowRouteNotification(false)}
                />
            )}

            {auth.user && <LogoutNavbar />}

            {/* ❌ Navbar hanya untuk yang belum login */}
            {!auth?.user && <NavbarTransparen />}
        </div>
    );
}
