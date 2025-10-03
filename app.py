
from core import *
from fastapi import FastAPI, HTTPException,Depends
from typing import List
from sqlalchemy.orm import Session
from schemas import *
import crud,security
from datetime import timedelta
from fastapi.middleware.cors import CORSMiddleware

origins = [
    "http://localhost:5173",
    "http://localhost:3000",
    "https://link-guardian-chi.vercel.app",
    "https://link-guardian-git-main-prospers-projects-060fdb4b.vercel.app"
]

app = FastAPI(
    title="Link Guardian API",
    description="API pour gérer des liens web avec FastAPI et SQLAlchemy",
    version="1.0.0"
)

app.add_middleware(
    CORSMiddleware,
    allow_origins = origins,
    allow_credentials=True,
    allow_methods= ["*"],
    allow_headers=["*"],
)

def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()

@app.post("/sigin", response_model=UserSchema,status_code=201,tags=['Users'])
def create(user: UserCreate, db: Session = Depends(get_db)):
    db_user = crud.get_user_by_email(db, email=user.email)
    if db_user:
        raise HTTPException(status_code=400, detail="Email already registered")
    return crud.create_user(db=db, user=user)

@app.post("/login",tags=['Users'])
def login_for_access_token(form_data: UserCreate, db: Session = Depends(get_db)):

    user = crud.get_user_by_email(db, email=form_data.email)
    
    if not user or not security.verify_password(form_data.password, user.password):
    
        raise HTTPException(status_code=400, detail="Incorrect email or password")
    
    access_token_expires = timedelta(minutes=security.ACCESS_TOKEN_EXPIRE_MINUTES)
    
    access_token = security.create_access_token(
        data={"sub": user.email}, expires_delta=access_token_expires
    )
    return {"access_token": access_token, "token_type": "bearer"}


from fastapi.security import OAuth2PasswordBearer
from jose import JWTError,jwt

oauth2_scheme = OAuth2PasswordBearer(tokenUrl="token")

def get_current_user(token: str = Depends(oauth2_scheme), db: Session = Depends(get_db)):
    credentials_exception = HTTPException(
        status_code=401,
        detail="Could not validate credentials",
        headers={"WWW-Authenticate": "Bearer"},
    )
    try:
        payload = jwt.decode(token, security.secret_key, algorithms=[security.ALGORITHM])
        email: str = payload.get("sub")
        if email is None:
            raise credentials_exception
    except JWTError:
        raise credentials_exception
    
    user = crud.get_user_by_email(db, email=email)
    if user is None:
        raise credentials_exception
    return user

@app.post("/links/", response_model=LinkSchema,status_code=201,tags=['Links'])
def create_link(link: LinkCreate, db: Session = Depends(get_db),current_user: UserSchema = Depends(get_current_user)):
    return crud.create_user_link(db=db, link=link, user_id=current_user.id)

@app.get("/links/", response_model=List[LinkSchema],tags=['Links'])
def read_links(skip:int=0,limit:int=100,db: Session = Depends(get_db),current_user: UserSchema = Depends(get_current_user)):
    return crud.get_user_links(db=db, user_id=current_user.id, skip=skip, limit=limit)

@app.get("/links/{link_id}", response_model=LinkSchema,tags=['Links'])
def read_link(link_id: int, db: Session = Depends(get_db),current_user: UserSchema = Depends(get_current_user)):
    link = crud.get_user_link(db=db, user_id=current_user.id, link_id=link_id)
    if link is None:
        raise HTTPException(status_code=404, detail="Link not found")
    return link

@app.put("/links/{link_id}", response_model=LinkSchema,tags=['Links'])
def update_link(link_id: int, updated_link: LinkCreate, db: Session = Depends(get_db),current_user: UserSchema = Depends(get_current_user)):
    link = crud.get_user_link(db=db, user_id=current_user.id, link_id=link_id)
    if link is None:
        raise HTTPException(status_code=404, detail="Link not found")
    link.url = updated_link.url
    link.description = updated_link.description
    db.commit()
    db.refresh(link)
    return link

@app.delete("/links/{link_id}", status_code=204,tags=['Links']) 
def delete_link(link_id: int, db: Session = Depends(get_db),current_user: UserSchema = Depends(get_current_user)):
    link = db.query(Link).filter(Link.id == link_id, Link.owner_id == current_user.id).first()
    if link is None:
        raise HTTPException(status_code=404, detail="Link not found")
    db.delete(link)
    db.commit()

@app.get("/links/search/", response_model=List[LinkSchema],tags=['Links'])
def search_links(keyword: str, db: Session = Depends(get_db),current_user: UserSchema = Depends(get_current_user)):
    return crud.search_user_links(db=db, keyword=keyword)

if __name__ == "__main__":
    # Base.metadata.create_all(bind=engine)

    import uvicorn
    uvicorn.run("app:app", host="localhost", port=8000,reload=True)

