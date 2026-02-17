# Riftbound Card Database

A comprehensive database and API client for Riot Games' Riftbound Trading Card Game.

## Overview

This project provides tools to fetch, store, and analyze card data from the official Riftbound card gallery. It includes:

- **API Analysis Report**: Detailed documentation of the Riftbound data structure
- **Python Fetcher**: Script to download card data and images
- **Card Database**: JSON export of all 664+ cards

## Quick Start

### Installation

```bash
# Install dependencies
pip install -r requirements.txt
```

### Fetch Card Data

```bash
# Fetch all card data (simplified format)
python fetch_cards.py --output cards.json

# Fetch full card data (includes all metadata)
python fetch_cards.py --output cards_full.json --full

# Download card images (first 10 for testing)
python fetch_cards.py --output cards.json --images ./images --limit 10

# Download all card images
python fetch_cards.py --output cards.json --images ./images
```

## Project Structure

```
RiftboundCardDatabase/
├── README.md                      # This file
├── RIFTBOUND_API_ANALYSIS.md      # Comprehensive API documentation
├── requirements.txt               # Python dependencies
├── fetch_cards.py                 # Card data fetcher script
├── cards.json                     # Card data (generated)
└── images/                        # Card images (optional)
    ├── ogn-001-298.png
    ├── ogn-002-298.png
    └── ...
```

## Card Data Structure

### Simplified Format (Default)

```json
{
  "id": "ogn-056-298",
  "name": "Adaptatron",
  "code": "OGN-056/298",
  "collector_number": 56,
  "set": "OGN",
  "set_name": "Origins",
  "type": "Unit",
  "type_id": "unit",
  "rarity": "Uncommon",
  "rarity_id": "uncommon",
  "image_url": "https://cmsassets.rgpub.io/.../a3ddb00a2a872eaceb96469739531414aa27455d-744x1039.png",
  "image_hash": "a3ddb00a2a872eaceb96469739531414aa27455d",
  "orientation": "portrait",
  "domains": ["Calm"],
  "domain_ids": ["calm"],
  "energy": 4,
  "might": 3,
  "tags": ["Mech", "Piltover"],
  "ability_html": "<p>When I conquer, you may kill a gear...</p>",
  "artists": ["Kudos Productions"]
}
```

## API Documentation

See [RIFTBOUND_API_ANALYSIS.md](RIFTBOUND_API_ANALYSIS.md) for comprehensive documentation including:

- API endpoint details
- Complete data structure
- Image URL patterns
- Card statistics
- Implementation recommendations

## Key Findings

### Card Statistics (as of Feb 2026)

- **Total Cards**: 664
- **Sets**: 
  - Origins (OGN): 352 cards
  - Spiritforged (SFD): 288 cards
  - Proving Grounds (OGS): 24 cards
- **Card Types**: Unit, Spell, Gear, Legend, Battlefield, Rune
- **Domains**: Body, Calm, Chaos, Colorless, Fury, Mind, Order
- **Rarities**: Common, Uncommon, Rare, Epic, Showcase

### API Endpoint

```
https://riftbound.leagueoflegends.com/_next/data/{BUILD_ID}/en-us/card-gallery.json
```

**No authentication required!** The script automatically detects the current build ID.

## Usage Examples

### Python Script

```python
from fetch_cards import RiftboundCardFetcher

# Create fetcher
fetcher = RiftboundCardFetcher()

# Fetch all cards (simplified)
cards = fetcher.fetch_all(simplify=True)

# Print first card
print(cards[0])

# Filter by set
ogn_cards = [c for c in cards if c['set'] == 'OGN']
print(f"Origins has {len(ogn_cards)} cards")

# Filter by type
units = [c for c in cards if c['type'] == 'Unit']
print(f"Found {len(units)} unit cards")
```

### Command Line

```bash
# Get help
python fetch_cards.py --help

# Fetch cards with different options
python fetch_cards.py -o data/cards.json
python fetch_cards.py --full -o data/cards_full.json
python fetch_cards.py -o cards.json --images ./card_images --limit 50
```

## Image URLs

Card images are hosted on Riot's CDN:

```
https://cmsassets.rgpub.io/sanity/images/dsfx7636/game_data_live/{HASH}-744x1039.png?accountingTag=RB
```

- **Size**: 744x1039 pixels (portrait)
- **Format**: PNG
- **CDN**: Riot Games CDN (cmsassets.rgpub.io)

## Data Updates

The script automatically detects the current build ID, so it will always fetch the latest data. To update your local database:

```bash
# Re-run the fetcher
python fetch_cards.py --output cards.json

# Compare with previous version
diff cards.json cards_backup.json
```

**Recommended update frequency:**
- Daily during new set releases
- Weekly during stable periods

## Advanced Usage

### Custom Processing

```python
from fetch_cards import RiftboundCardFetcher
import json

fetcher = RiftboundCardFetcher()

# Get full data structure
data = fetcher.fetch_card_data()
cards = fetcher.extract_cards(data)

# Custom processing
for card in cards:
    # Your custom logic here
    if card.get('rarity', {}).get('value', {}).get('id') == 'epic':
        print(f"Epic card: {card['name']}")
```

### Database Integration

```python
import sqlite3
from fetch_cards import RiftboundCardFetcher

# Fetch cards
fetcher = RiftboundCardFetcher()
cards = fetcher.fetch_all(simplify=True)

# Store in SQLite
conn = sqlite3.connect('riftbound.db')
cursor = conn.cursor()

# Create table
cursor.execute('''
    CREATE TABLE IF NOT EXISTS cards (
        id TEXT PRIMARY KEY,
        name TEXT,
        code TEXT,
        set_id TEXT,
        type TEXT,
        rarity TEXT,
        energy INTEGER,
        might INTEGER,
        image_url TEXT
    )
''')

# Insert cards
for card in cards:
    cursor.execute('''
        INSERT OR REPLACE INTO cards VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
    ''', (
        card['id'],
        card['name'],
        card['code'],
        card['set'],
        card['type'],
        card['rarity'],
        card.get('energy'),
        card.get('might'),
        card['image_url']
    ))

conn.commit()
conn.close()
```

## Contributing

This is a personal project for educational purposes. Feel free to fork and modify for your own use.

## Legal

This project is not affiliated with or endorsed by Riot Games. All card data, images, and trademarks are property of Riot Games.

**Riot's Policy on Third-Party Tools:**
- ✅ Card galleries and databases are allowed
- ✅ Deck builders and theorycrafting tools are allowed
- ❌ Automated gameplay tools are prohibited

Please respect Riot's API and don't abuse the endpoints.

## Resources

- **Official Site**: https://riftbound.leagueoflegends.com/
- **Riot Developer Portal**: https://developer.riotgames.com/docs/riftbound
- **Scrydex API**: https://scrydex.com/docs/riftbound/cards (alternative API)

## License

MIT License - See LICENSE file for details

## Changelog

### v1.0.0 (2026-02-17)
- Initial release
- Card data fetcher script
- Comprehensive API documentation
- Support for all 664 cards across 3 sets
- Image downloading capability
