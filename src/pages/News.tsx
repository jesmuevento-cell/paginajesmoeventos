import React, { useState } from 'react';
import {
  Newspaper,
  Calendar,
  User,
  Search,
  ChevronRight,
  Sparkles,
  Share2,
  X,
} from 'lucide-react';
import { useEvent } from '../context/EventContext';
import { NewsArticle } from '../types';

export const News: React.FC = () => {
  const { news } = useEvent();
  const [selectedCategory, setSelectedCategory] = useState('Todos');
  const [searchQuery, setSearchQuery] = useState('');
  const [activeArticle, setActiveArticle] = useState<NewsArticle | null>(null);

  const categories = ['Todos', 'Comunicados', 'Audições', 'Galas', 'Cultura'];

  const filteredNews = news.filter((item) => {
    const matchesCategory =
      selectedCategory === 'Todos' || item.categoria.toLowerCase() === selectedCategory.toLowerCase();
    const matchesSearch =
      item.titulo.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.resumo.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.conteudo.toLowerCase().includes(searchQuery.toLowerCase());
    return item.publicado && matchesCategory && matchesSearch;
  });

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 pt-28 pb-20 space-y-12">
      {/* Header */}
      <div className="text-center space-y-4 max-w-3xl mx-auto">
        <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-sky-500/10 border border-sky-400/30 text-sky-300 text-xs font-bold uppercase tracking-wider">
          <Newspaper className="w-3.5 h-3.5 text-sky-400" />
          <span>Imprensa & Actualizações</span>
        </div>
        <h1 className="text-3xl sm:text-5xl font-black text-white tracking-tight">
          Notícias & Comunicados Oficiais
        </h1>
        <p className="text-slate-300 text-sm sm:text-base leading-relaxed">
          Acompanhe todos os anúncios oficiais, calendários de audições, listas de apurados e bastidores do THE VOICE LUNDA-SUL.
        </p>
      </div>

      {/* Filter and Search Bar */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4 p-4 rounded-2xl bg-slate-900 border border-slate-800">
        {/* Category Pills */}
        <div className="flex flex-wrap items-center gap-2 w-full sm:w-auto">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all ${
                selectedCategory === cat
                  ? 'bg-sky-500 text-white shadow-md shadow-sky-500/20'
                  : 'bg-slate-950 text-slate-300 hover:text-white hover:bg-slate-800'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Search */}
        <div className="relative w-full sm:w-72">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Pesquisar notícia..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-9 pr-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-white text-xs focus:outline-none focus:border-sky-400"
          />
        </div>
      </div>

      {/* News Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredNews.map((article) => (
          <article
            key={article.id}
            onClick={() => setActiveArticle(article)}
            className="rounded-3xl bg-slate-900/80 border border-slate-800 hover:border-sky-500/50 overflow-hidden shadow-xl transition-all duration-300 flex flex-col justify-between group cursor-pointer"
          >
            <div>
              <div className="relative h-52 overflow-hidden">
                <img
                  src={article.imagemUrl}
                  alt={article.titulo}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                />
                <span className="absolute top-3 left-3 px-3 py-1 rounded-lg bg-slate-950/80 backdrop-blur-md text-[11px] font-bold text-sky-300 border border-sky-500/30">
                  {article.categoria}
                </span>
              </div>

              <div className="p-6 space-y-2.5 text-left">
                <div className="flex items-center gap-3 text-[11px] text-slate-400">
                  <span className="flex items-center gap-1">
                    <Calendar className="w-3.5 h-3.5" />
                    {article.dataPublicacao}
                  </span>
                  <span>•</span>
                  <span className="flex items-center gap-1">
                    <User className="w-3.5 h-3.5" />
                    {article.autor}
                  </span>
                </div>

                <h3 className="text-lg font-bold text-white group-hover:text-sky-300 transition-colors line-clamp-2">
                  {article.titulo}
                </h3>
                <p className="text-xs text-slate-300 line-clamp-3 leading-relaxed">
                  {article.resumo}
                </p>
              </div>
            </div>

            <div className="p-6 pt-0 text-left">
              <span className="inline-flex items-center gap-1.5 text-xs font-bold text-sky-400 group-hover:underline">
                Ler comunicado completo <ChevronRight className="w-4 h-4" />
              </span>
            </div>
          </article>
        ))}
      </div>

      {/* Article Reader Modal */}
      {activeArticle && (
        <div className="fixed inset-0 z-50 bg-slate-950/85 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-sky-900/60 rounded-3xl max-w-3xl w-full max-h-[90vh] overflow-y-auto shadow-2xl relative">
            <button
              onClick={() => setActiveArticle(null)}
              className="absolute top-4 right-4 p-2 rounded-full bg-slate-950/80 text-slate-300 hover:text-white border border-slate-700 z-10"
              aria-label="Fechar"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="relative h-64 sm:h-80 w-full">
              <img
                src={activeArticle.imagemUrl}
                alt={activeArticle.titulo}
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-slate-900 via-transparent to-transparent" />
            </div>

            <div className="p-6 sm:p-10 space-y-6 text-left">
              <div className="space-y-2">
                <span className="px-3 py-1 rounded-full bg-sky-500/20 text-sky-300 text-xs font-bold border border-sky-400/30">
                  {activeArticle.categoria}
                </span>
                <h2 className="text-2xl sm:text-3xl font-black text-white pt-2">
                  {activeArticle.titulo}
                </h2>
                <div className="flex items-center gap-3 text-xs text-slate-400 pt-1">
                  <span>Publicado em {activeArticle.dataPublicacao}</span>
                  <span>•</span>
                  <span>Por {activeArticle.autor}</span>
                </div>
              </div>

              <div className="prose prose-invert max-w-none text-slate-300 text-sm sm:text-base leading-relaxed space-y-4 whitespace-pre-line border-t border-slate-800 pt-6">
                {activeArticle.conteudo}
              </div>

              <div className="pt-6 border-t border-slate-800 flex justify-end">
                <button
                  onClick={() => setActiveArticle(null)}
                  className="px-6 py-2.5 rounded-xl bg-sky-600 hover:bg-sky-500 text-white font-bold text-xs"
                >
                  Fechar Artigo
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
