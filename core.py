
from sqlalchemy import create_engine,ForeignKey,Column, Integer, String, DateTime
from sqlalchemy.orm import declarative_base,sessionmaker,relationship

import os
from config import settings
engine = create_engine(settings.DATABASE_URL)

SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)


Base = declarative_base()

class User(Base):
    __tablename__ = "users"
    id = Column(Integer, primary_key=True, index=True)
    email = Column(String, unique=True, index=True)
    password = Column(String,nullable=False)

    links = relationship("Link", back_populates="owner")


class Link(Base):
    __tablename__ = "links"

    id = Column(Integer, primary_key=True, index=True)
    url = Column(String, index=True)
    description = Column(String)
    date_ajout = Column(DateTime)
    clics = Column(Integer, default=0,nullable=False)
    owner_id = Column(Integer, ForeignKey("users.id"))
    
    owner = relationship("User", back_populates="links")
    
    def __repr__(self):
        return f"<Link(id={self.id}, url='{self.url}', description='{self.description}', date_ajout='{self.date_ajout}', clics={self.clics})>"

