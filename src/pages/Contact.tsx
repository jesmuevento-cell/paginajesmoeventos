import React, { useState } from 'react';
import {
  Phone,
  Mail,
  MapPin,
  Send,
  CheckCircle2,
  HelpCircle,
  ChevronDown,
  ChevronUp,
  Flame,
  MessageCircle,
} from 'lucide-react';
import { useEvent } from '../context/EventContext';

export const Contact: React.FC = () => {
  const { settings } = useEvent();
  const [form, setForm] = useState({
    nome: '',
    email: '',
    telefone: '',
    assunto: 'Dúvidas sobre Inscrição',
    mensagem: '',
  });

  const [submitted, setSubmitted] = useState(false);
  const [openFaq, setOpenFaq] = useState<number | null>(0);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.nome.trim() || !form.mensagem.trim()) return;

    setSubmitted(true);
    setTimeout(() => {
      setSubmitted(false);
      setForm({ nome: '', email: '', telefone: '', assunto: 'Dúvidas sobre Inscrição', mensagem: '' });
    }, 4000);
  };

  const faqs = [
    {
      q: 'Quem pode participar no THE VOICE LUNDA-SUL?',
      a: 'Todos os cidadãos residentes na província da Lunda-Sul (municípios de Saurimo, Cacolo, Dala e Muconda) com idade igual ou superior a 18 anos à data de inscrição.',
    },
    {
      q: 'A inscrição tem algum custo monetário?',
      a: 'Não! A inscrição no THE VOICE LUNDA-SUL é 100% gratuita para todos os candidatos.',
    },
    {
      q: 'Até quando posso submeter a minha candidatura?',
      a: 'O período oficial de inscrições decorre entre 13 de Setembro de 2026 e 09 de Novembro de 2026. Após esta data, a plataforma fecha automaticamente.',
    },
    {
      q: 'Como sei se fui seleccionado para a fase de audições presenciais?',
      a: 'Poderá consultar o estado a qualquer momento na Área do Candidato utilizando o seu código de inscrição (ex: TVLS-2026-001) ou o seu email. Os candidatos apurados também recebem aviso directo via WhatsApp e telefone.',
    },
    {
      q: 'Posso cantar em línguas nacionais como Cokwe ou Umbundu?',
      a: 'Sim, absolutamente! A valorização da identidade linguística e cultural angolana é um dos pilares do concurso.',
    },
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 pt-28 pb-20 space-y-16">
      {/* Header */}
      <div className="text-center space-y-4 max-w-3xl mx-auto">
        <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-sky-500/10 border border-sky-400/30 text-sky-300 text-xs font-bold uppercase tracking-wider">
          <Phone className="w-3.5 h-3.5 text-sky-400" />
          <span>Atendimento & Apoio</span>
        </div>
        <h1 className="text-3xl sm:text-5xl font-black text-white tracking-tight">
          Contactos da Organização
        </h1>
        <p className="text-slate-300 text-sm sm:text-base leading-relaxed">
          Tem alguma dúvida sobre o regulamento, processo de selecção ou patrocínios? A nossa equipa de apoio ao candidato está disponível.
        </p>
      </div>

      {/* Contacts & Form Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Contact Info Cards */}
        <div className="lg:col-span-5 space-y-6 text-left">
          <div className="p-6 rounded-3xl bg-slate-900/90 border border-sky-900/40 space-y-6 shadow-xl">
            <h3 className="text-xl font-bold text-white">Canais Oficiais</h3>

            <div className="space-y-4 text-xs sm:text-sm">
              <div className="flex items-start gap-3 p-3 rounded-2xl bg-slate-950/60 border border-slate-800">
                <MapPin className="w-5 h-5 text-rose-400 shrink-0 mt-0.5" />
                <div>
                  <strong className="text-white block">Sede da Organização:</strong>
                  <span className="text-slate-300">
                    {settings.contactos.localizacao}, {settings.contactos.municipio}, {settings.contactos.provincia}
                  </span>
                </div>
              </div>

              <div className="flex items-start gap-3 p-3 rounded-2xl bg-slate-950/60 border border-slate-800">
                <Phone className="w-5 h-5 text-sky-400 shrink-0 mt-0.5" />
                <div>
                  <strong className="text-white block">Telefone Directo:</strong>
                  <span className="text-slate-300">{settings.contactos.telefone}</span>
                </div>
              </div>

              <div className="flex items-start gap-3 p-3 rounded-2xl bg-slate-950/60 border border-slate-800">
                <Mail className="w-5 h-5 text-sky-400 shrink-0 mt-0.5" />
                <div>
                  <strong className="text-white block">Email Geral:</strong>
                  <span className="text-slate-300">{settings.contactos.email}</span>
                </div>
              </div>
            </div>

            {/* Direct WhatsApp CTA */}
            <div className="pt-2">
              <a
                href={`https://wa.me/${settings.contactos.whatsapp.replace(/[^0-9]/g, '')}`}
                target="_blank"
                rel="noreferrer"
                className="w-full py-3.5 rounded-2xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs flex items-center justify-center gap-2 shadow-lg shadow-emerald-600/30 transition-all"
              >
                <MessageCircle className="w-4 h-4" />
                <span>Conversar no WhatsApp Oficial</span>
              </a>
            </div>
          </div>
        </div>

        {/* Message Inquiry Form */}
        <div className="lg:col-span-7">
          <div className="p-6 sm:p-8 rounded-3xl bg-slate-900/90 border border-sky-900/40 shadow-xl space-y-6 text-left">
            <h3 className="text-xl font-bold text-white">Envie-nos uma Mensagem</h3>

            {submitted ? (
              <div className="p-8 rounded-2xl bg-emerald-950/60 border border-emerald-500/40 text-center space-y-3">
                <CheckCircle2 className="w-12 h-12 text-emerald-400 mx-auto" />
                <h4 className="text-lg font-bold text-white">Mensagem Enviada com Sucesso!</h4>
                <p className="text-xs text-slate-300 max-w-md mx-auto">
                  Agradecemos o seu contacto. A nossa equipa de apoio responderá com a maior brevidade possível através do seu email ou telefone.
                </p>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-1.5">
                    <label className="text-xs font-bold text-slate-300">O Seu Nome *</label>
                    <input
                      type="text"
                      required
                      placeholder="Nome completo"
                      value={form.nome}
                      onChange={(e) => setForm({ ...form, nome: e.target.value })}
                      className="w-full px-4 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-white text-xs focus:outline-none focus:border-sky-400"
                    />
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-xs font-bold text-slate-300">Email para Resposta</label>
                    <input
                      type="email"
                      placeholder="seuemail@exemplo.com"
                      value={form.email}
                      onChange={(e) => setForm({ ...form, email: e.target.value })}
                      className="w-full px-4 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-white text-xs focus:outline-none focus:border-sky-400"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-1.5">
                    <label className="text-xs font-bold text-slate-300">Telefone / WhatsApp</label>
                    <input
                      type="tel"
                      placeholder="+244 9..."
                      value={form.telefone}
                      onChange={(e) => setForm({ ...form, telefone: e.target.value })}
                      className="w-full px-4 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-white text-xs focus:outline-none focus:border-sky-400"
                    />
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-xs font-bold text-slate-300">Assunto</label>
                    <select
                      value={form.assunto}
                      onChange={(e) => setForm({ ...form, assunto: e.target.value })}
                      className="w-full px-4 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-white text-xs focus:outline-none focus:border-sky-400"
                    >
                      <option value="Dúvidas sobre Inscrição">Dúvidas sobre Inscrição</option>
                      <option value="Informações de Audição">Informações de Audição</option>
                      <option value="Patrocínios & Parcerias">Patrocínios & Parcerias</option>
                      <option value="Imprensa & Cobertura">Imprensa & Cobertura</option>
                      <option value="Outro">Outro</option>
                    </select>
                  </div>
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-slate-300">Mensagem *</label>
                  <textarea
                    required
                    rows={4}
                    placeholder="Escreva a sua mensagem ou questão..."
                    value={form.mensagem}
                    onChange={(e) => setForm({ ...form, mensagem: e.target.value })}
                    className="w-full px-4 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-white text-xs focus:outline-none focus:border-sky-400"
                  />
                </div>

                <button
                  type="submit"
                  className="w-full py-3.5 rounded-xl bg-gradient-to-r from-sky-500 to-blue-600 hover:from-sky-400 hover:to-blue-500 text-white font-bold text-xs uppercase tracking-wider shadow-lg shadow-sky-600/30 flex items-center justify-center gap-2"
                >
                  <Send className="w-4 h-4" />
                  <span>Enviar Mensagem</span>
                </button>
              </form>
            )}
          </div>
        </div>
      </div>

      {/* FAQ Section */}
      <div className="space-y-6 text-left">
        <div className="space-y-2">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-500/20 text-sky-300 text-xs font-bold uppercase tracking-wider">
            <HelpCircle className="w-3.5 h-3.5" />
            <span>Perguntas Frequentes</span>
          </div>
          <h3 className="text-2xl sm:text-3xl font-black text-white">
            Respostas às Dúvidas mais Comuns
          </h3>
        </div>

        <div className="space-y-3">
          {faqs.map((faq, idx) => {
            const isOpen = openFaq === idx;
            return (
              <div
                key={idx}
                className="rounded-2xl bg-slate-900 border border-slate-800 overflow-hidden transition-all"
              >
                <button
                  onClick={() => setOpenFaq(isOpen ? null : idx)}
                  className="w-full p-4 sm:p-5 flex items-center justify-between text-left hover:bg-slate-800/40 transition-colors"
                >
                  <span className="text-sm sm:text-base font-bold text-white">{faq.q}</span>
                  {isOpen ? (
                    <ChevronUp className="w-4 h-4 text-sky-400 shrink-0 ml-2" />
                  ) : (
                    <ChevronDown className="w-4 h-4 text-slate-400 shrink-0 ml-2" />
                  )}
                </button>
                {isOpen && (
                  <div className="px-5 pb-5 text-xs sm:text-sm text-slate-300 leading-relaxed border-t border-slate-800/60 pt-3">
                    {faq.a}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
