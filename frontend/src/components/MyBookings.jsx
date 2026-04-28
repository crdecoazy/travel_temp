import React, { useState, useEffect } from 'react';
import { API_BASE_URL } from './VehicleList';

const MyBookings = ({ userId }) => {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch(`${API_BASE_URL}/users/${userId}/bookings`)
      .then(res => res.json())
      .then(data => {
        setBookings(data);
        setLoading(false);
      })
      .catch(err => console.error(err));
  }, [userId]);

  if (loading) return (
    <div className="flex justify-center items-center py-20">
      <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
    </div>
  );

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold text-gray-900">Your Bookings</h2>
      {bookings.length === 0 ? (
        <div className="bg-white p-10 rounded-2xl border border-dashed border-gray-200 text-center text-gray-400">
          You haven't made any bookings yet.
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-4">
          {bookings.map(booking => (
            <div key={booking.id} className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm flex flex-col md:flex-row justify-between items-center gap-4">
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-2">
                  <span className={`text-xs font-bold px-2 py-1 rounded ${
                    booking.status === 'Pending' ? 'bg-yellow-50 text-yellow-700' : 'bg-green-50 text-green-700'
                  }`}>
                    {booking.status}
                  </span>
                  <span className="text-sm font-bold text-gray-900">{booking.pickup_location} to {booking.drop_location}</span>
                </div>
                <p className="text-sm text-gray-500">
                  {new Date(booking.pickup_time).toLocaleString()} | {booking.trip_type}
                </p>
              </div>
              <div className="text-right">
                <p className="text-2xl font-black text-gray-900">₹{booking.fare_estimate}</p>
                <button className="text-blue-600 text-sm font-bold hover:underline">Rebook</button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default MyBookings;
