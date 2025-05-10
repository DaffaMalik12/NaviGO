// resources/service/LocationService.js

/**
 * Service for handling geolocation related functions
 */

/**
 * Watches user's location and returns watch ID
 * @param {Function} successCallback - Callback for successful position updates
 * @param {Function} errorCallback - Callback for errors
 * @returns {number|null} - Watch ID or null if geolocation not supported
 */
export const watchUserLocation = (successCallback, errorCallback) => {
    if (!navigator.geolocation) {
      errorCallback('Geolocation tidak didukung di browser ini');
      return null;
    }
  
    const options = {
      enableHighAccuracy: true,
      timeout: 5000,
      maximumAge: 0
    };
  
    const watchId = navigator.geolocation.watchPosition(
      (position) => {
        successCallback({
          lat: position.coords.latitude,
          lng: position.coords.longitude
        });
      },
      (err) => {
        errorCallback(err.message);
      },
      options
    );
  
    return watchId;
  };
  
  /**
   * Clears the location watch
   * @param {number} watchId - The watch ID to clear
   */
  export const clearLocationWatch = (watchId) => {
    if (watchId && navigator.geolocation) {
      navigator.geolocation.clearWatch(watchId);
    }
  };
  
  /**
   * Geocodes an address to get coordinates using Nominatim OpenStreetMap API
   * @param {string} address - The address to geocode
   * @returns {Promise<Array<number>|null>} - Returns [lat, lng] or null if not found
   */
  export const geocodeAddress = async (address) => {
    try {
      const query = encodeURIComponent(address + ', Jakarta, Indonesia');
      const response = await fetch(
        `https://nominatim.openstreetmap.org/search?format=json&q=${query}&limit=1`
      );
      const data = await response.json();
      
      if (data && data.length > 0) {
        return [parseFloat(data[0].lat), parseFloat(data[0].lon)];
      }
      throw new Error('Lokasi tidak ditemukan');
    } catch (error) {
      console.error('Error during geocoding:', error);
      return null;
    }
  };
  
  /**
   * Reverse geocodes coordinates to get address
   * @param {number} lat - Latitude
   * @param {number} lng - Longitude
   * @returns {Promise<string|null>} - Address or null if not found
   */
  export const reverseGeocode = async (lat, lng) => {
    try {
      const response = await fetch(
        `https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lng}`
      );
      const data = await response.json();
      return data.display_name || null;
    } catch (error) {
      console.error('Error during reverse geocoding:', error);
      return null;
    }
  };