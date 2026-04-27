import React, { useState, useEffect } from 'react';

const VehicleList = ({ onSelectVehicle }) => {
  const [vehicles, setVehicles] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('http://localhost:8000/vehicles')
      .then(res => res.json())
      .then(data => {
        setVehicles(data);
        setLoading(true);
        setLoading(false);
      })
      .catch(err => console.error(err));
  }, []);

  if (loading) return <div>Loading vehicles...</div>;

  return (
    <div className="vehicle-list">
      <h2>Available Vehicles</h2>
      <div style={{ display: 'flex', gap: '20px', flexWrap: 'wrap' }}>
        {vehicles.map(vehicle => (
          <div key={vehicle.id} style={{ border: '1px solid #ccc', padding: '10px', borderRadius: '8px' }}>
            <h3>{vehicle.model}</h3>
            <p>Type: {vehicle.type}</p>
            <p>Capacity: {vehicle.capacity} seats</p>
            <p>Price: ₹{vehicle.price_per_km}/km</p>
            <button onClick={() => onSelectVehicle(vehicle)}>Select</button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default VehicleList;
