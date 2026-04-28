import React, { useState, useEffect } from 'react';
import { API_BASE_URL } from './VehicleList';

const DriverView = () => {
  const [driver, setDriver] = useState(null);
  const [mobile, setMobile] = useState('');
  const [trips, setTrips] = useState([]);
  const [loading, setLoading] = useState(false);

  const handleLogin = (e) => {
    e.preventDefault();
    setLoading(true);
    fetch(`${API_BASE_URL}/driver/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ mobile_number: mobile })
    })
      .then(res => {
        if (!res.ok) throw new Error('Driver not found');
        return res.json();
      })
      .then(data => {
        setDriver(data);
        return fetch(`${API_BASE_URL}/driver/${data.id}/trips`);
      })
      .then(res => res.json())
      .then(data => setTrips(data))
      .catch(err => alert(err.message))
      .finally(() => setLoading(false));
  };

  if (!driver) {
    return (
      <div className="flex flex-col items-center justify-center mt-20">
        <div className="bg-white p-8 rounded-xl shadow-lg w-full max-w-md border border-gray-100">
          <h1 className="text-2xl font-bold mb-6 text-center text-gray-800">Driver Login</h1>
          <form onSubmit={handleLogin} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Mobile Number</label>
              <input
                type="text"
                placeholder="Enter registered mobile number"
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none transition"
                value={mobile}
                onChange={e => setMobile(e.target.value)}
                required
              />
            </div>
            <button
              type="submit"
              disabled={loading}
              className="w-full bg-green-600 text-white font-semibold py-3 rounded-lg hover:bg-green-700 transition shadow-md"
            >
              {loading ? 'Logging in...' : 'Access Driver Panel'}
            </button>
          </form>
          <p className="text-xs text-center text-gray-400 mt-4 italic">Note: Driver must be added by Admin first.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-extrabold text-gray-900 tracking-tight">Driver Dashboard</h1>
          <p className="text-gray-500 font-medium">Welcome, {driver.full_name}</p>
        </div>
        <button onClick={() => setDriver(null)} className="text-sm text-red-600 hover:underline">Logout</button>
      </div>

      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
        <div className="p-6 border-b border-gray-50">
          <h3 className="font-bold text-lg">Available Trips</h3>
        </div>
        {trips.length === 0 ? (
          <div className="p-10 text-center text-gray-400">No trips available at the moment.</div>
        ) : (
          <div className="divide-y divide-gray-50">
            {trips.map(trip => (
              <div key={trip.id} className="p-6 flex flex-col md:flex-row justify-between items-center gap-4 hover:bg-gray-50 transition">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-2">
                    <span className="text-xs font-bold text-blue-600 bg-blue-50 px-2 py-1 rounded">#{trip.id}</span>
                    <span className="text-sm font-bold text-gray-900">{trip.pickup_location} → {trip.drop_location}</span>
                  </div>
                  <div className="text-sm text-gray-500">
                    🕒 {new Date(trip.pickup_time).toLocaleString()} | 🚖 {trip.trip_type}
                  </div>
                </div>
                <div className="flex items-center gap-6">
                  <div className="text-right">
                    <p className="text-xl font-black text-gray-900">₹{trip.fare_estimate}</p>
                  </div>
                  <button
                    onClick={() => alert('Trip Accepted!')}
                    className="bg-gray-900 text-white px-6 py-2 rounded-xl font-bold hover:bg-blue-600 transition"
                  >
                    Accept Trip
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default DriverView;
