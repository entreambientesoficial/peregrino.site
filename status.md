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
| **JourneySection** | ✅ Concluído | Efeito Baralho. 12 rotas reais. Indicador de progresso. Texto traduzido. Cards otimizados: 900px, WebP q80, média de -65% de peso. |
| **BookSection** | ✅ Concluído | Vídeo em loop + frases animadas. Botão leva para `/book`. |
| **Footer** | ✅ Concluído | Logo composta: `vieira.png` + texto "Peregrino" em Playfair Display 700 branco. Seletor de idioma inline (10 idiomas), links legais, copyright. |
| **Modais Legais** | ✅ Concluído | Termos de Uso, Privacidade (LGPD + GDPR) e Contato em PT-BR. |

### Editor do Livro (`/book`)
| Componente | Status | Descrição Técnica |
| :--- | :--- | :--- |
| **Header** | ✅ Concluído | Logo composta: `vieira.png` + "Peregrino" Playfair Display 700 branco. Botão voltar à landing. Botão "Sair" discreto (aparece apenas quando autenticado) que faz logout e reseta para DEMO. |
| **Step 1 — Revelação** | ✅ Concluído | Livro interativo + botão "Personalizar" + 3 cards de modelo clicáveis + botão "Encomendar" condicional (aparece após personalizar) + aviso de sem fotos (quando autenticado mas galeria vazia) |
| **3 Modelos de Livro** | ✅ Concluído | **Essencial** 50 pág. €49,90 · **Jornada** 100 pág. €74,90 (destaque) · **Legado** 150 pág. €99,90. Cada modelo gera dinamicamente o número correto de páginas via `generatePageDefs(modelPages)`. |
| **Step 2 — Personalizar** | ✅ Concluído | Seletor de modelo no topo + abas Capa / Textos / Fotos + "Ver resultado" volta ao Step 1 com `hasCustomized=true` |
| **Step 3 — Encomendar** | ✅ Concluído | Resumo dinâmico com nome, páginas e preço do modelo selecionado + Stripe Checkout |
| **Livro interativo** | ✅ Concluído | Estrutura dinâmica: capa + prefácio + N layouts fotográficos (50/100/150 conforme modelo) + selos + contracapa. `object-contain` nos layouts emoldurados (large-white, stacked-2, grid-4, stagger-4, trio-h/v) — fotos aparecem inteiras. `object-cover` mantido apenas em full-dark e panoramas (sangria intencional). |
| **Livro demo (sem login)** | ✅ Concluído | 89 fotos reais do Caminho em `public/img-apoio/img-webp/`. Reordenadas por orientação: landscape → slots panorama/stacked/centered, portrait → demais. Otimizadas: 1200px WebP q82, 22MB total. |
| **Atribuição manual de fotos** | ✅ Concluído | Aba Fotos do Step 2 redesenhada. Galeria + grid de slots do livro. Fluxo: clique numa foto → clique num slot = atribuição. Badge amarelo = manual; × remove; botão limpa tudo. `BookData.photoAssignments: Record<number,string>` sobrepõe o mapeamento automático. |
| **i18n do /book** | ✅ Concluído | 39 keys `bp.*` em 10 idiomas; capa usa nome da rota traduzido via `t('bp.demo.route')`; `I18nProvider` no `App.tsx` raiz |
| **Auth Gate + SSO** | ✅ Concluído | `AuthModal` com botão Google OAuth (Supabase `signInWithOAuth`) + formulário email/senha + bypass convidado. `onAuthStateChange` detecta login após redirect OAuth e carrega dados automaticamente. |
| **Dados reais do peregrino** | ✅ Concluído | `loadUserData` carrega `journeys`, `profiles`, `stamps` e `photos` em paralelo (`Promise.all`). Prioridade de rota: `journeys.route_id` → `profiles.route_id` → `stamps.route_id` → `'frances'`. km: `journeys.total_km` → `stamps.km_accumulated` → `0`. |
| **Assistente de Preenchimento** | ✅ Concluído | `GapModal` ao clicar "Ver resultado" quando `allPhotos.length < model.pages`. Opções: Upload (FileReader → Data URL, reabre modal se gap persiste) ou "Manter espaços em branco". |
| **Página de Selos** | ✅ Concluído | `displayCount = max(stampsCount, 28)` — nunca fica em branco. Selos reais mostram número; células extras exibem mock de local do Caminho (código + cidade + dia) usando `STAMP_PLACES[16]`. |
| **Cloudflare Worker** | ⚠️ Parcial | `functions/create-checkout.js` criado. Falta adicionar `STRIPE_SECRET_KEY` no painel Cloudflare Pages → Settings → Environment Variables. |

---

## 🔄 Histórico de Alterações

### Sessão 19/04/2026 — Opção C completa: object-contain + orientação + atribuição manual

#### Problema reportado
Fotos do livro apareciam cortadas (pés, rostos, pessoas pela metade) devido ao `object-fit: cover` que preenche o container sacrificando as bordas. Páginas duplas de panorama apareciam corretas mas layouts emoldurados prejudicavam fotos de orientação errada para o slot.

#### A) object-contain nos layouts emoldurados
- `large-white`, `stacked-2`, `grid-4-white`, `stagger-4`, `trio-h`, `trio-v`: mudado para `object-contain`
- Fotos aparecem inteiras, sem corte, com fundo neutro da página (creme/branco)
- Mantido `object-cover` em `full-dark`, `centered-dark`, `panorama-L/R` (sangria intencional)
- Helper `img()` recebe parâmetro `fit: 'cover' | 'contain'`; containers com `object-contain` recebem `bg-[#FDFCF8]` ou `bg-white` para fundo limpo

#### B) Fotos demo reordenadas por orientação
- Script Node analisou dimensões das 89 fotos: **57 portrait**, **32 landscape**
- Mapeou preferência de cada slot do `PHOTO_BLOCK`: panorama-L, centered-dark, stacked-2 = landscape; trio-v slot-0 = portrait; demais = any
- `DEMO_USER.allPhotos` reordenado para casar orientação foto↔slot sequencialmente
- Resultado: fotos landscape nos slots 5,6,7,8,10,20,21,36,37,39-42,44,45,47,48,63,64,66,76,77

#### C) Aba Fotos redesenhada — atribuição manual por slot
- **BookData**: novo campo `photoAssignments: Record<number, string>` (slotIdx → url)
- **renderBookPage**: `ph(n)` checa `photoAssignments[n]` antes do pool automático
- **UI — Galeria**: grid scrollável com todas as fotos; clique seleciona (badge ✓); clique duplo deseleciona
- **UI — Páginas**: grid de todos os slots do modelo atual (83 para Essencial); clique num slot quando foto selecionada = atribui; clique sem seleção = abre picker inline
- **Badge amarelo**: slots com atribuição manual têm × no canto; botão global "Remover todas" reseta
- Slots sem foto mostram ícone `Camera` placeholder
- Contador "X atribuídos" em tempo real

---

### Sessão 18/04/2026 (madrugada) — Fotos reais do Caminho + Otimização de assets

#### 89 fotos reais do Caminho de Santiago no livro demo
- Fotos baixadas de Unsplash/Pexels (licença comercial gratuita), temáticas do Caminho Francês
- Convertidas de JPG/PNG para WebP via `sharp-cli` pelo terminal do Antigravity (VS Code)
- Redimensionadas para **1200px de largura** (suficiente para telas Retina no livro interativo)
- Comprimidas em **WebP quality 82** — resultado: 178MB → 22MB (**-87%**)
- Salvas em `public/img-apoio/img-webp/1.webp` … `90.webp` (sem o 43, que não existia na origem)
- `DEMO_USER.allPhotos` atualizado com os 89 caminhos via `Array.from({ length: 90 }).filter(n !== 43).map(n => /img-apoio/img-webp/${n}.webp)`
- `DEMO_USER.photos` corrigido de `147` para `89`
- O modelo Essencial (50 pág.) tem 83 slots de foto — todos preenchidos com fotos únicas, zero repetição

#### Otimização dos 12 cards de rota (JourneySection)
- Cards estavam entre 103KB e 381KB, dimensões de até 1600×1200px
- Reprocessados para **900px de largura**, **WebP quality 80**
- Resultado: peso total de ~2.8MB → ~1MB (**-65%** em média)
- Maiores reduções: card1 (365→100KB, -73%), card10 (381→99KB, -74%), card6 (353→123KB, -65%)
- Script de otimização disponível em `scripts/optimize-cards.mjs`

#### Pasta de originais
- Fotos originais ficaram em `img-apoio/img-webp/` na raiz do projeto (fora de `public/`) — não servidas pelo Vite
- Podem ser deletadas com segurança para liberar espaço em disco; o site usa apenas as de `public/`

---

### Sessão 18/04/2026 (final) — 3 bugs críticos resolvidos definitivamente

#### Bug 1 — Fotos repetindo no livro (CORRIGIDO)
**Causa raiz**: `renderBookPage` usava `bookData.selectedPhotos` (máx 8–11 itens). Com o slotMap sequencial, slots acima de ~8 ficavam sem foto real e repetiam a última. Além disso, o pool de 11 era pequeno demais para um livro de 100+ páginas.
**Fix**: `const photos = bookData.allPhotos` — usa o pool completo incluindo uploads.

#### Bug 2 — Upload não re-perguntava quando gap persistia (CORRIGIDO)
**Causa raiz 1**: `totalAvailable = bookData.allPhotos.length + uploadedPhotos.length` contava uploads em dobro (allPhotos já os inclui após onChange).
**Causa raiz 2**: `handleUpload` chamava `setShowGapModal(false); onDone()` incondicionalmente após qualquer upload.
**Fix**: `totalAvailable = bookData.allPhotos.length`; no `handleUpload`, só avança se `newGap <= 0`; caso contrário mantém modal aberto com contagens atualizadas.

#### Bug 3 — Página de selos em branco para usuários com 0 selos (CORRIGIDO)
**Causa raiz**: `const total = bookData.stampsCount` → grid vazio quando stampsCount = 0.
**Fix**: `displayCount = Math.max(realCount, 28)` — renderiza mínimo 28 células; células reais mostram número, células extras mostram mock com cidade/código/dia do Caminho usando `STAMP_PLACES`.

---

### Sessão 18/04/2026 (noite, cont.) — Assistente de Preenchimento + Fix Jornada Ativa

#### Assistente de Preenchimento (`BookPage.tsx`)

**Problema**: livro repetia fotos automaticamente via `ph(n) = photos[n % photos.length]` quando o usuário tinha menos fotos do que slots no livro.

**Solução implementada**:
- `ph(n)` agora retorna `__stamp__:N` para índices além das fotos reais (sem modulo)
- Helper `img()` dentro de `renderBookPage`: renderiza `<img>` real ou **placeholder de Espaço para Carimbo** escalado com o fator `S` do livro
- Placeholder contém: cidade + dia do Caminho (lista de 16 locais reais: SJPP → SCQ), circle tracejado estilo credencial, linhas de notas
- Ao clicar **"Ver resultado"**, verifica gap = `model.pages − (allPhotos.length + uploadedPhotos.length)`
- Se gap > 0: abre **GapModal** informando quantas fotos faltam, com duas opções:
  - **Upload de Fotos**: FileReader → Data URL, adiciona a `allPhotos` + `uploadedPhotos`, auto-preenche `selectedPhotos` até 11 slots, avança
  - **Manter espaços para carimbos**: avança direto
- `StepOrder` mostra `photosCount + uploadedPhotos.length` no resumo

#### Fix Jornada Ativa — `loadUserData`

**Problema**: km exibia `DEMO_USER.km = 765` quando usuário não tinha stamps; rota ignorava a jornada ativa (tabela `journeys`).

**Solução**:
- Todas as queries agora em **paralelo** com `Promise.all` (profiles + journeys + stamps×2 + photos)
- Nova query: `journeys` → `route_id`, `total_km`, `started_at`, `finished_at`, `status`
- **Prioridade de `route_id`**: `journeys.route_id` → `profiles.route_id` → `stamps.route_id` → `'frances'`
- **Prioridade de km**: `journeys.total_km` → `stamps.km_accumulated` → `0` (bug do 765 eliminado)
- Datas mostram `'—'` se jornada não iniciada (em vez de datas fictícias do demo)
- Contagens de stamps/fotos retornam `0` para novo usuário (não os valores do demo)

---

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

### 🔴 Bloqueantes (precisam ser resolvidas primeiro)

| # | Item | Detalhe |
|---|---|---|
| 1 | **Definir domínio definitivo** | Desbloqueia todos os itens abaixo. Opções: `peregrino.app`, `peregrino.pt`, etc. |
| 2 | **↳ Atualizar URLs definitivas** | Após domínio: atualizar URL no modal PWA, no Stripe Worker (`create-checkout.js`) e no `OAUTH_REDIRECT_URL` do `BookPage.tsx` (atualmente usa `window.location.origin`) |
| 3 | **↳ Registar Redirect URL no Supabase** | Auth → URL Configuration → adicionar `https://[dominio]/book` na lista de Redirect URLs permitidas |
| 4 | **↳ Deploy no domínio definitivo** | Apontar DNS do domínio para Cloudflare Pages |
| 5 | **↳ Deep link App → Site** | No app Peregrino, ao fim da jornada exibir botão com URL `https://[dominio]/book?lang=xx` |

### 🟠 Alta prioridade (funcionalidade de venda)

| # | Item | Detalhe |
|---|---|---|
| 6 | **Configurar Stripe no Cloudflare** | Adicionar `STRIPE_SECRET_KEY` em Cloudflare Pages → Settings → Environment Variables. Worker `functions/create-checkout.js` já criado e aguarda a key. |
| 7 | **Conta Lulu.com** | Criar conta de desenvolvedor em lulu.com. Configurar 3 produtos (formato A4, 50/100/150 páginas, capa dura). Testar API de criação de pedido. |
| 8 | **Geração do PDF do livro** | Backend (Cloudflare Worker ou função serverless) que: (1) recebe pedido pós-Stripe, (2) busca fotos do Supabase, (3) monta PDF com os layouts do livro, (4) envia para API Lulu, (5) Lulu entrega direto ao cliente. Maior tarefa técnica do projeto. |

### 🟡 Média prioridade

| # | Item | Detalhe |
|---|---|---|
| 9 | **Foto de capa do demo** | A capa do livro demo usa `DEMO_USER.allPhotos[0]` = `1.webp`. Verificar se é uma foto de impacto suficiente; se não, reordenar as fotos ou apontar para uma mais representativa. |
| 10 | **Teste do fluxo completo pós-login** | Logar com conta real do app → verificar se fotos carregam, rota e km exibem corretos, livro monta sem erros no console. |
| 11 | **Ko-fi** | Criar conta ko-fi.com para sistema de doações dentro do app Peregrino. Zero taxa, zero mensalidade. |

### 🟢 Baixa prioridade

| # | Item | Detalhe |
|---|---|---|
| 12 | **Tradução dos termos legais** | Atualmente só PT-BR. Adicionar versão em EN quando o projeto começar a gerar receita. |
| 13 | **Limpar originais** | A pasta `img-apoio/img-webp/` na raiz do projeto (fora de `public/`) contém os JPGs originais das 89 fotos. Pode ser deletada para liberar ~180MB em disco sem impacto no site. |
| 14 | **Remover logs de debug** | `console.log('[Peregrino/photos]', ...)` e `console.log('Dados recuperados:', ...)` em `loadUserData` devem ser removidos antes do lançamento em produção. |

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
│   │   ├── card1 a card12 (.webp) ← 12 rotas — 900px, WebP q80, ~50-120KB cada
│   │   ├── img-webp/              ← 89 fotos do Caminho para o livro demo
│   │   │   └── 1.webp … 90.webp  ← (sem 43) — 1200px, WebP q82, total 22MB
│   │   ├── vieira.png             ← Emblema da concha (fundo transparente) — componente da logo
│   │   ├── logo-sf.png            ← Logo completa original (referência, não usada nas telas)
│   │   └── video-site-peregrino.mp4 ← Vídeo BookSection (~2.9 MB)
│   ├── video-apoio/
│   │   └── 2.mp4                 ← Vídeo Hero (~9.4 MB)
│   ├── sucesso.html              ← Página pós-pagamento Stripe
│   └── _redirects                ← SPA routing para Cloudflare Pages
├── functions/
│   └── create-checkout.js        ← Cloudflare Worker — cria sessão Stripe (aguarda STRIPE_SECRET_KEY)
├── scripts/
│   ├── optimize-images.mjs       ← Converte PNG/JPG → WebP via sharp
│   ├── optimize-videos.mjs       ← Recomprime MP4 via fluent-ffmpeg (CRF 28)
│   └── optimize-cards.mjs        ← Recomprime cards de rota para 900px/q80
├── img-apoio/img-webp/           ← ORIGINAIS (JPG/PNG das 89 fotos) — fora de public/, não servido
│                                    Pode ser deletado para liberar ~180MB em disco
├── .env                          ← Chaves Stripe (NUNCA commitar — gitignored)
├── peregrino.md                  ← Guia de estética e princípios do projeto
└── status.md                     ← Este arquivo
```

### Lógica central do livro (`BookPage.tsx`)

| Função/Componente | Responsabilidade |
|---|---|
| `PHOTO_BLOCK` | Array de 50 `PageDef` — template de layouts (single, grid-4, stagger-4, panorama, etc.) |
| `generatePageDefs(n)` | Repete `PHOTO_BLOCK` até atingir `n` páginas foto; adiciona capa, prefácio, selos, contracapa |
| `buildPhotoSlotMap(defs)` | Mapeia índice de página → array de índices sequenciais de foto (sem repetição) |
| `renderBookPage(def, idx, data, S, sp, fs, slotMap)` | Renderiza uma página; usa `data.allPhotos[slotMap[idx][k]]`; além do pool exibe placeholder de carimbo |
| `InteractiveBook` | Recebe `selectedModel`; computa `pageDefs` + `slotMap` via `useMemo`; renderiza `HTMLFlipBook` |
| `GapModal` | Modal que aparece quando `allPhotos.length < model.pages`; upload via FileReader; reabre se gap persiste |
| `loadUserData(userId)` | `Promise.all` para `journeys`, `profiles`, `stamps` (×2) e `photos`; prioridade de rota e km definida |

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

*Última atualização: 19/04/2026 — Sessão com Antigravity (Claude Sonnet 4.6)*
