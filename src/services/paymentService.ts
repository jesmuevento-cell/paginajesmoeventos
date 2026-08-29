import {
  collection,
  doc,
  getDocs,
  getDoc,
  setDoc,
  query,
  where,
  limit,
} from 'firebase/firestore';
import { db, isConfigured } from '../firebase/config';
import {
  PaymentOrder,
  PaymentMethodConfig,
  PaymentProof,
  PaymentAuditLog,
  PaymentStatus,
  Candidate,
} from '../types';

export const REGISTRATION_FEE = 5000; // 5.000 Kz (Fixo e obrigatório)
export const REGISTRATION_CURRENCY = 'Kz';

const STORAGE_KEYS = {
  PAYMENT_ORDERS: 'tvls_pagamentos_v1',
  PAYMENT_METHODS: 'tvls_metodos_pagamento_v1',
};

export const INITIAL_PAYMENT_METHODS: PaymentMethodConfig[] = [
  {
    id: 'pm-transferencia-bai',
    tipo: 'transferencia',
    nome: 'Transferência Bancária (BAI / Multicaixa)',
    ativo: true,
    banco: 'Banco BAI (Banco Angolano de Investimentos)',
    titular: 'JESMU-EVENTOS',
    iban: 'AO06.0040.0000.1234.5678.9012.3',
    conta: '0040.1234.5678.901',
    instrucoes:
      'Transfira 5.000 Kz para a conta indicada. No descritivo da transferência, coloque OBRIGATORIAMENTE o seu Código de Inscrição.',
  },
  {
    id: 'pm-transferencia-bfa',
    tipo: 'transferencia',
    nome: 'Transferência Bancária (BFA)',
    ativo: true,
    banco: 'Banco de Fomento Angola (BFA)',
    titular: 'JESMU-EVENTOS',
    iban: 'AO06.0006.0000.9876.5432.1098.7',
    conta: '0006.9876.5432.109',
    instrucoes:
      'Transfira 5.000 Kz para a conta BFA. Indique o seu Código de Inscrição como referência.',
  },
  {
    id: 'pm-presencial-saurimo',
    tipo: 'presencial',
    nome: 'Pagamento Presencial (Saurimo)',
    ativo: true,
    local: 'Sede da JESMU-EVENTOS / Casa da Cultura e Juventude, Saurimo - Lunda-Sul',
    contacto: '+244 923 884 100 / +244 991 773 200',
    instrucoes:
      'Dirija-se ao posto presencial da JESMU-EVENTOS em Saurimo com 5.000 Kz em dinheiro e o seu Código de Inscrição.',
  },
  {
    id: 'pm-deposito-balcao',
    tipo: 'deposito',
    nome: 'Depósito Direto ao Balcão',
    ativo: true,
    banco: 'Qualquer agência BAI ou BFA em Saurimo e províncias',
    titular: 'JESMU-EVENTOS',
    conta: '0040.1234.5678.901 (BAI) / 0006.9876.5432.109 (BFA)',
    instrucoes:
      'Faça o depósito de 5.000 Kz e guarde o talão/recibo emitido pelo banco para envio no portal.',
  },
];

function getLocal<T>(key: string, defaultVal: T): T {
  try {
    const item = localStorage.getItem(key);
    if (!item) {
      localStorage.setItem(key, JSON.stringify(defaultVal));
      return defaultVal;
    }
    return JSON.parse(item);
  } catch (e) {
    return defaultVal;
  }
}

function setLocal<T>(key: string, val: T): void {
  try {
    localStorage.setItem(key, JSON.stringify(val));
  } catch (e) {
    console.warn('Aviso: Armazenamento local indisponível:', e);
  }
}

// Gera código de confirmação único para recibo
export function generateConfirmationCode(code: string): string {
  const cleanCode = code.replace(/[^A-Z0-9]/gi, '').toUpperCase();
  const rand = Math.floor(1000 + Math.random() * 9000);
  return `REC-TVLS26-${cleanCode.slice(-4)}-${rand}`;
}

// Gera hash simples para detecção de duplicados
export function generateProofHash(fileName: string, fileSize: number, valor: number): string {
  const str = `${fileName.trim().toLowerCase()}_${fileSize}_${valor}`;
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    const char = str.charCodeAt(i);
    hash = (hash << 5) - hash + char;
    hash |= 0;
  }
  return `hash-${Math.abs(hash).toString(16)}`;
}

// Mapeia ordem de pagamento a partir de candidato
export function createOrderObject(candidate: Candidate): PaymentOrder {
  const orderId = `PAY-${candidate.codigoInscricao}`;
  const now = new Date().toISOString();

  const auditLog: PaymentAuditLog = {
    id: `log-${Date.now()}-1`,
    dataHora: now,
    acao: 'Ordem Criada',
    descricao: `Ordem de pagamento ${orderId} gerada no valor fixo de 5.000 Kz para ${candidate.nomeCompleto}.`,
  };

  return {
    id: orderId,
    codigoInscricao: candidate.codigoInscricao,
    candidatoId: candidate.id,
    nomeConcorrente: candidate.nomeCompleto,
    nomeArtistico: candidate.nomeArtistico,
    biConcorrente: candidate.bi,
    telefoneConcorrente: candidate.telefone,
    emailConcorrente: candidate.email,
    municipioConcorrente: candidate.municipio,
    valor: REGISTRATION_FEE,
    moeda: REGISTRATION_CURRENCY,
    estado: 'AGUARDANDO PAGAMENTO',
    dataCriacao: now,
    dataAtualizacao: now,
    historicoAuditoria: [auditLog],
  };
}

// ==================== OPERAÇÕES DE SERVIÇO ====================

export async function fetchPaymentOrders(): Promise<PaymentOrder[]> {
  if (db && isConfigured) {
    try {
      const colRef = collection(db, 'pagamentos');
      const snap = await getDocs(colRef);
      if (!snap.empty) {
        const cloudData = snap.docs.map((d) => ({ ...d.data(), id: d.id } as PaymentOrder));
        setLocal(STORAGE_KEYS.PAYMENT_ORDERS, cloudData);
        return cloudData;
      }
    } catch (err) {
      console.warn('Firestore fetchPaymentOrders warning:', err);
    }
  }

  return getLocal<PaymentOrder[]>(STORAGE_KEYS.PAYMENT_ORDERS, []);
}

export async function fetchPaymentOrderById(id: string): Promise<PaymentOrder | null> {
  const cleanId = id.trim();
  if (db && isConfigured) {
    try {
      const docRef = doc(db, 'pagamentos', cleanId);
      const snap = await getDoc(docRef);
      if (snap.exists()) {
        return { ...snap.data(), id: snap.id } as PaymentOrder;
      }
    } catch (err) {
      console.warn('Firestore fetchPaymentOrderById error:', err);
    }
  }

  const all = await fetchPaymentOrders();
  return all.find((o) => o.id === cleanId) || null;
}

export async function fetchPaymentOrderByCandidateCode(code: string): Promise<PaymentOrder | null> {
  const clean = (code || '').trim().toUpperCase();
  if (!clean) return null;

  if (db && isConfigured) {
    try {
      const colRef = collection(db, 'pagamentos');
      const q = query(colRef, where('codigoInscricao', '==', clean), limit(1));
      const snap = await getDocs(q);
      if (!snap.empty) {
        return { ...snap.docs[0].data(), id: snap.docs[0].id } as PaymentOrder;
      }
    } catch (err) {
      console.warn('Firestore fetchPaymentOrderByCandidateCode error:', err);
    }
  }

  const all = await fetchPaymentOrders();
  return all.find((o) => (o.codigoInscricao || '').toUpperCase() === clean) || null;
}

export async function savePaymentOrder(order: PaymentOrder): Promise<PaymentOrder> {
  const updatedOrder = {
    ...order,
    dataAtualizacao: new Date().toISOString(),
  };

  // 1. Salvar no Firestore
  if (db && isConfigured) {
    try {
      const docRef = doc(db, 'pagamentos', updatedOrder.id);
      await setDoc(docRef, updatedOrder, { merge: true });
    } catch (err) {
      console.error('Erro ao salvar ordem no Firestore:', err);
    }
  }

  // 2. Salvar localmente
  const all = getLocal<PaymentOrder[]>(STORAGE_KEYS.PAYMENT_ORDERS, []);
  const index = all.findIndex((o) => o.id === updatedOrder.id);
  if (index >= 0) {
    all[index] = updatedOrder;
  } else {
    all.unshift(updatedOrder);
  }
  setLocal(STORAGE_KEYS.PAYMENT_ORDERS, all);

  return updatedOrder;
}

export async function submitPaymentProof(
  orderId: string,
  proofData: {
    comprovativoUrl: string;
    comprovativoNomeArquivo?: string;
    comprovativoTamanho?: number;
    dataPagamentoInformada: string;
    metodoUtilizado: string;
    nomePagador?: string;
    numeroTransacao?: string;
    observacoes?: string;
  }
): Promise<PaymentOrder> {
  const existing = await fetchPaymentOrderById(orderId);
  if (!existing) {
    throw new Error(`Ordem de pagamento ${orderId} não encontrada.`);
  }

  // Prevenção de alteração se já pago
  if (existing.estado === 'PAGO E CONFIRMADO') {
    throw new Error('Este pagamento já foi confirmado anteriormente e não pode ser alterado.');
  }

  const now = new Date().toISOString();
  const proofHash = generateProofHash(
    proofData.comprovativoNomeArquivo || 'comprovativo',
    proofData.comprovativoTamanho || 0,
    REGISTRATION_FEE
  );

  // Verificação de duplicação com outras ordens
  const allOrders = await fetchPaymentOrders();
  const possibleDuplicate = allOrders.find(
    (o) =>
      o.id !== existing.id &&
      o.comprovativo?.comprovativoHash &&
      o.comprovativo.comprovativoHash === proofHash
  );

  const proof: PaymentProof = {
    ...proofData,
    valorInformado: REGISTRATION_FEE,
    dataUpload: now,
    comprovativoHash: proofHash,
  };

  const newLog: PaymentAuditLog = {
    id: `log-${Date.now()}`,
    dataHora: now,
    acao: 'Comprovativo Enviado',
    descricao: `Comprovativo de 5.000 Kz (${proofData.metodoUtilizado}) submetido pelo concorrente. Notificações enviadas aos Supervisores (WhatsApp: 929156159, 940543775 | Email: jesmuevento@gmail.com). Estado alterado para PAGAMENTO EM ANÁLISE.${
      possibleDuplicate ? ' ⚠️ POSSÍVEL COMPROVATIVO DUPLICADO DETECTADO.' : ''
    }`,
  };

  const updated: PaymentOrder = {
    ...existing,
    formaPagamentoSelecionada: proofData.metodoUtilizado,
    estado: 'PAGAMENTO EM ANÁLISE',
    comprovativo: proof,
    alertaDuplicado: !!possibleDuplicate,
    motivoAlertaDuplicado: possibleDuplicate
      ? `Comprovativo com mesmo nome/tamanho já enviado na ordem ${possibleDuplicate.id} (${possibleDuplicate.nomeConcorrente}).`
      : undefined,
    dataAtualizacao: now,
    historicoAuditoria: [...(existing.historicoAuditoria || []), newLog],
  };

  return savePaymentOrder(updated);
}

export async function confirmPayment(
  orderId: string,
  admin: { uid: string; nome: string }
): Promise<{ order: PaymentOrder; receiptCode: string }> {
  const existing = await fetchPaymentOrderById(orderId);
  if (!existing) {
    throw new Error(`Ordem de pagamento ${orderId} não encontrada.`);
  }

  if (existing.estado === 'PAGO E CONFIRMADO') {
    return {
      order: existing,
      receiptCode: existing.confirmadoPor?.codigoConfirmacao || generateConfirmationCode(existing.codigoInscricao),
    };
  }

  const now = new Date().toISOString();
  const receiptCode = generateConfirmationCode(existing.codigoInscricao);

  const newLog: PaymentAuditLog = {
    id: `log-${Date.now()}`,
    dataHora: now,
    acao: 'Pagamento Confirmado',
    descricao: `Pagamento de 5.000 Kz confirmado com sucesso pelo Administrador ${admin.nome}. Inscrição validada. Recibo: ${receiptCode}`,
    adminId: admin.uid,
    adminNome: admin.nome,
  };

  const updated: PaymentOrder = {
    ...existing,
    estado: 'PAGO E CONFIRMADO',
    confirmadoPor: {
      adminId: admin.uid,
      adminNome: admin.nome,
      dataHora: now,
      codigoConfirmacao: receiptCode,
    },
    dataAtualizacao: now,
    historicoAuditoria: [...(existing.historicoAuditoria || []), newLog],
  };

  const saved = await savePaymentOrder(updated);
  return { order: saved, receiptCode };
}

export async function rejectPayment(
  orderId: string,
  motivo: string,
  admin: { uid: string; nome: string }
): Promise<PaymentOrder> {
  const cleanMotivo = (motivo || '').trim();
  if (!cleanMotivo) {
    throw new Error('É obrigatório especificar o motivo da rejeição do pagamento.');
  }

  const existing = await fetchPaymentOrderById(orderId);
  if (!existing) {
    throw new Error(`Ordem de pagamento ${orderId} não encontrada.`);
  }

  const now = new Date().toISOString();
  const newLog: PaymentAuditLog = {
    id: `log-${Date.now()}`,
    dataHora: now,
    acao: 'Pagamento Rejeitado',
    descricao: `Pagamento rejeitado pelo Administrador ${admin.nome}. Motivo: ${cleanMotivo}`,
    adminId: admin.uid,
    adminNome: admin.nome,
  };

  const updated: PaymentOrder = {
    ...existing,
    estado: 'PAGAMENTO REJEITADO',
    motivoRejeicao: cleanMotivo,
    dataRejeicao: now,
    dataAtualizacao: now,
    historicoAuditoria: [...(existing.historicoAuditoria || []), newLog],
  };

  return savePaymentOrder(updated);
}

export async function cancelPayment(
  orderId: string,
  motivo: string,
  admin: { uid: string; nome: string }
): Promise<PaymentOrder> {
  const existing = await fetchPaymentOrderById(orderId);
  if (!existing) {
    throw new Error(`Ordem de pagamento ${orderId} não encontrada.`);
  }

  const now = new Date().toISOString();
  const newLog: PaymentAuditLog = {
    id: `log-${Date.now()}`,
    dataHora: now,
    acao: 'Pagamento Cancelado',
    descricao: `Ordem cancelada por ${admin.nome}. Motivo: ${motivo}`,
    adminId: admin.uid,
    adminNome: admin.nome,
  };

  const updated: PaymentOrder = {
    ...existing,
    estado: 'PAGAMENTO CANCELADO',
    motivoRejeicao: motivo,
    dataAtualizacao: now,
    historicoAuditoria: [...(existing.historicoAuditoria || []), newLog],
  };

  return savePaymentOrder(updated);
}

// Métodos de Pagamento
export async function fetchPaymentMethods(): Promise<PaymentMethodConfig[]> {
  if (db && isConfigured) {
    try {
      const colRef = collection(db, 'metodos_pagamento');
      const snap = await getDocs(colRef);
      if (!snap.empty) {
        const cloudData = snap.docs.map((d) => ({ ...d.data(), id: d.id } as PaymentMethodConfig));
        setLocal(STORAGE_KEYS.PAYMENT_METHODS, cloudData);
        return cloudData;
      }
    } catch (err) {
      console.warn('Firestore fetchPaymentMethods warning:', err);
    }
  }

  return getLocal<PaymentMethodConfig[]>(STORAGE_KEYS.PAYMENT_METHODS, INITIAL_PAYMENT_METHODS);
}

export async function savePaymentMethods(methods: PaymentMethodConfig[]): Promise<PaymentMethodConfig[]> {
  if (db && isConfigured) {
    try {
      for (const m of methods) {
        await setDoc(doc(db, 'metodos_pagamento', m.id), m, { merge: true });
      }
    } catch (err) {
      console.error('Erro ao salvar métodos de pagamento no Firestore:', err);
    }
  }

  setLocal(STORAGE_KEYS.PAYMENT_METHODS, methods);
  return methods;
}

// Estatísticas Financeiras
export function calculatePaymentStats(orders: PaymentOrder[]) {
  const total = orders.length;
  const aguardando = orders.filter((o) => o.estado === 'AGUARDANDO PAGAMENTO').length;
  const comprovativoEnviado = orders.filter((o) => o.estado === 'COMPROVATIVO ENVIADO').length;
  const emAnalise = orders.filter((o) => o.estado === 'PAGAMENTO EM ANÁLISE').length;
  const confirmados = orders.filter((o) => o.estado === 'PAGO E CONFIRMADO').length;
  const rejeitados = orders.filter((o) => o.estado === 'PAGAMENTO REJEITADO').length;
  const cancelados = orders.filter((o) => o.estado === 'PAGAMENTO CANCELADO').length;
  const totalArrecadado = confirmados * REGISTRATION_FEE;
  const totalPrevisto = total * REGISTRATION_FEE;

  return {
    total,
    aguardando,
    comprovativoEnviado,
    emAnalise,
    confirmados,
    rejeitados,
    cancelados,
    totalArrecadado,
    totalPrevisto,
  };
}
