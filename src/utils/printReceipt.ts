/**
 * Utility for printing and generating official receipts & registration dossiers
 * for THE VOICE LUNDA-SUL | JESMU-EVENTOS.
 *
 * Designed to work seamlessly in both sandboxed iframe previews and standard browsers.
 */

export interface ReceiptData {
  receiptCode: string;
  orderId: string;
  candidateName: string;
  candidateArtisticName?: string;
  registrationCode: string;
  bi: string;
  phone: string;
  email?: string;
  municipio?: string;
  amount: number;
  currency: string;
  paymentMethod: string;
  confirmedBy: string;
  confirmedDate: string;
  status: string;
}

export interface CandidateDossierData {
  codigoInscricao: string;
  nomeCompleto: string;
  nomeArtistico?: string;
  bi: string;
  telefone: string;
  email: string;
  municipio: string;
  generoMusical: string;
  experienciaMusical: string;
  biografia?: string;
  motivacao?: string;
  dataInscricao?: string;
  estado: string;
  pagamentoEstado?: string;
}

function generateReceiptHTML(data: ReceiptData): string {
  const formattedAmount = data.amount.toLocaleString('pt-AO');
  const issueDate = new Date().toLocaleString('pt-AO');

  return `<!DOCTYPE html>
<html lang="pt">
<head>
  <meta charset="UTF-8">
  <title>Recibo Oficial - ${data.receiptCode} - The Voice Lunda-Sul</title>
  <style>
    @page {
      size: A4 portrait;
      margin: 15mm;
    }
    * {
      box-sizing: border-box;
      margin: 0;
      padding: 0;
      font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif;
    }
    body {
      background: #ffffff;
      color: #0f172a;
      padding: 20px;
      font-size: 13px;
      line-height: 1.5;
    }
    .receipt-container {
      max-width: 720px;
      margin: 0 auto;
      border: 2px solid #0f172a;
      border-radius: 12px;
      padding: 30px;
      background: #ffffff;
      position: relative;
    }
    .header {
      text-align: center;
      border-bottom: 2px solid #0f172a;
      padding-bottom: 18px;
      margin-bottom: 20px;
    }
    .rep-title {
      font-size: 11px;
      font-weight: bold;
      letter-spacing: 2px;
      text-transform: uppercase;
      color: #475569;
    }
    .main-title {
      font-size: 24px;
      font-weight: 900;
      color: #0f172a;
      margin: 4px 0 2px 0;
      letter-spacing: -0.5px;
    }
    .sub-title {
      font-size: 11px;
      font-weight: 700;
      color: #0284c7;
      text-transform: uppercase;
      letter-spacing: 1.5px;
    }
    .badge-doc {
      display: inline-block;
      margin-top: 10px;
      background: #ecfdf5;
      color: #047857;
      border: 1px solid #10b981;
      padding: 4px 14px;
      border-radius: 999px;
      font-size: 11px;
      font-weight: 800;
      letter-spacing: 0.5px;
      text-transform: uppercase;
    }
    .code-box {
      display: flex;
      justify-content: space-between;
      align-items: center;
      background: #f8fafc;
      border: 1px solid #cbd5e1;
      border-radius: 8px;
      padding: 14px 18px;
      margin-bottom: 20px;
    }
    .code-box .label {
      font-size: 10px;
      font-weight: 700;
      color: #64748b;
      text-transform: uppercase;
    }
    .code-box .val-code {
      font-family: monospace;
      font-size: 18px;
      font-weight: 800;
      color: #0f172a;
    }
    .code-box .status-pill {
      background: #059669;
      color: #ffffff;
      padding: 5px 12px;
      border-radius: 6px;
      font-size: 11px;
      font-weight: 800;
      text-transform: uppercase;
    }
    .grid {
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: 16px;
      margin-bottom: 20px;
    }
    .section-card {
      background: #f8fafc;
      border: 1px solid #e2e8f0;
      border-radius: 8px;
      padding: 14px;
    }
    .section-title {
      font-size: 11px;
      font-weight: 800;
      color: #0369a1;
      text-transform: uppercase;
      margin-bottom: 8px;
      border-bottom: 1px solid #cbd5e1;
      padding-bottom: 4px;
    }
    .row {
      display: flex;
      justify-content: space-between;
      padding: 3px 0;
      font-size: 12px;
    }
    .row .lbl {
      color: #64748b;
    }
    .row .val {
      font-weight: 700;
      color: #0f172a;
      text-align: right;
    }
    .amount-highlight {
      font-size: 18px;
      color: #047857;
      font-weight: 900;
      font-family: monospace;
    }
    .disclaimer {
      background: #f1f5f9;
      border-left: 4px solid #0284c7;
      padding: 10px 14px;
      font-size: 11px;
      color: #475569;
      margin-bottom: 24px;
      border-radius: 0 6px 6px 0;
    }
    .footer-signatures {
      display: flex;
      justify-content: space-between;
      align-items: flex-end;
      margin-top: 30px;
      padding-top: 15px;
      border-top: 1px dashed #94a3b8;
    }
    .sig-block {
      text-align: center;
      width: 45%;
    }
    .sig-line {
      border-top: 1px solid #0f172a;
      margin-top: 35px;
      padding-top: 5px;
      font-weight: bold;
      font-size: 11px;
    }
    .stamp-box {
      display: inline-block;
      border: 2px dashed #059669;
      padding: 6px 12px;
      border-radius: 8px;
      color: #047857;
      font-weight: 800;
      font-size: 10px;
      text-transform: uppercase;
      letter-spacing: 0.5px;
    }
    @media print {
      body {
        padding: 0;
        background: transparent;
      }
      .receipt-container {
        border: 1.5px solid #000;
        padding: 20px;
      }
    }
  </style>
</head>
<body>
  <div class="receipt-container">
    <div class="header">
      <div class="rep-title">República de Angola &bull; Província da Lunda-Sul</div>
      <div class="main-title">THE VOICE LUNDA-SUL 2026</div>
      <div class="sub-title">Comprovativo Oficial de Pagamento &bull; JESMU-EVENTOS</div>
      <div class="badge-doc">&#10003; Inscrição Validada e Confirmada</div>
    </div>

    <div class="code-box">
      <div>
        <div class="label">Código de Autenticação / Recibo</div>
        <div class="val-code">${data.receiptCode}</div>
        <div style="font-size: 10px; color: #64748b; margin-top: 2px;">Ordem: ${data.orderId}</div>
      </div>
      <div class="status-pill">
        &#10004; ${data.status}
      </div>
    </div>

    <div class="grid">
      <!-- Candidato -->
      <div class="section-card">
        <div class="section-title">Dados do Candidato</div>
        <div class="row">
          <span class="lbl">Nome Completo:</span>
          <span class="val">${data.candidateName}</span>
        </div>
        ${data.candidateArtisticName ? `
        <div class="row">
          <span class="lbl">Nome Artístico:</span>
          <span class="val">${data.candidateArtisticName}</span>
        </div>` : ''}
        <div class="row">
          <span class="lbl">Código de Inscrição:</span>
          <span class="val" style="font-family: monospace; color: #0284c7;">${data.registrationCode}</span>
        </div>
        <div class="row">
          <span class="lbl">N.º do BI:</span>
          <span class="val" style="font-family: monospace;">${data.bi}</span>
        </div>
        <div class="row">
          <span class="lbl">Telefone:</span>
          <span class="val">${data.phone}</span>
        </div>
        ${data.municipio ? `
        <div class="row">
          <span class="lbl">Município:</span>
          <span class="val">${data.municipio}</span>
        </div>` : ''}
      </div>

      <!-- Transacção -->
      <div class="section-card">
        <div class="section-title">Dados da Transacção</div>
        <div class="row">
          <span class="lbl">Valor da Taxa:</span>
          <span class="val amount-highlight">${formattedAmount} ${data.currency}</span>
        </div>
        <div class="row">
          <span class="lbl">Método Utilizado:</span>
          <span class="val">${data.paymentMethod}</span>
        </div>
        <div class="row">
          <span class="lbl">Validado por:</span>
          <span class="val">${data.confirmedBy}</span>
        </div>
        <div class="row">
          <span class="lbl">Data de Confirmação:</span>
          <span class="val">${data.confirmedDate}</span>
        </div>
        <div class="row">
          <span class="lbl">Emissão do Recibo:</span>
          <span class="val">${issueDate}</span>
        </div>
      </div>
    </div>

    <div class="disclaimer">
      <strong>Termos e Validação Oficial:</strong> Este documento comprova o pagamento da taxa de candidatura (${formattedAmount} ${data.currency}) para o concurso <strong>THE VOICE LUNDA-SUL 2026</strong>. Apresente este recibo impresso ou em formato digital nas audições presenciais.
    </div>

    <div class="footer-signatures">
      <div class="sig-block">
        <div class="stamp-box">
          JESMU-EVENTOS &bull; AUTENTICADO<br>
          <span style="font-family: monospace; font-size: 9px;">${data.receiptCode}</span>
        </div>
        <div class="sig-line">
          Comissão Organizadora / Direcção Financeira
        </div>
      </div>

      <div class="sig-block">
        <div style="font-size: 11px; color: #64748b; margin-bottom: 8px;">Assinatura do Candidato</div>
        <div class="sig-line">
          ${data.candidateName}
        </div>
      </div>
    </div>
  </div>

  <script>
    window.onload = function() {
      setTimeout(function() {
        window.focus();
        window.print();
      }, 300);
    };
  </script>
</body>
</html>`;
}

function generateDossierHTML(c: CandidateDossierData): string {
  const issueDate = new Date().toLocaleString('pt-AO');

  return `<!DOCTYPE html>
<html lang="pt">
<head>
  <meta charset="UTF-8">
  <title>Ficha de Inscrição - ${c.codigoInscricao} - The Voice Lunda-Sul</title>
  <style>
    @page {
      size: A4 portrait;
      margin: 15mm;
    }
    * {
      box-sizing: border-box;
      margin: 0;
      padding: 0;
      font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif;
    }
    body {
      background: #ffffff;
      color: #0f172a;
      padding: 20px;
      font-size: 13px;
      line-height: 1.5;
    }
    .dossier-container {
      max-width: 720px;
      margin: 0 auto;
      border: 2px solid #0f172a;
      border-radius: 12px;
      padding: 30px;
      background: #ffffff;
    }
    .header {
      text-align: center;
      border-bottom: 2px solid #0f172a;
      padding-bottom: 16px;
      margin-bottom: 20px;
    }
    .main-title {
      font-size: 24px;
      font-weight: 900;
      color: #0f172a;
      margin-top: 4px;
    }
    .sub-title {
      font-size: 11px;
      font-weight: 700;
      color: #0284c7;
      text-transform: uppercase;
      letter-spacing: 1px;
    }
    .code-badge {
      display: flex;
      justify-content: space-between;
      align-items: center;
      background: #f8fafc;
      border: 1px solid #cbd5e1;
      border-radius: 8px;
      padding: 12px 18px;
      margin-bottom: 20px;
    }
    .grid {
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: 16px;
      margin-bottom: 16px;
    }
    .box {
      background: #f8fafc;
      border: 1px solid #e2e8f0;
      border-radius: 8px;
      padding: 12px 16px;
    }
    .box-title {
      font-size: 11px;
      font-weight: 800;
      color: #0369a1;
      text-transform: uppercase;
      border-bottom: 1px solid #cbd5e1;
      padding-bottom: 4px;
      margin-bottom: 8px;
    }
    .row {
      display: flex;
      justify-content: space-between;
      padding: 3px 0;
      font-size: 12px;
    }
    .row .lbl { color: #64748b; }
    .row .val { font-weight: 700; color: #0f172a; text-align: right; }
    .text-block {
      background: #f8fafc;
      border: 1px solid #e2e8f0;
      border-radius: 8px;
      padding: 12px 16px;
      margin-bottom: 16px;
    }
    .footer {
      display: flex;
      justify-content: space-between;
      align-items: flex-end;
      margin-top: 30px;
      padding-top: 15px;
      border-top: 1px dashed #94a3b8;
    }
    .sig-line {
      border-top: 1px solid #0f172a;
      width: 220px;
      text-align: center;
      margin-top: 35px;
      padding-top: 5px;
      font-weight: bold;
      font-size: 11px;
    }
  </style>
</head>
<body>
  <div class="dossier-container">
    <div class="header">
      <div style="font-size: 11px; font-weight: bold; letter-spacing: 2px; color: #64748b; text-transform: uppercase;">
        República de Angola &bull; Província da Lunda-Sul
      </div>
      <div class="main-title">THE VOICE LUNDA-SUL 2026</div>
      <div class="sub-title">Ficha Oficial de Inscrição de Candidato &bull; JESMU-EVENTOS</div>
    </div>

    <div class="code-badge">
      <div>
        <div style="font-size: 10px; font-weight: 700; color: #64748b; text-transform: uppercase;">Código do Candidato</div>
        <div style="font-family: monospace; font-size: 20px; font-weight: 800; color: #0284c7;">${c.codigoInscricao}</div>
      </div>
      <div style="text-align: right;">
        <div style="font-size: 10px; font-weight: 700; color: #64748b; text-transform: uppercase;">Estado da Inscrição</div>
        <div style="font-weight: 800; color: #059669; text-transform: uppercase;">${c.estado}</div>
      </div>
    </div>

    <div class="grid">
      <div class="box">
        <div class="box-title">Dados Pessoais</div>
        <div class="row"><span class="lbl">Nome Completo:</span><span class="val">${c.nomeCompleto}</span></div>
        ${c.nomeArtistico ? `<div class="row"><span class="lbl">Nome Artístico:</span><span class="val">${c.nomeArtistico}</span></div>` : ''}
        <div class="row"><span class="lbl">N.º do BI:</span><span class="val" style="font-family: monospace;">${c.bi}</span></div>
        <div class="row"><span class="lbl">Município:</span><span class="val">${c.municipio}</span></div>
      </div>

      <div class="box">
        <div class="box-title">Contactos & Música</div>
        <div class="row"><span class="lbl">Telefone:</span><span class="val">${c.telefone}</span></div>
        <div class="row"><span class="lbl">Email:</span><span class="val">${c.email}</span></div>
        <div class="row"><span class="lbl">Género Musical:</span><span class="val">${c.generoMusical}</span></div>
        <div class="row"><span class="lbl">Experiência:</span><span class="val">${c.experienciaMusical}</span></div>
      </div>
    </div>

    ${c.biografia ? `
    <div class="text-block">
      <div class="box-title">Trajectória Artística</div>
      <p style="font-size: 12px; color: #334155; line-height: 1.4;">${c.biografia}</p>
    </div>` : ''}

    ${c.motivacao ? `
    <div class="text-block">
      <div class="box-title">Motivação</div>
      <p style="font-size: 12px; color: #334155; line-height: 1.4;">${c.motivacao}</p>
    </div>` : ''}

    <div style="background: #f1f5f9; padding: 10px 14px; border-radius: 6px; font-size: 11px; color: #475569;">
      <strong>Informação:</strong> Taxa obrigatória de inscrição no valor de <strong>5.000 KZ</strong>. Apresente este documento e o documento de identificação (BI) no dia da audição.
    </div>

    <div class="footer">
      <div>
        <div style="font-size: 10px; color: #64748b;">Emitido em: ${issueDate}</div>
        <div style="font-size: 10px; color: #0284c7; font-weight: bold; margin-top: 2px;">THE VOICE LUNDA-SUL &bull; JESMU-EVENTOS</div>
      </div>
      <div>
        <div class="sig-line">Assinatura do Candidato</div>
      </div>
    </div>
  </div>

  <script>
    window.onload = function() {
      setTimeout(function() {
        window.focus();
        window.print();
      }, 300);
    };
  </script>
</body>
</html>`;
}

/**
 * Executes a clean print operation by rendering to a dedicated hidden iframe.
 * Falls back to opening a dedicated window if iframe printing is restricted.
 */
export function printReceipt(data: ReceiptData): void {
  const html = generateReceiptHTML(data);
  triggerPrintHTML(html, `Recibo_${data.receiptCode}.html`);
}

export function printCandidateDossier(data: CandidateDossierData): void {
  const html = generateDossierHTML(data);
  triggerPrintHTML(html, `Ficha_${data.codigoInscricao}.html`);
}

function triggerPrintHTML(htmlContent: string, downloadFallbackName: string): void {
  try {
    // 1. Try iframe method (smoothest for embedded apps / iframes)
    const iframe = document.createElement('iframe');
    iframe.style.position = 'fixed';
    iframe.style.right = '0';
    iframe.style.bottom = '0';
    iframe.style.width = '0';
    iframe.style.height = '0';
    iframe.style.border = '0';
    iframe.setAttribute('title', 'Documento para Impressão');
    document.body.appendChild(iframe);

    const doc = iframe.contentWindow?.document || iframe.contentDocument;
    if (doc) {
      doc.open();
      doc.write(htmlContent);
      doc.close();

      setTimeout(() => {
        try {
          iframe.contentWindow?.focus();
          iframe.contentWindow?.print();
        } catch (printErr) {
          console.warn('Iframe print failed, falling back to window.open', printErr);
          openPrintWindow(htmlContent);
        }
        // Cleanup after printing
        setTimeout(() => {
          try {
            if (document.body.contains(iframe)) {
              document.body.removeChild(iframe);
            }
          } catch {}
        }, 60000);
      }, 400);
      return;
    }
  } catch (err) {
    console.warn('Direct iframe print error, using fallback:', err);
  }

  // Fallback 1: window.open
  openPrintWindow(htmlContent);
}

function openPrintWindow(htmlContent: string): void {
  try {
    const printWindow = window.open('', '_blank', 'width=850,height=900');
    if (printWindow) {
      printWindow.document.open();
      printWindow.document.write(htmlContent);
      printWindow.document.close();
      printWindow.focus();
      return;
    }
  } catch (winErr) {
    console.error('Window open blocked:', winErr);
  }

  // Fallback 2: Direct browser print
  window.print();
}

/**
 * Downloads the receipt as an HTML file that can be opened/printed anywhere offline.
 */
export function downloadReceiptHTML(data: ReceiptData): void {
  const html = generateReceiptHTML(data);
  const blob = new Blob([html], { type: 'text/html;charset=utf-8' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = `Recibo_Oficial_${data.receiptCode}.html`;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}
