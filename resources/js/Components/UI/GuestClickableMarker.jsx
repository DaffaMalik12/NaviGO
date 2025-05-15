// GuestClickableMarker.jsx
import { useState } from "react";
import { useMapEvents, Marker, Popup } from "react-leaflet";
import L from "leaflet";

// Komponen khusus untuk menangkap klik pada peta oleh pengguna guest
const GuestClickableMarker = ({
    guestMarkers,
    setGuestMarkers,
    onMarkerClick = null,
}) => {
    // Mengambil event peta
    const map = useMapEvents({
        click: (e) => {
            // Membuat marker baru ketika peta diklik oleh guest
            const newMarker = {
                id: `guest-marker-${Date.now()}`,
                position: [e.latlng.lat, e.latlng.lng],
                label: `Lokasi Pilihan`,
                timestamp: new Date().toLocaleString(),
            };

            // Menghapus marker sebelumnya dan set yang baru (hanya 1 marker untuk guest)
            setGuestMarkers([newMarker]);

            // Trigger callback jika disediakan
            if (onMarkerClick) {
                onMarkerClick(newMarker);
            }
        },
    });

    // Membuat custom icon untuk marker guest
    const guestIcon = L.divIcon({
        className: "guest-marker-icon",
        html: `<div class="w-6 h-6 bg-blue-500 rounded-full border-2 border-white flex items-center justify-center text-white font-bold shadow-lg"></div>`,
        iconSize: [24, 24],
        iconAnchor: [12, 12],
    });

    return (
        <>
            {guestMarkers.map((marker) => (
                <Marker
                    key={marker.id}
                    position={marker.position}
                    icon={guestIcon}
                    eventHandlers={{
                        click: () => {
                            if (onMarkerClick) onMarkerClick(marker);
                        },
                    }}
                >
                    <Popup>
                        <div className="p-1">
                            <h3 className="font-bold">{marker.label}</h3>
                            <p className="text-xs">
                                Koordinat: {marker.position[0].toFixed(6)},{" "}
                                {marker.position[1].toFixed(6)}
                            </p>
                            <p className="text-xs text-gray-500">
                                Klik untuk melihat rute
                            </p>
                        </div>
                    </Popup>
                </Marker>
            ))}
        </>
    );
};

export default GuestClickableMarker;
