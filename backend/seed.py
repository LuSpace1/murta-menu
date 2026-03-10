from database import SessionLocal
import models
from security import get_password_hash

#DATOS EXACTOS DE LA CARTA MURTA MENU
MENU_ITEMS = [
    # --- DULCES - TARTAS ---
    {
        "name": "TARTA LIMÓN & ALMENDRA",
        "category": "Tartas",
        "price": 4200,
        "description": "Tarta artesanal de limón con almendras."
    },
    {
        "name": "TARTA FRAMBUESA & PISTACHO",
        "category": "Tartas",
        "price": 4200,
        "description": "Tarta artesanal de frambuesa con pistacho."
    },

    # --- DULCES - GALLETAS ---
    {
        "name": "GALLETA COFFEE CARAMEL",
        "category": "Galletas",
        "price": 4200,
        "description": "Galleta de café con caramelo."
    },
    {
        "name": "GALLETA CHOCOSÉSAMO",
        "category": "Galletas",
        "price": 4200,
        "description": "Galleta de chocolate con sésamo."
    },
    {
        "name": "GALLETA RED VELVET",
        "category": "Galletas",
        "price": 4200,
        "description": "Galleta red velvet."
    },

    # --- DULCES - PROFITEROL ---
    {
        "name": "PROFITEROL DURAZNO",
        "category": "Profiterol",
        "price": 2800,
        "description": "Profiterol relleno de crema de durazno."
    },
    {
        "name": "PROFITEROL VAINILLA",
        "category": "Profiterol",
        "price": 2800,
        "description": "Profiterol relleno de crema de vainilla."
    },
    {
        "name": "PROFITEROL CEDRÓN",
        "category": "Profiterol",
        "price": 2900,
        "description": "Profiterol relleno de crema de cedrón."
    },

    # --- DULCES - PASTELES ---
    {
        "name": "PASTEL CEREZA & CHOCOLATE 60%",
        "category": "Pasteles",
        "price": 4200,
        "description": "Pastel de cereza con chocolate 60% cacao."
    },
    {
        "name": "PASTEL MORA, CREMA & MAQUI",
        "category": "Pasteles",
        "price": 4200,
        "description": "Pastel de mora con crema y maqui."
    },

    # --- DULCES - HORNEADOS ---
    {
        "name": "QUEQUE NARANJA & CHOCOLATE",
        "category": "Horneados",
        "price": 4200,
        "description": "Queque de naranja con chocolate."
    },
    {
        "name": "MAGDALENA x2",
        "category": "Horneados",
        "price": 2800,
        "description": "Dos magdalenas artesanales."
    },
    {
        "name": "AVELLANA & CHOCOLATE LECHE 35%",
        "category": "Horneados",
        "price": 2800,
        "description": "Horneado de avellana con chocolate de leche 35%."
    },

    # --- BEBIDAS CALIENTES ---
    {
        "name": "ESPRESSO",
        "category": "Bebidas Calientes",
        "price": 2300,
        "description": "Shot de espresso intenso."
    },
    {
        "name": "AMERICANO",
        "category": "Bebidas Calientes",
        "price": 2800,
        "description": "Espresso con agua caliente."
    },
    {
        "name": "CAPUCCINO",
        "category": "Bebidas Calientes",
        "price": 3000,
        "description": "Espresso con leche vaporizada y espuma cremosa."
    },
    {
        "name": "FLAT WHITE",
        "category": "Bebidas Calientes",
        "price": 3200,
        "description": "Espresso con microespuma de leche sedosa."
    },
    {
        "name": "LATTE",
        "category": "Bebidas Calientes",
        "price": 3200,
        "description": "Espresso con abundante leche vaporizada."
    },
    {
        "name": "DIRTY CHAI",
        "category": "Bebidas Calientes",
        "price": 3800,
        "description": "Chai latte con shot de espresso."
    },
    {
        "name": "CHAI LATTE",
        "category": "Bebidas Calientes",
        "price": 3500,
        "description": "Té especiado con leche cremosa."
    },
    {
        "name": "MATCHA LATTE",
        "category": "Bebidas Calientes",
        "price": 3800,
        "description": "Té verde matcha japonés con leche espumosa."
    },
    {
        "name": "CHOCOLATE CALIENTE",
        "category": "Bebidas Calientes",
        "price": 3800,
        "description": "Chocolate caliente cremoso y reconfortante."
    },
    {
        "name": "TÉ VARIEDADES",
        "category": "Bebidas Calientes",
        "price": 2200,
        "description": "Selección de tés en variedad de sabores."
    },

    # --- EXTRAS ---
    {
        "name": "BEBIDA VEGETAL",
        "category": "Extras",
        "price": 650,
        "description": "Leche vegetal adicional (avena, almendra o coco)."
    },
    {
        "name": "SHOT ESPRESSO",
        "category": "Extras",
        "price": 500,
        "description": "Shot adicional de espresso."
    },
    {
        "name": "SYRUP",
        "category": "Extras",
        "price": 500,
        "description": "Syrup adicional a elección."
    },

    # --- BEBIDAS FRÍAS ---
    {
        "name": "MATCHA YUZU LIMONADA",
        "category": "Bebidas Frías",
        "price": 4500,
        "description": "Matcha con yuzu y limonada refrescante."
    },
    {
        "name": "MATCHA MANDARINA",
        "category": "Bebidas Frías",
        "price": 4500,
        "description": "Matcha con mandarina fresca."
    },
    {
        "name": "MATCHA LYCHEE",
        "category": "Bebidas Frías",
        "price": 4500,
        "description": "Matcha con lychee."
    },
    {
        "name": "ESPRESSO TONIC",
        "category": "Bebidas Frías",
        "price": 3900,
        "description": "Espresso con tónica, syrup de hibisco y malva rosa."
    },
    {
        "name": "ESPRESSO ORANGE",
        "category": "Bebidas Frías",
        "price": 3900,
        "description": "Espresso con jugo de naranja natural."
    },
    {
        "name": "MOCHA CARAMEL",
        "category": "Bebidas Frías",
        "price": 4200,
        "description": "Mocha frío con caramelo."
    },
    {
        "name": "ICED LATTE",
        "category": "Bebidas Frías",
        "price": 4000,
        "description": "Latte helado, disponible en espresso o matcha."
    },
    {
        "name": "ROIBOOS FRAMBUESA",
        "category": "Bebidas Frías",
        "price": 3900,
        "description": "Té rooibos helado con frambuesa."
    },
    {
        "name": "JUGO PRENSADO EN FRÍO",
        "category": "Bebidas Frías",
        "price": 3000,
        "description": "Jugo prensado en frío, 300 ml."
    },
    {
        "name": "AFFOGATO",
        "category": "Bebidas Frías",
        "price": 4000,
        "description": "Helado de vainilla con salted caramel y espresso."
    },
]


def seed_db():
    print("Cargando menú oficial Murta...")
    db = SessionLocal()

    count = 0
    for item in MENU_ITEMS:
        if "description" not in item:
            item["description"] = None

        producto = models.Product(**item)
        db.add(producto)
        count += 1
        
    # Crear configuración inicial si no existe
    config = db.query(models.AppConfig).first()
    if not config:
        print("Creando configuración inicial de la aplicación...")
        hashed_pw = get_password_hash("ola2024")
        new_config = models.AppConfig(admin_password=hashed_pw, recovery_email=None)
        db.add(new_config)

    db.commit()
    print(f"Se cargaron {count} productos oficiales en la base de datos.")
    db.close()


if __name__ == "__main__":
    seed_db()