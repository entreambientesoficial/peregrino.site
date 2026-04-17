# 🏔️ Projeto: Peregrino Landing Page - Status Report

Este documento serve como a "Fonte da Verdade" para o estado atual do desenvolvimento da Landing Page do App Peregrino. Se este projeto for transferido para outra IA ou desenvolvedor, este arquivo deve ser lido integralmente primeiro.

## 🎯 Escopo do Projeto
Criar uma Landing Page de alto impacto (Premium/Editorial) para o aplicativo **Peregrino**. O objetivo é transmitir uma sensação de "Guia de Luxo" e "Diário de Viagem", focando em texturas orgânicas, tipografia elegante e interações fluidas baseadas em scroll (storytelling).

---

## 🏗️ Contexto Estratégico

O site tem **dois fluxos de entrada distintos**:

### Fluxo 1 — Aquisição (Google → Landing → PWA)
- Usuário encontra o site via busca orgânica
- Objetivo: converter em instalação do app via **PWA** (não App Store / Google Play)
- Modal de instalação implementado com detecção automática iOS/Android/Desktop
- Motivo do PWA: o app possui sistema de doação voluntária, incompatível com as políticas das lojas oficiais

### Fluxo 2 — Monetização (App → Landing → Compra do Livro)
- Peregrino usa o app durante toda a jornada
- Ao chegar em Santiago, o app exibe oferta do **Coffee Table Book**
- Ao clicar, é redirecionado para este site com deep link `?lang=xx`
- Objetivo: vender o livro impresso personalizado com fotos e carimbos do Caminho

### Ciclo completo
```
Google → Site → Instala App → Faz o Caminho → Volta ao Site → Compra o Livro
```

---

## 🛠️ Stack Tecnológica
- **Framework**: React.js (Vite)
- **Estilização**: Tailwind CSS (Customizado com texturas e sombras táteis)
- **Animações**: Framer Motion (`useScroll`, `useTransform`, `useMotionValueEvent`, `AnimatePresence`)
- **Ícones**: Lucide React
- **i18n**: Sistema próprio em `src/i18n.ts` — 10 idiomas, Context API, mesma lógica do app
- **Deploy**: Cloudflare Pages (deploy automático a cada push no `main`)
- **Pagamentos**: Stripe (conta criada, chaves de teste configuradas em `.env`)
- **Design System**: Focado em tons terrosos (`#E8E4D9`, `#2D3A27`, `#1B2616`), texturas de ruído e topografia

---

## 🎨 Identidade Visual (Design Language)
- **Estética**: "Organic-Tactile"
- **Cores**: Bege areia, verde floresta profundo, sombras suaves, bordas muito arredondadas (`rounded-[3rem]`)
- **Texturas**: Uso de camadas de ruído (`bg-noise`) e mapas topográficos (`bg-topography`) para dar profundidade física
- **Micro-interações**: Efeito de elevação (hover) e revelação sequencial de conteúdo

---

## 📊 Status dos Componentes

| Componente | Status | Descrição Técnica |
| :--- | :--- | :--- |
| **HeroSection** | ✅ Concluído | Vídeo full-screen e botão de conversão funcional. Texto traduzido. |
| **DownloadModal** | ✅ Concluído | Fluxo PWA com detecção iOS/Android/Desktop. QR Code real (qrcode.react). |
| **FeaturesSection** | ✅ Concluído | Grid bento de 7 cards táteis. Texto traduzido. |
| **JourneySection** | ✅ Concluído | Efeito Baralho. 12 rotas reais. Indicador de progresso. Texto traduzido. |
| **BookSection** | ✅ Concluído | Vídeo em loop + frases animadas rotativas. Botão conectado ao Cloudflare Worker. |
| **Footer** | ✅ Concluído | Logo, seletor de idioma inline (10 idiomas), links legais, copyright. |
| **Modais Legais** | ✅ Concluído | Termos de Uso, Privacidade (LGPD + GDPR) e Contato em PT-BR. |
| **Stripe Worker** | ⚠️ Parcial | `functions/create-checkout.js` criado. Falta: configurar `STRIPE_SECRET_KEY` no Cloudflare Dashboard e definir preço/produto final. |
| **Página /livro** | ❌ Não iniciado | Editor do livro — login SSO, galeria de fotos, escolha de layout, checkout. |

---

## 🔄 Histórico de Alterações

### Sessão 17/04/2026

#### Deploy — Cloudflare Pages
- Site deployado em **https://peregrino-site.pages.dev/**
- Deploy automático via GitHub (push no `main` → Cloudflare reconstrói)
- **Fix crítico**: `img-apoio/` movido para `public/img-apoio/` — imagens e vídeo da BookSection não apareciam em produção (Vite só inclui `public/` no build)

#### Stripe — conta criada e integração parcial
- Conta Stripe criada em nome de Anderson Del Arco (Brasil) — pessoa física, sem CNPJ
- Chaves de teste salvas em `.env` (nunca commitadas)
- `functions/create-checkout.js` criado — Cloudflare Worker que cria sessão de checkout
- `public/sucesso.html` criado — página de confirmação pós-pagamento
- Preço provisório: **€79** (a confirmar após pesquisa de custo de produção)
- **Pendente**: configurar variável `STRIPE_SECRET_KEY` no painel do Cloudflare Pages

#### Decisão estratégica — fluxo do Coffee Table Book
- O botão "Encomendar meu Livro" **não vai direto para o Stripe**
- Fluxo correto: botão → `/livro` (nova rota) → login SSO → editor → Stripe
- Parceiro gráfico a definir: **Prodigi** ou **Lulu.com** (ambos têm API, impressão sob demanda, envio global)
- Integração via API do parceiro: site monta o PDF → envia para gráfica → gráfica entrega ao peregrino
- Fase 1 (validação): rota `/livro` simples; Fase 2 (após receita): editor completo com fotos do Supabase

#### Plataformas de monetização definidas
- **Stripe** → loja do site (livro + futuros produtos) — taxa: 3.99% + R$0.39 (Brasil)
- **Ko-fi** → doações dentro do app — zero taxa, zero mensalidade
- Migração futura para Portugal (conta da filha) quando projeto gerar receita — taxa europeia: 1.5%

### Sessão 16/04/2026
- Sistema multilíngue (`src/i18n.ts`) — 10 idiomas, detecção em cascata
- DownloadModal reescrito para fluxo PWA
- Footer adicionado com seletor de idioma inline
- Otimização de mídia: 86MB removidos (imagens WebP -95%, vídeos recomprimidos -56%)
- Modais legais: Termos, Privacidade (LGPD+GDPR), Contato

---

## ⏳ Pendências

| # | Item | Detalhe | Prioridade |
|---|---|---|---|
| 1 | **Definir domínio** | Desbloqueia tudo abaixo | 🔴 Bloqueante |
| 2 | **↳ URLs definitivas** | Atualizar placeholder `https://peregrino.app` no modal PWA e no Stripe Worker | 🔴 Depende do domínio |
| 3 | **↳ Deep link App → Site** | Configurar no app URL final `?lang=xx#livro` ao fim da jornada | 🔴 Depende do domínio |
| 4 | **↳ Deploy no domínio definitivo** | Apontar domínio para Cloudflare Pages | 🔴 Depende do domínio |
| 5 | **Configurar Stripe no Cloudflare** | Adicionar `STRIPE_SECRET_KEY` em Settings → Environment Variables no painel Cloudflare Pages | 🟠 Alta |
| 6 | **Rota `/livro`** | Nova página: login SSO (Supabase) + galeria de fotos + editor + checkout Stripe | 🟠 Alta |
| 7 | **Definir parceiro gráfico** | Pesquisar Prodigi vs Lulu.com: preço de produção, qualidade, API, prazo de entrega | 🟠 Alta |
| 8 | **Definir preço do livro** | Baseado no custo de produção + margem. Provisório: €79 | 🟡 Média |
| 9 | **Ko-fi** | Criar conta ko-fi.com para doações no app | 🟡 Média |
| 10 | **Tradução dos termos legais** | Atualmente só PT-BR. Adicionar EN quando projeto gerar receita | 🟢 Baixa |

---

## 📁 Estrutura de Arquivos Relevante

```
APP-PEREGRINO LANDING/
├── src/
│   ├── LandingPage.tsx           ← Componente único com todas as seções
│   └── i18n.ts                   ← Sistema multilíngue (10 idiomas, Context API)
├── public/
│   ├── img-apoio/
│   │   ├── card1 a card12 (.webp) ← Fotos das 12 rotas (WebP, otimizadas)
│   │   └── video-site-peregrino.mp4 ← Vídeo BookSection (2.9 MB)
│   ├── video-apoio/
│   │   └── 2.mp4                 ← Vídeo Hero (9.4 MB)
│   └── sucesso.html              ← Página pós-pagamento Stripe
├── functions/
│   └── create-checkout.js        ← Cloudflare Worker — cria sessão Stripe
├── video-backups/                ← Backups dos vídeos originais (gitignored)
├── scripts/
│   ├── optimize-images.mjs       ← Converte PNG/JPG → WebP via sharp
│   └── optimize-videos.mjs       ← Recomprime MP4 via fluent-ffmpeg (CRF 28)
├── .env                          ← Chaves Stripe (NUNCA commitar — gitignored)
├── peregrino.md                  ← Guia de estética e princípios do projeto
└── status.md                     ← Este arquivo
```

---

## 🔗 Relação com o App Peregrino

- **Mesmo Supabase** — SSO planejado entre app e site (login único)
- **Mesma chave i18n** — `wp_locale` no localStorage compartilhada entre app e site
- **Deep link com idioma** — app deve passar `?lang=xx` ao redirecionar para o site
- **Tabela `photos`** — campo `print_url` já reservado no banco para uso futuro pelo site
- **Tabela `stamps`** — dados de etapas e rotas serão usados para personalizar o livro
- O app tem `STATUS.md` próprio em `c:\MEUS_PROJETOS\APP-PEREGRINO\peregrino\`

---

## 🔧 Problemas Conhecidos & Soluções

### Git pedindo autorização no GitHub a cada push
**Causa**: Claude Code injeta `--timeout 36000` no `credential.helper` + `credential.usehttppath=true` armazena credenciais por repositório em vez de por conta.
**Fix** (rodar uma vez no terminal):
```bash
git config --global credential.helper manager
git config --global --unset credential.usehttppath
```
Autorizar no browser uma última vez após o fix — token fica salvo permanentemente.

---

*Última atualização: 17/04/2026 — Sessão com Claude Sonnet 4.6*
