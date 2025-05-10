// Geocode service using Nominatim OpenStreetMap API

/**
 * Geocodes an address to get coordinates
 * @param {string} address - The address to geocode
 * @returns {Promise<Array<number>|null>} - Returns [lat, lng] or null if not found
 */
export const geocodeAddress = async (address) => {
    try {
      const query = encodeURIComponent(address + ', Jakarta, Indonesia');
      const response = await fetch(`https://nominatim.openstreetmap.org/search?format=json&q=${query}&limit=1`);
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