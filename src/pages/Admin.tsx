import React, { useState } from 'react';
import {
  ShieldCheck,
  Users,
  Award,
  Newspaper,
  Calendar,
  Settings,
  Search,
  Filter,
  CheckCircle2,
  AlertCircle,
  Clock,
  Trash2,
  Edit,
  Plus,
  Download,
  Printer,
  X,
  LogOut,
  Sparkles,
  FileSpreadsheet,
  Mic,
  Star,
  Flame,
  UserCheck,
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useEvent } from '../context/EventContext';
import { Candidate, NewsArticle, Stage, UserRole, CandidateStatus } from '../types';

export const Admin: React.FC = () => {
  const { user, isAuthenticated, login, logout, demoUsers } = useAuth();
  const {
    candidates,
    stages,
    news,
    settings,
    updateCandidateStatus,
    submitEvaluation,
    deleteCandidate,
    addNewsItem,
    editNewsItem,
    deleteNews,
    saveAllStages,
    updateEventSettings,
  } = useEvent();

  // Navigation within Admin
  const [activeTab, setActiveTab] = useState<
    'overview' | 'candidates' | 'jury' | 'news' | 'stages' | 'settings'
  >('overview');

  // Login form state
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loginError, setLoginError] = useState('');

  // Candidates filter state
  const [candidateSearch, setCandidateSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('Todos');
  const [municipioFilter, setMunicipioFilter] = useState('Todos');
  const [selectedCandidate, setSelectedCandidate] = useState<Candidate | null>(null);
  const [newStatus, setNewStatus] = useState<CandidateStatus>('Recebida');
  const [adminNote, setAdminNote] = useState('');

  // Jury evaluation form state
  const [evalCandidate, setEvalCandidate] = useState<Candidate | null>(null);
  const [juryScores, setJuryScores] = useState({
    tecnicaVocal: 8,
    afinacao: 8,
    presencaPalco: 8,
    originalidade: 8,
    interpretacao: 8,
    potencialArtistico: 8,
  });
  const [juryComment, setJuryComment] = useState('');
  const [evalSaved, setEvalSaved] = useState(false);

  // News Editor state
  const [editingNews, setEditingNews] = useState<NewsArticle | null>(null);
  const [isCreatingNews, setIsCreatingNews] = useState(false);
  const [newsForm, setNewsForm] = useState<Partial<NewsArticle>>({
    titulo: '',
    resumo: '',
    conteudo: '',
    imagemUrl: 'https://images.unsplash.com/photo-1516450360452-9312f5e86fc7?w=800&auto=format&fit=crop&q=80',
    categoria: 'Comunicados',
    publicado: true,
    autor: 'Comissão Organizadora',
  });

  // Settings form state
  const [settingsForm, setSettingsForm] = useState(settings);
  const [settingsSaved, setSettingsSaved] = useState(false);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoginError('');
    const ok = await login(email, password);
    if (!ok) {
      setLoginError('Credenciais inválidas. Utilize as contas de demonstração disponíveis.');
    }
  };

  const handleDemoLogin = async (demo: typeof demoUsers[0]) => {
    setEmail(demo.email);
    setPassword(demo.password);
    await login(demo.email, demo.password);
  };

  // Export CSV
  const handleExportCSV = () => {
    const headers = 'Código,Nome Completo,Nome Artístico,BI,Idade,Sexo,Telefone,Email,Município,Género Musical,Estado\n';
    const rows = candidates
      .map(
        (c) =>
          `"${c.codigoInscricao}","${c.nomeCompleto}","${c.nomeArtistico}","${c.bi}",${c.idade},"${c.sexo}","${c.telefone}","${c.email}","${c.municipio}","${c.generoMusical}","${c.estado}"`
      )
      .join('\n');

    const blob = new Blob([headers + rows], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.setAttribute('href', url);
    link.setAttribute('download', `the-voice-lunda-sul-candidatos-${new Date().toISOString().split('T')[0]}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  // Submit Jury Evaluation
  const handleSaveEvaluation = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!evalCandidate) return;

    const total =
      juryScores.tecnicaVocal +
      juryScores.afinacao +
      juryScores.presencaPalco +
      juryScores.originalidade +
      juryScores.interpretacao +
      juryScores.potencialArtistico;
    const media = Number((total / 6).toFixed(1));

    await submitEvaluation({
      candidatoId: evalCandidate.id,
      juradoId: user?.uid || 'juri-1',
      juradoNome: user?.nome || 'Jurado Oficial',
      tecnicaVocal: juryScores.tecnicaVocal,
      afinacao: juryScores.afinacao,
      presencaPalco: juryScores.presencaPalco,
      originalidade: juryScores.originalidade,
      interpretacao: juryScores.interpretacao,
      potencialArtistico: juryScores.potencialArtistico,
      pontuacaoTotal: total,
      media,
      observacoes: juryComment,
    });

    setEvalSaved(true);
    setTimeout(() => {
      setEvalSaved(false);
      setEvalCandidate(null);
      setJuryComment('');
    }, 2000);
  };

  // Save News
  const handleSaveNews = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newsForm.titulo || !newsForm.conteudo) return;

    if (editingNews) {
      await editNewsItem({
        ...editingNews,
        titulo: newsForm.titulo || editingNews.titulo,
        resumo: newsForm.resumo || editingNews.resumo,
        conteudo: newsForm.conteudo || editingNews.conteudo,
        imagemUrl: newsForm.imagemUrl || editingNews.imagemUrl,
        categoria: newsForm.categoria || editingNews.categoria,
        publicado: newsForm.publicado ?? editingNews.publicado,
      });
    } else {
      await addNewsItem({
        titulo: newsForm.titulo || '',
        resumo: newsForm.resumo || '',
        conteudo: newsForm.conteudo || '',
        imagemUrl:
          newsForm.imagemUrl ||
          'https://images.unsplash.com/photo-1516450360452-9312f5e86fc7?w=800&auto=format&fit=crop&q=80',
        categoria: newsForm.categoria || 'Comunicados',
        publicado: newsForm.publicado ?? true,
        dataPublicacao: new Date().toLocaleDateString('pt-PT'),
        autor: user?.nome || 'Comissão Organizadora',
      });
    }

    setIsCreatingNews(false);
    setEditingNews(null);
    setNewsForm({
      titulo: '',
      resumo: '',
      conteudo: '',
      imagemUrl: 'https://images.unsplash.com/photo-1516450360452-9312f5e86fc7?w=800&auto=format&fit=crop&q=80',
      categoria: 'Comunicados',
      publicado: true,
      autor: 'Comissão Organizadora',
    });
  };

  // Save Settings
  const handleSaveSettings = async (e: React.FormEvent) => {
    e.preventDefault();
    await updateEventSettings(settingsForm);
    setSettingsSaved(true);
    setTimeout(() => setSettingsSaved(false), 2500);
  };

  // Filtered Candidates
  const filteredCandidates = candidates.filter((c) => {
    const matchesSearch =
      c.nomeCompleto.toLowerCase().includes(candidateSearch.toLowerCase()) ||
      c.nomeArtistico.toLowerCase().includes(candidateSearch.toLowerCase()) ||
      c.codigoInscricao.toLowerCase().includes(candidateSearch.toLowerCase()) ||
      c.bi.toLowerCase().includes(candidateSearch.toLowerCase()) ||
      c.email.toLowerCase().includes(candidateSearch.toLowerCase());

    const matchesStatus = statusFilter === 'Todos' || c.estado === statusFilter;
    const matchesMun = municipioFilter === 'Todos' || c.municipio === municipioFilter;

    return matchesSearch && matchesStatus && matchesMun;
  });

  // -------------------------------------------------------------
  // LOGIN SCREEN
  // -------------------------------------------------------------
  if (!isAuthenticated) {
    return (
      <div className="max-w-md mx-auto px-4 pt-32 pb-20 space-y-8">
        <div className="text-center space-y-2">
          <div className="w-14 h-14 rounded-2xl bg-indigo-500/20 text-indigo-400 border border-indigo-500/30 flex items-center justify-center mx-auto shadow-lg">
            <ShieldCheck className="w-7 h-7" />
          </div>
          <h1 className="text-2xl sm:text-3xl font-black text-white">Portal Administrativo</h1>
          <p className="text-xs text-slate-400">
            Acesso reservado aos membros da Comissão Organizadora, Júri e Editores do THE VOICE LUNDA-SUL.
          </p>
        </div>

        {/* Demo Fast Login Buttons */}
        <div className="p-4 rounded-2xl bg-slate-900 border border-slate-800 space-y-3 text-left">
          <span className="text-[11px] font-bold text-sky-400 uppercase tracking-wider block">
            Acesso Rápido de Demonstração:
          </span>
          <div className="grid grid-cols-1 gap-2">
            {demoUsers.map((demo) => (
              <button
                key={demo.email}
                type="button"
                onClick={() => handleDemoLogin(demo)}
                className="p-2.5 rounded-xl bg-slate-950 hover:bg-slate-800 border border-slate-800 flex items-center justify-between text-xs transition-colors"
              >
                <div>
                  <strong className="text-white block">{demo.nome}</strong>
                  <span className="text-[10px] text-slate-400">{demo.email}</span>
                </div>
                <span className="px-2 py-0.5 rounded-md bg-indigo-500/20 text-indigo-300 text-[10px] font-bold">
                  {demo.papel}
                </span>
              </button>
            ))}
          </div>
        </div>

        {/* Credentials Form */}
        <form
          onSubmit={handleLogin}
          className="rounded-3xl bg-slate-900 border border-slate-800 p-6 space-y-4 text-left shadow-2xl"
        >
          {loginError && (
            <div className="p-3 rounded-xl bg-red-500/20 border border-red-500/30 text-red-300 text-xs font-semibold flex items-center gap-2">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>{loginError}</span>
            </div>
          )}

          <div className="space-y-1.5">
            <label className="text-xs font-bold text-slate-300">Email Administrativo</label>
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-4 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-white text-xs focus:outline-none focus:border-indigo-400"
            />
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-bold text-slate-300">Palavra-passe</label>
            <input
              type="password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-4 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-white text-xs focus:outline-none focus:border-indigo-400"
            />
          </div>

          <button
            type="submit"
            className="w-full py-3 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs uppercase tracking-wider shadow-lg shadow-indigo-600/30 transition-all"
          >
            Iniciar Sessão no Painel
          </button>
        </form>
      </div>
    );
  }

  // -------------------------------------------------------------
  // AUTHENTICATED ADMIN DASHBOARD
  // -------------------------------------------------------------
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 pt-28 pb-20 space-y-8">
      {/* Top Bar with User Info */}
      <div className="p-6 rounded-3xl bg-slate-900 border border-indigo-900/40 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 shadow-xl">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-2xl bg-indigo-500/20 text-indigo-400 border border-indigo-500/30 flex items-center justify-center shrink-0">
            <ShieldCheck className="w-6 h-6" />
          </div>
          <div className="text-left">
            <div className="flex items-center gap-2">
              <h1 className="text-xl font-bold text-white">{user.nome}</h1>
              <span className="px-2.5 py-0.5 rounded-full bg-indigo-500/20 text-indigo-300 text-[10px] font-bold uppercase border border-indigo-400/30">
                {user.papel}
              </span>
            </div>
            <p className="text-xs text-slate-400">{user.email} • THE VOICE LUNDA-SUL</p>
          </div>
        </div>

        <div className="flex items-center gap-3 w-full sm:w-auto">
          <button
            onClick={handleExportCSV}
            className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 text-xs font-bold flex items-center gap-2"
          >
            <Download className="w-4 h-4 text-sky-400" />
            <span>Exportar CSV</span>
          </button>

          <button
            onClick={logout}
            className="px-4 py-2 rounded-xl bg-red-950/40 hover:bg-red-900/60 text-red-300 border border-red-800/40 text-xs font-bold flex items-center gap-1.5"
          >
            <LogOut className="w-4 h-4" />
            <span>Sair</span>
          </button>
        </div>
      </div>

      {/* Tabs Bar */}
      <div className="flex flex-wrap items-center gap-2 border-b border-slate-800 pb-3">
        {[
          { id: 'overview', label: 'Visão Geral', icon: Sparkles },
          { id: 'candidates', label: `Candidatos (${candidates.length})`, icon: Users },
          { id: 'jury', label: 'Avaliações do Júri', icon: Award },
          { id: 'news', label: 'Notícias & Imprensa', icon: Newspaper },
          { id: 'stages', label: 'Etapas do Concurso', icon: Calendar },
          { id: 'settings', label: 'Configurações', icon: Settings },
        ].map((tab) => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`px-4 py-2 rounded-xl text-xs font-bold flex items-center gap-2 transition-all ${
                isActive
                  ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-600/30'
                  : 'bg-slate-900 text-slate-300 hover:text-white hover:bg-slate-800'
              }`}
            >
              <Icon className="w-4 h-4" />
              <span>{tab.label}</span>
            </button>
          );
        })}
      </div>

      {/* ------------------ TAB: OVERVIEW ------------------ */}
      {activeTab === 'overview' && (
        <div className="space-y-8">
          {/* Metric Stats Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 text-left">
            <div className="p-6 rounded-3xl bg-slate-900 border border-sky-900/40 space-y-2 shadow-lg">
              <div className="flex items-center justify-between text-slate-400">
                <span className="text-xs font-bold uppercase tracking-wider">Total de Inscrições</span>
                <Users className="w-5 h-5 text-sky-400" />
              </div>
              <div className="text-3xl font-black text-white">{candidates.length}</div>
              <span className="text-[11px] text-emerald-400 font-semibold flex items-center gap-1">
                <CheckCircle2 className="w-3.5 h-3.5" /> 100% gravados em base segura
              </span>
            </div>

            <div className="p-6 rounded-3xl bg-slate-900 border border-emerald-900/40 space-y-2 shadow-lg">
              <div className="flex items-center justify-between text-slate-400">
                <span className="text-xs font-bold uppercase tracking-wider">Aprovados / Classificados</span>
                <CheckCircle2 className="w-5 h-5 text-emerald-400" />
              </div>
              <div className="text-3xl font-black text-emerald-400">
                {candidates.filter((c) => c.estado === 'Aprovada' || c.estado === 'Aprovado para Audição' || c.estado === 'Classificada').length}
              </div>
              <span className="text-[11px] text-slate-400">Convocados para fase presencial</span>
            </div>

            <div className="p-6 rounded-3xl bg-slate-900 border border-amber-900/40 space-y-2 shadow-lg">
              <div className="flex items-center justify-between text-slate-400">
                <span className="text-xs font-bold uppercase tracking-wider">Avaliações Feitas</span>
                <Award className="w-5 h-5 text-amber-400" />
              </div>
              <div className="text-3xl font-black text-amber-400">
                {candidates.reduce((acc, c) => acc + (c.avaliacoes?.length || 0), 0)}
              </div>
              <span className="text-[11px] text-slate-400">Pontuações de júri registadas</span>
            </div>

            <div className="p-6 rounded-3xl bg-slate-900 border border-indigo-900/40 space-y-2 shadow-lg">
              <div className="flex items-center justify-between text-slate-400">
                <span className="text-xs font-bold uppercase tracking-wider">Estado das Inscrições</span>
                <Clock className="w-5 h-5 text-indigo-400" />
              </div>
              <div className="text-lg font-black text-white">
                {settings.estadoInscricoes === 'aberta' || settings.estadoInscricoes === 'automatica' ? (
                  <span className="text-emerald-400">Abertas (Ativas)</span>
                ) : (
                  <span className="text-red-400">Encerradas</span>
                )}
              </div>
              <span className="text-[11px] text-slate-400">Até 09 de Novembro de 2026</span>
            </div>
          </div>

          {/* Candidates by Municipality */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 text-left">
            <div className="p-6 rounded-3xl bg-slate-900 border border-slate-800 space-y-4">
              <h3 className="text-base font-bold text-white">Inscrições por Município da Lunda-Sul</h3>
              <div className="space-y-3">
                {['Saurimo', 'Cacolo', 'Dala', 'Muconda'].map((mun) => {
                  const count = candidates.filter((c) => c.municipio === mun).length;
                  const pct = candidates.length > 0 ? (count / candidates.length) * 100 : 0;
                  return (
                    <div key={mun} className="space-y-1">
                      <div className="flex justify-between text-xs font-bold">
                        <span className="text-white">{mun}</span>
                        <span className="text-sky-400">{count} candidatos ({pct.toFixed(0)}%)</span>
                      </div>
                      <div className="w-full h-2 rounded-full bg-slate-950 overflow-hidden">
                        <div
                          className="h-full bg-sky-500 rounded-full"
                          style={{ width: `${pct}%` }}
                        />
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Quick Actions */}
            <div className="p-6 rounded-3xl bg-slate-900 border border-slate-800 space-y-4">
              <h3 className="text-base font-bold text-white">Ações Rápidas de Gestão</h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <button
                  onClick={() => setActiveTab('candidates')}
                  className="p-4 rounded-2xl bg-slate-950 hover:bg-slate-800 border border-slate-800 text-left space-y-1 transition-colors"
                >
                  <Users className="w-5 h-5 text-sky-400" />
                  <strong className="text-white text-xs block">Gerir Candidatos</strong>
                  <span className="text-[10px] text-slate-400">Ver lista, alterar estados e notas</span>
                </button>

                <button
                  onClick={() => setActiveTab('jury')}
                  className="p-4 rounded-2xl bg-slate-950 hover:bg-slate-800 border border-slate-800 text-left space-y-1 transition-colors"
                >
                  <Award className="w-5 h-5 text-amber-400" />
                  <strong className="text-white text-xs block">Módulo do Júri</strong>
                  <span className="text-[10px] text-slate-400">Avaliar vozes nos 6 critérios</span>
                </button>

                <button
                  onClick={() => {
                    setIsCreatingNews(true);
                    setActiveTab('news');
                  }}
                  className="p-4 rounded-2xl bg-slate-950 hover:bg-slate-800 border border-slate-800 text-left space-y-1 transition-colors"
                >
                  <Newspaper className="w-5 h-5 text-emerald-400" />
                  <strong className="text-white text-xs block">Criar Comunicado</strong>
                  <span className="text-[10px] text-slate-400">Publicar notícia oficial</span>
                </button>

                <button
                  onClick={() => setActiveTab('settings')}
                  className="p-4 rounded-2xl bg-slate-950 hover:bg-slate-800 border border-slate-800 text-left space-y-1 transition-colors"
                >
                  <Settings className="w-5 h-5 text-purple-400" />
                  <strong className="text-white text-xs block">Configurações</strong>
                  <span className="text-[10px] text-slate-400">Controlar prazos e contactos</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ------------------ TAB: CANDIDATES ------------------ */}
      {activeTab === 'candidates' && (
        <div className="space-y-6 text-left">
          {/* Filters Bar */}
          <div className="p-4 rounded-2xl bg-slate-900 border border-slate-800 flex flex-col md:flex-row items-center justify-between gap-4">
            <div className="relative w-full md:w-80">
              <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                placeholder="Pesquisar por nome, BI, código..."
                value={candidateSearch}
                onChange={(e) => setCandidateSearch(e.target.value)}
                className="w-full pl-9 pr-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-white text-xs focus:outline-none focus:border-sky-400"
              />
            </div>

            <div className="flex flex-wrap items-center gap-3 w-full md:w-auto">
              <div className="flex items-center gap-2">
                <span className="text-xs text-slate-400 font-bold">Estado:</span>
                <select
                  value={statusFilter}
                  onChange={(e) => setStatusFilter(e.target.value)}
                  className="px-3 py-1.5 rounded-xl bg-slate-950 border border-slate-800 text-white text-xs"
                >
                  <option value="Todos">Todos os Estados</option>
                  <option value="Recebida">Recebida</option>
                  <option value="Em análise">Em análise</option>
                  <option value="Aprovada">Aprovada</option>
                  <option value="Pré-seleccionada">Pré-seleccionada</option>
                  <option value="Classificada">Classificada</option>
                  <option value="Eliminada">Eliminada</option>
                </select>
              </div>

              <div className="flex items-center gap-2">
                <span className="text-xs text-slate-400 font-bold">Município:</span>
                <select
                  value={municipioFilter}
                  onChange={(e) => setMunicipioFilter(e.target.value)}
                  className="px-3 py-1.5 rounded-xl bg-slate-950 border border-slate-800 text-white text-xs"
                >
                  <option value="Todos">Todos os Municípios</option>
                  <option value="Saurimo">Saurimo</option>
                  <option value="Cacolo">Cacolo</option>
                  <option value="Dala">Dala</option>
                  <option value="Muconda">Muconda</option>
                </select>
              </div>
            </div>
          </div>

          {/* Table */}
          <div className="rounded-3xl bg-slate-900 border border-slate-800 overflow-x-auto shadow-2xl">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-950/80 text-slate-400 font-bold border-b border-slate-800">
                <tr>
                  <th className="p-4">Candidato</th>
                  <th className="p-4">Código / BI</th>
                  <th className="p-4">Município</th>
                  <th className="p-4">Género Musical</th>
                  <th className="p-4">Contacto</th>
                  <th className="p-4">Estado</th>
                  <th className="p-4 text-right">Ações</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800 text-slate-300">
                {filteredCandidates.map((c) => (
                  <tr key={c.id} className="hover:bg-slate-800/50 transition-colors">
                    <td className="p-4">
                      <div className="flex items-center gap-3">
                        <img
                          src={c.fotoUrl || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=600&auto=format&fit=crop&q=80'}
                          alt={c.nomeArtistico}
                          className="w-10 h-10 rounded-xl object-cover border border-sky-400/40"
                        />
                        <div>
                          <strong className="text-white block">{c.nomeArtistico}</strong>
                          <span className="text-[10px] text-slate-400">{c.nomeCompleto}</span>
                        </div>
                      </div>
                    </td>
                    <td className="p-4">
                      <span className="font-mono font-bold text-sky-300 block">{c.codigoInscricao}</span>
                      <span className="text-[10px] text-slate-400 font-mono">{c.bi}</span>
                    </td>
                    <td className="p-4 font-medium text-white">{c.municipio}</td>
                    <td className="p-4">{c.generoMusical}</td>
                    <td className="p-4">
                      <span className="block text-white font-medium">{c.telefone}</span>
                      <span className="text-[10px] text-slate-400">{c.email}</span>
                    </td>
                    <td className="p-4">
                      <span
                        className={`px-2.5 py-1 rounded-full text-[10px] font-bold ${
                          c.estado === 'Aprovada' || c.estado === 'Classificada' || c.estado === 'Pré-seleccionada'
                            ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30'
                            : c.estado === 'Eliminada' || c.estado === 'Rejeitado'
                            ? 'bg-red-500/20 text-red-300 border border-red-500/30'
                            : 'bg-sky-500/20 text-sky-300 border border-sky-500/30'
                        }`}
                      >
                        {c.estado}
                      </span>
                    </td>
                    <td className="p-4 text-right space-x-2">
                      <button
                        onClick={() => {
                          setSelectedCandidate(c);
                          setNewStatus(c.estado);
                          setAdminNote(c.notasAdmin || '');
                        }}
                        className="px-3 py-1.5 rounded-lg bg-sky-600/20 text-sky-300 hover:bg-sky-600/40 font-semibold"
                      >
                        Gerir
                      </button>
                      <button
                        onClick={() => {
                          if (confirm(`Tem a certeza que deseja eliminar ${c.nomeArtistico}?`)) {
                            deleteCandidate(c.id);
                          }
                        }}
                        className="p-1.5 rounded-lg bg-red-950/40 text-red-400 hover:bg-red-900/60"
                        title="Eliminar Inscrição"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Candidate Management Modal */}
          {selectedCandidate && (
            <div className="fixed inset-0 z-50 bg-slate-950/85 backdrop-blur-sm flex items-center justify-center p-4">
              <div className="bg-slate-900 border border-sky-900/60 rounded-3xl max-w-2xl w-full p-6 max-h-[90vh] overflow-y-auto space-y-6">
                <div className="flex items-center justify-between pb-4 border-b border-slate-800">
                  <h3 className="text-lg font-bold text-white flex items-center gap-2">
                    <UserCheck className="w-5 h-5 text-sky-400" />
                    Gerir Candidato: {selectedCandidate.nomeArtistico}
                  </h3>
                  <button
                    onClick={() => setSelectedCandidate(null)}
                    className="text-slate-400 hover:text-white"
                  >
                    <X className="w-5 h-5" />
                  </button>
                </div>

                <div className="grid grid-cols-2 gap-4 text-xs">
                  <div className="p-3 rounded-xl bg-slate-950">
                    <span className="text-slate-400 block">Nome Completo:</span>
                    <span className="text-white font-bold">{selectedCandidate.nomeCompleto}</span>
                  </div>
                  <div className="p-3 rounded-xl bg-slate-950">
                    <span className="text-slate-400 block">Código:</span>
                    <span className="text-sky-300 font-mono font-bold">{selectedCandidate.codigoInscricao}</span>
                  </div>
                  <div className="p-3 rounded-xl bg-slate-950">
                    <span className="text-slate-400 block">Idade:</span>
                    <span className="text-white font-bold">{selectedCandidate.idade} anos</span>
                  </div>
                  <div className="p-3 rounded-xl bg-slate-950">
                    <span className="text-slate-400 block">Município:</span>
                    <span className="text-white font-bold">{selectedCandidate.municipio}</span>
                  </div>
                </div>

                {/* Status Update Form */}
                <div className="space-y-3">
                  <label className="text-xs font-bold text-white block">Actualizar Estado Oficial:</label>
                  <select
                    value={newStatus}
                    onChange={(e) => setNewStatus(e.target.value as any)}
                    className="w-full px-4 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-white text-xs"
                  >
                    <option value="Recebida">Recebida</option>
                    <option value="Em análise">Em análise</option>
                    <option value="Aprovada">Aprovada</option>
                    <option value="Pré-seleccionada">Pré-seleccionada</option>
                    <option value="Classificada">Classificada</option>
                    <option value="Eliminada">Eliminada</option>
                  </select>
                </div>

                {/* Note / Convocação */}
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-white block">
                    Nota / Comunicado da Organização (Visível na Área do Candidato):
                  </label>
                  <textarea
                    rows={3}
                    placeholder="Ex: Convocado para Audição no Pavilhão Multiusos a 15 de Outubro às 09h00..."
                    value={adminNote}
                    onChange={(e) => setAdminNote(e.target.value)}
                    className="w-full px-4 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-white text-xs"
                  />
                </div>

                <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-800">
                  <button
                    type="button"
                    onClick={() => setSelectedCandidate(null)}
                    className="px-4 py-2 rounded-xl bg-slate-800 text-slate-300 text-xs font-bold"
                  >
                    Cancelar
                  </button>
                  <button
                    type="button"
                    onClick={async () => {
                      await updateCandidateStatus(selectedCandidate.id, newStatus, adminNote);
                      setSelectedCandidate(null);
                    }}
                    className="px-6 py-2 rounded-xl bg-sky-600 hover:bg-sky-500 text-white text-xs font-bold"
                  >
                    Guardar Alterações
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      )}

      {/* ------------------ TAB: JURY ------------------ */}
      {activeTab === 'jury' && (
        <div className="space-y-8 text-left">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div>
              <h3 className="text-lg font-bold text-white flex items-center gap-2">
                <Award className="w-5 h-5 text-amber-400" />
                Módulo de Avaliação Técnica do Júri
              </h3>
              <p className="text-xs text-slate-400">
                Classifique as performances dos candidatos nos 6 pilares oficiais (Escala 1 a 10).
              </p>
            </div>
          </div>

          {/* Candidate Selector */}
          <div className="p-6 rounded-3xl bg-slate-900 border border-amber-900/40 space-y-6">
            <div className="space-y-2">
              <label className="text-xs font-bold text-slate-300">Seleccionar Candidato para Avaliar:</label>
              <select
                value={evalCandidate?.id || ''}
                onChange={(e) => {
                  const found = candidates.find((c) => c.id === e.target.value);
                  setEvalCandidate(found || null);
                }}
                className="w-full px-4 py-3 rounded-xl bg-slate-950 border border-slate-800 text-white text-sm font-bold focus:border-amber-400"
              >
                <option value="">-- Escolha um candidato --</option>
                {candidates.map((c) => (
                  <option key={c.id} value={c.id}>
                    {c.codigoInscricao} — {c.nomeArtistico} ({c.municipio} • {c.generoMusical})
                  </option>
                ))}
              </select>
            </div>

            {evalCandidate && (
              <form onSubmit={handleSaveEvaluation} className="space-y-6 pt-4 border-t border-slate-800">
                {evalSaved && (
                  <div className="p-3 rounded-xl bg-emerald-500/20 border border-emerald-500/30 text-emerald-300 text-xs font-bold flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4" />
                    <span>Avaliação gravada com sucesso!</span>
                  </div>
                )}

                {/* Criteria Sliders */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                  {[
                    { key: 'tecnicaVocal', label: 'Técnica Vocal (1-10)' },
                    { key: 'afinacao', label: 'Afinação (1-10)' },
                    { key: 'presencaPalco', label: 'Presença em Palco (1-10)' },
                    { key: 'originalidade', label: 'Originalidade (1-10)' },
                    { key: 'interpretacao', label: 'Interpretação (1-10)' },
                    { key: 'potencialArtistico', label: 'Potencial Artístico (1-10)' },
                  ].map((crit) => (
                    <div key={crit.key} className="p-4 rounded-2xl bg-slate-950 border border-slate-800 space-y-2">
                      <div className="flex justify-between text-xs font-bold">
                        <span className="text-white">{crit.label}</span>
                        <span className="text-amber-400 font-mono text-sm">
                          {(juryScores as any)[crit.key]} / 10
                        </span>
                      </div>
                      <input
                        type="range"
                        min="1"
                        max="10"
                        step="0.5"
                        value={(juryScores as any)[crit.key]}
                        onChange={(e) =>
                          setJuryScores({
                            ...juryScores,
                            [crit.key]: parseFloat(e.target.value),
                          })
                        }
                        className="w-full accent-amber-400 cursor-pointer"
                      />
                    </div>
                  ))}
                </div>

                {/* Comments */}
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-slate-300">Comentários e Parecer Técnico do Júri:</label>
                  <textarea
                    rows={3}
                    required
                    placeholder="Registo das notas qualitativas sobre timbre, dicção, postura e pontos a melhorar..."
                    value={juryComment}
                    onChange={(e) => setJuryComment(e.target.value)}
                    className="w-full px-4 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-white text-xs"
                  />
                </div>

                <div className="flex items-center justify-between pt-2">
                  <div className="text-xs font-bold text-slate-300">
                    Média Calculada:{' '}
                    <span className="text-xl font-black text-amber-400 font-mono">
                      {(
                        (juryScores.tecnicaVocal +
                          juryScores.afinacao +
                          juryScores.presencaPalco +
                          juryScores.originalidade +
                          juryScores.interpretacao +
                          juryScores.potencialArtistico) /
                        6
                      ).toFixed(1)}{' '}
                      / 10
                    </span>
                  </div>

                  <button
                    type="submit"
                    className="px-8 py-3 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-black text-xs uppercase tracking-wider shadow-lg shadow-amber-500/20"
                  >
                    Submeter Avaliação Oficial
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      )}

      {/* ------------------ TAB: NEWS ------------------ */}
      {activeTab === 'news' && (
        <div className="space-y-6 text-left">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-bold text-white flex items-center gap-2">
              <Newspaper className="w-5 h-5 text-sky-400" />
              Gestão de Notícias & Imprensa
            </h3>
            <button
              onClick={() => {
                setEditingNews(null);
                setNewsForm({
                  titulo: '',
                  resumo: '',
                  conteudo: '',
                  imagemUrl: 'https://images.unsplash.com/photo-1516450360452-9312f5e86fc7?w=800&auto=format&fit=crop&q=80',
                  categoria: 'Comunicados',
                  publicado: true,
                  autor: 'Comissão Organizadora',
                });
                setIsCreatingNews(true);
              }}
              className="px-4 py-2 rounded-xl bg-sky-600 hover:bg-sky-500 text-white text-xs font-bold flex items-center gap-2"
            >
              <Plus className="w-4 h-4" />
              <span>Nova Notícia</span>
            </button>
          </div>

          {/* Form Modal for Creating/Editing News */}
          {isCreatingNews && (
            <div className="fixed inset-0 z-50 bg-slate-950/85 backdrop-blur-sm flex items-center justify-center p-4">
              <form
                onSubmit={handleSaveNews}
                className="bg-slate-900 border border-sky-900/60 rounded-3xl max-w-2xl w-full p-6 max-h-[90vh] overflow-y-auto space-y-4"
              >
                <div className="flex items-center justify-between pb-3 border-b border-slate-800">
                  <h4 className="text-base font-bold text-white">
                    {editingNews ? 'Editar Notícia' : 'Criar Nova Notícia'}
                  </h4>
                  <button
                    type="button"
                    onClick={() => setIsCreatingNews(false)}
                    className="text-slate-400 hover:text-white"
                  >
                    <X className="w-5 h-5" />
                  </button>
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-slate-300">Título da Notícia *</label>
                  <input
                    type="text"
                    required
                    value={newsForm.titulo}
                    onChange={(e) => setNewsForm({ ...newsForm, titulo: e.target.value })}
                    className="w-full px-4 py-2 rounded-xl bg-slate-950 border border-slate-800 text-white text-xs"
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-1.5">
                    <label className="text-xs font-bold text-slate-300">Categoria</label>
                    <select
                      value={newsForm.categoria}
                      onChange={(e) => setNewsForm({ ...newsForm, categoria: e.target.value })}
                      className="w-full px-4 py-2 rounded-xl bg-slate-950 border border-slate-800 text-white text-xs"
                    >
                      <option value="Comunicados">Comunicados</option>
                      <option value="Audições">Audições</option>
                      <option value="Galas">Galas</option>
                      <option value="Cultura">Cultura</option>
                    </select>
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-xs font-bold text-slate-300">URL da Imagem</label>
                    <input
                      type="url"
                      value={newsForm.imagemUrl}
                      onChange={(e) => setNewsForm({ ...newsForm, imagemUrl: e.target.value })}
                      className="w-full px-4 py-2 rounded-xl bg-slate-950 border border-slate-800 text-white text-xs"
                    />
                  </div>
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-slate-300">Resumo *</label>
                  <textarea
                    rows={2}
                    required
                    value={newsForm.resumo}
                    onChange={(e) => setNewsForm({ ...newsForm, resumo: e.target.value })}
                    className="w-full px-4 py-2 rounded-xl bg-slate-950 border border-slate-800 text-white text-xs"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-slate-300">Conteúdo Completo *</label>
                  <textarea
                    rows={6}
                    required
                    value={newsForm.conteudo}
                    onChange={(e) => setNewsForm({ ...newsForm, conteudo: e.target.value })}
                    className="w-full px-4 py-2 rounded-xl bg-slate-950 border border-slate-800 text-white text-xs"
                  />
                </div>

                <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-800">
                  <button
                    type="button"
                    onClick={() => setIsCreatingNews(false)}
                    className="px-4 py-2 rounded-xl bg-slate-800 text-slate-300 text-xs font-bold"
                  >
                    Cancelar
                  </button>
                  <button
                    type="submit"
                    className="px-6 py-2 rounded-xl bg-sky-600 hover:bg-sky-500 text-white text-xs font-bold"
                  >
                    Publicar Notícia
                  </button>
                </div>
              </form>
            </div>
          )}

          {/* News List */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {news.map((item) => (
              <div
                key={item.id}
                className="p-5 rounded-2xl bg-slate-900 border border-slate-800 flex items-start justify-between gap-4"
              >
                <div className="space-y-1.5">
                  <span className="text-[10px] font-bold text-sky-400">{item.categoria}</span>
                  <h4 className="text-sm font-bold text-white">{item.titulo}</h4>
                  <p className="text-xs text-slate-400 line-clamp-2">{item.resumo}</p>
                </div>

                <div className="flex items-center gap-2 shrink-0">
                  <button
                    onClick={() => {
                      setEditingNews(item);
                      setNewsForm(item);
                      setIsCreatingNews(true);
                    }}
                    className="p-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300"
                    title="Editar"
                  >
                    <Edit className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => {
                      if (confirm(`Eliminar notícia "${item.titulo}"?`)) {
                        deleteNews(item.id);
                      }
                    }}
                    className="p-2 rounded-lg bg-red-950/40 hover:bg-red-900/60 text-red-400"
                    title="Eliminar"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ------------------ TAB: STAGES ------------------ */}
      {activeTab === 'stages' && (
        <div className="space-y-6 text-left">
          <h3 className="text-lg font-bold text-white flex items-center gap-2">
            <Calendar className="w-5 h-5 text-sky-400" />
            Controlo das 8 Etapas do Concurso
          </h3>

          <div className="space-y-4">
            {stages.map((stage) => (
              <div
                key={stage.id}
                className="p-5 rounded-2xl bg-slate-900 border border-slate-800 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4"
              >
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <span className="px-2 py-0.5 rounded-md bg-sky-500/20 text-sky-300 text-xs font-bold">
                      0{stage.numero}
                    </span>
                    <h4 className="text-base font-bold text-white">{stage.nome}</h4>
                  </div>
                  <p className="text-xs text-slate-400">{stage.descricao}</p>
                  <span className="text-[11px] text-sky-400 font-mono block">
                    {stage.dataInicio} — {stage.dataFim}
                  </span>
                </div>

                <div className="flex items-center gap-2">
                  <select
                    value={stage.estado}
                    onChange={(e) => {
                      const updated = stages.map((s) =>
                        s.id === stage.id ? { ...s, estado: e.target.value as any } : s
                      );
                      saveAllStages(updated);
                    }}
                    className="px-3 py-1.5 rounded-xl bg-slate-950 border border-slate-800 text-white text-xs font-bold"
                  >
                    <option value="pendente">Pendente</option>
                    <option value="ativa">Ativa (Em Curso)</option>
                    <option value="concluida">Concluída</option>
                  </select>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ------------------ TAB: SETTINGS ------------------ */}
      {activeTab === 'settings' && (
        <div className="p-6 sm:p-8 rounded-3xl bg-slate-900 border border-slate-800 space-y-6 text-left">
          <div className="border-b border-slate-800 pb-4 flex items-center justify-between">
            <div>
              <h3 className="text-lg font-bold text-white flex items-center gap-2">
                <Settings className="w-5 h-5 text-purple-400" />
                Configurações Gerais do Evento
              </h3>
              <p className="text-xs text-slate-400">
                Prazos oficiais, contactos, slogans e controlos globais da plataforma.
              </p>
            </div>
            {settingsSaved && (
              <span className="text-xs font-bold text-emerald-400 flex items-center gap-1">
                <CheckCircle2 className="w-4 h-4" /> Guardado!
              </span>
            )}
          </div>

          <form onSubmit={handleSaveSettings} className="space-y-5">
            {/* Toggle Registrations Open */}
            <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800 flex items-center justify-between">
              <div>
                <strong className="text-white text-sm block">Estado das Inscrições no Site</strong>
                <span className="text-xs text-slate-400">
                  {settingsForm.estadoInscricoes === 'aberta' ? 'Forçadamente Abertas' : settingsForm.estadoInscricoes === 'encerrada' ? 'Encerradas' : 'Automático por Data (13 Set - 09 Nov)'}
                </span>
              </div>
              <select
                value={settingsForm.estadoInscricoes}
                onChange={(e) =>
                  setSettingsForm({ ...settingsForm, estadoInscricoes: e.target.value as any })
                }
                className="px-3 py-2 rounded-xl bg-slate-900 border border-slate-700 text-white text-xs font-bold"
              >
                <option value="automatica">Automático por Data</option>
                <option value="aberta">Abertas (Forçar)</option>
                <option value="encerrada">Encerradas (Bloquear)</option>
              </select>
            </div>

            {/* Slogan */}
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-slate-300">Slogan Oficial</label>
              <input
                type="text"
                value={settingsForm.slogan}
                onChange={(e) => setSettingsForm({ ...settingsForm, slogan: e.target.value })}
                className="w-full px-4 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-white text-xs"
              />
            </div>

            {/* Dates */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-300">Data de Início das Inscrições</label>
                <input
                  type="text"
                  value={settingsForm.dataInicioInscricoes}
                  onChange={(e) =>
                    setSettingsForm({ ...settingsForm, dataInicioInscricoes: e.target.value })
                  }
                  className="w-full px-4 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-white text-xs font-mono"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-300">Data de Fim das Inscrições</label>
                <input
                  type="text"
                  value={settingsForm.dataFimInscricoes}
                  onChange={(e) =>
                    setSettingsForm({ ...settingsForm, dataFimInscricoes: e.target.value })
                  }
                  className="w-full px-4 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-white text-xs font-mono"
                />
              </div>
            </div>

            {/* Contactos */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-300">Telefone Oficial</label>
                <input
                  type="text"
                  value={settingsForm.contactos.telefone}
                  onChange={(e) =>
                    setSettingsForm({
                      ...settingsForm,
                      contactos: { ...settingsForm.contactos, telefone: e.target.value },
                    })
                  }
                  className="w-full px-4 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-white text-xs"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-300">WhatsApp Oficial</label>
                <input
                  type="text"
                  value={settingsForm.contactos.whatsapp}
                  onChange={(e) =>
                    setSettingsForm({
                      ...settingsForm,
                      contactos: { ...settingsForm.contactos, whatsapp: e.target.value },
                    })
                  }
                  className="w-full px-4 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-white text-xs"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-300">Email Oficial</label>
                <input
                  type="email"
                  value={settingsForm.contactos.email}
                  onChange={(e) =>
                    setSettingsForm({
                      ...settingsForm,
                      contactos: { ...settingsForm.contactos, email: e.target.value },
                    })
                  }
                  className="w-full px-4 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-white text-xs"
                />
              </div>
            </div>

            <div className="pt-4 flex justify-end">
              <button
                type="submit"
                className="px-8 py-3 rounded-xl bg-purple-600 hover:bg-purple-500 text-white font-bold text-xs uppercase tracking-wider shadow-lg shadow-purple-600/30"
              >
                Guardar Configurações
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
};
