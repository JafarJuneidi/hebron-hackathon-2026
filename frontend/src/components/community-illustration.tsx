export function CommunityIllustration({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 400 180"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      aria-hidden="true"
    >
      {/* Connection lines */}
      <line x1="90" y1="70" x2="200" y2="90" stroke="currentColor" strokeWidth="1.5" opacity="0.15" />
      <line x1="130" y1="145" x2="200" y2="90" stroke="currentColor" strokeWidth="1.5" opacity="0.15" />
      <line x1="270" y1="145" x2="200" y2="90" stroke="currentColor" strokeWidth="1.5" opacity="0.15" />
      <line x1="310" y1="70" x2="200" y2="90" stroke="currentColor" strokeWidth="1.5" opacity="0.15" />
      <line x1="200" y1="25" x2="200" y2="90" stroke="currentColor" strokeWidth="1.5" opacity="0.15" />

      {/* Cross connections */}
      <line x1="90" y1="70" x2="130" y2="145" stroke="currentColor" strokeWidth="1" opacity="0.08" />
      <line x1="310" y1="70" x2="270" y2="145" stroke="currentColor" strokeWidth="1" opacity="0.08" />
      <line x1="90" y1="70" x2="200" y2="25" stroke="currentColor" strokeWidth="1" opacity="0.08" />
      <line x1="310" y1="70" x2="200" y2="25" stroke="currentColor" strokeWidth="1" opacity="0.08" />

      {/* Central hub — larger glow */}
      <circle cx="200" cy="90" r="28" fill="currentColor" opacity="0.06" />
      <circle cx="200" cy="90" r="18" fill="currentColor" opacity="0.12" />
      <circle cx="200" cy="90" r="10" fill="currentColor" opacity="0.25" />

      {/* People nodes */}
      <circle cx="90" cy="70" r="14" fill="currentColor" opacity="0.08" />
      <circle cx="90" cy="70" r="8" fill="currentColor" opacity="0.2" />

      <circle cx="310" cy="70" r="14" fill="currentColor" opacity="0.08" />
      <circle cx="310" cy="70" r="8" fill="currentColor" opacity="0.2" />

      <circle cx="200" cy="25" r="12" fill="currentColor" opacity="0.08" />
      <circle cx="200" cy="25" r="7" fill="currentColor" opacity="0.2" />

      <circle cx="130" cy="145" r="12" fill="currentColor" opacity="0.08" />
      <circle cx="130" cy="145" r="7" fill="currentColor" opacity="0.2" />

      <circle cx="270" cy="145" r="12" fill="currentColor" opacity="0.08" />
      <circle cx="270" cy="145" r="7" fill="currentColor" opacity="0.2" />

      {/* Amber accent dots — small highlights */}
      <circle cx="145" cy="80" r="3" className="fill-amber-400" opacity="0.5" />
      <circle cx="255" cy="80" r="3" className="fill-amber-400" opacity="0.5" />
      <circle cx="200" cy="130" r="3.5" className="fill-amber-400" opacity="0.5" />
      <circle cx="165" cy="55" r="2" className="fill-amber-400" opacity="0.4" />
      <circle cx="235" cy="55" r="2" className="fill-amber-400" opacity="0.4" />
    </svg>
  )
}
