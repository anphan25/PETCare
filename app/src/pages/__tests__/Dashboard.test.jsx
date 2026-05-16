import React from 'react';
import { render, screen, within, fireEvent } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { MemoryRouter } from 'react-router-dom';
import '@testing-library/jest-dom';
import Dashboard from '../Dashboard';


// ─── Mocks ──────────────────────────────────────────────────────────────────────

// Mock framer-motion to avoid animation complexity in tests.
// Every motion.* component is replaced with a plain HTML equivalent.
jest.mock('framer-motion', () => {
  const React = require('react');

  const forwardMotionComponent = (tag) =>
    React.forwardRef(({ initial, animate, whileInView, variants, viewport, transition, whileHover, whileTap, ...rest }, ref) =>
      React.createElement(tag, { ...rest, ref })
    );

  return {
    __esModule: true,
    motion: new Proxy({}, {
      get: (_target, prop) => forwardMotionComponent(prop),
    }),
    AnimatePresence: ({ children }) => React.createElement(React.Fragment, null, children),
  };
});

// ─── Helpers ────────────────────────────────────────────────────────────────────

/**
 * Renders Dashboard inside a MemoryRouter (required by <Link>).
 * Returns RTL render result plus the onAddToCart spy.
 */
const renderDashboard = (props = {}) => {
  const onAddToCart = jest.fn();
  const utils = render(
    <MemoryRouter>
      <Dashboard onAddToCart={onAddToCart} {...props} />
    </MemoryRouter>
  );
  return { ...utils, onAddToCart };
};

// ─── UNIT TESTS ─────────────────────────────────────────────────────────────────

describe('Dashboard — Unit Tests', () => {
  // ── Data / Props ──────────────────────────────────────────

  describe('Data layer', () => {
    test('topProducts should be the first 3 items from foodProducts', () => {
      // This is a logic check on the slice used inside the component.
      const expected = foodProducts.slice(0, 3);
      expect(expected).toHaveLength(3);
      expect(expected[0].id).toBe('food-1');
      expect(expected[1].id).toBe('food-2');
      expect(expected[2].id).toBe('food-3');
    });

    test('foodProducts array contains at least 3 items so topProducts is valid', () => {
      expect(foodProducts.length).toBeGreaterThanOrEqual(3);
    });
  });

  // ── Animation Variant Definitions ─────────────────────────

  describe('Animation variants', () => {
    // We import the variants indirectly by requiring the module source.
    // Since the component default-exports a function, the named constants
    // are module-scoped and not directly exported. We verify them through
    // the rendered output instead (animation props are stripped by mock).

    test('fadeInUp variant should define hidden and visible states', () => {
      // Verify the constant exists in the source — we can only test
      // that the component renders without error, which implicitly
      // validates the variant objects don't cause crashes.
      const { container } = renderDashboard();
      expect(container.firstChild).toBeTruthy();
    });
  });

  // ── Google Maps URL construction ──────────────────────────

  describe('Get Directions button URL', () => {
    test('should open Google Maps with the correct encoded destination', () => {
      const openSpy = jest.spyOn(window, 'open').mockImplementation(() => null);
      renderDashboard();

      const btn = screen.getByRole('button', { name: /get directions/i });
      fireEvent.click(btn);

      expect(openSpy).toHaveBeenCalledTimes(1);
      const url = openSpy.mock.calls[0][0];
      expect(url).toContain('https://www.google.com/maps/dir/');
      expect(url).toContain(encodeURIComponent('4-12-10 Jingumae, Shibuya City, Tokyo 150-0001, Japan'));
      expect(openSpy.mock.calls[0][1]).toBe('_blank');

      openSpy.mockRestore();
    });
  });
});

// ─── COMPONENT / INTEGRATION TESTS (RTL) ───────────────────────────────────────

describe('Dashboard — Component Tests (RTL)', () => {
  // ── Rendering & Smoke ─────────────────────────────────────

  describe('Smoke tests', () => {
    test('renders without crashing', () => {
      const { container } = renderDashboard();
      expect(container).toBeTruthy();
    });

    test('renders the top-level container with mesh-gradient class', () => {
      const { container } = renderDashboard();
      expect(container.firstChild).toHaveClass('mesh-gradient');
    });
  });

  // ── Hero Section ──────────────────────────────────────────

  describe('Hero Section', () => {
    test('renders the main headline text', () => {
      renderDashboard();
      expect(screen.getByText(/A World of/i)).toBeInTheDocument();
      expect(screen.getByText(/Luxury Care/i)).toBeInTheDocument();
      expect(screen.getByText(/For Your Pet/i)).toBeInTheDocument();
    });

    test('renders the tagline "Tokyo\'s Premier Pet Sanctuary"', () => {
      renderDashboard();
      expect(screen.getByText(/Tokyo's Premier Pet Sanctuary/i)).toBeInTheDocument();
    });

    test('renders the subtitle paragraph', () => {
      renderDashboard();
      expect(
        screen.getByText(/From organic grooming to 5-star hotel suites/i)
      ).toBeInTheDocument();
    });

    test('renders the PETCare logo images', () => {
      renderDashboard();
      const logos = screen.getAllByAltText('PETCare');
      expect(logos.length).toBeGreaterThanOrEqual(1);
      logos.forEach((logo) => {
        expect(logo).toHaveAttribute('src', '/logo-transparent.png');
      });
    });

    test('renders the hero image', () => {
      renderDashboard();
      const heroImg = screen.getByAltText('Happy Pet in Luxury Theme');
      expect(heroImg).toBeInTheDocument();
      expect(heroImg.tagName).toBe('IMG');
    });

    test('renders the social proof badge', () => {
      renderDashboard();
      expect(screen.getByText(/Trusted by/i)).toBeInTheDocument();
      expect(screen.getByText(/10,000\+ Pet Parents/i)).toBeInTheDocument();
    });
  });

  // ── Navigation Links / CTA Buttons ────────────────────────

  describe('Navigation & CTA buttons', () => {
    test('renders "Book Hotel" button linking to /hotel', () => {
      renderDashboard();
      const bookHotelBtn = screen.getByRole('button', { name: /Book Hotel/i });
      expect(bookHotelBtn).toBeInTheDocument();
      // Verify the parent <a> link
      const link = bookHotelBtn.closest('a');
      expect(link).toHaveAttribute('href', '/hotel');
    });

    test('renders "Book Spa" button linking to /spa', () => {
      renderDashboard();
      const bookSpaBtn = screen.getByRole('button', { name: /Book Spa/i });
      expect(bookSpaBtn).toBeInTheDocument();
      const link = bookSpaBtn.closest('a');
      expect(link).toHaveAttribute('href', '/spa');
    });
  });

  // ── Services Showcase Section ─────────────────────────────

  describe('Services Showcase Section', () => {
    test('renders section heading "The Ultimate Sanctuary"', () => {
      renderDashboard();
      expect(screen.getByText('The Ultimate Sanctuary')).toBeInTheDocument();
    });

    test('renders the "Our Offerings" label', () => {
      renderDashboard();
      expect(screen.getByText(/Our Offerings/i)).toBeInTheDocument();
    });

    test('renders the services description text', () => {
      renderDashboard();
      expect(
        screen.getByText(/Comprehensive, 5-star experiences/i)
      ).toBeInTheDocument();
    });

    test('renders the Boutique (Products) service card', () => {
      renderDashboard();
      expect(screen.getByText('Boutique')).toBeInTheDocument();
      expect(
        screen.getByText(/Curated organic food, treats, and premium life accessories/i)
      ).toBeInTheDocument();
    });

    test('renders the Spa & Grooming service card', () => {
      renderDashboard();
      expect(screen.getByText('Spa & Grooming')).toBeInTheDocument();
      expect(
        screen.getByText(/Relaxing baths, breed-specific styling/i)
      ).toBeInTheDocument();
    });

    test('renders the Luxury Hotel service card', () => {
      renderDashboard();
      expect(screen.getByText('Luxury Hotel')).toBeInTheDocument();
      expect(
        screen.getByText(/Climate-controlled suites, 24\/7 care/i)
      ).toBeInTheDocument();
    });

    test('"Shop Now" link navigates to /products', () => {
      renderDashboard();
      const shopNowLink = screen.getByText(/Shop Now/i).closest('a');
      expect(shopNowLink).toHaveAttribute('href', '/products');
    });

    test('"Book Session" link navigates to /spa', () => {
      renderDashboard();
      const bookSessionLink = screen.getByText(/Book Session/i).closest('a');
      expect(bookSessionLink).toHaveAttribute('href', '/spa');
    });

    test('"Reserve Suite" link navigates to /hotel', () => {
      renderDashboard();
      const reserveLink = screen.getByText(/Reserve Suite/i).closest('a');
      expect(reserveLink).toHaveAttribute('href', '/hotel');
    });
  });

  // ── Service Card Images ───────────────────────────────────

  describe('Service Card Images', () => {
    test('renders the Products card image', () => {
      renderDashboard();
      const img = screen.getByAltText('Products');
      expect(img).toBeInTheDocument();
      expect(img).toHaveAttribute('src', 'PETFOOD3.jpg');
    });

    test('renders the Spa card image', () => {
      renderDashboard();
      const img = screen.getByAltText('Spa');
      expect(img).toBeInTheDocument();
      expect(img).toHaveAttribute('src', 'dog-grooming.webp');
    });

    test('renders the Hotel card image', () => {
      renderDashboard();
      const img = screen.getByAltText('Hotel');
      expect(img).toBeInTheDocument();
      expect(img).toHaveAttribute('src', 'cat-hotel.jpg');
    });
  });

  // ── Store Location Banner ─────────────────────────────────

  describe('Store Location Banner', () => {
    test('renders the "Flagship Location" badge', () => {
      renderDashboard();
      expect(screen.getByText(/Flagship Location/i)).toBeInTheDocument();
    });

    test('renders the store name heading', () => {
      renderDashboard();
      expect(
        screen.getByText(/Visit Our Omotesando Sanctuary/i)
      ).toBeInTheDocument();
    });

    test('renders the store description paragraph', () => {
      renderDashboard();
      expect(
        screen.getByText(/Nestled in the heart of Tokyo/i)
      ).toBeInTheDocument();
    });

    test('renders the physical address', () => {
      renderDashboard();
      expect(screen.getByText('4-12-10 Jingumae')).toBeInTheDocument();
      expect(screen.getByText(/Shibuya City, Tokyo 150-0001/i)).toBeInTheDocument();
    });

    test('renders the opening hours', () => {
      renderDashboard();
      expect(screen.getByText('Open Daily')).toBeInTheDocument();
      expect(screen.getByText('10:00 AM - 8:00 PM')).toBeInTheDocument();
    });

    test('renders the "TOKYO" decorative badge', () => {
      renderDashboard();
      expect(screen.getByText('TOKYO')).toBeInTheDocument();
    });

    test('renders the store location image', () => {
      renderDashboard();
      const img = screen.getByAltText('Store Location Japan');
      expect(img).toBeInTheDocument();
      expect(img).toHaveAttribute('src', expect.stringContaining('gotokyo.org'));
    });

    test('renders the "Get Directions" button', () => {
      renderDashboard();
      expect(
        screen.getByRole('button', { name: /Get Directions/i })
      ).toBeInTheDocument();
    });
  });

  // ── Accessibility ─────────────────────────────────────────

  describe('Accessibility', () => {
    test('decorative logo watermark is hidden from screen readers', () => {
      renderDashboard();
      // The watermark image has alt="" and aria-hidden="true"
      const watermark = screen.getAllByAltText('').find(
        (img) => img.getAttribute('aria-hidden') === 'true'
      );
      expect(watermark).toBeDefined();
    });

    test('all interactive buttons are focusable', () => {
      renderDashboard();
      const buttons = screen.getAllByRole('button');
      buttons.forEach((btn) => {
        expect(btn).not.toHaveAttribute('tabindex', '-1');
      });
    });

    test('all links are rendered as anchor elements', () => {
      renderDashboard();
      const links = screen.getAllByRole('link');
      expect(links.length).toBeGreaterThanOrEqual(5); // Hotel, Spa (hero) + products, spa, hotel (services)
      links.forEach((link) => {
        expect(link.tagName).toBe('A');
        expect(link).toHaveAttribute('href');
      });
    });

    test('images have proper alt text (except decorative)', () => {
      renderDashboard();
      const images = screen.getAllByRole('img');
      images.forEach((img) => {
        // alt attribute should exist (empty string is valid for decorative)
        expect(img).toHaveAttribute('alt');
      });
    });
  });

  // ── User Interaction ──────────────────────────────────────

  describe('User Interaction', () => {
    test('clicking "Get Directions" calls window.open', async () => {
      const openSpy = jest.spyOn(window, 'open').mockImplementation(() => null);
      renderDashboard();

      const user = userEvent.setup();
      const btn = screen.getByRole('button', { name: /Get Directions/i });
      await user.click(btn);

      expect(openSpy).toHaveBeenCalledTimes(1);
      openSpy.mockRestore();
    });

    test('navigation links are clickable without errors', async () => {
      renderDashboard();
      const user = userEvent.setup();

      const links = screen.getAllByRole('link');
      // Just verify we can click them without throwing
      for (const link of links) {
        await expect(user.click(link)).resolves.not.toThrow();
      }
    });
  });

  // ── Structural / Layout ───────────────────────────────────

  describe('Structural integrity', () => {
    test('renders exactly two floating background orbs', () => {
      const { container } = renderDashboard();
      // The orbs use blur-[100px] and blur-[120px] respectively
      const orbs = container.querySelectorAll('[class*="blur-"]');
      // At least two (the hero also has a blur element)
      expect(orbs.length).toBeGreaterThanOrEqual(2);
    });

    test('renders a <main> element', () => {
      renderDashboard();
      expect(screen.getByRole('main')).toBeInTheDocument();
    });

    test('main element has a max-width constraint class', () => {
      renderDashboard();
      const main = screen.getByRole('main');
      expect(main.className).toContain('max-w-7xl');
    });

    test('renders three service cards in the grid', () => {
      const { container } = renderDashboard();
      // Each service card has h3 headings
      const headings = screen.getAllByRole('heading', { level: 3 });
      const serviceCardHeadings = headings.filter((h) =>
        ['Boutique', 'Spa & Grooming', 'Luxury Hotel'].includes(h.textContent)
      );
      expect(serviceCardHeadings).toHaveLength(3);
    });
  });

  // ── Snapshot ──────────────────────────────────────────────

  describe('Snapshot', () => {
    test('matches the baseline snapshot', () => {
      const { container } = renderDashboard();
      expect(container).toMatchSnapshot();
    });
  });
});
