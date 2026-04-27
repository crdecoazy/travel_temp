import React, { useState, useEffect } from 'react';

const AdminDashboard = () => {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('http://localhost:8000/admin/bookings')
      .then(res => res.json())
      .then(data => {
        setBookings(data);
        setLoading(false);
      })
      .catch(err => console.error(err));
  }, []);

  if (loading) return <div>Loading bookings...</div>;

  return (
    <div className="admin-dashboard">
      <h2>Admin Dashboard - All Bookings</h2>
      <table border="1" style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
        <thead>
          <tr style={{ backgroundColor: '#f2f2f2' }}>
            <th>ID</th>
            <th>Customer ID</th>
            <th>Vehicle ID</th>
            <th>Trip Type</th>
            <th>Pickup</th>
            <th>Drop</th>
            <th>Time</th>
            <th>Status</th>
            <th>Fare</th>
          </tr>
        </thead>
        <tbody>
          {bookings.map(booking => (
            <tr key={booking.id}>
              <td>{booking.id}</td>
              <td>{booking.customer_id}</td>
              <td>{booking.vehicle_id}</td>
              <td>{booking.trip_type}</td>
              <td>{booking.pickup_location}</td>
              <td>{booking.drop_location}</td>
              <td>{new Date(booking.pickup_time).toLocaleString()}</td>
              <td>{booking.status}</td>
              <td>₹{booking.fare_estimate}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default AdminDashboard;
