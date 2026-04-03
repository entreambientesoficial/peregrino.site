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
| **JourneySection** | ✅ Concluído | **Efeito Baralho (Card Deck)**. 9 rotas reais, fotos oficiais, layout 100% ajustado. |
| **BookSection** | 🕒 Pendente | Seção do "Livro de Café" com animação de páginas ou abertura. |

---

## 🚩 Histórico de Ajustes Recentes
### Seção de Rotas (JourneySection)

**O que foi realizado**:
- **Conteúdo Real**: Implementação das 9 rotas oficiais conforme tabela de distâncias e dias.
- **Assets Oficiais**: Migração das imagens da pasta `img-apoio` para o site.
- **Design Editorial**: Adicionado overlay escuro (`bg-black/40`) para legibilidade e removido o emblema circular para um visual mais limpo.
- **Ajuste de Viewport**: Espaçamento do título e altura dos cards otimizados para caberem sem cortes em telas padrão.
- **Conectividade**: Botão final de CTA conectado ao **Modal de Download**.

---

## 🚀 Próximos Passos
1. **Implementar BookSection**: Criar a experiência imersiva do diário físico com animações 3D cinematográficas (Capa de couro, virada de página).
2. **Refinar Animações**: Garantir suavidade total no scroll-driven behavior entre as seções.
3. **Deploy Final**: Otimização de assets para publicação no Cloudflare Pages.

---

*Ultima atualização: 03/04/2026 - Antigravity AI*
