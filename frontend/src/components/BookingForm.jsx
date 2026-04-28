import React, { useState, useEffect } from 'react';
import { API_BASE_URL } from './VehicleList';

const BookingForm = ({ selectedVehicle, userId, onBookingComplete }) => {
  const [formData, setFormData] = useState({
    trip_type: 'One-way',
    pickup_location: '',
    drop_location: '',
    pickup_time: ''
  });
  const [submitting, setSubmitting] = useState(false);
  const [fareEstimate, setFareEstimate] = useState(null);

  useEffect(() => {
    if (formData.pickup_location && formData.drop_location) {
      const timer = setTimeout(() => {
        fetch(`${API_BASE_URL}/fare-estimate`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            vehicle_id: selectedVehicle.id,
            pickup_location: formData.pickup_location,
            drop_location: formData.drop_location
          })
        })
          .then(res => res.json())
          .then(data => setFareEstimate(data.fare_estimate))
          .catch(err => console.error(err));
      }, 500);
      return () => clearTimeout(timer);
    }
  }, [formData.pickup_location, formData.drop_location, selectedVehicle.id]);

  const handleSubmit = (e) => {
    e.preventDefault();
    setSubmitting(true);
    fetch(`${API_BASE_URL}/bookings`, {
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
        alert(`Booking Confirmed! ID: ${data.id}, Fare: ₹${data.fare_estimate}`);
        onBookingComplete();
      })
      .catch(err => console.error(err))
      .finally(() => setSubmitting(false));
  };

  return (
    <div className="bg-white p-8 rounded-2xl shadow-xl border border-gray-100">
      <h2 className="text-2xl font-bold mb-6 flex items-center gap-2">
        <span className="text-blue-600">📍</span> Trip Details
      </h2>
      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-1">
            <label className="text-sm font-bold text-gray-500 uppercase tracking-wider">Pickup Location</label>
            <input
              type="text"
              placeholder="e.g. Airport Terminal 1"
              className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none transition"
              required
              value={formData.pickup_location}
              onChange={e => setFormData({...formData, pickup_location: e.target.value})}
            />
          </div>
          <div className="space-y-1">
            <label className="text-sm font-bold text-gray-500 uppercase tracking-wider">Drop Location</label>
            <input
              type="text"
              placeholder="e.g. Grand Plaza Hotel"
              className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none transition"
              required
              value={formData.drop_location}
              onChange={e => setFormData({...formData, drop_location: e.target.value})}
            />
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-1">
            <label className="text-sm font-bold text-gray-500 uppercase tracking-wider">Trip Type</label>
            <select
              className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none transition appearance-none bg-no-repeat bg-right pr-10"
              style={{ backgroundImage: 'url("data:image/svg+xml,%3Csvg xmlns=\'http://www.w3.org/2000/svg\' fill=\'none\' viewBox=\'0 0 24 24\' stroke=\'currentColor\'%3E%3Cpath stroke-linecap=\'round\' stroke-linejoin=\'round\' stroke-width=\'2\' d=\'M19 9l-7 7-7-7\' /%3E%3C/svg%3E")', backgroundSize: '1.5em' }}
              value={formData.trip_type}
              onChange={e => setFormData({...formData, trip_type: e.target.value})}
            >
              <option value="One-way">One-way</option>
              <option value="Round trip">Round trip</option>
              <option value="Hourly rental">Hourly rental</option>
            </select>
          </div>
          <div className="space-y-1">
            <label className="text-sm font-bold text-gray-500 uppercase tracking-wider">Pickup Time</label>
            <input
              type="datetime-local"
              className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none transition"
              required
              value={formData.pickup_time}
              onChange={e => setFormData({...formData, pickup_time: e.target.value})}
            />
          </div>
        </div>

        <div className="pt-6 border-t border-gray-50">
           <div className="flex justify-between items-center mb-6">
              <span className="text-gray-500 font-medium">Estimated Fare</span>
              <span className="text-3xl font-black text-gray-900">
                {fareEstimate ? `₹${fareEstimate.toLocaleString()}` : '₹ --'}
              </span>
           </div>
           <button
            type="submit"
            disabled={submitting}
            className={`w-full bg-blue-600 text-white font-black py-4 rounded-xl hover:bg-blue-700 transition shadow-xl transform active:scale-[0.98] ${submitting ? 'opacity-50 cursor-not-allowed' : ''}`}
           >
            {submitting ? 'Confirming...' : 'CONFIRM BOOKING'}
           </button>
           <p className="text-center text-xs text-gray-400 mt-4">* Final fare may vary based on actual distance and traffic.</p>
        </div>
      </form>
    </div>
  );
};

export default BookingForm;
