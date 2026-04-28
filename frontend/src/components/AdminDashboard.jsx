import React, { useState, useEffect } from 'react';
import { API_BASE_URL } from './VehicleList';

const AdminDashboard = () => {
  const [activeTab, setActiveTab] = useState('bookings');
  const [bookings, setBookings] = useState([]);
  const [vehicles, setVehicles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({ total: 0, revenue: 0, active: 0 });
  const [newVehicle, setNewVehicle] = useState({
    type: 'Sedan',
    model: '',
    capacity: 4,
    price_per_km: 15,
    price_per_day: 2000
  });

  const fetchData = () => {
    setLoading(true);
    Promise.all([
      fetch(`${API_BASE_URL}/admin/bookings`).then(res => res.json()),
      fetch(`${API_BASE_URL}/vehicles`).then(res => res.json())
    ]).then(([bookingsData, vehiclesData]) => {
      setBookings(bookingsData);
      setVehicles(vehiclesData);
      const revenue = bookingsData.reduce((acc, curr) => acc + curr.fare_estimate, 0);
      setStats({
        total: bookingsData.length,
        revenue: revenue,
        active: bookingsData.filter(b => b.status === 'Pending' || b.status === 'Confirmed').length
      });
      setLoading(false);
    }).catch(err => console.error(err));
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleAddVehicle = (e) => {
    e.preventDefault();
    fetch(`${API_BASE_URL}/admin/vehicles`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(newVehicle)
    }).then(() => {
      fetchData();
      setNewVehicle({ type: 'Sedan', model: '', capacity: 4, price_per_km: 15, price_per_day: 2000 });
    });
  };

  const handleDeleteVehicle = (id) => {
    if (window.confirm('Are you sure you want to delete this vehicle?')) {
      fetch(`${API_BASE_URL}/admin/vehicles/${id}`, { method: 'DELETE' })
        .then(() => fetchData());
    }
  };

  if (loading) return (
    <div className="flex justify-center items-center py-20">
      <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
    </div>
  );

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <h2 className="text-3xl font-extrabold text-gray-900 tracking-tight">Admin Dashboard</h2>
        <div className="flex bg-gray-100 p-1 rounded-xl">
          <button
            onClick={() => setActiveTab('bookings')}
            className={`px-4 py-2 rounded-lg text-sm font-bold transition ${activeTab === 'bookings' ? 'bg-white shadow-sm text-blue-600' : 'text-gray-500'}`}
          >
            Bookings
          </button>
          <button
            onClick={() => setActiveTab('vehicles')}
            className={`px-4 py-2 rounded-lg text-sm font-bold transition ${activeTab === 'vehicles' ? 'bg-white shadow-sm text-blue-600' : 'text-gray-500'}`}
          >
            Vehicles
          </button>
        </div>
      </div>

      {activeTab === 'bookings' ? (
        <>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm">
              <p className="text-sm font-bold text-gray-400 uppercase tracking-wider mb-1">Total Bookings</p>
              <p className="text-4xl font-black text-gray-900">{stats.total}</p>
            </div>
            <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm">
              <p className="text-sm font-bold text-gray-400 uppercase tracking-wider mb-1">Revenue</p>
              <p className="text-4xl font-black text-green-600">₹{stats.revenue.toLocaleString()}</p>
            </div>
            <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm">
              <p className="text-sm font-bold text-gray-400 uppercase tracking-wider mb-1">Active Trips</p>
              <p className="text-4xl font-black text-blue-600">{stats.active}</p>
            </div>
          </div>

          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
            <div className="p-6 border-b border-gray-50">
              <h3 className="font-bold text-lg">Recent Bookings</h3>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-left">
                <thead>
                  <tr className="bg-gray-50 text-gray-400 text-xs uppercase font-bold tracking-widest">
                    <th className="px-6 py-4">ID</th>
                    <th className="px-6 py-4">Customer</th>
                    <th className="px-6 py-4">Pickup & Drop</th>
                    <th className="px-6 py-4">Time</th>
                    <th className="px-6 py-4">Status</th>
                    <th className="px-6 py-4">Fare</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-50">
                  {bookings.map(booking => (
                    <tr key={booking.id} className="hover:bg-gray-50 transition-colors">
                      <td className="px-6 py-4 font-mono text-xs text-gray-400">#{booking.id}</td>
                      <td className="px-6 py-4">
                        <p className="font-bold text-gray-900">User {booking.customer_id}</p>
                        <p className="text-xs text-gray-400">{booking.trip_type}</p>
                      </td>
                      <td className="px-6 py-4">
                        <p className="text-sm font-medium text-gray-700">{booking.pickup_location}</p>
                        <p className="text-xs text-gray-400">to {booking.drop_location}</p>
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-600">
                        {new Date(booking.pickup_time).toLocaleDateString()}
                        <br />
                        <span className="text-xs font-bold">{new Date(booking.pickup_time).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                      </td>
                      <td className="px-6 py-4">
                        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-bold ${
                          booking.status === 'Pending' ? 'bg-yellow-50 text-yellow-700' :
                          booking.status === 'Confirmed' ? 'bg-green-50 text-green-700' :
                          'bg-gray-50 text-gray-700'
                        }`}>
                          {booking.status}
                        </span>
                      </td>
                      <td className="px-6 py-4 font-bold text-gray-900">₹{booking.fare_estimate}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-1">
            <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm sticky top-24">
              <h3 className="font-bold text-lg mb-6">Add New Vehicle</h3>
              <form onSubmit={handleAddVehicle} className="space-y-4">
                <div>
                  <label className="text-xs font-bold text-gray-400 uppercase tracking-wider block mb-1">Model Name</label>
                  <input
                    type="text"
                    className="w-full px-4 py-2 border rounded-lg outline-none focus:ring-2 focus:ring-blue-500"
                    value={newVehicle.model}
                    onChange={e => setNewVehicle({...newVehicle, model: e.target.value})}
                    required
                  />
                </div>
                <div>
                  <label className="text-xs font-bold text-gray-400 uppercase tracking-wider block mb-1">Type</label>
                  <select
                    className="w-full px-4 py-2 border rounded-lg outline-none focus:ring-2 focus:ring-blue-500"
                    value={newVehicle.type}
                    onChange={e => setNewVehicle({...newVehicle, type: e.target.value})}
                  >
                    <option value="Sedan">Sedan</option>
                    <option value="SUV">SUV</option>
                    <option value="Van">Van</option>
                  </select>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="text-xs font-bold text-gray-400 uppercase tracking-wider block mb-1">Capacity</label>
                    <input
                      type="number"
                      className="w-full px-4 py-2 border rounded-lg outline-none focus:ring-2 focus:ring-blue-500"
                      value={newVehicle.capacity}
                      onChange={e => setNewVehicle({...newVehicle, capacity: parseInt(e.target.value)})}
                      required
                    />
                  </div>
                  <div>
                    <label className="text-xs font-bold text-gray-400 uppercase tracking-wider block mb-1">₹ / KM</label>
                    <input
                      type="number"
                      className="w-full px-4 py-2 border rounded-lg outline-none focus:ring-2 focus:ring-blue-500"
                      value={newVehicle.price_per_km}
                      onChange={e => setNewVehicle({...newVehicle, price_per_km: parseFloat(e.target.value)})}
                      required
                    />
                  </div>
                </div>
                <button type="submit" className="w-full bg-blue-600 text-white font-bold py-3 rounded-lg hover:bg-blue-700 transition">
                  Save Vehicle
                </button>
              </form>
            </div>
          </div>
          <div className="lg:col-span-2">
            <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
              <table className="w-full text-left">
                <thead>
                  <tr className="bg-gray-50 text-gray-400 text-xs uppercase font-bold tracking-widest">
                    <th className="px-6 py-4">Vehicle</th>
                    <th className="px-6 py-4">Capacity</th>
                    <th className="px-6 py-4">Pricing</th>
                    <th className="px-6 py-4 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-50">
                  {vehicles.map(vehicle => (
                    <tr key={vehicle.id} className="hover:bg-gray-50 transition-colors">
                      <td className="px-6 py-4">
                        <p className="font-bold text-gray-900">{vehicle.model}</p>
                        <p className="text-xs text-gray-400">{vehicle.type}</p>
                      </td>
                      <td className="px-6 py-4 text-sm">{vehicle.capacity} Seats</td>
                      <td className="px-6 py-4 text-sm">
                        ₹{vehicle.price_per_km}/km
                        <br />
                        <span className="text-gray-400 italic text-xs">₹{vehicle.price_per_day}/day</span>
                      </td>
                      <td className="px-6 py-4 text-right">
                        <button
                          onClick={() => handleDeleteVehicle(vehicle.id)}
                          className="text-red-500 hover:text-red-700 font-bold text-sm"
                        >
                          Delete
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminDashboard;
