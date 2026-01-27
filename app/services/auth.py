import os
from datetime import datetime, timedelta
from jose import jwt
from passlib.context import CryptContext

# =====================
# CONFIG
# =====================

SECRET_KEY = os.getenv("SECRET_KEY") or "dev-secret-key"  # move to .env in prod
ALGORITHM = "HS256"
ACCESS_TOKEN_EXPIRE_MINUTES = 60

# =====================
# PASSWORD CONTEXT
# =====================
# Argon2 → modern, secure, NO 72-byte limit
pwd_context = CryptContext(
    schemes=["argon2"],
    deprecated="auto"
)

# =====================
# PASSWORD HELPERS
# =====================

def hash_password(password: str) -> str:
    """
    Hash a plain password using Argon2
    """
    return pwd_context.hash(password)


def verify_password(plain_password: str, hashed_password: str) -> bool:
    """
    Verify plain password against stored hash
    """
    return pwd_context.verify(plain_password, hashed_password)

# =====================
# JWT TOKEN
# =====================

def create_access_token(
    data: dict,
    expires_delta: timedelta | None = None
) -> str:
    to_encode = data.copy()
    expire = datetime.utcnow() + (
        expires_delta or timedelta(minutes=ACCESS_TOKEN_EXPIRE_MINUTES)
    )
    to_encode.update({"exp": expire})
    return jwt.encode(to_encode, SECRET_KEY, algorithm=ALGORITHM)
