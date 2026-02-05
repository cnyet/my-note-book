from fastapi import APIRouter, Depends, HTTPException, status
from fastapi.security import OAuth2PasswordBearer, OAuth2PasswordRequestForm
from sqlalchemy.orm import Session
from src.core.database import get_db
from src.core.security import verify_password, get_password_hash, create_access_token
from src.models.user import User as UserModel
from src.schemas.user import UserCreate, User as UserSchema, Token
from jose import JWTError, jwt
from src.core.config import settings
from src.schemas.user import TokenData
from authlib.integrations.starlette_client import OAuth
from starlette.requests import Request
from typing import cast
import uuid

router = APIRouter()

oauth = OAuth()
oauth.register(
    name="github",
    client_id=settings.github_client_id,
    client_secret=settings.github_client_secret,
    authorize_url="https://github.com/login/oauth/authorize",
    authorize_params=None,
    access_token_url="https://github.com/login/oauth/access_token",
    access_token_params=None,
    refresh_token_url=None,
    redirect_uri="http://localhost:8001/api/v1/auth/github/callback",
    client_kwargs={"scope": "user:email"},
)

oauth.register(
    name="google",
    client_id=settings.google_client_id,
    client_secret=settings.google_client_secret,
    server_metadata_url="https://accounts.google.com/.well-known/openid-configuration",
    client_kwargs={"scope": "openid email profile"},
)

oauth2_scheme = OAuth2PasswordBearer(tokenUrl="api/v1/auth/login")


async def get_current_user(
    db: Session = Depends(get_db), token: str = Depends(oauth2_scheme)
) -> UserModel:
    credentials_exception = HTTPException(
        status_code=status.HTTP_401_UNAUTHORIZED,
        detail="Could not validate credentials",
        headers={"WWW-Authenticate": "Bearer"},
    )
    try:
        payload = jwt.decode(
            token, settings.secret_key, algorithms=[settings.algorithm]
        )
        email = payload.get("sub")
        if not isinstance(email, str):
            raise credentials_exception
        token_data = TokenData(email=email)
    except JWTError:
        raise credentials_exception
    user = db.query(UserModel).filter(UserModel.email == token_data.email).first()
    if user is None:
        raise credentials_exception
    return user


@router.post("/register", response_model=UserSchema)
def register(user_in: UserCreate, db: Session = Depends(get_db)):
    user = db.query(UserModel).filter(UserModel.email == user_in.email).first()
    if user:
        raise HTTPException(
            status_code=400,
            detail="The user with this email already exists in the system.",
        )
    user_obj = UserModel(
        email=user_in.email,
        hashed_password=get_password_hash(user_in.password),
        full_name=user_in.full_name,
    )
    db.add(user_obj)
    db.commit()
    db.refresh(user_obj)
    return user_obj


@router.post("/login", response_model=Token)
def login(
    db: Session = Depends(get_db), form_data: OAuth2PasswordRequestForm = Depends()
):
    user = db.query(UserModel).filter(UserModel.email == form_data.username).first()
    if not user or not verify_password(
        form_data.password, cast(str, user.hashed_password)
    ):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Incorrect email or password",
            headers={"WWW-Authenticate": "Bearer"},
        )
    access_token = create_access_token(data={"sub": user.email})
    return {"access_token": access_token, "token_type": "bearer"}


@router.get("/me", response_model=UserSchema)
def read_user_me(current_user: UserModel = Depends(get_current_user)):
    return current_user


# --- OAuth Routes ---


@router.get("/github/login")
async def github_login(request: Request):
    return await oauth.github.authorize_redirect(request, settings.github_client_secret)


@router.get("/github/callback")
async def github_callback(request: Request, db: Session = Depends(get_db)):
    token = await oauth.github.authorize_access_token(request)
    user_data = await oauth.github.get("https://api.github.com/user", token=token)
    profile = user_data.json()
    email = profile.get("email")
    if not email:
        # Fallback if email is private
        emails = await oauth.github.get(
            "https://api.github.com/user/emails", token=token
        )
        email = [e["email"] for e in emails.json() if e["primary"]][0]

    user = db.query(UserModel).filter(UserModel.email == email).first()
    if not user:
        # Auto-register if user doesn't exist
        user = UserModel(
            email=email,
            hashed_password=get_password_hash(str(uuid.uuid4())),
            full_name=profile.get("name") or profile.get("login"),
        )
        db.add(user)
        db.commit()
        db.refresh(user)

    access_token = create_access_token(data={"sub": user.email})
    # Redirect to frontend with token
    from fastapi.responses import RedirectResponse

    return RedirectResponse(
        url=f"http://localhost:3001/auth/callback?token={access_token}"
    )


@router.get("/google/login")
async def google_login(request: Request):
    return await oauth.google.authorize_redirect(
        request, "http://localhost:8001/api/v1/auth/google/callback"
    )


@router.get("/google/callback")
async def google_callback(request: Request, db: Session = Depends(get_db)):
    token = await oauth.google.authorize_access_token(request)
    user_info = token.get("userinfo")
    if not user_info:
        raise HTTPException(
            status_code=400, detail="Failed to get user info from Google"
        )

    email = user_info.get("email")
    user = db.query(UserModel).filter(UserModel.email == email).first()
    if not user:
        user = UserModel(
            email=email,
            hashed_password=get_password_hash(str(uuid.uuid4())),
            full_name=user_info.get("name"),
        )
        db.add(user)
        db.commit()
        db.refresh(user)

    access_token = create_access_token(data={"sub": user.email})
    from fastapi.responses import RedirectResponse

    return RedirectResponse(
        url=f"http://localhost:3001/auth/callback?token={access_token}"
    )
