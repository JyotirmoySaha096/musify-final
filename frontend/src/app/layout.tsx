import type { Metadata } from 'next';
import './globals.css';
import ClientLayout from './ClientLayout';

export const metadata: Metadata = {
  title: 'Spotify Clone - Stream Music Online',
  description: 'A full-featured Spotify clone built with Next.js, Nest.js, and PostgreSQL. Browse albums, create playlists, and stream music.',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>
        <ClientLayout>{children}</ClientLayout>
      </body>
    </html>
  );
}
