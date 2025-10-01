from datetime import datetime
from sqlalchemy import create_engine, Column, Integer, String, DateTime
from sqlalchemy.orm import declarative_base,sessionmaker

# DATABASE_URL = "postgresql://link_user:link_user@localhost:5432/link_db"

import os

DATABASE_URL = os.getenv("DATABASE_URL", "postgresql://link_user:link_user@localhost:5432/link_db")

engine = create_engine(DATABASE_URL)

SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)

Base = declarative_base()

class Link(Base):
    __tablename__ = "links"

    id = Column(Integer, primary_key=True, index=True)
    url = Column(String, index=True)
    description = Column(String)
    date_ajout = Column(DateTime)
    clics = Column(Integer, default=0,nullable=False)
    
    def __repr__(self):
        return f"<Link(id={self.id}, url='{self.url}', description='{self.description}', date_ajout='{self.date_ajout}', clics={self.clics})>"

# class LinkManager:
#     def __init__(self,session_factory):
#         self.db_session = session_factory

#     def get_all_links(self) -> list[Link]:
#         with self.db_session() as db:
#             return db.query(Link).all()

#     def add_link(self, url:str, description:str) -> Link:
#         new_link = Link(url=url, description=description, date_ajout=datetime.now())
#         with self.db_session() as db:
#             db.add(new_link)
#             db.commit()
#         return new_link
    
#     def find_link_by_id(self, id:int) -> Link | None:
#         with self.db_session() as db:
#             return db.query(Link).filter(Link.id == id).first()

#     def delete_link(self, id:int) -> bool:
#         link = self.find_link_by_id(id)
#         if link:
#             with self.db_session() as db:
#                 db.delete(link)
#                 db.commit()
#             return True
#         return False
    
#     def update_link(self, id:int, new_url:str, new_description:str) -> bool:
#         link:Link = self.find_link_by_id(id)
#         if link:
#             link.url = new_url
#             link.description = new_description
#             with self.db_session() as db:
#                 db.merge(link)
#                 db.commit()
#             return True
#         return False

#     def search_links(self, keyword:str) -> list[Link]:
#         with self.db_session() as db:
#             results = db.query(Link).filter(Link.description.ilike(f"%{keyword}%")).all()
#         return results


