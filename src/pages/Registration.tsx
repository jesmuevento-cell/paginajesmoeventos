import React, { useState } from 'react';
import confetti from 'canvas-confetti';
import {
  User,
  Calendar,
  Phone,
  Mail,
  MapPin,
  Music,
  FileText,
  Upload,
  CheckCircle2,
  AlertCircle,
  Sparkles,
  Printer,
  Copy,
  Check,
  Flame,
  Camera,
  Radio,
  FileCheck,
  ArrowRight,
} from 'lucide-react';
import { useEvent } from '../context/EventContext';
import { Candidate } from '../types';
import { CountdownTimer } from '../components/CountdownTimer';

interface RegistrationProps {
  setCurrentTab: (tab: string) => void;
}

export const Registration: React.FC<RegistrationProps> = ({ setCurrentTab }) => {
  const { isRegistrationEnded, candidates, registerCandidate } = useEvent();

  // Form State
  const [formData, setFormData] = useState({
    nomeCompleto: '',
    nomeArtistico: '',
    dataNascimento: '',
    idade: 0,
    sexo: 'Feminino' as 'Masculino' | 'Feminino' | 'Outro',
    bi: '',
    telefone: '',
    whatsapp: '',
    email: '',
    provincia: 'Lunda-Sul',
    municipio: 'Saurimo',
    bairro: '',
    generoMusical: 'Semba',
    experienciaMusical: '1 a 3 anos',
    instrumentos: 'Voz',
    experienciaPalco: 'Sim, actuações comunitárias/coro',
    redesSociais: {
      instagram: '',
      facebook: '',
      youtube: '',
      tiktok: '',
    },
    biografia: '',
    motivacao: '',
    fotoUrl: '',
    documentoUrl: '',
    audioVideoUrl: '',
    declaracaoVerdadeira: false,
    aceitaTermos: false,
  });

  const [errors, setErrors] = useState<Record<string, string>>({});
  const [submitting, setSubmitting] = useState(false);
  const [createdCandidate, setCreatedCandidate] = useState<Candidate | null>(null);
  const [copied, setCopied] = useState(false);
  const [photoPreview, setPhotoPreview] = useState<string>('');

  // Auto calculate age
  const handleBirthdateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const bDate = e.target.value;
    if (!bDate) {
      setFormData((prev) => ({ ...prev, dataNascimento: '', idade: 0 }));
      return;
    }

    const birth = new Date(bDate);
    const today = new Date();
    let age = today.getFullYear() - birth.getFullYear();
    const m = today.getMonth() - birth.getMonth();
    if (m < 0 || (m === 0 && today.getDate() < birth.getDate())) {
      age--;
    }

    setFormData((prev) => ({
      ...prev,
      dataNascimento: bDate,
      idade: age >= 0 ? age : 0,
    }));

    if (age < 18) {
      setErrors((prev) => ({
        ...prev,
        idade: 'A idade mínima para participar é de 18 anos completos.',
      }));
    } else {
      setErrors((prev) => {
        const copy = { ...prev };
        delete copy.idade;
        return copy;
      });
    }
  };

  // Photo handler
  const handlePhotoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        const result = reader.result as string;
        setPhotoPreview(result);
        setFormData((prev) => ({ ...prev, fotoUrl: result }));
      };
      reader.readAsDataURL(file);
    }
  };

  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {};

    if (!formData.nomeCompleto.trim()) newErrors.nomeCompleto = 'Nome completo é obrigatório.';
    if (!formData.nomeArtistico.trim()) newErrors.nomeArtistico = 'Nome artístico é obrigatório.';
    if (!formData.dataNascimento) newErrors.dataNascimento = 'Data de nascimento é obrigatória.';
    if (formData.idade < 18) newErrors.idade = 'Candidato deve ter no mínimo 18 anos de idade.';

    if (!formData.bi.trim()) {
      newErrors.bi = 'Número do Bilhete de Identidade é obrigatório.';
    } else {
      // Check duplicate BI
      const biClean = formData.bi.trim().toLowerCase();
      const duplicateBi = candidates.some((c) => c.bi.toLowerCase() === biClean);
      if (duplicateBi) {
        newErrors.bi = 'Já existe uma inscrição com este número de Bilhete de Identidade.';
      }
    }

    if (!formData.telefone.trim()) newErrors.telefone = 'Telefone principal é obrigatório.';
    if (!formData.whatsapp.trim()) newErrors.whatsapp = 'Contacto de WhatsApp é obrigatório.';

    if (!formData.email.trim()) {
      newErrors.email = 'Email é obrigatório.';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = 'Insira um formato de email válido.';
    } else {
      // Check duplicate email
      const emailClean = formData.email.trim().toLowerCase();
      const duplicateEmail = candidates.some((c) => c.email.toLowerCase() === emailClean);
      if (duplicateEmail) {
        newErrors.email = 'Já existe uma inscrição associada a este endereço de email.';
      }
    }

    if (!formData.bairro.trim()) newErrors.bairro = 'Bairro ou endereço é obrigatório.';
    if (!formData.biografia.trim()) newErrors.biografia = 'Escreva uma breve biografia artística.';
    if (!formData.motivacao.trim()) newErrors.motivacao = 'Descreva a sua motivação para participar.';

    if (!formData.declaracaoVerdadeira) {
      newErrors.declaracaoVerdadeira = 'Deve declarar que as informações são verdadeiras.';
    }
    if (!formData.aceitaTermos) {
      newErrors.aceitaTermos = 'Deve aceitar os termos e condições do concurso.';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateForm()) {
      window.scrollTo({ top: 300, behavior: 'smooth' });
      return;
    }

    setSubmitting(true);
    try {
      // Default placeholder photo if not uploaded
      const finalPhoto =
        formData.fotoUrl ||
        (formData.sexo === 'Feminino'
          ? 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=600&auto=format&fit=crop&q=80'
          : 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=600&auto=format&fit=crop&q=80');

      const saved = await registerCandidate({
        ...formData,
        fotoUrl: finalPhoto,
      });

      setCreatedCandidate(saved);

      // Trigger celebration confetti
      try {
        confetti({
          particleCount: 100,
          spread: 70,
          origin: { y: 0.6 },
        });
      } catch (e) {
        // ignore
      }

      window.scrollTo({ top: 0, behavior: 'smooth' });
    } catch (err) {
      console.error(err);
      alert('Ocorreu um erro ao submeter a inscrição. Por favor tente novamente.');
    } finally {
      setSubmitting(false);
    }
  };

  const copyCode = () => {
    if (createdCandidate) {
      navigator.clipboard.writeText(createdCandidate.codigoInscricao);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const printReceipt = () => {
    window.print();
  };

  // SUCCESS CONFIRMATION SCREEN
  if (createdCandidate) {
    return (
      <div className="max-w-3xl mx-auto px-4 sm:px-6 pt-32 pb-20 text-center space-y-8">
        <div className="rounded-3xl bg-slate-900 border-2 border-emerald-500/50 p-8 sm:p-12 shadow-2xl shadow-emerald-500/10 space-y-6 relative overflow-hidden print-card">
          <div className="w-16 h-16 rounded-full bg-emerald-500/20 text-emerald-400 border border-emerald-400/40 flex items-center justify-center mx-auto">
            <CheckCircle2 className="w-10 h-10" />
          </div>

          <div className="space-y-2">
            <span className="text-xs font-bold text-emerald-400 uppercase tracking-widest">
              Inscrição Oficial Confirmada
            </span>
            <h2 className="text-2xl sm:text-4xl font-black text-white">
              Parabéns, {createdCandidate.nomeArtistico || createdCandidate.nomeCompleto}!
            </h2>
            <p className="text-slate-300 text-sm max-w-lg mx-auto">
              A sua candidatura ao <strong>THE VOICE LUNDA-SUL</strong> foi registada com sucesso na base de dados oficial.
            </p>
          </div>

          {/* Unique Code Card */}
          <div className="p-6 rounded-2xl bg-slate-950 border border-sky-500/40 max-w-md mx-auto space-y-2">
            <span className="text-xs text-sky-400 font-bold uppercase tracking-wider">
              O Seu Código Único de Inscrição:
            </span>
            <div className="flex items-center justify-center gap-3">
              <span className="text-2xl sm:text-3xl font-mono font-black text-white tracking-widest">
                {createdCandidate.codigoInscricao}
              </span>
              <button
                onClick={copyCode}
                className="p-2 rounded-lg bg-sky-600 hover:bg-sky-500 text-white transition-colors no-print"
                title="Copiar Código"
              >
                {copied ? <Check className="w-4 h-4 text-emerald-300" /> : <Copy className="w-4 h-4" />}
              </button>
            </div>
            <p className="text-[11px] text-slate-400">
              Guarde este código para consultar o estado da sua inscrição e convocações para audições.
            </p>
          </div>

          {/* Registration Details Summary */}
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 text-left p-4 rounded-xl bg-slate-950/60 border border-slate-800 text-xs">
            <div>
              <span className="text-slate-400 block">Nome Completo:</span>
              <span className="text-white font-semibold">{createdCandidate.nomeCompleto}</span>
            </div>
            <div>
              <span className="text-slate-400 block">Município:</span>
              <span className="text-white font-semibold">{createdCandidate.municipio}</span>
            </div>
            <div>
              <span className="text-slate-400 block">Género Musical:</span>
              <span className="text-white font-semibold">{createdCandidate.generoMusical}</span>
            </div>
            <div>
              <span className="text-slate-400 block">N.º do BI:</span>
              <span className="text-white font-semibold">{createdCandidate.bi}</span>
            </div>
            <div>
              <span className="text-slate-400 block">Telefone:</span>
              <span className="text-white font-semibold">{createdCandidate.telefone}</span>
            </div>
            <div>
              <span className="text-slate-400 block">Estado Inicial:</span>
              <span className="text-emerald-400 font-bold">{createdCandidate.estado}</span>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4 no-print">
            <button
              onClick={printReceipt}
              className="w-full sm:w-auto px-6 py-3 rounded-xl bg-slate-800 hover:bg-slate-700 text-white font-bold text-xs flex items-center justify-center gap-2 border border-slate-700"
            >
              <Printer className="w-4 h-4 text-sky-400" />
              <span>Imprimir Comprovativo</span>
            </button>

            <button
              onClick={() => {
                setCurrentTab('candidate-area');
                window.scrollTo({ top: 0, behavior: 'smooth' });
              }}
              className="w-full sm:w-auto px-8 py-3 rounded-xl bg-gradient-to-r from-sky-500 to-blue-600 hover:from-sky-400 hover:to-blue-500 text-white font-bold text-xs shadow-lg shadow-sky-600/30 flex items-center justify-center gap-2"
            >
              <span>Ir para Área do Candidato</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>
    );
  }

  // IF REGISTRATION CLOSED
  if (isRegistrationEnded) {
    return (
      <div className="max-w-4xl mx-auto px-4 sm:px-6 pt-32 pb-20 space-y-8 text-center">
        <CountdownTimer />
        <div className="p-8 rounded-3xl bg-slate-900 border border-red-500/40 space-y-4">
          <AlertCircle className="w-12 h-12 text-red-400 mx-auto" />
          <h2 className="text-2xl sm:text-3xl font-black text-white">
            As inscrições encontram-se encerradas.
          </h2>
          <p className="text-slate-300 text-sm max-w-xl mx-auto">
            O período oficial de inscrições para o THE VOICE LUNDA-SUL 2026 terminou. Pode consultar o estado de inscrições já realizadas na Área do Candidato.
          </p>
          <div className="pt-2">
            <button
              onClick={() => setCurrentTab('candidate-area')}
              className="px-6 py-3 rounded-xl bg-sky-600 hover:bg-sky-500 text-white font-bold text-xs"
            >
              Consultar Minha Inscrição
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 pt-28 pb-24 space-y-8">
      {/* Header */}
      <div className="text-center space-y-3">
        <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-sky-500/10 border border-sky-400/30 text-sky-300 text-xs font-bold uppercase tracking-wider">
          <Flame className="w-3.5 h-3.5 text-amber-400" />
          <span>Inscrições Oficiais 2026</span>
        </div>
        <h1 className="text-3xl sm:text-5xl font-black text-white tracking-tight">
          Formulário de Candidatura
        </h1>
        <p className="text-slate-300 text-sm sm:text-base max-w-xl mx-auto">
          Preencha com rigor os seus dados pessoais e artísticos. A inscrição é gratuita e aberta a maiores de 18 anos residentes na Lunda-Sul.
        </p>
      </div>

      {/* Countdown Timer */}
      <CountdownTimer compact />

      {/* Form Container */}
      <form
        onSubmit={handleSubmit}
        className="rounded-3xl bg-slate-900/90 border border-sky-900/50 p-6 sm:p-10 shadow-2xl space-y-10"
      >
        {/* SECÇÃO 1: DADOS PESSOAIS */}
        <div className="space-y-6">
          <div className="border-b border-slate-800 pb-3 flex items-center justify-between">
            <h3 className="text-lg sm:text-xl font-bold text-white flex items-center gap-2">
              <User className="w-5 h-5 text-sky-400" />
              1. Dados Pessoais
            </h3>
            <span className="text-xs text-sky-400/80 font-medium">Campos com * são obrigatórios</span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
            {/* Nome Completo */}
            <div className="sm:col-span-2 space-y-1.5 text-left">
              <label className="text-xs font-bold text-slate-300">Nome Completo *</label>
              <input
                type="text"
                placeholder="Ex: João Baptista Muangala"
                value={formData.nomeCompleto}
                onChange={(e) => setFormData({ ...formData, nomeCompleto: e.target.value })}
                className={`w-full px-4 py-3 rounded-xl bg-slate-950 border text-white text-sm focus:outline-none focus:ring-2 focus:ring-sky-400 transition-all ${
                  errors.nomeCompleto ? 'border-red-500 ring-1 ring-red-500' : 'border-slate-800'
                }`}
              />
              {errors.nomeCompleto && (
                <span className="text-xs text-red-400">{errors.nomeCompleto}</span>
              )}
            </div>

            {/* Data de Nascimento */}
            <div className="space-y-1.5 text-left">
              <label className="text-xs font-bold text-slate-300">Data de Nascimento *</label>
              <input
                type="date"
                value={formData.dataNascimento}
                onChange={handleBirthdateChange}
                max={new Date().toISOString().split('T')[0]}
                className={`w-full px-4 py-3 rounded-xl bg-slate-950 border text-white text-sm focus:outline-none focus:ring-2 focus:ring-sky-400 transition-all ${
                  errors.dataNascimento ? 'border-red-500' : 'border-slate-800'
                }`}
              />
              {errors.dataNascimento && (
                <span className="text-xs text-red-400">{errors.dataNascimento}</span>
              )}
            </div>

            {/* Idade (Calculada Automaticamente) */}
            <div className="space-y-1.5 text-left">
              <label className="text-xs font-bold text-slate-300">Idade Calculada</label>
              <div className="w-full px-4 py-3 rounded-xl bg-slate-950/60 border border-slate-800 text-slate-200 text-sm font-semibold flex items-center justify-between">
                <span>{formData.idade > 0 ? `${formData.idade} anos` : 'Aguardando data'}</span>
                {formData.idade >= 18 ? (
                  <span className="text-emerald-400 text-xs flex items-center gap-1 font-bold">
                    <CheckCircle2 className="w-4 h-4" /> Idade Elegível
                  </span>
                ) : formData.idade > 0 ? (
                  <span className="text-red-400 text-xs flex items-center gap-1 font-bold">
                    <AlertCircle className="w-4 h-4" /> Menor de 18
                  </span>
                ) : null}
              </div>
              {errors.idade && <span className="text-xs text-red-400">{errors.idade}</span>}
            </div>

            {/* Sexo */}
            <div className="space-y-1.5 text-left">
              <label className="text-xs font-bold text-slate-300">Sexo *</label>
              <select
                value={formData.sexo}
                onChange={(e) =>
                  setFormData({ ...formData, sexo: e.target.value as 'Masculino' | 'Feminino' | 'Outro' })
                }
                className="w-full px-4 py-3 rounded-xl bg-slate-950 border border-slate-800 text-white text-sm focus:outline-none focus:ring-2 focus:ring-sky-400"
              >
                <option value="Feminino">Feminino</option>
                <option value="Masculino">Masculino</option>
                <option value="Outro">Outro</option>
              </select>
            </div>

            {/* Número do BI */}
            <div className="space-y-1.5 text-left">
              <label className="text-xs font-bold text-slate-300">
                N.º do Bilhete de Identidade (BI) *
              </label>
              <input
                type="text"
                placeholder="Ex: 006741298LS042"
                value={formData.bi}
                onChange={(e) => setFormData({ ...formData, bi: e.target.value.toUpperCase() })}
                className={`w-full px-4 py-3 rounded-xl bg-slate-950 border text-white text-sm font-mono focus:outline-none focus:ring-2 focus:ring-sky-400 uppercase ${
                  errors.bi ? 'border-red-500' : 'border-slate-800'
                }`}
              />
              {errors.bi && <span className="text-xs text-red-400">{errors.bi}</span>}
            </div>

            {/* Telefone */}
            <div className="space-y-1.5 text-left">
              <label className="text-xs font-bold text-slate-300">Número de Telefone *</label>
              <input
                type="tel"
                placeholder="Ex: +244 923 112 334"
                value={formData.telefone}
                onChange={(e) => setFormData({ ...formData, telefone: e.target.value })}
                className={`w-full px-4 py-3 rounded-xl bg-slate-950 border text-white text-sm focus:outline-none focus:ring-2 focus:ring-sky-400 ${
                  errors.telefone ? 'border-red-500' : 'border-slate-800'
                }`}
              />
              {errors.telefone && <span className="text-xs text-red-400">{errors.telefone}</span>}
            </div>

            {/* WhatsApp */}
            <div className="space-y-1.5 text-left">
              <label className="text-xs font-bold text-slate-300">WhatsApp *</label>
              <input
                type="tel"
                placeholder="Ex: +244 923 112 334"
                value={formData.whatsapp}
                onChange={(e) => setFormData({ ...formData, whatsapp: e.target.value })}
                className={`w-full px-4 py-3 rounded-xl bg-slate-950 border text-white text-sm focus:outline-none focus:ring-2 focus:ring-sky-400 ${
                  errors.whatsapp ? 'border-red-500' : 'border-slate-800'
                }`}
              />
              {errors.whatsapp && <span className="text-xs text-red-400">{errors.whatsapp}</span>}
            </div>

            {/* Email */}
            <div className="sm:col-span-2 space-y-1.5 text-left">
              <label className="text-xs font-bold text-slate-300">Email Oficial *</label>
              <input
                type="email"
                placeholder="Ex: candidato@gmail.com"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                className={`w-full px-4 py-3 rounded-xl bg-slate-950 border text-white text-sm focus:outline-none focus:ring-2 focus:ring-sky-400 ${
                  errors.email ? 'border-red-500' : 'border-slate-800'
                }`}
              />
              {errors.email && <span className="text-xs text-red-400">{errors.email}</span>}
            </div>

            {/* Província */}
            <div className="space-y-1.5 text-left">
              <label className="text-xs font-bold text-slate-300">Província</label>
              <input
                type="text"
                value={formData.provincia}
                readOnly
                className="w-full px-4 py-3 rounded-xl bg-slate-950/60 border border-slate-800 text-slate-300 text-sm font-semibold cursor-not-allowed"
              />
            </div>

            {/* Município */}
            <div className="space-y-1.5 text-left">
              <label className="text-xs font-bold text-slate-300">Município *</label>
              <select
                value={formData.municipio}
                onChange={(e) => setFormData({ ...formData, municipio: e.target.value })}
                className="w-full px-4 py-3 rounded-xl bg-slate-950 border border-slate-800 text-white text-sm focus:outline-none focus:ring-2 focus:ring-sky-400"
              >
                <option value="Saurimo">Saurimo (Sede Provincial)</option>
                <option value="Cacolo">Cacolo</option>
                <option value="Dala">Dala</option>
                <option value="Muconda">Muconda</option>
              </select>
            </div>

            {/* Bairro ou Endereço */}
            <div className="sm:col-span-2 space-y-1.5 text-left">
              <label className="text-xs font-bold text-slate-300">Bairro ou Endereço Residencial *</label>
              <input
                type="text"
                placeholder="Ex: Bairro Txizainga II, Rua 4, Casa n.º 12"
                value={formData.bairro}
                onChange={(e) => setFormData({ ...formData, bairro: e.target.value })}
                className={`w-full px-4 py-3 rounded-xl bg-slate-950 border text-white text-sm focus:outline-none focus:ring-2 focus:ring-sky-400 ${
                  errors.bairro ? 'border-red-500' : 'border-slate-800'
                }`}
              />
              {errors.bairro && <span className="text-xs text-red-400">{errors.bairro}</span>}
            </div>
          </div>
        </div>

        {/* SECÇÃO 2: DADOS ARTÍSTICOS */}
        <div className="space-y-6">
          <div className="border-b border-slate-800 pb-3 flex items-center justify-between">
            <h3 className="text-lg sm:text-xl font-bold text-white flex items-center gap-2">
              <Music className="w-5 h-5 text-sky-400" />
              2. Dados Artísticos & Vocais
            </h3>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
            {/* Nome Artístico */}
            <div className="space-y-1.5 text-left">
              <label className="text-xs font-bold text-slate-300">Nome Artístico / Como gosta de ser chamado *</label>
              <input
                type="text"
                placeholder="Ex: Espie Muangala"
                value={formData.nomeArtistico}
                onChange={(e) => setFormData({ ...formData, nomeArtistico: e.target.value })}
                className={`w-full px-4 py-3 rounded-xl bg-slate-950 border text-white text-sm focus:outline-none focus:ring-2 focus:ring-sky-400 ${
                  errors.nomeArtistico ? 'border-red-500' : 'border-slate-800'
                }`}
              />
              {errors.nomeArtistico && (
                <span className="text-xs text-red-400">{errors.nomeArtistico}</span>
              )}
            </div>

            {/* Género Musical */}
            <div className="space-y-1.5 text-left">
              <label className="text-xs font-bold text-slate-300">Género Musical Principal *</label>
              <select
                value={formData.generoMusical}
                onChange={(e) => setFormData({ ...formData, generoMusical: e.target.value })}
                className="w-full px-4 py-3 rounded-xl bg-slate-950 border border-slate-800 text-white text-sm focus:outline-none focus:ring-2 focus:ring-sky-400"
              >
                <option value="Semba">Semba</option>
                <option value="Kizomba & Zouk">Kizomba & Zouk</option>
                <option value="Gospel">Gospel</option>
                <option value="R&B / Soul">R&B / Soul</option>
                <option value="Tradicional Cokwe / Regional">Tradicional Cokwe / Regional</option>
                <option value="Afrobeat / Afro-House">Afrobeat / Afro-House</option>
                <option value="Pop / Acústico">Pop / Acústico</option>
                <option value="Rap / Hip-Hop">Rap / Hip-Hop</option>
                <option value="Outro">Outro</option>
              </select>
            </div>

            {/* Tempo de Experiência */}
            <div className="space-y-1.5 text-left">
              <label className="text-xs font-bold text-slate-300">Tempo de Experiência Musical</label>
              <select
                value={formData.experienciaMusical}
                onChange={(e) => setFormData({ ...formData, experienciaMusical: e.target.value })}
                className="w-full px-4 py-3 rounded-xl bg-slate-950 border border-slate-800 text-white text-sm focus:outline-none focus:ring-2 focus:ring-sky-400"
              >
                <option value="Menos de 1 ano">Menos de 1 ano (Iniciante)</option>
                <option value="1 a 3 anos">1 a 3 anos</option>
                <option value="4 a 6 anos">4 a 6 anos</option>
                <option value="Mais de 6 anos">Mais de 6 anos (Experiente)</option>
              </select>
            </div>

            {/* Instrumentos */}
            <div className="space-y-1.5 text-left">
              <label className="text-xs font-bold text-slate-300">Instrumentos que sabe tocar</label>
              <input
                type="text"
                placeholder="Ex: Voz, Violão acústico, Teclado, etc."
                value={formData.instrumentos}
                onChange={(e) => setFormData({ ...formData, instrumentos: e.target.value })}
                className="w-full px-4 py-3 rounded-xl bg-slate-950 border border-slate-800 text-white text-sm focus:outline-none focus:ring-2 focus:ring-sky-400"
              />
            </div>

            {/* Experiência em Palco */}
            <div className="sm:col-span-2 space-y-1.5 text-left">
              <label className="text-xs font-bold text-slate-300">Experiência em Palco ou Actuações Anteriores</label>
              <input
                type="text"
                placeholder="Ex: Canto em coro da igreja, festivais escolares, actuações acústicas em bares..."
                value={formData.experienciaPalco}
                onChange={(e) => setFormData({ ...formData, experienciaPalco: e.target.value })}
                className="w-full px-4 py-3 rounded-xl bg-slate-950 border border-slate-800 text-white text-sm focus:outline-none focus:ring-2 focus:ring-sky-400"
              />
            </div>

            {/* Redes Sociais */}
            <div className="space-y-1.5 text-left">
              <label className="text-xs font-bold text-slate-300">Instagram (Opcional)</label>
              <input
                type="text"
                placeholder="@seuusuario"
                value={formData.redesSociais.instagram}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    redesSociais: { ...formData.redesSociais, instagram: e.target.value },
                  })
                }
                className="w-full px-4 py-3 rounded-xl bg-slate-950 border border-slate-800 text-white text-sm focus:outline-none focus:ring-2 focus:ring-sky-400"
              />
            </div>

            <div className="space-y-1.5 text-left">
              <label className="text-xs font-bold text-slate-300">Facebook / YouTube (Opcional)</label>
              <input
                type="text"
                placeholder="Link do perfil ou canal"
                value={formData.redesSociais.facebook}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    redesSociais: { ...formData.redesSociais, facebook: e.target.value },
                  })
                }
                className="w-full px-4 py-3 rounded-xl bg-slate-950 border border-slate-800 text-white text-sm focus:outline-none focus:ring-2 focus:ring-sky-400"
              />
            </div>

            {/* Biografia */}
            <div className="sm:col-span-2 space-y-1.5 text-left">
              <label className="text-xs font-bold text-slate-300">Breve Biografia Artística *</label>
              <textarea
                rows={3}
                placeholder="Conte-nos sobre a sua trajectória musical, as suas inspirações e estilo..."
                value={formData.biografia}
                onChange={(e) => setFormData({ ...formData, biografia: e.target.value })}
                className={`w-full px-4 py-3 rounded-xl bg-slate-950 border text-white text-sm focus:outline-none focus:ring-2 focus:ring-sky-400 ${
                  errors.biografia ? 'border-red-500' : 'border-slate-800'
                }`}
              />
              {errors.biografia && <span className="text-xs text-red-400">{errors.biografia}</span>}
            </div>

            {/* Motivação */}
            <div className="sm:col-span-2 space-y-1.5 text-left">
              <label className="text-xs font-bold text-slate-300">
                Motivação para Participar no THE VOICE LUNDA-SUL *
              </label>
              <textarea
                rows={3}
                placeholder="O que significa para si subir ao palco do THE VOICE e o que pretende alcançar com esta participação?"
                value={formData.motivacao}
                onChange={(e) => setFormData({ ...formData, motivacao: e.target.value })}
                className={`w-full px-4 py-3 rounded-xl bg-slate-950 border text-white text-sm focus:outline-none focus:ring-2 focus:ring-sky-400 ${
                  errors.motivacao ? 'border-red-500' : 'border-slate-800'
                }`}
              />
              {errors.motivacao && <span className="text-xs text-red-400">{errors.motivacao}</span>}
            </div>
          </div>
        </div>

        {/* SECÇÃO 3: UPLOAD DE FICHEIROS */}
        <div className="space-y-6">
          <div className="border-b border-slate-800 pb-3 flex items-center justify-between">
            <h3 className="text-lg sm:text-xl font-bold text-white flex items-center gap-2">
              <Camera className="w-5 h-5 text-sky-400" />
              3. Fotografia & Apresentação (Uploads)
            </h3>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            {/* Fotografia do Candidato */}
            <div className="space-y-3 text-left">
              <label className="text-xs font-bold text-slate-300">Fotografia de Rosto do Candidato</label>
              <div className="border-2 border-dashed border-sky-800/60 rounded-2xl p-4 flex flex-col items-center justify-center text-center bg-slate-950/40 hover:border-sky-500/60 transition-colors relative">
                {photoPreview ? (
                  <div className="space-y-2">
                    <img
                      src={photoPreview}
                      alt="Pré-visualização"
                      className="w-24 h-24 rounded-full object-cover mx-auto border-2 border-sky-400"
                    />
                    <label className="text-xs text-sky-400 hover:underline cursor-pointer font-bold block">
                      Trocar Fotografia
                      <input
                        type="file"
                        accept="image/*"
                        onChange={handlePhotoUpload}
                        className="hidden"
                      />
                    </label>
                  </div>
                ) : (
                  <label className="cursor-pointer space-y-2 flex flex-col items-center">
                    <Upload className="w-8 h-8 text-sky-400" />
                    <span className="text-xs text-slate-300 font-semibold">
                      Clique para seleccionar ou arraste a fotografia
                    </span>
                    <span className="text-[10px] text-slate-400">JPG, PNG ou WEBP (Max 5MB)</span>
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handlePhotoUpload}
                      className="hidden"
                    />
                  </label>
                )}
              </div>
            </div>

            {/* Link de Áudio ou Vídeo */}
            <div className="space-y-3 text-left">
              <label className="text-xs font-bold text-slate-300">
                Link de Apresentação Musical (YouTube, Drive ou TikTok)
              </label>
              <div className="space-y-2">
                <input
                  type="url"
                  placeholder="https://youtube.com/watch?v=... ou link do Google Drive"
                  value={formData.audioVideoUrl}
                  onChange={(e) => setFormData({ ...formData, audioVideoUrl: e.target.value })}
                  className="w-full px-4 py-3 rounded-xl bg-slate-950 border border-slate-800 text-white text-sm focus:outline-none focus:ring-2 focus:ring-sky-400"
                />
                <p className="text-[11px] text-slate-400 leading-relaxed">
                  Pode fornecer um link com um vídeo ou áudio seu a cantar para apoiar a fase inicial de pré-selecção.
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* SECÇÃO 4: TERMOS E DECLARAÇÃO */}
        <div className="space-y-4 pt-4 border-t border-slate-800 text-left">
          <div className="space-y-3">
            {/* Checkbox 1 */}
            <label className="flex items-start gap-3 cursor-pointer select-none">
              <input
                type="checkbox"
                checked={formData.declaracaoVerdadeira}
                onChange={(e) =>
                  setFormData({ ...formData, declaracaoVerdadeira: e.target.checked })
                }
                className="w-5 h-5 rounded border-slate-700 bg-slate-950 text-sky-500 focus:ring-sky-400 mt-0.5"
              />
              <span className="text-xs sm:text-sm text-slate-200">
                ☑ Declaro sob compromisso de honra que todas as informações fornecidas neste formulário são verdadeiras e correspondem à realidade.
              </span>
            </label>
            {errors.declaracaoVerdadeira && (
              <span className="text-xs text-red-400 block pl-8">
                {errors.declaracaoVerdadeira}
              </span>
            )}

            {/* Checkbox 2 */}
            <label className="flex items-start gap-3 cursor-pointer select-none">
              <input
                type="checkbox"
                checked={formData.aceitaTermos}
                onChange={(e) =>
                  setFormData({ ...formData, aceitaTermos: e.target.checked })
                }
                className="w-5 h-5 rounded border-slate-700 bg-slate-950 text-sky-500 focus:ring-sky-400 mt-0.5"
              />
              <span className="text-xs sm:text-sm text-slate-200">
                ☑ Aceito integralmente os regulamentos, termos e condições do concurso THE VOICE LUNDA-SUL.
              </span>
            </label>
            {errors.aceitaTermos && (
              <span className="text-xs text-red-400 block pl-8">{errors.aceitaTermos}</span>
            )}
          </div>
        </div>

        {/* SUBMIT BUTTON */}
        <div className="pt-4">
          <button
            type="submit"
            disabled={submitting}
            className="w-full py-4 rounded-2xl bg-gradient-to-r from-sky-500 via-blue-600 to-indigo-600 hover:from-sky-400 hover:to-blue-500 text-white font-black text-sm sm:text-base tracking-wider uppercase shadow-2xl shadow-sky-600/40 active:scale-95 disabled:opacity-50 transition-all flex items-center justify-center gap-3"
          >
            {submitting ? (
              <span>A Processar Inscrição...</span>
            ) : (
              <>
                <Sparkles className="w-5 h-5 text-amber-300" />
                <span>FINALIZAR INSCRIÇÃO</span>
              </>
            )}
          </button>
        </div>
      </form>
    </div>
  );
};
