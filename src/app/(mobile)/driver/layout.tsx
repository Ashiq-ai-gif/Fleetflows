import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Driver Hub | Fleet Flows',
  description: 'Fleet Flows Driver Application',
  viewport: 'width=device-width, initial-scale=1, maximum-scale=1, user-scalable=0',
  themeColor: '#080810',
  manifest: '/manifest.json', // We can add a manifest later for true PWA
};

export default function DriverLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-[100dvh] bg-[#080810] text-white font-sans antialiased overflow-x-hidden selection:bg-violet-500/30">
      {/* 
        This is the root layout for all /driver routes.
        It enforces a strict mobile-first viewport and dark theme.
      */}
      <main className="relative w-full h-[100dvh] overflow-hidden flex flex-col">
        {children}
      </main>
    </div>
  );
}
