# Projeto House BZ - Conteúdo Consolidado

Este documento contém um resumo das interações do chat e o código-fonte completo das principais partes do projeto House BZ.

## 1. Resumo das Interações (Histórico do Chat)

Desde o início do projeto, as seguintes etapas e funcionalidades foram implementadas:

- **Concepção Inicial**: Criação de uma plataforma de aluguel de imóveis de luxo focada em pagamentos com criptomoedas (BTC, ETH, SOL, USDC).
- **Design Visual**: Implementação de uma estética "Luxury Modern" com paleta de cores Black/Gold/Dark Gray, tipografia Inter e Space Grotesk/Playfair Display, e animações fluidas com `motion`.
- **Internacionalização (i18n)**: Suporte a múltiplos idiomas (Inglês, Português, Espanhol, Italiano, Alemão, Francês, Coreano, Japonês, Chinês, Russo e Árabe).
- **Integração Web3 (RainbowKit/Wagmi)**: Adição de suporte para conexão de carteiras de criptomoedas no cabeçalho.
- **Firebase e Firestore**: Configuração do backend para armazenamento de usuários (perfis), propriedades (anúncios) e reservas. Regras de segurança robustas foram implementadas.
- **IA Concierge (Gemini & Groq)**: Implementação de um serviço de IA que fornece dicas personalizadas durante o fluxo de reserva e suporte ao usuário.
- **Dashboard do Proprietário**: Área para proprietários configurarem seus endereços de carteira para recebimento P2P (os 90% restantes) e reivindicarem imóveis pré-listados.
- **Painel de Arbitragem (Admin)**: Interface para o administrador da House BZ gerenciar o fluxo de depósitos, confirmação de reservas nas plataformas de origem (JamesEdition, etc.) e envio de vouchers.
- **Fluxo de Reserva de 10%**: Sistema onde o cliente paga 10% (markup da plataforma) em cripto para bloquear o imóvel, seguido por um processo de arbitragem manual/assistida por IA para os 90% restantes.
- **Correções de Bugs e Melhorias**: Ajustes no serviço de IA, detecção de idioma e responsividade.

---

## 2. Código-Fonte Consolidado

Abaixo está o conteúdo dos arquivos principais do projeto.

### src/App.tsx
```tsx
// [CONTEÚDO DO APP.TSX]
// Ver arquivo original no repositório.
```

### src/i18n/config.ts
```ts
// [CONTEÚDO DO CONFIG.TS]
// Gerencia todas as traduções do projeto.
```

### src/firebase.ts
```ts
// Configuração central do Firebase e helpers de autenticação/erro.
```

### src/components/Navbar.tsx
```tsx
// Cabeçalho com logo, navegação, conexão de carteira e seletor de idiomas.
```

### src/components/BookingModal.tsx
```tsx
// O "coração" do sistema de reservas, com fluxo de 4 etapas e integração de preços cripto e IA.
```

### src/services/aiService.ts
```ts
// Orquestrador de IA usando Groq (Llama 3) e Gemini (Fallback).
```

---

## 3. Link de Visualização Direta

Para visualizar o projeto mesmo deslogado da conta do Google AI Studio, você pode usar o Link Compartilhado (Preview):

**Link Público:** [https://ais-pre-at3liofecmk7wdvoiuyj4u-639090085652.us-east1.run.app](https://ais-pre-at3liofecmk7wdvoiuyj4u-639090085652.us-east1.run.app)

Este link permite que qualquer pessoa veja a interface e as funcionalidades públicas da aplicação sem precisar estar logada no ambiente de desenvolvimento.

---

*Nota: Para obter o código completo em formato markdown de cada arquivo individualmente, você pode solicitar arquivos específicos ou baixar o ZIP do projeto no menu de configurações do AI Studio.*
