/* eslint-env jest */
import React from 'react';
import { render, screen, waitFor, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom';
import { MemoryRouter } from 'react-router-dom';
import Products from '../Products';
import { supabase } from '../../supabaseClient';
import { useAuthStore, useWishlistStore, useMascotStore } from '../../hooks/useReduxStore';

// ─── Mocks ───────────────────────────────────────────────────────────────────

jest.mock('framer-motion', () => {
  const React = require('react');
  return {
    motion: new Proxy({}, {
      get: (_target, prop) => React.forwardRef((props, ref) => {
        const { initial, animate, exit, layout, layoutId, whileInView, viewport, transition, whileHover, whileTap, variants, ...rest } = props;
        return React.createElement(prop, { ref, ...rest });
      }),
    }),
    AnimatePresence: ({ children }) => <>{children}</>,
  };
});

jest.mock('../../hooks/useReduxStore', () => ({
  useAuthStore: jest.fn(),
  useWishlistStore: jest.fn(),
  useMascotStore: jest.fn(),
}));

jest.mock('../../supabaseClient', () => ({
  supabase: {
    from: jest.fn(),
  },
}));

jest.mock('../../hooks/useMinimumLoading', () => ({
  useMinimumLoading: (isLoading) => isLoading,
}));

jest.mock('../../components/PageLoader', () => {
  return function MockPageLoader({ label }) {
    return <div data-testid="page-loader">{label}</div>;
  };
});

const mockProducts = [
  {
    id: "uuid-1",
    name: "Salmon Wellness Mix",
    description: "Rich in Omega-3.",
    price: 52.50,
    category: "Food",
    image_url: "url1",
    stock: 30,
    created_at: "2026-03-26T16:48:06.151Z"
  },
  {
    id: "uuid-2",
    name: "Sage Green Knit Sweater",
    description: "Minimalist cozy sweater.",
    price: 25.00,
    category: "Fashion",
    image_url: "url2",
    stock: 20,
    created_at: "2026-03-26T16:48:06.151Z"
  }
];

describe('Products Component', () => {
  const mockOnAddToCart = jest.fn();
  const mockFetchWishlist = jest.fn();
  const mockToggleWishlist = jest.fn();
  const mockSetWagging = jest.fn();
  const mockTriggerJump = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();

    useAuthStore.mockReturnValue({
      user: { id: 'test-user-id' }
    });

    useWishlistStore.mockReturnValue({
      wishlistIds: new Set(['uuid-1']),
      fetchWishlist: mockFetchWishlist,
      toggleWishlist: mockToggleWishlist,
    });

    useMascotStore.mockReturnValue({
      setWagging: mockSetWagging,
      triggerJump: mockTriggerJump,
    });

    const mockSelect = jest.fn().mockReturnThis();
    const mockOrder = jest.fn().mockResolvedValue({ data: mockProducts, error: null });
    supabase.from.mockReturnValue({
      select: mockSelect,
      order: mockOrder,
    });
  });

  const renderProducts = () => {
    return render(
      <MemoryRouter>
        <Products onAddToCart={mockOnAddToCart} />
      </MemoryRouter>
    );
  };

  test('renders loading state initially', async () => {
    supabase.from.mockReturnValue({
      select: jest.fn().mockReturnThis(),
      order: jest.fn().mockImplementation(() => new Promise(resolve => setTimeout(() => resolve({ data: mockProducts, error: null }), 100)))
    });

    renderProducts();
    expect(screen.getByTestId('page-loader')).toBeInTheDocument();
    
    await waitFor(() => {
      expect(screen.queryByTestId('page-loader')).not.toBeInTheDocument();
    });
  });

  test('fetches and displays products on successful load', async () => {
    renderProducts();

    await waitFor(() => {
      expect(screen.getByText('Salmon Wellness Mix')).toBeInTheDocument();
      expect(screen.getByText('Sage Green Knit Sweater')).toBeInTheDocument();
    });

    expect(screen.getByText('$52.50')).toBeInTheDocument();
    expect(screen.getByText('$25.00')).toBeInTheDocument();
  });

  test('displays error message when API call fails', async () => {
    supabase.from.mockReturnValue({
      select: jest.fn().mockReturnThis(),
      order: jest.fn().mockResolvedValue({ data: null, error: new Error('Failed to fetch from DB') })
    });

    renderProducts();

    await waitFor(() => {
      expect(screen.getByText('Could not load products')).toBeInTheDocument();
      expect(screen.getByText('Failed to fetch from DB')).toBeInTheDocument();
    });
  });

  test('calls onAddToCart and trigger global dispatch when clicking add to cart', async () => {
    const dispatchEventSpy = jest.spyOn(window, 'dispatchEvent');

    renderProducts();

    await waitFor(() => {
      expect(screen.getByText('Salmon Wellness Mix')).toBeInTheDocument();
    });

    const addToCartBtns = screen.getAllByText('Add').map(n => n.closest('button'));
    fireEvent.click(addToCartBtns[0]);

    expect(mockOnAddToCart).toHaveBeenCalledWith(mockProducts[0]);
    expect(mockTriggerJump).toHaveBeenCalled();
    expect(dispatchEventSpy).toHaveBeenCalledWith(expect.any(CustomEvent));
    expect(dispatchEventSpy.mock.calls[0][0].type).toBe('fly-to-cart');

    dispatchEventSpy.mockRestore();
  });

  test('filters products by search query', async () => {
    renderProducts();

    await waitFor(() => {
      expect(screen.getByText('Salmon Wellness Mix')).toBeInTheDocument();
      expect(screen.getByText('Sage Green Knit Sweater')).toBeInTheDocument();
    });

    const searchInput = screen.getByPlaceholderText('Search premium products...');
    fireEvent.change(searchInput, { target: { value: 'Salmon' } });

    await waitFor(() => {
      expect(screen.getByText('Salmon Wellness Mix')).toBeInTheDocument();
      expect(screen.queryByText('Sage Green Knit Sweater')).not.toBeInTheDocument();
    });
  });

  test('filters products by category', async () => {
    renderProducts();

    await waitFor(() => {
      expect(screen.getByText('Salmon Wellness Mix')).toBeInTheDocument();
      expect(screen.getByText('Sage Green Knit Sweater')).toBeInTheDocument();
    });

    const fashionCategoryBtn = screen.getByRole('button', { name: /Fashion/i });
    fireEvent.click(fashionCategoryBtn);

    await waitFor(() => {
      expect(screen.queryByText('Salmon Wellness Mix')).not.toBeInTheDocument();
      expect(screen.getByText('Sage Green Knit Sweater')).toBeInTheDocument();
    });
  });

  test('sorts products by price ascending', async () => {
    renderProducts();

    await waitFor(() => {
        expect(screen.getByText('Salmon Wellness Mix')).toBeInTheDocument();
    });
    
    // Default order matches mockProducts
    let items = screen.getAllByRole('heading', { level: 3 });
    expect(items[0].textContent).toBe('Salmon Wellness Mix');
    expect(items[1].textContent).toBe('Sage Green Knit Sweater');

    const sortButton = screen.getByText('Recommended').closest('button');
    fireEvent.click(sortButton);

    const sortAscOption = await screen.findByText('Price: Low to High');
    fireEvent.click(sortAscOption);

    await waitFor(() => {
      items = screen.getAllByRole('heading', { level: 3 });
      expect(items[0].textContent).toBe('Sage Green Knit Sweater');
      expect(items[1].textContent).toBe('Salmon Wellness Mix');
    });
  });

  test('displays "No products found" when database is empty', async () => {
    supabase.from.mockReturnValue({
      select: jest.fn().mockReturnThis(),
      order: jest.fn().mockResolvedValue({ data: [], error: null })
    });

    renderProducts();

    await waitFor(() => {
      expect(screen.getByText('No products found.')).toBeInTheDocument();
    });
  });

  test('toggles wishlist status on click', async () => {
    renderProducts();

    await waitFor(() => {
        expect(screen.getByText('Salmon Wellness Mix')).toBeInTheDocument();
    });

    const favoriteIcons = screen.getAllByText('favorite');
    const favButton = favoriteIcons[0].closest('button');
    fireEvent.click(favButton);

    expect(mockToggleWishlist).toHaveBeenCalledWith('test-user-id', mockProducts[0].id);
  });
  
  test('opens product modal on click and closes it', async () => {
    renderProducts();

    await waitFor(() => {
        expect(screen.getByText('Salmon Wellness Mix')).toBeInTheDocument();
    });
    
    const productCard = screen.getByText('Salmon Wellness Mix').closest('.glass-panel');
    fireEvent.click(productCard);

    await waitFor(() => {
      expect(screen.getByText('Add to Bag')).toBeInTheDocument();
    });
    
    const closeBtns = screen.getAllByText('close').map(b => b.closest('button'));
    fireEvent.click(closeBtns[0]);
    
    await waitFor(() => {
      expect(screen.queryByText('Add to Bag')).not.toBeInTheDocument();
    });
  });
});
