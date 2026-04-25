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
| **Step 2 — Personalizar** | ✅ Concluído | Seletor de modelo no topo + abas Capa / Textos / Fotos + "Ver resultado" volta ao Step 1 com `hasCustomized=true`. Aba Capa tem campo "Nome do Peregrino" editável (pré-preenchido com displayName do login). |
| **Editor Editorial de Textos** | ✅ Concluído | Aba Textos reestruturada em 4 seções editoriais com prévia inline e badge de localização. Sistema `TEXT_STYLES` com 3 estilos fixos (Título/Destaque/Corpo). Seletores arbitrários de fonte+tamanho removidos. Ver detalhes no histórico 25/04 parte 5. |
| **Textos por página** | ✅ Concluído | Slots opcionais nos layouts `photo-text-r`, `text-photo-r`, `wide-photo-text`, `photo-caption`. Seletor de estilo com 3 botões (Título/Destaque/Corpo). Página real indicada com badge. Texto vazio = usa padrão do livro. |
| **Step 3 — Encomendar** | ✅ Concluído | Resumo dinâmico com nome, páginas e preço do modelo selecionado + Stripe Checkout |
| **Livro interativo** | ✅ Concluído | Estrutura dinâmica: capa + prefácio + N layouts fotográficos (50/100/150 conforme modelo) + selos + contracapa. `object-contain` nos layouts emoldurados (large-white, stacked-2, grid-4, stagger-4, trio-h/v) — fotos aparecem inteiras. `object-cover` mantido apenas em full-dark e panoramas (sangria intencional). |
| **Livro demo (sem login)** | ✅ Concluído | 89 fotos reais do Caminho em `public/img-apoio/img-webp/`. Reordenadas por orientação: landscape → slots panorama/stacked/centered, portrait → demais. Otimizadas: 1200px WebP q82, 22MB total. |
| **Atribuição manual de fotos** | ✅ Concluído | Aba Fotos do Step 2 redesenhada. Galeria + grid de slots do livro. Fluxo: clique numa foto → clique num slot = atribuição. Badge amarelo = manual; × remove; botão limpa tudo. `BookData.photoAssignments: Record<number,string>` sobrepõe o mapeamento automático. |
| **i18n do /book** | ✅ Concluído | 54 chaves `bp.*` por idioma (10 idiomas); prefácio, selos, layouts, paginação, frases, legendas e reflexões todos dinâmicos via `t()`; `makeDefaultBookData(t)` garante demo no idioma correto; `useEffect([lang])` atualiza ao trocar idioma sem sobrescrever dados de usuário logado |
| **Auth Gate + SSO** | ✅ Concluído | `AuthModal` com botão Google OAuth (Supabase `signInWithOAuth`) + formulário email/senha + bypass convidado. `onAuthStateChange` detecta login após redirect OAuth e carrega dados automaticamente. |
| **Dados reais do peregrino** | ✅ Concluído | `loadUserData` carrega `journeys`, `profiles`, `stamps` e `photos` em paralelo (`Promise.all`). Prioridade de rota: `journeys.route_id` → `profiles.route_id` → `stamps.route_id` → `'frances'`. km: `journeys.total_km` → `stamps.km_accumulated` → `0`. |
| **Assistente de Preenchimento** | ✅ Concluído | `GapModal` ao clicar "Ver resultado" quando `allPhotos.length < model.pages`. Opções: Upload (FileReader → Data URL, reabre modal se gap persiste) ou "Manter espaços em branco". |
| **Página de Selos** | ✅ Concluído | `displayCount = max(stampsCount, 28)` — nunca fica em branco. Selos reais mostram número; células extras exibem mock de local do Caminho (código + cidade + dia) usando `STAMP_PLACES[16]`. |
| **Cloudflare Worker** | ⚠️ Parcial | `functions/create-checkout.js` criado. Falta adicionar `STRIPE_SECRET_KEY` no painel Cloudflare Pages → Settings → Environment Variables. |

---

## 🔄 Histórico de Alterações

### Sessão 25/04/2026 (parte 5) — Editor editorial de textos com tipografia padronizada

#### Objetivo
Transformar a aba Textos de um formulário genérico em um editor editorial organizado, com estilos tipográficos fixos e contexto visual claro sobre onde cada texto aparece no livro impresso.

---

#### 1. Sistema `TEXT_STYLES` — 3 estilos tipográficos fixos

Substituiu os seletores arbitrários de 5 fontes × 5 tamanhos (25 combinações) por 3 estilos editoriais fixos definidos como constante de módulo:

```tsx
const TEXT_STYLES = {
  titulo: {
    fontFamily: "'Playfair Display', serif", fontWeight: 700, fontStyle: 'normal',
    color: '#1B2616', lineHeight: 1.2, fsRatio: 0.78,
    label: 'Título', hint: 'Playfair Display · Negrito',
  },
  destaque: {
    fontFamily: "'Dancing Script', cursive", fontWeight: 400, fontStyle: 'italic',
    color: '#1B2616', lineHeight: 1.45, fsRatio: 0.66,
    label: 'Destaque', hint: 'Dancing Script · Itálico',
  },
  corpo: {
    fontFamily: "'Lora', serif", fontWeight: 400, fontStyle: 'normal',
    color: 'rgba(45,58,39,0.72)', lineHeight: 1.6, fsRatio: 0.50,
    label: 'Corpo', hint: 'Lora · Regular',
  },
} as const;
type TextStyleKey = keyof typeof TEXT_STYLES; // 'titulo' | 'destaque' | 'corpo'
```

**Mapeamento de estilo por seção do livro:**

| Seção | Estilo | Fonte |
|---|---|---|
| Título da capa / prefácio / pág. 46 | Título | Playfair Display 700 |
| Frase de abertura (pág. 3, 5, 8) | Destaque | Dancing Script itálico |
| Legenda da foto final (pág. 48) | Destaque | Dancing Script itálico |
| Reflexão final (pág. 44, 45) | Corpo | Lora regular |
| Texto opcional nos slots de página | Escolha do usuário (3 opções) | Idem acima |

**Garantia de consistência:** `renderTextSlot` agora usa `TEXT_STYLES[entry.style]` — independente de qual página o slot está, o "Corpo" sempre renderiza em Lora com os mesmos parâmetros.

---

#### 2. `PageTextEntry` — interface simplificada

```tsx
// ANTES:
interface PageTextEntry { text: string; fontSize: FontSize; fontFamily: FontFamily; }
// tipos auxiliares: FontSize (5 valores), FontFamily (5 valores), FONT_SIZE_FS, FONT_SIZE_LABEL, FONT_FAMILIES[]

// DEPOIS:
interface PageTextEntry { text: string; style: TextStyleKey; }
// tipos auxiliares: apenas TEXT_STYLES e TextStyleKey
```

Removidos: `FontSize`, `FontFamily`, `FONT_SIZE_FS`, `FONT_SIZE_LABEL`, `FONT_FAMILIES`.

---

#### 3. Aba Textos — nova estrutura editorial

4 seções organizadas por posição no livro impresso, cada uma com:
- Badge de localização (ex: "Prefácio · pág. 5 · pág. 8")
- Badge de estilo (ex: "Destaque")
- Prévia inline no estilo correto (Dancing Script / Lora / Playfair)
- Textarea com a fonte do estilo aplicada
- Contador de caracteres

**Seções:**

| Seção | Campo | Localização | Estilo |
|---|---|---|---|
| Frase de Abertura | `openingPhrase` | Prefácio · pág. 5 · pág. 8 | Destaque (Dancing Script) |
| Reflexão Final | `reflectionText` | Pág. 44 · pág. 45 | Corpo (Lora) |
| Legenda da Foto Final | `caption3` | Pág. 48 | Destaque (Dancing Script) |
| Texto Opcional por Página | `pageTexts[key]` | Apenas páginas com slot real | 3 botões de estilo |

**Removido da UI** (campos sem vínculo com página real do livro): `caption1`, `caption2` — estavam listados no formulário mas não renderizavam em nenhuma página. Permanecem em `BookData` para compatibilidade mas ocultos no editor.

---

#### 4. Seção "Texto Opcional por Página"

Cada página com slot (`photo-text-r`, `text-photo-r`, `wide-photo-text`, `photo-caption`) exibe:
- Badge de página ("Pág. 6")
- Rótulo contextual ("Foto + Texto · Área de texto à direita da foto")
- Separador "Área superior" / "Área inferior"
- **3 botões de estilo** em vez de 5 fontes × 5 tamanhos
- Textarea com preview do estilo selecionado aplicado

---

#### 5. Aba Capa — campo "Nome do Peregrino"

Adicionado abaixo do campo Título:
- Input editável com `uppercase tracking-widest` (igual ao render na capa)
- Pré-preenchido com o `displayName` do login Google via `loadUserData`
- Permite ajustar antes de imprimir (ex: `"delarco.ada"` → `"Anderson Delarco"`)
- Max 50 caracteres

#### Commit
`6b9f024` — feat(book): editor editorial de textos com tipografia padronizada

---

### Sessão 25/04/2026 (parte 4) — i18n dos textos de conteúdo do livro (frases, legendas, reflexões)

#### Problema resolvido
Mesmo após a parte 3 (que traduziu labels estruturais — prefácio, selos, paginação), os **textos de conteúdo** dentro das páginas do livro continuavam em português ao trocar de idioma:

- Frase de abertura: *"Comecei sem saber o que encontraria..."* — hardcoded PT-BR
- Texto de reflexão: *"Cada passo foi uma escolha..."* — hardcoded PT-BR
- Legendas 1/2/3 — hardcoded PT-BR
- Contador de navegação: *"pág. 5 / 50"*, *"Verso da capa"*, *"Contracapa"* — hardcoded PT-BR
- Nome da rota no livro demo: vinha de `bp.demo.route` já existente (correto), mas não era reinicializado ao trocar idioma

**Causa raiz técnica:** `DEFAULT_BOOK_DATA` era uma **constante de módulo** inicializada uma única vez na carga do arquivo. O `useState(DEFAULT_BOOK_DATA)` em React só usa o valor inicial uma vez — trocar de idioma não disparava nenhuma atualização.

---

#### Solução implementada

##### 1. `src/i18n.ts` — 5 novas chaves `bp.demo.*` em todos os 10 idiomas

Inseridas após `bp.kind.text-route` em cada bloco de idioma (via inserção por número de linha para contornar identidade dos blocos pt-BR e pt-PT):

| Chave | pt-BR | en | de |
|---|---|---|---|
| `bp.demo.openingPhrase` | *Comecei sem saber...* | *I started not knowing...* | *Ich begann, ohne zu wissen...* |
| `bp.demo.reflectionText` | *Cada passo foi uma escolha...* | *Each step was a choice...* | *Jeder Schritt war eine Entscheidung...* |
| `bp.demo.caption1` | *Os primeiros passos foram...* | *The first steps were...* | *Die ersten Schritte waren...* |
| `bp.demo.caption2` | *No meio do caminho...* | *Halfway through...* | *Auf halber Strecke...* |
| `bp.demo.caption3` | *Santiago chegou antes...* | *Santiago came sooner...* | *Santiago kam früher...* |

Idiomas completos: pt-BR, pt-PT, en, es, fr, de, it, ja, ko, zh-CN.

---

##### 2. `src/BookPage.tsx` — `DEFAULT_BOOK_DATA` → `makeDefaultBookData(t)`

```tsx
// ANTES — constante de módulo, textos fixos em PT-BR:
const DEFAULT_BOOK_DATA: BookData = {
  openingPhrase: 'Comecei sem saber o que encontraria...',
  reflectionText: 'Cada passo foi uma escolha...',
  caption1: 'Os primeiros passos foram...',
  ...
};

// DEPOIS — função que recebe t() e retorna textos no idioma correto:
function makeDefaultBookData(t: (k: string) => string): BookData {
  const route = t('bp.demo.route');
  return {
    title: `${route}, ${new Date().getFullYear()}`,
    route,
    openingPhrase: t('bp.demo.openingPhrase'),
    reflectionText: t('bp.demo.reflectionText'),
    caption1: t('bp.demo.caption1'),
    caption2: t('bp.demo.caption2'),
    caption3: t('bp.demo.caption3'),
    ...
  };
}
```

- Estado inicial: `useState<BookData>(() => makeDefaultBookData(t))`
- Logout (reset para demo): `setBookData(makeDefaultBookData(t))` — já usa t() correto
- `loadUserData`: substituídas as referências a `DEFAULT_BOOK_DATA.allPhotos` e `.coverPhoto` por `makeDefaultBookData(t)` local

---

##### 3. `BookPage` — `useEffect([lang])` para atualização dinâmica de idioma

```tsx
const { t, lang } = useT();  // lang agora exposto

useEffect(() => {
  if (user) return;  // usuário logado: dados reais, não reseta
  const d = makeDefaultBookData(t);
  setBookData(p => ({
    ...p,
    route: d.route,
    title: d.title,
    openingPhrase: d.openingPhrase,
    reflectionText: d.reflectionText,
    caption1: d.caption1,
    caption2: d.caption2,
    caption3: d.caption3,
  }));
}, [lang]);
```

**Comportamento:**
- Demo (sem login): troca de idioma atualiza automaticamente todos os textos do livro
- Usuário logado: `if (user) return` protege os dados reais — a troca de idioma não sobrescreve

---

##### 4. Contador de navegação do livro internacionalizado

```tsx
// ANTES:
{page <= 1 ? 'Verso da capa' : page >= TOTAL - 1 ? 'Contracapa' : `pág. ${page - 1} / ${TOTAL - 3}`}

// DEPOIS:
{page <= 1 ? t('bp.kind.verso-capa') : page >= TOTAL - 1 ? t('bp.kind.back-cover') : `${t('bp.page')} ${page - 1} / ${TOTAL - 3}`}
```

---

#### Tabela de componentes atualizada

| Componente | Chave i18n | Total de chaves `bp.*` |
|---|---|---|
| Labels estruturais (prefácio, selos, paginação, layouts) | `bp.preface.*`, `bp.stamps.title`, `bp.page`, `bp.kind.*` | 48 chaves |
| Textos de conteúdo demo | `bp.demo.openingPhrase`, `.reflectionText`, `.caption1/2/3` | 5 chaves |
| **Total por idioma** | — | **53 chaves `bp.*`** (+ `bp.demo.route` que já existia = 54) |

#### Commits desta sessão
- `7e6c716` — feat(i18n): traduzir todos os textos do livro modelo para 10 idiomas (parte 3)
- `7013519` — feat(i18n): traduzir textos de conteúdo do livro em 10 idiomas (parte 4)

---

### Sessão 25/04/2026 (parte 3) — i18n completo do livro modelo em 10 idiomas

#### Problema resolvido
Ao trocar de idioma, o livro modelo misturava o idioma selecionado com textos fixos em português. Os labels do Prefácio ("Peregrino", "Rota", "Início", etc.), o título da página de selos ("Carimbos da Credencial"), os nomes de tipo de layout na aba de personalização e a paginação ("Pág. X") estavam todos hardcoded em português.

#### Solução implementada

**`src/i18n.ts` — 48 novas chaves `bp.*` em todos os 10 idiomas:**

Chaves adicionadas por bloco de idioma (após `'bp.auth.connecting'`):

| Chave | Descrição |
|---|---|
| `bp.preface.pilgrim` | Label "Peregrino" no prefácio |
| `bp.preface.route` | Label "Rota" |
| `bp.preface.start` | Label "Início" |
| `bp.preface.end` | Label "Chegada" |
| `bp.preface.distance` | Label "Distância" |
| `bp.preface.duration` | Label "Duração" |
| `bp.preface.days_unit` | Unidade de dias ("dias", "days", "jours", "Tage", "giorni", "日間", "일", "天") |
| `bp.preface.stamps` | Label "Carimbos" |
| `bp.preface.photos` | Label "Fotos" |
| `bp.stamps.title` | Título da página de selos ("Carimbos da Credencial", "Credential Stamps", etc.) |
| `bp.page` | Prefixo de paginação ("Pág.", "Pg.", "P.", "S.", "Pag.", "页") |
| `bp.kind.*` | Nome de cada um dos 30 tipos de layout de página |

**`src/BookPage.tsx` — 4 pontos de uso internacionalizados:**

1. **`renderBookPage` — nova assinatura:** adicionado parâmetro `t: (k: string) => string`
   ```tsx
   function renderBookPage(def, pageIdx, bookData, S, sp, fs, slotMap, t) { ... }
   ```

2. **Call site atualizado** em `InteractiveBook`:
   ```tsx
   {renderBookPage(def, idx, bookData, S, sp, fs, slotMap, t)}
   ```
   (`InteractiveBook` já tinha `const { t } = useT()`)

3. **`case 'preface'`** — labels dinâmicos:
   ```tsx
   [t('bp.preface.pilgrim'), bookData.userName],
   [t('bp.preface.route'), bookData.route],
   // ... todos os 8 campos
   [t('bp.preface.duration'), `${bookData.days} ${t('bp.preface.days_unit')}`],
   ```

4. **`case 'stamps'`** — título dinâmico:
   ```tsx
   {t('bp.stamps.title')}
   ```

5. **`StepCustomize` — `kindLabel` e paginação:**
   - Substituído objeto Record<PageKind,string> hardcoded por função: `const kindLabel = (k: PageKind) => t(\`bp.kind.${k}\`)`
   - `"Pág. {pageIdx + 1}"` → `"{t('bp.page')} {pageIdx + 1}"`

#### Commit
`7e6c716` — feat(i18n): traduzir todos os textos do livro modelo para 10 idiomas

---

### Sessão 25/04/2026 (parte 2) — Fotos fixas por página + selos SVG + layout aprovado

#### ⚠️ DECISÃO FINAL DO USUÁRIO: configuração de modelo e imagens aprovada. Não alterar mais.

---

#### 1. Fix do pool de fotos esgotado (págs. 47 e 48 sem foto)

**Causa raiz:** O `buildPhotoSlotMap` com filas de orientação retorna `-1` quando as filas se esgotam (89 fotos para 91 slots). A função `ph(-1)` retornava `undefined` mesmo após fix anterior porque em JavaScript `-1 % 89 = -1`, e `photos[-1]` é `undefined`.

**Fix correto em `ph()`:**
```tsx
// Fórmula correta para wrap-around com índices negativos:
return photos.length > 0
  ? photos[((n % photos.length) + photos.length) % photos.length]
  : `__stamp__:${n}`;
// n = -1: ((-1 % 89) + 89) % 89 = 88 (última foto) ✓
// n = 89: (0 + 89) % 89 = 0 (primeira foto) ✓
```

---

#### 2. Fotos fixas por página — novo campo `srcs` na `PageDef`

Para permitir imagens hardcoded em páginas específicas (independente do pool de fotos do usuário):

**Interface `PageDef` — novo campo:**
```tsx
interface PageDef { ...; src?: string; srcs?: (string | null)[] }
```
- `src`: override para páginas com 1 foto (já usado no spread)
- `srcs`: override por slot para páginas com múltiplas fotos; `null` = usa pool normal

**`pimg()` — novo parâmetro `overrideUrl`:**
```tsx
const pimg = (slotIdx: number, style?: React.CSSProperties, overrideUrl?: string | null) => {
  const url = overrideUrl ?? ph(slotIdx);
  ...
};
```

**Render cases atualizados para aceitar override:**
- `full-bleed`: `pimg(slots[0], undefined, def.src ?? def.srcs?.[0])`
- `two-left-one-right`: cada slot passa `def.srcs?.[pos]`
- `photo-caption`: `pimg(slots[0], undefined, def.src ?? def.srcs?.[0])`

**Páginas com foto fixada:**

| Pág. | Índice PHOTO_BLOCK | Slot | Imagem fixada |
|---|---|---|---|
| 14 | [13] `full-bleed` | único | `/img-apoio/img-webp/20.webp` |
| 15 | [14] `two-left-one-right` | slots[2] (imagem grande, coluna direita) | `/img-apoio/img-webp/36.webp` |
| 48 | [47] `photo-caption` | único | `/img-apoio/card11-caminho-aragones.webp` |

**Pág. 48 também:** `flex: '0 0 60%'` → `flex: '0 0 80%'` (foto maior, menos espaço de texto — pedido do usuário).

---

#### 3. Página de selos (pág. 49) — carimbos SVG completos

**Problema:** `isReal = i < realCount` com `realCount = 28` (demo) fazia todos os 28 slots entrarem no branch `isReal` (que mostrava só o número). O branch mock com SVG nunca executava.

**Fix:** Removida a bifurcação `isReal`/mock — todos os slots renderizam SVG stamp diretamente.

**`STAMP_PLACES` reescrito** com 22 entradas visuais (Camino Francés completo: SJPP → Santiago):

```tsx
const STAMP_PLACES = [
  { city: 'Saint-Jean-Pied-de-Port', top: 'BUREAU DES PÈLERINS', bottom: 'ST-JEAN · FRANCE',   color: '#1a3a8f', icon: 'pilgrim', double: true },
  { city: 'Roncesvalles',            top: 'REAL COLEGIATA',       bottom: 'RONCESVALLES · NAV', color: '#3d2000', icon: 'cross',   double: true },
  // ... 20 entradas adicionais cobrindo Pamplona, Burgos, León, Sarria, Santiago etc.
];
```

**`renderStampIcon(icon, color)`** — função SVG com 6 ícones:
- `cross`: cruz latina
- `shell`: concha vieira com linhas irradiando
- `star`: estrela de 5 pontas (polígono calculado)
- `church`: silhueta de igreja com portal e cruz no topo
- `crown`: coroa de 3 pontas
- `pilgrim`: peregrino com bordão

**SVG stamp por carimbo:**
```tsx
<svg viewBox="0 0 100 70" width="100%" height="100%">
  <ellipse cx="50" cy="35" rx="46" ry="30" fill="none" stroke={color} strokeWidth="1.8"/>
  {double && <ellipse cx="50" cy="35" rx="40" ry="24" fill="none" stroke={color} strokeWidth="0.7"/>}
  <text y="13.5">{top}</text>
  {renderStampIcon(icon, color)}
  <text y="60">{bottom}</text>
</svg>
```

Cada carimbo tem cor única (azul-marinho, castanho, verde, bordô, roxo, teal) e dupla borda opcional — visualmente similar a selos reais da credencial do peregrino.

---

#### 4. Layout dos selos corrigido + contagem dinâmica por rota

**Problema de overflow:** 28 selos em 5 colunas = 6 linhas. Com `padding: sp(16)` e `gap: sp(4)`, extravasava a altura da página (340px).

**Correções de espaçamento:**
- Padding externo: `sp(16)` → `sp(8)`
- Gap entre células: `sp(4)` → `sp(2)`
- Margem do título: `sp(10)` → `sp(4)`
- Margem do rodapé: `sp(8)` → `sp(3)`

**Nova lógica de colunas:**
```tsx
const cols = displayCount <= 20 ? 5 : displayCount <= 36 ? 6 : 7;
// Para 28 selos (Francés demo): 6 colunas → 5 linhas → cabe na página ✓
```

**Contagem dinâmica por rota (usuário logado):**
```tsx
const routeSlots: Record<string, number> = {
  'Camino Francés': 36, 'Camino Português': 22, 'Camino del Norte': 28,
  'Via de la Plata': 26, 'Camino Inglés': 16, 'Camino Primitivo': 24,
  'Camino Aragonés': 18, 'Camino de Madrid': 16, 'Camino Sanabrés': 22, ...
};
const displayCount = Math.max(realCount, routeSlots[bookData.route] ?? 28);
```
O álbum exibe o número de slots esperado para a rota — nunca menos que os selos reais coletados.

---

#### 5. Estado final aprovado dos 50 layouts (todas as páginas)

**✅ Todas as 50 páginas de fotos aprovadas pelo usuário. Configuração de modelo e imagens congelada.**

---

### Sessão 25/04/2026 — Double-page spread corrigido + reposicionamento págs. 13-14 ↔ 25-26

#### 1. Reposicionamento de páginas (PHOTO_BLOCK)

O usuário pediu para trocar as posições das páginas 13-14 com as páginas 25-26:

| Antes | Após | Índice PHOTO_BLOCK |
|---|---|---|
| Pág. 13 = `quote-route` (texto de rota) | Pág. 13 = `spread-l` (metade esquerda do spread) | [12] |
| Pág. 14 = `full-bleed` (1 foto) | Pág. 14 = `spread-r` (metade direita do spread) | [13] |
| Pág. 25 = `duo-stacked` (2 paisagens empilhadas) | Pág. 25 = `quote-route` (texto de rota) | [24] |
| Pág. 26 = `duo-portrait-margin` (2 retratos) | Pág. 26 = `one-landscape-margin` (1 paisagem) | [25] |

Resultado: o double-page spread (uma foto dividida em duas páginas) ficou nas págs. 13-14 — posição central do livro, mais impactante visualmente.

---

#### 2. Fix crítico: double-page spread (págs. 13+14) — abordagem background-image

**Problema original:** O spread usava `<img width:200% objectFit:cover>`. Essa abordagem não cria uma divisão matemática precisa — ambas as páginas exibiam o mesmo recorte da imagem (duplicação visual), não meades distintas.

**Causa raiz:** `objectFit:cover` recalcula o recorte relativo ao container de cada página individualmente. Cada página tem seu próprio 440px × 340px — o cálculo de crop é independente, então ambas as páginas "veem" a parte central da imagem.

**Solução implementada — `background-image` com `background-size: 200% auto`:**

```tsx
// spread-l — mostra a METADE ESQUERDA da imagem
case 'spread-l': {
  const spreadUrl = def.src ?? (slots[0] >= 0 ? ph(slots[0]) : null);
  const hasSpreadPhoto = spreadUrl && !spreadUrl.startsWith('__stamp__');
  return (
    <div style={{
      width: '100%', height: '100%', backgroundColor: '#E8E4D9',
      ...(hasSpreadPhoto ? {
        backgroundImage: `url(${spreadUrl})`,
        backgroundSize: '200% auto',
        backgroundPosition: '0% center',
        backgroundRepeat: 'no-repeat',
      } : {}),
    }} />
  );
}

// spread-r — mostra a METADE DIREITA da mesma imagem
case 'spread-r': {
  const spreadUrlR = def.src ?? (slots[0] >= 0 ? ph(slots[0]) : null);
  const hasSpreadPhotoR = spreadUrlR && !spreadUrlR.startsWith('__stamp__');
  return (
    <div style={{
      width: '100%', height: '100%', backgroundColor: '#E8E4D9',
      ...(hasSpreadPhotoR ? {
        backgroundImage: `url(${spreadUrlR})`,
        backgroundSize: '200% auto',
        backgroundPosition: '100% center',
        backgroundRepeat: 'no-repeat',
      } : {}),
    }} />
  );
}
```

**Por que funciona:** `background-size: 200% auto` escala a imagem para ocupar exatamente 880px de largura (2× a largura de uma página). `background-position: 0% center` mostra os primeiros 440px (metade esquerda); `background-position: 100% center` mostra os últimos 440px (metade direita). O sistema de coordenadas de `background-position` garante a divisão matemática precisa — ao contrário do `objectFit`.

---

#### 3. Campo `src?: string` na interface `PageDef`

Para fixar uma imagem específica no spread (independente das fotos do usuário), foi adicionado o campo `src` na interface:

```tsx
interface PageDef { kind: PageKind; p?: number | number[]; ck?: 'c1' | 'c2' | 'c3'; o?: ('l' | 'p' | 'any')[]; src?: string }
```

As entradas do spread no PHOTO_BLOCK receberam a imagem hardcoded:

```tsx
{ kind: 'spread-l', p: 0, o: ['l'], src: '/img-apoio/card8-granja-de-moreruela.png' }, // p15 pág. 13
{ kind: 'spread-r',                  src: '/img-apoio/card8-granja-de-moreruela.png' }, // p16 pág. 14
```

A imagem `/img-apoio/card8-granja-de-moreruela.png` é uma foto panorâmica da Granja de Moreruela (Caminho Sanabrés), escolhida pelo usuário. A prioridade de resolução é: `def.src` → `ph(slots[0])` → placeholder bege.

---

### Sessão 24/04/2026 (parte 2) — Layout do livro interativo `/book` — correções e arquitetura

#### 1. Correções de layout aprovadas pelo usuário (via screenshots comparativos)

| Página | Case | Problema | Correção |
|--------|------|----------|----------|
| Pag. 7 | `offset-two` | Foto esquerda (paisagem) não sangrava até a base — `top:24% + height:57% = 81%`, gap de 19% na borda inferior | `height: 57%` → `76%` (24+76=100%, bleed correto) |
| Pag. 11 | `stagger-2` | Fotos com altura 82% deixavam espaço excessivo nas bordas não-ancoradas | `height: 82%` → `92%` |
| Pag. 20 | `duo-stagger` | Largura das fotos muito estreita (47-50%), layout visivelmente menor que o Canva | `width: 47/50%` → `58%` |
| Pag. 33 e 37 | `text-photo-r` | Padding ao redor da foto usava `background: cellBg` (bege), gerando borda colorida indesejada | `background: cellBg` → `background: '#fff'` (borda branca = mesma cor da página) |
| Pag. 48 | `photo-caption` | Foto diminuída demais (60%), espaço de texto excessivo, fonte da legenda ilegível | `flex: 60%` → `73%`, fonte `fs(0.56)` → `fs(0.68)` |

**Observação crítica de sangria (bleed):** O usuário identificou que fotos ancoradas a bordas (via `top:0`/`bottom:0`/`left:0`/`right:0`) devem literalmente tocar a borda da página — sem gap acidental. Fotos com offset intencional (ex: `top:24%`) devem ter `height` calculado para atingir a borda oposta (`height = 100% - offset%`).

---

#### 2. Refatoração arquitetural — distribuição inteligente de fotos por orientação

**Problema identificado:** O sistema distribuía fotos sequencialmente, ignorando se eram landscape ou portrait. Uma foto portrait em slot landscape gerava espaços vazios (barras cinzas/beges). O `pimg()` também não renderizava fotos reais.

**Mudanças implementadas em `BookPage.tsx`:**

**a) `PageDef` interface** — novo campo `o`:
```tsx
interface PageDef { kind: PageKind; p?: number | number[]; ck?: 'c1' | 'c2' | 'c3'; o?: ('l' | 'p' | 'any')[] }
```
- `o`: array de orientações por slot. `'l'` = landscape, `'p'` = portrait, `'any'` = qualquer

**b) `PHOTO_BLOCK`** — todos os 50 layouts receberam orientações por slot:
```tsx
{ kind: 'offset-two', p:[0,1], o:['l','p'] }      // slot 0 = landscape, slot 1 = portrait
{ kind: 'stagger-2', p:[0,1], o:['p','p'] }        // ambos portrait
{ kind: 'duo-stagger', p:[0,1], o:['l','l'] }      // ambos landscape
{ kind: 'one-left-two-right', p:[0,1,2], o:['p','l','l'] }  // 1 portrait + 2 landscape
```

**c) `buildPhotoSlotMap`** — novo parâmetro `photoOrientations?: ('l' | 'p')[]`:
- Sem orientações → modo sequencial (fallback compatível)
- Com orientações → separa fotos em duas filas (`lQueue` e `pQueue`) e serve cada slot com a orientação preferida; fallback automático para a outra fila se esgotada
- Detecta `spread-r` e reutiliza o slot do `spread-l` anterior (sem consumir nova foto)

**d) Hook `usePhotoOrientations(urls)`** — novo hook:
- Carrega cada foto via `document.createElement('img')` (não usar `new Image()` — `Image` está importado do lucide-react como ícone)
- Mede `naturalWidth` vs `naturalHeight` → retorna `'l'` ou `'p'`
- Executa assincronamente, cancelável, re-executa apenas quando URLs mudam
- `useEffect` depende de `urls.join('|')` para comparação de conteúdo (não referência)

**e) `pimg(slotIdx)`** — agora renderiza foto real:
```tsx
const pimg = (slotIdx: number, style?) => {
  const url = ph(slotIdx); // usa ph() já existente que lê photoAssignments e allPhotos
  if (url && !url.startsWith('__stamp__')) {
    return <img src={url} style={{ width:'100%', height:'100%', objectFit:'cover', objectPosition:'center' }} />;
  }
  return <div style={{ background: '#E8E4D9' }} />; // placeholder bege (modo sem fotos)
};
```

**f) `InteractiveBook` e `StepCustomize`** — ambos usam o hook e passam orientações:
```tsx
const photoOrientations = usePhotoOrientations(bookData.allPhotos);
const slotMap = buildPhotoSlotMap(pageDefs, photoOrientations.length > 0 ? photoOrientations : undefined);
```
No `StepCustomize`, `photoOrientations` foi adicionado às dependências do `useMemo` que computa o `slotMap`.

---

#### 3. Trocas de layout por decisão do usuário

O usuário optou por substituir layouts que continuavam problemáticos por layouts já aprovados:

| Página (user) | PHOTO_BLOCK idx | Antes | Depois | Motivo |
|---|---|---|---|---|
| Pag. 7 | [6] | `offset-two` (2 fotos) | `grid-2x2` (4 fotos) | Igual ao modelo da pág. 16, já aprovado |
| Pag. 11 | [10] | `stagger-2` (2 fotos) | `one-left-two-right` (3 fotos) | Igual ao modelo da pág. 27, já aprovado |
| Pag. 13 | [12] | `full-bleed` (1 foto) | `spread-l` | Double-page spread — metade esquerda |
| Pag. 14 | [13] | `full-bleed` (1 foto) | `spread-r` | Double-page spread — metade direita (1 foto total) |
| Pag. 20 | [19] | `duo-stagger` (2 fotos) | `trio-centered` (3 fotos) | Igual ao modelo da pág. 19, já aprovado |

**Implementação do double-page spread (`spread-l` + `spread-r`):**
- Dois novos `PageKind` adicionados: `'spread-l'` e `'spread-r'`
- `spread-l`: foto com `width:200%, position:left:0, objectPosition:'0% center'` — mostra metade esquerda
- `spread-r`: foto com `width:200%, position:right:0, objectPosition:'100% center'` — mostra metade direita
- Ambos compartilham **o mesmo slot de foto** (slot do `spread-l` é reutilizado pelo `spread-r` sem consumir nova foto)
- Quando o livro está aberto nas pág. 13-14, a foto preenche as duas páginas como uma única imagem panorâmica
- `kindLabel` no editor atualizado: `'spread-l': 'Spread esquerda'`, `'spread-r': 'Spread direita'`

---

#### 4. Estado atual dos layouts do livro (50 páginas)

Todos os 50 layouts foram revisados. Status por página:

| Pág. | Layout | Status |
|------|--------|--------|
| 1 | `full-bleed` | ✅ Aprovado |
| 2 | `duo-margin` | ✅ Aprovado |
| 3 | `photo-text-r` | ✅ Aprovado |
| 4 | `full-bleed` | ✅ Aprovado |
| 5 | `trio-centered` | ✅ Aprovado |
| 6 | `quote-route` | ✅ Aprovado |
| 7 | `grid-2x2` | ✅ Trocado (era offset-two) |
| 8 | `full-bleed` | ✅ Aprovado |
| 9 | `one-centered` | ✅ Aprovado |
| 10 | `one-portrait-margin` | ✅ Aprovado |
| 11 | `one-left-two-right` | ✅ Trocado (era stagger-2) |
| 12 | `one-landscape-margin` | ✅ Aprovado |
| 13 | `spread-l` | ✅ Spread págs. 13-14 — metade esquerda. Imagem: `card8-granja-de-moreruela.png`. Fix: `background-size:200% auto` |
| 14 | `spread-r` | ✅ Spread págs. 13-14 — metade direita. Mesma imagem. Fix: `background-position:100% center` |
| 15 | `two-left-one-right` | ✅ Aprovado |
| 16 | `grid-2x2` | ✅ Aprovado |
| 17 | `photo-text-r` | ✅ Aprovado |
| 18 | `full-bleed` | ✅ Aprovado |
| 19 | `trio-centered` | ✅ Aprovado |
| 20 | `trio-centered` | ✅ Trocado (era duo-stagger) |
| 21–50 | vários | ✅ Todos aprovados na sessão anterior |

---

#### 5. Mapeamento de páginas (referência permanente)

- **User page N = PHOTO_BLOCK[N-1]** (N de 1 a 48)
- PHOTO_BLOCK[0] = p3 (Canva), PHOTO_BLOCK[47] = p50 (Canva)
- Pag. 49 do usuário = página `stamps` (selos, fora do PHOTO_BLOCK)
- O flipbook começa em `verso-capa` (idx 0) + `preface` (idx 1)
- Flipbook page index = User page N + 1 (ex: user pág. 13 = flipbook idx 14)

---

### Sessão 24/04/2026 — Revisão de estado + contas externas + RLS Supabase

#### ⚠️ REGRA DE OURO DESTE DOCUMENTO
**Nunca apagar nada do status.md. Nunca resumir ou condensar histórico anterior. Sempre acrescentar novas seções no topo do histórico. O documento deve crescer, nunca encolher. Qualquer IA ou desenvolvedor que receber este arquivo deve seguir esta regra.**

---

#### 1. Contas externas — situação atual

| Serviço | Status | Detalhe |
|---|---|---|
| **Stripe** | ✅ Conta ativa | Ko-fi vinculado sem erros. Dashboard confirmado em 24/04/2026. Cloudflare Pages ainda com chaves de teste (`sk_test_` / `pk_test_`). Migração para live pendente (item 6a). |
| **Ko-fi** | ✅ Ativo e funcional | `ko-fi.com/meuperegrino`. Stripe conectado sem erros. Moeda EUR. **Uso exclusivo: doações via app Peregrino — não vinculado ao site/landing.** |
| **Nomad** | ⚠️ Conta aberta, mas inutilizável para Stripe | Ver diagnóstico abaixo. |

---

#### 2. Diagnóstico crítico: Stripe Brasil não aceita Nomad

**Problema descoberto em 24/04/2026:**
A conta Stripe está registrada no **Brasil** (CPF/CNPJ verificado). Contas Stripe Brasil têm uma limitação estrutural: **só aceitam bancos brasileiros como conta de saque, e só pagam em BRL**.

Ao tentar adicionar a conta Nomad (Community Federal Savings Bank — banco americano) nas configurações do Stripe (Settings → Contas e agendamento para repasses externos), o formulário só exibe bancos brasileiros. Não há opção para banco estrangeiro.

**O que estava configurado antes:**
- Banco C6 S.A. — agência 0001 — conta ••••2530 — moeda BRL (já cadastrado e funcionando)

**Por que o Nomad não funciona aqui:**
O alerta do Stripe confirma: *"A conta bancária que recebe repasses precisa estar associada ao mesmo ID fiscal (CPF ou CNPJ) da pessoa física ou jurídica registrada na sua conta Stripe."*
O Nomad é um banco americano e não pode ser vinculado a um CPF/CNPJ brasileiro no Stripe.

**Erro de recomendação anterior (registrado para não repetir):**
Em sessões anteriores, a IA recomendou abrir a conta Nomad para receber repasses do Stripe em EUR/USD. Esta recomendação estava **errada** — a limitação do Stripe Brasil era desconhecida no momento. O tempo gasto abrindo a conta Nomad foi perdido para este fim. Wise Business foi citado como alternativa, mas também **não foi verificado** se funciona com Stripe Brasil — não recomendar sem confirmar.

**Decisão tomada:**
- C6 permanece como conta de saque do Stripe
- Stripe cobra cliente em EUR → converte para BRL → deposita no C6
- Perda cambial EUR→BRL existe mas é aceitável no volume inicial
- A conta Nomad pode ser usada para outros fins (ex.: receber repasses do Ko-fi se necessário)
- **Não recomendar nova solução de conta internacional sem testar/confirmar primeiro**

**Fluxo de recebimento real (revisado):**
```
Cliente compra livro → Stripe cobra em EUR
  → Stripe converte para BRL → deposita no C6 (Brasil)

Cliente doa via app → Ko-fi processa em EUR
  → Repasse Ko-fi → conta bancária configurada no Ko-fi (verificar)
```

---

#### 3. Alerta crítico Supabase: RLS desativado (rls_disabled_in_public)

**Alerta recebido em 24/04/2026:** `rls_disabled_in_public` — Row-Level Security desativado em todas as tabelas do schema public.

**Por que é crítico:**
A `VITE_SUPABASE_ANON_KEY` está embutida no bundle JavaScript público do site (variáveis `VITE_` são expostas no browser). Com RLS desativado, qualquer pessoa que inspecionar o bundle pode usar a chave + URL do Supabase para consultar **todos os dados de todos os usuários**:
```
SELECT * FROM photos   -- fotos de todos os peregrinos
SELECT * FROM profiles -- perfis de todos os usuários
SELECT * FROM stamps   -- carimbos de todos os peregrinos
```
O site está live em `meuperegrino.com` com usuários reais autenticados. Isso é uma vulnerabilidade ativa.

**Tabelas encontradas no Supabase (schema public):**

| Tabela | RLS | Tipo | Ação necessária |
|---|---|---|---|
| `photos` | ❌ Desativado | Dados do usuário | Habilitar RLS |
| `profiles` | ❌ Desativado | Dados do usuário | Habilitar RLS |
| `stamps` | ❌ Desativado | Dados do usuário | Habilitar RLS |
| `daily_logs` | ❌ Desativado | Provável: dados do usuário | Verificar colunas antes |
| `sos_messages` | ❌ Desativado | Dados sensíveis (SOS) | Verificar colunas antes |
| `sos_requests` | ❌ Desativado | Dados sensíveis (SOS) | Verificar colunas antes |
| `establishment_requests` | ❌ Desativado | Provável: dados do usuário | Verificar colunas antes |
| `establishments` | ❌ Desativado | Provavelmente público (POIs) | Verificar uso |
| `routes` | UNRESTRICTED | Dados públicos (rotas do Caminho) | ✅ Correto — não mexer |
| `spatial_ref_sys` | UNRESTRICTED | Sistema PostGIS | ✅ Correto — não mexer |
| `geography_columns` | Sistema PostGIS | Sistema | ✅ Correto — não mexer |
| `geometry_columns` | Sistema PostGIS | Sistema | ✅ Correto — não mexer |

**Nota:** A tabela `journeys` mencionada no código (`loadUserData`) **não apareceu na listagem do Table Editor**. Pode não existir ainda ou estar em outro schema.

**Colunas de usuário já mapeadas pelo código (`BookPage.tsx`):**
- `profiles` → coluna de usuário: `id` (`.eq('id', userId)`)
- `stamps` → coluna de usuário: `pilgrim_id` (`.eq('pilgrim_id', userId)`)
- `photos` → coluna de usuário: `pilgrim_id` (`.eq('pilgrim_id', userId)`)

**SQL pronto para rodar (tabelas com colunas confirmadas):**
```sql
-- PROFILES (coluna: id)
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
CREATE POLICY "profiles_select_own" ON public.profiles
  FOR SELECT USING (auth.uid() = id);
CREATE POLICY "profiles_insert_own" ON public.profiles
  FOR INSERT WITH CHECK (auth.uid() = id);
CREATE POLICY "profiles_update_own" ON public.profiles
  FOR UPDATE USING (auth.uid() = id);

-- STAMPS (coluna: pilgrim_id)
ALTER TABLE public.stamps ENABLE ROW LEVEL SECURITY;
CREATE POLICY "stamps_select_own" ON public.stamps
  FOR SELECT USING (auth.uid() = pilgrim_id);
CREATE POLICY "stamps_insert_own" ON public.stamps
  FOR INSERT WITH CHECK (auth.uid() = pilgrim_id);
CREATE POLICY "stamps_update_own" ON public.stamps
  FOR UPDATE USING (auth.uid() = pilgrim_id);

-- PHOTOS (coluna: pilgrim_id)
ALTER TABLE public.photos ENABLE ROW LEVEL SECURITY;
CREATE POLICY "photos_select_own" ON public.photos
  FOR SELECT USING (auth.uid() = pilgrim_id);
CREATE POLICY "photos_insert_own" ON public.photos
  FOR INSERT WITH CHECK (auth.uid() = pilgrim_id);
CREATE POLICY "photos_update_own" ON public.photos
  FOR UPDATE USING (auth.uid() = pilgrim_id);
```

**Colunas mapeadas nas 4 tabelas restantes:**

| Tabela | Coluna do usuário | Registros | Observação |
|---|---|---|---|
| `sos_messages` | `sender_id` | 2 | Coluna diferente do padrão `pilgrim_id` |
| `daily_logs` | `pilgrim_id` | 0 | Já tinha 5 políticas RLS definidas — só habilitou |
| `establishment_requests` | `requester_user_id` | 0 | Coluna com nome diferente |
| `establishments` | sem coluna de usuário | 100+ | POIs públicos do Caminho — leitura pública |

**✅ SQL executado em 24/04/2026 — "No rows returned" (sucesso)**

RLS habilitado em todas as tabelas relevantes. Políticas aplicadas:
- `profiles` → SELECT/INSERT/UPDATE onde `auth.uid() = id`
- `stamps`, `photos`, `daily_logs` → SELECT/INSERT/UPDATE onde `auth.uid() = pilgrim_id`
- `sos_requests` → SELECT para qualquer autenticado (`auth.role() = 'authenticated'`) — feed comunitário, todos os peregrinos veem todos os pedidos ativos; INSERT/UPDATE onde `auth.uid() = pilgrim_id`
- `sos_messages` → SELECT para qualquer autenticado (`auth.role() = 'authenticated'`) — qualquer peregrino pode ler mensagens de qualquer thread SOS; INSERT onde `sender_id = auth.uid()`
- `establishment_requests` → SELECT/INSERT/UPDATE onde `auth.uid() = requester_user_id`
- `establishments` → SELECT público (`USING (true)`); escrita bloqueada para clientes (só `service_role`)
- `routes` → RLS ativado com SELECT público (`USING (true)`) — leitura livre, escrita bloqueada para clientes. Corrigido em 24/04/2026 após segunda opinião: UNRESTRICTED permitia DELETE/UPDATE por qualquer pessoa com a chave anon.
- `spatial_ref_sys` → mantido UNRESTRICTED — tabela interna do PostgreSQL/PostGIS, o sistema precisa de acesso livre. Não mexer.
- `daily_logs` → tinha 5 políticas pré-existentes; apenas `ALTER TABLE ENABLE ROW LEVEL SECURITY` executado

**Correção aplicada em 24/04/2026 — análise de segunda opinião:**
Uma IA externa sinalizou que `sos_requests` SELECT estava incorreto. Verificado no código do app (`sos.js`): `getSosRequests()` busca todos os pedidos sem filtro de usuário — é um feed comunitário. A política foi corrigida para `auth.role() = 'authenticated'`. Mesma correção aplicada a `sos_messages` pois `getChatMessages()` também não filtra por usuário. A sugestão de `owner_user_id` em `establishments` foi descartada: coluna não existe na tabela e o app nunca escreve em establishments.

**✅ Testado em 24/04/2026:** app funcionando normalmente após RLS. Feed SOS, stamps e fotos confirmados.

---

### Sessão 23/04/2026 — Fix definitivo capa duplicada + diagnóstico fotos

#### Fix definitivo: capa não aparece mais ao abrir o livro (`BookPage.tsx`)

**Problema:** Ontem a correção foi incompleta. `startPage={1}` fazia react-pageflip exibir o spread das páginas 0+1 (capa esq + verso-capa dir). A capa continuava visível.

**Causa raiz:** A capa estava no array `pageDefs` como índice 0. O react-pageflip, ao receber `startPage=1`, mostrava o spread que contém a página 1, que inclui a página 0 (capa) na esquerda.

**Solução definitiva:** Remover `{ kind: 'cover' }` de `generatePageDefs()`. A capa pertence exclusivamente ao preview do livro fechado (HTML customizado) — nunca ao flipbook.

Resultado após fix:
```
pageDefs[0] = verso-capa  → esquerda do 1º spread ✅
pageDefs[1] = prefácio    → direita do 1º spread  ✅
pageDefs[2+] = fotos...
```

Com `startPage={1}`, o flipbook abre mostrando: **logo Peregrino (esq) + prefácio (dir)**.

---

#### Diagnóstico: fotos não preenchem slots corretamente

**Problema identificado:** Em praticamente todas as páginas do livro interativo, as fotos não se encaixam corretamente nos seus slots — aparecem com espaço em branco ao redor.

**Causa raiz técnica:**
- `object-contain` foi aplicado nos layouts "emoldurados" para evitar corte de fotos
- Porém `object-contain` faz a foto aparecer inteira dentro de um container maior, deixando fundo branco nas bordas internas
- O container não tem a proporção correta para a foto que recebe

**O modelo correto (como o Canva foi desenhado):**
```
[ margem branca ][ container com proporção correta + foto object-cover ][ margem branca ]
```

**O que está errado hoje:**
```
[ container grande + foto object-contain + fundo branco interno ]
```

A diferença: o branco deve ser **ao redor** do container (margem da página), não **dentro** do container.

**Solução planejada para próxima sessão:**
Revisar cada layout do `page-model/` e definir para cada slot:
1. A **proporção correta** do container (portrait 3:4, landscape 4:3, quadrado 1:1)
2. Usar `object-cover` dentro do container proporcionado
3. O branco visível é a margem da página — CSS padding/gap — não o fundo da foto

**Prioridade:** Alta — é o principal problema visual do livro interativo e afeta a conversão.

---

### Sessão 23/04/2026 (tarde) — Verificação de estado + Token GitHub + Trabalho via Gemini

#### Contexto da sessão

Crédito Claude esgotado durante o dia. O trabalho de desenvolvimento foi realizado via **Gemini 3 Flash** no chat do **Antigravity** (VS Code). Esta sub-sessão serviu apenas para:
1. Verificar se o `status.md` estava atualizado como fonte da verdade antes de iniciar o trabalho com o Gemini
2. Resolver situação do token GitHub ao retornar
3. Encerrar o dia com registro

#### Verificação do status.md

O `status.md` foi lido e confirmado atualizado. Última entrada registrada: sessão da manhã de 23/04/2026 (fix capa duplicada + diagnóstico fotos). Documento apto para ser passado como contexto para qualquer IA ou desenvolvedor externo.

#### Trabalho realizado via Gemini 3 Flash (Antigravity)

O usuário trabalhou no projeto durante o dia usando Gemini 3 Flash como assistente. As alterações realizadas não foram detalhadas nesta sessão. Verificação do `git log` ao retornar mostrou que **nenhum commit novo foi gerado** — os commits existentes mais recentes são da manhã de 23/04/2026:

```
f1d35aa docs: status.md — pendência #9c design fraco na seção Personalizar
9752b55 docs: status.md — plano redesign Personalizar + proporções fotos celular
1ce9c53 docs: status.md — diagnóstico fotos + fix capa duplicada documentados
2d53dec fix: corrige capa duplicada no flipbook — remove cover do pageDefs
da1539f feat: frete Lulu real + correções livro interativo (selos + capa duplicada)
```

**Possível explicação:** alterações foram feitas mas não commitadas, ou a sessão Gemini foi usada apenas para estudo/planejamento. A verificar na próxima sessão com `git diff`.

#### Token GitHub — situação documentada

**Problema relatado:** token anterior havia expirado.

**Ação do usuário:** gerado novo **PAT (Personal Access Token)** no GitHub com **validade permanente**.

**Diagnóstico técnico:**
- O remote do projeto usa **SSH**: `git@github-entreambientes:entreambientesoficial/peregrino.site.git`
- PAT serve para autenticação **HTTPS** — incompatível com o remote SSH diretamente
- `git fetch origin` executado com sucesso → **SSH está funcionando normalmente**
- `git log origin/main..HEAD` retornou vazio → **branch local em sync perfeito com origin**
- Nenhuma troca de remote foi necessária

**Conclusão:** o token SSH configurado na máquina (`~/.ssh/`) **não expirou**. O PAT gerado é para autenticação HTTPS e não era necessário para o push atual. Manter o PAT guardado em local seguro (gerenciador de senhas) para eventual migração futura do remote de SSH para HTTPS.

**⚠️ Alerta de segurança:** o PAT foi compartilhado diretamente no chat. Tokens compartilhados em chat ficam no histórico da conversa. Recomendado: revogar o token atual em `github.com → Settings → Developer settings → Personal access tokens` e gerar um novo se houver risco de exposição do histórico desta conversa.

#### Estado do repositório ao encerrar o dia

| Item | Estado |
|---|---|
| Branch | `main` |
| Remote | SSH — em sync com origin |
| Commits pendentes de push | Nenhum |
| Arquivos modificados não commitados | A verificar (`git diff` na próxima sessão) |
| Pasta não rastreada | `lulu-book-template-all-us-letter-landscape/` |

**Sobre a pasta `lulu-book-template-all-us-letter-landscape/`:** é material de referência (templates oficiais Lulu.com para layout e configuração do PDF). Não deve ser commitada no repositório — adicionar ao `.gitignore` se ainda não estiver. Os arquivos relevantes já foram documentados neste `status.md` (sessão 19/04/2026).

---

### Sessão 22/04/2026 — Frete Lulu + Correções livro interativo

#### Credenciais Lulu.com configuradas

- Conta Lulu: `entreambientes.oficial@gmail.com` (tipo: Business) — mantida (email interno, clientes não veem)
- API Keys geradas em `developers.lulu.com` → Client Key + Client Secret
- Variáveis adicionadas no Cloudflare Pages → Settings → Variables and Secrets:
  - `LULU_CLIENT_KEY` (Secret)
  - `LULU_CLIENT_SECRET` (Secret)
- Método de pagamento Lulu ainda **não cadastrado** — necessário para que a Lulu possa cobrar pela impressão quando pedidos chegarem

#### Novo Worker: `functions/lulu-shipping.js`

Cloudflare Pages Function que:
1. Autentica na API Lulu via OAuth2 Client Credentials (`grant_type=client_credentials`)
2. Consulta `POST https://api.lulu.com/shipping-options/` com `country_code` e `page_count`
3. Retorna opções de frete ordenadas por preço (mais barata primeiro)

- `POD_PACKAGE_ID = '1100X0850FCSTDCW060UW444MNG'` — US Letter Landscape, Full Color, Hardcover
  - **⚠️ Nota crítica:** verificar este código em `developers.lulu.com/products` na primeira execução real. Se a API retornar erro 400, o código precisa ser corrigido.
- Falha silenciosa: se a API Lulu falhar, o frontend continua sem frete (não bloqueia o checkout)

#### Atualização: `StepShipping` (`BookPage.tsx`)

- Novo estado: `shippingOpts`, `shippingLoading`, `selectedShipping`
- `useEffect` com debounce de 600ms: busca frete ao mudar o país
- Caixa de resumo atualizada:
  - Spinner enquanto carrega
  - Se API retornar 1 opção: exibe label + preço
  - Se retornar 2+: radio buttons para o usuário escolher (Standard / Express)
  - Linha de **Total** aparece quando frete está calculado (livro + frete)
- `handlePay` passa `shippingCostCents` e `shippingLabel` para o Worker de checkout

#### Atualização: `functions/create-checkout.js`

- Aceita novos campos: `shippingCostCents` e `shippingLabel`
- Se `shippingCostCents > 0`: adiciona segundo `line_item` no Stripe Checkout com o custo do frete
- Stripe exibe dois itens separados na tela de pagamento: "Coffee Table Book" + "Frete"

#### Fluxo completo após implementação

```
Usuário seleciona país → Worker consulta Lulu API → exibe frete real + total
Usuário clica "Continuar para pagamento" →
  Worker cria sessão Stripe com 2 line items (livro + frete) →
  Stripe cobra valor correto
```

---

#### Análise dos modelos de página (`/page-model/`)

Pasta `page-model/` adicionada à raiz do projeto com 54 imagens PNG exportadas do Canva pelo usuário. Representam o layout visual desejado para cada página do livro.

**Diagnóstico das imagens:**
- Dimensões: 2000×1545px — proporção 1.294 = exatamente 11÷8.5" ✅
- Orientação landscape ✅
- Resolução: ~182 DPI — abaixo do mínimo Lulu (300 DPI), mas adequado como referência de layout
- Para o PDF final: páginas precisam ser geradas em 3300×2550px (300 DPI)

**Layouts identificados:** 54 modelos cobrindo capa, verso da capa, prefácio, foto inteira, foto dupla, foto + texto, texto + sub-texto, selos, contracapa, verso da contracapa e variações diversas.

---

#### Correção: Página de selos — grade dinâmica (`BookPage.tsx`)

**Problema:** Mínimo fixo de 28 slots não refletia a realidade. Rotas curtas (Camino Inglês) têm ~20 selos; rotas longas (Camino Francês) têm 60-80+.

**Correção aplicada:**
- Mínimo reduzido de 28 → **16** (alinhado com modelo Canva)
- Grade de colunas ajustada:

| Selos | Colunas | Rotas típicas |
|---|---|---|
| até 16 | 4 | Inglês, Aragonês, Sanabres |
| até 30 | 5 | Português, Costa, Interior |
| acima de 30 | 6 | Francês, Plata, Primitivo |

- Slots em proporção landscape com `gridTemplateRows` explícito — preenchem a altura uniformemente
- Fundo branco limpo conforme modelo Canva
- Slots reais: mostram número do carimbo
- Slots vazios (demo/completados): mostram mock de código + cidade + data

**Nota:** Quando a geração de PDF (pendência #8) for implementada, a query do Supabase precisará buscar os detalhes reais de cada selo (local, data, código), não apenas a contagem.

---

#### Correção crítica: Livro interativo — capa duplicada ao abrir (`BookPage.tsx`)

**Problema:** Ao clicar para abrir o livro interativo, a capa aparecia duas vezes:
1. No preview do livro fechado (correto)
2. Como página 0 do flipbook (errado)

O que deveria aparecer ao abrir: **verso da capa** (esquerda) + **prefácio** (direita)

**Correção:** `startPage={0}` → `startPage={1}` no `HTMLFlipBook`

- O flipbook agora abre direto na página 1 (verso da capa + prefácio como primeiro spread)
- A capa (índice 0) permanece no array mas nunca é exibida no flipbook
- Botão ← na primeira página fecha o livro (volta ao preview fechado)
- Indicador de página atualizado:
  - Páginas 0-1: "Verso da capa"
  - Páginas intermediárias: "pág. X / Y" (contagem corrigida descontando páginas especiais)
  - Última página: "Contracapa"

---

### Sessão 20/04/2026 (cont.) — Modal PWA: fluxo corrigido + aviso Safari iOS

#### Correção do fluxo de instalação PWA (todos os 10 idiomas)

**Problema identificado 1:** Step 1 dizia "Acesse app.meuperegrino.com no Safari/Chrome" — o botão "Abrir o App" já faz exatamente isso. Instrução redundante e confusa.

**Problema identificado 2:** O botão "Instalar agora" (Android tab) chamava `beforeinstallprompt` da **landing page** (`meuperegrino.com`), não do app (`app.meuperegrino.com`). Instalaria o site de marketing como PWA, não o app. Bug grave.

**Correções aplicadas:**

Android — novo fluxo:
1. Clique em «Abrir o App» abaixo
2. Aguarde o banner de instalação do Chrome
3. Toque em «Instalar» quando aparecer
4. Sem banner? Toque em ⋮ → Adicionar à tela inicial *(fallback)*

iOS — novo fluxo:
1. Clique em «Abrir o App» abaixo (no Safari)
2. Toque no botão Compartilhar (□↑)
3. Toque em «Adicionar à Tela Início»
4. Confirme tocando em «Adicionar»

**Código removido de `LandingPage.tsx`:**
- `useState<any>(null)` para `installPrompt`
- `useEffect` com listener `beforeinstallprompt`
- `handleNativeInstall()` que chamava `installPrompt.prompt()`
- Botão "Instalar agora" condicional `{tab === 'android' && installPrompt && ...}`

**Nota técnica:** O banner de instalação no Android é gerenciado pelo `vite-plugin-pwa` de `app.meuperegrino.com`, não pela landing page. A landing page não deve capturar nem usar `beforeinstallprompt`.

#### Aviso Safari obrigatório — tab iOS

Adicionado alerta âmbar discreto no tab iOS, abaixo do hint "Siga os passos no Safari:":

> ⚠︎ A instalação só funciona pelo Safari. Se estiver no Chrome, abra o Safari primeiro.

- Aplicado em **10 idiomas** via nova chave `modal.pwa.ios.safari_note`
- Estilo: `bg-amber-50 border border-amber-200 text-amber-700/70` — visível mas não intrusivo
- Motivação: usuários iPhone frequentemente usam Chrome como browser padrão; a instalação de PWA no iOS é exclusiva do Safari (limitação da Apple)

**Commits:** `05eb1c8` (fluxo PWA) · `7dd60b8` (aviso Safari)

---

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

### 🔴 Segurança — urgente

| # | Item | Detalhe |
|---|---|---|
| S1 | ~~**Habilitar RLS no Supabase**~~ | ✅ **24/04/2026** — Concluído e testado. RLS ativo em todas as tabelas. App testado com conta real: feed SOS, stamps e fotos funcionando normalmente. |

### 🟠 Alta prioridade (funcionalidade de venda)

| # | Item | Detalhe |
|---|---|---|
| 6 | ~~**Configurar Stripe no Cloudflare**~~ | ✅ **20/04/2026** — Stripe configurado, webhook validado, checkout testado end-to-end em modo teste. |
| 6a | **⚠️ Migrar chaves Stripe para produção** | Conta Stripe ativa e Ko-fi vinculado (confirmado 24/04/2026). Conta é **brasileira** — repasses em BRL para C6. Cloudflare Pages ainda com chaves de teste. Pendente: substituir `STRIPE_SECRET_KEY` (sk_test_ → sk_live_), `STRIPE_PUBLIC_KEY` (pk_test_ → pk_live_) e `STRIPE_WEBHOOK_SECRET` (segredo do endpoint live) no Cloudflare Pages → Settings → Environment Variables. |
| 7 | ~~**Conta Lulu.com**~~ | ✅ **22/04/2026** — Conta `entreambientes.oficial@gmail.com` (Business). API Keys geradas e salvas no Cloudflare Pages (`LULU_CLIENT_KEY` + `LULU_CLIENT_SECRET`). |
| 7a | ~~**↳ Cálculo de frete real**~~ | ✅ **22/04/2026** — Worker `functions/lulu-shipping.js` criado. StepShipping busca frete ao selecionar país, exibe opções e total. Stripe cobra 2 line items (livro + frete). **Nota:** verificar `POD_PACKAGE_ID` na primeira transação real. |
| 8 | **Geração do PDF do livro** | Backend (Cloudflare Worker) que: (1) recebe evento pós-Stripe `checkout.session.completed`, (2) busca fotos do Supabase, (3) monta PDF landscape 11×8.5" com os layouts do livro, (4) envia para API Lulu, (5) Lulu imprime e entrega ao cliente. Maior tarefa técnica do projeto. |

### 🟡 Média prioridade

| # | Item | Detalhe |
|---|---|---|
| 7b | **↳ Cadastrar método de pagamento na Lulu** | Adicionar cartão em lulu.com → My Account → Payment Method. Necessário para que a Lulu possa cobrar pela impressão quando pedidos chegarem via API. Sem isso, print jobs falharão. |
| 7c | **↳ Verificar POD_PACKAGE_ID** | Na primeira transação real, verificar se `1100X0850FCSTDCW060UW444MNG` (US Letter Landscape, Full Color, Hardcover) é o código correto em `developers.lulu.com/products`. Se API retornar erro 400, corrigir em `functions/lulu-shipping.js`. |
| 8 | **Geração do PDF do livro** | Backend (Cloudflare Worker ou serviço externo) que: (1) recebe evento pós-Stripe `checkout.session.completed`, (2) busca fotos do Supabase, (3) monta PDF landscape 11×8.5" a 300 DPI com os layouts do livro (baseados nos modelos da pasta `page-model/`), (4) envia para API Lulu, (5) Lulu imprime e entrega. Maior tarefa técnica do projeto. Referência de layouts: `page-model/` (54 modelos PNG validados pelo usuário). |
| 9 | **Revisão completa do livro interativo — fotos não preenchem slots** | **Problema principal:** fotos aparecem com espaço em branco interno nos slots (object-contain em container grande). **Solução planejada:** revisar cada layout do `page-model/` e atribuir proporção correta a cada container. Fotos de celular têm proporções padrão: portrait = 3:4, landscape = 4:3. Slots devem ter `aspect-ratio` correspondente + `object-cover`. O branco visível deve ser `padding`/`gap` da página (margem externa), nunca fundo interno do container. Afeta praticamente todas as páginas. **Prioridade alta.** |
| 9a | **Redesign aba "Personalizar" — Fotos** | **Problema:** aba atual tem galeria separada dos slots do livro, sistema confuso e redundante. **Solução planejada (estilo Canva):** exibir o livro aberto no topo com fotos já posicionadas; galeria de fotos abaixo; arrastar foto da galeria para slot do livro substitui a foto; clique no slot abre opção de zoom/pan dentro do slot. Elimina a confusão atual de dois painéis separados. |
| 9b | **Redesign aba "Personalizar" — Textos** | **Problema:** lista técnica de campos por página sem feedback visual — usuário não sabe o que está editando. **Solução planejada:** remover a aba Textos e implementar edição inline diretamente no livro: clicar num bloco de texto no livro abre campo de edição no local. Igual ao comportamento do Canva. Elimina a aba completamente. |
| 9c | **Redesign visual da página "Personalize seu livro"** | **Problema:** fontes e cards dos seletores (modelo Essencial/Jornada/Legado e abas Capa/Textos/Fotos) estão pequenos, apagados e difíceis de ler. Design geral fraco. **Solução planejada:** aumentar tamanho das fontes, melhorar contraste dos cards não-selecionados, aumentar padding dos botões de aba, revisar hierarquia visual da seção inteira. Avaliar junto com o redesign das abas #9a e #9b. |
| 10 | **Teste do fluxo completo pós-login** | Logar com conta real do app → verificar se fotos carregam, rota e km exibem corretos, livro monta sem erros no console. |
| 11 | ~~**Ko-fi — conta**~~ | ✅ **24/04/2026** — Conta `ko-fi.com/meuperegrino` ativa e funcional. Stripe vinculado sem erros. Moeda: EUR. Valores sugeridos: €3/€5/€10. Mínimo: €3. **Uso: doações via app Peregrino (não site).** |
| 11a | **↳ Integrar Ko-fi no app** | Adicionar botão de doação no app (`entreambientesoficial/Peregrino`) que abre `https://ko-fi.com/meuperegrino`. Local sugerido: tela principal ou menu lateral. Tarefa rápida — só um botão com link externo. |
| 11b | **↳ Remover telefone dos dados públicos Stripe** | Após aprovação da conta Stripe: Configurações → Dados da empresa → remover telefone +55 11 99617 0706 dos dados públicos para não aparecer nas faturas dos clientes. |
| 12 | **⚠️ Conta Nomad — aberta mas inutilizável para Stripe** | Conta aberta (Community Federal Savings Bank, US, titular Anderson Del Arco). **Problema descoberto em 24/04/2026:** Stripe Brasil só aceita bancos brasileiros com CPF/CNPJ verificado — impossível adicionar Nomad. Conta C6 permanece como conta de saque do Stripe (BRL). Nomad pode ser usada para outros fins futuros. Dados bancários ACH guardados no gerenciador de senhas. **Não tentar novamente sem verificar mudança na política do Stripe Brasil.** |

### 🟢 Baixa prioridade

| # | Item | Detalhe |
|---|---|---|
| 13 | **Tradução dos termos legais** | Atualmente só PT-BR. Adicionar versão em EN quando o projeto começar a gerar receita. |
| 14 | **Limpar originais** | A pasta `img-apoio/img-webp/` na raiz do projeto (fora de `public/`) contém os JPGs originais das 89 fotos. Pode ser deletada para liberar ~180MB em disco sem impacto no site. |
| 15 | **Remover logs de debug** | `console.log('[Peregrino/photos]', ...)` e `console.log('Dados recuperados:', ...)` em `loadUserData` devem ser removidos antes do lançamento em produção. |

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

*Última atualização: 20/04/2026 (noite) — Sessão com Antigravity (Claude Sonnet 4.6)*
