import type { Metadata } from 'next';
import './globals.css';
import { AppShell } from '@/components/layout/AppShell';

export const metadata: Metadata = {
  title: 'OpenDoor — Discover Opportunities. Build Your Future.',
  description: 'Open-source student opportunity intelligence platform for Indian college students. Discover genuine hackathons, scholarships, internships, and research competitions.',
  keywords: ['Hackathons India', 'Scholarships India', 'Internships for Students', 'National Competitions', 'College Opportunities', 'OpenDoor'],
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className="min-h-screen bg-slate-50 text-navy-900 antialiased selection:bg-purple-200 selection:text-purple-900">
        <AppShell>
          {children}
        </AppShell>
      </body>
    </html>
  );
}
