import { useState } from 'react'
import './App.css'
import VehicleList from './components/VehicleList'
import BookingForm from './components/BookingForm'
import AdminDashboard from './components/AdminDashboard'

function App() {
  const [user, setUser] = useState(null)
  const [mobile, setMobile] = useState('')
  const [selectedVehicle, setSelectedVehicle] = useState(null)
  const [view, setView] = useState('user') // 'user' or 'admin'

  const handleLogin = (e) => {
    e.preventDefault()
    fetch('http://localhost:8000/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ mobile_number: mobile })
    })
      .then(res => res.json())
      .then(data => setUser(data))
      .catch(err => console.error(err))
  }

  if (!user && view === 'user') {
    return (
      <div className="App">
        <nav style={{ marginBottom: '20px' }}>
          <button onClick={() => setView('user')}>Customer View</button>
          <button onClick={() => setView('admin')}>Admin View</button>
        </nav>
        <h1>Login</h1>
        <form onSubmit={handleLogin}>
          <input
            type="text"
            placeholder="Mobile Number"
            value={mobile}
            onChange={e => setMobile(e.target.value)}
            required
          />
          <button type="submit">Login / Register</button>
        </form>
      </div>
    )
  }

  return (
    <div className="App">
      <nav style={{ marginBottom: '20px' }}>
        <button onClick={() => { setView('user'); setSelectedVehicle(null); }}>Customer View</button>
        <button onClick={() => setView('admin')}>Admin View</button>
        {user && <button onClick={() => setUser(null)}>Logout ({user.full_name})</button>}
      </nav>

      {view === 'user' ? (
        <>
          <h1>Travel Business Booking</h1>
          {!selectedVehicle ? (
            <VehicleList onSelectVehicle={setSelectedVehicle} />
          ) : (
            <div>
              <button onClick={() => setSelectedVehicle(null)}>Back to List</button>
              <BookingForm
                selectedVehicle={selectedVehicle}
                userId={user.user_id}
                onBookingComplete={() => setSelectedVehicle(null)}
              />
            </div>
          )}
        </>
      ) : (
        <AdminDashboard />
      )}
    </div>
  )
}

export default App
