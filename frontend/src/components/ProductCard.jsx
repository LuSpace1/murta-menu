import React from "react";
import { CheckCircle2, XCircle, Edit2, Trash2 } from "lucide-react";

export default function ProductCard({
  product,
  isAdmin,
  onToggleStock,
  onEdit,
  onDelete,
}) {
  const isSpecial = product.category?.toLowerCase() === "special";

  const formatPrice = (price) => {
    return `$${price.toLocaleString("es-CL")}`;
  };

  return (
    <div
      className={`
      relative overflow-hidden rounded-2xl p-5 transition-all duration-300 border-2
      ${
        isSpecial
          ? "bg-[#C4899A] border-[#A8707F] shadow-[0_10px_20px_rgba(107,45,62,0.3)]" // Rosa tostado + sombra
          : "bg-white border-[#E8D9CB] shadow-sm hover:shadow-md"
      }
    `}
    >
      {/* Capa de Granulado (Solo para Specials) */}
      {isSpecial && (
        <div className="absolute inset-0 pointer-events-none z-0">
          <svg
            className="h-full w-full opacity-[0.4] mix-blend-soft-light"
            xmlns="http://www.w3.org/2000/svg"
          >
            <filter id="grainy">
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
            <rect width="100%" height="100%" filter="url(#grainy)" />
          </svg>
        </div>
      )}

      {/* Badge de "No disponible" */}
      {!product.available && !isAdmin && (
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none z-10">
          <span className="bg-[#6B2D3E] text-white text-[10px] font-black px-4 py-2 rounded-full -rotate-6 uppercase shadow-xl tracking-widest border border-white/20">
            No disponible
          </span>
        </div>
      )}

      {/* Contenido */}
      <div
        className={`relative z-10 ${!product.available && !isAdmin ? "opacity-40" : ""}`}
      >
        <div className="mb-3">
          <h3
            className={`font-display font-bold text-base mb-1 ${isSpecial ? "text-[#4A1E2D]" : "text-[#6B2D3E]"}`}
          >
            {product.name}
          </h3>
          <span
            className={`font-display text-[10px] font-bold uppercase tracking-wider ${isSpecial ? "text-[#6B2D3E]" : "text-[#B8907A]"}`}
          >
            {product.category}
          </span>
        </div>

        {product.description && (
          <p
            className={`text-xs mb-3 leading-relaxed ${isSpecial ? "text-[#5A2A3A]" : "text-[#7A5A5F]"}`}
          >
            {product.description}
          </p>
        )}

        <div
          className={`text-xl font-black ${isSpecial ? "text-[#4A1E2D]" : "text-[#6B2D3E]"}`}
        >
          {formatPrice(product.price)}
        </div>
      </div>

      {/* Admin Controls */}
      {isAdmin && (
        <div
          className={`relative z-10 mt-4 flex gap-2 pt-4 border-t ${isSpecial ? "border-[#A8707F]" : "border-[#E8D9CB]"}`}
        >
          <button
            onClick={() => onToggleStock(product)}
            className={`flex-1 flex items-center justify-center gap-2 py-2.5 rounded-xl text-xs font-bold transition-all ${
              product.available
                ? isSpecial
                  ? "bg-white/40 text-[#2D3A26] hover:bg-white/60"
                  : "bg-green-50 text-green-700 hover:bg-green-100"
                : "bg-red-50 text-red-700 hover:bg-red-100"
            }`}
          >
            {product.available ? (
              <>
                <CheckCircle2 size={16} />
                Disponible
              </>
            ) : (
              <>
                <XCircle size={16} />
                Agotado
              </>
            )}
          </button>

          <button
            onClick={() => onEdit(product)}
            className={`p-2.5 rounded-xl transition-colors ${isSpecial ? "bg-white/40 text-[#4A1E2D] hover:bg-white/60" : "bg-blue-50 text-blue-600 hover:bg-blue-100"}`}
          >
            <Edit2 size={16} />
          </button>

          <button
            onClick={() => onDelete(product.id)}
            className={`p-2.5 rounded-xl transition-colors ${isSpecial ? "bg-white/40 text-[#4A1E2D] hover:bg-white/60" : "bg-red-50 text-red-600 hover:bg-red-100"}`}
          >
            <Trash2 size={16} />
          </button>
        </div>
      )}
    </div>
  );
}
