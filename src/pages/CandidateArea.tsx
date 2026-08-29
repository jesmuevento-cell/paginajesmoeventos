import React, { useState } from 'react';
import {
  UserCheck,
  Search,
  CheckCircle2,
  Clock,
  AlertCircle,
  Award,
  Calendar,
  FileText,
  Printer,
  Phone,
  Mail,
  MapPin,
  Music,
  Share2,
  Sparkles,
  ChevronRight,
  MessageSquare,
  Loader2,
  RefreshCw,
  CreditCard,
  Upload,
  ShieldCheck,
  Building2,
} from 'lucide-react';
import { useEvent } from '../context/EventContext';
import { Candidate, CandidateStatus, PaymentOrder } from '../types';
import { findCandidateByCodeOrEmail } from '../firebase/services';
import { PaymentProofModal } from '../components/PaymentProofModal';
import { PaymentReceiptModal } from '../components/PaymentReceiptModal';
import { REGISTRATION_FEE, REGISTRATION_CURRENCY } from '../services/paymentService';
import { printCandidateDossier, printReceipt } from '../utils/printReceipt';

export const CandidateArea: React.FC = () => {
  const {
    candidates,
    evaluations,
    paymentOrders,
    paymentMethods,
    submitPaymentProof,
    getPaymentOrderByCode,
    refreshData,
  } = useEvent();
  const [searchQuery, setSearchQuery] = useState('');
  const [searching, setSearching] = useState(false);
  const [searched, setSearched] = useState(false);
  const [candidate, setCandidate] = useState<Candidate | null>(null);

  // Modals for payment
  const [isProofModalOpen, setIsProofModalOpen] = useState(false);
  const [isReceiptModalOpen, setIsReceiptModalOpen] = useState(false);

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    const query = searchQuery.trim().toLowerCase();
    if (!query) return;

    setSearching(true);
    setSearched(false);

    try {
      // 1. Procurar em memória primeiro
      let found = candidates.find(
        (c) =>
          c.codigoInscricao.toLowerCase() === query ||
          c.email.toLowerCase() === query ||
          c.bi.toLowerCase() === query ||
          (c.bi && c.bi.toLowerCase().replace(/\s+/g, '') === query.replace(/\s+/g, '')) ||
          (c.telefone && c.telefone.replace(/\D/g, '') === query.replace(/\D/g, '')) ||
          (c.whatsapp && c.whatsapp.replace(/\D/g, '') === query.replace(/\D/g, '')) ||
          c.nomeCompleto.toLowerCase().includes(query) ||
          c.nomeArtistico.toLowerCase().includes(query)
      );

      // 2. Se não encontrar em memória ou para obter o registo mais recente da nuvem
      if (!found) {
        found = (await findCandidateByCodeOrEmail(searchQuery)) || undefined;
      }

      setCandidate(found || null);
    } catch (err) {
      console.warn('Erro ao consultar candidato:', err);
      // Fallback em memória
      const fallback = candidates.find(
        (c) =>
          c.codigoInscricao.toLowerCase() === query ||
          c.email.toLowerCase() === query ||
          c.bi.toLowerCase() === query
      );
      setCandidate(fallback || null);
    } finally {
      setSearching(false);
      setSearched(true);
    }
  };

  const getStatusBadge = (estado: CandidateStatus) => {
    switch (estado) {
      case 'Aprovada':
      case 'Aprovado para Audição':
      case 'Classificada':
      case 'Classificado':
      case 'Pré-seleccionada':
      case 'Vencedor':
        return (
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-400/40 text-xs font-bold">
            <CheckCircle2 className="w-4 h-4 text-emerald-400" />
            {estado}
          </span>
        );
      case 'Recebida':
      case 'Em análise':
      case 'Inscrito':
      case 'Em Avaliação':
        return (
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-sky-500/20 text-sky-300 border border-sky-400/40 text-xs font-bold">
            <Clock className="w-4 h-4 text-sky-400" />
            {estado}
          </span>
        );
      case 'Eliminada':
      case 'Rejeitado':
        return (
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-red-500/20 text-red-300 border border-red-400/40 text-xs font-bold">
            <AlertCircle className="w-4 h-4 text-red-400" />
            Não Seleccionado
          </span>
        );
      default:
        return (
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-slate-800 text-slate-300 text-xs font-bold">
            {estado}
          </span>
        );
    }
  };

  const candidateEvals = candidate
    ? evaluations.filter((e) => e.candidatoId === candidate.id)
    : [];

  // Match or generate candidate payment order
  const currentOrder: PaymentOrder | undefined = candidate
    ? paymentOrders.find(
        (o) =>
          (o.codigoInscricao && o.codigoInscricao.toUpperCase() === candidate.codigoInscricao.toUpperCase()) ||
          o.candidatoId === candidate.id ||
          (o.biConcorrente && o.biConcorrente.toUpperCase() === candidate.bi.toUpperCase())
      ) || {
        id: `PAG-${candidate.codigoInscricao}`,
        candidatoId: candidate.id,
        codigoInscricao: candidate.codigoInscricao,
        nomeConcorrente: candidate.nomeCompleto,
        nomeArtistico: candidate.nomeArtistico,
        biConcorrente: candidate.bi,
        telefoneConcorrente: candidate.telefone,
        emailConcorrente: candidate.email,
        municipioConcorrente: candidate.municipio,
        valor: REGISTRATION_FEE,
        moeda: REGISTRATION_CURRENCY,
        estado: (candidate.pagamento?.estado as any) || 'AGUARDANDO PAGAMENTO',
        dataCriacao: candidate.criadoEm || new Date().toISOString(),
        dataAtualizacao: new Date().toISOString(),
        historicoAuditoria: [],
      }
    : undefined;

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 pt-28 pb-20 space-y-10">
      {/* Header */}
      <div className="text-center space-y-4 max-w-2xl mx-auto">
        <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-sky-500/10 border border-sky-400/30 text-sky-300 text-xs font-bold uppercase tracking-wider">
          <UserCheck className="w-3.5 h-3.5 text-sky-400" />
          <span>Portal do Participante</span>
        </div>
        <h1 className="text-3xl sm:text-5xl font-black text-white tracking-tight">
          Área do Candidato
        </h1>
        <p className="text-slate-300 text-sm sm:text-base leading-relaxed">
          Consulte o estado da sua candidatura, notas de audições, convocações e informações oficiais da comissão julgadora.
        </p>
      </div>

      {/* Search Bar */}
      <form
        onSubmit={handleSearch}
        className="p-3 rounded-2xl bg-slate-900 border border-sky-700/50 shadow-2xl flex flex-col sm:flex-row items-center gap-2"
      >
        <div className="relative flex-1 w-full">
          <Search className="w-5 h-5 text-sky-400 absolute left-4 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Insira o Código (ex: TVLS-2026-001), Email ou BI..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-12 pr-4 py-3 bg-transparent text-white text-sm focus:outline-none placeholder-slate-500 font-medium"
          />
        </div>
        <button
          type="submit"
          disabled={searching}
          className="w-full sm:w-auto px-6 py-3 rounded-xl bg-gradient-to-r from-sky-500 to-blue-600 hover:from-sky-400 hover:to-blue-500 text-white font-bold text-xs uppercase tracking-wider shadow-md shadow-sky-600/30 transition-all whitespace-nowrap flex items-center justify-center gap-2 disabled:opacity-60"
        >
          {searching ? (
            <>
              <Loader2 className="w-4 h-4 animate-spin" />
              <span>A Consultar...</span>
            </>
          ) : (
            <span>Consultar Estado</span>
          )}
        </button>
      </form>

      {/* Result Card */}
      {searched && (
        <>
          {candidate ? (
            <div className="rounded-3xl bg-slate-900/90 border border-sky-900/50 p-6 sm:p-10 shadow-2xl space-y-8 print-card">
              {/* Header Profile */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-6 border-b border-slate-800 pb-6">
                <div className="flex items-center gap-4">
                  <img
                    src={candidate.fotoUrl || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=600&auto=format&fit=crop&q=80'}
                    alt={candidate.nomeArtistico}
                    className="w-20 h-20 rounded-2xl object-cover border-2 border-sky-400 shrink-0 shadow-lg"
                  />
                  <div className="text-left">
                    <span className="text-xs font-bold text-sky-400 font-mono">
                      {candidate.codigoInscricao}
                    </span>
                    <h2 className="text-2xl font-black text-white">{candidate.nomeArtistico}</h2>
                    <p className="text-xs text-slate-300 font-medium">{candidate.nomeCompleto}</p>
                    <div className="flex items-center gap-2 mt-1 text-xs text-slate-400">
                      <MapPin className="w-3.5 h-3.5 text-rose-400" />
                      <span>{candidate.municipio}, Lunda-Sul</span>
                      <span>•</span>
                      <span>{candidate.generoMusical}</span>
                    </div>
                  </div>
                </div>

                <div className="flex flex-col items-start sm:items-end gap-2">
                  <span className="text-[11px] text-slate-400">Estado da Candidatura:</span>
                  {getStatusBadge(candidate.estado)}
                </div>
              </div>

              {/* ----------------- MÓDULO DE PAGAMENTO DA INSCRIÇÃO (5.000 KZ) ----------------- */}
              {currentOrder && (
                <div className="p-6 rounded-2xl bg-slate-950 border border-sky-600/40 text-left space-y-4 shadow-xl">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-800 pb-3">
                    <div className="space-y-0.5">
                      <span className="text-[11px] font-black uppercase tracking-wider text-sky-400 flex items-center gap-1.5">
                        <CreditCard className="w-3.5 h-3.5" />
                        PAGAMENTO DA INSCRIÇÃO — JESMU-EVENTOS
                      </span>
                      <h3 className="text-lg font-black text-white">
                        Taxa Obrigatória de Candidatura
                      </h3>
                    </div>

                    <div className="sm:text-right">
                      <span className="text-[10px] text-slate-400 uppercase font-semibold block">
                        Valor Fixo Obrigatório:
                      </span>
                      <span className="text-xl font-black text-white font-mono">
                        {REGISTRATION_FEE.toLocaleString('pt-AO')} {REGISTRATION_CURRENCY}
                      </span>
                    </div>
                  </div>

                  {/* Payment Status State Box */}
                  {currentOrder.estado === 'PAGO E CONFIRMADO' ? (
                    <div className="p-4 rounded-xl bg-emerald-950/50 border border-emerald-500/50 space-y-3">
                      <div className="flex items-center justify-between flex-wrap gap-2">
                        <div className="flex items-center gap-2">
                          <span className="w-7 h-7 rounded-lg bg-emerald-500/20 border border-emerald-400/50 flex items-center justify-center text-emerald-400">
                            <ShieldCheck className="w-4 h-4" />
                          </span>
                          <div>
                            <span className="text-xs font-black text-emerald-300 uppercase tracking-wider block">
                              PAGAMENTO PAGO E CONFIRMADO ✓
                            </span>
                            <span className="text-[11px] text-slate-300">
                              A sua inscrição está oficial e devidamente validada para as audições presenciais.
                            </span>
                          </div>
                        </div>

                        <button
                          onClick={() => setIsReceiptModalOpen(true)}
                          className="px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs flex items-center gap-1.5 shadow-md shadow-emerald-600/30"
                        >
                          <Printer className="w-3.5 h-3.5" />
                          <span>Ver Recibo Oficial</span>
                        </button>
                      </div>

                      {currentOrder.confirmadoPor && (
                        <div className="text-[11px] text-emerald-400/90 font-mono bg-slate-950/60 p-2.5 rounded-lg border border-emerald-500/20 flex flex-col sm:flex-row sm:items-center justify-between gap-1">
                          <span>
                            Recibo / Autenticação:{' '}
                            <strong className="text-white">
                              {currentOrder.confirmadoPor.codigoConfirmacao}
                            </strong>
                          </span>
                          <span className="text-slate-400">
                            Confirmado por: {currentOrder.confirmadoPor.adminNome}
                          </span>
                        </div>
                      )}
                    </div>
                  ) : currentOrder.estado === 'PAGAMENTO EM ANÁLISE' ||
                    currentOrder.estado === 'COMPROVATIVO ENVIADO' ? (
                    <div className="p-4 rounded-xl bg-sky-950/50 border border-sky-500/40 space-y-3">
                      <div className="flex items-center justify-between flex-wrap gap-2">
                        <div className="flex items-center gap-2">
                          <span className="w-7 h-7 rounded-lg bg-sky-500/20 border border-sky-400/50 flex items-center justify-center text-sky-400">
                            <Clock className="w-4 h-4" />
                          </span>
                          <div>
                            <span className="text-xs font-black text-sky-300 uppercase tracking-wider block">
                              COMPROVATIVO EM ANÁLISE PELA ADMINISTRAÇÃO
                            </span>
                            <span className="text-[11px] text-slate-300">
                              O seu comprovativo foi submetido e está a ser conferido com os dados bancários da JESMU-EVENTOS.
                            </span>
                          </div>
                        </div>

                        <button
                          onClick={() => setIsProofModalOpen(true)}
                          className="px-3.5 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-sky-300 text-xs font-bold border border-slate-700"
                        >
                          Reenviar Ficheiro
                        </button>
                      </div>

                      {currentOrder.comprovativo && (
                        <div className="text-[11px] text-slate-300 bg-slate-950/80 p-3 rounded-lg border border-slate-800 grid grid-cols-2 sm:grid-cols-4 gap-2">
                          <div>
                            <span className="text-slate-500 block text-[10px]">Método:</span>
                            <strong className="text-white">
                              {currentOrder.comprovativo.metodoUtilizado}
                            </strong>
                          </div>
                          <div>
                            <span className="text-slate-500 block text-[10px]">Data informada:</span>
                            <strong className="text-white">
                              {currentOrder.comprovativo.dataPagamentoInformada}
                            </strong>
                          </div>
                          <div>
                            <span className="text-slate-500 block text-[10px]">Titular:</span>
                            <strong className="text-white">
                              {currentOrder.comprovativo.nomePagador || candidate.nomeCompleto}
                            </strong>
                          </div>
                          <div>
                            <span className="text-slate-500 block text-[10px]">Transacção:</span>
                            <strong className="text-sky-300 font-mono">
                              {currentOrder.comprovativo.numeroTransacao || '—'}
                            </strong>
                          </div>
                        </div>
                      )}
                    </div>
                  ) : currentOrder.estado === 'PAGAMENTO REJEITADO' ? (
                    <div className="p-4 rounded-xl bg-red-950/50 border border-red-500/50 space-y-3">
                      <div className="flex items-center gap-2">
                        <span className="w-7 h-7 rounded-lg bg-red-500/20 border border-red-400/50 flex items-center justify-center text-red-400">
                          <AlertCircle className="w-4 h-4" />
                        </span>
                        <div>
                          <span className="text-xs font-black text-red-300 uppercase tracking-wider block">
                            COMPROVATIVO REJEITADO
                          </span>
                          <span className="text-[11px] text-slate-300">
                            A administração identificou uma não conformidade no pagamento.
                          </span>
                        </div>
                      </div>

                      {currentOrder.motivoRejeicao && (
                        <div className="p-3 rounded-lg bg-slate-950 border border-red-500/30 text-xs text-red-200">
                          <strong>Motivo da rejeição:</strong> {currentOrder.motivoRejeicao}
                        </div>
                      )}

                      <div className="flex justify-end">
                        <button
                          onClick={() => setIsProofModalOpen(true)}
                          className="px-5 py-2.5 rounded-xl bg-red-600 hover:bg-red-500 text-white font-bold text-xs flex items-center gap-2 shadow-lg shadow-red-600/30"
                        >
                          <Upload className="w-3.5 h-3.5" />
                          <span>Enviar Novo Comprovativo Válido (5.000 Kz)</span>
                        </button>
                      </div>
                    </div>
                  ) : (
                    /* AGUARDANDO PAGAMENTO */
                    <div className="p-4 rounded-xl bg-amber-950/40 border border-amber-500/50 space-y-4">
                      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                        <div className="space-y-1">
                          <span className="text-xs font-black text-amber-300 uppercase tracking-wider flex items-center gap-1.5">
                            <Clock className="w-4 h-4 text-amber-400" />
                            AGUARDANDO PAGAMENTO DA INSCRIÇÃO (5.000 KZ)
                          </span>
                          <p className="text-xs text-slate-300 leading-relaxed">
                            O pagamento da taxa de <strong>5.000 Kz</strong> é obrigatório para validação da sua candidatura. Efectue o pagamento e anexe o comprovativo abaixo.
                          </p>
                        </div>

                        <button
                          onClick={() => setIsProofModalOpen(true)}
                          className="px-6 py-3 rounded-xl bg-gradient-to-r from-amber-500 to-yellow-600 hover:from-amber-400 hover:to-yellow-500 text-slate-950 font-black text-xs uppercase tracking-wider shadow-lg shadow-amber-500/20 flex items-center justify-center gap-2 shrink-0 transition-all"
                        >
                          <Upload className="w-4 h-4" />
                          <span>Enviar Comprovativo</span>
                        </button>
                      </div>

                      {/* Quick banking accounts summary */}
                      <div className="p-3 rounded-xl bg-slate-950/90 border border-slate-800 text-[11px] space-y-1.5">
                        <span className="font-bold text-sky-400 flex items-center gap-1">
                          <Building2 className="w-3 h-3" />
                          Contas Oficiais JESMU-EVENTOS:
                        </span>
                        <div className="text-slate-300 grid grid-cols-1 sm:grid-cols-2 gap-2">
                          {paymentMethods
                            .filter((m) => m.ativo)
                            .slice(0, 2)
                            .map((m) => (
                              <div key={m.id} className="p-2 rounded bg-slate-900 border border-slate-800/80 font-mono">
                                <div className="text-white font-bold font-sans">{m.nome}</div>
                                {m.iban && <div className="text-slate-300">IBAN: {m.iban}</div>}
                                {m.local && <div className="text-slate-400 font-sans">{m.local}</div>}
                              </div>
                            ))}
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              )}

              {/* Convocatória ou Mensagem Oficial */}
              {candidate.notasAdmin || (candidate.mensagensOrganizacao && candidate.mensagensOrganizacao.length > 0) ? (
                <div className="p-5 rounded-2xl bg-sky-950/60 border border-sky-500/40 text-left space-y-2">
                  <div className="flex items-center gap-2 text-sky-300 text-xs font-bold uppercase tracking-wider">
                    <MessageSquare className="w-4 h-4 text-sky-400" />
                    <span>Comunicado da Comissão / Júri</span>
                  </div>
                  <p className="text-sm text-slate-200 leading-relaxed font-medium">
                    {candidate.notasAdmin || (candidate.mensagensOrganizacao && candidate.mensagensOrganizacao[candidate.mensagensOrganizacao.length - 1])}
                  </p>
                </div>
              ) : (
                <div className="p-5 rounded-2xl bg-slate-950 border border-slate-800 text-left space-y-1">
                  <span className="text-xs font-bold text-sky-400">Estado do Processo</span>
                  <p className="text-xs text-slate-300">
                    A sua inscrição foi registada com sucesso e encontra-se na fase de triagem inicial. Fique atento às actualizações neste portal e no WhatsApp.
                  </p>
                </div>
              )}

              {/* Candidate Info Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-left text-xs">
                <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 space-y-1">
                  <span className="text-slate-400 block">Idade:</span>
                  <span className="text-white font-semibold">{candidate.idade} anos</span>
                </div>
                <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 space-y-1">
                  <span className="text-slate-400 block">N.º do BI:</span>
                  <span className="text-white font-semibold font-mono">{candidate.bi}</span>
                </div>
                <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 space-y-1">
                  <span className="text-slate-400 block">Experiência:</span>
                  <span className="text-white font-semibold">{candidate.experienciaMusical}</span>
                </div>
                <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 space-y-1">
                  <span className="text-slate-400 block">Telefone:</span>
                  <span className="text-white font-semibold">{candidate.telefone}</span>
                </div>
                <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 space-y-1">
                  <span className="text-slate-400 block">Email:</span>
                  <span className="text-white font-semibold">{candidate.email}</span>
                </div>
                <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 space-y-1">
                  <span className="text-slate-400 block">Data de Registo:</span>
                  <span className="text-white font-semibold">{candidate.dataInscricao || candidate.dataCriacao || '2026'}</span>
                </div>
              </div>

              {/* Biografia & Motivação */}
              <div className="text-left space-y-4 pt-2">
                <div className="p-4 rounded-xl bg-slate-950/60 border border-slate-800 space-y-1.5">
                  <span className="text-xs font-bold text-sky-400">Biografia Artística:</span>
                  <p className="text-xs text-slate-300 leading-relaxed">{candidate.biografia}</p>
                </div>
                <div className="p-4 rounded-xl bg-slate-950/60 border border-slate-800 space-y-1.5">
                  <span className="text-xs font-bold text-sky-400">Motivação:</span>
                  <p className="text-xs text-slate-300 leading-relaxed">{candidate.motivacao}</p>
                </div>
              </div>

              {/* Avaliações do Júri (se existirem) */}
              {candidateEvals.length > 0 && (
                <div className="text-left space-y-3 pt-2">
                  <h4 className="text-sm font-bold text-white uppercase tracking-wider flex items-center gap-2">
                    <Award className="w-4 h-4 text-amber-400" />
                    Avaliações do Júri
                  </h4>
                  <div className="space-y-3">
                    {candidateEvals.map((av) => (
                      <div
                        key={av.id}
                        className="p-4 rounded-xl bg-slate-950 border border-amber-500/30 space-y-2"
                      >
                        <div className="flex items-center justify-between">
                          <span className="text-xs font-bold text-amber-300">{av.juradoNome}</span>
                          <span className="text-sm font-black text-amber-400 font-mono">
                            Média: {av.media.toFixed(1)} / 10
                          </span>
                        </div>
                        {av.observacoes && (
                          <p className="text-xs text-slate-300 italic">"{av.observacoes}"</p>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Action Buttons */}
              <div className="flex flex-col sm:flex-row items-center justify-end gap-3 pt-4 border-t border-slate-800 no-print">
                {currentOrder && currentOrder.estado === 'PAGO E CONFIRMADO' && (
                  <button
                    onClick={() => setIsReceiptModalOpen(true)}
                    className="w-full sm:w-auto px-5 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs flex items-center justify-center gap-2 shadow-lg shadow-emerald-600/30"
                  >
                    <Printer className="w-4 h-4" />
                    <span>Imprimir Recibo Oficial</span>
                  </button>
                )}
                <button
                  onClick={() => {
                    printCandidateDossier({
                      codigoInscricao: candidate.codigoInscricao,
                      nomeCompleto: candidate.nomeCompleto,
                      nomeArtistico: candidate.nomeArtistico,
                      bi: candidate.bi,
                      telefone: candidate.telefone,
                      email: candidate.email,
                      municipio: candidate.municipio,
                      generoMusical: candidate.generoMusical,
                      experienciaMusical: candidate.experienciaMusical,
                      biografia: candidate.biografia,
                      motivacao: candidate.motivacao,
                      dataInscricao: candidate.dataInscricao || candidate.dataCriacao,
                      estado: candidate.estado,
                      pagamentoEstado: currentOrder?.estado || 'Aguardando Pagamento',
                    });
                  }}
                  className="w-full sm:w-auto px-5 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-white font-bold text-xs flex items-center justify-center gap-2 border border-slate-700"
                >
                  <FileText className="w-4 h-4 text-sky-400" />
                  <span>Imprimir Ficha do Candidato</span>
                </button>
              </div>
            </div>
          ) : (
            <div className="p-8 rounded-3xl bg-slate-900 border border-slate-800 text-center space-y-3">
              <AlertCircle className="w-10 h-10 text-amber-400 mx-auto" />
              <h3 className="text-lg font-bold text-white">Nenhum candidato encontrado</h3>
              <p className="text-xs text-slate-400 max-w-md mx-auto">
                Não encontramos nenhuma candidatura associada a "<strong>{searchQuery}</strong>". Verifique se digitou o código completo (ex: TVLS-2026-001) ou o email correcto.
              </p>
            </div>
          )}
        </>
      )}

      {/* Helper Quick Search with Mock candidates */}
      {!searched && (
        <div className="p-6 rounded-2xl bg-slate-900/60 border border-slate-800 text-left space-y-3">
          <span className="text-xs font-bold text-sky-400 uppercase tracking-wider">
            Exemplos de Códigos para Consulta Rápida:
          </span>
          <div className="flex flex-wrap gap-2">
            {candidates.slice(0, 4).map((c) => (
              <button
                key={c.id}
                onClick={() => {
                  setSearchQuery(c.codigoInscricao);
                  setCandidate(c);
                  setSearched(true);
                }}
                className="px-3 py-1.5 rounded-lg bg-slate-950 border border-sky-800/40 text-sky-300 hover:border-sky-400 text-xs font-mono font-bold transition-colors"
              >
                {c.codigoInscricao} ({c.nomeArtistico})
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Proof Submission Modal */}
      {isProofModalOpen && currentOrder && (
        <PaymentProofModal
          order={currentOrder}
          paymentMethods={paymentMethods}
          onClose={() => setIsProofModalOpen(false)}
          onSubmitProof={async (orderId, proofData) => {
            const updated = await submitPaymentProof(orderId, proofData);
            setIsProofModalOpen(false);
            if (candidate) {
              setCandidate({
                ...candidate,
                pagamento: {
                  ordemId: updated.id,
                  estado: 'PAGAMENTO EM ANÁLISE',
                  valor: updated.valor,
                },
              });
            }
          }}
        />
      )}

      {/* Confirmed Receipt Modal */}
      {isReceiptModalOpen && currentOrder && (
        <PaymentReceiptModal
          order={currentOrder}
          onClose={() => setIsReceiptModalOpen(false)}
        />
      )}
    </div>
  );
};
