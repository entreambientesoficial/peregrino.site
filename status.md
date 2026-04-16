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
| **LanguageSwitcher** | ✅ Concluído | Seletor flutuante no canto superior direito. 10 idiomas. |

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
- **LanguageSwitcher**: botão flutuante no canto superior direito com dropdown animado
- **Todos os textos traduzidos**: HeroSection, DownloadModal, FeaturesSection, JourneySection (título, labels, tags das 12 rotas), BookSection
- **Integração com app**: ao fazer deep link para o site, o app deve passar `?lang=xx` na URL — o site abre diretamente no idioma correto

---

## ⏳ Pendências

| # | Item | Detalhe | Prioridade |
|---|---|---|---|
| 1 | **Modal de Download → fluxo PWA** | Substituir botões "App Store / Google Play" por guia de instalação PWA (instruções separadas para iOS e Android) | 🔴 Alta |
| 2 | **Deep link para BookSection** | Definir URL/âncora para o app redirecionar direto na seção do livro ao final da peregrinação (ex: `seusite.com/?lang=pt-BR#livro`) | 🟡 Média |
| 3 | **Integração de pagamento** | Definir plataforma (Stripe, Hotmart, etc.) para o botão "Encomendar meu Livro" | 🟡 Média |
| 4 | **Deploy / domínio próprio** | Site ainda sem domínio definitivo. Necessário para configurar deep link do app | 🟡 Média |
| 5 | **Corte do vídeo na BookSection** | Vídeo ainda corta levemente na parte inferior em algumas telas. Investigar aspect ratio do vídeo ou adicionar `max-h` | 🟢 Baixa |

---

## 📁 Estrutura de Arquivos Relevante

```
APP-PEREGRINO LANDING/
├── src/
│   ├── LandingPage.tsx       ← Componente único com todas as seções
│   └── i18n.ts               ← Sistema multilíngue (10 idiomas, Context API)
├── img-apoio/
│   ├── card1 a card9         ← Fotos das rotas originais
│   ├── card10-caminho-portugues-lisboa.png
│   ├── card11-caminho-aragones.png
│   ├── card12-caminho-de-inverno.png
│   └── video-site-peregrino.mp4  ← Vídeo do Coffee Table Book (BookSection)
├── peregrino.md              ← Guia de estética e princípios do projeto
└── status.md                 ← Este arquivo
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

*Última atualização: 16/04/2026 — Sessão com Claude Sonnet 4.6*
