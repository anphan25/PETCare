/**
 * Static data used across the application.
 * Products (foodProducts) are shown as featured items on the Dashboard.
 * All other data is used for Spa/Hotel booking flows and Profile page.
 */

// ── Default Pets (used as fallback / demo data) ────────────────────────────
export const defaultPets = [
  {
    id: 'pet-1',
    name: 'Buddy',
    breed: 'Golden Retriever',
    age: '3 years',
    image: 'https://images.unsplash.com/photo-1552053831-71594a27632d?w=400&q=80',
  },
  {
    id: 'pet-2',
    name: 'Mochi',
    breed: 'Scottish Fold',
    age: '2 years',
    image: 'https://images.unsplash.com/photo-1573865526739-10659fec78a5?w=400&q=80',
  },
];

// ── Featured Food Products (Dashboard hero section) ────────────────────────
export const foodProducts = [
  {
    id: 'food-1',
    name: 'Organic Salmon Feast',
    category: 'Food',
    price: 28.99,
    rating: 4.8,
    description: 'Premium wild-caught salmon with organic vegetables for optimal nutrition.',
    image: 'https://images.unsplash.com/photo-1601758124510-52d02ddb7cbd?w=600&q=80',
    image_url: 'https://images.unsplash.com/photo-1601758124510-52d02ddb7cbd?w=600&q=80',
  },
  {
    id: 'food-2',
    name: 'Gourmet Grain-Free Blend',
    category: 'Food',
    price: 34.50,
    rating: 4.9,
    description: 'A carefully crafted grain-free formula rich in protein and essential fatty acids.',
    image: 'https://images.unsplash.com/photo-1589924691995-400dc9ecc119?w=600&q=80',
    image_url: 'https://images.unsplash.com/photo-1589924691995-400dc9ecc119?w=600&q=80',
  },
  {
    id: 'food-3',
    name: 'Holistic Wellness Bites',
    category: 'Food',
    price: 19.99,
    rating: 4.7,
    description: 'Bite-sized treats packed with vitamins, minerals, and natural flavour.',
    image: 'https://images.unsplash.com/photo-1587300003388-59208cc962cb?w=600&q=80',
    image_url: 'https://images.unsplash.com/photo-1587300003388-59208cc962cb?w=600&q=80',
  },
];

// ── Spa Services ────────────────────────────────────────────────────────────
export const spaServices = [
  {
    id: 'spa-1',
    name: 'Aromatherapy Bath',
    description: 'A soothing chamomile & lavender soak that calms the senses and deeply conditions the coat.',
    price: 45,
    icon: 'water_drop',
  },
  {
    id: 'spa-2',
    name: 'Precision Trim & Style',
    description: 'Breed-specific styling by certified groomers using only organic, pet-safe products.',
    price: 65,
    icon: 'content_cut',
  },
  {
    id: 'spa-3',
    name: 'Paw & Nail Ritual',
    description: 'Deep paw moisturising treatment paired with a careful nail trim and buff.',
    price: 30,
    icon: 'spa',
  },
  {
    id: 'spa-4',
    name: 'Full Wellness Package',
    description: 'Our signature all-inclusive treatment — bath, style, paw care, and a blueberry facial.',
    price: 120,
    icon: 'auto_awesome',
  },
];

// ── Available Booking Time Slots ────────────────────────────────────────────
export const timeSlots = [
  '09:00 AM',
  '10:30 AM',
  '12:00 PM',
  '02:30 PM',
  '04:00 PM',
  '05:30 PM',
];

// ── Assigned Groomer ────────────────────────────────────────────────────────
export const groomer = {
  name: 'Aoi Tanaka',
  rating: '4.97',
  experience: '8 years',
  image: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=200&q=80',
};
