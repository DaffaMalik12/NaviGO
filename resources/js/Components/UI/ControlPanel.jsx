import React from "react";
import { useRef } from "react";
import { X, Menu, Map } from "lucide-react";
import NavigationTab from "./NavigationTab";
import BuildingsTab from "./BuildingsTab";
import InfoTab from "./InfoTab";

const ControlPanel = ({
    showControlPanel,
    toggleControlPanel,
    activeTab,
    setActiveTab,
    startPoint,
    setStartPoint,
    searchTerm,
    setSearchTerm,
    selectedFilter,
    setSelectedFilter,
    recentSearches,
    setRecentSearches,
    showHistory,
    setShowHistory,
    handleRouteSearch,
    handleReset,
    isLoading,
    toggleLiveLocation,
    watchId,
    setWatchId,
    setUserLocation,
    handlePopularLocationClick,
    handleBuildingSelect,
    mapRef,
}) => {
    const controlPanelRef = useRef(null);

    return (
        <>
            {/* Control Panel Toggle Button */}
            {!showControlPanel && (
                <button
                    onClick={toggleControlPanel}
                    className="fixed top-20 left-4 z-50 bg-white p-3 rounded-full shadow-lg hover:bg-gray-100 transition-all duration-300"
                >
                    <Menu className="h-5 w-5 text-gray-700" />
                </button>
            )}
            {/* Control Panel */}
            <div
                ref={controlPanelRef}
                className={`fixed top-0 left-0 z-40 bg-white h-full w-80 shadow-xl transition-transform duration-300 ease-in-out overflow-hidden ${
                    showControlPanel ? "translate-x-0" : "-translate-x-full"
                }`}
            >
                {/* Panel Header */}
                <div className="p-4 bg-indigo-600 text-white">
                    <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-2">
                            <Map className="h-5 w-5" />
                            <h2 className="font-bold text-lg">
                                UIN Campus Navigator
                            </h2>
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
                    <TabButton
                        label="Navigasi"
                        iconName="Navigation"
                        active={activeTab === "navigation"}
                        onClick={() => setActiveTab("navigation")}
                    />
                    <TabButton
                        label="Gedung"
                        iconName="Building"
                        active={activeTab === "buildings"}
                        onClick={() => setActiveTab("buildings")}
                    />
                    <TabButton
                        label="Info"
                        iconName="Info"
                        active={activeTab === "info"}
                        onClick={() => setActiveTab("info")}
                    />
                </div>

                {/* Tab Content */}
                <div className="p-4 h-[calc(100%-140px)] overflow-y-auto">
                    {activeTab === "navigation" && (
                        <NavigationTab
                            startPoint={startPoint}
                            setStartPoint={setStartPoint}
                            recentSearches={recentSearches}
                            setRecentSearches={setRecentSearches}
                            showHistory={showHistory}
                            setShowHistory={setShowHistory}
                            handleRouteSearch={handleRouteSearch}
                            handleReset={handleReset}
                            isLoading={isLoading}
                            toggleLiveLocation={toggleLiveLocation}
                            watchId={watchId}
                            setWatchId={setWatchId}
                            setUserLocation={setUserLocation}
                            handlePopularLocationClick={
                                handlePopularLocationClick
                            }
                        />
                    )}

                    {activeTab === "buildings" && (
                        <BuildingsTab
                            searchTerm={searchTerm}
                            setSearchTerm={setSearchTerm}
                            selectedFilter={selectedFilter}
                            setSelectedFilter={setSelectedFilter}
                            handleBuildingSelect={handleBuildingSelect}
                            mapRef={mapRef}
                        />
                    )}

                    {activeTab === "info" && <InfoTab />}
                </div>
            </div>
        </>
    );
};

// Tab Button Component
const TabButton = ({ label, iconName, active, onClick }) => {
    // Import icons dynamically
    const icons = {
        Navigation: () => import("lucide-react").then((mod) => mod.Navigation),
        Building: () => import("lucide-react").then((mod) => mod.Building),
        Info: () => import("lucide-react").then((mod) => mod.Info),
    };

    const Icon = ({ iconName }) => {
        const [Icon, setIcon] = React.useState(null);

        React.useEffect(() => {
            let isMounted = true;
            icons[iconName]().then((mod) => {
                if (isMounted)
                    setIcon(
                        React.createElement(mod, { className: "h-4 w-4 mb-1" })
                    );
            });
            return () => {
                isMounted = false;
            };
        }, [iconName]);

        return Icon || <div className="h-4 w-4 mb-1" />;
    };

    return (
        <button
            className={`flex-1 py-3 text-sm font-medium ${
                active
                    ? "text-indigo-600 border-b-2 border-indigo-600"
                    : "text-gray-500 hover:text-gray-700"
            }`}
            onClick={onClick}
        >
            <div className="flex flex-col items-center">
                <Icon iconName={iconName} />
                <span>{label}</span>
            </div>
        </button>
    );
};

export default ControlPanel;
