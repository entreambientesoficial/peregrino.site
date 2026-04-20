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
| **Step 2 — Personalizar** | ✅ Concluído | Seletor de modelo no topo + abas Capa / Textos / Fotos + "Ver resultado" volta ao Step 1 com `hasCustomized=true`. Aba Textos inclui seção "Textos das páginas" com editor por página. |
| **Textos por página** | ✅ Concluído | Campos opcionais de texto nos layouts `large-white`, `stacked-2` e `grid-4-white` (topo e rodapé). Cada campo tem seletor de tipologia (5 fontes) e tamanho (PP/P/M/G/GG). Texto vazio = página renderiza sem texto. |
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

### Sessão 20/04/2026 (cont.) — CTA livro no app + Modal PWA corrigido e simplificado

#### Deep link app → site (item 5 ✅)

CTA "Transforme sua jornada num livro" adicionado ao **modal de chegada** do app (`PilgrimsPath.js`).

- Aparece entre a Credencial Digital e o botão Fechar
- Link: `https://meuperegrino.com/book?lang=${getLocale()}` — idioma do app transmitido via query string
- Estilo: botão verde escuro (`#343c0a → #4b5320`) com ícone `auto_stories` e seta
- Ativado automaticamente quando o peregrino completa todos os estágios da rota
- `getLocale()` importado de `src/i18n/index.js` — já existia no app, zero dependência nova

**Repo afetado:** `entreambientesoficial/Peregrino` — commit `f064c33`

#### Modal PWA — correção de lógica + simplificação

**Problema identificado**: passo 1 do modal dizia "Abra esta página" — instalaria o site de marketing (`meuperegrino.com`) e não o app (`app.meuperegrino.com`).

**Correções aplicadas (`src/i18n.ts`):**
Passo 1 atualizado nos **10 idiomas** para referenciar `app.meuperegrino.com` explicitamente:
- PT-BR: `Acesse app.meuperegrino.com no Safari/Chrome`
- PT-PT: `Acede a app.meuperegrino.com no Safari/Chrome`
- EN: `Open app.meuperegrino.com in Safari/Chrome`
- ES/FR/DE/IT/JA/KO/ZH-CN: idem, traduzido

**Simplificação do modal (`src/LandingPage.tsx`):**

| Dispositivo | Antes | Depois |
|---|---|---|
| Mobile | 4 passos manuais + botão "Abrir o App" | Só botão grande "Abrir o App" → `app.meuperegrino.com` |
| Desktop | 4 passos + QR Code | Igual (passos + QR Code — necessário para quem está no PC) |

Lógica: utilizador no celular não precisa de passos — um toque no botão abre o app diretamente.
QR Code (desktop) e passos (desktop) mantidos para quem acessa o site no computador.
TODO do QR Code removido — domínio definitivo já configurado.

---

### Sessão 20/04/2026 (cont.) — Step de endereço de entrega + decisão de frete

#### Novo step: Endereço de entrega (`StepShipping`)

Fluxo de compra reestruturado em 4 etapas dentro do site:

```
Step 1 — Revelar livro
Step 2 — Personalizar
Step 3 — Resumo do pedido  (StepOrder)
Step 4 — Endereço de entrega  (StepShipping) ← NOVO
    ↓
Stripe Checkout — apenas dados do cartão
```

**Motivação**: endereço de entrega e dados de pagamento são coisas distintas. O livro pode ser presente para outra pessoa em outro endereço. Separar os dois passos é a UX correta e é o padrão de e-commerces como Amazon.

**`StepShipping` — campos do formulário:**
- Nome completo do destinatário (obrigatório)
- País — dropdown com 16 países suportados (obrigatório)
- Endereço / linha 1 (obrigatório)
- Complemento / linha 2 (opcional)
- Cidade (obrigatório)
- Código Postal (obrigatório)
- Estado / Região (opcional)

**Comportamento:**
- Botão "Continuar para pagamento" desativado até campos obrigatórios preenchidos
- Estado `shippingAddress: ShippingAddress` no root do `BookPage`, preservado entre steps
- Ao submeter, chama `/create-checkout` com `shippingAddress` no body

**Worker `create-checkout.js`:**
- Recebe `shippingAddress` e passa para Stripe via `payment_intent_data.shipping`
- `shipping_address_collection` removido — Stripe não pede endereço (já coletado no site)
- Stripe Checkout exibe apenas formulário de cartão de crédito

**`StepOrder` simplificado:**
- Removida lógica de checkout (movida para `StepShipping`)
- Botão agora navega para step `shipping` em vez de ir ao Stripe diretamente

#### Decisão: frete provisório vs. API Lulu

**Problema identificado**: o resumo do pedido exibe "Frete: calculado no checkout" mas o Stripe não coleta mais endereço — o frete real precisa vir da API Lulu.com.

**Fluxo correto (a implementar após conta Lulu):**
```
Usuário preenche endereço → Worker consulta API Lulu → retorna custo de frete →
Site exibe total real (livro + frete) → Stripe cobra com 2 line items
```

**Decisão tomada**: não implementar valor fake/estimado. Manter "Frete calculado após confirmação do endereço" até termos a conta Lulu e os valores reais da API. Honesto com o utilizador e sem retrabalho.

---

### Sessão 20/04/2026 (cont.) — Checkout testado e validado end-to-end

#### Fluxo de pagamento 100% validado em produção (modo teste)

| Etapa | Status |
|---|---|
| Checkout abre com preço correto por modelo | ✅ |
| Email e nome do usuário pré-preenchidos | ✅ |
| `support@meuperegrino.com` visível no rodapé do checkout | ✅ |
| Pagamento processado (cartão teste `4242...`) | ✅ |
| Redirect para `/sucesso` após pagamento | ✅ |
| Webhook `checkout.session.completed` recebido com status 200 | ✅ |

#### Pré-preenchimento do Stripe Checkout
- `StepOrder` recebe `userEmail` (do `supabase.auth` — `user?.email`) e `bookData.userName`
- Worker envia `customer_email` ao Stripe → campo email aparece preenchido
- `customer_name` salvo em `metadata` para referência no painel Stripe
- Usuário não autenticado (demo): campos ficam em branco

#### Webhook handler (`functions/stripe-webhook.js`)
- Valida assinatura HMAC-SHA256 via `STRIPE_WEBHOOK_SECRET` (Cloudflare env)
- Loga pedido completo: `stripeSessionId`, `customerEmail`, `customerName`, `amountTotal`, `modelId`, `shippingAddress`
- Próximos passos mapeados em TODO: gravar Supabase → gerar PDF → enviar Lulu

#### Variáveis de ambiente finais no Cloudflare Pages
| Variável | Tipo |
|---|---|
| `STRIPE_SECRET_KEY` | Secret |
| `STRIPE_PUBLIC_KEY` | Secret |
| `STRIPE_WEBHOOK_SECRET` | Secret |
| `VITE_SUPABASE_URL` | Plaintext |
| `VITE_SUPABASE_ANON_KEY` | Plaintext |
| `NODE_VERSION` | Plaintext (20) |

---

### Sessão 20/04/2026 (cont.) — PWA manifest + URLs definitivas

#### manifest.json criado (`public/manifest.json`)
Habilita instalação nativa do site como PWA no Android/Chrome (botão "Adicionar à tela inicial" nativo).
Campos: `name`, `short_name`, `start_url: "/"`, `display: standalone`, `theme_color: #2D3A27`, ícone `vieira.png`.

#### index.html — meta tags PWA adicionadas
- `<link rel="manifest" href="/manifest.json" />`
- `<meta name="theme-color" content="#2D3A27" />`
- Meta tags Apple (`apple-mobile-web-app-capable`, `status-bar-style`, `title`) para iOS add-to-homescreen

#### LandingPage.tsx — URLs definitivas
- QR Code do DownloadModal: `https://peregrino.app` → `https://app.meuperegrino.com`
- Todos os `peregrino.app` no texto dos modais legais → `meuperegrino.com`
- Emails de contato atualizados: `contato@` → `contact@meuperegrino.com`, `pedidos@` e `privacidade@` → `support@meuperegrino.com`
- Aviso "emails serão ativados quando domínio for definido" removido — domínio já está ativo

#### Emails operacionais (via Cloudflare Email Routing → Gmail)
| Endereço | Uso |
|---|---|
| `contact@meuperegrino.com` | Contato geral + DPO/LGPD |
| `support@meuperegrino.com` | Suporte a pedidos + privacidade |

---

### Sessão 20/04/2026 (cont.) — Stripe configurado + preços dinâmicos por modelo

#### Variáveis de ambiente Stripe configuradas no Cloudflare Pages

| Variável | Tipo | Status |
|---|---|---|
| `STRIPE_SECRET_KEY` | Secret (criptografado) | ✅ Configurado |
| `STRIPE_PUBLIC_KEY` | Secret (criptografado) | ✅ Configurado |

Modo atual: **teste** (`sk_test_` / `pk_test_`). Migrar para `sk_live_` quando pronto para produção real.

#### Bug corrigido: preço fixo no Stripe Worker

O Worker `functions/create-checkout.js` tinha preço hardcoded `7900` (€79,00) independente do modelo selecionado.

**Correção**: Worker agora recebe `modelId`, `modelLabel` e `modelPages` do frontend e usa tabela de preços:

| modelId | Preço (cents) | Valor |
|---|---|---|
| `essential` | 4990 | €49,90 |
| `journey` | 7490 | €74,90 |
| `legacy` | 9990 | €99,90 |

**`BookPage.tsx` — `handleCheckout()`**: payload do POST enriquecido com `modelId`, `modelLabel`, `modelPages`.
**`functions/create-checkout.js`**: lê modelo recebido, aplica preço correto, nome e descrição dinâmicos no produto Stripe.

#### Email profissional configurado (Cloudflare Email Routing)

| Endereço | Destino |
|---|---|
| `support@meuperegrino.com` | Gmail pessoal |
| `contact@meuperegrino.com` | Gmail pessoal |

Emails recebidos chegam ao Gmail. Sem custo adicional (Cloudflare Email Routing é gratuito).
Conta Stripe usa Gmail como login; `support@meuperegrino.com` configurado como email de suporte ao cliente.

---

### Sessão 20/04/2026 — Domínio definitivo + Supabase + Cloudflare configurados

#### Domínio definitivo registrado: meuperegrino.com

Domínio **meuperegrino.com** registrado via Cloudflare Registrar em 20/04/2026.
Estrutura de subdomínios definida:
- **Site (landing + /book):** `https://meuperegrino.com`
- **App (Flutter PWA):** `https://app.meuperegrino.com`

#### Supabase Auth — URL Configuration atualizada

| Campo | Valor anterior | Valor novo |
|---|---|---|
| Site URL | `https://peregrino.pages.dev` | `https://meuperegrino.com` |

Redirect URLs — lista final (6 URLs):

| URL | Finalidade |
|---|---|
| `https://meuperegrino.com/**` | Site produção — OAuth do `/book` |
| `https://app.meuperegrino.com/**` | App produção — OAuth do login |
| `http://localhost:5173/**` | Dev local do site |
| `https://peregrino-site.pages.dev/**` | Backup legado do site |
| `https://peregrino.pages.dev/**` | Backup legado do app |
| `https://peregrino.pages.dev/estabelecimento` | Rota específica legada |

#### Cloudflare Pages — Custom Domain conectado

Custom domain `meuperegrino.com` vinculado ao projeto do site no Cloudflare Pages.
DNS configurado automaticamente (domínio é da própria Cloudflare — zero propagação necessária).

#### Código atualizado

- **`functions/create-checkout.js` linha 21**: URL da imagem do produto Stripe atualizada de `peregrino-site.pages.dev` → `meuperegrino.com`
- **`src/BookPage.tsx` linha 777**: Comentário de instrução do `OAUTH_REDIRECT_URL` atualizado para referenciar `meuperegrino.com`. A constante em si usa `window.location.origin` (dinâmico — funciona em dev e produção sem alteração)

#### Arquitetura de banco de dados esclarecida

O Supabase é um serviço independente — não pertence nem ao deploy do site nem ao do app. Ambos os deploys (`meuperegrino.com` e `app.meuperegrino.com`) são clientes do mesmo banco usando as mesmas credenciais. O `user_id` do Google OAuth é o elo: dados gravados pelo app (fotos, stamps, jornadas) são lidos pelo site com o mesmo usuário autenticado. Nenhuma configuração adicional de banco necessária.

---

### Sessão 19/04/2026 (noite) — Correção crítica de orientação + Especificações Lulu.com documentadas

#### BUG CRÍTICO CORRIGIDO: Orientação do livro era PORTRAIT, deve ser LANDSCAPE

O formato Lulu.com US Letter Landscape é **11" × 8.5"** (largura > altura). O livro interativo estava
renderizando em modo PORTRAIT (altura > largura), incompatível com o produto físico real.

**Correção em `useBookSize()` (`BookPage.tsx:620`)**:
```
ANTES (portrait — ERRADO):
  mobile:  { w: 165, h: 220 }
  tablet:  { w: 270, h: 360 }
  desktop: { w: 440, h: 587 }

DEPOIS (landscape 11:8.5 — CORRETO):
  mobile:  { w: 160, h: 124 }
  tablet:  { w: 280, h: 216 }
  desktop: { w: 440, h: 340 }
```

**Correção dos previews de capa** (linhas 1734, 2103):
- `aspect-[3/4]` (portrait) → `aspect-[22/17]` (landscape 11:8.5 = 22:17)
- Thumbnail no StepOrder: largura ajustada de `w-20` para `w-24` para melhor proporção

**Como a orientação foi descoberta**:
- Usuário inseriu a pasta `lulu-book-template-all-us-letter-landscape/` na raiz do projeto
- Análise das imagens PNG dos templates de capa revelou dimensões: 7200×3075px e 6715×2625px
- Ambas landscape (mais largas que altas) — confirmam o formato US Letter Landscape

---

#### ESPECIFICAÇÕES TÉCNICAS LULU.COM — US LETTER LANDSCAPE (Registrado definitivamente)

Fonte: pasta `lulu-book-template-all-us-letter-landscape/` (baixada do site oficial lulu.com)

##### Formato do livro (Interior)
| Parâmetro | Valor |
|---|---|
| **Formato** | US Letter Landscape |
| **Dimensões de impressão** | 11" × 8.5" (279.4mm × 215.9mm) |
| **Orientação** | Landscape (largura > altura) |
| **Sangria (bleed)** | 0.125" (3.175mm) em todos os lados |
| **Zona segura (safe zone)** | 0.5" (12.7mm) da borda de corte |
| **Resolução mínima de imagens** | 300 DPI |
| **Resolução de impressão** | 1200 DPI |
| **Versão PDF** | 1.3 ou superior |
| **Fontes** | Todas embutidas no PDF |
| **Espaço de cor (input)** | sRGB IEC61966-2.1 |
| **Espaço de cor (output/impressão)** | CMYK — U.S. Web Coated (SWOP) v2 |
| **Perfil CMYK** | Coated GRACoL 2006 (ISO 12647-2:2004) |
| **Compressão de imagens** | JPEG, qualidade alta (QFactor 0.15) |
| **Resolução mínima imagens coloridas** | 300 DPI |
| **Resolução imagens mono** | 1200 DPI |

##### Tipos de encadernação disponíveis
- **Paperback** (brochura — mais barato)
- **Hardcover** (capa dura)
- **Coil** (espiral)
- **Saddle Stitch** (grampos — para livros finos)

##### Formato da Capa (Cover)
- Capa entregue como **um único PDF plano (flat spread)**:
  - Contracapa + Lombada + Capa frontal em um arquivo
- Espessura da lombada varia com o número de páginas
- Templates disponíveis em InDesign, PDF, PSD e PNG

##### Arquivos no template fornecido
```
lulu-book-template-all-us-letter-landscape/
├── Adobe PDF Export Presets/
│   ├── Lulu-Cover-Print-PDF.joboptions    ← Preset para capa (Adobe Distiller)
│   └── Lulu-Interior-Print-PDF.joboptions ← Preset para miolo (Adobe Distiller)
├── Book Creation Guide/
│   └── [PDF com guia completo de criação]
├── Cover Templates/
│   ├── Coil/         ← InDesign + PDF + PSD + PNG por tamanho
│   ├── Hardcover/    ← idem
│   ├── Paperback/    ← idem
│   └── Saddle Stitch/← idem
└── Interior Templates/
    └── [Templates de miolo por formato]
```

##### Implicações para a geração do PDF do livro
Quando implementarmos a geração de PDF (pendência #8 nas tarefas), o backend deve:
1. Gerar páginas em **landscape 11"×8.5"** (não portrait!)
2. Adicionar **0.125" de sangria** em cada lado
3. Manter elementos críticos (texto, rostos) a **0.5" das bordas**
4. Exportar em **PDF 1.3+** com fontes embutidas
5. Imagens em **300 DPI mínimo** no PDF final
6. Espaço de cor **sRGB** (Lulu converte para CMYK)

---

### Sessão 19/04/2026 (tarde) — Textos personalizáveis por página

#### Novo modelo de referência (PDF atualizado pelo usuário)
O usuário revisou o PDF de referência do livro e confirmou que os layouts de foto são os **mesmos do modelo original** — sem mudanças na disposição das fotos. A novidade foram os **espaços de texto opcionais** adicionados a alguns layouts:
- Layouts afetados: `large-white`, `stacked-2`, `grid-4-white`
- Cada layout pode ter até 2 campos: **topo** e **rodapé**
- Campos são opcionais — página sem texto renderiza normalmente
- O usuário tem controle por página: fonte + tamanho independentes por campo

#### 5 fontes disponíveis (Google Fonts)
Adicionadas ao `index.html` e disponíveis para seleção na UI:

| ID | Nome | Estilo |
|---|---|---|
| `inter` | Inter | Sans-serif — padrão do site |
| `playfair` | Playfair Display | Serif elegante — fonte da marca |
| `lora` | Lora | Serif literário |
| `dancing` | Dancing Script | Manuscrito/cursiva |
| `montserrat` | Montserrat | Sans-serif geométrico |

#### Tamanhos de fonte (PP/P/M/G/GG)
Mapeados para o sistema `fs()` escalável do livro:

| Label | ID | fs() multiplier |
|---|---|---|
| PP | `xs` | 0.36 |
| P | `sm` | 0.50 |
| M | `md` | 0.64 |
| G | `lg` | 0.80 |
| GG | `xl` | 1.00 |

#### Estrutura de dados
- `PageTextEntry`: `{ text: string; fontSize: FontSize; fontFamily: FontFamily }`
- `BookData.pageTexts: Record<string, PageTextEntry>` — chave: `"${pageIdx}-top"` ou `"${pageIdx}-bottom"`
- Armazenamento inicia vazio (`{}`); entradas criadas apenas quando o usuário digita

#### UI — Aba Textos (StepCustomize)
Nova seção "Textos das páginas" ao final da aba:
- Lista scrollável (`max-h-[34rem]`) de todas as páginas com slots de texto
- Cada card mostra: `Pág. N` + tipo do layout (ex: "Foto com margem")
- Por slot (Topo / Rodapé): campo `<textarea>` + 5 botões de tipologia + 5 botões de tamanho
- Botões mostram a fonte aplicada ao próprio label (preview inline)
- `updateEntry()` deleta a chave do Record se o texto for vazio (sem poluição de dados)

#### Renderização no livro
- `renderTextSlot('top' | 'bottom', fallback?)` helper dentro de `renderBookPage`
- Busca em `bookData.pageTexts[pageIdx-slot]`; aplica `fontFamily` e `fontSize` via style inline
- Cor: `rgba(45,58,39,0.68)` — verde floresta com transparência (consistente com o restante do livro)
- `large-white`: mantém lógica do `caption` como fallback para o slot `bottom` quando existe `def.ck`

---

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
| 1 | ~~**Definir domínio definitivo**~~ | ✅ **20/04/2026** — Domínio **meuperegrino.com** registrado via Cloudflare. Site: `meuperegrino.com` · App: `app.meuperegrino.com` |
| 2 | ~~**↳ Atualizar URLs definitivas**~~ | ✅ **20/04/2026** — `functions/create-checkout.js` atualizado. `OAUTH_REDIRECT_URL` usa `window.location.origin` (dinâmico — funciona em dev e prod) |
| 3 | ~~**↳ Registar Redirect URL no Supabase**~~ | ✅ **20/04/2026** — Site URL: `https://meuperegrino.com`. Redirect URLs: `meuperegrino.com/**` e `app.meuperegrino.com/**` adicionadas (total: 6 URLs) |
| 4 | ~~**↳ Deploy no domínio definitivo**~~ | ✅ **20/04/2026** — Custom domain conectado no Cloudflare Pages |
| 5 | ~~**↳ Deep link App → Site**~~ | ✅ **20/04/2026** — CTA "Transforme sua jornada num livro" no modal de chegada do app. Link: `https://meuperegrino.com/book?lang=${getLocale()}`. Repo: entreambientesoficial/Peregrino commit f064c33 |

### 🟠 Alta prioridade (funcionalidade de venda)

| # | Item | Detalhe |
|---|---|---|
| 6 | ~~**Configurar Stripe no Cloudflare**~~ | ✅ **20/04/2026** — Stripe configurado, webhook validado, checkout testado end-to-end em modo teste. |
| 7 | **Conta Lulu.com** | Criar conta de desenvolvedor em lulu.com. Configurar 3 produtos (US Letter Landscape, 50/100/150 páginas, capa dura). Obter API key. Desbloqueia o cálculo de frete real e a geração do PDF. |
| 7a | **↳ Cálculo de frete real** | Após conta Lulu: após step de endereço, Worker consulta API Lulu com endereço + specs do livro → retorna custo → site exibe total real (livro + frete) → Stripe cobra 2 line items. Atualmente exibe "Frete calculado após confirmação do endereço". |
| 8 | **Geração do PDF do livro** | Backend (Cloudflare Worker) que: (1) recebe evento pós-Stripe `checkout.session.completed`, (2) busca fotos do Supabase, (3) monta PDF landscape 11×8.5" com os layouts do livro, (4) envia para API Lulu, (5) Lulu imprime e entrega ao cliente. Maior tarefa técnica do projeto. |

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
| `PHOTO_BLOCK` | Array de 48 `PageDef` — template fiel às 52 páginas do modelo Canva do usuário (p3-p50) |
| `generatePageDefs()` | Retorna as 54 páginas fixas: cover + verso-capa + preface + 48 fotos + stamps + verso-back + back-cover |
| `buildPhotoSlotMap(defs)` | Mapeia índice de página → array de índices sequenciais de foto (sem repetição) |
| `renderBookPage(def, idx, data, S, sp, fs, slotMap)` | Renderiza uma página com `pimg()` helper (object-contain sempre); `renderTextSlot()` injeta texto personalizado |
| `PAGE_TEXT_SLOTS` | Record de layouts → slots de texto disponíveis (`'top' \| 'bottom'`): `photo-text-r`, `text-photo-r`, `wide-photo-text`, `photo-caption` |
| `FONT_FAMILIES` | Array com 5 fontes (inter, playfair, lora, dancing, montserrat) com CSS string |
| `FONT_SIZE_FS` | Mapeamento FontSize → multiplicador `fs()` (0.36 a 1.0) |
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

### Sessão 19/04/2026 (madrugada) — Reescrita completa do livro: 52 páginas baseadas no modelo Canva

#### Contexto e motivação
O usuário criou manualmente, no **Canva**, um modelo completo de 52 páginas com as medidas exatas do Lulu.com (US Letter Landscape 11"×8.5"). Motivação declarada pelo usuário:

> *"Como teremos credibilidade e confiança num app que tem como objetivo levar para um site que vende o coffee table book, se o book não entrega o prometido?"*

A credibilidade do produto inteiro depende da qualidade visual do livro interativo. Os layouts anteriores (23 PageKinds genéricos) foram descartados e substituídos por 31 novos kinds que reproduzem fielmente cada página do modelo.

#### Arquivos criados pelo usuário
Pasta `page-model/` na raiz do projeto com **52 arquivos PNG** (numerados e nomeados com descrição do layout). Criados no Canva com medidas exatas do Lulu.

#### O que foi feito
1. Leitura visual de todas as 52 páginas PNG do modelo
2. Mapeamento completo de cada página → layout kind → número de fotos
3. Reescrita total do sistema de renderização em `src/BookPage.tsx`:
   - Novo tipo `PageKind` com 31 kinds
   - Novo `PHOTO_BLOCK` com 48 entradas (p3–p50 do modelo)
   - `generatePageDefs()` simplificado: sempre retorna as 54 páginas fixas
   - `buildPhotoSlotMap()` simplificado (removida lógica especial panorama-R)
   - `renderBookPage` switch completamente reescrito com todos os novos layouts
   - `PAGE_TEXT_SLOTS` atualizado
   - `kindLabel` Record atualizado com todos os 31 kinds
4. Commit e push para o repositório

---

#### Nova estrutura completa do livro (54 páginas no react-pageflip)

| Pos. | PageKind | Arquivo modelo | Fotos | Descrição |
|---|---|---|---|---|
| 0 | `cover` | — | 1 (capa) | Capa externa — foto Fisterra Km 0, gradient + título |
| 1 | `verso-capa` | `1 Verso da Contracapa.png` | 0 | Branco + logo Peregrino centralizado (vieira + texto bordô) |
| 2 | `preface` | `2.Prefácio.png` | 0 | Dados da jornada: rota, datas, km, dias, carimbos, fotos |
| 3 | `full-bleed` | `3 foto inteira.png` | 1 | Foto borda a borda |
| 4 | `duo-margin` | `4 foto dupla dentro da margem.png` | 2 | 2 paisagens lado a lado com margens |
| 5 | `photo-text-r` | `5 imagem esquerda + texto direita.png` | 1 | Retrato esq + título/frase dir |
| 6 | `full-bleed` | `6 foto inteira.png` | 1 | Foto borda a borda |
| 7 | `trio-centered` | `7- 3 fotos centrais.png` | 3 | 3 retratos centrados com margens brancas |
| 8 | `quote-route` | `8.Texto e sub-texto (rota).png` | 0 | Texto italic grande + rota/data em pequeno |
| 9 | `offset-two` | `9. imagens ajustadas dentro da margem.png` | 2 | 2 fotos desalinhadas diagonal (topo-esq + baixo-dir) |
| 10 | `full-bleed` | `10. imagem inteira.png` | 1 | Foto borda a borda |
| 11 | `one-centered` | `12. 1 imagem central.png` | 1 | 1 paisagem centralizada, grandes margens + sombra sutil |
| 12 | `one-portrait-margin` | `12. 1 imagem dentro da margem (2).png` | 1 | 1 retrato com borda fina, centrado |
| 13 | `stagger-2` | `13. 2 imagens desalinhadas.png` | 2 | 2 retratos com offset vertical (escalonados) |
| 14 | `one-landscape-margin` | `14. 1 imagem dentro da margem.png` | 1 | 1 paisagem com margens brancas |
| 15 | `full-bleed` | `15. 1 imagem inteira (5).png` | 1 | Foto borda a borda |
| 16 | `full-bleed` | `16. 1 imagem inteira.png` | 1 | Foto borda a borda |
| 17 | `two-left-one-right` | `17. 2 imagens esquerda (cima e baixo) + 1 imagem direita (2).png` | 3 | 2 paisagens empilhadas esq + 1 retrato alto dir |
| 18 | `grid-2x2` | `18. 4 imagens dentro da margem (3).png` | 4 | Grade 2×2 de paisagens com margens |
| 19 | `photo-text-r` | `19. 1 imagem + texto.png` | 1 | Retrato esq + título Inter + subtítulo italic dir |
| 20 | `full-bleed` | `20. 1 imagem inteira.png` | 1 | Foto borda a borda |
| 21 | `trio-centered` | `21. 2 imagens + 1 imagem dentro da margem.png` | 3 | 3 retratos lado a lado centrados |
| 22 | `stagger-2` | `22. 2 imagens.png` | 2 | 2 fotos diagonal (sup-esq + inf-dir) |
| 23 | `one-landscape-margin` | `23. 1 imagen dentro da margem.png` | 1 | 1 paisagem com margens e borda fina |
| 24 | `duo-portrait-margin` | `24. 2 imagens dentro da margem (3).png` | 2 | 2 retratos lado a lado com margens |
| 25 | `duo-stacked` | `25. 2 imagens horizontal dentro da margem.png` | 2 | 2 paisagens empilhadas verticalmente |
| 26 | `duo-portrait-margin` | `26. 2 imagens dentro da margem (4).png` | 2 | 2 retratos lado a lado com margens |
| 27 | `quote-route` | `27. Texto e sub-texto (rota).png` | 0 | Texto italic grande (Dancing Script) + rota/data |
| 28 | `full-bleed` | `28. 1 imagem inteira.png` | 1 | Foto borda a borda |
| 29 | `one-left-two-right` | `29. 1 imagem esquerda + 2 imagens direita (cima e baixo).png` | 3 | 1 retrato alto esq + 2 paisagens empilhadas dir |
| 30 | `one-landscape-margin` | `30. foto dentro da margem.png` | 1 | 1 paisagem com margens |
| 31 | `trio-stagger` | `31. 3 imagens (2).png` | 3 | 3 retratos: lados 68% altura, central 88% (destaque) |
| 32 | `full-bleed` | `32. 1 imagem tela inteira.png` | 1 | Foto borda a borda |
| 33 | `full-bleed` | `33. 1 imagem total.png` | 1 | Foto borda a borda |
| 34 | `photo-text-r` | `34. 1 imagem + texto.png` | 1 | Retrato esq + título Inter bold + subtítulo italic |
| 35 | `text-photo-r` | `35. texto + sub-texto + 1 imagem.png` | 1 | Título Playfair esq + retrato dir |
| 36 | `duo-portrait-margin` | `36. 2 imagens dentro da margem.png` | 2 | 2 retratos lado a lado |
| 37 | `one-top-two-bottom` | `37. 1 imagem em cima + 2 imagens em baixo.png` | 3 | 1 paisagem larga topo + 2 paisagens abaixo |
| 38 | `grid-3x2` | `38. 6 imagens.png` | 6 | Grade 3×2 (6 fotos) com margens |
| 39 | `text-photo-r` | `39. Texto + 1 imagem dentro da margem.png` | 1 | Título script italic esq + retrato dir |
| 40 | `two-left-one-right` | `40. 2 imagens esquerda (cima e baixo) + 1 imagem direita.png` | 3 | 2 empilhadas esq + 1 retrato alto dir |
| 41 | `one-wide-three-below` | `41. 4 imagens dentro da margem (2).png` | 4 | 1 larga topo + 1 grande esq + 2 empilhadas dir |
| 42 | `full-bleed` | `42. foto inteira.png` | 1 | Foto borda a borda |
| 43 | `trio-rotated` | `43. 3 imagens 1 desalinhada dentro da margem.png` | 3 | Retrato esq + paisagem inclinada ~-3° dir-cima + paisagem dir-baixo |
| 44 | `wide-photo-text` | `44. 1 imagem inteira + espaço para texto.png` | 1 | Paisagem larga 65% esq + texto italic dir |
| 45 | `duo-portrait-margin` | `45. 4.png` | 2 | 2 retratos lado a lado com margens |
| 46 | `text-route` | `46. Tela texto + sub-texto (rota e data).png` | 0 | Título Playfair bold + rota/data italic (sem foto) |
| 47 | `two-top-one-bottom` | `47. 2 imagens em cima + 1 imagem em baixo todas dentro da margem.png` | 3 | 2 paisagens topo + 1 paisagem larga abaixo |
| 48 | `trio-portrait` | `48. 3 imagens.png` | 3 | 3 retratos lado a lado com margens |
| 49 | `grid-2x2` | `49. 4 imagens dentro da margem.png` | 4 | Grade 2×2 com margens |
| 50 | `photo-caption` | `50. 1 imagem + um texto.png` | 1 | Paisagem + legenda italic abaixo (Dancing Script) |
| 51 | `stamps` | `51. Tela selo de acordo com a rota.png` | 0 | Grade 4×4 de selos da credencial |
| 52 | `verso-back` | `52. 1.verso da capa.png` | 0 | Branco + logo Peregrino centralizado (igual verso-capa) |
| 53 | `back-cover` | — | 0 | Contracapa externa (fundo escuro `#1B2616` + "peregrino.app") |

**Total de slots fotográficos: 88** (distribuídos pelos 48 layouts fotográficos; pool demo = 90 fotos)

---

#### 31 PageKinds — detalhamento técnico

| Kind | Fotos | CSS layout | Fundo células |
|---|---|---|---|
| `cover` | 1 | `object-cover` full | — |
| `verso-capa` | 0 | flex center | `#ffffff` |
| `preface` | 0 | flex col justify-between | `#F5F2EA` |
| `full-bleed` | 1 | flex center contain | `#f0ede6` |
| `duo-margin` | 2 | grid 1fr 1fr, padding sp(12) | `#f0ede6` |
| `photo-text-r` | 1 | grid 48%/52%, foto esq + texto dir | `#f0ede6` |
| `trio-centered` | 3 | grid 1/1/1, 85% height, padding sp(10) | `#f0ede6` |
| `quote-route` | 0 | flex col justify-end | `#ffffff` |
| `offset-two` | 2 | absolute position: 55%×52% sup-esq + 55%×58% inf-dir | `#f0ede6` |
| `one-centered` | 1 | flex center, 80%×75%, sombra sutil | `#f0ede6` |
| `one-portrait-margin` | 1 | flex center, 58%×84%, border | `#f0ede6` |
| `stagger-2` | 2 | flex row, 72% height, marginTop ±sp(14) | `#f0ede6` |
| `one-landscape-margin` | 1 | flex center, 100%×70% | `#f0ede6` |
| `two-left-one-right` | 3 | grid 1/1 cols, 1/1 rows; dir em gridRow 1/3 | `#f0ede6` |
| `grid-2x2` | 4 | grid 1/1 × 1/1, padding sp(10) | `#f0ede6` |
| `duo-portrait-margin` | 2 | grid 1fr 1fr, padding sp(10) | `#f0ede6` |
| `duo-stacked` | 2 | grid rows 1fr 1fr, padding sp(10) | `#f0ede6` |
| `one-left-two-right` | 3 | grid 1/1 cols; esq em gridRow 1/3 | `#f0ede6` |
| `trio-stagger` | 3 | flex row; heights 68%/88%/68% | `#f0ede6` |
| `text-photo-r` | 1 | grid 45%/55%; texto esq (Playfair+Inter) + foto dir | `#f0ede6` |
| `one-top-two-bottom` | 3 | grid 2cols/2rows; topo em gridColumn 1/3 | `#f0ede6` |
| `grid-3x2` | 6 | grid 1/1/1 × 1/1, padding sp(10) | `#f0ede6` |
| `one-wide-three-below` | 4 | grid 2cols/2rows; topo 1/3; baixo-dir = sub-grid 2 rows | `#f0ede6` |
| `trio-rotated` | 3 | grid 45%/52% × 2rows; dir-cima rotate(-3deg) | `#f0ede6` |
| `wide-photo-text` | 1 | grid 65%/35%; foto esq + texto Dancing Script dir | `#f0ede6` |
| `two-top-one-bottom` | 3 | grid 2cols/2rows; baixo em gridColumn 1/3 | `#f0ede6` |
| `trio-portrait` | 3 | grid 1/1/1 cols, padding sp(10) | `#f0ede6` |
| `photo-caption` | 1 | flex col; foto flex:1 + caption borda-topo | `#f0ede6` |
| `text-route` | 0 | flex col justify-end | `#ffffff` |
| `stamps` | 0 | grade 4×4 de selos (mock 16 locais reais) | `#FDFCF8` |
| `verso-back` | 0 | flex center (igual verso-capa) | `#ffffff` |
| `back-cover` | 0 | flex col justify-between | `#1B2616` |

---

#### Princípio crítico: NUNCA cortar fotos (regra definitiva do projeto)
- **Todos** os layouts usam `object-fit: contain` via helper `pimg()` — nunca `object-cover`
- Fundo de cada célula de foto: `#f0ede6` (creme neutro) — visível quando a foto tem bordas vazias
- **Única exceção**: `cover` usa `object-cover` (intencional — é a capa do livro)
- Motivação: fotos do Caminho têm orientações variadas; cortar rostos, pés ou paisagens é inadmissível num coffee table book premium

#### Tipografia usada nos layouts de texto
| Layout | Elemento | Fonte | Peso/Estilo |
|---|---|---|---|
| `photo-text-r` / `text-photo-r` | Título | Inter ou Playfair Display | 600–700 |
| `photo-text-r` / `text-photo-r` | Corpo | Lora | Italic |
| `quote-route` | Texto principal | Dancing Script | Regular |
| `quote-route` | Sub-texto (rota) | Inter | Regular, 0.1em tracking |
| `text-route` | Título | Playfair Display | 700 |
| `text-route` | Sub-texto (rota) | Dancing Script | Italic |
| `wide-photo-text` | Texto | Dancing Script | Regular |
| `photo-caption` | Legenda | Dancing Script | Italic |
| `verso-capa` / `verso-back` | "Peregrino" | Playfair Display | 700, cor `#7B1515` |
| `preface` | Dados | Inter | Regular |

#### Mudanças técnicas em `BookPage.tsx`
```
ANTES:
  type PageKind = 23 kinds (full-dark, centered-dark, large-white, etc.)
  PHOTO_BLOCK = 50 entradas (repetidas para preencher N páginas)
  generatePageDefs(modelPages) = loop repete PHOTO_BLOCK até atingir N
  buildPhotoSlotMap = tratamento especial panorama-R
  renderBookPage = mix de object-cover e object-contain

DEPOIS:
  type PageKind = 31 kinds (full-bleed, duo-margin, photo-text-r, etc.)
  PHOTO_BLOCK = 48 entradas exatas (p3–p50 do modelo)
  generatePageDefs() = sem parâmetro, retorna sempre 54 páginas fixas
  buildPhotoSlotMap = simplificado, sem casos especiais
  renderBookPage = pimg() helper, object-contain universal
```

#### Commit gerado
```
feat: reescrita completa do livro — 52 páginas baseadas no modelo Canva
371 insertions(+), 319 deletions(-)
```

---

*Última atualização: 19/04/2026 (madrugada) — Sessão com Antigravity (Claude Sonnet 4.6)*
