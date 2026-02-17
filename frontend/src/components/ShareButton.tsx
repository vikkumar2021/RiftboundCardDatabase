'use client';

export function ShareButton() {
  const handleShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: 'Riftbound Card',
          url: window.location.href,
        });
      } catch (err) {
        // User cancelled or error occurred
        console.log('Share failed:', err);
      }
    } else {
      // Fallback to clipboard
      await navigator.clipboard.writeText(window.location.href);
      alert('Link copied to clipboard!');
    }
  };

  return (
    <button
      onClick={handleShare}
      className="px-4 py-2 bg-blue-600 hover:bg-blue-700 rounded-lg transition-colors"
    >
      Share Card
    </button>
  );
}
