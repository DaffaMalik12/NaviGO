// ClickableMarker.jsx
import { useState, useEffect } from "react";
import { useMapEvents, Marker, Popup } from "react-leaflet";
import L from "leaflet";

// Komponen untuk menangkap klik pada peta dan membuat marker
const ClickableMarker = ({
    markerList,
    setMarkerList,
    customIcon,
    enableMarking = true,
    onMarkerClick = null,
}) => {
    // Mengambil event peta
    const map = useMapEvents({
        click: (e) => {
            if (!enableMarking) return;

            // Membuat marker baru ketika peta diklik
            const newMarker = {
                id: `marker-${Date.now()}`,
                position: [e.latlng.lat, e.latlng.lng],
                label: `Marker #${markerList.length + 1}`,
                notes: "",
                timestamp: new Date().toLocaleString(),
            };

            // Menambahkan marker baru ke daftar
            setMarkerList((prev) => [...prev, newMarker]);
        },
    });

    // Membuat custom icon jika tidak disediakan
    const defaultIcon = L.divIcon({
        className: "custom-marker-icon",
        html: `<div class="w-6 h-6 bg-red-500 rounded-full border-2 border-white flex items-center justify-center text-white font-bold shadow-lg"></div>`,
        iconSize: [24, 24],
        iconAnchor: [12, 12],
    });

    // Handler untuk menghapus marker
    const handleRemoveMarker = (id) => {
        setMarkerList((prev) => prev.filter((marker) => marker.id !== id));
    };

    // Handler untuk mengubah label marker
    const handleUpdateLabel = (id, newLabel) => {
        setMarkerList((prev) =>
            prev.map((marker) =>
                marker.id === id ? { ...marker, label: newLabel } : marker
            )
        );
    };

    // Handler untuk mengubah catatan marker
    const handleUpdateNotes = (id, newNotes) => {
        setMarkerList((prev) =>
            prev.map((marker) =>
                marker.id === id ? { ...marker, notes: newNotes } : marker
            )
        );
    };

    return (
        <>
            {markerList.map((marker) => (
                <Marker
                    key={marker.id}
                    position={marker.position}
                    icon={customIcon || defaultIcon}
                    eventHandlers={{
                        click: () => {
                            if (onMarkerClick) onMarkerClick(marker);
                        },
                    }}
                >
                    <Popup minWidth={200}>
                        <div className="p-1">
                            <div className="mb-2">
                                <label
                                    htmlFor={`label-${marker.id}`}
                                    className="text-sm font-semibold text-gray-700 block mb-1"
                                >
                                    Label:
                                </label>
                                <input
                                    id={`label-${marker.id}`}
                                    type="text"
                                    value={marker.label}
                                    onChange={(e) =>
                                        handleUpdateLabel(
                                            marker.id,
                                            e.target.value
                                        )
                                    }
                                    className="w-full p-1 border border-gray-300 rounded text-sm"
                                />
                            </div>

                            <div className="mb-2">
                                <label
                                    htmlFor={`notes-${marker.id}`}
                                    className="text-sm font-semibold text-gray-700 block mb-1"
                                >
                                    Catatan:
                                </label>
                                <textarea
                                    id={`notes-${marker.id}`}
                                    value={marker.notes}
                                    onChange={(e) =>
                                        handleUpdateNotes(
                                            marker.id,
                                            e.target.value
                                        )
                                    }
                                    className="w-full p-1 border border-gray-300 rounded text-sm"
                                    rows={3}
                                />
                            </div>

                            <div className="text-xs text-gray-500 mb-2">
                                Dibuat: {marker.timestamp}
                            </div>

                            <div className="flex justify-between">
                                <button
                                    onClick={() =>
                                        handleRemoveMarker(marker.id)
                                    }
                                    className="bg-red-500 hover:bg-red-600 text-white px-2 py-1 rounded text-xs"
                                >
                                    Hapus Marker
                                </button>

                                <button
                                    onClick={() =>
                                        map.setView(marker.position, 18)
                                    }
                                    className="bg-blue-500 hover:bg-blue-600 text-white px-2 py-1 rounded text-xs"
                                >
                                    Zoom ke Lokasi
                                </button>
                            </div>
                        </div>
                    </Popup>
                </Marker>
            ))}
        </>
    );
};

export default ClickableMarker;
