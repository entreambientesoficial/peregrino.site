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
| **Footer** | ✅ Concluído | Logo composta: `vieira.png` + texto "Peregrino" em Playfair Display 700 branco. Seletor de idioma inline (10 idiomas), links legais, copyright. |
| **Modais Legais** | ✅ Concluído | Termos de Uso, Privacidade (LGPD + GDPR) e Contato em PT-BR. |

### Editor do Livro (`/book`)
| Componente | Status | Descrição Técnica |
| :--- | :--- | :--- |
| **Header** | ✅ Concluído | Logo composta: `vieira.png` + "Peregrino" Playfair Display 700 branco. Botão voltar à landing. Botão "Sair" discreto (aparece apenas quando autenticado) que faz logout e reseta para DEMO. |
| **Step 1 — Revelação** | ✅ Concluído | Livro interativo 54 pág. + botão "Personalizar" + 3 cards de modelo clicáveis + botão "Encomendar" condicional (aparece após personalizar) + aviso de sem fotos (quando autenticado mas galeria vazia) |
| **3 Modelos de Livro** | ✅ Concluído | **Essencial** 50 pág. €49,90 · **Jornada** 100 pág. €74,90 (destaque) · **Legado** 150 pág. €99,90 — definidos em `BOOK_MODELS` no `BookPage.tsx` |
| **Step 2 — Personalizar** | ✅ Concluído | Seletor de modelo no topo + abas Capa / Textos / Fotos + "Ver resultado" volta ao Step 1 com `hasCustomized=true` |
| **Step 3 — Encomendar** | ✅ Concluído | Resumo dinâmico com nome, páginas e preço do modelo selecionado + Stripe Checkout |
| **Livro interativo** | ✅ Concluído | 54 páginas: capa (pág 0), prefácio (pág 1), 50 layouts fotográficos (págs 2–51), selos dinâmicos (pág 52), contracapa (pág 53) |
| **i18n do /book** | ✅ Concluído | 39 keys `bp.*` em 10 idiomas; capa usa nome da rota traduzido via `t('bp.demo.route')`; `I18nProvider` no `App.tsx` raiz |
| **Auth Gate + SSO** | ✅ Concluído | `AuthModal` com QR code (deep link para o app), botão Google OAuth (Supabase `signInWithOAuth`), bypass de convidado. `onAuthStateChange` detecta login após redirect OAuth e carrega dados automaticamente. |
| **Dados reais do peregrino** | 🔄 Integrado | `loadUserData` carrega `profiles`, `stamps` e `photos` do Supabase com dados reais. Fallback para DEMO_USER se tabelas vazias. Depuração ativa na query de fotos (`console.log` para diagnóstico no browser). |
| **Cloudflare Worker** | ⚠️ Parcial | `functions/create-checkout.js` criado. Falta `STRIPE_SECRET_KEY` no painel Cloudflare |

---

## 🔄 Histórico de Alterações

### Sessão 18/04/2026 (cont.) — Reestruturação do Login (AuthModal)

#### Fim da tentativa Cross-Device (QR Code)
**Contexto**: A verificação via polling (`getUser()`) checava apenas a sessão do browser do dispositivo atual (PC). O login do usuário via QR Code instanciaria a sessão no navegador do **celular**, impossibilitando qualquer cruzamento nativo direto pelo Supabase de forma confiável para o PC sem o envolvimento extra de um database intermitente.
**Decisão**: **Abandonar a abordagem Cross-Device (QR Code)** para manter a infraestrutura da LaunchPage leve e com redução de possíveis falhas. Adotamos o modelo clássico e robusto na própria aba, garantindo 100% de estabilidade de redirect no Supabase.

#### Refatoração do `AuthModal` (`BookPage.tsx`):
- **Botão Google em Destaque**: Agora a interface sugere de forma central o Single-Sign-On com Conta Google.
- **Formulário de E-mail/Senha**: Adicionado um submenu amigável para digitação de credenciais (direcionado a quem usa Hotmail, UOL, etc.), integrado via função customizada `EmailPasswordForm` que chama nativamente o método `signInWithPassword`.
- **Aviso Instrucional**: Adicionado de forma evidente no topo: *"Utilize a mesma conta do App Peregrino para carregar suas fotos automaticamente"*, educando o usuário da obrigatoriedade do sincronismo de base de dados.
- **Funcionamento Fluido Nativizado**: A própria janela do navegador recebe a sessão. Nisso, o `useEffect` nativo atrelado a `onAuthStateChange` resolve instantaneamente a lógica, extrai as informações fechando o `AuthModal` automaticamente e instanciando as fotos, mantendo a experiência do usuário excelente e sem quebras.

---

### Sessão 18/04/2026 (anteriormente) — OAuth Fix + QR Code correto + Polling + Produção no ar

#### Problema resolvido: tela branca em produção
**Causa**: variáveis `VITE_SUPABASE_URL` e `VITE_SUPABASE_ANON_KEY` não estavam configuradas no painel do Cloudflare Pages. O Vite injeta apenas variáveis com prefixo `VITE_` no bundle; sem elas, `createClient('', '')` lançava exceção e o React renderizava em branco.
**Fix**: adicionadas as variáveis em Cloudflare Pages → Settings → Environment Variables. Site voltou ao ar em `https://peregrino-site.pages.dev/`.

#### Problema resolvido: Google OAuth tentando abrir o app em vez do browser
**Causa**: `redirectTo` estava usando `window.location.origin` dinamicamente. A URL `http://localhost:5173/book` não estava na lista de Redirect URLs do Supabase (`/book` sem o path base não era coberto por `http://localhost:5173`), então o Supabase fazia fallback para o **Site URL** (`https://peregrino.pages.dev`) que tem PWA/Service Worker configurado, o que fazia o OS tentar abrir como app.

**Fix aplicado em `BookPage.tsx`**:
- `OAUTH_REDIRECT_URL` fixado em `'http://localhost:5173/book?auth_type=web'` (explícito, sem `window.location.origin`)
- Parâmetro `?auth_type=web` impede interceptação por deep link do app
- `skipBrowserRedirect: false` explícito no `signInWithOAuth`
- URL adicionada na lista de Redirect URLs do Supabase
- `console.log('Iniciando login OAuth para:', OAUTH_REDIRECT_URL)` adicionado antes do redirect para confirmação

#### QR Code corrigido — endpoint `/authorize` em vez de `/callback`
**Problema**: QR apontava para `/auth/v1/callback` (destino pós-login), que não inicia o fluxo OAuth.
**Fix**: QR agora aponta para o endpoint correto de início do fluxo:
```
${VITE_SUPABASE_URL}/auth/v1/authorize?provider=google&redirect_to=${encodeURIComponent(OAUTH_REDIRECT_URL)}
```
Ao escanear, o celular abre o browser → Google autentica → Supabase cria sessão → Polling no PC detecta.

#### Polling de 2s — detecta login via QR sem depender do onAuthStateChange cross-device
`onAuthStateChange` não dispara entre dispositivos diferentes (celular autenticou, PC não sabe). Solução: polling separado em `useEffect` dependente de `showAuthModal`:
- Roda `supabase.auth.getUser()` a cada **2 segundos** — somente quando o `AuthModal` está aberto
- Ao detectar usuário: fecha modal, chama `loadUserData()`, avança para Step "Personalizar"
- Cleanup automático: `clearInterval` quando modal fecha ou componente desmonta
- Logs: `[Auth/Polling]` no console para acompanhamento

#### Logging de auth aprimorado (`onAuthStateChange`)
- Evento `SIGNED_OUT` tratado separadamente (guard explícito)
- Todos os eventos logados: `[Auth] Evento recebido: SIGNED_IN | Usuário: email`
- Sessão existente (redirect pós-OAuth) logada: `[Auth] Sessão existente detectada...`

#### Logs de debug de fotos
- `console.log('Dados recuperados:', photos)` adicionado logo após a query de fotos em `loadUserData` — exibe o array bruto (mesmo que vazio `[]`)
- Log detalhado mantido: `[Peregrino/photos]` com `{ photos, photoCount, photosError, userId }`

---

### Sessão 18/04/2026 (noite) — Auth Gate + Dados Reais + Logout + Debug de Fotos

#### Auth Gate — `AuthModal` implementado em `BookPage.tsx`
O botão "Personalizar livro" agora é interceptado por `handleCustomize()`: se o utilizador não estiver autenticado, abre o `AuthModal` em vez de avançar para o Step 2.

O `AuthModal` contém:
- **QR Code** (`qrcode.react`) com deep link para o app Peregrino — para quem acede ao site no desktop e quer sincronizar com os dados do telemóvel
- **Botão Google OAuth** — `supabase.auth.signInWithOAuth({ provider: 'google', redirectTo: '/book' })`; após redirect, `onAuthStateChange` deteta automaticamente a sessão e avança para Step 2
- **Link "Continuar sem conta"** — fecha o modal e vai direto para Step 2 (modo convidado)
- Bottom-sheet no mobile, modal centralizado no desktop

#### Integração de dados reais — `loadUserData`
Após login, `loadUserData(userId)` executa queries reais no Supabase:
- `profiles` → `full_name`, `route_id`
- `stamps` (mais recente) → `km_accumulated`, `stamped_at` (data final)
- `stamps` (mais antigo) → `stamped_at` (data de início, para calcular duração)
- `photos` → `thumb_url`, `taken_at` DESC, limit 50

`BookData` foi expandido com campos reais: `userName`, `startDate`, `endDate`, `km`, `days`, `stampsCount`, `photosCount`, `allPhotos`. `DEFAULT_BOOK_DATA` usa `DEMO_USER` como fallback.

Mapeamento `route_id → chave i18n` cobre 12 rotas (frances, portugues, portugues_lisboa, costa, interior, primitivo, norte, ingles, aragones, plata, sanabres, inverno).

Skeleton de loading exibido no lugar do livro enquanto `dataLoading=true`.

#### Logout
- Botão "Sair" discreto no lado direito do header do `/book` — visível apenas quando `user !== null`
- `handleSignOut()`: chama `supabase.auth.signOut()`, reseta todos os estados para os valores DEMO, volta para Step 1

#### Depuração da query de fotos
- Destrutura `error: photosError` da query
- Adiciona `console.log('[Peregrino/photos]', { photos, photoCount, photosError, userId })` após a query — visível no console do browser para diagnóstico

#### UI de feedback — sem fotos
Quando o utilizador está autenticado, o carregamento terminou e `noPhotosWarning=true` (zero fotos na tabela), exibe banner discreto abaixo do livro:
> *"Não encontramos fotos na tua jornada. Usa o app para registar os teus momentos."*

---

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
- Header: logo composta (`vieira.png` + texto Playfair Display branco); sem preço; sem barra de passos
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
  - 54 páginas: capa, prefácio, 50 layouts fotográficos, selos, contracapa *(estrutura evoluída — ver sessão 17/04 noite)*
  - Responsivo: tamanho 440×587px desktop / proporcional mobile
  - Hint animado "Clique no livro para folhear" some após primeira interação
  - Botões prev/next + contador de páginas
- **3 etapas**: Revelação → Personalizar → Encomendar
- **3 modelos**: Essencial €49,90 / Jornada €74,90 / Legado €99,90
- `public/_redirects` adicionado para SPA routing no Cloudflare Pages

#### Decisões estratégicas do Coffee Table Book
- **Parceiro gráfico escolhido**: **Lulu.com** — API madura, envio global 140+ países
- **Modelo de integração**: Modelo B automático — sistema gera PDF com fotos/dados do Supabase, envia via API Lulu, gráfica entrega direto ao cliente
- **3 modelos de produto** (preços finais em vigor):
  | Modelo | Páginas | Preço | Custo estimado Lulu | Margem |
  |--------|---------|-------|---------------------|--------|
  | Essencial | 50 | €49,90 | ~€20–25 | ~€25 |
  | Jornada ⭐ | 100 | €74,90 | ~€30–35 | ~€40 |
  | Legado | 150 | €99,90 | ~€40–45 | ~€55 |
- **Escalada**: após validar demanda → migrar Stripe para Portugal (taxa 1.5% vs 3.99%)

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
| 5 | **↳ Login SSO no `/book`** | ~~Integrar Supabase Auth~~ — **Concluído**: AuthModal + Google OAuth + dados reais do Supabase integrados | ✅ Feito |
| 5b | **↳ Env vars no Cloudflare** | `VITE_SUPABASE_URL` e `VITE_SUPABASE_ANON_KEY` adicionadas em Settings → Environment Variables | ✅ Feito |
| 6 | **Configurar Stripe no Cloudflare** | Adicionar `STRIPE_SECRET_KEY` em Settings → Environment Variables no painel Cloudflare Pages | 🟠 Alta |
| 7 | **Conta Lulu.com** | Criar conta de desenvolvedor, testar API, configurar 3 produtos (A4, 50/100/150 pág, capa dura) | 🟠 Alta |
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
│   │   ├── vieira.png             ← Emblema da concha (fundo transparente) — componente da logo
│   │   ├── logo-sf.png            ← Logo completa original (referência, não usada nas telas)
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

### Sessão 18/04/2026 (tarde) — Logo final em footer e header do /book

#### Solução definitiva da logo
O `logo-sf.png` (fundo branco + texto vermelho) não permite recolorir só o texto via CSS. Solução adotada: **logo composta por dois elementos independentes**:

1. **`vieira.png`** — emblema da concha com fundo transparente, cores e textura originais intactas (dourado/creme + cruz de Santiago vermelho-bordô)
2. **Texto "Peregrino"** — renderizado em CSS com `font-family: 'Playfair Display'` weight 700, cor `#E8E4D9` (branco-areia) — mesma fonte usada no `logo-sf.png` original, já carregada via Google Fonts no `index.html`

#### Arquivos adicionados ao `public/`
- `public/img-apoio/vieira.png` — copiado de `img-apoio/` raiz; exceção adicionada no `.gitignore` (padrão `*.png` bloqueia essa pasta)
- `public/img-apoio/logo-sf.png` — mantido (referência, não mais usado nas telas)

#### Onde a logo aparece
| Local | Tamanho | Arquivo |
|---|---|---|
| Footer da Landing (`/`) | `h-12` vieira + `text-4xl` texto | `LandingPage.tsx` |
| Header do editor (`/book`) | `h-8` vieira + `text-2xl` texto | `BookPage.tsx` |
| Landing hero/nav | **Sem logo** — hero limpa conforme decisão de design | — |

#### Outros ajustes desta sessão
- Texto "Ultreia et Suseia" removido do footer (não faz parte da identidade visual exibida ao público)

---

*Última atualização: 18/04/2026 (tarde, cont.) — Sessão com Antigravity (Google DeepMind)*
