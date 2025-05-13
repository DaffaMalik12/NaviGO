/**
 * Mendapatkan rute alternatif menggunakan OSRM API dengan error handling yang lebih baik
 * @param {Array} startCoords - Koordinat awal [lat, lng]
 * @param {Array} endCoords - Koordinat tujuan [lat, lng]
 * @param {Object} options - Opsi tambahan
 * @returns {Array} - Array dari objek rute alternatif
 */
export async function getAlternativeRoutes(startCoords, endCoords, options = {}) {
  // Default options
  const defaultOptions = {
    serviceUrl: 'https://router.project-osrm.org',
    profile: 'driving',
    maxRetries: 3,
    retryDelay: 1000,
    timeout: 5000
  };
  
  // Gabungkan default options dengan options yang diberikan
  const config = { ...defaultOptions, ...options };
  
  // Pengecekan input koordinat
  if (!startCoords || !endCoords || 
      !Array.isArray(startCoords) || !Array.isArray(endCoords) ||
      startCoords.length !== 2 || endCoords.length !== 2) {
    console.error('Format koordinat tidak valid');
    return [];
  }
  
  // OSRM mengharapkan koordinat dalam format [lng, lat], bukan [lat, lng]
  const startLngLat = `${startCoords[1]},${startCoords[0]}`;
  const endLngLat = `${endCoords[1]},${endCoords[0]}`;
  
  // Fungsi untuk melakukan request dengan retry
  const fetchWithRetry = async (url, retries = config.maxRetries) => {
    try {
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), config.timeout);
      
      const response = await fetch(url, { signal: controller.signal });
      clearTimeout(timeoutId);
      
      if (!response.ok) {
        throw new Error(`OSRM API error: ${response.status}`);
      }
      
      return await response.json();
    } catch (error) {
      if (retries > 0) {
        console.warn(`Mencoba ulang request (${config.maxRetries - retries + 1}/${config.maxRetries})...`);
        await new Promise(resolve => setTimeout(resolve, config.retryDelay));
        return fetchWithRetry(url, retries - 1);
      }
      throw error;
    }
  };
  
  try {
    // Buat URL API OSRM
    const url = `${config.serviceUrl}/route/v1/${config.profile}/${startLngLat};${endLngLat}?alternatives=true&overview=full&geometries=geojson`;
    
    // Log URL untuk debugging
    console.log('OSRM Request URL:', url);
    
    // Lakukan request dengan retry mechanism
    const data = await fetchWithRetry(url);
    
    if (!data.routes || data.routes.length === 0) {
      console.warn('Tidak ada rute yang ditemukan');
      return [];
    }
    
    // Ubah format respons OSRM ke format yang diharapkan
    const routes = data.routes.map((route, index) => {
      // OSRM mengembalikan koordinat dalam GeoJSON format (jika geometries=geojson)
      // Konversi dari format [lng, lat] ke [lat, lng]
      const points = route.geometry.coordinates.map(coord => [coord[1], coord[0]]);
      
      return {
        id: index + 1,
        points: points,
        description: `Rute ${index + 1} (${(route.distance / 1000).toFixed(1)} km, ${Math.round(route.duration / 60)} menit)`,
        distance: route.distance,
        duration: route.duration
      };
    });
    
    console.log(`Berhasil mendapatkan ${routes.length} rute alternatif`);
    return routes;
  } catch (error) {
    console.error('Gagal mendapatkan rute alternatif:', error);
    return [];
  }
}
