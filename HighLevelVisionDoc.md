# 📘 Riftbound Atlas — High-Definition Card Database  
Author: [Your Name]  
Status: Draft v1  
Target Launch: MVP in 6–8 weeks  
Data Source: Official Riftbound API (via Riot Games Developer Portal)

---

# 1. 🎯 Vision

Build the definitive, high-performance, high-definition card reference and analytics platform for Riftbound players.

## Core Goals
- Fast, searchable card database
- Crisp, zoomable high-definition artwork
- Advanced filtering & deck tools (manual assembly only)
- Transformative value beyond Riot’s official gallery
- Fully compliant with Riot API & monetization policies

## Non-Goals
- No gameplay simulation
- No rule engine
- No matchmaking
- No digital client replication

---

# 2. 🧱 System Architecture

## 2.1 High-Level Architecture

[Riot Riftbound API]
|
Ingestion Worker (cron / webhook)
|
Normalization Layer
|
PostgreSQL
|
Redis Cache
|
Backend API (Node / Go / Rust)
|
CDN (Cloudflare / Fastly)
|
Frontend (Next.js / React)


---

# 3. 📦 Data Model

## 3.1 Core Tables

### `cards`
- id (uuid)
- riot_card_id (string)
- name
- faction
- rarity
- cost
- type
- attack
- health
- text_raw
- text_parsed (JSON structured keywords)
- flavor_text
- artist
- set_id
- release_date
- last_updated
- image_small_url
- image_hd_url

### `sets`
- id
- name
- release_date
- patch_version

### `keywords`
- id
- name
- description

### `card_keywords`
- card_id
- keyword_id

### `patch_changes`
- card_id
- patch_version
- field_changed
- old_value
- new_value
- change_date

---

# 4. 🖼 High-Definition Image Strategy

## 4.1 Compliance Approach
- Use official Riot-provided asset URLs only.
- Do not re-host master originals unless explicitly allowed.
- Cache optimized versions for performance.
- Preserve artist attribution metadata.

## 4.2 Image Optimization Pipeline
1. Pull image URLs from Riot API.
2. Store metadata only (not raw original).
3. Generate:
   - Thumbnail (300px)
   - Standard (800px)
   - HD (1600px)
4. Serve via CDN with:
   - WebP/AVIF conversion
   - Lazy loading
   - Progressive rendering

## 4.3 Zoom Experience
- Deep-zoom viewer (e.g., OpenSeadragon-style)
- Retina support
- Click-to-expand modal
- No download button

---

# 5. 🔍 Search & Filtering Engine

## 5.1 Requirements
- Sub-50ms search response
- Faceted filtering
- Multi-tag queries
- Boolean syntax support

## 5.2 Stack
Option A:
- PostgreSQL full-text search

Option B:
- ElasticSearch / Meilisearch

## 5.3 Supported Filters
- Cost range
- Faction
- Rarity
- Type
- Keyword
- Set
- Patch version
- Stat thresholds
- Text contains

Advanced:
- “Find similar cards”
- “Find synergy cards”

---

# 6. 🧠 Transformative Features

To satisfy Riot’s monetization policy.

## 6.1 Card Synergy Graph
- Graph-based relationship mapping
- Cluster detection
- Visualized mechanics interactions

## 6.2 Patch Diff Viewer
- Side-by-side comparison
- Highlight stat/text changes
- Historical timeline

## 6.3 Deck Builder (Manual Only)
- Drag-and-drop
- Mana curve visualization
- Export/share links
- No automated rules enforcement

## 6.4 Community Layer
- Rating system
- Strategy notes
- Tagging system

---

# 7. 💰 Monetization Model (Compliant)

- Display ads only (non-intrusive)
- No paywall for core database
- Optional:
  - Ad-free tier
  - Advanced analytics dashboards

Explicitly avoid:
- Selling assets
- Premium card unlocks
- Gameplay simulation subscriptions

---

# 8. ⚡ Performance Requirements

## 8.1 Load Targets
- <1.5s initial page load
- <100ms search response
- 99.9% uptime

## 8.2 Optimization
- Edge caching
- Static generation for card pages
- CDN image delivery
- API rate-limit aware ingestion

---

# 9. 🔐 API & Rate Management

- Secure server-side key storage
- No client exposure
- Backoff strategy for rate limits
- Version monitoring
- Daily sync job

---

# 10. 🧾 Legal & Compliance

## 10.1 Required Disclaimer

Footer:
> Riftbound and related assets are property of Riot Games. This is an unofficial fan project and is not endorsed by Riot Games.

## 10.2 Branding Rules
- Do not mimic official UI
- Avoid Riot logos unless policy allows
- Clear unofficial labeling

---

# 11. 🎨 UX Principles

- Dark mode default
- Grid-first browsing
- Large art-forward design
- Minimal clutter
- Mobile responsive
- Keyboard searchable

---

# 12. 🚀 Development Phases

## Phase 1 — MVP (Weeks 1–3)
- API ingestion
- Basic card grid
- Search + filters
- Card detail page
- Standard-resolution images

## Phase 2 — HD Experience (Weeks 4–5)
- Zoom viewer
- CDN optimization
- Patch diff system

## Phase 3 — Value Add (Weeks 6–8)
- Deck builder
- Synergy graph
- Community tagging

---

# 13. 📊 Analytics & Growth

Track:
- Most viewed cards
- Search terms
- Popular filters
- Time on card page
- Deck export frequency

Use to:
- Improve discovery
- Build meta insights
- Create SEO landing pages (compliant)

---

# 14. 🛡 Risk Mitigation

| Risk | Mitigation |
|------|------------|
| DMCA | Use API assets only |
| Rate limit | Cache aggressively |
| Policy violation | No gameplay simulation |
| Monetization rejection | Keep free tier |

---

# 15. 🧩 Competitive Edge Strategy

To avoid being “just another card database”:

- Make the fastest search
- Provide the cleanest HD zoom
- Add real analytics tools
- Build developer-grade infrastructure
- Optimize for SEO without scraping

---

# Summary

Riftbound Atlas will be:

- Art-forward
- Performance-first
- Policy-compliant
- Transformative
- Monetizable via ads
- Built for scale from day one