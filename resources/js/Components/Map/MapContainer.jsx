import React, { forwardRef } from 'react';
import { MapContainer as LeafletMapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import Routing from './Routing';
import { UIN_COORDS } from '../../../utils/mapUtils';
import { getBuildingIcons } from '../Icons/MarkerIcons';
import { campusBuildings } from '../../../data/buildingsData';

const MapContainer = forwardRef(({ 
  userLocation, 
  selectedBuilding, 
  searchTerm, 
  selectedFilter 
}, ref) => {
  const buildingIcons = getBuildingIcons();
  
  // Filter buildings based on type and search term
  const filteredBuildings = selectedFilter === 'all' 
    ? campusBuildings 
    : campusBuildings.filter(building => building.type === selectedFilter);
    
  const searchedBuildings = searchTerm
    ? filteredBuildings.filter(building => 
        building.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        building.info.toLowerCase().includes(searchTerm.toLowerCase()))
    : filteredBuildings;

  return (
    <LeafletMapContainer
      center={UIN_COORDS}
      zoom={15}
      scrollWheelZoom={true}
      style={{ height: '100%', width: '100%' }}
      ref={ref}  // Using the forwarded ref here
      className="z-0"
    >
      <TileLayer
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
      />
      
      {/* UIN Main Marker */}
      <Marker position={UIN_COORDS}>
        <Popup>
          <div className="p-1">
            <h3 className="font-bold">UIN Syarif Hidayatullah Jakarta</h3>
            <p>Jl. Ir H. Juanda No.95, Ciputat, Tangerang Selatan</p>
          </div>
        </Popup>
      </Marker>
      
      {/* Campus Buildings */}
      {searchedBuildings.map((building, index) => (
        <Marker
          key={`${building.id || building.name}-${index}`}  // Better key using building id if available
          position={building.position}
          icon={buildingIcons[building.type]}
        >
          <Popup>
            <div className="p-1">
              <h3 className="font-bold">{building.name}</h3>
              <p>{building.info}</p>
            </div>
          </Popup>
        </Marker>
      ))}
      
      {/* User Location Marker */}
      {userLocation && (
        <Marker position={userLocation} icon={buildingIcons.user}>
          <Popup>Lokasi Anda</Popup>
        </Marker>
      )}
      
      {/* Routing */}
      {userLocation && selectedBuilding 
        ? <Routing start={userLocation} end={selectedBuilding.position} buildingIcons={buildingIcons} />
        : userLocation && <Routing start={userLocation} end={UIN_COORDS} buildingIcons={buildingIcons} />
      }
    </LeafletMapContainer>
  );
});

export default MapContainer;