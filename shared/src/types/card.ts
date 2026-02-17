// Matches the Scrydex Riftbound API schema

export interface CardImage {
  type: string; // "front"
  small: string;
  medium: string;
  large: string;
}

export interface VariantPrice {
  condition: string; // "NM"
  isPerfect: boolean;
  isSigned: boolean;
  isError: boolean;
  type: string; // "raw"
  low: number;
  market: number;
  currency: string; // "USD"
  trends: {
    days_1?: { price_change: number; percent_change: number };
    days_7?: { price_change: number; percent_change: number };
  };
}

export interface CardVariant {
  name: string; // "normal", "foil"
  images: CardImage[];
  prices: VariantPrice[];
}

export interface Expansion {
  id: string; // "OGN"
  name: string; // "Origins"
  type: string; // "Main"
  code: string;
  total: number;
  printedTotal: number;
  releaseDate: string; // "2025/10/31"
  logo: string;
  language: string;
  languageCode: string;
}

export interface Card {
  id: string; // "OGN-296"
  name: string;
  number: string;
  printedNumber: string; // "296/298"
  domain: string; // "Colorless", "Fire", "Water", etc.
  type: string; // "Battlefield", "Champion", "Unit", etc.
  artist: string;
  rarity: string; // "Common", "Uncommon", "Rare", "Epic"
  rules: string[];
  images: CardImage[];
  expansion: Expansion;
  language: string;
  languageCode: string;
  expansionSortOrder: number;
  variants: CardVariant[];
}

// Internal DB representation (camelCase mapped from API)
export interface CardRecord {
  id: string;
  scrydexId: string; // e.g. "OGN-296"
  name: string;
  number: string;
  printedNumber: string;
  domain: string;
  type: string;
  artist: string;
  rarity: string;
  rules: string[];
  imageSmall: string;
  imageMedium: string;
  imageLarge: string;
  expansionId: string;
  language: string;
  languageCode: string;
  expansionSortOrder: number;
  variants: CardVariant[];
  lastUpdated: Date;
}

export interface CardSearchFilters {
  domains?: string[];
  rarities?: string[];
  types?: string[];
  expansions?: string[];
  textSearch?: string;
}

export interface CardSearchResult {
  cards: CardRecord[];
  total: number;
  page: number;
  pageSize: number;
  filters?: CardSearchFilters;
}

// Scrydex API response shape
export interface ScrydexCardResponse {
  id: string;
  name: string;
  number: string;
  printed_number: string;
  domain: string;
  type: string;
  artist: string;
  rarity: string;
  rules: string[];
  images: Array<{
    type: string;
    small: string;
    medium: string;
    large: string;
  }>;
  expansion: {
    id: string;
    name: string;
    type: string;
    code: string;
    total: number;
    printed_total: number;
    release_date: string;
    logo: string;
    language: string;
    language_code: string;
  };
  language: string;
  language_code: string;
  expansion_sort_order: number;
  variants: Array<{
    name: string;
    images: Array<{
      type: string;
      small: string;
      medium: string;
      large: string;
    }>;
    prices: Array<{
      condition: string;
      is_perfect: boolean;
      is_signed: boolean;
      is_error: boolean;
      type: string;
      low: number;
      market: number;
      currency: string;
      trends: Record<string, { price_change: number; percent_change: number }>;
    }>;
  }>;
}

export interface ScrydexExpansionResponse {
  id: string;
  name: string;
  type: string;
  code: string;
  total: number;
  printed_total: number;
  release_date: string;
  logo: string;
  language: string;
  language_code: string;
}

export interface ScrydexPaginatedResponse<T> {
  status: string;
  data: T[];
  page: number;
  pageSize: number;
  totalCount: number;
}
