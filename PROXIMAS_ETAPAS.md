# Próximas Etapas: House BZ

Este documento descreve o roadmap para transformar a **House BZ** na plataforma definitiva de aluguel de luxo via cripto.

---

## 1. Alimentação de Dados (Scraping & Curadoria)

O foco imediato é a ingestão de propriedades de altíssimo nível.

### Plataformas Alvo (Fontes):
Devemos priorizar plataformas que aceitam cripto ou que possuem os melhores preços para arbitragem competitiva:
*   **JamesEdition**: A "bíblia" do luxo. Imóveis extraordinários.
*   **Travala**: Referência em reservas com cripto. Excelente para integração de preços.
*   **AirConcierge**: Foco em vilas de luxo e serviços premium.
*   **Luxury Retreats (Airbnb Luxe)**: Padrão ouro de curadoria.
*   **The Thinking Traveller**: Especialista em vilas exclusivas no Mediterrâneo.

### Estratégia de Scraping:
*   **Web Scraper Profissional**: Implementação de scripts em Python (Scrapy/Selenium) para extrair:
    *   Imagens em alta resolução.
    *   Descrições detalhadas.
    *   Calendários de disponibilidade.
    *   Preços originais (para cálculo automático do markup de 10%).
*   **Pipeline de IA**: Processamento das descrições para elevar o tom de voz e remover referências a concorrentes.

---

## 2. Categorias de Propriedades Prioritárias

Nada de casas medianas. Foco em:
*   **Luxury Villas**: Mansões em Trancoso, Ibiza, Mykonos e Cote d'Azur.
*   **Ski Resorts**: Chalés de luxo em Aspen, Courchevel e St. Moritz.
*   **Beach Houses**: Propriedades "pé na areia" de alto padrão.
*   **Penthouses**: Apartamentos de luxo em NY, Dubai e Londres.

---

## 3. Funcionalidades a Implementar (Roadmap Curto Prazo)

*   **Integração Solana**: Adicionar suporte nativo para carteiras Phantom e pagamentos via rede Solana (SOL/USDC-Sol).
*   **Sistema de Notificações**:
    *   Webhooks para avisar o Admin sobre novos depósitos de 10%.
    *   E-mails automáticos para o usuário com o status da arbitragem.
*   **Calendário em Tempo Real**: Sincronização via iCal com as plataformas de origem para evitar "double booking".
*   **Filtros Avançados**: Busca por comodidades de luxo (Heliponto, Chef Privado, Adega, etc.).

---

## 4. Sugestões para a Perfeição

1.  **Token de Fidelidade (BZ Token)**: Criar um sistema de cashback em tokens da plataforma para usuários frequentes.
2.  **BZ Concierge App**: Um aplicativo dedicado para o hóspede se comunicar com o concierge durante a estadia.
3.  **Seguro em Blockchain**: Integração com protocolos de seguro descentralizado para cobrir cancelamentos ou danos.
4.  **Verificação de Identidade VIP**: Sistema de KYC/KYB discreto para membros de alto nível, garantindo uma comunidade exclusiva.
5.  **Virtual Tours 3D**: Integração de Matterport para que o usuário possa caminhar pela mansão antes de reservar.

---

## 5. Cronograma Imediato (Amanhã)

*   [ ] Início da configuração do ambiente de Scraping.
*   [ ] Mapeamento final das primeiras 50 propriedades de elite.
*   [ ] Teste de fluxo de pagamento Solana.
*   [ ] Refinamento do Layout para "Modo Escuro" (Dark Mode) ultra-luxo.
