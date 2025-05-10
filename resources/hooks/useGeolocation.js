// hooks/useGeolocation.js
import { useState, useCallback, useEffect } from 'react';

export default function useGeolocation(setUserLocation, setIsLoading) {
  const [watchId, setWatchId] = useState(null);

  // Clean up on unmount
  useEffect(() => {
    return () => {
      if (watchId) {
        navigator.geolocation.clearWatch(watchId);
      }
    };
  }, [watchId]);

  const stopLocationWatch = useCallback(() => {
    if (watchId) {
      navigator.geolocation.clearWatch(watchId);
      setWatchId(null);
      console.log('Location tracking stopped');
    }
  }, [watchId]);

  const toggleLiveLocation = useCallback(() => {
    if (watchId) {
      // If we're already tracking, stop tracking
      stopLocationWatch();
      setUserLocation(null); // Clear user location when stopping tracking
    } else {
      // Start tracking user location
      setIsLoading(true);
      try {
        if ('geolocation' in navigator) {
          const id = navigator.geolocation.watchPosition(
            (position) => {
              const { latitude, longitude } = position.coords;
              console.log('Got user position:', [latitude, longitude]);
              setUserLocation([latitude, longitude]);
              setIsLoading(false);
            },
            (error) => {
              console.error('Geolocation error:', error);
              alert(`Error mendapatkan lokasi: ${error.message}`);
              setWatchId(null);
              setIsLoading(false);
            },
            { 
              enableHighAccuracy: true, 
              timeout: 10000, 
              maximumAge: 0 
            }
          );
          
          console.log('Started location tracking with ID:', id);
          setWatchId(id);
        } else {
          alert('Geolocation tidak didukung oleh browser ini');
          setIsLoading(false);
        }
      } catch (error) {
        console.error('Error starting location tracking:', error);
        alert('Gagal memulai pelacakan lokasi');
        setIsLoading(false);
      }
    }
  }, [watchId, setUserLocation, setIsLoading, stopLocationWatch]);

  return { watchId, toggleLiveLocation, stopLocationWatch };
}