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
| **Nav Header** | ✅ Concluído | Header fixo com logo centralizada (gradient transparente sobre o hero). |
| **Footer** | ✅ Concluído | Logo `logo-sf.png` (substituiu texto), seletor de idioma inline (10 idiomas), links legais, copyright. |
| **Modais Legais** | ✅ Concluído | Termos de Uso, Privacidade (LGPD + GDPR) e Contato em PT-BR. |

### Editor do Livro (`/book`)
| Componente | Status | Descrição Técnica |
| :--- | :--- | :--- |
| **Step 1 — Revelação** | ✅ Concluído | Hero + livro 54 pág. + botão "Personalizar" + cards de modelo clicáveis + botão "Encomendar" condicional |
| **Step 2 — Personalizar** | ✅ Concluído | Seletor de modelo + abas Capa/Textos/Fotos + "Ver resultado" volta ao Step 1 |
| **Step 3 — Encomendar** | ✅ Concluído | Resumo dinâmico pelo modelo selecionado + Stripe Checkout |
| **Livro interativo** | ✅ Concluído | 54 páginas: capa, prefácio, 50 layouts fotográficos, selos dinâmicos, contracapa |
| **i18n do /book** | ✅ Concluído | 39 keys `bp.*` em 10 idiomas; capa usa nome da rota traduzido; I18nProvider no App raiz |
| **Login SSO** | ⚠️ Placeholder | Aguarda domínio + integração Supabase Auth |
| **Fotos reais** | ⚠️ Demo | Usa fotos das rotas como demo. Substituir por galeria do Supabase após SSO |
| **Cloudflare Worker** | ⚠️ Parcial | `functions/create-checkout.js` criado. Falta `STRIPE_SECRET_KEY` no painel Cloudflare |

---

## 🔄 Histórico de Alterações

### Sessão 18/04/2026 — Refactor UX do /book + i18n completo

#### Novo fluxo UX da página `/book`
O fluxo anterior tinha um único botão "Personalizar e encomendar" no final. O novo fluxo é:

1. **Revelar** → botão "Personalizar livro" logo abaixo do hint do livro
2. Os 3 cards de modelo (Essencial / Jornada / Legado) são **clicáveis** — selecionam o modelo e vão direto para Personalizar
3. **Personalizar** (Step 2) → seletor de modelo no topo + botão "Ver resultado" volta para Step 1 com `hasCustomized=true`
4. Step 1 com `hasCustomized=true` → botão **"Encomendar"** aparece
5. **Step 3** usa o modelo selecionado para exibir nome, páginas e preço corretos

#### Estados adicionados ao `BookPage` root
- `selectedModel: ModelId` (default `'journey'`)
- `hasCustomized: boolean` — controla visibilidade do botão Encomendar
- `BookData.route: string` — campo novo para o nome da rota (traduzível)

#### Correção crítica de i18n — idioma não respeitado na `/book`
**Causa raiz**: `I18nProvider` estava dentro do componente `LandingPage`. Ao navegar para `/book`, o contexto era descartado e tudo ficava em português.

**Correção**:
- `I18nProvider` movido para `App.tsx` (nível raiz — compartilhado entre todas as rotas)
- `LandingPage` não encapsula mais com `I18nProvider`
- `BookPage` importa e usa `useT()` em todos os componentes
- Botão "Voltar ao site" mudou de `<a href="/">` para `<Link to="/">` (React Router — sem reload)

#### Traduções do BookPage (src/i18n.ts)
Adicionadas **~39 keys** com prefixo `bp.*` para os 10 idiomas (PT-BR, PT-PT, EN, ES, FR, DE, IT, JA, KO, ZH-CN):
- UI completa: headline, botões, abas, labels dos formulários, resumo do pedido, badges
- `bp.demo.route` — nome da rota demo traduzido por idioma (ex: "The French Way" em EN, "Camino Francés" em ES)

#### Capa do livro agora respeita o idioma
- `DEFAULT_BOOK_DATA.title` era `"Caminho Francês, 2026"` hardcoded
- Agora o `useState` do `BookPage` inicializa o título e `bookData.route` usando `t('bp.demo.route')`
- `renderBookPage` usa `bookData.route` em todas as páginas internas (prefácio, `centered-dark`, `large-white`, selos)

---

### Sessão 17/04/2026 (noite) — Revisão do livro interativo

#### Melhorias visuais aplicadas na página `/book`
- Header: logo `logo-sf.png` substituindo texto; sem preço; sem barra de passos
- Título hero: "Seu livro está pronto." em linha única, fonte reduzida (`5xl/6xl`), padding superior compacto
- Subtítulo "Anderson · Caminho Francês" removido (já aparece na capa do livro)
- "48 páginas com os registros…" movido para abaixo do hint "Clique para abrir o livro"
- Tamanho do livro aumentado: desktop 440×587 (era 400×533)
- **Animação de abertura corrigida**: livro fechado e aberto agora são sempre montados (sem unmount/remount); transição é cross-fade por `opacity` + `scale` — sem o "piscada" que existia antes com `AnimatePresence mode="wait"`

#### Decisão de design acordada — nova estrutura do livro (~54 páginas)

O usuário forneceu um PDF de referência com 50 páginas de layouts fotográficos (templates reais do livro que será impresso). A nova estrutura acordada para o `BookPage.tsx` é:

| Pág. | Tipo | Conteúdo |
|------|------|----------|
| 0 | Capa | Foto + título (já existe) |
| 1 | Prefácio | Verso da capa + texto grande com todas as infos da jornada (rota, datas, km, dias, carimbos) — personalizável pelo usuário |
| 2–51 | Fotos | 50 layouts fotográficos conforme o PDF de referência |
| 52 | Selos | Página dinâmica com os carimbos da credencial (grid auto-ajustável por quantidade) |
| 53 | Contracapa | Verso final |

**Total: ~54 páginas** (número par, obrigatório para o `react-pageflip`).

#### Detalhes dos 50 layouts de foto (do PDF de referência)
Os layouts alternam entre: fotos panorâmicas página inteira (fundo escuro), grids 2×2, collages assimétricas, spreads duplos (foto cruzando a lombada), 2 fotos empilhadas, e combinações mistas. Espaços brancos nas margens servem para texto customizável.
Spreads duplos (foto panorâmica contínua): páginas 7–8, 23–24, 39–40.
Total de fotos no livro completo: ~90 fotos.

#### Selos (pág. 52) — dinâmico por rota
Renderiza grid de selos onde o tamanho da célula se ajusta automaticamente à quantidade (`DEMO_USER.stamps`). Rotas maiores (ex: Caminho Francês, 28+ selos) → células menores. Rotas menores → células maiores. Requer array `DEMO_USER.stampImages[]` (a definir).

#### Próxima sessão de código
Reescrever `PAGE_DEFS` e todos os `renderBookPage` cases para implementar os 50 layouts do PDF + prefácio + selos.

---

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

### Sessão 18/04/2026 (tarde) — Logo em header e footer

#### Logo `logo-sf.png` aplicada em todo o site
- `public/img-apoio/logo-sf.png` — arquivo copiado para a pasta pública (estava só em `img-apoio/` raiz)
- **Footer da Landing**: substituiu `<span>Peregrino</span>` pelo `<img>` com `filter: brightness(0) invert(1) opacity(0.85)` (logo toda branca no fundo escuro)
- **Header fixo da Landing (novo)**: adicionado `<header>` fixo no topo da LandingPage com logo centralizada sobre gradiente transparente `from-black/50 to-transparent` — visível sobre o vídeo hero
- **BookPage header**: já usava a logo com o mesmo filtro desde sessão anterior — sem alteração

#### Nota técnica — logo com concha colorida
Para ter o texto branco e a concha com as cores originais douradas, seria necessário:
- SVG vetorial com elementos separados (ideal), ou
- PNG exportado com fundo transparente e texto já branco
O PNG atual (fundo branco + texto vermelho-bordô) não permite recolorir elementos individualmente via CSS.

---

*Última atualização: 18/04/2026 — Sessão com Claude Sonnet 4.6*
