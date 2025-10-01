from pydantic import BaseModel
from core import SessionLocal, Link,datetime,Base,engine
from fastapi import FastAPI, HTTPException,Depends
from typing import List
from sqlalchemy.orm import Session

class LinkBase(BaseModel):
    url: str
    description: str | None = None

class LinkCreate(LinkBase):
    pass

class LinkShema(LinkBase):
    id: int
    date_ajout: datetime

    class Config:
        orm_mode = True
    

app = FastAPI(
    title="Link Guardian API",
    description="API pour gérer des liens web avec FastAPI et SQLAlchemy",
    version="1.0.0"
)

def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()

@app.post("/links/", response_model=LinkShema,status_code=201,tags=['Links'])
def create_link(link: LinkCreate, db: Session = Depends(get_db)):
    db_link = Link(
        url=link.url,
        description=link.description,
        date_ajout=datetime.now()
    )
    db.add(db_link)
    db.commit()
    db.refresh(db_link)
    return db_link

@app.get("/links/", response_model=List[LinkShema],tags=['Links'])
def read_links(skip:int=0,limit:int=100,db: Session = Depends(get_db)):
    links = db.query(Link).offset(skip).limit(limit).all()
    return links


@app.get("/links/{link_id}", response_model=LinkShema,tags=['Links'])
def read_link(link_id: int, db: Session = Depends(get_db)):
    link = db.query(Link).filter(Link.id == link_id).first()
    if link is None:
        raise HTTPException(status_code=404, detail="Link not found")
    return link

@app.put("/links/{link_id}", response_model=LinkShema,tags=['Links'])
def update_link(link_id: int, updated_link: LinkCreate, db: Session = Depends(get_db)):
    link = db.query(Link).filter(Link.id == link_id).first()
    if link is None:
        raise HTTPException(status_code=404, detail="Link not found")
    link.url = updated_link.url
    link.description = updated_link.description
    db.commit()
    db.refresh(link)
    return link

@app.delete("/links/{link_id}", status_code=204,tags=['Links']) 
def delete_link(link_id: int, db: Session = Depends(get_db)):
    link = db.query(Link).filter(Link.id == link_id).first()
    if link is None:
        raise HTTPException(status_code=404, detail="Link not found")
    db.delete(link)
    db.commit()

@app.get("/links/search/", response_model=List[LinkShema],tags=['Links'])
def search_links(keyword: str, db: Session = Depends(get_db)):
    links = db.query(Link).filter(Link.description.ilike(f"%{keyword}%")).all()
    return links

if __name__ == "__main__":
    # Base.metadata.create_all(bind=engine)

    import uvicorn
    uvicorn.run("app:app", host="localhost", port=8000,reload=True)

