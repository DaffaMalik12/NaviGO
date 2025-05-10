import React from 'react';

const FilterButtons = ({ selectedFilter, onFilterChange }) => {
  const filters = [
    { id: 'all', name: 'Semua', color: 'indigo' },
    { id: 'academic', name: 'Akademik', color: 'blue' },
    { id: 'facility', name: 'Fasilitas', color: 'green' },
    { id: 'administration', name: 'Administrasi', color: 'red' },
    { id: 'parking', name: 'Parkir', color: 'orange' }
  ];

  return (
    <div className="flex space-x-2 overflow-x-auto py-2 scrollbar-hide">
      {filters.map(filter => (
        <button
          key={filter.id}
          onClick={() => onFilterChange(filter.id)}
          className={`px-3 py-1 rounded-full text-sm whitespace-nowrap ${
            selectedFilter === filter.id
              ? `bg-${filter.color}-600 text-white`
              : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
          }`}
        >
          {filter.name}
        </button>
      ))}
    </div>
  );
};

export default FilterButtons;
