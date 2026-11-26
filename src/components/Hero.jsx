import { useMemo, useRef } from 'react'
import { useIdioma } from '../context/Idioma.jsx'
import useHeroWords from '../hooks/useHeroWords.js'
import useHeroCinema from '../hooks/useHeroCinema.js'
import { TEXTOS, NOMES } from '../data/hero.js'
import { Bandeira } from './Bandeiras.jsx'

export default function Hero() {
  const { idioma, setIdioma } = useIdioma()
  const t = TEXTOS[idioma] || TEXTOS['pt-BR']
  useHeroWords([idioma])
  const ref = useRef(null)
  useHeroCinema(ref)

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
    <section ref={ref} className="hero-ed" id="inicio" aria-label="Apresentação">
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
      <div className="hero-mark hero-sheen" aria-hidden="true" />
      <div className="hero-grain" aria-hidden="true" />

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
