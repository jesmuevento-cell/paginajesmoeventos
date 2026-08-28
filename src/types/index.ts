export type CandidateStatus =
  | 'Recebida'
  | 'Em análise'
  | 'Aprovada'
  | 'Pré-seleccionada'
  | 'Eliminada'
  | 'Classificada'
  | 'Classificado'
  | 'Inscrito'
  | 'Pendente'
  | 'Em Avaliação'
  | 'Aprovado para Audição'
  | 'Rejeitado'
  | 'Vencedor';

export type UserRole =
  | 'Super Administrador'
  | 'Administrador'
  | 'Júri'
  | 'Editor'
  | 'Candidato'
  | 'Visitante';

export interface SocialLinks {
  instagram?: string;
  facebook?: string;
  youtube?: string;
  tiktok?: string;
}

export interface CandidateEvaluation {
  id: string;
  juriId: string;
  juriNome: string;
  tecnicaVocal: number;
  afinacao: number;
  presencaPalco: number;
  originalidade: number;
  interpretacao: number;
  potencialArtistico: number;
  comentarios?: string;
  notaGeral: number;
}

export interface Candidate {
  id: string;
  nomeCompleto: string;
  nomeArtistico: string;
  dataNascimento: string;
  idade: number;
  sexo: 'Masculino' | 'Feminino' | 'Outro';
  bi: string;
  telefone: string;
  whatsapp: string;
  email: string;
  provincia: string;
  municipio: string;
  bairro: string;
  generoMusical: string;
  experienciaMusical: string;
  instrumentos: string;
  experienciaPalco: string;
  redesSociais: SocialLinks;
  biografia: string;
  motivacao: string;
  fotoUrl: string;
  documentoUrl?: string;
  audioVideoUrl?: string;
  codigoInscricao: string;
  estado: CandidateStatus;
  etapaActual?: string;
  mensagensOrganizacao?: string[];
  notasAdmin?: string;
  avaliacoes?: CandidateEvaluation[];
  dataInscricao?: string;
  dataCriacao?: string;
  criadoEm?: string;
}

export interface NewsItem {
  id: string;
  titulo: string;
  resumo: string;
  conteudo: string;
  imagemUrl: string;
  autor: string;
  categoria: string;
  dataPublicacao: string;
  publicado: boolean;
  criadoEm?: string;
}

export type NewsArticle = NewsItem;

export interface Evaluation {
  id: string;
  candidatoId: string;
  juradoId: string;
  juradoNome: string;
  tecnicaVocal: number; // 0 - 10
  afinacao: number; // 0 - 10
  presencaPalco: number; // 0 - 10
  originalidade: number; // 0 - 10
  interpretacao: number; // 0 - 10
  potencialArtistico: number; // 0 - 10
  pontuacaoTotal: number; // 0 - 60
  media: number; // 0 - 10
  observacoes?: string;
  data: string;
}

export interface Stage {
  id: number;
  numero: number;
  nome: string;
  descricao: string;
  dataInicio: string;
  dataFim: string;
  estado: 'concluida' | 'ativa' | 'pendente' | 'proxima';
  detalhes?: string;
}

export interface GalleryItem {
  id: string;
  titulo: string;
  tipo: 'imagem' | 'video';
  url: string;
  thumbnail?: string;
  categoria: string;
  data?: string;
  descricao?: string;
}

export interface EventSettings {
  nomeEvento: string;
  slogan: string;
  dataInicioInscricoes: string; // ISO string: '2026-09-13T00:00:00'
  dataFimInscricoes: string; // ISO string: '2026-11-09T23:59:59'
  idadeMinima: number;
  inscricoesAbertas?: boolean;
  estadoInscricoes: 'automatica' | 'aberta' | 'encerrada';
  contactos: {
    telefone: string;
    whatsapp: string;
    email: string;
    localizacao: string;
    municipio: string;
    provincia: string;
  };
  redesSociais: {
    facebook: string;
    instagram: string;
    youtube: string;
    tiktok: string;
  };
  textoSobre: string;
  mensagemInspiradora: string;
}

export interface AdminUser {
  uid: string;
  email: string;
  nome: string;
  papel: UserRole;
  avatarUrl?: string;
  telefone?: string;
  municipio?: string;
  criadoEm?: string;
}

export interface AppUser {
  uid: string;
  email: string;
  nome: string;
  telefone?: string;
  municipio?: string;
  papel: UserRole;
  password?: string;
  avatarUrl?: string;
  criadoEm?: string;
}
