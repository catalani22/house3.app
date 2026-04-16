# house3.app — MASTER PLAN DE EXECUÇÃO
> Plataforma de Hospitalidade Web3 — Ultra Luxo com Pagamento Crypto  
> **Domínio:** house3.app | **Marca:** Neptune Crypto SaaS Factory  
> Última atualização: Abril 2026

---

## CONTEXTO

### A ideia em uma frase
**"Airbnb do ultra luxo, mas descentralizado e com pagamento crypto."**

### Diferencial real
1. **Crypto-native**: zero friction para quem tem riqueza em crypto
2. **NFT booking**: prova de reserva na blockchain — inegável, transferível
3. **Smart contract escrow**: depósito travado no contrato, não na empresa
4. **Ultra luxo apenas**: propriedades >$1K/noite. Nada de hostel. Nada de classe média.
5. **10% markup**: margem saudável em valores altos = receita expressiva

### Modelo de receita
```
Toda reserva: house3 cobra 10% sobre o preço base
Exemplo: Villa $50K/semana → house3 embolsa $5K por reserva
         Chalet $100K/semana → house3 embolsa $10K por reserva
```

---

## FASE 0: SETUP DO PROJETO

### 0.1 — Stack Tecnológica
```
Frontend:    React 18 + TypeScript + Vite
Estilização: Tailwind v4 (mesma convenção dos outros projetos Neptune)
Tipografia:  Playfair Display (headings luxury) + Inter (corpo/dados)
Cores:       Marfim #F5F0E8 | Dourado #C9A84C | Preto #0A0A0A | Creme #EDE8DC
Web3 EVM:    wagmi v2 + RainbowKit v2 (MetaMask, WalletConnect, Coinbase)
Web3 SOL:    @solana/wallet-adapter-react + Phantom
Web3 BTC:    BTCPay Server (para aceitar BTC real)
Database:    Supabase (PostgreSQL) — tabelas de properties, bookings, users
Auth:        Privy (Web3-native auth via wallet) OU Firebase + wallet link
Deploy:      Vercel
Contratos:   Solidity (Escrow.sol para EVM) + Anchor (para SOL)
```

### 0.2 — Estrutura de Pastas
```
house3.app/
├── src/
│   ├── components/
│   │   ├── layout/           → Header, Footer, MobileNav
│   │   ├── property/         → PropertyCard, PropertyGallery, PropertyMap
│   │   ├── booking/          → BookingFlow, DatePicker, CryptoPayment
│   │   ├── nft/              → NFTBookingCard, NFTGallery
│   │   └── shared/           → PriceDisplay, CryptoIcon, DestinationBadge
│   ├── pages/
│   │   ├── HomePage.tsx       → Hero + curadoria de propriedades + destinos
│   │   ├── SearchPage.tsx     → Grid de propriedades com filtros
│   │   ├── PropertyPage.tsx   → Detalhe: fotos, mapa, disponibilidade, booking
│   │   ├── BookingFlow.tsx    → 3 steps: datas → wallet → pagar → NFT
│   │   ├── MyTrips.tsx        → Minhas reservas (NFTs)
│   │   ├── ListProperty.tsx   → Formulário para proprietários listarem
│   │   └── Destinations.tsx   → Browse por destino
│   ├── lib/
│   │   ├── escrow.ts          → Interação com Escrow.sol
│   │   ├── nft-booking.ts     → Mint NFT de confirmação de reserva
│   │   ├── pricing.ts         → Aplica 10% markup
│   │   ├── wallet-connect.ts  → wagmi + Phantom
│   │   └── supabase.ts        → Cliente Supabase
│   └── App.tsx
├── api/
│   ├── properties.ts          → CRUD propriedades
│   ├── bookings.ts            → Criar/confirmar reservas
│   ├── availability.ts        → Checar disponibilidade
│   └── og/property.tsx        → OG image dinâmica por propriedade
├── contracts/
│   ├── Escrow.sol             → Contrato de escrow EVM
│   └── anchor/                → Programa Anchor para SOL
└── docs/
```

### 0.3 — Supabase Schema
```sql
-- Propriedades
CREATE TABLE properties (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  slug TEXT UNIQUE,
  description TEXT,
  destination TEXT,           -- "Ibiza", "Mykonos", "Maldives", "Aspen"...
  type TEXT,                  -- 'villa' | 'island' | 'penthouse' | 'chalet' | 'yacht'
  bedrooms INT,
  bathrooms INT,
  max_guests INT,
  base_price_night NUMERIC,   -- Preço base SEM markup
  price_with_markup NUMERIC,  -- base * 1.10
  currency TEXT DEFAULT 'USD',
  images JSONB,               -- [{url, caption}]
  amenities JSONB,            -- ["private pool", "helipad", "chef", ...]
  coordinates JSONB,          -- {lat, lng}
  available_from DATE,
  available_to DATE,
  owner_wallet TEXT,          -- Wallet do proprietário
  status TEXT DEFAULT 'active',
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Reservas
CREATE TABLE bookings (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  property_id UUID REFERENCES properties(id),
  guest_wallet TEXT NOT NULL,
  check_in DATE NOT NULL,
  check_out DATE NOT NULL,
  nights INT,
  base_price NUMERIC,
  markup_amount NUMERIC,       -- 10% que vai para house3
  total_paid NUMERIC,
  crypto_chain TEXT,           -- 'ethereum' | 'solana' | 'bnb' | 'polygon'
  crypto_token TEXT,           -- 'ETH' | 'SOL' | 'USDC' | 'BNB'...
  tx_hash TEXT,
  escrow_address TEXT,
  nft_token_id TEXT,           -- ID do NFT de confirmação
  nft_tx_hash TEXT,
  status TEXT DEFAULT 'pending', -- pending | confirmed | active | completed | cancelled
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Fee wallet house3
CREATE TABLE house3_fees (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  booking_id UUID REFERENCES bookings(id),
  amount NUMERIC,
  chain TEXT,
  token TEXT,
  tx_hash TEXT,
  collected_at TIMESTAMPTZ DEFAULT NOW()
);
```

---

## FASE 1: INTERFACE E NAVEGAÇÃO

### 1.1 — Home Page (Luxury First Impression)
```
Hero full-screen:
├── Vídeo ou foto aérea de villa de luxo (loop)
├── Headline: "The World's Finest Properties. Pay with Crypto."
├── Subline: "Zero friction. Your assets, your stay."
└── CTA: [Browse Properties] [Connect Wallet]

Seção "Destinos em Destaque":
├── Ibiza 🇪🇸 | Mykonos 🇬🇷 | Maldivas 🇲🇻 | Aspen 🇺🇸
├── Bali 🇮🇩 | St. Barths 🇧🇱 | Amalfi 🇮🇹 | Dubai 🇦🇪
└── Cards com imagem do destino + número de propriedades

Seção "Propriedades em Destaque":
├── 6 propriedades premium (curadoria manual)
└── CTA "Ver todas as propriedades"

Footer:
├── Logo + "house3.app"
├── Links: About, How it works, List your property, FAQ
└── Redes sociais + "Powered by Neptune Crypto SaaS"
```

### 1.2 — Search & Filters
```
Filtros:
├── Destino (dropdown com busca)
├── Datas (check-in / check-out)
├── Hóspedes (adultos + crianças)
├── Tipo: Villa / Ilha Privada / Penthouse / Chalet / Yacht
├── Preço: slider $1K–$1M por noite
├── Crypto aceito: ETH / SOL / USDC / BTC...
└── Amenities: piscina privada, heliponto, chef, concierge...

Grid: 3 colunas desktop, 2 tablet, 1 mobile
Card: foto + nome + destino + preço/noite + badge crypto
```

### 1.3 — Property Detail Page
```
Header: galeria fullscreen (8+ fotos, tour 360° se disponível)
Sidebar (sticky):
├── Preço por noite (COM markup)
├── DatePicker de disponibilidade
├── Hóspedes counter
├── [Reserve com Crypto] → inicia BookingFlow
└── Badges: ETH ✓ SOL ✓ USDC ✓ BTC ✓

Body:
├── Descrição (AI-enhanced para SEO)
├── Amenidades (ícones)
├── Mapa (Mapbox ou Google Maps)
├── Regras da propriedade
└── Calendário de disponibilidade
```

---

## FASE 2: SISTEMA DE RESERVA WEB3

### 2.1 — Fluxo de Reserva (3 Steps)
```
Step 1 — Datas e Hóspedes
├── Confirmar check-in / check-out
├── Número de hóspedes
└── Resumo: N noites × $X = $TOTAL (+ 10% markup exibido)

Step 2 — Conectar Carteira
├── [Phantom] [MetaMask] [Coinbase] [WalletConnect]
├── Selecionar token de pagamento
└── Mostrar saldo disponível

Step 3 — Pagar
├── Resumo final com breakdown:
│   Base: $X | house3 fee (10%): $Y | TOTAL: $Z
├── Equivalente em crypto (cotação em tempo real)
├── [Confirmar e Pagar] → assina tx na carteira
└── Vai para Escrow.sol (não direto para proprietário)

Confirmação:
├── ✅ Reserva confirmada!
├── Mint automático do NFT booking
├── Share dialog: "Just booked [Property] via @house3app 🏛️"
└── Email de confirmação (Resend API)
```

### 2.2 — Smart Contract: Escrow.sol
```solidity
// contracts/Escrow.sol
// Conceito:
// 1. Hóspede deposita 100% do valor
// 2. Valor fica locked até check-in
// 3. No check-in: 90% liberado para proprietário, 10% para house3 treasury
// 4. Se cancelamento: regras de cancelamento definem split
// 5. Disputa: DAO / multisig resolve

// Chains: Base, BNB, Ethereum, Polygon
// Tokens: ETH nativo + ERC20 (USDC, USDT)
```

### 2.3 — NFT Booking Confirmation
```
ERC-721 gerado para cada reserva:
├── Metadata: property name, dates, wallet, price
├── Imagem: foto premium da propriedade + "Reserved" badge
├── Use: prova de reserva, não transferível (SoulBound) ou transferível (revenda?)
└── Chain: mesma chain do pagamento
```

---

## FASE 3: PAINEL DO PROPRIETÁRIO

### 3.1 — Listar Propriedade
```
Formulário multi-step:
├── Dados básicos: nome, tipo, localização, capacidade
├── Preços: preço base por noite, mínimo de noites, épocas (alta/baixa)
├── Fotos: upload até 20 fotos (alta resolução)
├── Amenidades: checklist
├── Disponibilidade: calendário bloqueado/disponível
└── Wallet para receber: endereço da carteira do proprietário
```

### 3.2 — Dashboard do Proprietário
```
├── Reservas futuras (com detalhes de hóspede via wallet)
├── Histórico de pagamentos (por reserva)
├── Calendário de disponibilidade
└── Earnings: total recebido (net, já descontado 10% house3)
```

---

## FASE 4: FUNCIONALIDADES AVANÇADAS

### 4.1 — Last-Minute Deals (Viral Content)
```
Lógica: Se propriedade tem data disponível nos próximos 14 dias → exibe como "Last Minute"
Desconto opcional: proprietário pode ofertar desconto de 10-30%
Post automático no Twitter: "🔥 LAST MINUTE: [Property] in [Destination]!
  [N] nights from $[price]/night. Pay with crypto.
  👉 house3.app/property/[slug]
  Only [X] days to book! #LuxuryTravel #Web3"
```

### 4.2 — AI Property Descriptions
```
Quando proprietário lista: OpenAI gera descrição SEO-optimizada em inglês
Tradução automática para PT, ES, ZH, KO via DeepL/GPT
→ SEO multi-idioma desde o lançamento
```

### 4.3 — Crypto Price Display
```
Mostrar preço em USD E em crypto simultaneamente:
"$5.000/noite = 2.1 ETH / 35 SOL / 5.000 USDC"
Atualizado em tempo real via CoinGecko API
```

---

## CRONOGRAMA

| Fase | Descrição | Prioridade |
|------|-----------|-----------|
| F0 | Setup: Vite + React + Tailwind + Supabase | ALTA |
| F1 | Interface: Home + Search + Property Detail | ALTA |
| F2 | Booking Flow: Escrow.sol + NFT Mint | ALTA |
| F3 | Proprietário: Listar + Dashboard | MÉDIA |
| F4 | Last-Minute + AI descriptions + i18n | MÉDIA |
| Growth | Automação social + Share dialogs | APÓS F2 |

---

## COMO RETOMAR

```bash
gh repo clone catalani22/house3.app
cd house3.app
cat docs/MASTER_PLAN.md   # este arquivo
cat docs/GROWTH_ENGINE.md  # automação social
cat docs/ARCHITECTURE.md   # stack e contratos
```

*Documento criado por Alexandre Catalani — Neptune Crypto SaaS*  
*GitHub Copilot CLI — Abril 2026*
