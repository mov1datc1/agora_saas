import Link from 'next/link';

export function AgoraLogo({ href = '/' }: { href?: string }) {
  return (
    <Link href={href} className="brand" aria-label="Agora Lexlatin">
      <svg viewBox="0 0 64 24" role="img" aria-hidden="true" className="brand-mark">
        <path d="M4 20L12 4H18L10 20H4Z" />
        <path d="M21 20L29 4H35L27 20H21Z" />
        <circle cx="37.5" cy="12" r="2.5" />
      </svg>
      <span className="brand-text">Agora</span>
    </Link>
  );
}
