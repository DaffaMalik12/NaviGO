// GuestRouteInfo.jsx
import React from "react";

const GuestRouteInfo = ({ marker, onShowRoute, onClose }) => {
    return (
        <div className="absolute bottom-4 right-4 z-30 bg-white p-4 rounded-lg shadow-lg max-w-sm">
            <div className="flex justify-between items-start mb-2">
                <h3 className="font-bold text-lg">Informasi Lokasi</h3>
                <button
                    onClick={onClose}
                    className="text-gray-500 hover:text-gray-700"
                >
                    <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="h-5 w-5"
                        viewBox="0 0 20 20"
                        fill="currentColor"
                    >
                        <path
                            fillRule="evenodd"
                            d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
                            clipRule="evenodd"
                        />
                    </svg>
                </button>
            </div>

            <div className="mb-3">
                <p className="font-semibold text-sm text-gray-600">
                    Koordinat yang dipilih:
                </p>
                <p className="text-sm">
                    {marker.position[0].toFixed(6)},{" "}
                    {marker.position[1].toFixed(6)}
                </p>
            </div>

            <div className="mb-3">
                <p className="font-semibold text-sm text-gray-600">
                    Waktu pilih:
                </p>
                <p className="text-sm">{marker.timestamp}</p>
            </div>

            <div className="mb-4">
                <p className="text-sm text-gray-700">
                    Apakah Anda ingin melihat rute ke lokasi ini?
                </p>
            </div>

            <div className="flex space-x-2">
                <button
                    onClick={onShowRoute}
                    className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-md text-sm flex-1"
                >
                    Tampilkan Rute
                </button>
                <button
                    onClick={onClose}
                    className="bg-gray-200 hover:bg-gray-300 text-gray-800 px-4 py-2 rounded-md text-sm"
                >
                    Batal
                </button>
            </div>
        </div>
    );
};

export default GuestRouteInfo;
