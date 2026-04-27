# Manual da Plataforma House BZ

Este documento detalha a concepção, o modelo de negócio, o fluxo operacional e a arquitetura técnica da plataforma **House BZ**, a primeira plataforma de aluguel de luxo 100% nativa em cripto.

---

## 1. Visão Geral e Modelo de Negócio

A **House BZ** redefine a exclusividade no mercado imobiliário de luxo através da descentralização.

### Pilares Fundamentais:
*   **100% Crypto-Native**: Todos os pagamentos (depósito e saldo) são realizados exclusivamente em criptomoedas (BTC, ETH, SOL, USDC).
*   **Arbitragem Manual (Fase 1)**: A plataforma atua como uma camada de curadoria e facilitação sobre plataformas de luxo existentes. Capturamos uma taxa de **10% (Markup)** sobre o valor original.
*   **Zero Custody**: Para proprietários diretos, a plataforma não retém os fundos. O pagamento final de 90% é liquidado P2P ou via concierge.
*   **Curadoria de Elite**: Foco absoluto em propriedades de altíssimo padrão (Villas, Mansões, Beach Houses, Ski Resorts).

---

## 2. Fluxo do Usuário (Booking Flow)

O processo de reserva foi desenhado para ser fluido e seguro:

1.  **Descoberta**: O usuário navega por propriedades verificadas (JamesEdition, Travala, etc.).
2.  **Pré-Reserva (10%)**:
    *   O usuário seleciona as datas (mínimo 3 noites).
    *   A IA da House BZ verifica a disponibilidade em tempo real na plataforma de origem.
    *   O usuário realiza o depósito de **10%** (Markup da House BZ) para garantir o serviço de concierge.
3.  **Bloqueio e Arbitragem**:
    *   O Admin recebe a notificação no **Painel de Arbitragem**.
    *   O Admin acessa a plataforma de origem e realiza o bloqueio manual do imóvel.
4.  **Pagamento Final (90%)**:
    *   Após o bloqueio, o usuário é solicitado a enviar os **90% restantes**.
    *   O Admin confirma o recebimento e efetua o pagamento na plataforma original.
5.  **Voucher e Check-in**:
    *   O voucher oficial é enviado ao usuário.
    *   O concierge House BZ coordena os detalhes de chegada (VIP Access).

---

## 3. Arquitetura Técnica Implementada

### Frontend:
*   **React 19 + Vite**: Performance ultra-rápida.
*   **Tailwind CSS**: Design premium e responsivo.
*   **Motion (Framer Motion)**: Animações e transições suaves.
*   **i18next**: Suporte multi-idioma com detecção automática de região.

### Backend & Dados:
*   **Firebase Auth**: Login via Google e integração com carteiras.
*   **Firestore**: Banco de dados em tempo real para propriedades, reservas e perfis.
*   **Security Rules**: Proteção rigorosa de dados PII e lógica de RBAC (Admin/Owner/User).

### Web3 & Crypto:
*   **RainbowKit + Wagmi**: Conexão de carteiras EVM e preparação para Solana.
*   **Price Service**: Integração com APIs de preço para conversão em tempo real de USD para Cripto.

### IA & Concierge:
*   **Gemini API / Groq**: Orquestração de dicas de concierge personalizadas e automação de limpeza de dados.

---

## 4. Dashboards e Funcionalidades

*   **Admin Dashboard**: Central de comando para gerenciar o fluxo de arbitragem, confirmar depósitos e enviar vouchers.
*   **Owner Dashboard**: Área para proprietários reivindicarem imóveis (Claim System) e configurarem carteiras de recebimento.
*   **User Bookings**: Histórico detalhado de reservas com status de pagamento e progresso da arbitragem em tempo real.
*   **Language Selector**: Seletor inteligente no Navbar suportando 11 idiomas.

---

## 5. Segurança e Privacidade

*   **Privacidade Absoluta**: Transações discretas via blockchain.
*   **Validação de Dados**: Regras de segurança no Firestore garantem que apenas admins alterem status críticos de pagamento.
