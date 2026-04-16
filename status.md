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
- Ao clicar, é redirecionado para este site (deep link para âncora `#livro` — a definir)
- Objetivo: vender o livro impresso personalizado com fotos e carimbos do Caminho

---

## 🛠️ Stack Tecnológica
- **Framework**: React.js (Vite)
- **Estilização**: Tailwind CSS (Customizado com texturas e sombras táteis)
- **Animações**: Framer Motion (`useScroll`, `useTransform`, `useMotionValueEvent`, `AnimatePresence`)
- **Ícones**: Lucide React
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
| **HeroSection** | ✅ Concluído | Vídeo full-screen e botão de conversão funcional. |
| **DownloadModal** | ✅ Concluído | Modal premium com backdrop-blur, botões de loja e QR Code (Desktop). **Pendente:** adaptar para fluxo PWA (ver pendências). |
| **FeaturesSection** | ✅ Concluído | Grid bento de cards táteis. |
| **JourneySection** | ✅ Concluído | Efeito Baralho (Card Deck). **12 rotas** reais com dados do GPX, fotos oficiais, scroll `h-[800vh]`. |
| **BookSection** | ✅ Concluído | Spreads de páginas com virar scroll-driven. 5 spreads contando a jornada do Caminho. |

---

## 🔄 Alterações da Sessão de 16/04/2026

### JourneySection — 12 rotas (era 9)
- Adicionadas 3 rotas que existem no app mas estavam faltando no site:
  - **Caminho Português (Lisboa)** — 625km, 25 etapas, foto `card10`
  - **Caminho Aragonês** — 166km, 6 etapas, foto `card11`
  - **Caminho de Inverno** — 269km, 10 etapas, foto `card12`
- Imagens `card10`, `card11`, `card12` adicionadas em `img-apoio/`
- Dados de km e etapas de **todas as 12 rotas** corrigidos para bater com os valores reais do GPX do app (`STATUS.md` do app, sessões 19 e 42)
- Caminho Sanabrês corrigido: ponto de partida "Granja de Moreruela" (não Zamora), 11 etapas, 340km
- Formato padronizado: "X etapas" em vez de "X a Y dias"
- Altura da seção ajustada: `h-[600vh]` → `h-[800vh]` para acomodar 12 cards

### BookSection — reescrita completa
- **Problema anterior:** animação CSS 3D com `rotateY` quebrava em Chrome/Safari por bug do `backfaceVisibility` sem prefixo webkit. Visual exibia "3 partes" do livro simultaneamente.
- **Solução adotada:** substituir CSS 3D por **spreads de páginas scroll-driven** (sem CSS 3D)
- **Como funciona:** livro sempre aberto (dois painéis lado a lado); conforme o usuário scrolla, as páginas trocam com animação slide+fade via `AnimatePresence`
- **5 spreads** narrando a jornada: A Partida → Dias de Chuva → A Meseta → O Cebreiro → A Chegada
- Cada spread: página esquerda (localização, data, texto do diário) + página direita (foto do Caminho)
- Indicador de progresso (dots + contador "1/5") abaixo do livro
- CTA ("Encomendar meu Livro") aparece apenas após o usuário ver todos os spreads
- `useMotionValueEvent` adicionado ao import do Framer Motion
- Header da seção convertido de `whileInView` para estático — `whileInView` dentro de `sticky` causava corte visual na transição entre seções

---

## ⏳ Pendências

| # | Item | Detalhe | Prioridade |
|---|---|---|---|
| 1 | **Modal de Download → fluxo PWA** | Substituir botões "App Store / Google Play" por guia de instalação PWA (instruções separadas para iOS e Android) | 🔴 Alta |
| 2 | **Deep link para BookSection** | Definir URL/âncora para o app redirecionar direto na seção do livro ao final da peregrinação (ex: `seusite.com/#livro`) | 🟡 Média |
| 3 | **Integração de pagamento** | Definir plataforma (Stripe, Hotmart, etc.) para o botão "Encomendar meu Livro" | 🟡 Média |
| 4 | **Deploy / domínio próprio** | Site ainda sem domínio definitivo. Necessário para configurar deep link do app | 🟡 Média |
| 5 | **Vídeo para BookSection** | Quando disponível, substituir os spreads por vídeo curto (5–15s) do livro sendo aberto — mais premium e emocional | 🟢 Baixa |

---

## 📁 Estrutura de Arquivos Relevante

```
APP-PEREGRINO LANDING/
├── src/
│   └── LandingPage.tsx       ← Componente único com todas as seções
├── img-apoio/
│   ├── card1 a card9         ← Fotos das rotas originais
│   ├── card10-caminho-portugues-lisboa.png
│   ├── card11-caminho-aragones.png
│   └── card12-caminho-de-inverno.png
├── peregrino.md              ← Guia de estética e princípios do projeto
└── status.md                 ← Este arquivo
```

---

## 🔗 Relação com o App Peregrino

- **Mesmo Supabase** — Single Sign-On planejado entre app e site
- **Tabela `photos`** — campo `print_url` já reservado no banco para uso futuro pelo site (Coffee Table Book)
- **Tabela `stamps`** — dados de etapas e rotas serão usados para personalizar o livro
- O app tem `STATUS.md` próprio em `c:\MEUS_PROJETOS\APP-PEREGRINO\peregrino\`

---

*Última atualização: 16/04/2026 — Sessão com Claude Sonnet 4.6*
