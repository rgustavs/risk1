export default function Home() {
  return (
    <div className="flex flex-col flex-1 items-center justify-center bg-background font-sans">
      <main className="flex flex-1 w-full max-w-2xl flex-col items-center justify-center gap-12 px-6 py-20">
        {/* Logo / Brand mark */}
        <div className="flex flex-col items-center gap-3">
          <div className="flex h-14 w-14 items-center justify-center rounded-[var(--radius-lg)] bg-accent shadow-[var(--shadow-md)]">
            <svg
              width="28"
              height="28"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="text-accent-foreground"
            >
              <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
            </svg>
          </div>
        </div>

        {/* Hero text */}
        <div className="flex flex-col items-center gap-4 text-center">
          <h1 className="text-4xl font-semibold tracking-tight text-text-primary">
            Risk Voting System
          </h1>
          <p className="max-w-md text-lg leading-relaxed text-text-secondary">
            Run structured, anonymous risk workshops. Assess impact and
            likelihood, visualize results, and drive action.
          </p>
        </div>

        {/* Action buttons */}
        <div className="flex flex-col items-center gap-3 sm:flex-row">
          <a
            href="/projects/new"
            className="inline-flex h-12 items-center justify-center gap-2 rounded-[var(--radius-full)] bg-accent px-8 text-base font-medium text-accent-foreground shadow-[var(--shadow-sm)] transition-colors hover:bg-accent-hover focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
          >
            Create Project
          </a>
          <a
            href="/join"
            className="inline-flex h-12 items-center justify-center gap-2 rounded-[var(--radius-full)] border border-border-strong bg-surface px-8 text-base font-medium text-text-primary shadow-[var(--shadow-sm)] transition-colors hover:bg-surface-secondary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
          >
            Join Session
          </a>
        </div>

        {/* Feature cards */}
        <div className="grid w-full gap-4 sm:grid-cols-3">
          <div className="flex flex-col gap-2 rounded-[var(--radius-lg)] border border-border bg-surface p-5 shadow-[var(--shadow-sm)]">
            <div className="flex h-9 w-9 items-center justify-center rounded-[var(--radius-md)] bg-accent-light">
              <svg
                width="18"
                height="18"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="text-accent"
              >
                <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
                <circle cx="9" cy="7" r="4" />
                <path d="M23 21v-2a4 4 0 0 0-3-3.87" />
                <path d="M16 3.13a4 4 0 0 1 0 7.75" />
              </svg>
            </div>
            <h3 className="text-sm font-semibold text-text-primary">
              Anonymous Voting
            </h3>
            <p className="text-sm leading-relaxed text-text-secondary">
              Votes are cryptographically unlinkable to participants, ensuring
              honest assessments.
            </p>
          </div>

          <div className="flex flex-col gap-2 rounded-[var(--radius-lg)] border border-border bg-surface p-5 shadow-[var(--shadow-sm)]">
            <div className="flex h-9 w-9 items-center justify-center rounded-[var(--radius-md)] bg-accent-light">
              <svg
                width="18"
                height="18"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="text-accent"
              >
                <rect x="3" y="3" width="18" height="18" rx="2" ry="2" />
                <line x1="3" y1="9" x2="21" y2="9" />
                <line x1="3" y1="15" x2="21" y2="15" />
                <line x1="9" y1="3" x2="9" y2="21" />
                <line x1="15" y1="3" x2="15" y2="21" />
              </svg>
            </div>
            <h3 className="text-sm font-semibold text-text-primary">
              Risk Heatmaps
            </h3>
            <p className="text-sm leading-relaxed text-text-secondary">
              Visualize impact vs. likelihood on interactive 5&times;5 heatmaps
              with continuous positioning.
            </p>
          </div>

          <div className="flex flex-col gap-2 rounded-[var(--radius-lg)] border border-border bg-surface p-5 shadow-[var(--shadow-sm)]">
            <div className="flex h-9 w-9 items-center justify-center rounded-[var(--radius-md)] bg-accent-light">
              <svg
                width="18"
                height="18"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="text-accent"
              >
                <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" />
                <polyline points="22 4 12 14.01 9 11.01" />
              </svg>
            </div>
            <h3 className="text-sm font-semibold text-text-primary">
              Action Tracking
            </h3>
            <p className="text-sm leading-relaxed text-text-secondary">
              Assign risk owners, define mitigations, and track follow-up
              governance in one place.
            </p>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="w-full border-t border-border px-6 py-5">
        <div className="mx-auto flex max-w-2xl items-center justify-between text-sm text-text-tertiary">
          <span>Risk Voting System</span>
          <span>Structured risk workshops</span>
        </div>
      </footer>
    </div>
  );
}
