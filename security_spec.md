# Security Specification - THE VOICE LUNDA-SUL

## 1. System Invariants
- Candidates can register online during the active registration window.
- Candidate sensitive details (phone, full BI, WhatsApp, private notes) are secured and only accessible by authorized jury/admins, while public lookup is constrained by unique application code `TVLS-2026-XXXX`.
- Jury scores (`avaliacoes`) are confidential and strictly restricted to authorized jury members and administrators.
- Public visitors can view published news, confirmed competition stages, public gallery assets, and global event countdown/settings.
- Admin portal operations require verified role-based access (`Super Administrador`, `Administrador`, `Júri`, `Editor`).

## 2. Protected Collections
- `/candidatos/{candidatoId}`: Stores all candidate submission forms.
- `/noticias/{noticiaId}`: Stores official announcements, news items, and press releases.
- `/avaliacoes/{avaliacaoId}`: Stores jury ratings across the 6 vocal & artistic criteria.
- `/configuracoes/{configId}`: Stores the central dates, slogan, contacts, and rules.
- `/etapas/{etapaId}`: Stores the 8 competition phases and live progress.
- `/galeria/{galeriaId}`: Stores media items, gala photos, and audition videos.
