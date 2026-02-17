// Matches the Riftbound card gallery data (scraped from Next.js endpoint)

export interface Card {
  id: string;
  riotId: string;
  publicCode: string; // e.g. "OGN-056"
  name: string;
  collectorNumber: string;
  domain: string; // "Body", "Calm", "Chaos", "Colorless", "Fury", "Mind", "Order"
  type: string; // "Unit", "Spell", "Gear", "Legend", "Battlefield", "Rune"
  superTypes: string[]; // e.g. ["Champion"]
  rarity: string; // "Common", "Uncommon", "Rare", "Epic", "Showcase"
  energy: string | null; // mana cost
  might: string | null; // attack stat
  power: string | null; // health/defense stat
  tags: string[]; // e.g. ["Mech", "Piltover"]
  rulesHtml: string | null; // ability text as HTML
  rulesText: string | null; // plain text for search
  artist: string | null;
  imageUrl: string; // full-res from cmsassets.rgpub.io (744x1039 PNG)
  orientation: string;
  setId: string;
  lastUpdated: string;
  set?: Expansion;
}

export interface Expansion {
  id: string; // "OGN", "SFD", "OGS"
  name: string; // "Origins", "Spiritforged", "Proving Grounds"
}

export interface CardSearchFilters {
  domains?: string[];
  rarities?: string[];
  types?: string[];
  expansions?: string[];
  tags?: string[];
  textSearch?: string;
}

export interface CardSearchResult {
  cards: Card[];
  total: number;
  page: number;
  pageSize: number;
  filters?: CardSearchFilters;
}
