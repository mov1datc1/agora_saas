import Link from 'next/link';

export function AgoraLogo({ href = '/' }: { href?: string }) {
  return (
    <Link href={href} className="brand" aria-label="Ágora">
      <svg viewBox="0 0 210 52" role="img" aria-hidden="true" className="brand-mark" preserveAspectRatio="xMinYMid meet">
        <path d="M2 50L30 2h20L22 50H2Z" />
        <path d="M47 50L75 2h20L67 50H47Z" />
        <text x="101" y="39" fontSize="42" fontWeight="700" fontFamily="Inter, Arial, sans-serif">Ágora</text>
      </svg>
    </Link>
  );
}
