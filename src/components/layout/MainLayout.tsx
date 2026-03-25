import React, { ReactNode } from 'react';
import { Sidebar } from './Sidebar';

export const MainLayout: React.FC<{ children: ReactNode }> = ({ children }) => {
  return (
    <div className="flex w-full h-screen bg-black text-slate-200 font-sans overflow-hidden">
      <Sidebar />
      <main className="flex-1 relative overflow-hidden bg-slate-950/80 p-8 sm:p-12 shadow-inner shadow-black max-w-4xl mx-auto flex flex-col h-full">
        {children}
      </main>
    </div>
  );
};
