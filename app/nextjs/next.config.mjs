/** @type {import('next').NextConfig} */
const nextConfig = {
  turbopack: {
    root: new URL('.', import.meta.url).pathname,
  },

  // Allow images from external domains used in the app
  images: {
    remotePatterns: [
      { protocol: 'https', hostname: 'images.unsplash.com' },
      { protocol: 'https', hostname: '*.supabase.co' },
      { protocol: 'https', hostname: 'www.gotokyo.org' },
      { protocol: 'https', hostname: 'lh3.googleusercontent.com' },
    ],
  },
};

export default nextConfig;
