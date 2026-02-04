function SvgIcon({ children, className = "", title, viewBox = "0 0 24 24" }) {
  return (
    <svg
      className={className}
      viewBox={viewBox}
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden={title ? undefined : "true"}
      role={title ? "img" : "presentation"}
    >
      {title ? <title>{title}</title> : null}
      {children}
    </svg>
  );
}

export function WifiIcon({ className = "", title }) {
  return (
    <SvgIcon className={className} title={title}>
      <path d="M5 12.6a11 11 0 0 1 14 0" />
      <path d="M8.5 15.6a6 6 0 0 1 7 0" />
      <circle cx="12" cy="19" r="0.5" />
    </SvgIcon>
  );
}

export function GridIcon({ className = "", title }) {
  return (
    <SvgIcon className={className} title={title}>
      <path d="M4 4h7v7H4z" />
      <path d="M13 4h7v7h-7z" />
      <path d="M4 13h7v7H4z" />
      <path d="M13 13h7v7h-7z" />
    </SvgIcon>
  );
}

export function AnalyticsIcon({ className = "", title }) {
  return (
    <SvgIcon className={className} title={title}>
      <path d="M4 19V5" />
      <path d="M4 19h16" />
      <path d="M8 19v-7" />
      <path d="M12 19v-11" />
      <path d="M16 19v-4" />
    </SvgIcon>
  );
}

export function WarningIcon({ className = "", title }) {
  return (
    <SvgIcon className={className} title={title}>
      <path d="M12 3 2.5 20h19L12 3z" />
      <path d="M12 9v4" />
      <path d="M12 17h.01" />
    </SvgIcon>
  );
}

export function AspectRatioIcon({ className = "", title }) {
  return (
    <SvgIcon className={className} title={title}>
      <path d="M4 7V5h2" />
      <path d="M18 5h2v2" />
      <path d="M20 17v2h-2" />
      <path d="M6 19H4v-2" />
      <rect x="7" y="7" width="10" height="10" rx="1" />
    </SvgIcon>
  );
}

export function TerminalIcon({ className = "", title }) {
  return (
    <SvgIcon className={className} title={title}>
      <path d="M4 6h16v12H4z" />
      <path d="M7 10l2 2-2 2" />
      <path d="M11 14h4" />
    </SvgIcon>
  );
}

export function HelpIcon({ className = "", title }) {
  return (
    <SvgIcon className={className} title={title}>
      <circle cx="12" cy="12" r="9" />
      <path d="M9.5 9a2.5 2.5 0 0 1 5 0c0 1.7-1.6 2.2-2.2 2.7-.4.3-.6.7-.6 1.3" />
      <path d="M12 17h.01" />
    </SvgIcon>
  );
}

export function ResetIcon({ className = "", title }) {
  return (
    <SvgIcon className={className} title={title}>
      <path d="M21 12a9 9 0 1 1-3-6.7" />
      <path d="M21 3v6h-6" />
    </SvgIcon>
  );
}

