import React, { useState } from 'react';
import {
  CreditCard,
  Search,
  Filter,
  CheckCircle2,
  AlertCircle,
  Clock,
  FileText,
  Eye,
  ShieldCheck,
  ShieldAlert,
  Download,
  Building2,
  Calendar,
  User,
  Phone,
  RefreshCw,
  ExternalLink,
  Plus,
  Edit2,
  Trash2,
  Check,
  X,
  Printer,
  History,
  TrendingUp,
} from 'lucide-react';
import {
  PaymentOrder,
  PaymentMethodConfig,
  PaymentStatus,
  Candidate,
} from '../types';
import {
  REGISTRATION_FEE,
  REGISTRATION_CURRENCY,
  calculatePaymentStats,
} from '../services/paymentService';
import { PaymentReceiptModal } from './PaymentReceiptModal';

interface AdminPaymentsManagerProps {
  orders: PaymentOrder[];
  candidates: Candidate[];
  paymentMethods: PaymentMethodConfig[];
  currentAdmin: { uid: string; nome: string; papel: string };
  onConfirmPayment: (orderId: string, admin: { uid: string; nome: string }) => Promise<{ order: PaymentOrder; receiptCode: string }>;
  onRejectPayment: (orderId: string, motivo: string, admin: { uid: string; nome: string }) => Promise<PaymentOrder>;
  onCancelPayment: (orderId: string, motivo: string, admin: { uid: string; nome: string }) => Promise<PaymentOrder>;
  onUpdatePaymentMethods: (methods: PaymentMethodConfig[]) => Promise<void>;
  onRefresh: () => Promise<void>;
}

export const AdminPaymentsManager: React.FC<AdminPaymentsManagerProps> = ({
  orders,
  candidates,
  paymentMethods,
  currentAdmin,
  onConfirmPayment,
  onRejectPayment,
  onCancelPayment,
  onUpdatePaymentMethods,
  onRefresh,
}) => {
  // Navigation inside payments panel: 'orders' | 'methods'
  const [subTab, setSubTab] = useState<'orders' | 'methods'>('orders');

  // Filter & Search states
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('Todos');
  const [methodFilter, setMethodFilter] = useState<string>('Todos');
  const [duplicateOnly, setDuplicateOnly] = useState<boolean>(false);
  const [sortBy, setSortBy] = useState<'recente' | 'antigo' | 'nome'>('recente');

  // Modals state
  const [selectedOrder, setSelectedOrder] = useState<PaymentOrder | null>(null);
  const [viewingProof, setViewingProof] = useState<PaymentOrder | null>(null);
  const [confirmModalOrder, setConfirmModalOrder] = useState<PaymentOrder | null>(null);
  const [rejectModalOrder, setRejectModalOrder] = useState<PaymentOrder | null>(null);
  const [rejectionReason, setRejectionReason] = useState('');
  const [customRejectionReason, setCustomRejectionReason] = useState('');
  const [receiptOrder, setReceiptOrder] = useState<PaymentOrder | null>(null);

  // Processing states
  const [actionLoading, setActionLoading] = useState(false);
  const [feedbackMsg, setFeedbackMsg] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  // Payment Methods edit state
  const [editingMethods, setEditingMethods] = useState<PaymentMethodConfig[]>(paymentMethods);
  const [editingMethodItem, setEditingMethodItem] = useState<PaymentMethodConfig | null>(null);

  // Update local editingMethods when props change
  React.useEffect(() => {
    setEditingMethods(paymentMethods);
  }, [paymentMethods]);

  // Financial Stats
  const stats = calculatePaymentStats(orders);

  // Filter and Sort orders
  const filteredOrders = orders.filter((order) => {
    const q = search.toLowerCase().trim();
    const matchSearch =
      !q ||
      order.id.toLowerCase().includes(q) ||
      order.codigoInscricao.toLowerCase().includes(q) ||
      order.nomeConcorrente.toLowerCase().includes(q) ||
      (order.nomeArtistico && order.nomeArtistico.toLowerCase().includes(q)) ||
      order.biConcorrente.toLowerCase().includes(q) ||
      order.telefoneConcorrente.includes(q) ||
      (order.comprovativo?.numeroTransacao &&
        order.comprovativo.numeroTransacao.toLowerCase().includes(q));

    const matchStatus = statusFilter === 'Todos' || order.estado === statusFilter;
    const matchMethod =
      methodFilter === 'Todos' ||
      order.formaPagamentoSelecionada === methodFilter ||
      order.comprovativo?.metodoUtilizado === methodFilter;

    const matchDuplicate = !duplicateOnly || order.alertaDuplicado;

    return matchSearch && matchStatus && matchMethod && matchDuplicate;
  });

  const sortedOrders = [...filteredOrders].sort((a, b) => {
    if (sortBy === 'recente') {
      return new Date(b.dataCriacao).getTime() - new Date(a.dataCriacao).getTime();
    }
    if (sortBy === 'antigo') {
      return new Date(a.dataCriacao).getTime() - new Date(b.dataCriacao).getTime();
    }
    return a.nomeConcorrente.localeCompare(b.nomeConcorrente);
  });

  const getStatusBadge = (status: PaymentStatus) => {
    switch (status) {
      case 'PAGO E CONFIRMADO':
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-400/40 text-[11px] font-black">
            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
            PAGO E CONFIRMADO
          </span>
        );
      case 'PAGAMENTO EM ANÁLISE':
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-amber-500/20 text-amber-300 border border-amber-400/40 text-[11px] font-bold">
            <Clock className="w-3.5 h-3.5 text-amber-400" />
            EM ANÁLISE
          </span>
        );
      case 'COMPROVATIVO ENVIADO':
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-sky-500/20 text-sky-300 border border-sky-400/40 text-[11px] font-bold">
            <FileText className="w-3.5 h-3.5 text-sky-400" />
            COMPROVATIVO ENVIADO
          </span>
        );
      case 'AGUARDANDO PAGAMENTO':
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-slate-800 text-slate-300 border border-slate-700 text-[11px] font-bold">
            <Clock className="w-3.5 h-3.5 text-slate-400" />
            AGUARDANDO PAGAMENTO
          </span>
        );
      case 'PAGAMENTO REJEITADO':
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-red-500/20 text-red-300 border border-red-400/40 text-[11px] font-bold">
            <AlertCircle className="w-3.5 h-3.5 text-red-400" />
            REJEITADO
          </span>
        );
      case 'PAGAMENTO CANCELADO':
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-slate-900 text-slate-400 border border-slate-800 text-[11px] font-semibold">
            CANCELADO
          </span>
        );
      default:
        return (
          <span className="px-2.5 py-1 rounded-full bg-slate-800 text-slate-300 text-[11px]">
            {status}
          </span>
        );
    }
  };

  const handleExecuteConfirm = async () => {
    if (!confirmModalOrder) return;
    setActionLoading(true);
    try {
      const res = await onConfirmPayment(confirmModalOrder.id, {
        uid: currentAdmin.uid,
        nome: currentAdmin.nome,
      });
      setConfirmModalOrder(null);
      setSelectedOrder(res.order);
      setFeedbackMsg({
        type: 'success',
        text: `Pagamento da ordem ${res.order.id} confirmado com sucesso! Candidatura validada. Recibo: ${res.receiptCode}`,
      });
      setTimeout(() => setFeedbackMsg(null), 5000);
    } catch (err: any) {
      setFeedbackMsg({
        type: 'error',
        text: err?.message || 'Erro ao confirmar pagamento.',
      });
    } finally {
      setActionLoading(false);
    }
  };

  const handleExecuteReject = async () => {
    if (!rejectModalOrder) return;
    const finalReason =
      rejectionReason === 'Outro' ? customRejectionReason.trim() : rejectionReason;
    if (!finalReason) {
      alert('Por favor especifique o motivo da rejeição.');
      return;
    }

    setActionLoading(true);
    try {
      const updated = await onRejectPayment(rejectModalOrder.id, finalReason, {
        uid: currentAdmin.uid,
        nome: currentAdmin.nome,
      });
      setRejectModalOrder(null);
      setSelectedOrder(updated);
      setRejectionReason('');
      setCustomRejectionReason('');
      setFeedbackMsg({
        type: 'success',
        text: `Pagamento da ordem ${updated.id} rejeitado. Motivo registado no histórico e visível para o candidato.`,
      });
      setTimeout(() => setFeedbackMsg(null), 5000);
    } catch (err: any) {
      setFeedbackMsg({
        type: 'error',
        text: err?.message || 'Erro ao rejeitar pagamento.',
      });
    } finally {
      setActionLoading(false);
    }
  };

  // Export Payments CSV
  const handleExportPaymentsCSV = () => {
    const headers =
      'Ordem,Código Inscrição,Concorrente,Nome Artístico,BI,Telefone,Município,Valor,Moeda,Estado,Método,Comprovativo Transacção,Confirmado Por,Data Confirmação,Código Recibo\n';
    const rows = orders
      .map((o) => {
        const trans = o.comprovativo?.numeroTransacao || '';
        const adminName = o.confirmadoPor?.adminNome || '';
        const confDate = o.confirmadoPor?.dataHora || '';
        const receipt = o.confirmadoPor?.codigoConfirmacao || '';
        return `"${o.id}","${o.codigoInscricao}","${o.nomeConcorrente}","${o.nomeArtistico || ''}","${o.biConcorrente}","${o.telefoneConcorrente}","${o.municipioConcorrente || ''}","${o.valor}","${o.moeda}","${o.estado}","${o.formaPagamentoSelecionada || o.comprovativo?.metodoUtilizado || ''}","${trans}","${adminName}","${confDate}","${receipt}"`;
      })
      .join('\n');

    const blob = new Blob([headers + rows], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.setAttribute('href', url);
    link.setAttribute(
      'download',
      `pagamentos_the_voice_lunda_sul_${new Date().toISOString().split('T')[0]}.csv`
    );
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="space-y-8">
      {/* Top Banner with Financial Summary */}
      <div className="p-6 sm:p-8 rounded-3xl bg-slate-900 border border-sky-900/50 shadow-2xl space-y-6 text-left">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-800 pb-5">
          <div className="space-y-1">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-400/30 text-emerald-300 text-xs font-bold uppercase tracking-wider">
              <CreditCard className="w-3.5 h-3.5 text-emerald-400" />
              <span>Controlo Financeiro Oficial — JESMU-EVENTOS</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-black text-white">
              Gestão de Pagamentos das Inscrições
            </h2>
            <p className="text-xs sm:text-sm text-slate-300">
              Taxa fixa obrigatória: <strong>{REGISTRATION_FEE.toLocaleString('pt-AO')} Kz</strong> por inscrição. Confirmação manual e auditoria contra fraudes.
            </p>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={handleExportPaymentsCSV}
              className="px-4 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 text-xs font-bold flex items-center gap-2"
            >
              <Download className="w-4 h-4 text-sky-400" />
              <span>Exportar Pagamentos (CSV)</span>
            </button>
            <button
              onClick={onRefresh}
              className="p-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 border border-slate-700"
              title="Atualizar dados"
            >
              <RefreshCw className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Financial Stat KPI Cards */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3.5">
          <div className="p-4 rounded-2xl bg-slate-950/80 border border-slate-800 space-y-1">
            <span className="text-[11px] text-slate-400 font-bold uppercase block">
              Inscrições
            </span>
            <div className="text-2xl font-black text-white font-mono">{stats.total}</div>
            <span className="text-[10px] text-slate-500">Total gerado</span>
          </div>

          <div className="p-4 rounded-2xl bg-slate-950/80 border border-slate-800 space-y-1">
            <span className="text-[11px] text-amber-400 font-bold uppercase block">
              Aguardando
            </span>
            <div className="text-2xl font-black text-amber-400 font-mono">
              {stats.aguardando}
            </div>
            <span className="text-[10px] text-slate-500">Sem comprovativo</span>
          </div>

          <div className="p-4 rounded-2xl bg-slate-950/80 border border-sky-800/40 space-y-1">
            <span className="text-[11px] text-sky-400 font-bold uppercase block">
              Em Análise
            </span>
            <div className="text-2xl font-black text-sky-400 font-mono">
              {stats.emAnalise + stats.comprovativoEnviado}
            </div>
            <span className="text-[10px] text-slate-400 font-semibold">Requer revisão</span>
          </div>

          <div className="p-4 rounded-2xl bg-slate-950/80 border border-emerald-800/50 space-y-1">
            <span className="text-[11px] text-emerald-400 font-bold uppercase block">
              Confirmados
            </span>
            <div className="text-2xl font-black text-emerald-400 font-mono">
              {stats.confirmados}
            </div>
            <span className="text-[10px] text-emerald-500/80 font-bold">Inscrições válidas</span>
          </div>

          <div className="p-4 rounded-2xl bg-slate-950/80 border border-red-900/40 space-y-1">
            <span className="text-[11px] text-red-400 font-bold uppercase block">
              Rejeitados
            </span>
            <div className="text-2xl font-black text-red-400 font-mono">{stats.rejeitados}</div>
            <span className="text-[10px] text-slate-500">Com motivo</span>
          </div>

          <div className="p-4 rounded-2xl bg-gradient-to-br from-emerald-950/80 to-slate-950 border border-emerald-500/40 space-y-1">
            <span className="text-[11px] text-emerald-300 font-black uppercase block flex items-center gap-1">
              <TrendingUp className="w-3 h-3 text-emerald-400" />
              Total Arrecadado
            </span>
            <div className="text-xl sm:text-2xl font-black text-emerald-400 font-mono">
              {stats.totalArrecadado.toLocaleString('pt-AO')} Kz
            </div>
            <span className="text-[10px] text-slate-400">
              {stats.confirmados} × 5.000 Kz
            </span>
          </div>
        </div>

        {/* Navigation within Payment Module */}
        <div className="flex items-center gap-2 pt-2">
          <button
            onClick={() => setSubTab('orders')}
            className={`px-4 py-2 rounded-xl text-xs font-bold flex items-center gap-2 transition-colors ${
              subTab === 'orders'
                ? 'bg-sky-600 text-white shadow-lg shadow-sky-600/30'
                : 'bg-slate-950 text-slate-400 hover:text-white'
            }`}
          >
            <CreditCard className="w-4 h-4" />
            <span>Ordens de Pagamento ({orders.length})</span>
          </button>

          <button
            onClick={() => setSubTab('methods')}
            className={`px-4 py-2 rounded-xl text-xs font-bold flex items-center gap-2 transition-colors ${
              subTab === 'methods'
                ? 'bg-sky-600 text-white shadow-lg shadow-sky-600/30'
                : 'bg-slate-950 text-slate-400 hover:text-white'
            }`}
          >
            <Building2 className="w-4 h-4" />
            <span>Contas Bancárias & Métodos ({paymentMethods.length})</span>
          </button>
        </div>
      </div>

      {feedbackMsg && (
        <div
          className={`p-4 rounded-2xl border text-xs font-semibold flex items-center gap-3 ${
            feedbackMsg.type === 'success'
              ? 'bg-emerald-950/70 border-emerald-500/50 text-emerald-300'
              : 'bg-red-950/70 border-red-500/50 text-red-300'
          }`}
        >
          {feedbackMsg.type === 'success' ? (
            <CheckCircle2 className="w-5 h-5 shrink-0 text-emerald-400" />
          ) : (
            <AlertCircle className="w-5 h-5 shrink-0 text-red-400" />
          )}
          <span>{feedbackMsg.text}</span>
        </div>
      )}

      {/* ------------------ SUB-TAB: ORDERS LIST ------------------ */}
      {subTab === 'orders' && (
        <div className="space-y-6 text-left">
          {/* Filter Bar */}
          <div className="p-4 sm:p-5 rounded-2xl bg-slate-900 border border-slate-800 space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
              {/* Search */}
              <div className="relative">
                <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  placeholder="Pesquisar por Código, Nome, BI, Tel..."
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  className="w-full pl-9 pr-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-white text-xs focus:ring-2 focus:ring-sky-400"
                />
              </div>

              {/* Status Filter */}
              <div className="flex items-center gap-2">
                <Filter className="w-4 h-4 text-slate-400 shrink-0" />
                <select
                  value={statusFilter}
                  onChange={(e) => setStatusFilter(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-white text-xs focus:ring-2 focus:ring-sky-400"
                >
                  <option value="Todos">Todos os Estados ({orders.length})</option>
                  <option value="AGUARDANDO PAGAMENTO">Aguardando Pagamento ({stats.aguardando})</option>
                  <option value="PAGAMENTO EM ANÁLISE">Em Análise ({stats.emAnalise + stats.comprovativoEnviado})</option>
                  <option value="PAGO E CONFIRMADO">Pago e Confirmado ({stats.confirmados})</option>
                  <option value="PAGAMENTO REJEITADO">Rejeitados ({stats.rejeitados})</option>
                  <option value="PAGAMENTO CANCELADO">Cancelados ({stats.cancelados})</option>
                </select>
              </div>

              {/* Method Filter */}
              <select
                value={methodFilter}
                onChange={(e) => setMethodFilter(e.target.value)}
                className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-white text-xs focus:ring-2 focus:ring-sky-400"
              >
                <option value="Todos">Todas as Formas de Pagamento</option>
                {paymentMethods.map((m) => (
                  <option key={m.id} value={m.nome}>
                    {m.nome}
                  </option>
                ))}
              </select>

              {/* Sort By */}
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value as any)}
                className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-white text-xs focus:ring-2 focus:ring-sky-400"
              >
                <option value="recente">Mais Recentes Primeiro</option>
                <option value="antigo">Mais Antigos Primeiro</option>
                <option value="nome">Nome do Concorrente (A-Z)</option>
              </select>
            </div>

            {/* Duplicate Filter Toggle */}
            <div className="flex items-center justify-between border-t border-slate-800/80 pt-3">
              <label className="inline-flex items-center gap-2 cursor-pointer text-xs font-semibold text-amber-300">
                <input
                  type="checkbox"
                  checked={duplicateOnly}
                  onChange={(e) => setDuplicateOnly(e.target.checked)}
                  className="rounded bg-slate-950 border-slate-700 text-amber-500 focus:ring-amber-400"
                />
                <ShieldAlert className="w-4 h-4 text-amber-400" />
                <span>Mostrar apenas possíveis comprovativos duplicados / alertas</span>
              </label>

              <span className="text-xs text-slate-400">
                Exibindo <strong>{sortedOrders.length}</strong> de {orders.length} ordens
              </span>
            </div>
          </div>

          {/* Orders Table */}
          <div className="rounded-3xl bg-slate-900 border border-slate-800 overflow-hidden shadow-xl">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs text-slate-300">
                <thead className="bg-slate-950/80 text-slate-400 uppercase font-bold text-[11px] border-b border-slate-800">
                  <tr>
                    <th className="py-4 px-4">Código / Ordem</th>
                    <th className="py-4 px-4">Concorrente</th>
                    <th className="py-4 px-4">Valor</th>
                    <th className="py-4 px-4">Estado</th>
                    <th className="py-4 px-4">Método Informado</th>
                    <th className="py-4 px-4">Comprovativo</th>
                    <th className="py-4 px-4 text-right">Acções</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800">
                  {sortedOrders.length > 0 ? (
                    sortedOrders.map((order) => (
                      <tr
                        key={order.id}
                        className={`hover:bg-slate-800/50 transition-colors ${
                          order.alertaDuplicado ? 'bg-amber-950/15' : ''
                        }`}
                      >
                        {/* Code & Order */}
                        <td className="py-3.5 px-4 font-mono">
                          <div className="font-bold text-white flex items-center gap-1.5">
                            <span>{order.codigoInscricao}</span>
                            {order.alertaDuplicado && (
                              <span
                                title="Alerta: Possível comprovativo duplicado"
                                className="px-1.5 py-0.5 rounded bg-amber-500/20 text-amber-300 border border-amber-500/40 text-[9px] font-sans font-black"
                              >
                                ⚠ DUPLICADO?
                              </span>
                            )}
                          </div>
                          <span className="text-[10px] text-slate-500">{order.id}</span>
                        </td>

                        {/* Candidate info */}
                        <td className="py-3.5 px-4">
                          <div className="font-bold text-white">{order.nomeConcorrente}</div>
                          <div className="text-[11px] text-slate-400 flex items-center gap-2">
                            <span>BI: {order.biConcorrente}</span>
                            <span>•</span>
                            <span>{order.telefoneConcorrente}</span>
                          </div>
                        </td>

                        {/* Value */}
                        <td className="py-3.5 px-4 font-mono font-bold text-white">
                          {order.valor.toLocaleString('pt-AO')} {order.moeda}
                        </td>

                        {/* Status badge */}
                        <td className="py-3.5 px-4">{getStatusBadge(order.estado)}</td>

                        {/* Method */}
                        <td className="py-3.5 px-4 text-slate-300">
                          {order.formaPagamentoSelecionada ||
                            order.comprovativo?.metodoUtilizado ||
                            '—'}
                        </td>

                        {/* Proof thumbnail/status */}
                        <td className="py-3.5 px-4">
                          {order.comprovativo?.comprovativoUrl ? (
                            <button
                              onClick={() => setViewingProof(order)}
                              className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-sky-950/80 hover:bg-sky-900 border border-sky-600/40 text-sky-300 font-bold text-[11px]"
                            >
                              <Eye className="w-3.5 h-3.5" />
                              <span>Ver Anexo</span>
                            </button>
                          ) : (
                            <span className="text-slate-500 italic text-[11px]">Sem anexo</span>
                          )}
                        </td>

                        {/* Actions */}
                        <td className="py-3.5 px-4 text-right space-x-2 whitespace-nowrap">
                          {/* Details / Audit button */}
                          <button
                            onClick={() => setSelectedOrder(order)}
                            className="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white"
                            title="Ver detalhes e histórico de auditoria"
                          >
                            <History className="w-4 h-4" />
                          </button>

                          {/* If confirmed, allow viewing digital receipt */}
                          {order.estado === 'PAGO E CONFIRMADO' && (
                            <button
                              onClick={() => setReceiptOrder(order)}
                              className="p-1.5 rounded-lg bg-emerald-950/80 hover:bg-emerald-900 text-emerald-300 border border-emerald-500/40"
                              title="Ver Comprovativo / Recibo Digital"
                            >
                              <Printer className="w-4 h-4" />
                            </button>
                          )}

                          {/* Confirm Button */}
                          {order.estado !== 'PAGO E CONFIRMADO' && (
                            <button
                              onClick={() => setConfirmModalOrder(order)}
                              className="px-2.5 py-1 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-[11px] shadow-sm"
                            >
                              Confirmar
                            </button>
                          )}

                          {/* Reject Button */}
                          {order.estado !== 'PAGO E CONFIRMADO' && (
                            <button
                              onClick={() => {
                                setRejectModalOrder(order);
                                setRejectionReason('Comprovativo inválido');
                              }}
                              className="px-2.5 py-1 rounded-lg bg-red-950 hover:bg-red-900 text-red-300 border border-red-800/40 font-bold text-[11px]"
                            >
                              Rejeitar
                            </button>
                          )}
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan={7} className="py-8 text-center text-slate-500">
                        Nenhuma ordem de pagamento encontrada com os filtros selecionados.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* ------------------ SUB-TAB: PAYMENT METHODS CONFIGURATION ------------------ */}
      {subTab === 'methods' && (
        <div className="space-y-6 text-left">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-lg font-bold text-white">Configuração das Formas de Pagamento</h3>
              <p className="text-xs text-slate-400">
                Ative, desative ou atualize os dados bancários e instruções que os candidatos visualizam para pagar.
              </p>
            </div>
            <button
              onClick={() => {
                const newMethod: PaymentMethodConfig = {
                  id: `pm-custom-${Date.now()}`,
                  tipo: 'outro',
                  nome: 'Novo Método de Pagamento',
                  ativo: true,
                  instrucoes: 'Instruções para o participante...',
                };
                setEditingMethods([...editingMethods, newMethod]);
                setEditingMethodItem(newMethod);
              }}
              className="px-4 py-2 rounded-xl bg-sky-600 hover:bg-sky-500 text-white font-bold text-xs flex items-center gap-2"
            >
              <Plus className="w-4 h-4" />
              <span>Adicionar Método</span>
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {editingMethods.map((m) => (
              <div
                key={m.id}
                className={`p-5 rounded-2xl bg-slate-900 border space-y-3 relative ${
                  m.ativo ? 'border-sky-500/40' : 'border-slate-800 opacity-60'
                }`}
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-white text-sm">{m.nome}</span>
                    <span
                      className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                        m.ativo
                          ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-400/40'
                          : 'bg-slate-800 text-slate-400'
                      }`}
                    >
                      {m.ativo ? 'Activo' : 'Desactivado'}
                    </span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <button
                      onClick={() => setEditingMethodItem(m)}
                      className="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-sky-400"
                      title="Editar"
                    >
                      <Edit2 className="w-3.5 h-3.5" />
                    </button>
                    <button
                      onClick={async () => {
                        const updated = editingMethods.map((item) =>
                          item.id === m.id ? { ...item, ativo: !item.ativo } : item
                        );
                        setEditingMethods(updated);
                        await onUpdatePaymentMethods(updated);
                      }}
                      className="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-bold"
                    >
                      {m.ativo ? 'Desactivar' : 'Activar'}
                    </button>
                  </div>
                </div>

                {m.banco && (
                  <div className="text-xs text-slate-300">
                    <strong className="text-white">Banco:</strong> {m.banco}
                  </div>
                )}
                {m.titular && (
                  <div className="text-xs text-slate-300">
                    <strong className="text-white">Titular:</strong> {m.titular}
                  </div>
                )}
                {m.iban && (
                  <div className="text-xs font-mono text-slate-300 bg-slate-950 p-2 rounded-lg border border-slate-800">
                    IBAN: {m.iban}
                  </div>
                )}
                {m.local && (
                  <div className="text-xs text-slate-300">
                    <strong className="text-white">Local Presencial:</strong> {m.local}
                  </div>
                )}
                {m.contacto && (
                  <div className="text-xs text-slate-300">
                    <strong className="text-white">Contacto:</strong> {m.contacto}
                  </div>
                )}
                <div className="text-xs text-slate-400 italic">
                  <strong>Instruções:</strong> {m.instrucoes}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ------------------ MODAL: EDIT PAYMENT METHOD ------------------ */}
      {editingMethodItem && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-sky-600/40 rounded-3xl max-w-lg w-full p-6 text-left shadow-2xl space-y-4">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <h3 className="text-lg font-bold text-white">Editar Método de Pagamento</h3>
              <button
                onClick={() => setEditingMethodItem(null)}
                className="p-1.5 rounded-lg bg-slate-800 text-slate-400 hover:text-white"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="space-y-3 text-xs">
              <div>
                <label className="font-bold text-slate-300 block mb-1">Nome de Exibição *</label>
                <input
                  type="text"
                  value={editingMethodItem.nome}
                  onChange={(e) =>
                    setEditingMethodItem({ ...editingMethodItem, nome: e.target.value })
                  }
                  className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-white focus:ring-2 focus:ring-sky-400"
                />
              </div>

              <div>
                <label className="font-bold text-slate-300 block mb-1">Tipo de Método</label>
                <select
                  value={editingMethodItem.tipo}
                  onChange={(e) =>
                    setEditingMethodItem({ ...editingMethodItem, tipo: e.target.value as any })
                  }
                  className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-white"
                >
                  <option value="transferencia">Transferência Bancária</option>
                  <option value="presencial">Pagamento Presencial</option>
                  <option value="deposito">Depósito Bancário</option>
                  <option value="outro">Outro Método</option>
                </select>
              </div>

              {editingMethodItem.tipo === 'transferencia' && (
                <>
                  <div>
                    <label className="font-bold text-slate-300 block mb-1">Nome do Banco</label>
                    <input
                      type="text"
                      value={editingMethodItem.banco || ''}
                      onChange={(e) =>
                        setEditingMethodItem({ ...editingMethodItem, banco: e.target.value })
                      }
                      className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-white"
                    />
                  </div>
                  <div>
                    <label className="font-bold text-slate-300 block mb-1">IBAN</label>
                    <input
                      type="text"
                      value={editingMethodItem.iban || ''}
                      onChange={(e) =>
                        setEditingMethodItem({ ...editingMethodItem, iban: e.target.value })
                      }
                      className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-white font-mono"
                    />
                  </div>
                  <div>
                    <label className="font-bold text-slate-300 block mb-1">Titular da Conta</label>
                    <input
                      type="text"
                      value={editingMethodItem.titular || ''}
                      onChange={(e) =>
                        setEditingMethodItem({ ...editingMethodItem, titular: e.target.value })
                      }
                      className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-white"
                    />
                  </div>
                </>
              )}

              {editingMethodItem.tipo === 'presencial' && (
                <>
                  <div>
                    <label className="font-bold text-slate-300 block mb-1">Local Indicado</label>
                    <input
                      type="text"
                      value={editingMethodItem.local || ''}
                      onChange={(e) =>
                        setEditingMethodItem({ ...editingMethodItem, local: e.target.value })
                      }
                      className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-white"
                    />
                  </div>
                  <div>
                    <label className="font-bold text-slate-300 block mb-1">Telefone / Contactos</label>
                    <input
                      type="text"
                      value={editingMethodItem.contacto || ''}
                      onChange={(e) =>
                        setEditingMethodItem({ ...editingMethodItem, contacto: e.target.value })
                      }
                      className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-white"
                    />
                  </div>
                </>
              )}

              <div>
                <label className="font-bold text-slate-300 block mb-1">Instruções para o Concorrente</label>
                <textarea
                  rows={3}
                  value={editingMethodItem.instrucoes}
                  onChange={(e) =>
                    setEditingMethodItem({ ...editingMethodItem, instrucoes: e.target.value })
                  }
                  className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-white"
                />
              </div>

              <div className="flex items-center gap-2 pt-2">
                <input
                  type="checkbox"
                  id="ativoCheckbox"
                  checked={editingMethodItem.ativo}
                  onChange={(e) =>
                    setEditingMethodItem({ ...editingMethodItem, ativo: e.target.checked })
                  }
                  className="rounded bg-slate-950 text-sky-500"
                />
                <label htmlFor="ativoCheckbox" className="font-bold text-slate-200">
                  Método activo para novos participantes
                </label>
              </div>
            </div>

            <div className="flex items-center justify-end gap-3 pt-3 border-t border-slate-800">
              <button
                onClick={() => setEditingMethodItem(null)}
                className="px-4 py-2 rounded-xl bg-slate-800 text-slate-300 text-xs font-bold"
              >
                Cancelar
              </button>
              <button
                onClick={async () => {
                  const updated = editingMethods.map((m) =>
                    m.id === editingMethodItem.id ? editingMethodItem : m
                  );
                  setEditingMethods(updated);
                  await onUpdatePaymentMethods(updated);
                  setEditingMethodItem(null);
                }}
                className="px-5 py-2 rounded-xl bg-sky-600 hover:bg-sky-500 text-white text-xs font-bold"
              >
                Salvar Alterações
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ------------------ MODAL: CONFIRM PAYMENT (SECURITY DIALOG) ------------------ */}
      {confirmModalOrder && (
        <div className="fixed inset-0 z-50 bg-black/85 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-slate-900 border-2 border-emerald-500/60 rounded-3xl max-w-md w-full p-6 sm:p-8 text-left shadow-2xl space-y-6">
            <div className="flex items-center gap-3 border-b border-slate-800 pb-4">
              <div className="w-12 h-12 rounded-2xl bg-emerald-500/20 border border-emerald-400/40 text-emerald-400 flex items-center justify-center shrink-0">
                <ShieldCheck className="w-7 h-7" />
              </div>
              <div>
                <h3 className="text-xl font-black text-white">CONFIRMAR PAGAMENTO?</h3>
                <span className="text-xs text-emerald-400 font-bold uppercase tracking-wider">
                  Validação Oficial de Inscrição
                </span>
              </div>
            </div>

            <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800 space-y-2 text-xs">
              <div>
                <span className="text-slate-400">Concorrente:</span>{' '}
                <strong className="text-white text-sm font-bold block">
                  {confirmModalOrder.nomeConcorrente}
                </strong>
              </div>
              <div>
                <span className="text-slate-400">Código de Inscrição:</span>{' '}
                <strong className="text-emerald-400 font-mono text-sm block">
                  {confirmModalOrder.codigoInscricao}
                </strong>
              </div>
              <div>
                <span className="text-slate-400">Valor da Inscrição:</span>{' '}
                <strong className="text-white font-mono text-sm block">
                  5.000 Kz (Fixo)
                </strong>
              </div>
              <div>
                <span className="text-slate-400">Administrador Responsável:</span>{' '}
                <strong className="text-slate-200 block">{currentAdmin.nome}</strong>
              </div>
            </div>

            <p className="text-xs text-slate-300 leading-relaxed font-medium">
              Esta acção confirmará o pagamento de <strong>5.000 Kz</strong>, gerará o recibo digital interno e validará oficialmente a candidatura do participante no THE VOICE LUNDA-SUL.
            </p>

            <div className="flex items-center justify-end gap-3 pt-2">
              <button
                type="button"
                onClick={() => setConfirmModalOrder(null)}
                disabled={actionLoading}
                className="px-4 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-bold"
              >
                Cancelar
              </button>
              <button
                type="button"
                onClick={handleExecuteConfirm}
                disabled={actionLoading}
                className="px-6 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-black shadow-lg shadow-emerald-600/30 flex items-center gap-2 disabled:opacity-60"
              >
                <Check className="w-4 h-4" />
                <span>Confirmar Pagamento</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ------------------ MODAL: REJECT PAYMENT (MANDATORY REASON) ------------------ */}
      {rejectModalOrder && (
        <div className="fixed inset-0 z-50 bg-black/85 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-slate-900 border-2 border-red-500/60 rounded-3xl max-w-md w-full p-6 sm:p-8 text-left shadow-2xl space-y-5">
            <div className="flex items-center gap-3 border-b border-slate-800 pb-4">
              <div className="w-12 h-12 rounded-2xl bg-red-500/20 border border-red-400/40 text-red-400 flex items-center justify-center shrink-0">
                <AlertCircle className="w-7 h-7" />
              </div>
              <div>
                <h3 className="text-xl font-black text-white">REJEITAR PAGAMENTO</h3>
                <span className="text-xs text-red-400 font-bold uppercase tracking-wider">
                  Especificar Motivo Obrigatório
                </span>
              </div>
            </div>

            <div className="text-xs space-y-1">
              <span className="text-slate-400">Concorrente:</span>{' '}
              <strong className="text-white block font-bold">
                {rejectModalOrder.nomeConcorrente} ({rejectModalOrder.codigoInscricao})
              </strong>
            </div>

            <div className="space-y-3 text-xs">
              <label className="font-bold text-slate-300 block">
                Selecione o Motivo da Rejeição *
              </label>

              {[
                'Comprovativo inválido',
                'Valor incorrecto (deve ser exactamente 5.000 Kz)',
                'Pagamento não localizado no extracto bancário',
                'Comprovativo ilegível, cortado ou de baixa qualidade',
                'Pagamento duplicado / Comprovativo reutilizado',
                'Dados do titular não correspondem ao participante',
                'Outro',
              ].map((reason) => (
                <label
                  key={reason}
                  className="flex items-center gap-2.5 p-2.5 rounded-xl bg-slate-950 border border-slate-800 hover:border-red-500/40 cursor-pointer text-slate-300 transition-colors"
                >
                  <input
                    type="radio"
                    name="rejectReason"
                    value={reason}
                    checked={rejectionReason === reason}
                    onChange={(e) => setRejectionReason(e.target.value)}
                    className="text-red-600 focus:ring-red-400 bg-slate-900"
                  />
                  <span className="font-medium text-xs text-slate-200">{reason}</span>
                </label>
              ))}

              {rejectionReason === 'Outro' && (
                <div className="pt-2">
                  <label className="font-bold text-slate-300 block mb-1">
                    Descreva o motivo detalhado *
                  </label>
                  <textarea
                    rows={3}
                    value={customRejectionReason}
                    onChange={(e) => setCustomRejectionReason(e.target.value)}
                    placeholder="Escreva claramente o motivo para o participante corrigir..."
                    className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-white text-xs focus:ring-2 focus:ring-red-400"
                    required
                  />
                </div>
              )}
            </div>

            <p className="text-[11px] text-slate-400 italic">
              O participante poderá visualizar este motivo na Área do Candidato e enviar um novo comprovativo.
            </p>

            <div className="flex items-center justify-end gap-3 pt-2">
              <button
                type="button"
                onClick={() => setRejectModalOrder(null)}
                disabled={actionLoading}
                className="px-4 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-bold"
              >
                Cancelar
              </button>
              <button
                type="button"
                onClick={handleExecuteReject}
                disabled={actionLoading}
                className="px-6 py-2.5 rounded-xl bg-red-600 hover:bg-red-500 text-white text-xs font-black shadow-lg shadow-red-600/30 flex items-center gap-2 disabled:opacity-60"
              >
                <span>Confirmar Rejeição</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ------------------ MODAL: VIEW PROOF ATTACHMENT ------------------ */}
      {viewingProof && (
        <div className="fixed inset-0 z-50 bg-black/90 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-sky-600/40 rounded-3xl max-w-2xl w-full p-6 text-left shadow-2xl space-y-4 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <div>
                <span className="text-xs font-bold text-sky-400 font-mono">
                  {viewingProof.codigoInscricao}
                </span>
                <h3 className="text-lg font-bold text-white">
                  Comprovativo — {viewingProof.nomeConcorrente}
                </h3>
              </div>
              <button
                onClick={() => setViewingProof(null)}
                className="p-1.5 rounded-lg bg-slate-800 text-slate-400 hover:text-white"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {viewingProof.comprovativo?.comprovativoUrl ? (
              <div className="space-y-4">
                <div className="rounded-2xl overflow-hidden bg-slate-950 border border-slate-800 p-2 text-center">
                  {viewingProof.comprovativo.comprovativoUrl.startsWith('data:image') ||
                  viewingProof.comprovativo.comprovativoUrl.startsWith('http') ? (
                    <img
                      src={viewingProof.comprovativo.comprovativoUrl}
                      alt="Comprovativo Anexado"
                      className="max-h-[60vh] mx-auto object-contain rounded-xl"
                    />
                  ) : (
                    <div className="py-12 text-slate-400 space-y-2">
                      <FileText className="w-12 h-12 mx-auto text-sky-400" />
                      <p className="text-xs font-semibold">
                        Documento PDF: {viewingProof.comprovativo.comprovativoNomeArquivo}
                      </p>
                      <a
                        href={viewingProof.comprovativo.comprovativoUrl}
                        download={viewingProof.comprovativo.comprovativoNomeArquivo || 'comprovativo.pdf'}
                        className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-sky-600 text-white font-bold text-xs mt-2"
                      >
                        <Download className="w-4 h-4" /> Descarregar Ficheiro
                      </a>
                    </div>
                  )}
                </div>

                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-xs p-3 rounded-xl bg-slate-950 border border-slate-800">
                  <div>
                    <span className="text-slate-400 block text-[10px]">Método:</span>
                    <span className="text-white font-bold">
                      {viewingProof.comprovativo.metodoUtilizado}
                    </span>
                  </div>
                  <div>
                    <span className="text-slate-400 block text-[10px]">Data Informada:</span>
                    <span className="text-white font-bold">
                      {viewingProof.comprovativo.dataPagamentoInformada}
                    </span>
                  </div>
                  <div>
                    <span className="text-slate-400 block text-[10px]">Titular / Pagador:</span>
                    <span className="text-white font-bold">
                      {viewingProof.comprovativo.nomePagador || '—'}
                    </span>
                  </div>
                  <div>
                    <span className="text-slate-400 block text-[10px]">N.º Transacção:</span>
                    <span className="text-white font-mono font-bold">
                      {viewingProof.comprovativo.numeroTransacao || '—'}
                    </span>
                  </div>
                </div>

                {viewingProof.alertaDuplicado && (
                  <div className="p-3 rounded-xl bg-amber-950/80 border border-amber-500/60 text-amber-200 text-xs flex items-center gap-2">
                    <ShieldAlert className="w-4 h-4 shrink-0 text-amber-400" />
                    <span>
                      <strong>Atenção:</strong> {viewingProof.motivoAlertaDuplicado || 'Ficheiro com identificador semelhante já registrado em outra ordem.'}
                    </span>
                  </div>
                )}
              </div>
            ) : (
              <div className="py-8 text-center text-slate-500">Nenhum comprovativo anexado.</div>
            )}

            <div className="flex items-center justify-end gap-3 pt-2 border-t border-slate-800">
              <button
                onClick={() => setViewingProof(null)}
                className="px-4 py-2 rounded-xl bg-slate-800 text-slate-300 text-xs font-bold"
              >
                Fechar
              </button>
              {viewingProof.estado !== 'PAGO E CONFIRMADO' && (
                <>
                  <button
                    onClick={() => {
                      setRejectModalOrder(viewingProof);
                      setViewingProof(null);
                    }}
                    className="px-4 py-2 rounded-xl bg-red-950 hover:bg-red-900 text-red-300 text-xs font-bold"
                  >
                    Rejeitar
                  </button>
                  <button
                    onClick={() => {
                      setConfirmModalOrder(viewingProof);
                      setViewingProof(null);
                    }}
                    className="px-5 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold"
                  >
                    Confirmar Pagamento
                  </button>
                </>
              )}
            </div>
          </div>
        </div>
      )}

      {/* ------------------ MODAL: ORDER DETAILS & AUDIT LOG ------------------ */}
      {selectedOrder && (
        <div className="fixed inset-0 z-50 bg-black/85 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-sky-600/40 rounded-3xl max-w-2xl w-full p-6 sm:p-8 text-left shadow-2xl space-y-6 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between border-b border-slate-800 pb-4">
              <div>
                <span className="text-xs font-bold uppercase tracking-wider text-sky-400 font-mono">
                  {selectedOrder.id}
                </span>
                <h3 className="text-xl font-black text-white">
                  Detalhes e Histórico de Auditoria
                </h3>
              </div>
              <button
                onClick={() => setSelectedOrder(null)}
                className="p-2 rounded-xl bg-slate-800 text-slate-400 hover:text-white"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Candidate & Payment Quick Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
              <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 space-y-1.5">
                <span className="text-sky-400 font-bold uppercase tracking-wider text-[10px]">
                  Dados do Candidato
                </span>
                <div>
                  <span className="text-slate-400">Nome:</span>{' '}
                  <strong className="text-white">{selectedOrder.nomeConcorrente}</strong>
                </div>
                <div>
                  <span className="text-slate-400">Código Inscrição:</span>{' '}
                  <strong className="text-emerald-400 font-mono">
                    {selectedOrder.codigoInscricao}
                  </strong>
                </div>
                <div>
                  <span className="text-slate-400">BI:</span>{' '}
                  <span className="text-white font-mono">{selectedOrder.biConcorrente}</span>
                </div>
                <div>
                  <span className="text-slate-400">Telefone:</span>{' '}
                  <span className="text-white">{selectedOrder.telefoneConcorrente}</span>
                </div>
              </div>

              <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 space-y-1.5">
                <span className="text-emerald-400 font-bold uppercase tracking-wider text-[10px]">
                  Estado Financeiro
                </span>
                <div>
                  <span className="text-slate-400">Valor Fixo:</span>{' '}
                  <strong className="text-white font-mono">
                    {selectedOrder.valor.toLocaleString('pt-AO')} {selectedOrder.moeda}
                  </strong>
                </div>
                <div>
                  <span className="text-slate-400">Estado:</span>{' '}
                  <span className="inline-block mt-0.5">{getStatusBadge(selectedOrder.estado)}</span>
                </div>
                {selectedOrder.confirmadoPor && (
                  <div>
                    <span className="text-slate-400">Recibo Oficial:</span>{' '}
                    <strong className="text-emerald-300 font-mono">
                      {selectedOrder.confirmadoPor.codigoConfirmacao}
                    </strong>
                  </div>
                )}
                {selectedOrder.motivoRejeicao && (
                  <div className="text-red-300">
                    <span className="text-red-400">Motivo Rejeição:</span>{' '}
                    {selectedOrder.motivoRejeicao}
                  </div>
                )}
              </div>
            </div>

            {/* Audit History Timeline */}
            <div className="space-y-3">
              <h4 className="text-xs font-bold text-white uppercase tracking-wider flex items-center gap-1.5">
                <History className="w-4 h-4 text-sky-400" />
                Histórico e Auditoria da Ordem
              </h4>

              <div className="space-y-2 border-l-2 border-slate-800 ml-3 pl-4">
                {(selectedOrder.historicoAuditoria || []).map((log, idx) => (
                  <div key={log.id || idx} className="space-y-0.5 relative text-xs">
                    <div className="w-2.5 h-2.5 rounded-full bg-sky-500 absolute -left-[21px] top-1" />
                    <div className="flex items-center gap-2">
                      <span className="font-bold text-white">{log.acao}</span>
                      <span className="text-[10px] text-slate-500">
                        {new Date(log.dataHora).toLocaleString('pt-AO')}
                      </span>
                    </div>
                    <p className="text-slate-300 text-[11px] leading-relaxed">{log.descricao}</p>
                    {log.adminNome && (
                      <span className="text-[10px] text-sky-400 block">
                        Por: {log.adminNome}
                      </span>
                    )}
                  </div>
                ))}
              </div>
            </div>

            <div className="flex items-center justify-end gap-3 pt-2 border-t border-slate-800">
              <button
                onClick={() => setSelectedOrder(null)}
                className="px-4 py-2 rounded-xl bg-slate-800 text-slate-300 text-xs font-bold"
              >
                Fechar
              </button>
              {selectedOrder.estado === 'PAGO E CONFIRMADO' && (
                <button
                  onClick={() => {
                    setReceiptOrder(selectedOrder);
                    setSelectedOrder(null);
                  }}
                  className="px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs flex items-center gap-1.5"
                >
                  <Printer className="w-4 h-4" /> Recibo Digital
                </button>
              )}
            </div>
          </div>
        </div>
      )}

      {/* ------------------ DIGITAL RECEIPT MODAL ------------------ */}
      {receiptOrder && (
        <PaymentReceiptModal order={receiptOrder} onClose={() => setReceiptOrder(null)} />
      )}
    </div>
  );
};
