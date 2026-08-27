import React, { useState } from 'react';
import {
  Image as ImageIcon,
  Play,
  X,
  Sparkles,
  Maximize2,
  Calendar,
  Layers,
} from 'lucide-react';
import { useEvent } from '../context/EventContext';
import { GalleryItem } from '../types';

export const Gallery: React.FC = () => {
  const { gallery } = useEvent();
  const [selectedCategory, setSelectedCategory] = useState('Todos');
  const [activeItem, setActiveItem] = useState<GalleryItem | null>(null);

  const categories = ['Todos', 'Audições', 'Galas', 'Bastidores', 'Palco'];

  const filteredGallery = gallery.filter((item) => {
    if (selectedCategory === 'Todos') return true;
    return item.categoria.toLowerCase() === selectedCategory.toLowerCase();
  });

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 pt-28 pb-20 space-y-12">
      {/* Header */}
      <div className="text-center space-y-4 max-w-3xl mx-auto">
        <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-sky-500/10 border border-sky-400/30 text-sky-300 text-xs font-bold uppercase tracking-wider">
          <ImageIcon className="w-3.5 h-3.5 text-sky-400" />
          <span>Multimédia Oficial</span>
        </div>
        <h1 className="text-3xl sm:text-5xl font-black text-white tracking-tight">
          Galeria THE VOICE LUNDA-SUL
        </h1>
        <p className="text-slate-300 text-sm sm:text-base leading-relaxed">
          Reveja os momentos mais marcantes, a emoção dos concorrentes nos palcos de Saurimo, as audições e a atmosfera dos bastidores.
        </p>
      </div>

      {/* Categories Filter */}
      <div className="flex flex-wrap items-center justify-center gap-2 p-2 rounded-2xl bg-slate-900 border border-slate-800 max-w-md mx-auto">
        {categories.map((cat) => (
          <button
            key={cat}
            onClick={() => setSelectedCategory(cat)}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${
              selectedCategory === cat
                ? 'bg-sky-500 text-white shadow-md shadow-sky-500/20'
                : 'text-slate-300 hover:text-white hover:bg-slate-800'
            }`}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* Gallery Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredGallery.map((item) => (
          <div
            key={item.id}
            onClick={() => setActiveItem(item)}
            className="group relative rounded-3xl overflow-hidden bg-slate-900 border border-slate-800 hover:border-sky-500/50 shadow-xl cursor-pointer aspect-4/3 transition-all duration-300"
          >
            <img
              src={item.url}
              alt={item.titulo}
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
            />

            {/* Overlay Gradient */}
            <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/30 to-transparent opacity-80 group-hover:opacity-95 transition-opacity" />

            {/* Media Type Badge */}
            <div className="absolute top-4 left-4">
              <span className="px-3 py-1 rounded-full bg-slate-950/80 backdrop-blur-md text-[10px] font-bold text-sky-300 border border-sky-500/30 flex items-center gap-1.5">
                {item.tipo === 'video' ? <Play className="w-3 h-3 text-amber-400" /> : <ImageIcon className="w-3 h-3" />}
                {item.categoria}
              </span>
            </div>

            {/* Expand Icon */}
            <div className="absolute top-4 right-4 w-8 h-8 rounded-full bg-slate-950/80 border border-slate-700 flex items-center justify-center text-slate-300 opacity-0 group-hover:opacity-100 transition-opacity">
              <Maximize2 className="w-4 h-4" />
            </div>

            {/* Bottom Info */}
            <div className="absolute inset-x-0 bottom-0 p-5 text-left space-y-1">
              <h4 className="text-base font-bold text-white group-hover:text-sky-300 transition-colors">
                {item.titulo}
              </h4>
              <p className="text-xs text-slate-300 line-clamp-1">{item.descricao}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Lightbox Modal */}
      {activeItem && (
        <div className="fixed inset-0 z-50 bg-slate-950/95 backdrop-blur-md flex items-center justify-center p-4">
          <div className="relative max-w-4xl w-full bg-slate-900 border border-sky-900/60 rounded-3xl overflow-hidden shadow-2xl">
            <button
              onClick={() => setActiveItem(null)}
              className="absolute top-4 right-4 p-2 rounded-full bg-slate-950/80 text-white border border-slate-700 z-10 hover:bg-slate-800"
              aria-label="Fechar"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="max-h-[70vh] flex items-center justify-center bg-black">
              <img
                src={activeItem.url}
                alt={activeItem.titulo}
                className="max-h-[70vh] w-auto object-contain mx-auto"
              />
            </div>

            <div className="p-6 text-left space-y-2 bg-slate-900">
              <span className="px-3 py-1 rounded-full bg-sky-500/20 text-sky-300 text-xs font-bold border border-sky-400/30">
                {activeItem.categoria}
              </span>
              <h3 className="text-xl font-bold text-white">{activeItem.titulo}</h3>
              <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">{activeItem.descricao}</p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
