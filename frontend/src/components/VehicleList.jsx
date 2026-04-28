import React, { useState, useEffect } from 'react';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8000';

const VehicleList = ({ onSelectVehicle }) => {
  const [vehicles, setVehicles] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch(`${API_BASE_URL}/vehicles`)
      .then(res => res.json())
      .then(data => {
        setVehicles(data);
        setLoading(false);
      })
      .catch(err => console.error(err));
  }, []);

  if (loading) return (
    <div className="flex justify-center items-center py-20">
      <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
    </div>
  );

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
      {vehicles.map(vehicle => (
        <div key={vehicle.id} className="bg-white rounded-2xl shadow-sm hover:shadow-xl transition-shadow duration-300 border border-gray-100 overflow-hidden group">
          <div className="h-40 bg-gray-100 flex items-center justify-center relative overflow-hidden">
             <div className="absolute inset-0 bg-blue-600/5 group-hover:bg-blue-600/0 transition-colors"></div>
             <span className="text-gray-300 text-4xl font-black uppercase tracking-tighter opacity-50">{vehicle.type}</span>
          </div>
          <div className="p-6">
            <div className="flex justify-between items-start mb-4">
              <div>
                <h3 className="text-xl font-bold text-gray-900 mb-1">{vehicle.model}</h3>
                <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-50 text-blue-700">
                  {vehicle.type}
                </span>
              </div>
              <div className="text-right">
                <p className="text-2xl font-black text-blue-600">₹{vehicle.price_per_km}</p>
                <p className="text-xs text-gray-400">per km</p>
              </div>
            </div>

            <div className="flex items-center gap-4 text-sm text-gray-500 mb-6 border-t border-gray-50 pt-4">
              <span className="flex items-center gap-1">
                👤 {vehicle.capacity} Seats
              </span>
              <span className="flex items-center gap-1">
                📅 ₹{vehicle.price_per_day}/day
              </span>
            </div>

            <button
              onClick={() => onSelectVehicle(vehicle)}
              className="w-full bg-gray-900 text-white font-bold py-3 rounded-xl hover:bg-blue-600 transition-colors shadow-lg"
            >
              Book Now
            </button>
          </div>
        </div>
      ))}
    </div>
  );
};

export default VehicleList;
export { API_BASE_URL };
