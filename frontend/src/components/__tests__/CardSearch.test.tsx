import { render, screen, fireEvent } from '@testing-library/react';
import { CardSearch } from '../CardSearch';
import { useRouter } from 'next/navigation';
import { useSearchStore } from '@/store/searchStore';

jest.mock('next/navigation', () => ({
  useRouter: jest.fn(),
}));

jest.mock('@/store/searchStore', () => ({
  useSearchStore: jest.fn(),
}));

describe('CardSearch', () => {
  const mockPush = jest.fn();
  const mockUpdateFilter = jest.fn();

  beforeEach(() => {
    (useRouter as jest.Mock).mockReturnValue({
      push: mockPush,
    });
    (useSearchStore as jest.Mock).mockReturnValue({
      updateFilter: mockUpdateFilter,
    });
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('renders search input', () => {
    render(<CardSearch />);
    expect(screen.getByPlaceholderText(/search cards/i)).toBeInTheDocument();
  });

  it('updates search query on input change', () => {
    render(<CardSearch />);
    const input = screen.getByPlaceholderText(/search cards/i) as HTMLInputElement;
    fireEvent.change(input, { target: { value: 'test card' } });
    expect(input.value).toBe('test card');
  });

  it('submits search on form submit', () => {
    render(<CardSearch />);
    const input = screen.getByPlaceholderText(/search cards/i);
    const form = input.closest('form');

    fireEvent.change(input, { target: { value: 'test card' } });
    fireEvent.submit(form!);

    expect(mockUpdateFilter).toHaveBeenCalledWith('textSearch', 'test card');
    expect(mockPush).toHaveBeenCalledWith('/cards');
  });
});
