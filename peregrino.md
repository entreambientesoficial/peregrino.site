## Skill: Scrollytelling & Immersive Landing Design (Peregrino)

**Objetivo:** Criar interfaces que contam uma história através do scroll, priorizando a atmosfera emocional do Caminho de Santiago em vez de uma estética puramente tecnológica.

### 🎨 Princípios Estéticos:
1. **Paleta Orgânica:** Usar exclusivamente `bg-[#E8E4D9]` (creme papel), `text-[#2D3A27]` (verde musgo) e acentos em `#8B4513` (couro). Evitar brancos puros ou sombras pretas pesadas.
2. **Tipografia de Contraste:** - Títulos em Serif (ex: 'Playfair Display') para evocar história e tradição.
   - Dados técnicos em Sans-serif (ex: 'Inter') para clareza e modernidade.
3. **Espaçamento Negativo:** Priorizar grandes margens e respiros entre seções. O conteúdo não deve parecer apertado.

### 🛠️ Regras de Implementação (Framer Motion):
1. **Sticky Stacking Cards:** Em seções de etapas (Caminho Francês), os cards devem usar `position: sticky` e `top: 20%`. Conforme o scroll avança, o card atual deve diminuir levemente de escala (`scale: 0.95`) enquanto o próximo card o sobrepõe.
2. **Parallax de Vídeo:** A Hero Section deve ter um efeito de `scale` sutil (ex: 1 para 1.1) vinculado ao `useScroll` para dar profundidade ao vídeo de fundo.
3. **Book Flip Animation:** O componente "Coffee Table Book" deve usar `useTransform` para mapear o progresso do scroll (`[0, 1]`) à rotação das páginas (`rotateY` de 0 para -180 graus).

### 🚫 Proibições (Anti-Pattern):
- NUNCA use seções com fundos alternados (zebra stripes) cinza e branco.
- NUNCA use ícones de biblioteca padrão (Lucide/FontAwesome) sem customização de cor ou estilo rústico.
- EVITAR botões com bordas arredondadas (pills). Preferir bordas quadradas ou levemente suavizadas com `border-b-2` para um look mais artesanal.