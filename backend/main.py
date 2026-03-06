from fastapi import FastAPI, Depends, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from sqlalchemy.orm import Session
from typing import List

import models
import schemas
from database import SessionLocal, engine

models.Base.metadata.create_all(bind=engine)

app = FastAPI(title="Ola Coffee API")

# CORS configuration
origins = [
    "http://localhost:5173",
    "http://127.0.0.1:5173",
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


def get_db():
    """Database session dependency"""
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()


# API Endpoints

@app.get("/products", response_model=List[schemas.Product])
def get_products(
    category: str = None, 
    search: str = None, 
    db: Session = Depends(get_db)
):
    """Get products with optional category and search filters"""
    query = db.query(models.Product)
    
    if category and category != "Todos":
        query = query.filter(models.Product.category == category)
    
    if search:
        search_fmt = f"%{search}%"
        query = query.filter(
            models.Product.name.ilike(search_fmt) | 
            models.Product.description.ilike(search_fmt)
        )
    
    return query.all()


@app.post("/products", response_model=schemas.Product)
def create_product(
    product: schemas.ProductCreate, 
    db: Session = Depends(get_db)
):
    """Create a new product"""
    db_product = models.Product(**product.dict())
    db.add(db_product)
    db.commit()
    db.refresh(db_product)
    return db_product


@app.put("/products/{product_id}", response_model=schemas.Product)
def update_product(
    product_id: int, 
    product: schemas.ProductCreate, 
    db: Session = Depends(get_db)
):
    """Update an existing product"""
    db_product = db.query(models.Product).filter(
        models.Product.id == product_id
    ).first()
    
    if not db_product:
        raise HTTPException(
            status_code=404, 
            detail="Producto no encontrado"
        )
    
    for key, value in product.dict().items():
        setattr(db_product, key, value)
    
    db.commit()
    db.refresh(db_product)
    return db_product


@app.patch("/products/{product_id}/toggle", response_model=schemas.Product)
def toggle_stock(
    product_id: int, 
    db: Session = Depends(get_db)
):
    """Toggle product availability"""
    db_product = db.query(models.Product).filter(
        models.Product.id == product_id
    ).first()
    
    if not db_product:
        raise HTTPException(
            status_code=404, 
            detail="Producto no encontrado"
        )
    
    db_product.available = not db_product.available
    db.commit()
    db.refresh(db_product)
    return db_product


@app.delete("/products/{product_id}")
def delete_product(
    product_id: int, 
    db: Session = Depends(get_db)
):
    """Delete a product"""
    db_product = db.query(models.Product).filter(
        models.Product.id == product_id
    ).first()
    
    if not db_product:
        raise HTTPException(
            status_code=404, 
            detail="Producto no encontrado"
        )
    
    db.delete(db_product)
    db.commit()
    return {"message": "Producto eliminado exitosamente"}


@app.put("/categories/rename")
def rename_category(
    old_name: str, 
    new_name: str, 
    db: Session = Depends(get_db)
):
    """Rename a category across all products"""
    if not old_name or not new_name:
        raise HTTPException(
            status_code=400,
            detail="Debe proporcionar old_name y new_name"
        )
        
    # Bulk update all products in the old category
    updated_count = db.query(models.Product).filter(
        models.Product.category == old_name
    ).update({"category": new_name})
    
    if updated_count == 0:
        raise HTTPException(
            status_code=404,
            detail=f"No se encontraron productos con la categoría '{old_name}'"
        )
        
    db.commit()
    return {"message": f"Categoría '{old_name}' renombrada a '{new_name}' en {updated_count} productos"}


@app.post("/login")
def login(data: dict):
    """Simple login endpoint (demo only - not for production)"""
    if data.get("password") == "ola2024":
        return {"status": "ok", "token": "access-granted"}
    
    raise HTTPException(
        status_code=401, 
        detail="Contraseña incorrecta"
    )