import { useRef } from 'react'
import { useIdioma } from '../context/Idioma.jsx'
import useVitrine from '../hooks/useVitrine.js'
import { PROJETOS } from '../data/projetos.js'

/* Um case da vitrine: imagem em tela cheia, nome, tipo e botão para a página do case */
function Slide({ projeto, i }) {
  const { t } = useIdioma()
  return (
    <article className="vt-slide" data-i={i} style={{ '--i': String(i) }}>
      <div className="vt-media">
        <img src={projeto.src} alt={projeto.alt} />
      </div>
      <div className="vt-shade" aria-hidden="true" />
      <div className="vt-copy">
        <p className="vt-type">{t(projeto.tipo)}</p>
        <h3 className="vt-name">{projeto.nome}</h3>
        <a className="vt-btn" href={projeto.href} aria-label={projeto.ariaCase}>
          <span>{t('Ver case')}</span>
          <span className="vt-arr" aria-hidden="true">↗</span>
        </a>
      </div>
    </article>
  )
}

export default function Projetos() {
  const { t } = useIdioma()
  const ref = useRef(null)
  useVitrine(ref)

  return (
    <section ref={ref} className="vt" id="projetos" aria-label={t('Projetos')}>
      <div className="vt-stage">
        <div className="vt-top">
          <span className="vt-tag">{t('Projetos')}</span>
          <p className="vt-head">{t('Marcas que já ajudamos a tornar únicas.')}</p>
        </div>

        {PROJETOS.map((p, i) => (
          <Slide key={p.href} projeto={p} i={i} />
        ))}

        <div className="vt-count" aria-live="polite">
          <span className="vt-cur">01</span> / {String(PROJETOS.length).padStart(2, '0')}
        </div>
        <div className="vt-rail" aria-hidden="true">
          {PROJETOS.map((_, i) => (
            <span key={i} className="vt-dot" data-i={i} />
          ))}
        </div>
      </div>
    </section>
  )
}
