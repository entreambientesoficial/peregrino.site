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
- **Animações**: Framer Motion + react-pageflip (livro interativo em `/book`)
- **Ícones**: Lucide React
- **i18n**: Sistema próprio em `src/i18n.ts` — 10 idiomas, Context API, mesma lógica do app
- **Roteamento**: React Router v6 (`/` landing, `/book` editor do livro)
- **Deploy**: Cloudflare Pages (deploy automático a cada push no `main`)
- **Pagamentos**: Stripe (conta criada, chaves de teste em `.env`, Worker em `functions/`)
- **Design System**: Focado em tons terrosos (`#E8E4D9`, `#2D3A27`, `#1B2616`), texturas de ruído e topografia

---

## 🎨 Identidade Visual (Design Language)
- **Estética**: "Organic-Tactile"
- **Cores**: Bege areia, verde floresta profundo, sombras suaves, bordas muito arredondadas (`rounded-[3rem]`)
- **Texturas**: Uso de camadas de ruído (`bg-noise`) e mapas topográficos (`bg-topography`) para dar profundidade física
- **Micro-interações**: Efeito de elevação (hover) e revelação sequencial de conteúdo

---

## 📊 Status dos Componentes

### Landing Page (`/`)
| Componente | Status | Descrição Técnica |
| :--- | :--- | :--- |
| **HeroSection** | ✅ Concluído | Vídeo full-screen e botão de conversão funcional. Texto traduzido. |
| **DownloadModal** | ✅ Concluído | Fluxo PWA com detecção iOS/Android/Desktop. QR Code real (qrcode.react). |
| **FeaturesSection** | ✅ Concluído | Grid bento de 7 cards táteis. Texto traduzido. |
| **JourneySection** | ✅ Concluído | Efeito Baralho. 12 rotas reais. Indicador de progresso. Texto traduzido. |
| **BookSection** | ✅ Concluído | Vídeo em loop + frases animadas. Botão leva para `/book`. |
| **Footer** | ✅ Concluído | Logo, seletor de idioma inline (10 idiomas), links legais, copyright. |
| **Modais Legais** | ✅ Concluído | Termos de Uso, Privacidade (LGPD + GDPR) e Contato em PT-BR. |

### Editor do Livro (`/book`)
| Componente | Status | Descrição Técnica |
| :--- | :--- | :--- |
| **Step 1 — Revelação** | ✅ Concluído | Hero "Seu livro está pronto" + livro interativo com page-flip (react-pageflip, 12 páginas) |
| **Step 2 — Personalizar** | ✅ Concluído | Seleção de foto de capa + título editável com preview ao vivo |
| **Step 3 — Finalizar** | ✅ Concluído | Resumo do pedido + integração Stripe Checkout |
| **Login SSO** | ⚠️ Placeholder | Aguarda domínio + integração Supabase Auth |
| **Fotos reais** | ⚠️ Demo | Usa fotos das rotas como demo. Substituir por galeria do Supabase após SSO |
| **Cloudflare Worker** | ⚠️ Parcial | `functions/create-checkout.js` criado. Falta `STRIPE_SECRET_KEY` no painel Cloudflare |

---

## 🔄 Histórico de Alterações

### Sessão 17/04/2026 (tarde)

#### Página `/book` — Editor do Coffee Table Book
- Rota `/book` criada com React Router — mesmo repositório e deploy do site principal
- **Modelo B (automático)**: sistema monta o livro com os dados do app; usuário só aprova
- **Livro interativo**: `react-pageflip` com animação 3D realista de virada de página
  - 12 páginas: capa, folha de rosto, stats da jornada (fundo escuro), 8 fotos, contracapa
  - Responsivo: tamanho ajusta para mobile/tablet/desktop
  - Hint animado "Clique no livro para folhear" some após primeira interação
  - Botões prev/next + contador de páginas
- **3 etapas**: Revelação → Personalizar capa → Finalizar pedido
- `public/_redirects` adicionado para SPA routing no Cloudflare Pages
- Preço atual: **€49** (ajustado após análise de margem vs Lulu)

#### Decisões estratégicas do Coffee Table Book
- **Parceiro gráfico escolhido**: **Lulu.com** — API madura, envio global 140+ países, ~€25-30 custo de produção capa dura 50 pág.
- **Modelo de integração**: Modelo B automático — sistema gera PDF com fotos/dados do Supabase, envia via API Lulu, gráfica entrega direto ao cliente
- **Preço de lançamento**: €49 (margem ~€16-20 sobre custo de produção + frete)
- **Escalada**: após validar demanda → subir para €69-79 e migrar Stripe para Portugal (taxa 1.5% vs 3.99%)

#### Plataformas de monetização definidas
- **Stripe** → loja do site (livro + futuros produtos) — conta criada, modo teste ativo
- **Ko-fi** → doações dentro do app — zero taxa, zero mensalidade (conta ainda não criada)
- **Lulu.com** → produção e envio do livro — conta a criar quando domínio estiver definido

### Sessão 17/04/2026 (manhã)
- Fix crítico: `img-apoio/` movido para `public/` — imagens não apareciam em produção
- Stripe Worker (`functions/create-checkout.js`) criado
- Página `/sucesso` criada

### Sessão 16/04/2026
- Sistema multilíngue, DownloadModal PWA, Footer, otimização de mídia (-86MB), modais legais

---

## ⏳ Pendências

| # | Item | Detalhe | Prioridade |
|---|---|---|---|
| 1 | **Definir domínio** | Desbloqueia tudo abaixo | 🔴 Bloqueante |
| 2 | **↳ URLs definitivas** | Atualizar `https://peregrino.app` no modal PWA e no Stripe Worker | 🔴 Depende do domínio |
| 3 | **↳ Deep link App → Site** | Configurar no app URL final `?lang=xx` ao fim da jornada | 🔴 Depende do domínio |
| 4 | **↳ Deploy no domínio definitivo** | Apontar domínio para Cloudflare Pages | 🔴 Depende do domínio |
| 5 | **↳ Login SSO no `/book`** | Integrar Supabase Auth — substituir demo data pelos dados reais do peregrino | 🔴 Depende do domínio |
| 6 | **Configurar Stripe no Cloudflare** | Adicionar `STRIPE_SECRET_KEY` em Settings → Environment Variables no painel Cloudflare Pages | 🟠 Alta |
| 7 | **Conta Lulu.com** | Criar conta de desenvolvedor, testar API, definir produto (A4, 50 pág, capa dura) | 🟠 Alta |
| 8 | **Geração do PDF** | Backend que monta o PDF do livro com fotos/dados do Supabase e envia para API Lulu | 🟠 Alta |
| 9 | **Ko-fi** | Criar conta ko-fi.com para doações no app | 🟡 Média |
| 10 | **Tradução dos termos legais** | Atualmente só PT-BR. Adicionar EN quando projeto gerar receita | 🟢 Baixa |

---

## 📁 Estrutura de Arquivos Relevante

```
APP-PEREGRINO LANDING/
├── src/
│   ├── App.tsx                   ← React Router (/ e /book)
│   ├── LandingPage.tsx           ← Landing principal (todas as seções)
│   ├── BookPage.tsx              ← Editor do livro (/book) — 3 etapas + page-flip
│   └── i18n.ts                   ← Sistema multilíngue (10 idiomas, Context API)
├── public/
│   ├── img-apoio/
│   │   ├── card1 a card12 (.webp) ← Fotos das 12 rotas (WebP, otimizadas)
│   │   └── video-site-peregrino.mp4 ← Vídeo BookSection (2.9 MB)
│   ├── video-apoio/
│   │   └── 2.mp4                 ← Vídeo Hero (9.4 MB)
│   ├── sucesso.html              ← Página pós-pagamento Stripe
│   └── _redirects                ← SPA routing para Cloudflare Pages
├── functions/
│   └── create-checkout.js        ← Cloudflare Worker — cria sessão Stripe
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

*Última atualização: 17/04/2026 (tarde) — Sessão com Claude Sonnet 4.6*
