import React from 'react';
import { Search, X, Instagram } from 'lucide-react';

export default function Header({ 
  isAdmin, 
  onLogoClick, 
  searchQuery, 
  onSearchChange, 
  onLogout 
}) {
  return (
    <div className="sticky top-0 z-50 bg-white/95 backdrop-blur-sm border-b border-[#E8D9CB] shadow-sm">
      <div className="max-w-4xl mx-auto px-4 py-4">

        <div className="flex items-center justify-between mb-4">
          <div 
            onClick={onLogoClick}
            className="cursor-pointer select-none"
          >
            <div className="flex items-baseline gap-1">
              <span className="font-display font-bold text-3xl text-[#6B2D3E] tracking-wide">Murta</span>
              <span className="font-display font-light text-2xl text-[#B8907A] uppercase tracking-wide">Spot</span>
            </div>
            <span className="font-display text-[10px] font-bold uppercase tracking-[0.2em] text-[#B8907A] mt-1 pl-1">
              {isAdmin ? "PANEL DE CONTROL" : "MENÚ"}
            </span>
          </div>


          {isAdmin ? (
            <button 
              onClick={onLogout} 
              className="bg-[#6B2D3E] text-white px-4 py-2 rounded-xl text-xs font-bold shadow-sm active:scale-95 transition-transform hover:bg-[#522231]"
            >
              Salir
            </button>
          ) : (
            <a 
              href="https://www.instagram.com/murtapasteleria/" 
              target="_blank" 
              rel="noreferrer"
              className="text-[#B8907A] hover:text-[#6B2D3E] transition-colors p-2"
            >
              <Instagram size={24} strokeWidth={1.5} />
            </a>
          )}
        </div>


        <div className="relative">
          <Search 
            className="absolute left-4 top-1/2 -translate-y-1/2 text-[#B8907A]" 
            size={18} 
          />
          <input
            type="text"
            placeholder="Buscar productos..."
            value={searchQuery}
            onChange={(e) => onSearchChange(e.target.value)}
            className="w-full pl-12 pr-10 py-3 bg-[#FAF5EF] border border-[#E8D9CB] rounded-2xl text-sm focus:outline-none focus:ring-2 focus:ring-[#6B2D3E]/20 transition-all"
          />
          {searchQuery && (
            <button
              onClick={() => onSearchChange('')}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-[#B8907A] hover:text-[#6B2D3E] p-1"
            >
              <X size={18} />
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
