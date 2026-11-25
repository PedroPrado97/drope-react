import { useRef } from 'react'
import { useIdioma } from '../context/Idioma.jsx'
import useDock from '../hooks/useDock.js'
export default function Dock() {
  const { t } = useIdioma()
  const ref = useRef(null)
  const { idioma, setIdioma } = useIdioma()
  useDock(ref)
  return (
    <nav ref={ref} className={"dock"} id={"dock"} aria-label={"Navega\u00e7\u00e3o r\u00e1pida"} aria-hidden={"true"}>
      <div className={"dock-lang"}>
        <button type={"button"} className={"dock-flag"} data-lang={"pt-BR"} aria-pressed={idioma === "pt-BR"} onClick={() => setIdioma("pt-BR")} aria-label={"Portugu\u00eas (Brasil)"} title={"Portugu\u00eas (Brasil)"}>
          <svg viewBox={"0 0 24 24"} aria-hidden={"true"}>
            <circle cx={"12"} cy={"12"} r={"12"} fill={"#009b3a"} />
            <path d={"M12 4.5l7.5 7.5-7.5 7.5L4.5 12z"} fill={"#ffdf00"} />
            <circle cx={"12"} cy={"12"} r={"3.8"} fill={"#002776"} />
          </svg>
        </button>
        <button type={"button"} className={"dock-flag"} data-lang={"en"} aria-pressed={idioma === "en"} onClick={() => setIdioma("en")} aria-label={"English"} title={"English"}>
          <svg viewBox={"0 0 24 24"} aria-hidden={"true"}>
            <defs>
              <clippath id={"cu"}>
                <circle cx={"12"} cy={"12"} r={"12"} />
              </clippath>
            </defs>
            <g clipPath={"url(#cu)"}>
              <rect width={"24"} height={"24"} fill={"#fff"} />
              <rect y={"0"} width={"24"} height={"2"} fill={"#b22234"} />
              <rect y={"4"} width={"24"} height={"2"} fill={"#b22234"} />
              <rect y={"8"} width={"24"} height={"2"} fill={"#b22234"} />
              <rect y={"12"} width={"24"} height={"2"} fill={"#b22234"} />
              <rect y={"16"} width={"24"} height={"2"} fill={"#b22234"} />
              <rect y={"20"} width={"24"} height={"2"} fill={"#b22234"} />
              <rect width={"11"} height={"13"} fill={"#3c3b6e"} />
            </g>
          </svg>
        </button>
        <button type={"button"} className={"dock-flag"} data-lang={"es"} aria-pressed={idioma === "es"} onClick={() => setIdioma("es")} aria-label={"Espa\u00f1ol"} title={"Espa\u00f1ol"}>
          <svg viewBox={"0 0 24 24"} aria-hidden={"true"}>
            <defs>
              <clippath id={"ce"}>
                <circle cx={"12"} cy={"12"} r={"12"} />
              </clippath>
            </defs>
            <g clipPath={"url(#ce)"}>
              <rect width={"24"} height={"6"} fill={"#c60b1e"} />
              <rect y={"6"} width={"24"} height={"12"} fill={"#ffc400"} />
              <rect y={"18"} width={"24"} height={"6"} fill={"#c60b1e"} />
            </g>
          </svg>
        </button>
      </div>
      <div className={"dock-links"}>
        <a href={"#inicio"} data-i18n={"d-inicio"}>
          {t("In\u00edcio")}
        </a>
        <a href={"#projetos"} data-i18n={"d-projetos"}>
          {t("Projetos")}
        </a>
        <a href={"#processo"} data-i18n={"d-sobre"}>
          {t("Sobre")}
        </a>
      </div>
      <a className={"dock-cta"} href={"#contato"}>
        <span data-i18n={"d-cta"}>
          {t("Solicitar or\u00e7amento")}
        </span>
        <span className={"arr"} aria-hidden={"true"}>
          {"\u2197"}
        </span>
      </a>
    </nav>
  )
}
