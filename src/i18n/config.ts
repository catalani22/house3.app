import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import LanguageDetector from 'i18next-browser-languagedetector';

const resources = {
  en: {
    translation: {
      "nav": {
        "properties": "Properties",
        "concierge": "Concierge",
        "about": "About",
        "login": "Login",
        "logout": "Logout"
      },
      "hero": {
        "title": "The Future of Luxury Rentals",
        "subtitle": "The first 100% crypto-native luxury rental platform. Global curation with concierge assistance for every booking.",
        "search_placeholder": "Where would you like to stay?",
        "search_button": "Search"
      },
      "booking": {
        "title": "Reserve Property",
        "step_1": "Select Dates",
        "step_2": "Payment Method",
        "step_3": "Confirmation",
        "deposit": "10% Deposit",
        "remaining": "90% Remaining (P2P)",
        "confirm_button": "Confirm Reservation",
        "processing": "Processing Transaction...",
        "success": "Reservation Confirmed!"
      },
      "categories": {
        "all": "All Properties",
        "villa": "Villas",
        "beach": "Beach Houses",
        "mansion": "Mansions",
        "apartment": "Luxury Apartments"
      },
      "grid": {
        "title": "Discover the Extraordinary.",
        "subtitle": "Exclusive curation of the world's most luxurious properties. Live unique experiences with simplified cryptocurrency payments."
      },
      "footer": {
        "description": "The new era of luxury living. house3 redefines exclusivity through extraordinary properties and decentralized payments.",
        "collections": "Collections",
        "ecosystem": "Ecosystem",
        "privacy": "Privacy",
        "terms": "Terms of Use",
        "policy": "Data Policy",
        "security": "Blockchain Security",
        "contact": "VIP Contact"
      },
      "how_it_works": {
        "badge": "Exclusive Process",
        "title": "How to Book with Crypto",
        "subtitle": "We combine blockchain security with curation from the world's best luxury platforms.",
        "step1_title": "Choice & Deposit",
        "step1_desc": "Select your property and make a 10% deposit (house3 Markup) via BTC, ETH, SOL, or USDC.",
        "step2_title": "Immediate Block",
        "step2_desc": "Our concierge validates availability and blocks the property on the source platform in real-time.",
        "step3_title": "Final Payment",
        "step3_desc": "After confirmation, you send the remaining 90%. We guarantee P2P settlement with the owner.",
        "step4_title": "Voucher & Check-in",
        "step4_desc": "You receive the official voucher from the source platform and all VIP access instructions."
      },
      "concierge_section": {
        "badge": "house3 Concierge",
        "title": "Your Stay, Elevated to the Max.",
        "subtitle": "Our dedicated concierge team is available 24/7 to ensure every detail of your stay is impeccable. From private chefs to helicopter transfers, the extraordinary is our standard.",
        "vip_access": "VIP Access",
        "blockchain_security": "Blockchain Security",
        "instant_payments": "Instant Payments",
        "crypto_networks": "BTC • ETH • SOL"
      },
      "why_house_bz": {
        "title": "Why house3?",
        "subtitle": "Redefining the luxury real estate market through decentralization and exclusivity.",
        "feature1_title": "Absolute Privacy",
        "feature1_desc": "Secure and discrete transactions via blockchain, ensuring total anonymity and data protection for our members.",
        "feature2_title": "Global Curation",
        "feature2_desc": "Access to properties that are not in the conventional market. We select only the extraordinary in each destination.",
        "feature3_title": "Crypto Liquidity",
        "feature3_desc": "Use your digital wealth to live real experiences. We accept the main networks and tokens in the market."
      },
      "owner_dashboard": {
        "title": "Owner Dashboard",
        "subtitle": "Manage your luxury properties and crypto receipts.",
        "tabs": {
          "profile": "Financial Profile",
          "bookings": "My Bookings",
          "properties": "My Properties",
          "claims": "Claims"
        },
        "profile": {
          "title": "Receipt Settings",
          "desc": "Define how you want to receive the 90% of the booking value (P2P).",
          "wallet_label": "Wallet Address (EVM/Solana)",
          "token_label": "Preferred Token",
          "terms_label": "I accept the \"Zero Custody\" terms of house3. I understand that the platform acts only as a technological intermediary, capturing a 10% fee, and that the receipt of the remaining 90% is my direct responsibility via P2P.",
          "save_button": "Save Settings"
        }
      },
      "admin_dashboard": {
        "title": "Arbitrage Panel",
        "subtitle": "Manage manual bookings and crypto payment flows.",
        "filters": {
          "all": "All",
          "pending_deposit": "Pending Deposit",
          "deposit_confirmed": "Deposit Confirmed",
          "awaiting_full_payment": "Awaiting Full Payment"
        }
      }
    }
  },
  pt: {
    translation: {
      "nav": {
        "properties": "Propriedades",
        "concierge": "Concierge",
        "about": "Sobre",
        "login": "Entrar",
        "logout": "Sair"
      },
      "hero": {
        "title": "O Futuro do Aluguel de Luxo",
        "subtitle": "A primeira plataforma de aluguel de luxo 100% nativa em cripto. Curadoria global com assistência de concierge em cada reserva.",
        "search_placeholder": "Onde você gostaria de ficar?",
        "search_button": "Buscar"
      },
      "booking": {
        "title": "Reservar Propriedade",
        "step_1": "Selecionar Datas",
        "step_2": "Método de Pagamento",
        "step_3": "Confirmação",
        "deposit": "Depósito de 10%",
        "remaining": "90% Restante (P2P)",
        "confirm_button": "Confirmar Reserva",
        "processing": "Processando Transação...",
        "success": "Reserva Confirmada!"
      },
      "categories": {
        "all": "Todas as Propriedades",
        "villa": "Villas",
        "beach": "Casas de Praia",
        "mansion": "Mansões",
        "apartment": "Apartamentos de Luxo"
      },
      "grid": {
        "title": "Descubra o Extraordinário.",
        "subtitle": "Curadoria exclusiva das propriedades mais luxuosas do mundo. Viva experiências únicas com pagamento simplificado em criptomoedas."
      },
      "footer": {
        "description": "A nova era do morar de luxo. house3 redefine a exclusividade através de propriedades extraordinárias e pagamentos descentralizados.",
        "collections": "Coleções",
        "ecosystem": "Ecossistema",
        "privacy": "Privacidade",
        "terms": "Termos de Uso",
        "policy": "Política de Dados",
        "security": "Segurança Blockchain",
        "contact": "Contato VIP"
      },
      "how_it_works": {
        "badge": "Processo Exclusivo",
        "title": "Como Reservar com Cripto",
        "subtitle": "Unimos a segurança da blockchain com a curadoria das melhores plataformas de luxo do mundo.",
        "step1_title": "Escolha e Depósito",
        "step1_desc": "Selecione seu imóvel e realize o depósito de 10% (Markup house3) via BTC, ETH, SOL ou USDC.",
        "step2_title": "Bloqueio Imediato",
        "step2_desc": "Nosso concierge valida a disponibilidade e bloqueia o imóvel na plataforma de origem em tempo real.",
        "step3_title": "Pagamento Final",
        "step3_desc": "Após a confirmação, você envia os 90% restantes. Garantimos a liquidação P2P com o proprietário.",
        "step4_title": "Voucher & Check-in",
        "step4_desc": "Você recebe o voucher oficial da plataforma originária e todas as instruções de acesso VIP."
      },
      "concierge_section": {
        "badge": "house3 Concierge",
        "title": "Sua Estadia, Elevada ao Máximo.",
        "subtitle": "Nossa equipe de concierge dedicada está disponível 24/7 para garantir que cada detalhe da sua estadia seja impecável. De chefs privados a traslados de helicóptero, o extraordinário é o nosso padrão.",
        "vip_access": "Acesso VIP",
        "blockchain_security": "Segurança Blockchain",
        "instant_payments": "Pagamentos Instantâneos",
        "crypto_networks": "BTC • ETH • SOL"
      },
      "why_house_bz": {
        "title": "Por que house3?",
        "subtitle": "Redefinindo o mercado imobiliário de luxo através da descentralização e exclusividade.",
        "feature1_title": "Privacidade Absoluta",
        "feature1_desc": "Transações seguras e discretas via blockchain, garantindo total anonimato e proteção de dados para nossos membros.",
        "feature2_title": "Curadoria Global",
        "feature2_desc": "Acesso a propriedades que não estão no mercado convencional. Selecionamos apenas o extraordinário em cada destino.",
        "feature3_title": "Liquidez em Cripto",
        "feature3_desc": "Utilize seu patrimônio digital para viver experiências reais. Aceitamos as principais redes e tokens do mercado."
      },
      "owner_dashboard": {
        "title": "Dashboard do Proprietário",
        "subtitle": "Gerencie suas propriedades de luxo e recebimentos em cripto.",
        "tabs": {
          "profile": "Perfil Financeiro",
          "bookings": "Minhas Reservas",
          "properties": "Meus Imóveis",
          "claims": "Reivindicações"
        },
        "profile": {
          "title": "Configurações de Recebimento",
          "desc": "Defina como você deseja receber os 90% do valor das reservas (P2P).",
          "wallet_label": "Endereço da Carteira (EVM/Solana)",
          "token_label": "Token de Preferência",
          "terms_label": "Aceito os termos de \"Zero Custody\" da house3. Compreendo que a plataforma atua apenas como intermediária tecnológica, capturando 10% de taxa, e que o recebimento dos 90% restantes é de minha responsabilidade direta via P2P.",
          "save_button": "Salvar Configurações"
        }
      },
      "admin_dashboard": {
        "title": "Painel de Arbitragem",
        "subtitle": "Gerencie reservas manuais e fluxos de pagamento crypto.",
        "filters": {
          "all": "Todos",
          "pending_deposit": "Depósito Pendente",
          "deposit_confirmed": "Depósito Confirmado",
          "awaiting_full_payment": "Aguardando Pagamento Total"
        }
      }
    }
  },
  es: {
    translation: {
      "nav": {
        "properties": "Propiedades",
        "concierge": "Conserje",
        "about": "Acerca de",
        "login": "Iniciar Sesión",
        "logout": "Cerrar Sesión"
      },
      "hero": {
        "title": "El Futuro de los Alquileres de Lujo",
        "subtitle": "Villas y mansiones exclusivas. Reserve con BTC, EVM y Solana.",
        "search_placeholder": "¿Dónde le gustaría quedarse?",
        "search_button": "Buscar"
      }
    }
  },
  it: { translation: { "nav": { "properties": "Proprietà" } } },
  de: { translation: { "nav": { "properties": "Immobilien" } } },
  fr: { translation: { "nav": { "properties": "Propriétés" } } },
  ko: { translation: { "nav": { "properties": "부동산" } } },
  ja: { translation: { "nav": { "properties": "物件" } } },
  zh: { translation: { "nav": { "properties": "房产" } } },
  ru: { translation: { "nav": { "properties": "Недвижимость" } } },
  ar: { translation: { "nav": { "properties": "عقارات" } } }
};

i18n
  .use(LanguageDetector)
  .use(initReactI18next)
  .init({
    resources,
    fallbackLng: 'en',
    interpolation: {
      escapeValue: false,
    },
  });

export default i18n;
