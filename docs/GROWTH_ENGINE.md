# house3.app — GROWTH ENGINE

> Automação social + Share dialogs virais + i18n nativo  
> *Status: Arquitetado. Aguardando contas sociais e chaves de API.*

---

## CONTAS SOCIAIS NECESSÁRIAS

| Plataforma | Handle | Formato | Prioridade |
|-----------|--------|---------|-----------|
| Twitter/X | `@house3app` | Curto, impactante | 🔴 Alta |
| **Instagram** | `@house3app` | **Principal** — luxo é visual | 🔴 Alta |
| Telegram | `@house3app` | Canal de deals | 🟡 Média |
| YouTube | `house3.app` | Tours de villas, destinos | 🟠 Baixa |
| TikTok | `@house3app` | Clips de propriedades | 🟠 Baixa |

> ⚠️ **Instagram é o canal PRINCIPAL** para house3. Luxo + viagem = conteúdo visual.  
> Twitter é para Web3/crypto audience. Instagram é para luxury travel audience.

---

## AUTOMAÇÃO TWITTER/X — `@house3app`

### Tipos de posts automáticos

#### 1. Nova propriedade listada
```
Trigger: property.status = 'active' (primeira vez)

Tweet:
"🏛️ New listing on house3.app!

[Property Name] — [Destination] 🌍
[N] bedrooms | [N] guests | Pool ✓
From $[price]/night

Pay with ETH, SOL, USDC or BNB.
No banks. No friction.

👉 house3.app/property/[slug]
#LuxuryTravel #Web3 #CryptoLifestyle"
```

#### 2. Last-Minute Deal
```
Trigger: disponibilidade nos próximos 14 dias, sem reserva

Tweet:
"🔥 LAST MINUTE DEAL

[Property] in [Destination]
[N] nights available from [date]
From $[price]/night 💎

Book with crypto → last minute price 🏃
👉 house3.app/property/[slug]
#LastMinute #LuxuryStay #Web3Travel"
```

#### 3. Milestone de reservas
```
Trigger: toda 10ª reserva completa

Tweet:
"🌊 Another dream stay completed on house3!
[N] luxury stays booked with crypto worldwide.

The future of travel is here 🏛️
house3.app — Pay with crypto, live in luxury.
#Web3 #LuxuryTravel #CryptoLife"
```

#### 4. Weekly destinations digest
```
Schedule: Toda segunda-feira 10AM UTC

Tweet:
"🌍 This week's top destinations on house3:

🇪🇸 Ibiza — [N] villas available
🇬🇷 Mykonos — [N] available  
🇲🇻 Maldives — [N] available
🇺🇸 Aspen — [N] available

All bookable with ETH | SOL | USDC | BNB
👉 house3.app
#LuxuryTravel #Web3 #CryptoStay"
```

### Keywords para monitorar (auto-reply)
```
["book villa crypto", "luxury airbnb crypto", "pay hotel bitcoin",
 "crypto travel", "web3 travel", "airbnb alternative"]

Reply:
"Did you know you can book luxury villas and pay with crypto? 🏛️
Zero banks. Zero friction. NFT booking receipt.
Check house3.app → real luxury properties worldwide 💎"
```

---

## AUTOMAÇÃO INSTAGRAM — `@house3app` (Principal)

### Estratégia de conteúdo

O Instagram exige conta de Business API aprovada para automação direta.  
**Abordagem:** Usar Instagram Graph API (Meta) via conta Business.

### Posts automáticos

#### 1. Nova propriedade (foto principal)
```
Imagem: foto hero da propriedade (alta qualidade, 1:1 ou 4:5)
Caption:
"🏛️ [Property Name]
📍 [Destination]
🛏️ [N] bedrooms | 👥 [N] guests

From $[price]/night
Pay with ETH, SOL, USDC or BNB 💎

Zero banks. Zero friction. Pure luxury.
NFT booking confirmation. 🔗

🔗 Link in bio → house3.app
.
#LuxuryVilla #[Destination] #LuxuryTravel #Web3 
#CryptoLife #PrivateVilla #LuxuryAirbnb"
```

#### 2. Stories diários
```
- Foto de uma propriedade destacada do dia
- Sticker de link: house3.app/property/[slug]
- Sticker de "Last Minute" quando disponível
```

---

## TELEGRAM CHANNEL — `@house3deals`

```
Foco: last-minute deals e novos listings
Membros: compradores de luxo, crypto whales

Mensagens automáticas:
├── Nova propriedade: resumo completo com link
├── Last minute: alerta de urgência com preço
└── Weekly: top 5 propriedades disponíveis essa semana
```

---

## SHARE DIALOGS (Usuários nos divulgam)

### 1. Reserva Confirmada → Share Dialog
```
Modal: "Sua reserva está confirmada! Compartilhe com seus amigos 🏛️"

Twitter/X pré-preenchido:
"Just booked [Property Name] in [Destination] with crypto! 🏛️✨
[N] nights of pure luxury via @house3app

Zero banks. Zero hassle. NFT confirmation.
Pay your dream stay with crypto 👇
house3.app

#LuxuryTravel #Web3 #CryptoLife #[Destination]"

Instagram (via download de imagem):
Imagem gerada: foto da propriedade + "I'm going to [Destination]!" overlay

WhatsApp:
"Acabei de reservar uma villa de luxo com crypto via house3.app! 🏛️
[Propriedade] em [Destino] — [N] noites
Dá uma olhada: house3.app/property/[slug]"
```

### 2. NFT Recebido → Share Dialog
```
"Meu NFT de reserva chegou na wallet! 🔗

Confirmação de reserva: [Property] | [Dates]
Blockchain imutável. Perda de papel? Nunca mais.
@house3app — NFT booking receipts
house3.app"
```

### OG Image Dinâmica por Propriedade
```typescript
// api/og/property.tsx
// URL: house3.app/api/og/property?id=[id]
// Gera card 1200×630 com:
// ├── Foto hero da propriedade (background)
// ├── Overlay escuro com gradiente
// ├── Nome da propriedade (Playfair Display)
// ├── Destino + ícone de bandeira
// ├── Preço (dourado #C9A84C)
// └── "house3.app" logo + "Pay with Crypto"
```

---

## i18n — INTERNACIONALIZAÇÃO

### Idiomas prioritários para turismo de luxo
| Idioma | Mercado | Prioridade |
|--------|---------|-----------|
| Inglês | Global | 🔴 P0 |
| Português | Brasil (alto potencial cripto + luxo) | 🔴 P0 |
| Russo | Mercado de ultra luxo significativo | 🔴 P0 |
| Árabe | Golfo Pérsico — maior mercado de luxo | 🟡 P1 |
| Chinês | Turistas de alto poder | 🟡 P1 |
| Espanhol | LATAM + Espanha | 🟡 P1 |
| Alemão | Europa central | 🟠 P2 |
| Italiano | Turismo italiano out | 🟠 P2 |

> 🔑 **Russo é P0 para house3** — mercado de ultra luxo que prefere crypto (evita SWIFT).  
> 🔑 **Árabe é P1** — Dubai, Abu Dhabi, Riad = mercado enorme para luxury stay + crypto.

### Implementação
```typescript
// Mesma stack: react-i18next + i18next-browser-languagedetector
// public/locales/en/house3.json
// public/locales/pt/house3.json
// public/locales/ru/house3.json  → tradução GPT/DeepL
// public/locales/ar/house3.json  → RTL support (dir="rtl")
```

---

## SECRETS NECESSÁRIOS

```bash
# Twitter/X (@house3app)
HOUSE3_TWITTER_API_KEY=...
HOUSE3_TWITTER_API_SECRET=...
HOUSE3_TWITTER_ACCESS_TOKEN=...
HOUSE3_TWITTER_ACCESS_TOKEN_SECRET=...
HOUSE3_TWITTER_BEARER_TOKEN=...

# Instagram Business (Meta Graph API)
HOUSE3_INSTAGRAM_ACCESS_TOKEN=...
HOUSE3_INSTAGRAM_BUSINESS_ACCOUNT_ID=...
HOUSE3_META_APP_ID=...
HOUSE3_META_APP_SECRET=...

# Telegram
HOUSE3_TELEGRAM_BOT_TOKEN=...
HOUSE3_TELEGRAM_CHANNEL_ID=...
```

---

## RESUMO ESTRATÉGICO

```
house3.app = LUXURY + WEB3 + AUTOMAÇÃO

Cada propriedade listada = post automático no Twitter + Instagram
Cada reserva = NFT + share dialog = viral orgânico
Last-minute deals = urgência = engajamento alto
i18n russo + árabe = mercados de cripto-luxo inexplorados
```
