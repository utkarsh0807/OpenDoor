'use client';

import React, { useState } from 'react';
import { usePathname } from 'next/navigation';
import { Sidebar } from './Sidebar';
import { Topbar } from './Topbar';
import { Footer } from './Footer';
import { DemoModeBanner } from '../common/DemoModeBanner';
import { RegionProvider } from '@/lib/context/RegionContext';
import { FloatingAssistant } from '@/components/assistant/FloatingAssistant';

interface AppShellProps {
  children: React.ReactNode;
}

export const AppShell: React.FC<AppShellProps> = ({ children }) => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const pathname = usePathname();

  const isLandingPage = pathname === '/';

  return (
    <RegionProvider>
      <div className="min-h-screen flex flex-col bg-slate-50">
        <DemoModeBanner />
        
        {isLandingPage ? (
          <main className="flex-1">{children}</main>
        ) : (
          <div className="flex-1 flex">
            {/* Desktop Sidebar & Mobile Drawer */}
            <Sidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />

            {/* Main Content Area */}
            <div className="flex-1 flex flex-col min-w-0 lg:pl-64">
              <Topbar onOpenSidebar={() => setSidebarOpen(true)} />
              <main className="flex-1 p-4 sm:p-6 lg:p-8 max-w-7xl mx-auto w-full">
                {children}
              </main>
            </div>
          </div>
        )}

        <Footer />
        {/* Floating Gemini AI Personal Assistant available across all pages */}
        <FloatingAssistant />
      </div>
    </RegionProvider>
  );
};
