# security.py

from datetime import datetime, timedelta, timezone
from typing import Optional
from jose import JWTError, jwt
from passlib.context import CryptContext

pwd_context = CryptContext(schemes=["argon2", "bcrypt"], deprecated="auto")

def verify_password(plain_password: str, hashed_password: str) -> bool:
    return pwd_context.verify(plain_password, hashed_password)

def get_password_hash(password: str) -> str:
    return pwd_context.hash(password)

secret_key = "6b292821039844f8dde0148a9416db019f8d6c3e17531c73485f3ea2c8026276"

# Algorithme de signature du token
ALGORITHM = "HS256"

# Durée de validité du token en minutes
ACCESS_TOKEN_EXPIRE_MINUTES = 3600


def create_access_token(data: dict, expires_delta: Optional[timedelta] = None):
    to_encode = data.copy()
    
    # Définir le temps d'expiration
    if expires_delta:
        expire = datetime.now(timezone.utc) + expires_delta
    else:
        expire = datetime.now(timezone.utc) + timedelta(minutes=ACCESS_TOKEN_EXPIRE_MINUTES)
    
    to_encode.update({"exp": expire})
    
    # Encoder le token
    encoded_jwt = jwt.encode(to_encode, secret_key, algorithm=ALGORITHM)
    
    return encoded_jwt

