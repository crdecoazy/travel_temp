import React, { useState } from 'react';

const BookingForm = ({ selectedVehicle, userId, onBookingComplete }) => {
  const [formData, setFormData] = useState({
    trip_type: 'One-way',
    pickup_location: '',
    drop_location: '',
    pickup_time: ''
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    fetch('http://localhost:8000/bookings', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        ...formData,
        customer_id: userId,
        vehicle_id: selectedVehicle.id,
        pickup_time: new Date(formData.pickup_time).toISOString()
      })
    })
      .then(res => res.json())
      .then(data => {
        alert(`Booking Confirmed! ID: ${data.id}, Estimate: ₹${data.fare_estimate}`);
        onBookingComplete();
      })
      .catch(err => console.error(err));
  };

  return (
    <div className="booking-form">
      <h2>Book {selectedVehicle.model}</h2>
      <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '10px', maxWidth: '300px' }}>
        <input
          type="text"
          placeholder="Pickup Location"
          required
          value={formData.pickup_location}
          onChange={e => setFormData({...formData, pickup_location: e.target.value})}
        />
        <input
          type="text"
          placeholder="Drop Location"
          required
          value={formData.drop_location}
          onChange={e => setFormData({...formData, drop_location: e.target.value})}
        />
        <select
          value={formData.trip_type}
          onChange={e => setFormData({...formData, trip_type: e.target.value})}
        >
          <option value="One-way">One-way</option>
          <option value="Round trip">Round trip</option>
          <option value="Hourly rental">Hourly rental</option>
        </select>
        <input
          type="datetime-local"
          required
          value={formData.pickup_time}
          onChange={e => setFormData({...formData, pickup_time: e.target.value})}
        />
        <button type="submit">Confirm Booking</button>
      </form>
    </div>
  );
};

export default BookingForm;
