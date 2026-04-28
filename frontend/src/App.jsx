import { useState } from 'react'
import './App.css'
import VehicleList, { API_BASE_URL } from './components/VehicleList'
import BookingForm from './components/BookingForm'
import AdminDashboard from './components/AdminDashboard'
import DriverView from './components/DriverView'
import MyBookings from './components/MyBookings'

function App() {
  const [user, setUser] = useState(null)
  const [mobile, setMobile] = useState('')
  const [selectedVehicle, setSelectedVehicle] = useState(null)
  const [view, setView] = useState('user') // 'user', 'admin', 'driver'
  const [userSubView, setUserSubView] = useState('vehicles') // 'vehicles', 'bookings'
  const [adminAuth, setAdminAuth] = useState(false)
  const [password, setPassword] = useState('')

  const handleLogin = (e) => {
    e.preventDefault()
    fetch(`${API_BASE_URL}/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ mobile_number: mobile })
    })
      .then(res => res.json())
      .then(data => setUser(data))
      .catch(err => console.error(err))
  }

  const handleAdminAuth = (e) => {
    e.preventDefault()
    if (password === 'admin123') {
      setAdminAuth(true)
    } else {
      alert('Invalid password')
    }
  }

  return (
    <div className="min-h-screen bg-gray-50 text-gray-900 font-sans">
      <nav className="bg-white shadow-md p-4 flex justify-between items-center sticky top-0 z-10">
        <div className="flex gap-2 md:gap-4 overflow-x-auto pb-2 md:pb-0">
          <button
            onClick={() => { setView('user'); setSelectedVehicle(null); }}
            className={`px-3 md:px-4 py-2 rounded-lg font-medium whitespace-nowrap transition ${view === 'user' ? 'bg-blue-600 text-white' : 'text-gray-600 hover:bg-gray-100'}`}
          >
            Customer View
          </button>
          <button
            onClick={() => setView('driver')}
            className={`px-3 md:px-4 py-2 rounded-lg font-medium whitespace-nowrap transition ${view === 'driver' ? 'bg-green-600 text-white' : 'text-gray-600 hover:bg-gray-100'}`}
          >
            Driver View
          </button>
          <button
            onClick={() => setView('admin')}
            className={`px-3 md:px-4 py-2 rounded-lg font-medium whitespace-nowrap transition ${view === 'admin' ? 'bg-gray-900 text-white' : 'text-gray-600 hover:bg-gray-100'}`}
          >
            Admin View
          </button>
        </div>
        {user && view === 'user' && (
          <div className="hidden md:flex items-center gap-4">
            <span className="text-gray-600">Hi, <span className="font-semibold text-gray-900">{user.full_name}</span></span>
            <button
              onClick={() => setUser(null)}
              className="text-sm text-red-600 hover:underline"
            >
              Logout
            </button>
          </div>
        )}
      </nav>

      <main className="max-w-6xl mx-auto p-4 md:p-6">
        {view === 'user' ? (
          !user ? (
            <div className="flex flex-col items-center justify-center mt-20">
              <div className="bg-white p-8 rounded-xl shadow-lg w-full max-w-md border border-gray-100">
                <h1 className="text-2xl font-bold mb-6 text-center text-gray-800">Welcome Back</h1>
                <p className="text-gray-500 mb-6 text-center">Login to book your next trip</p>
                <form onSubmit={handleLogin} className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Mobile Number</label>
                    <input
                      type="text"
                      placeholder="Enter mobile number"
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition"
                      value={mobile}
                      onChange={e => setMobile(e.target.value)}
                      required
                    />
                  </div>
                  <button
                    type="submit"
                    className="w-full bg-blue-600 text-white font-semibold py-3 rounded-lg hover:bg-blue-700 transition shadow-md"
                  >
                    Continue
                  </button>
                </form>
              </div>
            </div>
          ) : (
            <div className="space-y-8 animate-in fade-in duration-500">
              <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                <h1 className="text-3xl font-extrabold text-gray-900 tracking-tight">
                  {selectedVehicle ? 'Complete Your Booking' : (userSubView === 'vehicles' ? 'Select Your Vehicle' : 'Your Trip History')}
                </h1>
                {!selectedVehicle && (
                   <div className="flex bg-white p-1 rounded-xl shadow-sm border border-gray-100">
                      <button
                        onClick={() => setUserSubView('vehicles')}
                        className={`px-4 py-2 rounded-lg text-sm font-bold transition ${userSubView === 'vehicles' ? 'bg-blue-50 text-blue-600' : 'text-gray-500'}`}
                      >
                        Book Trip
                      </button>
                      <button
                        onClick={() => setUserSubView('bookings')}
                        className={`px-4 py-2 rounded-lg text-sm font-bold transition ${userSubView === 'bookings' ? 'bg-blue-50 text-blue-600' : 'text-gray-500'}`}
                      >
                        My Bookings
                      </button>
                   </div>
                )}
                {selectedVehicle && (
                  <button
                    onClick={() => setSelectedVehicle(null)}
                    className="flex items-center text-blue-600 font-medium hover:text-blue-800 transition"
                  >
                    ← Change Vehicle
                  </button>
                )}
              </div>

              {selectedVehicle ? (
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-start">
                   <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
                      <div className="h-48 bg-blue-50 rounded-xl mb-4 flex items-center justify-center">
                        <span className="text-blue-300 text-5xl italic font-black uppercase">{selectedVehicle.type}</span>
                      </div>
                      <h2 className="text-2xl font-bold mb-2">{selectedVehicle.model}</h2>
                      <div className="grid grid-cols-2 gap-4 mt-6">
                        <div className="bg-gray-50 p-4 rounded-lg">
                          <p className="text-xs text-gray-400 uppercase font-bold tracking-wider">Per KM Rate</p>
                          <p className="text-lg font-bold text-gray-800">₹{selectedVehicle.price_per_km}</p>
                        </div>
                        <div className="bg-gray-50 p-4 rounded-lg">
                          <p className="text-xs text-gray-400 uppercase font-bold tracking-wider">Daily Rate</p>
                          <p className="text-lg font-bold text-gray-800">₹{selectedVehicle.price_per_day}</p>
                        </div>
                      </div>
                   </div>
                   <BookingForm
                    selectedVehicle={selectedVehicle}
                    userId={user.user_id}
                    onBookingComplete={() => { setSelectedVehicle(null); setUserSubView('bookings'); }}
                  />
                </div>
              ) : (
                userSubView === 'vehicles' ? <VehicleList onSelectVehicle={setSelectedVehicle} /> : <MyBookings userId={user.user_id} />
              )}
            </div>
          )
        ) : view === 'driver' ? (
          <DriverView />
        ) : (
          !adminAuth ? (
            <div className="flex flex-col items-center justify-center mt-20">
              <div className="bg-white p-8 rounded-xl shadow-lg w-full max-w-md border border-gray-100">
                <h1 className="text-2xl font-bold mb-6 text-center text-gray-800">Admin Login</h1>
                <form onSubmit={handleAdminAuth} className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Password</label>
                    <input
                      type="password"
                      placeholder="Enter admin password"
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none transition"
                      value={password}
                      onChange={e => setPassword(e.target.value)}
                      required
                    />
                  </div>
                  <button
                    type="submit"
                    className="w-full bg-gray-900 text-white font-semibold py-3 rounded-lg hover:bg-black transition shadow-md"
                  >
                    Login to Dashboard
                  </button>
                </form>
                <p className="text-xs text-center text-gray-400 mt-4">Hint: admin123</p>
              </div>
            </div>
          ) : (
            <div className="animate-in slide-in-from-bottom-4 duration-500">
              <div className="flex justify-end mb-4">
                <button onClick={() => setAdminAuth(false)} className="text-sm text-red-600 hover:underline">Logout Admin</button>
              </div>
              <AdminDashboard />
            </div>
          )
        )}
      </main>
    </div>
  )
}

export default App
