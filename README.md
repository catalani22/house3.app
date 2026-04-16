# 🏛️ house3.app — Luxury Web3 Hospitality

> **house3.app** — A plataforma de hospedagem de ultra luxo com pagamento crypto  
> "Book your dream stay with crypto. No banks. No friction. Pure luxury."

---

## O que é o house3.app?

**Airbnb do luxo, mas Web3.**

- Propriedades de alto luxo: villas privadas, ilhas privadas, penthouses, chalets exclusivos
- Pagamento 100% crypto (ETH, SOL, BTC, USDC, MATIC, BNB)
- Smart contract de escrow para depósitos e reservas
- NFT como confirmação de reserva (transferível, colecionável)
- Modelo: **10% de markup** sobre o preço base de toda propriedade
- Zero fricção. Sem banco central. Sem câmbio. Sem taxa de câmbio.

---

## Modelo de Negócio

```
Hospedagem por 7 noites: $50.000
+ 10% markup Neptune:    $5.000
= Usuário paga:          $55.000 em crypto
```

| Propriedade | Preço Base | Markup 10% | house3 recebe |
|------------|-----------|-----------|--------------|
| Villa Ibiza 7d | $50K | $5K | $5K |
| Ilha Privada 14d | $200K | $20K | $20K |
| Penthouse NYC 3d | $30K | $3K | $3K |
| Chalet Aspen 5d | $80K | $8K | $8K |

**Revenue é proporcional ao preço das propriedades — luxo é margens altas.**

---

## Ecossistema de Propriedades

```
house3.app
├── /stay          → Browse propriedades (filtros: destino, tipo, preço, datas)
├── /property/:id  → Detalhe da propriedade + fotos + mapa + disponibilidade
├── /book/:id      → Fluxo de reserva (wallet → depósito → NFT)
├── /my-trips      → Minhas reservas (NFTs de reserva)
├── /list          → Listar sua propriedade (para proprietários)
└── /destinations  → Browse por destino (Ibiza, Mykonos, Maldivas, Aspen...)
```

---

## Diferenciais vs. Airbnb

| Feature | Airbnb | house3.app |
|---------|--------|-----------|
| Pagamento | Fiat (cartão) | 100% crypto multi-chain |
| Confirmação | Email PDF | NFT na sua wallet (transferível) |
| Depósito | Retido por 14 dias | Smart contract (liberado automaticamente) |
| Perfil | Email/senha | Wallet address |
| Taxas de câmbio | SIM | NÃO |
| Bloqueio de conta | Sim (plataforma) | Impossível (descentralizado) |
| Segmento | Todos | Ultra luxo (>$1K/noite) |

---

## Growth Engine

Ver `docs/GROWTH_ENGINE.md` para automação completa.

**Redes sociais:** `@house3app` no Twitter/X, Instagram (visual-first), Telegram  
**Conteúdo viral:** Cada propriedade postada automaticamente. Cada reserva = share dialog.

---

## Marca

- **Nome**: house3.app
- **Web3**: O "3" = Web3 + 3 pilares (Luxo + Crypto + Descentralização)
- **Cores**: Marfim (#F5F0E8) + Dourado (#C9A84C) + Preto profundo (#0A0A0A)
- **Fonte**: Serif elegante (Playfair Display) para luxo + Sans para dados
- **Ícone**: 🏛️ Ícone de coluna grega / villa minimalist

---

## Como Retomar Este Projeto

```bash
# Clonar
gh repo clone catalani22/house3.app
cd house3.app

# Ler documentação
cat docs/MASTER_PLAN.md
cat docs/ARCHITECTURE.md
cat docs/GROWTH_ENGINE.md
```

**Dono:** Alexandre Catalani — Neptune Crypto SaaS  
**Relação com NEP3:** Produto independente (hospitalidade vs. DeFi), mas compartilha a filosofia Web3 + crypto payments da Neptune Factory
