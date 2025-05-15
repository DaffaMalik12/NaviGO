/**
 * Mendapatkan rute alternatif menggunakan OpenRouteService API dengan error handling yang baik
 * @param {Array} startCoords - Koordinat awal [lat, lng]
 * @param {Array} endCoords - Koordinat tujuan [lat, lng]
 * @param {Object} options - Opsi tambahan
 * @returns {Array} - Array dari objek rute alternatif
 */
export async function getAlternativeRoutes(startCoords, endCoords, options = {}) {
  // Default options
  const defaultOptions = {
    serviceUrl: 'https://api.openrouteservice.org',
    apiKey: '5b3ce3597851110001cf6248221bd2524f854e9a8aca093e655e40eb', // API key ORS diperlukan
    profile: 'driving-car', // ORS menggunakan format nama profil yang berbeda
    maxRetries: 3,
    retryDelay: 1000,
    timeout: 10000,
    alternatives: 3 // Jumlah alternatif yang diinginkan
  };
  
  // Gabungkan default options dengan options yang diberikan
  const config = { ...defaultOptions, ...options };
  
  // Validasi API key
  if (!config.apiKey) {
    console.error('API key OpenRouteService diperlukan');
    return [];
  }
  
  // Pengecekan input koordinat
  if (!startCoords || !endCoords || 
      !Array.isArray(startCoords) || !Array.isArray(endCoords) ||
      startCoords.length !== 2 || endCoords.length !== 2) {
    console.error('Format koordinat tidak valid');
    return [];
  }
  
  // ORS API mengharapkan koordinat dalam format [lng, lat], bukan [lat, lng]
  const startLngLat = [startCoords[1], startCoords[0]];
  const endLngLat = [endCoords[1], endCoords[0]];
  
  console.log('Koordinat awal (lng,lat):', startLngLat);
  console.log('Koordinat tujuan (lng,lat):', endLngLat);
  
  // Fungsi untuk melakukan request dengan retry
  const fetchWithRetry = async (url, payload, retries = config.maxRetries) => {
    try {
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), config.timeout);
      
      console.log(`Mencoba request ke ${url}`);
      console.log(`Headers: Authorization: Bearer ${config.apiKey.substring(0, 5)}...`);
      
      const response = await fetch(url, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json; charset=utf-8',
          'Accept': 'application/json, application/geo+json, application/gpx+xml, img/png; charset=utf-8',
          'Authorization': `${config.apiKey}` // OpenRouteService mungkin tidak memerlukan "Bearer"
        },
        body: JSON.stringify(payload),
        signal: controller.signal
      });
      
      clearTimeout(timeoutId);
      
      if (!response.ok) {
        const errorText = await response.text();
        console.error(`OpenRouteService API error: ${response.status} - ${errorText}`);
        throw new Error(`OpenRouteService API error: ${response.status}`);
      }
      
      return await response.json();
    } catch (error) {
      if (retries > 0) {
        console.warn(`Mencoba ulang request (${config.maxRetries - retries + 1}/${config.maxRetries})...`);
        await new Promise(resolve => setTimeout(resolve, config.retryDelay));
        return fetchWithRetry(url, payload, retries - 1);
      }
      throw error;
    }
  };
  
  try {
    // URL endpoint untuk directions API di OpenRouteService
    const url = `${config.serviceUrl}/v2/directions/${config.profile}/geojson`;
    
    // Payload untuk OpenRouteService API
    const payload = {
      coordinates: [startLngLat, endLngLat],
      alternative_routes: {
        target_count: config.alternatives,
        weight_factor: 1.4, // Kontrol seberapa berbeda rute alternatif (1.0-2.0)
        share_factor: 0.6 // Kontrol seberapa banyak rute yang dibagi (0.0-1.0)
      },
      instructions: false,
      language: 'id',
      units: 'km'
    };
    
    // Log request untuk debugging
    console.log('OpenRouteService Request URL:', url);
    console.log('Request payload:', JSON.stringify(payload));
    
    // Lakukan request dengan retry mechanism
    const data = await fetchWithRetry(url, payload);
    
    // Log respons untuk debugging
    console.log('API Response:', JSON.stringify(data).substring(0, 200) + '...');
    
    if (!data.features || data.features.length === 0) {
      console.warn('Tidak ada rute yang ditemukan');
      return [];
    }
    
    // Ubah format respons OpenRouteService ke format yang diharapkan
    const routes = data.features.map((route, index) => {
      // ORS mengembalikan koordinat dalam GeoJSON format
      // Konversi dari format [lng, lat] ke [lat, lng]
      const points = route.geometry.coordinates.map(coord => [coord[1], coord[0]]);
      
      // Ekstrak properti rute dari OpenRouteService
      const properties = route.properties.summary;
      const distance = properties.distance * 1000; // ORS mengembalikan dalam km, konversi ke meter
      const duration = properties.duration; // ORS mengembalikan dalam detik
      
      return {
        id: index + 1,
        points: points,
        description: `Rute ${index + 1} (${(distance / 1000).toFixed(1)} km, ${Math.round(duration / 60)} menit)`,
        distance: distance,
        duration: duration
      };
    });
    
    console.log(`Berhasil mendapatkan ${routes.length} rute alternatif`);
    return routes;
  } catch (error) {
    console.error('Gagal mendapatkan rute alternatif:', error);
    return [];
  }
}