import { useEffect, useRef, useState } from 'react'
import { useIdioma } from '../context/Idioma.jsx'

const ETAPAS = [
  {
    n: '01', verbo: 'PERGUNTAR',
    proposito: 'Começamos pelas perguntas que o negócio ainda não sabe responder sozinho.',
    buscamos: ['O que a marca quer dizer?', 'Por que ela existe agora?'],
  },
  {
    n: '02', verbo: 'ENTENDER',
    proposito: 'Mergulhamos no contexto, nas pessoas e no que já existe no mercado.',
    buscamos: ['Quem é o público de verdade?', 'Onde a marca está hoje?'],
  },
  {
    n: '03', verbo: 'ORGANIZAR',
    proposito: 'Transformamos o que aprendemos em posicionamento, tom e direção.',
    buscamos: ['Qual é a estratégia?', 'Qual o tom de voz?'],
  },
  {
    n: '04', verbo: 'ENCONTRAR',
    proposito: 'Achamos o ponto onde a marca se diferencia de verdade.',
    buscamos: ['O que só essa marca faz?', 'Qual é a ideia central?'],
  },
  {
    n: '05', verbo: 'TRADUZIR',
    proposito: 'Levamos esse pensamento para a forma: identidade, linguagem e aplicações.',
    buscamos: ['Como ela se mostra?', 'Como ela se sustenta?'],
  },
]

export default function Processo() {
  const { t } = useIdioma()
  const ref = useRef(null)
  const [ativo, setAtivo] = useState(0)

  useEffect(() => {
    const sec = ref.current
    if (!sec) return
    const atualizar = () => {
      const topo = sec.getBoundingClientRect().top + window.pageYOffset
      const tot = Math.max(sec.offsetHeight - window.innerHeight, 1)
      const p = Math.min(1, Math.max(0, (window.pageYOffset - topo) / tot))
      sec.style.setProperty('--p', p.toFixed(4))
      sec.style.setProperty('--q', (p * (ETAPAS.length - 1)).toFixed(4))
      setAtivo(Math.round(p * (ETAPAS.length - 1)))
      /* Celular: os textos somem em fade ao passar por baixo do título */
      const head = sec.querySelector('.proc-head')
      const mobile = window.matchMedia('(max-width: 900px)').matches
      sec.querySelectorAll('.proc-panel').forEach((el) => {
        if (!mobile) { el.style.opacity = ''; return }
        const limite = head ? head.getBoundingClientRect().bottom : 0
        const d = el.getBoundingClientRect().top - limite
        el.style.opacity = Math.max(0, Math.min(1, d / 160)).toFixed(3)
      })
    }
    let ticking = false
    const onScroll = () => {
      if (!ticking) {
        ticking = true
        requestAnimationFrame(() => { ticking = false; atualizar() })
      }
    }
    atualizar()
    window.addEventListener('scroll', onScroll, { passive: true })
    window.addEventListener('resize', atualizar)
    return () => {
      window.removeEventListener('scroll', onScroll)
      window.removeEventListener('resize', atualizar)
    }
  }, [])

  /* Clicar numa etapa leva direto a ela */
  const irPara = (i) => {
    const sec = ref.current
    if (!sec) return
    const topo = sec.getBoundingClientRect().top + window.pageYOffset
    const tot = Math.max(sec.offsetHeight - window.innerHeight, 1)
    window.scrollTo({ top: topo + (i / (ETAPAS.length - 1)) * tot, behavior: 'smooth' })
  }

  return (
    <section className="proc" id="processo" ref={ref} aria-label="Processo">
      <div className="proc-stage">
        <header className="proc-head">
          <h2 className="proc-title">
            <span className="proc-num5">5</span>
            <span className="proc-txt">
              <span>{t('movimentos.')}</span>
              <span>{t('Uma construção com intenção.')}</span>
            </span>
          </h2>
        </header>

        <nav className="proc-nav" aria-label="Etapas do processo">
          <div className="proc-track" aria-hidden="true"><span className="proc-bar" /></div>
          {ETAPAS.map((e, i) => (
            <button
              key={e.n}
              type="button"
              className={'proc-item' + (ativo === i ? ' on' : '')}
              onClick={() => irPara(i)}
              aria-current={ativo === i ? 'step' : undefined}
            >
              <span className="proc-num">{e.n}</span>
              <span className="proc-label">{t(e.verbo)}</span>
            </button>
          ))}
        </nav>

        <div className="proc-panels">
          {ETAPAS.map((e, i) => (
            <article
              key={e.n}
              className={'proc-panel' + (ativo === i ? ' on' : '')}
              style={{ '--i': i }}
              aria-hidden={ativo !== i}
            >
              <span className="proc-big">{e.n}</span>
              <h3 className="proc-verb">{t(e.verbo)}</h3>
              <p className="proc-prop">{t(e.proposito)}</p>
              <ul className="proc-busca">
                {e.buscamos.map((b) => <li key={b}>{t(b)}</li>)}
              </ul>
            </article>
          ))}

          <div className="proc-geo" aria-hidden="true">
            <div className="proc-spin">
              <svg className="proc-mark" viewBox="0 0 100 100">
                <path d="M48.73 0.00 L38.99 5.62 L48.05 21.18 L23.93 7.31 L18.31 17.07 L33.93 26.04 L6.09 26.07 L6.09 37.31 L24.11 37.28 L0.00 51.24 L5.62 60.98 L21.18 51.92 L7.31 76.04 L17.07 81.66 L26.04 66.01 L26.07 93.88 L37.31 93.88 L37.28 75.86 L51.24 99.97 L60.98 94.35 L51.92 78.79 L76.04 92.66 L81.66 82.90 L66.04 73.93 L93.88 73.91 L93.88 62.66 L75.86 62.69 L99.97 48.73 L94.35 38.99 L78.79 48.05 L92.66 23.93 L82.90 18.31 L73.93 33.93 L73.91 6.09 L62.66 6.09 L62.69 24.11 Z" />
              </svg>
            </div>
          </div>

          <div className="proc-final" aria-hidden={ativo !== ETAPAS.length - 1}>
            <img src="/favicon.png" alt="" />
            <p>{t('A identidade é consequência do processo.')}</p>
          </div>
        </div>
      </div>
    </section>
  )
}
