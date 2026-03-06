import React, { useState, useEffect, useMemo } from "react";
import { Plus, Loader2, List, Edit3 } from "lucide-react";
import Swal from "sweetalert2";
import * as API from "./api";

import Header from "./components/Header";
import ProductCard from "./components/ProductCard";
import ProductEditor from "./components/ProductEditor";
import LoginModal from "./components/LoginModal";

export default function App() {
  // State
  const [items, setItems] = useState([]);
  const [activeCategory, setActiveCategory] = useState("Todos");
  const [searchQuery, setSearchQuery] = useState("");
  const [loading, setLoading] = useState(true);
  const [isAdmin, setIsAdmin] = useState(false);
  const [showLogin, setShowLogin] = useState(false);
  const [password, setPassword] = useState("");
  const [logoClicks, setLogoClicks] = useState(0);
  const [editingItem, setEditingItem] = useState(null);

  // Computed
  const categories = useMemo(() => {
    const rawCategories = items.map((i) => i.category);
    const uniqueCats = Array.from(new Set(rawCategories));

    const otherCats = uniqueCats
      .filter(
        (cat) =>
          cat.toLowerCase() !== "special" && cat.toLowerCase() !== "specials",
      )
      .sort();

    const hasSpecials = uniqueCats.some(
      (cat) =>
        cat.toLowerCase() === "special" || cat.toLowerCase() === "specials",
    );

    if (hasSpecials) {
      return ["Todos", "Special", ...otherCats];
    }

    return ["Todos", ...otherCats];
  }, [items]);

  // Effects
  useEffect(() => {
    fetchItems();
  }, [activeCategory, searchQuery]);

  // Handlers
  const fetchItems = async () => {
    setLoading(true);
    try {
      // Validamos que la categoría activa exista, si no, volvemos a "Todos"
      const safeCategory = categories.includes(activeCategory)
        ? activeCategory
        : "Todos";
      if (safeCategory !== activeCategory) setActiveCategory("Todos");

      const data = await API.getMenu(safeCategory, searchQuery);
      setItems(data);
    } catch (error) {
      console.error("Error al cargar productos:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleLogoClick = () => {
    setLogoClicks((prev) => prev + 1);
    if (logoClicks + 1 >= 3) {
      if (isAdmin) {
        setIsAdmin(false);
        Swal.fire({
          icon: "info",
          title: "Modo Cliente",
          toast: true,
          position: "top-end",
          showConfirmButton: false,
          timer: 1500,
        });
      } else {
        setShowLogin(true);
      }
      setLogoClicks(0);
    }
    setTimeout(() => setLogoClicks(0), 2000);
  };

  const handleLoginSubmit = async (e) => {
    e.preventDefault();
    try {
      await API.login(password);
      setIsAdmin(true);
      setShowLogin(false);
      setPassword("");
      Swal.fire({
        icon: "success",
        title: "Acceso exitoso",
        toast: true,
        position: "top",
        showConfirmButton: false,
        timer: 1000,
      });
    } catch (error) {
      Swal.fire({
        icon: "error",
        title: "PIN Incorrecto",
        confirmButtonColor: "#6B2D3E",
      });
    }
  };

  const openEditor = (item = {}) => setEditingItem(item);

  const handleToggleStock = async (item) => {
    try {
      await API.toggleStock(item.id);
      setItems(
        items.map((i) =>
          i.id === item.id ? { ...i, available: !i.available } : i,
        ),
      );
    } catch (error) {
      console.error("Error al cambiar disponibilidad:", error);
    }
  };

  const handleSave = async (e) => {
    e.preventDefault();
    if (!editingItem.name || !editingItem.category || !editingItem.price) {
      Swal.fire({
        icon: "warning",
        title: "Por favor completa todos los campos",
        confirmButtonColor: "#6B2D3E",
      });
      return;
    }
    try {
      await API.saveItem(editingItem);
      setEditingItem(null);
      fetchItems();
      Swal.fire({
        icon: "success",
        title: "Producto guardado",
        toast: true,
        position: "top",
        showConfirmButton: false,
        timer: 1500,
      });
    } catch (error) {
      Swal.fire({
        icon: "error",
        title: "Error al guardar",
        text: error.message,
        confirmButtonColor: "#3A3530",
      });
    }
  };

  const handleDelete = async (id) => {
    const result = await Swal.fire({
      title: "¿Eliminar este producto?",
      text: "Esta acción no se puede deshacer",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#6B2D3E",
      cancelButtonColor: "#B8907A",
      confirmButtonText: "Sí, eliminar",
      cancelButtonText: "Cancelar",
    });
    if (result.isConfirmed) {
      try {
        await API.deleteItem(id);
        fetchItems();
        Swal.fire({
          icon: "success",
          title: "Producto eliminado",
          toast: true,
          position: "top",
          showConfirmButton: false,
          timer: 1500,
        });
      } catch (error) {
        console.error("Error al eliminar:", error);
      }
    }
  };

  const handleRenameCategory = async (oldCategoryName) => {
    const { value: newCategoryName } = await Swal.fire({
      title: 'Renombrar Categoría',
      input: 'text',
      inputLabel: `Nuevo nombre para "${oldCategoryName}"`,
      inputValue: oldCategoryName,
      showCancelButton: true,
      confirmButtonText: 'Guardar cambios',
      cancelButtonText: 'Cancelar',
      confirmButtonColor: '#6B2D3E',
      cancelButtonColor: '#B8907A',
      inputValidator: (value) => {
        if (!value || value.trim() === '') {
          return 'Debes ingresar un nombre válido'
        }
        if (value.trim() === oldCategoryName) {
          return 'El nombre debe ser diferente al actual'
        }
      }
    });

    if (newCategoryName) {
      try {
        await API.renameCategory(oldCategoryName, newCategoryName.trim());

        // Optimistic UI update or re-fetch depending on activeCategory
        if (activeCategory === oldCategoryName) {
          setActiveCategory(newCategoryName.trim());
        }

        fetchItems();

        Swal.fire({
          icon: 'success',
          title: 'Categoría renombrada',
          toast: true,
          position: 'top',
          showConfirmButton: false,
          timer: 1500
        });
      } catch (error) {
        Swal.fire({
          icon: 'error',
          title: 'Error al renombrar',
          text: error.message || 'No se pudo cambiar el nombre de la categoría',
          confirmButtonColor: '#3A3530'
        });
      }
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#FAF5EF] to-[#F0E6D8]">
      <Header
        isAdmin={isAdmin}
        onLogoClick={handleLogoClick}
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
        onLogout={() => setIsAdmin(false)}
      />

      <div className="max-w-4xl mx-auto px-4 py-6">
        {/* Filtros de Categorías */}
        <div className="flex gap-2 mb-6 overflow-x-auto pb-2 scrollbar-hide">
          {categories.map((cat) => {
            const isSpecialBtn = cat.toLowerCase() === "special";
            const isActive = activeCategory === cat;

            return (
              <button
                key={cat}
                onClick={() => setActiveCategory(cat)}
                className={`
                  relative
                  px-5 py-2.5 rounded-full text-xs font-display font-bold whitespace-nowrap transition-all border
                  ${isActive
                    ? isSpecialBtn
                      ? "bg-[#8B4A5C] text-white border-[#8B4A5C] shadow-lg scale-105"
                      : "bg-[#6B2D3E] text-white border-[#6B2D3E] shadow-lg"
                    : isSpecialBtn
                      ? "bg-[#F2E0E5] text-[#8B4A5C] border-[#E0C5CE] hover:bg-[#EBD3DA]"
                      : "bg-white text-[#6B2D3E] border-[#E8D9CB] hover:bg-[#FAF5EF]"
                  }
                `}
                style={isActive && isSpecialBtn ? { clipPath: 'inset(0 round 9999px)' } : {}}
              >
                {/* Textura granulada solo para Special activo */}
                {isActive && isSpecialBtn && (
                  <div className="absolute inset-0 pointer-events-none z-0">
                    <svg
                      className="h-full w-full opacity-[0.4] mix-blend-soft-light"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <filter id="grainy-btn">
                        <feTurbulence
                          type="fractalNoise"
                          baseFrequency="0.95"
                          numOctaves="10"
                          stitchTiles="stitch"
                        />
                        <feComponentTransfer>
                          <feFuncR type="linear" slope="1.5" intercept="-0.2" />
                          <feFuncG type="linear" slope="1.5" intercept="-0.2" />
                          <feFuncB type="linear" slope="1.5" intercept="-0.2" />
                        </feComponentTransfer>
                      </filter>
                      <rect width="100%" height="100%" filter="url(#grainy-btn)" />
                    </svg>
                  </div>
                )}
                <div className="relative z-10 flex items-center gap-2">
                  <span>{cat}</span>
                  {isAdmin && cat !== "Todos" && (
                    <div
                      onClick={(e) => {
                        e.stopPropagation(); // Evita que el botón cambie la categoría activa al editar
                        handleRenameCategory(cat);
                      }}
                      className="p-1 hover:bg-black/10 rounded-full transition-colors cursor-pointer"
                      title={`Renombrar categoría ${cat}`}
                    >
                      <Edit3 size={14} className={isActive ? (isSpecialBtn ? 'text-white' : 'text-white/80') : (isSpecialBtn ? 'text-[#8B4A5C]' : 'text-[#6B2D3E]')} />
                    </div>
                  )}
                </div>
              </button>
            );
          })}
        </div>

        {isAdmin && (
          <button
            onClick={() => openEditor({})}
            className="w-full mb-6 bg-gradient-to-r from-[#6B2D3E] to-[#522231] text-white p-4 rounded-2xl font-black shadow-lg hover:shadow-xl transition-all flex items-center justify-center gap-2"
          >
            <Plus size={20} />
            NUEVO PRODUCTO
          </button>
        )}

        {loading ? (
          <div className="flex justify-center items-center py-20">
            <Loader2 className="animate-spin text-[#6B2D3E]" size={40} />
          </div>
        ) : items.length === 0 ? (
          <div className="text-center py-20">
            <List size={48} className="mx-auto text-[#B8907A] mb-4" />
            <p className="text-[#B8907A] font-bold">
              No hay productos en esta categoría
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {items.map((item) => (
              <ProductCard
                key={item.id}
                product={item}
                isAdmin={isAdmin}
                onToggleStock={handleToggleStock}
                onEdit={openEditor}
                onDelete={handleDelete}
              />
            ))}
          </div>
        )}
      </div>

      {showLogin && (
        <LoginModal
          onSubmit={handleLoginSubmit}
          onClose={() => setShowLogin(false)}
          password={password}
          onPasswordChange={setPassword}
        />
      )}

      {editingItem && (
        <ProductEditor
          product={editingItem}
          categories={categories}
          onSave={handleSave}
          onClose={() => setEditingItem(null)}
          onChange={setEditingItem}
        />
      )}
    </div>
  );
}
