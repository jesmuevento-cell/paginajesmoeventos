/**
 * Serviço de Notificações Automáticas e Diretas via WhatsApp e Email
 * para Supervisores e Candidatos do THE VOICE LUNDA-SUL | JESMU-EVENTOS.
 *
 * Contactos Oficiais dos Supervisores:
 * - WhatsApp 1: 929156159 (+244 929 156 159)
 * - WhatsApp 2: 940543775 (+244 940 543 775)
 * - Email Oficial: jesmuevento@gmail.com
 */

import { PaymentOrder } from '../types';
import { REGISTRATION_FEE, REGISTRATION_CURRENCY } from './paymentService';

export const SUPERVISOR_CONTACTS = {
  PHONE_1: '929156159',
  PHONE_1_INTL: '244929156159',
  PHONE_2: '940543775',
  PHONE_2_INTL: '244940543775',
  EMAIL: 'jesmuevento@gmail.com',
  ORG_NAME: 'JESMU-EVENTOS',
  EVENT_NAME: 'THE VOICE LUNDA-SUL 2026',
};

export interface ProofNotificationPayload {
  orderId: string;
  codigoInscricao: string;
  nomeConcorrente: string;
  nomeArtistico?: string;
  biConcorrente: string;
  telefoneConcorrente: string;
  emailConcorrente?: string;
  municipioConcorrente?: string;
  valor: number;
  moeda: string;
  metodoUtilizado: string;
  dataPagamentoInformada: string;
  nomePagador?: string;
  numeroTransacao?: string;
  observacoes?: string;
}

/**
 * Constrói o texto formatado para envio via WhatsApp aos Supervisores
 */
export function buildSupervisorWhatsAppMessage(payload: ProofNotificationPayload): string {
  const dataEnvio = new Date().toLocaleString('pt-AO');

  return `🚨 *THE VOICE LUNDA-SUL 2026 | JESMU-EVENTOS*
📥 *NOVO COMPROVATIVO DE PAGAMENTO SUBMETIDO*

Um candidato acaba de submeter o comprovativo da taxa de inscrição:

👤 *Candidato:* ${payload.nomeConcorrente}
${payload.nomeArtistico ? `🎤 *Nome Artístico:* ${payload.nomeArtistico}\n` : ''}🆔 *Código de Inscrição:* ${payload.codigoInscricao}
📄 *N.º do BI:* ${payload.biConcorrente}
📱 *Telefone do Candidato:* ${payload.telefoneConcorrente}
${payload.emailConcorrente ? `✉️ *Email:* ${payload.emailConcorrente}\n` : ''}${payload.municipioConcorrente ? `📍 *Município:* ${payload.municipioConcorrente}\n` : ''}
💰 *Valor Pago:* ${payload.valor.toLocaleString('pt-AO')} ${payload.moeda} (Fixo)
🏦 *Método de Pagamento:* ${payload.metodoUtilizado}
📅 *Data Informada:* ${payload.dataPagamentoInformada}
${payload.nomePagador ? `💳 *Titular da Conta:* ${payload.nomePagador}\n` : ''}${payload.numeroTransacao ? `🔢 *N.º Transacção / Ref:* ${payload.numeroTransacao}\n` : ''}${payload.observacoes ? `📝 *Observações:* ${payload.observacoes}\n` : ''}
⏳ *Estado Atual:* PAGAMENTO EM ANÁLISE
🕒 *Data/Hora do Envio:* ${dataEnvio}

Aceda ao Painel Administrativo da JESMU-EVENTOS para conferir e confirmar o pagamento.`;
}

/**
 * Constrói o texto formatado para envio via WhatsApp de Confirmação ao Candidato
 */
export function buildCandidateWhatsAppMessage(payload: ProofNotificationPayload): string {
  return `👋 Olá *${payload.nomeConcorrente}*,

Recebemos com sucesso o seu comprovativo de pagamento de *${payload.valor.toLocaleString('pt-AO')} ${payload.moeda}* para o concurso *THE VOICE LUNDA-SUL 2026*.

🆔 *Código de Inscrição:* ${payload.codigoInscricao}
🏦 *Método:* ${payload.metodoUtilizado}
⏳ *Estado:* PAGAMENTO EM ANÁLISE

A Direcção da JESMU-EVENTOS está a conferir os dados bancários. Assim que for validado, o seu *Recibo Oficial* ficará disponível na Área do Candidato.

Dúvidas ou urgências:
📞 +244 929 156 159 / +244 940 543 775
✉️ jesmuevento@gmail.com`;
}

/**
 * Constrói link directo para WhatsApp do Supervisor 1 (929156159)
 */
export function getWhatsAppSupervisor1Link(message: string): string {
  return `https://api.whatsapp.com/send?phone=${SUPERVISOR_CONTACTS.PHONE_1_INTL}&text=${encodeURIComponent(message)}`;
}

/**
 * Constrói link directo para WhatsApp do Supervisor 2 (940543775)
 */
export function getWhatsAppSupervisor2Link(message: string): string {
  return `https://api.whatsapp.com/send?phone=${SUPERVISOR_CONTACTS.PHONE_2_INTL}&text=${encodeURIComponent(message)}`;
}

/**
 * Constrói link directo para WhatsApp do Candidato
 */
export function getWhatsAppCandidateLink(phone: string, message: string): string {
  const cleanPhone = phone.replace(/[^0-9]/g, '');
  const finalPhone = cleanPhone.startsWith('244') ? cleanPhone : `244${cleanPhone}`;
  return `https://api.whatsapp.com/send?phone=${finalPhone}&text=${encodeURIComponent(message)}`;
}

/**
 * Constrói link mailto para o email oficial (jesmuevento@gmail.com)
 */
export function getSupervisorEmailLink(payload: ProofNotificationPayload): string {
  const subject = `[COMPROVATIVO] Pagamento Inscrição 5.000 Kz - ${payload.codigoInscricao} - ${payload.nomeConcorrente}`;
  const body = `COMISSÃO ORGANIZADORA JESMU-EVENTOS / SUPERVISÃO

Foi submetido um novo comprovativo de pagamento de inscrição no sistema THE VOICE LUNDA-SUL 2026:

DADOS DO CANDIDATO:
- Nome Completo: ${payload.nomeConcorrente}
- Nome Artístico: ${payload.nomeArtistico || 'N/A'}
- Código de Inscrição: ${payload.codigoInscricao}
- N.º do BI: ${payload.biConcorrente}
- Telefone: ${payload.telefoneConcorrente}
- Email: ${payload.emailConcorrente || 'N/A'}
- Município: ${payload.municipioConcorrente || 'N/A'}

DADOS DO PAGAMENTO:
- Valor: ${payload.valor.toLocaleString('pt-AO')} ${payload.moeda} (Valor Obrigatório)
- Método: ${payload.metodoUtilizado}
- Data do Pagamento: ${payload.dataPagamentoInformada}
- Titular da Conta: ${payload.nomePagador || 'N/A'}
- N.º da Transacção: ${payload.numeroTransacao || 'N/A'}
- Observações: ${payload.observacoes || 'Sem observações'}

Estado: PAGAMENTO EM ANÁLISE
Data de Envio: ${new Date().toLocaleString('pt-AO')}

Favor aceder à Área Administrativa para confirmar ou rejeitar o comprovativo.`;

  return `mailto:${SUPERVISOR_CONTACTS.EMAIL}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
}
