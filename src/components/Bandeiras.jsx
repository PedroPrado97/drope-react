/* Bandeiras (SVG simples, sem depender de imagens externas) */
export const Bandeira = {
  'pt-BR': () => (
    <svg viewBox="0 0 24 24" aria-hidden="true">
      <circle cx="12" cy="12" r="12" fill="#009b3a" />
      <path d="M12 4.5l7.5 7.5-7.5 7.5L4.5 12z" fill="#ffdf00" />
      <circle cx="12" cy="12" r="3.8" fill="#002776" />
    </svg>
  ),
  en: () => (
    <svg viewBox="0 0 24 24" aria-hidden="true">
      <defs>
        <clipPath id="cu"><circle cx="12" cy="12" r="12" /></clipPath>
      </defs>
      <g clipPath="url(#cu)">
        <rect width="24" height="24" fill="#fff" />
        {[0, 4, 8, 12, 16, 20].map((y) => (
          <rect key={y} y={y} width="24" height="2" fill="#b22234" />
        ))}
        <rect width="11" height="13" fill="#3c3b6e" />
      </g>
    </svg>
  ),
  es: () => (
    <svg viewBox="0 0 24 24" aria-hidden="true">
      <defs>
        <clipPath id="ce"><circle cx="12" cy="12" r="12" /></clipPath>
      </defs>
      <g clipPath="url(#ce)">
        <rect width="24" height="6" fill="#c60b1e" />
        <rect y="6" width="24" height="12" fill="#ffc400" />
        <rect y="18" width="24" height="6" fill="#c60b1e" />
      </g>
    </svg>
  ),
}


