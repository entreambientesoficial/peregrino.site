# 🏔️ Projeto: Peregrino Landing Page - Status Report

Este documento serve como a "Fonte da Verdade" para o estado atual do desenvolvimento da Landing Page do App Peregrino. Se este projeto for transferido para outra IA ou desenvolvedor, este arquivo deve ser lido integralmente primeiro.

## 🎯 Escopo do Projeto
Criar uma Landing Page de alto impacto (Premium/Editorial) para o aplicativo **Peregrino**. O objetivo é transmitir uma sensação de "Guia de Luxo" e "Diário de Viagem", focando em texturas orgânicas, tipografia elegante e interações fluidas baseadas em scroll (storytelling).

---

## 🛠️ Stack Tecnológica
- **Framework**: React.js (Vite)
- **Estilização**: Tailwind CSS (Customizado com texturas e sombras táteis)
- **Animações**: Framer Motion (useScroll, useTransform)
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
| **DownloadModal** | ✅ Concluído | Modal premium com backdrop-blur, botões de loja e QR Code (Desktop). |
| **FeaturesSection** | ✅ Concluído | Grid bento de cards táteis. Bug de referência `QrCode` corrigido. |
| **JourneySection** | ⏸️ Pausado | **Efeito Baralho (Card Deck)**. Problema de sincronia de scroll pendente de resolução definitiva. |
| **BookSection** | 🕒 Pendente | Seção do "Livro de Café" com animação de páginas ou abertura. |

---

## 🚩 Problema Atual (Bloqueio)
### Seção de Rotas (JourneySection) - Efeito Sticky/Scroll

**O que foi tentado**:
- Implementação de um container de `600vh` ou `700vh` usando `sticky top-0`.
- Uso do `useScroll` do Framer Motion para animar o `y` e `opacity` dos cards baseados em slots de 0 a 1.
- Remoção de `overflow-x-hidden` do container raiz para destravar o `sticky`.
- Refatoração da centralização dos cards para `top: 50%` com `marginTop` para o scroll.

**Status**: O comportamento `sticky` ainda apresenta instabilidade (passando direto em alguns dispositivos/navegadores). Seção pausada temporariamente para focar na conversão e na BookSection.

---

## 🚀 Próximos Passos
1. **Implementar BookSection**: Criar a experiência imersiva do diário físico com animações 3D cinematográficas.
2. **Retomar JourneySection**: Investigar a herança de altura (`height: 100%`) no `html` e `body` ou conflitos de Viewport via Vite.
3. **Ajuste Fino Mobile**: Otimizar performance do modal e das animações de scroll.

---

*Ultima atualização: 03/04/2026 - Antigravity AI*
