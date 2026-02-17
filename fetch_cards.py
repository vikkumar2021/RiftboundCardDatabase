#!/usr/bin/env python3
"""
Riftbound Card Data Fetcher

This script fetches card data from the official Riftbound website.
It automatically detects the current build ID and extracts all card information.

Usage:
    python fetch_cards.py [--output cards.json] [--images ./images]
"""

import re
import json
import argparse
import requests
from pathlib import Path
from typing import Dict, List, Optional
from urllib.parse import urlparse


class RiftboundCardFetcher:
    """Fetches and processes Riftbound card data from the official website."""
    
    BASE_URL = "https://riftbound.leagueoflegends.com"
    GALLERY_PATH = "/en-us/card-gallery/"
    
    def __init__(self):
        self.session = requests.Session()
        self.session.headers.update({
            'User-Agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36'
        })
        self.build_id = None
        
    def fetch_build_id(self) -> str:
        """
        Fetch the current Next.js build ID from the HTML page.
        
        Returns:
            str: The build ID
            
        Raises:
            ValueError: If build ID cannot be found
        """
        print("Fetching build ID from HTML...")
        url = f"{self.BASE_URL}{self.GALLERY_PATH}"
        response = self.session.get(url)
        response.raise_for_status()
        
        # Look for the build ID in script tags
        # Pattern: /_next/static/BUILD_ID/_buildManifest.js
        pattern = r'/_next/static/([^/]+)/_buildManifest\.js'
        match = re.search(pattern, response.text)
        
        if match:
            self.build_id = match.group(1)
            print(f"✓ Found build ID: {self.build_id}")
            return self.build_id
        else:
            raise ValueError("Could not find build ID in HTML")
    
    def fetch_card_data(self) -> Dict:
        """
        Fetch the card data JSON using the build ID.
        
        Returns:
            dict: The complete card data structure
            
        Raises:
            ValueError: If build ID is not set
        """
        if not self.build_id:
            self.fetch_build_id()
            
        print("Fetching card data...")
        url = f"{self.BASE_URL}/_next/data/{self.build_id}/en-us/card-gallery.json"
        response = self.session.get(url)
        response.raise_for_status()
        
        data = response.json()
        print(f"✓ Successfully fetched card data")
        return data
    
    def extract_cards(self, data: Dict) -> List[Dict]:
        """
        Extract the cards array from the full data structure.
        
        Args:
            data: The complete JSON data from the API
            
        Returns:
            list: Array of card objects
        """
        try:
            cards = data['pageProps']['page']['blades'][2]['cards']['items']
            print(f"✓ Extracted {len(cards)} cards")
            return cards
        except (KeyError, IndexError) as e:
            raise ValueError(f"Could not extract cards from data structure: {e}")
    
    def simplify_card(self, card: Dict) -> Dict:
        """
        Simplify a card object to include only the most important fields.
        
        Args:
            card: The full card object
            
        Returns:
            dict: Simplified card object
        """
        simplified = {
            'id': card.get('id'),
            'name': card.get('name'),
            'code': card.get('publicCode'),
            'collector_number': card.get('collectorNumber'),
            'set': card.get('set', {}).get('value', {}).get('id'),
            'set_name': card.get('set', {}).get('value', {}).get('label'),
            'type': card.get('cardType', {}).get('type', [{}])[0].get('label'),
            'type_id': card.get('cardType', {}).get('type', [{}])[0].get('id'),
            'rarity': card.get('rarity', {}).get('value', {}).get('label'),
            'rarity_id': card.get('rarity', {}).get('value', {}).get('id'),
            'image_url': card.get('cardImage', {}).get('url'),
            'orientation': card.get('orientation'),
        }
        
        # Add optional fields
        if 'domain' in card and 'values' in card['domain']:
            domains = [d['label'] for d in card['domain']['values']]
            domain_ids = [d['id'] for d in card['domain']['values']]
            simplified['domains'] = domains
            simplified['domain_ids'] = domain_ids
        
        if 'energy' in card:
            simplified['energy'] = card['energy']['value']['id']
            
        if 'might' in card:
            simplified['might'] = card['might']['value']['id']
            
        if 'power' in card:
            simplified['power'] = card['power']['value']['id']
            
        if 'tags' in card:
            simplified['tags'] = card['tags'].get('tags', [])
            
        if 'text' in card:
            ability_html = card['text'].get('richText', {}).get('body', '')
            simplified['ability_html'] = ability_html
            
        if 'illustrator' in card:
            artists = [a['label'] for a in card['illustrator'].get('values', [])]
            simplified['artists'] = artists
            
        if 'cardType' in card and 'superType' in card['cardType']:
            super_types = [st['label'] for st in card['cardType']['superType']]
            simplified['super_types'] = super_types
            
        # Extract image hash from URL for easier reference
        if simplified.get('image_url'):
            url_parts = simplified['image_url'].split('/')
            for part in url_parts:
                if '-' in part and 'x' in part and part.endswith('.png'):
                    hash_part = part.split('-')[0]
                    simplified['image_hash'] = hash_part
                    break
        
        return simplified
    
    def download_image(self, url: str, output_dir: Path, filename: str) -> bool:
        """
        Download a card image.
        
        Args:
            url: The image URL
            output_dir: Directory to save the image
            filename: Filename to use
            
        Returns:
            bool: True if successful, False otherwise
        """
        try:
            output_dir.mkdir(parents=True, exist_ok=True)
            output_path = output_dir / filename
            
            if output_path.exists():
                return True
                
            response = self.session.get(url, stream=True)
            response.raise_for_status()
            
            with open(output_path, 'wb') as f:
                for chunk in response.iter_content(chunk_size=8192):
                    f.write(chunk)
                    
            return True
        except Exception as e:
            print(f"✗ Failed to download {filename}: {e}")
            return False
    
    def fetch_all(self, simplify: bool = True) -> List[Dict]:
        """
        Fetch all card data in one go.
        
        Args:
            simplify: Whether to simplify card objects
            
        Returns:
            list: Array of card objects
        """
        data = self.fetch_card_data()
        cards = self.extract_cards(data)
        
        if simplify:
            print("Simplifying card data...")
            cards = [self.simplify_card(card) for card in cards]
            print("✓ Card data simplified")
            
        return cards


def main():
    parser = argparse.ArgumentParser(
        description='Fetch Riftbound card data from the official website'
    )
    parser.add_argument(
        '--output', '-o',
        default='cards.json',
        help='Output JSON file path (default: cards.json)'
    )
    parser.add_argument(
        '--full',
        action='store_true',
        help='Save full card data instead of simplified version'
    )
    parser.add_argument(
        '--images',
        help='Download card images to this directory'
    )
    parser.add_argument(
        '--limit',
        type=int,
        help='Limit number of images to download (for testing)'
    )
    
    args = parser.parse_args()
    
    print("="*80)
    print("Riftbound Card Data Fetcher")
    print("="*80)
    print()
    
    fetcher = RiftboundCardFetcher()
    
    try:
        # Fetch card data
        cards = fetcher.fetch_all(simplify=not args.full)
        
        # Save to JSON
        print(f"\nSaving card data to {args.output}...")
        output_path = Path(args.output)
        output_path.parent.mkdir(parents=True, exist_ok=True)
        
        with open(output_path, 'w', encoding='utf-8') as f:
            json.dump(cards, f, indent=2, ensure_ascii=False)
        
        print(f"✓ Saved {len(cards)} cards to {args.output}")
        
        # Download images if requested
        if args.images:
            print(f"\nDownloading card images to {args.images}...")
            image_dir = Path(args.images)
            
            cards_to_download = cards[:args.limit] if args.limit else cards
            
            success_count = 0
            for i, card in enumerate(cards_to_download, 1):
                image_url = card.get('image_url') if args.full else card.get('image_url')
                if not image_url:
                    continue
                    
                card_id = card.get('id')
                filename = f"{card_id}.png"
                
                print(f"[{i}/{len(cards_to_download)}] Downloading {card.get('name')}...", end=' ')
                
                if fetcher.download_image(image_url, image_dir, filename):
                    print("✓")
                    success_count += 1
                else:
                    print("✗")
            
            print(f"\n✓ Downloaded {success_count}/{len(cards_to_download)} images")
        
        # Print summary
        print("\n" + "="*80)
        print("Summary")
        print("="*80)
        print(f"Total cards: {len(cards)}")
        
        if not args.full:
            # Count by set
            sets = {}
            for card in cards:
                set_name = card.get('set_name', 'Unknown')
                sets[set_name] = sets.get(set_name, 0) + 1
            
            print("\nCards by set:")
            for set_name, count in sorted(sets.items()):
                print(f"  {set_name}: {count}")
            
            # Count by type
            types = {}
            for card in cards:
                card_type = card.get('type', 'Unknown')
                types[card_type] = types.get(card_type, 0) + 1
            
            print("\nCards by type:")
            for card_type, count in sorted(types.items()):
                print(f"  {card_type}: {count}")
        
        print("\n✓ Done!")
        
    except Exception as e:
        print(f"\n✗ Error: {e}")
        return 1
    
    return 0


if __name__ == '__main__':
    exit(main())
