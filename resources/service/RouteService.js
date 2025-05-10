export async function getAlternativeRoutes(startCoords, endCoords) {
    try {
      // Buat tiga rute alternatif buatan
      const [startLat, startLng] = startCoords;
      const [endLat, endLng] = endCoords;
  
      const routes = Array.from({ length: 3 }).map((_, index) => {
        const offset = 0.001 * (index + 1); // makin jauh offsetnya
  
        const midPoint = [
          (startLat + endLat) / 2 + (Math.random() - 0.5) * offset,
          (startLng + endLng) / 2 + (Math.random() - 0.5) * offset,
        ];
  
        return {
          id: index + 1,
          points: [
            [startLat, startLng],
            midPoint,
            [endLat, endLng],
          ],
          description: `Rute alternatif ${index + 1}`
        };
      });
  
      return routes;
    } catch (error) {
      console.error('Gagal membuat rute alternatif:', error);
      return [];
    }
  }
  