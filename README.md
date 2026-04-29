# Travel Business Management System

A comprehensive system for managing a travel business, including customer booking, driver management, and an admin control panel.

## Features

- **User (Customer)**: Login via mobile, search/select vehicles, get real-time fare estimates, book trips, and view history.
- **Admin**: Dashboard with revenue/booking stats, manage bookings, and manage vehicles (add/delete).
- **Driver**: Driver-specific login and view of available/assigned trips.
- **UI**: Modern, responsive design using Tailwind CSS 4.0.

## Tech Stack
- **Backend:** Python (FastAPI) + SQLAlchemy (SQLite)
- **Frontend:** React.js (Vite) + Tailwind CSS 4.0
- **Testing:** Pytest & Playwright

---

## How to Run

### 1. Prerequisites
- Python 3.12+
- Node.js 22+
- npm

### 2. Backend Setup
Navigate to the `backend` directory:
```bash
cd backend
```

Create and activate a virtual environment:
```bash
python3 -m venv venv
source venv/bin/activate  # On Windows use `venv\Scripts\activate`
```

Install dependencies:
```bash
pip install -r requirements.txt
```

Run the FastAPI server:
```bash
uvicorn main:app --reload --host 0.0.0.0 --port 8000
```
The API will be available at `http://localhost:8000`.

### 3. Frontend Setup
Navigate to the `frontend` directory:
```bash
cd frontend
```

Install dependencies:
```bash
npm install
```

Run the development server:
```bash
npm run dev
```
The application will be available at `http://localhost:3000`.

### 4. Initial Setup & Credentials
- **Database**: A SQLite database (`travel_business.db`) will be created automatically in the root or backend folder when the server starts.
- **Admin Login**: Go to "Admin View" and use password `admin123`.
- **Seeding Data**: You can add initial vehicles via the Admin Dashboard.
- **Driver Login**: Add a driver in the backend (via API or manual DB entry) to test the Driver View with their mobile number.

---

## Testing
- **Backend**: Run `pytest backend/test_main.py`
- **Frontend Verification**: See Playwright scripts in `verification/` (if available).
