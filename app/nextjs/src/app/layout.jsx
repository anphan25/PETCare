import './globals.css';
import { Inter } from 'next/font/google';
import Providers from '@/components/Providers';
import AppShell from '@/components/AppShell';

const inter = Inter({ subsets: ['latin'] });

export const metadata = {
  title: 'PETCare — Tokyo\'s Premier Pet Sanctuary',
  description: 'Luxury pet care services in Tokyo — spa, hotel, and premium food boutique for your beloved companions.',
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <head>
        <link
          href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:opsz,wght,FILL,GRAD@20..48,100..700,0..1,-50..200"
          rel="stylesheet"
        />
      </head>
      <body className={inter.className}>
        <Providers>
          <AppShell>{children}</AppShell>
        </Providers>
      </body>
    </html>
  );
}
