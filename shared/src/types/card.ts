export interface Card {
  id: string;
  riotCardId: string;
  name: string;
  faction: string;
  rarity: string;
  cost: number;
  type: string;
  attack?: number;
  health?: number;
  textRaw?: string;
  textParsed?: Record<string, unknown>;
  flavorText?: string;
  artist?: string;
  setId: string;
  releaseDate: Date;
  lastUpdated: Date;
  imageSmallUrl: string;
  imageHdUrl: string;
}

export interface Set {
  id: string;
  name: string;
  releaseDate: Date;
  patchVersion: string;
}

export interface Keyword {
  id: string;
  name: string;
  description: string;
}

export interface CardKeyword {
  cardId: string;
  keywordId: string;
}

export interface PatchChange {
  cardId: string;
  patchVersion: string;
  fieldChanged: string;
  oldValue: string | number | null;
  newValue: string | number | null;
  changeDate: Date;
}

export interface CardSearchFilters {
  costMin?: number;
  costMax?: number;
  factions?: string[];
  rarities?: string[];
  types?: string[];
  keywords?: string[];
  sets?: string[];
  patchVersion?: string;
  textSearch?: string;
  attackMin?: number;
  attackMax?: number;
  healthMin?: number;
  healthMax?: number;
}

export interface CardSearchResult {
  cards: Card[];
  total: number;
  page: number;
  pageSize: number;
  filters: CardSearchFilters;
}
