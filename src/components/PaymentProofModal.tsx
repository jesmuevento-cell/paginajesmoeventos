import React, { useState } from 'react';
import {
  X,
  Upload,
  FileText,
  CheckCircle2,
  AlertCircle,
  Building2,
  CreditCard,
  MapPin,
  Clock,
  ShieldAlert,
  Loader2,
  Copy,
  Check,
  Send,
  Mail,
  MessageCircle,
  ExternalLink,
} from 'lucide-react';
import { PaymentOrder, PaymentMethodConfig } from '../types';
import { REGISTRATION_FEE, REGISTRATION_CURRENCY } from '../services/paymentService';
import {
  SUPERVISOR_CONTACTS,
  ProofNotificationPayload,
  buildSupervisorWhatsAppMessage,
  buildCandidateWhatsAppMessage,
  getWhatsAppSupervisor1Link,
  getWhatsAppSupervisor2Link,
  getWhatsAppCandidateLink,
  getSupervisorEmailLink,
} from '../services/notificationService';

interface PaymentProofModalProps {
  order: PaymentOrder;
  paymentMethods: PaymentMethodConfig[];
  onClose: () => void;
  onSubmitProof: (orderId: string, proofData: {
    comprovativoUrl: string;
    comprovativoNomeArquivo?: string;
    comprovativoTamanho?: number;
    dataPagamentoInformada: string;
    metodoUtilizado: string;
    nomePagador?: string;
    numeroTransacao?: string;
    observacoes?: string;
  }) => Promise<void>;
}

export const PaymentProofModal: React.FC<PaymentProofModalProps> = ({
  order,
  paymentMethods,
  onClose,
  onSubmitProof,
}) => {
  const activeMethods = paymentMethods.filter((m) => m.ativo);
  const defaultMethod = activeMethods[0]?.nome || 'Transferência Bancária';

  const [selectedMethod, setSelectedMethod] = useState<string>(defaultMethod);
  const [dataPagamento, setDataPagamento] = useState<string>(
    new Date().toISOString().split('T')[0]
  );
  const [nomePagador, setNomePagador] = useState<string>(order.nomeConcorrente);
  const [numeroTransacao, setNumeroTransacao] = useState<string>('');
  const [observacoes, setObservacoes] = useState<string>('');
  const [fileUrl, setFileUrl] = useState<string>('');
  const [fileName, setFileName] = useState<string>('');
  const [fileSize, setFileSize] = useState<number>(0);
  const [submitting, setSubmitting] = useState<boolean>(false);
  const [submitted, setSubmitted] = useState<boolean>(false);
  const [error, setError] = useState<string>('');
  const [copiedIban, setCopiedIban] = useState<string | null>(null);
  const [notificationPayload, setNotificationPayload] = useState<ProofNotificationPayload | null>(null);

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Check size limit (10MB)
    if (file.size > 10 * 1024 * 1024) {
      setError('O ficheiro é muito grande. O limite máximo é 10MB.');
      return;
    }

    setError('');
    setFileName(file.name);
    setFileSize(file.size);

    const reader = new FileReader();
    reader.onload = () => {
      setFileUrl(reader.result as string);
    };
    reader.readAsDataURL(file);
  };

  const copyToClipboard = (text: string, id: string) => {
    navigator.clipboard.writeText(text);
    setCopiedIban(id);
    setTimeout(() => setCopiedIban(null), 2000);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!fileUrl) {
      setError('Por favor, carregue a fotografia ou PDF do comprovativo de pagamento.');
      return;
    }
    if (!dataPagamento) {
      setError('Informe a data em que o pagamento foi realizado.');
      return;
    }

    setSubmitting(true);
    setError('');

    const payload: ProofNotificationPayload = {
      orderId: order.id,
      codigoInscricao: order.codigoInscricao,
      nomeConcorrente: order.nomeConcorrente,
      nomeArtistico: order.nomeArtistico,
      biConcorrente: order.biConcorrente,
      telefoneConcorrente: order.telefoneConcorrente,
      emailConcorrente: order.emailConcorrente,
      municipioConcorrente: order.municipioConcorrente,
      valor: REGISTRATION_FEE,
      moeda: REGISTRATION_CURRENCY,
      metodoUtilizado: selectedMethod,
      dataPagamentoInformada: dataPagamento,
      nomePagador: nomePagador.trim(),
      numeroTransacao: numeroTransacao.trim(),
      observacoes: observacoes.trim(),
    };

    try {
      await onSubmitProof(order.id, {
        comprovativoUrl: fileUrl,
        comprovativoNomeArquivo: fileName || 'comprovativo_pagamento',
        comprovativoTamanho: fileSize,
        dataPagamentoInformada: dataPagamento,
        metodoUtilizado: selectedMethod,
        nomePagador: nomePagador.trim(),
        numeroTransacao: numeroTransacao.trim(),
        observacoes: observacoes.trim(),
      });
      setNotificationPayload(payload);
      setSubmitted(true);
    } catch (err: any) {
      console.error(err);
      setError(err?.message || 'Erro ao enviar comprovativo. Tente novamente.');
    } finally {
      setSubmitting(false);
    }
  };

  // SUCCESS / SUPERVISOR NOTIFICATION SCREEN
  if (submitted && notificationPayload) {
    const supervisorMsg = buildSupervisorWhatsAppMessage(notificationPayload);
    const candidateMsg = buildCandidateWhatsAppMessage(notificationPayload);

    return (
      <div className="fixed inset-0 z-50 bg-black/85 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto">
        <div className="bg-slate-900 border border-emerald-500/40 rounded-3xl max-w-xl w-full p-6 sm:p-8 text-left shadow-2xl relative space-y-6 max-h-[90vh] overflow-y-auto">
          {/* Success Banner */}
          <div className="text-center space-y-3">
            <div className="w-16 h-16 rounded-full bg-emerald-500/20 text-emerald-400 border border-emerald-400/40 flex items-center justify-center mx-auto shadow-lg shadow-emerald-500/20">
              <CheckCircle2 className="w-8 h-8" />
            </div>
            <div>
              <span className="text-xs font-black text-emerald-400 uppercase tracking-widest block">
                Comprovativo Submetido com Sucesso
              </span>
              <h2 className="text-xl sm:text-2xl font-black text-white mt-1">
                Pagamento em Análise
              </h2>
              <p className="text-xs text-slate-300 max-w-md mx-auto mt-1 leading-relaxed">
                O seu comprovativo de <strong>{REGISTRATION_FEE.toLocaleString('pt-AO')} {REGISTRATION_CURRENCY}</strong> foi registado no sistema da <strong>JESMU-EVENTOS</strong>.
              </p>
            </div>
          </div>

          {/* Supervisor Notification Box */}
          <div className="p-4 rounded-2xl bg-slate-950 border border-sky-500/30 space-y-3">
            <div className="flex items-center gap-2 text-sky-400 text-xs font-bold uppercase tracking-wider">
              <Send className="w-4 h-4" />
              <span>Notificação dos Supervisores Oficiais</span>
            </div>
            <p className="text-xs text-slate-300 leading-relaxed">
              O alerta com os seus dados e comprovativo foi preparado para os supervisores da organização:
            </p>

            <div className="space-y-2">
              {/* WhatsApp Supervisor 1 */}
              <a
                href={getWhatsAppSupervisor1Link(supervisorMsg)}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center justify-between p-3 rounded-xl bg-emerald-950/60 hover:bg-emerald-900/80 border border-emerald-500/40 text-emerald-300 text-xs font-bold transition-all group"
              >
                <div className="flex items-center gap-2.5">
                  <MessageCircle className="w-4 h-4 text-emerald-400 shrink-0" />
                  <div>
                    <div className="text-white">Supervisor WhatsApp 1</div>
                    <div className="text-[11px] text-emerald-400 font-mono font-normal">
                      +244 929 156 159 (929156159)
                    </div>
                  </div>
                </div>
                <span className="px-2.5 py-1 rounded-lg bg-emerald-500 text-slate-950 text-[11px] font-black flex items-center gap-1 group-hover:scale-105 transition-transform">
                  <span>Enviar Alerta</span>
                  <ExternalLink className="w-3 h-3" />
                </span>
              </a>

              {/* WhatsApp Supervisor 2 */}
              <a
                href={getWhatsAppSupervisor2Link(supervisorMsg)}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center justify-between p-3 rounded-xl bg-emerald-950/60 hover:bg-emerald-900/80 border border-emerald-500/40 text-emerald-300 text-xs font-bold transition-all group"
              >
                <div className="flex items-center gap-2.5">
                  <MessageCircle className="w-4 h-4 text-emerald-400 shrink-0" />
                  <div>
                    <div className="text-white">Supervisor WhatsApp 2</div>
                    <div className="text-[11px] text-emerald-400 font-mono font-normal">
                      +244 940 543 775 (940543775)
                    </div>
                  </div>
                </div>
                <span className="px-2.5 py-1 rounded-lg bg-emerald-500 text-slate-950 text-[11px] font-black flex items-center gap-1 group-hover:scale-105 transition-transform">
                  <span>Enviar Alerta</span>
                  <ExternalLink className="w-3 h-3" />
                </span>
              </a>

              {/* Email Supervisor */}
              <a
                href={getSupervisorEmailLink(notificationPayload)}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center justify-between p-3 rounded-xl bg-sky-950/60 hover:bg-sky-900/80 border border-sky-500/40 text-sky-300 text-xs font-bold transition-all group"
              >
                <div className="flex items-center gap-2.5">
                  <Mail className="w-4 h-4 text-sky-400 shrink-0" />
                  <div>
                    <div className="text-white">Email Oficial JESMU-EVENTOS</div>
                    <div className="text-[11px] text-sky-400 font-normal">
                      jesmuevento@gmail.com
                    </div>
                  </div>
                </div>
                <span className="px-2.5 py-1 rounded-lg bg-sky-500 text-slate-950 text-[11px] font-black flex items-center gap-1 group-hover:scale-105 transition-transform">
                  <span>Enviar Email</span>
                  <ExternalLink className="w-3 h-3" />
                </span>
              </a>
            </div>
          </div>

          {/* Candidate copy notification */}
          {order.telefoneConcorrente && (
            <div className="flex items-center justify-between p-3 rounded-xl bg-slate-950/80 border border-slate-800 text-xs">
              <span className="text-slate-300 text-[11px]">
                Guardar confirmação no seu WhatsApp ({order.telefoneConcorrente}):
              </span>
              <a
                href={getWhatsAppCandidateLink(order.telefoneConcorrente, candidateMsg)}
                target="_blank"
                rel="noopener noreferrer"
                className="px-3 py-1 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 font-bold text-[11px] flex items-center gap-1 shrink-0"
              >
                <span>Receber Cópia</span>
                <ExternalLink className="w-3 h-3" />
              </a>
            </div>
          )}

          {/* Close button */}
          <div className="pt-2">
            <button
              onClick={onClose}
              className="w-full py-3 rounded-xl bg-gradient-to-r from-emerald-500 to-sky-600 hover:from-emerald-400 hover:to-sky-500 text-white font-black text-xs uppercase tracking-wider shadow-lg shadow-emerald-500/20"
            >
              Concluir e Voltar à Área do Candidato
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 z-50 bg-black/85 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto">
      <div className="bg-slate-900 border border-sky-600/40 rounded-3xl max-w-2xl w-full p-6 sm:p-8 text-left shadow-2xl relative space-y-6 max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-slate-800 pb-4">
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xs font-bold uppercase tracking-wider text-sky-400 font-mono">
                {order.id}
              </span>
              <span className="text-[11px] px-2.5 py-0.5 rounded-full bg-amber-500/20 text-amber-300 font-semibold border border-amber-500/30">
                {order.estado}
              </span>
            </div>
            <h2 className="text-xl sm:text-2xl font-black text-white mt-1">
              Envio de Comprovativo de Pagamento
            </h2>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-xl bg-slate-800 text-slate-400 hover:text-white"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Mandatory Fixed Price Banner */}
        <div className="p-4 rounded-2xl bg-gradient-to-r from-sky-950/80 to-blue-950/80 border border-sky-500/40 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div className="space-y-0.5">
            <span className="text-xs font-bold text-sky-400 uppercase tracking-wider block">
              Valor Fixo da Inscrição:
            </span>
            <span className="text-2xl sm:text-3xl font-black text-white font-mono">
              {REGISTRATION_FEE.toLocaleString('pt-AO')} {REGISTRATION_CURRENCY}
            </span>
          </div>
          <div className="text-left sm:text-right">
            <span className="text-[11px] text-slate-300 block font-medium">
              Candidato: <strong className="text-white">{order.nomeConcorrente}</strong>
            </span>
            <span className="text-[11px] text-sky-300 font-mono">
              Inscrição: {order.codigoInscricao}
            </span>
          </div>
        </div>

        {/* Banking & Payment Methods Guide */}
        <div className="space-y-3">
          <h3 className="text-xs font-bold text-slate-300 uppercase tracking-wider flex items-center gap-1.5">
            <Building2 className="w-4 h-4 text-sky-400" />
            Contas Oficiais da JESMU-EVENTOS para Pagamento
          </h3>

          <div className="grid grid-cols-1 gap-2.5 text-xs">
            {activeMethods.map((m) => (
              <div
                key={m.id}
                className="p-3.5 rounded-xl bg-slate-950 border border-slate-800 space-y-1.5"
              >
                <div className="flex items-center justify-between">
                  <span className="font-bold text-white flex items-center gap-1.5">
                    {m.tipo === 'transferencia' ? (
                      <CreditCard className="w-3.5 h-3.5 text-sky-400" />
                    ) : (
                      <MapPin className="w-3.5 h-3.5 text-amber-400" />
                    )}
                    {m.nome}
                  </span>
                  {m.banco && (
                    <span className="text-[10px] text-slate-400 font-medium">{m.banco}</span>
                  )}
                </div>

                {m.iban && (
                  <div className="flex items-center justify-between gap-2 p-2 rounded-lg bg-slate-900 border border-slate-800 font-mono text-[11px]">
                    <span className="text-slate-300 select-all">IBAN: {m.iban}</span>
                    <button
                      type="button"
                      onClick={() => copyToClipboard(m.iban!, m.id)}
                      className="p-1 rounded bg-slate-800 hover:bg-slate-700 text-sky-400 text-[10px] font-sans flex items-center gap-1 px-2 font-bold shrink-0"
                    >
                      {copiedIban === m.id ? (
                        <>
                          <Check className="w-3 h-3 text-emerald-400" /> Copiado
                        </>
                      ) : (
                        <>
                          <Copy className="w-3 h-3" /> Copiar
                        </>
                      )}
                    </button>
                  </div>
                )}

                {m.local && (
                  <p className="text-[11px] text-slate-300">
                    <strong className="text-white">Local:</strong> {m.local}
                  </p>
                )}

                {m.contacto && (
                  <p className="text-[11px] text-slate-300">
                    <strong className="text-white">Contactos:</strong> {m.contacto}
                  </p>
                )}

                <p className="text-[11px] text-slate-400 italic">{m.instrucoes}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Upload Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
            {/* Método Utilizado */}
            <div className="space-y-1.5">
              <label className="font-bold text-slate-300">Método Utilizado *</label>
              <select
                value={selectedMethod}
                onChange={(e) => setSelectedMethod(e.target.value)}
                className="w-full px-3 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-white text-xs focus:ring-2 focus:ring-sky-400"
              >
                {activeMethods.map((m) => (
                  <option key={m.id} value={m.nome}>
                    {m.nome}
                  </option>
                ))}
                <option value="Outro Método Autorizado">Outro Método Autorizado</option>
              </select>
            </div>

            {/* Data do Pagamento */}
            <div className="space-y-1.5">
              <label className="font-bold text-slate-300">Data do Pagamento *</label>
              <input
                type="date"
                value={dataPagamento}
                onChange={(e) => setDataPagamento(e.target.value)}
                max={new Date().toISOString().split('T')[0]}
                className="w-full px-3 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-white text-xs focus:ring-2 focus:ring-sky-400"
                required
              />
            </div>

            {/* Nome do Titular / Pagador */}
            <div className="space-y-1.5">
              <label className="font-bold text-slate-300">Nome do Titular da Conta / Pagador</label>
              <input
                type="text"
                value={nomePagador}
                onChange={(e) => setNomePagador(e.target.value)}
                placeholder="Ex: Nome que consta no talão"
                className="w-full px-3 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-white text-xs focus:ring-2 focus:ring-sky-400"
              />
            </div>

            {/* Número da Transação */}
            <div className="space-y-1.5">
              <label className="font-bold text-slate-300">N.º da Transacção / Ref. Bancária</label>
              <input
                type="text"
                value={numeroTransacao}
                onChange={(e) => setNumeroTransacao(e.target.value)}
                placeholder="Ex: 20260913987654"
                className="w-full px-3 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-white text-xs focus:ring-2 focus:ring-sky-400"
              />
            </div>
          </div>

          {/* Upload Box */}
          <div className="space-y-1.5 text-xs">
            <label className="font-bold text-slate-300">
              Anexar Fotografia ou Ficheiro do Comprovativo (JPG, PNG, PDF) *
            </label>
            <div className="p-4 rounded-2xl bg-slate-950 border-2 border-dashed border-sky-600/40 hover:border-sky-400 transition-colors text-center space-y-3">
              {fileUrl ? (
                <div className="space-y-2">
                  {fileUrl.startsWith('data:image') ? (
                    <img
                      src={fileUrl}
                      alt="Comprovativo"
                      className="max-h-36 mx-auto rounded-lg border border-slate-800 object-contain shadow-md"
                    />
                  ) : (
                    <div className="flex items-center justify-center gap-2 text-sky-400 py-4">
                      <FileText className="w-8 h-8" />
                      <span className="font-semibold text-white">{fileName}</span>
                    </div>
                  )}
                  <div className="text-[11px] text-emerald-400 font-bold flex items-center justify-center gap-1">
                    <CheckCircle2 className="w-3.5 h-3.5" /> Ficheiro carregado com sucesso
                  </div>
                  <label className="inline-block px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-bold cursor-pointer">
                    Substituir ficheiro
                    <input
                      type="file"
                      accept="image/*,application/pdf"
                      onChange={handleFileUpload}
                      className="hidden"
                    />
                  </label>
                </div>
              ) : (
                <label className="cursor-pointer block py-3 space-y-2">
                  <Upload className="w-8 h-8 text-sky-400 mx-auto" />
                  <div className="text-white font-bold text-xs">
                    Clique para selecionar ou arraste o comprovativo
                  </div>
                  <span className="text-[10px] text-slate-400 block">
                    Formatos aceites: JPG, PNG, PDF (máx. 10MB)
                  </span>
                  <input
                    type="file"
                    accept="image/*,application/pdf"
                    onChange={handleFileUpload}
                    className="hidden"
                  />
                </label>
              )}
            </div>
          </div>

          {/* Observações Opcionais */}
          <div className="space-y-1.5 text-xs">
            <label className="font-bold text-slate-300">Observações adicionais (opcional)</label>
            <input
              type="text"
              value={observacoes}
              onChange={(e) => setObservacoes(e.target.value)}
              placeholder="Ex: Transferência feita a partir do Multicaixa Express"
              className="w-full px-3 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-white text-xs focus:ring-2 focus:ring-sky-400"
            />
          </div>

          {/* Security Alert Note */}
          <div className="p-3.5 rounded-xl bg-amber-950/40 border border-amber-500/40 text-[11px] text-amber-200/90 space-y-1">
            <div className="flex items-center gap-1.5 font-bold text-amber-300">
              <ShieldAlert className="w-3.5 h-3.5 shrink-0" />
              <span>Regra de Segurança:</span>
            </div>
            <p>
              O envio do comprovativo colocará a sua ordem em <strong>PAGAMENTO EM ANÁLISE</strong>. A validação definitiva é efetuada pela administração da JESMU-EVENTOS após conferência bancária.
            </p>
          </div>

          {error && (
            <div className="p-3 rounded-xl bg-red-950/60 border border-red-500/50 text-red-300 text-xs flex items-center gap-2">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>{error}</span>
            </div>
          )}

          {/* Action Buttons */}
          <div className="flex items-center justify-end gap-3 pt-2">
            <button
              type="button"
              onClick={onClose}
              disabled={submitting}
              className="px-5 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-bold"
            >
              Cancelar
            </button>
            <button
              type="submit"
              disabled={submitting}
              className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-sky-500 to-blue-600 hover:from-sky-400 hover:to-blue-500 text-white text-xs font-bold shadow-lg shadow-sky-600/30 flex items-center gap-2 disabled:opacity-60"
            >
              {submitting ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  <span>A submeter...</span>
                </>
              ) : (
                <>
                  <Upload className="w-4 h-4" />
                  <span>Submeter Comprovativo</span>
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
