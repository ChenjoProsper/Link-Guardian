#!/bin/bash

# Attendre que la base de données soit prête
# Le script s'arrêtera ici jusqu'à ce que db:5432 soit accessible
./wait-for-it.sh db:5432 --timeout=30 --strict -- echo "Database is up"

# Appliquer les migrations de la base de données
echo "Applying database migrations..."
alembic upgrade head

# Lancer l'application principale (Uvicorn)
echo "Starting application..."
uvicorn app:app --host 0.0.0.0 --port 8000
