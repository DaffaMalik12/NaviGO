/**
 * Geocodes an address to get coordinates using Geocoding.id API
 * @param {string} address - The address to geocode
 * @param {string} apiKey - Your Geocoding.id API key
 * @returns {Promise<Array<number>|null>} - Returns [lat, lng] or null if not found
 */
export const geocodeAddress = async (address, apiKey) => {
  try {
    // Format alamat untuk query
    const query = encodeURIComponent(address);
    
    // Endpoint Geocoding.id API
    const url = `https://api.geocoding.id/v1/geocode?address=${query}&key=${apiKey}`;
    
    const response = await fetch(url, {
      method: 'GET',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json'
      }
    });
    
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    
    const data = await response.json();
    
    // Periksa hasil
    if (data && data.status === "OK" && data.results && data.results.length > 0) {
      const location = data.results[0].geometry.location;
      return [location.lat, location.lng];
    } else {
      console.warn('Lokasi tidak ditemukan di Geocoding.id:', data.status);
      throw new Error('Lokasi tidak ditemukan');
    }
  } catch (error) {
    console.error('Error during geocoding with Geocoding.id:', error);
    return null;
  }
};
