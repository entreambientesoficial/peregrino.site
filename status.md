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
| **HeroSection** | ✅ Concluído | Vídeo full-screen com overlay de textura e tipografia serifada. |
| **FeaturesSection** | ✅ Concluído | Grid bento de cards táteis com gradientes e sombras "físicas". |
| **JourneySection** | ⚠️ Em Progresso | **Efeito Baralho (Card Deck)**. As rotas devem se empilhar e sair uma a uma no scroll. |
| **BookSection** | 🕒 Pendente | Seção do "Livro de Café" com animação de páginas ou abertura. |
| **AppCTA** | 🕒 Pendente | Seção final focada em conversão (App Store / Google Play). |

---

## 🚩 Problema Atual (Bloqueio)
### Seção de Rotas (JourneySection) - Efeito Sticky/Scroll

**O que foi tentado**:
- Implementação de um container de `600vh` ou `700vh` usando `sticky top-0`.
- Uso do `useScroll` do Framer Motion para animar o `y` e `opacity` dos cards baseados em slots de 0 a 1.

**Sintomas do Bug**:
- O comportamento `sticky` falha em alguns momentos (o container "passa direto").
- Existe um "vácuo" (tela bege vazia) no final da seção antes da próxima começar.
- Aviso no console: *"Please ensure that the container has a non-static position..."*.

**Causa Provável**:
- Conflito entre `overflow: hidden`, a estrutura de herança do CSS e como o Framer Motion calcula os offsets em páginas com múltiplos containers relativos.

---

## 🚀 Próximos Passos
1. **Corrigir JourneySection**: Estabilizar o comportamento `sticky` (verificar se há algum `overflow` quebrando o fluxo nos pais).
2. **Implementar BookSection**: Criar a experiência imersiva do diário físico.
3. **Refinar Mobile**: Verificar se o efeito baralho não é pesado demais para dispositivos móveis (substituir por fade simples se necessário).

---

*Ultima atualização: 03/04/2026 - Antigravity AI*
