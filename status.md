# 🏔️ Projeto: Peregrino Landing Page - Status Report

Este documento serve como a "Fonte da Verdade" para o estado atual do desenvolvimento da Landing Page do App Peregrino. Se este projeto for transferido para outra IA ou desenvolvedor, este arquivo deve ser lido integralmente primeiro.

## 🎯 Escopo do Projeto
Criar uma Landing Page de alto impacto (Premium/Editorial) para o aplicativo **Peregrino**. O objetivo é transmitir uma sensação de "Guia de Luxo" e "Diário de Viagem", focando em texturas orgânicas, tipografia elegante e interações fluidas baseadas em scroll (storytelling).

---

## 🏗️ Contexto Estratégico (definido em 16/04/2026)

O site tem **dois fluxos de entrada distintos**:

### Fluxo 1 — Aquisição (Google → Landing → PWA)
- Usuário encontra o site via busca orgânica
- Objetivo: converter em instalação do app via **PWA** (não App Store / Google Play)
- O modal de download atual (com botões de loja) ainda precisa ser adaptado para um fluxo de instalação PWA
- Motivo do PWA: o app possui sistema de doação voluntária, incompatível com as políticas das lojas oficiais

### Fluxo 2 — Monetização (App → Landing → Compra do Livro)
- Peregrino usa o app durante toda a jornada
- Ao chegar em Santiago, o app exibe oferta do **Coffee Table Book**
- Ao clicar, é redirecionado para este site com deep link `?lang=xx` para abrir no idioma do usuário
- Objetivo: vender o livro impresso personalizado com fotos e carimbos do Caminho

---

## 🛠️ Stack Tecnológica
- **Framework**: React.js (Vite)
- **Estilização**: Tailwind CSS (Customizado com texturas e sombras táteis)
- **Animações**: Framer Motion (`useScroll`, `useTransform`, `useMotionValueEvent`, `AnimatePresence`)
- **Ícones**: Lucide React
- **i18n**: Sistema próprio em `src/i18n.ts` — 10 idiomas, Context API, mesma lógica do app
- **Design System**: Focado em tons terrosos (`#E8E4D9`, `#2D3A27`, `#1B2616`), texturas de ruído e topografia.

---

## 🎨 Identidade Visual (Design Language)
- **Estética**: "Organic-Tactile".
- **Cores**: Bege areia, verde floresta profundo, sombras suaves, bordas muito arredondadas (`rounded-[3rem]`).
- **Texturas**: Uso de camadas de ruído (`bg-noise`) e mapas topográficos (`bg-topography`) para dar profundidade física.
- **Micro-interações**: Efeito de elevação (hover) e revelação sequencial de conteúdo.

---

## 📊 Status dos Componentes

| Componente | Status | Descrição Técnica |
| :--- | :--- | :--- |
| **HeroSection** | ✅ Concluído | Vídeo full-screen e botão de conversão funcional. Texto traduzido. |
| **DownloadModal** | ✅ Concluído | Modal premium com backdrop-blur, botões de loja e QR Code (Desktop). Texto traduzido. **Pendente:** adaptar para fluxo PWA. |
| **FeaturesSection** | ✅ Concluído | Grid bento de 7 cards táteis. Texto traduzido. |
| **JourneySection** | ✅ Concluído | Efeito Baralho (Card Deck). 12 rotas reais. Scroll `h-[740vh]`. Indicador de progresso animado. Texto traduzido. |
| **BookSection** | ✅ Concluído | Vídeo do livro em loop com frases animadas rotativas. Texto traduzido. |
| **LanguageSwitcher** | ✅ Concluído | Movido para o Footer. Pills inline com todos os 10 idiomas. |
| **Footer** | ✅ Concluído | Logo, seletor de idioma inline (10 idiomas), links legais, copyright. |

---

## 🔄 Alterações da Sessão de 16/04/2026 (continuação)

### JourneySection — correções de UX
- **Espaço em branco após último card corrigido**: removido o card CTA que tinha sido excluído mas sua altura permanecia (`h-[800vh]` → `h-[740vh]`)
- **Último card nunca sai**: `SequentialCard` com `isLast=true` tem `y=0, opacity=1, scale=1` fixos — elimina espaço vazio definitivamente
- **Indicador de progresso adicionado**: dots animados (pill para o ativo) + contador `"X / 12"` abaixo do deck de cards, usando `useMotionValueEvent`

### BookSection — refinamentos
- BookSection substituída de spreads de página para **vídeo em loop** (`/img-apoio/video-site-peregrino.mp4`)
- Frases animadas rotativas (5 frases, troca a cada 3.2s com AnimatePresence) acima do vídeo
- Espaçamento da seção reduzido (`pt-8 pb-10`) para evitar corte do vídeo

### Sistema Multilíngue — implementado
- **Novo arquivo**: `src/i18n.ts` — 10 idiomas (pt-BR, pt-PT, es, en, fr, de, it, ja, ko, zh-CN)
- **Lógica de detecção** (em cascata): `?lang=xx` na URL → `localStorage` (chave `wp_locale`, mesma do app) → `navigator.language` → fallback `pt-BR`
- **Fonte CJK** carregada sob demanda via Google Fonts (Noto Sans JP/KR/SC) para ja/ko/zh-CN
- **LanguageSwitcher**: movido para o Footer como pills inline (sem dropdown)
- **Todos os textos traduzidos**: HeroSection, DownloadModal, FeaturesSection, JourneySection (título, labels, tags das 12 rotas), BookSection
- **Integração com app**: ao fazer deep link para o site, o app deve passar `?lang=xx` na URL — o site abre diretamente no idioma correto

### DownloadModal — reescrito para fluxo PWA
- Modal redesenhado para instalação do **app Peregrino via PWA** (não App Store / Play Store)
- Detecção automática de plataforma (iOS / Android / Desktop) via `navigator.userAgent`
- **iOS**: instruções passo a passo (Safari → Compartilhar → Adicionar à Tela de Início)
- **Android**: botão nativo `beforeinstallprompt` quando disponível + instruções manuais como fallback
- **Desktop**: QR Code real e escaneável (`qrcode.react`) apontando para a URL do app
- URL do app ainda usa placeholder `https://peregrino.app` — substituir quando domínio for definido

### Otimização de mídia — concluída
- **Imagens** (11 arquivos): PNG/JPG → WebP via `sharp`, max 1600px — 61 MB → 2.8 MB (**-95%**)
  - Script: `scripts/optimize-images.mjs` | Originais em: `img-apoio/originals/`
- **Vídeos ativos** recomprimidos via `fluent-ffmpeg` (CRF 28 / H.264):
  - Hero (`public/video-apoio/2.mp4`): 13.2 MB → 9.4 MB (-28%)
  - BookSection (`img-apoio/video-site-peregrino.mp4`): 14.7 MB → 2.9 MB (-80%)
  - Script: `scripts/optimize-videos.mjs` | Originais em: `video-backups/`
- **Vídeos não usados deletados**: `1.mp4` + `1_original.mp4` (28 MB removidos)
- **Economia total de mídia**: ~86 MB → site com ~15 MB de mídia total

---

## ⏳ Pendências

| # | Item | Detalhe | Prioridade |
|---|---|---|---|
| 1 | **Definir domínio — passo que desbloqueia tudo abaixo** | Quando o domínio estiver definido, executar os 3 itens seguintes em sequência | 🔴 Bloqueante |
| 2 | **↳ URL de download do app no modal** | Substituir placeholder do modal pelos links reais de download do app (iOS e Android). QR code já usa `https://peregrino.app` — trocar pela URL final em `LandingPage.tsx` no comentário `// TODO: trocar URL quando domínio for definido` | 🔴 Depende do domínio |
| 3 | **↳ Deep link App → Site (BookSection)** | Configurar no app a URL final para redirecionar o usuário ao site ao fim da jornada, com parâmetros `?lang=xx#livro`. A âncora `#livro` ainda precisa ser adicionada à BookSection | 🔴 Depende do domínio |
| 4 | **↳ Deploy do site** | Publicar o site no domínio definitivo (Vercel, Netlify ou similar) | 🔴 Depende do domínio |
| 5 | **Integração de pagamento** | Definir plataforma (Stripe, Hotmart, etc.) para o botão "Encomendar meu Livro" | 🟡 Média |
| 6 | **Páginas legais** | Links Termos de Uso, Privacidade e Contato no Footer apontam para `#` — criar páginas ou redirecionar para políticas externas | 🟢 Baixa |
| 7 | ~~**Corte do vídeo na BookSection**~~ | ✅ Resolvido — vídeo exibe corretamente após compressão (CRF 28). | ~~🟢 Baixa~~ |
| 8 | ~~**Páginas legais**~~ | ✅ Resolvido — modais de Termos de Uso, Privacidade (LGPD + GDPR) e Contato implementados. Texto em PT-BR. Tradução adiada para quando houver receita. | ~~🟢 Baixa~~ |

---

## 📁 Estrutura de Arquivos Relevante

```
APP-PEREGRINO LANDING/
├── src/
│   ├── LandingPage.tsx           ← Componente único com todas as seções
│   └── i18n.ts                   ← Sistema multilíngue (10 idiomas, Context API)
├── public/
│   └── video-apoio/
│       └── 2.mp4                 ← Vídeo do Hero (9.4 MB, otimizado)
├── img-apoio/
│   ├── card1 a card12 (.webp)    ← Fotos das 12 rotas (WebP, otimizadas)
│   ├── video-site-peregrino.mp4  ← Vídeo do Coffee Table Book (2.9 MB, otimizado)
│   └── originals/                ← Backups das imagens originais (PNG/JPG)
├── video-backups/                ← Backups dos vídeos originais (MP4 não comprimidos)
├── scripts/
│   ├── optimize-images.mjs       ← Converte PNG/JPG → WebP via sharp
│   └── optimize-videos.mjs       ← Recomprime MP4 via fluent-ffmpeg (CRF 28)
├── peregrino.md                  ← Guia de estética e princípios do projeto
└── status.md                     ← Este arquivo
```

---

## 🔗 Relação com o App Peregrino

- **Mesmo Supabase** — Single Sign-On planejado entre app e site
- **Mesma chave i18n** — `wp_locale` no localStorage compartilhada entre app e site
- **Deep link com idioma** — app deve passar `?lang=xx` ao redirecionar para o site
- **Tabela `photos`** — campo `print_url` já reservado no banco para uso futuro pelo site (Coffee Table Book)
- **Tabela `stamps`** — dados de etapas e rotas serão usados para personalizar o livro
- O app tem `STATUS.md` próprio em `c:\MEUS_PROJETOS\APP-PEREGRINO\peregrino\`

---

---

## 🔧 Problemas Conhecidos & Soluções

### Git pedindo autorização no GitHub a cada push
**Sintoma**: O Git Credential Manager abre o browser pedindo "Authorize git-ecosystem" em todo push.  
**Causa**: O Claude Code injeta `--timeout 36000` no `credential.helper`, argumento inválido que impede o GCM de salvar o token.  
**Fix** (rodar uma vez no terminal):
```bash
git config --global credential.helper manager
```
Depois disso, autorizar no browser **uma última vez** — o token fica salvo permanentemente.

---

## ▶️ Próxima Sessão

Criar as contas necessárias para o deploy:
1. **Domínio** — definir e registrar o domínio definitivo
2. **Stripe** — criar conta em stripe.com (gratuito, sem mensalidade)
3. **Ko-fi** — criar conta em ko-fi.com para doações no app (gratuito)
4. Com o domínio em mãos: configurar URLs no modal, deep link do app, deploy e integração Stripe

---

*Última atualização: 16/04/2026 (noite) — Sessão com Claude Sonnet 4.6*
