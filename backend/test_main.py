import pytest
from fastapi.testclient import TestClient
from backend.main import app

client = TestClient(app)

def test_health_check():
    response = client.get('/health')
    assert response.status_code == 200
    assert response.json() == {'status': 'ok'}

def test_list_vehicles():
    response = client.get('/vehicles')
    assert response.status_code == 200
    assert isinstance(response.json(), list)

def test_admin_bookings():
    response = client.get('/admin/bookings')
    assert response.status_code == 200
    assert isinstance(response.json(), list)
