FROM python:3.11-slim

WORKDIR /app

COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

# Copier tout le reste du code et les scripts
COPY . .

# Rendre les deux scripts exécutables en une seule commande
RUN chmod +x ./wait-for-it.sh ./entrypoint.sh

# Définir le point d'entrée
ENTRYPOINT [ "./entrypoint.sh" ]
