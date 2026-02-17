import { render, screen } from '@testing-library/react';
import { CardGrid } from '../CardGrid';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { useSearchStore } from '@/store/searchStore';

jest.mock('@/store/searchStore');
jest.mock('@/lib/api', () => ({
  cardApi: {
    getCards: jest.fn(),
    searchCards: jest.fn(),
  },
}));

const createWrapper = () => {
  const queryClient = new QueryClient({
    defaultOptions: {
      queries: { retry: false },
    },
  });
  return ({ children }: { children: React.ReactNode }) => (
    <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
  );
};

describe('CardGrid', () => {
  beforeEach(() => {
    (useSearchStore as jest.Mock).mockReturnValue({
      filters: {},
    });
  });

  it('renders loading state', () => {
    render(<CardGrid />, { wrapper: createWrapper() });
    // Check for loading skeletons
    expect(screen.getAllByRole('generic').length).toBeGreaterThan(0);
  });
});
