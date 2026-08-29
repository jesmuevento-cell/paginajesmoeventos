import React, { useState } from 'react';
import {
  CheckCircle2,
  Printer,
  X,
  ShieldCheck,
  Building2,
  Calendar,
  CreditCard,
  User,
  Sparkles,
  Download,
  Check,
} from 'lucide-react';
import { PaymentOrder } from '../types';
import { REGISTRATION_FEE, REGISTRATION_CURRENCY } from '../services/paymentService';
import { printReceipt, downloadReceiptHTML, ReceiptData } from '../utils/printReceipt';

interface PaymentReceiptModalProps {
  order: PaymentOrder;
  onClose: () => void;
}

export const PaymentReceiptModal: React.FC<PaymentReceiptModalProps> = ({ order, onClose }) => {
  const [downloaded, setDownloaded] = useState(false);

  const receiptCode =
    order.confirmadoPor?.codigoConfirmacao || `REC-TVLS26-${order.codigoInscricao.slice(-6)}`;
  const confirmDate = order.confirmadoPor?.dataHora
    ? new Date(order.confirmadoPor.dataHora).toLocaleString('pt-AO', {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
      })
    : new Date().toLocaleString('pt-AO');

  const receiptData: ReceiptData = {
    receiptCode,
    orderId: order.id,
    candidateName: order.nomeConcorrente,
    candidateArtisticName: order.nomeArtistico,
    registrationCode: order.codigoInscricao,
    bi: order.biConcorrente,
    phone: order.telefoneConcorrente,
    email: order.emailConcorrente,
    municipio: order.municipioConcorrente,
    amount: order.valor || REGISTRATION_FEE,
    currency: order.moeda || REGISTRATION_CURRENCY,
    paymentMethod:
      order.formaPagamentoSelecionada ||
      order.comprovativo?.metodoUtilizado ||
      'Transferência / Depósito Bancário',
    confirmedBy: order.confirmadoPor?.adminNome || 'Administração JESMU-EVENTOS',
    confirmedDate: confirmDate,
    status: order.estado || 'PAGO E CONFIRMADO',
  };

  const handlePrint = () => {
    printReceipt(receiptData);
  };

  const handleDownload = () => {
    downloadReceiptHTML(receiptData);
    setDownloaded(true);
    setTimeout(() => setDownloaded(false), 2500);
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto">
      <div className="bg-slate-900 border-2 border-emerald-500/50 rounded-3xl max-w-2xl w-full p-6 sm:p-10 text-left shadow-2xl relative space-y-6 print-card">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-6 right-6 p-2 rounded-xl bg-slate-800 text-slate-400 hover:text-white no-print"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Header Branding */}
        <div className="border-b border-slate-800 pb-6 text-center space-y-2">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-400/30 text-emerald-300 text-xs font-bold uppercase tracking-wider">
            <ShieldCheck className="w-4 h-4 text-emerald-400" />
            <span>Documento Oficial Interno</span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-black text-white tracking-tight">
            THE VOICE LUNDA-SUL 2026
          </h2>
          <p className="text-xs text-sky-400 font-bold uppercase tracking-widest">
            Uma Realização JESMU-EVENTOS
          </p>
          <div className="pt-2">
            <span className="inline-block text-xs font-black px-4 py-1.5 rounded-lg bg-emerald-950/80 border border-emerald-500/40 text-emerald-300 uppercase tracking-wider">
              COMPROVATIVO DE INSCRIÇÃO/PAGAMENTO CONFIRMADO
            </span>
          </div>
        </div>

        {/* Receipt Code & Status Box */}
        <div className="p-4 sm:p-5 rounded-2xl bg-slate-950 border border-emerald-500/30 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="space-y-1">
            <span className="text-[11px] text-slate-400 uppercase font-semibold">
              Código de Autenticação / Recibo:
            </span>
            <div className="text-lg sm:text-xl font-mono font-black text-emerald-400">
              {receiptCode}
            </div>
            <span className="text-[10px] text-slate-400">
              Ordem: <span className="font-mono text-slate-300">{order.id}</span>
            </span>
          </div>
          <div className="sm:text-right space-y-1">
            <span className="text-[11px] text-slate-400 uppercase font-semibold block">
              Estado do Pagamento:
            </span>
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-400/50 text-xs font-black uppercase">
              <CheckCircle2 className="w-4 h-4 text-emerald-400" />
              PAGO E CONFIRMADO
            </span>
          </div>
        </div>

        {/* Participant & Payment Details */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
          <div className="p-4 rounded-xl bg-slate-950/70 border border-slate-800 space-y-2">
            <span className="text-sky-400 font-bold uppercase tracking-wider flex items-center gap-1.5 text-[11px]">
              <User className="w-3.5 h-3.5" />
              Dados do Candidato
            </span>
            <div className="space-y-1">
              <div>
                <span className="text-slate-400">Nome: </span>
                <span className="text-white font-bold">{order.nomeConcorrente}</span>
              </div>
              {order.nomeArtistico && (
                <div>
                  <span className="text-slate-400">Nome Artístico: </span>
                  <span className="text-white font-semibold">{order.nomeArtistico}</span>
                </div>
              )}
              <div>
                <span className="text-slate-400">Código de Inscrição: </span>
                <span className="text-emerald-400 font-mono font-bold">{order.codigoInscricao}</span>
              </div>
              <div>
                <span className="text-slate-400">N.º do BI: </span>
                <span className="text-white font-mono">{order.biConcorrente}</span>
              </div>
              <div>
                <span className="text-slate-400">Telefone: </span>
                <span className="text-white">{order.telefoneConcorrente}</span>
              </div>
            </div>
          </div>

          <div className="p-4 rounded-xl bg-slate-950/70 border border-slate-800 space-y-2">
            <span className="text-emerald-400 font-bold uppercase tracking-wider flex items-center gap-1.5 text-[11px]">
              <CreditCard className="w-3.5 h-3.5" />
              Dados da Transacção
            </span>
            <div className="space-y-1">
              <div>
                <span className="text-slate-400">Valor Pago: </span>
                <span className="text-xl font-black text-white font-mono">
                  {order.valor.toLocaleString('pt-AO')} {order.moeda || REGISTRATION_CURRENCY}
                </span>
              </div>
              <div>
                <span className="text-slate-400">Forma de Pagamento: </span>
                <span className="text-slate-200 font-semibold">
                  {order.formaPagamentoSelecionada || order.comprovativo?.metodoUtilizado || 'Transferência / Presencial'}
                </span>
              </div>
              <div>
                <span className="text-slate-400">Confirmado por: </span>
                <span className="text-slate-200">
                  {order.confirmadoPor?.adminNome || 'Administração JESMU-EVENTOS'}
                </span>
              </div>
              <div>
                <span className="text-slate-400">Data e Hora: </span>
                <span className="text-slate-300">{confirmDate}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Informational Disclaimer */}
        <div className="p-4 rounded-xl bg-slate-950/40 border border-slate-800/80 text-[11px] text-slate-400 space-y-1">
          <p className="font-semibold text-slate-300">
            Aviso de Validação:
          </p>
          <p>
            Este comprovativo certifica que o participante realizou com sucesso o pagamento da taxa de inscrição e que a sua candidatura ao concurso THE VOICE LUNDA-SUL está oficialmente validada para as próximas fases.
          </p>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row items-center justify-end gap-3 pt-2 no-print">
          <button
            onClick={onClose}
            className="w-full sm:w-auto px-5 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 font-bold text-xs"
          >
            Fechar
          </button>
          <button
            onClick={handleDownload}
            className="w-full sm:w-auto px-5 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-sky-300 font-bold text-xs flex items-center justify-center gap-2 border border-slate-700"
            title="Descarregar ficheiro do recibo para guardar ou imprimir depois"
          >
            {downloaded ? (
              <>
                <Check className="w-4 h-4 text-emerald-400" />
                <span className="text-emerald-400">Recibo Descarregado</span>
              </>
            ) : (
              <>
                <Download className="w-4 h-4 text-sky-400" />
                <span>Guardar / Descarregar</span>
              </>
            )}
          </button>
          <button
            onClick={handlePrint}
            className="w-full sm:w-auto px-6 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs flex items-center justify-center gap-2 shadow-lg shadow-emerald-600/30"
          >
            <Printer className="w-4 h-4" />
            <span>Imprimir Recibo</span>
          </button>
        </div>
      </div>
    </div>
  );
};
