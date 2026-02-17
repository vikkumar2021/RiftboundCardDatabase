import Link from 'next/link';
import { CardSearch } from '@/components/CardSearch';
import { FeaturedCards } from '@/components/FeaturedCards';

export default function Home() {
  return (
    <main className="min-h-screen">
      {/* Hero Section */}
      <section className="container mx-auto px-4 py-16">
        <div className="text-center mb-12">
          <h1 className="text-5xl font-bold mb-4 bg-gradient-to-r from-blue-400 to-purple-600 bg-clip-text text-transparent">
            Riftbound Atlas
          </h1>
          <p className="text-xl text-gray-400 mb-8">
            High-definition card database and analytics platform
          </p>
          <CardSearch />
        </div>

        {/* Featured Cards */}
        <FeaturedCards />
      </section>

      {/* Footer */}
      <footer className="border-t border-gray-800 mt-16">
        <div className="container mx-auto px-4 py-8">
          <p className="text-sm text-gray-500 text-center">
            Riftbound and related assets are property of Riot Games. This is an unofficial fan
            project and is not endorsed by Riot Games.
          </p>
        </div>
      </footer>
    </main>
  );
}
