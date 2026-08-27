# THE VOICE LUNDA-SUL 🎤🇦🇴

> *"Existimos para lhe motivar, produzimos para lhe entreter"*

Plataforma oficial do concurso musical **THE VOICE LUNDA-SUL** (Edição 2026).

---

## 🚀 Como Publicar e Ativar no GitHub Pages

Este projecto já está totalmente configurado para publicação automática no **GitHub Pages** através de GitHub Actions.

### Passo 1: Exportar para o GitHub
1. No menu superior ou de configurações do AI Studio / Editor, seleccione **Export to GitHub** (ou envie o código para o seu repositório GitHub).

### Passo 2: Activar o GitHub Pages no Repositório
1. No GitHub, abra a página do seu repositório.
2. Clique no separador **Settings** (Configurações) no topo.
3. No menu lateral esquerdo, clique em **Pages**.
4. Em **Build and deployment > Source**, seleccione **GitHub Actions**.
5. Faça um `git push` para a branch `main` ou `master` (ou execute manualmente em **Actions > Deploy to GitHub Pages > Run workflow**).

O seu site estará online em poucos minutos no endereço:
`https://<seu-utilizador>.github.io/<nome-do-repositorio>/`

---

## 🛠️ Tecnologias Utilizadas
- **React 19** + **TypeScript**
- **Vite** com suporte para caminhos relativos no GitHub Pages (`base: './'`)
- **Tailwind CSS**
- **Lucide Icons**
- **Firebase Firestore** com fallback seguro em LocalStorage
- **GitHub Actions** (`.github/workflows/deploy.yml`) para CI/CD automático

---

## 📋 Funcionalidades Principais
- 📝 **Inscrições Oficiais**: Formulário completo com validação de BI angolano, fotos e municípios da Lunda-Sul (*Saurimo, Cacolo, Dala, Muconda*).
- 🔍 **Portal do Candidato**: Consulta do estado da candidatura por código (ex: `TVLS-2026-001`), comunicados e impressão de comprovativo.
- 🏆 **Mural de Prémios & Regulamento**: Detalhes dos prémios para o 1.º, 2.º e 3.º lugares e cronograma oficial das 8 fases.
- ⚖️ **Painel Administrativo & Júri**: Gestão de inscritos, atribuição de notas técnicas nos 6 critérios e exportação em CSV.
