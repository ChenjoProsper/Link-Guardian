# test/test_main.py
from fastapi.testclient import TestClient
from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker
import pytest
import os # Importez os pour supprimer le fichier de DB

# Imports depuis la racine du projet (sans points)
from app import app, get_db
from core import Base
from config import settings

# --- Configuration de la base de données de test ---
# On s'assure que le chemin est correct, même si le test est lancé depuis la racine
TEST_DB_PATH = "./test.db" 
SQLALCHEMY_DATABASE_URL = f"sqlite:///{TEST_DB_PATH}"

engine = create_engine(
    SQLALCHEMY_DATABASE_URL, connect_args={"check_same_thread": False}
)
TestingSessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)

# --- Fixtures Pytest ---

@pytest.fixture(scope="function")
def db_session():
    """
    Crée une base de données et une session propres pour chaque test.
    Supprime le fichier de base de données après le test.
    """
    if os.path.exists(TEST_DB_PATH):
        os.remove(TEST_DB_PATH)
        
    Base.metadata.create_all(bind=engine)
    db = TestingSessionLocal()
    try:
        yield db
    finally:
        db.close()
        if os.path.exists(TEST_DB_PATH):
            os.remove(TEST_DB_PATH)

@pytest.fixture(scope="function")
def client(db_session):
    """
    Crée un client de test qui utilise la session de base de données de test.
    """
    def override_get_db():
        yield db_session

    app.dependency_overrides[get_db] = override_get_db
    yield TestClient(app)
    app.dependency_overrides.clear()

# --- Tests ---

def test_create_user(client):
    """
    Teste la création d'un nouvel utilisateur.
    """
    response = client.post(
        "/users/",
        json={"email": "testuser@example.com", "password": "password123"},
    )
    assert response.status_code == 201, response.text
    data = response.json()
    assert data["email"] == "testuser@example.com"
    assert "id" in data
    assert "password" not in data # Le mot de passe hashé ne doit pas être retourné

def test_login_user(client):
    """
    Teste la connexion d'un utilisateur existant.
    """
    response = client.post(
        "/users/",
        json={"email": "testuser@example.com", "password": "password123"},
    )
    
    response = client.post(
        "/token/",
        json={"email": "testuser@example.com", "password": "password123"},
    )
    assert response.status_code == 200, response.text
    data = response.json()
    assert "access_token" in data
    assert "token_type" in data


