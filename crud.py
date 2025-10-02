from sqlalchemy.orm import Session
import core,schemas, security
from datetime import datetime

def get_user(db: Session, user_id: int):
    return db.query(core.User).filter(core.User.id == user_id).first()


def create_user(db: Session, user: schemas.UserCreate):
    """Crée un nouvel utilisateur en hashant son mot de passe."""

    hashed_value = security.get_password_hash(user.password)
    
    db_user = core.User(email=user.email, password=hashed_value)
    
    db.add(db_user)
    db.commit()
    db.refresh(db_user)
    return db_user

def get_user_by_email(db: Session, email: str):
    return db.query(core.User).filter(core.User.email == email).first()

def create_user_link(db: Session, link: schemas.LinkCreate, user_id: int):
    db_link = core.Link(**link.model_dump(), owner_id=user_id,date_ajout=datetime.now())
    db.add(db_link)
    db.commit()
    db.refresh(db_link)
    return db_link

def get_user_links(db: Session, user_id: int, skip: int = 0, limit: int = 100):
    return db.query(core.Link).filter(core.Link.owner_id == user_id).offset(skip).limit(limit).all()

def update_user_link(db: Session, link_id: int, link: schemas.LinkCreate):
    db_link = db.query(core.Link).filter(core.Link.id == link_id).first()
    if db_link:
        db_link.url = link.url
        db_link.description = link.description
        db.commit()
        db.refresh(db_link)
    return db_link

def delete_user_link(db: Session, link_id: int):
    db_link = db.query(core.Link).filter(core.Link.id == link_id).first()
    if db_link:
        db.delete(db_link)
        db.commit()
    return db_link

def search_user_links(db: Session, keyword: str):
    return db.query(core.Link).filter(core.Link.description.ilike(f"%{keyword}%")).all()
