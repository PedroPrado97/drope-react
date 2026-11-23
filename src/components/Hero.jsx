import { useMemo } from 'react'
import { useIdioma } from '../context/Idioma.jsx'
import useHeroWords from '../hooks/useHeroWords.js'

/* Textos da capa em cada idioma */
const TEXTOS = {
  'pt-BR': {
    title: 'Pense antes|de parecer.',
    note: 'O Drope Studio estrutura marcas a partir daquilo que as torna únicas. Investigamos o negócio, o contexto e as pessoas antes de qualquer decisão visual.',
    link: 'Identidades visuais que transformam o seu negócio em uma marca que se lembra.',
    btn1: 'Solicitar orçamento',
    btn2: 'Projetos',
    dim: /parecer/i,
  },
  en: {
    title: 'Think before|you appear.',
    note: 'Drope Studio builds brands from what makes them unique. We investigate the business, the context and the people before any visual decision.',
    link: 'Visual identities that turn your business into a brand people remember.',
    btn1: 'Request a quote',
    btn2: 'Projects',
    dim: /appear/i,
  },
  es: {
    title: 'Piensa antes|de parecer.',
    note: 'Drope Studio estructura marcas a partir de lo que las hace únicas. Investigamos el negocio, el contexto y las personas antes de cualquier decisión visual.',
    link: 'Identidades visuales que convierten tu negocio en una marca que se recuerda.',
    btn1: 'Solicitar presupuesto',
    btn2: 'Proyectos',
    dim: /parecer/i,
  },
}

/* Bandeiras (SVG simples, sem depender de imagens externas) */
const Bandeira = {
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

const NOMES = { 'pt-BR': 'Português (Brasil)', en: 'English', es: 'Español' }

export default function Hero() {
  const { idioma, setIdioma } = useIdioma()
  const t = TEXTOS[idioma] || TEXTOS['pt-BR']
  useHeroWords([idioma])

  /* Título: uma palavra por vez, com a linha de quebra indicada por "|" */
  const linhas = useMemo(() => {
    let k = 0
    return t.title.split('|').map((linha) =>
      linha.trim().split(/\s+/).map((palavra) => {
        const item = { palavra, dim: t.dim.test(palavra), delay: 0.25 + k * 0.12 }
        k++
        return item
      })
    )
  }, [t])

  return (
    <section className="hero-ed" id="inicio" aria-label="Apresentação">
      <nav className="hero-lang" aria-label="Idioma">
        <span className="hl-ico" aria-hidden="true">
          <svg viewBox="0 0 24 24" aria-hidden="true" fill="none" stroke="currentColor" strokeWidth="1.6">
            <circle cx="12" cy="12" r="9" />
            <path d="M3 12h18M12 3c2.8 3 2.8 15 0 18M12 3c-2.8 3-2.8 15 0 18" />
          </svg>
        </span>
        {Object.keys(TEXTOS).map((codigo) => {
          const Icone = Bandeira[codigo]
          return (
            <button
              key={codigo}
              type="button"
              aria-label={NOMES[codigo]}
              title={NOMES[codigo]}
              aria-pressed={idioma === codigo}
              onClick={() => setIdioma(codigo)}
            >
              <Icone />
            </button>
          )
        })}
      </nav>

      <div className="hero-beam" aria-hidden="true" />
      <img className="hero-mark" src="/images/logo-branco.webp" alt="" aria-hidden="true" />

      <div className="hero-grid wrap">
        <figure className="hero-photo">
          <img src="/images/foto-pedro.webp" alt="Pedro, fundador do Drope Studio" />
          <span className="glint" aria-hidden="true" />
        </figure>

        <div className="hero-copy">
          <h1 className="hero-title">
            {linhas.map((linha, i) => (
              <span className="ln" key={i}>
                {linha.map((item, j) => (
                  <span key={j}>
                    <span
                      className={'w' + (item.dim ? ' dim' : '')}
                      style={{ '--d': item.delay + 's' }}
                    >
                      {item.palavra}
                    </span>
                    {j < linha.length - 1 ? ' ' : null}
                  </span>
                ))}
              </span>
            ))}
          </h1>
        </div>
      </div>
      <div className="hero-frame">
        <aside className="hero-side">
          <p className="hero-note">{t.note}</p>
          <p className="hero-link">{t.link}</p>
          <div className="actions">
            <a className="btn solid pill" href="#contato">
              <span>{t.btn1}</span> <span className="arr" aria-hidden="true">↗</span>
            </a>
            <a className="btn" href="#projetos">{t.btn2}</a>
          </div>
        </aside>
      </div>
    </section>
  )
}
