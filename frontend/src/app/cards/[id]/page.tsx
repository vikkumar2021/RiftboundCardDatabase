import { CardDetail } from '@/components/CardDetail';
import { notFound } from 'next/navigation';

interface PageProps {
  params: {
    id: string;
  };
}

async function getCard(id: string) {
  const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001';
  try {
    const res = await fetch(`${apiUrl}/api/cards/${id}`, {
      next: { revalidate: 3600 }, // Revalidate every hour
    });

    if (!res.ok) {
      return null;
    }

    return res.json();
  } catch (error) {
    console.error('Failed to fetch card:', error);
    return null;
  }
}

export default async function CardDetailPage({ params }: PageProps) {
  const card = await getCard(params.id);

  if (!card) {
    notFound();
  }

  return <CardDetail card={card} />;
}
