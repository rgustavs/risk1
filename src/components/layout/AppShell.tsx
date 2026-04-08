import React from 'react';

export function AppShell({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen flex flex-col bg-background">
      <header className="border-b bg-card">
        <div className="container mx-auto px-4 h-16 flex items-center">
          <h1 className="text-xl font-bold">Risk Voting Tool</h1>
        </div>
      </header>
      <main className="flex-1 container mx-auto p-4">
        {children}
      </main>
    </div>
  );
}
