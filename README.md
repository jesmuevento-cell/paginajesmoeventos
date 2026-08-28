# THE VOICE LUNDA-SUL 🎤🇦🇴

> *"Existimos para lhe motivar, produzimos para lhe entreter"*

Plataforma oficial do concurso musical **THE VOICE LUNDA-SUL** (Edição 2026).

---

## 🗄️ Base de Dados Firebase Firestore Integrada

O projeto está totalmente configurado e conectado com a base de dados **Cloud Firestore**:
- **Coleção `candidatos`**: Registo completo de candidaturas, BI, contactos e estados de aprovação.
- **Coleção `noticias`**: Publicações e comunicados de imprensa da organização.
- **Coleção `etapas`**: As 8 fases do concurso e cronogramas oficiais.
- **Coleção `avaliacoes`**: Notas técnicas e pareceres do corpo de jurados (0 a 10).
- **Coleção `galeria`**: Fotos e vídeos das audições e galas.
- **Coleção `configuracoes`**: Controlo de prazos e parâmetros gerais do evento.

---

## ⚡ Como Publicar na Vercel (Passo a Passo)

1. **Exportar para o GitHub**:
   - Faça push ou exporte o projeto para o seu repositório no GitHub.
2. **Aceder à Vercel**:
   - Entre no painel da [Vercel](https://vercel.com).
   - Clique em **Add New... > Project**.
   - Seleccione o repositório **paginajesmoeventos** (ou o seu repositório correspondente).
3. **Configurações de Build (Detectadas Automaticamente via `vercel.json`)**:
   - **Framework Preset**: `Vite`
   - **Build Command**: `npm run build`
   - **Output Directory**: `dist`
   - **Install Command**: `npm install`
4. Clique em **Deploy**. O deploy terminará com sucesso!

---

## 🚀 Como Publicar no GitHub Pages

1. No seu repositório GitHub, aceda a **Settings > Pages**.
2. Em **Build and deployment > Source**, seleccione **GitHub Actions**.
3. O workflow automático (`.github/workflows/deploy.yml`) fará a publicação automaticamente.

---

## 🛠️ Tecnologias
- **React 19** + **TypeScript**
- **Firebase Firestore** (Base de Dados em Nuvem em Tempo Real)
- **Vite** + **Tailwind CSS**
- **Lucide Icons** & **Canvas Confetti**
- Arquitetura pronta para **Vercel** e **GitHub Pages**
