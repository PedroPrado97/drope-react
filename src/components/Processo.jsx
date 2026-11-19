import { useEffect, useRef, useState } from 'react'

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
      <div className="proc-fade" aria-hidden="true" />

      <div className="proc-stage">
        <header className="proc-head">
          <p className="proc-kicker">Do questionamento à forma.</p>
          <h2 className="proc-title">Cinco movimentos.<br />Uma construção com intenção.</h2>
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
              <span className="proc-label">{e.verbo}</span>
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
              <h3 className="proc-verb">{e.verbo}</h3>
              <p className="proc-prop">{e.proposito}</p>
              <ul className="proc-busca">
                {e.buscamos.map((b) => <li key={b}>{b}</li>)}
              </ul>
            </article>
          ))}

          <div className="proc-geo" aria-hidden="true">
            <span className="geo-c c1" />
            <span className="geo-c c2" />
            <span className="geo-line" />
          </div>

          <div className="proc-final" aria-hidden={ativo !== ETAPAS.length - 1}>
            <img src="/favicon.png" alt="" />
            <p>A identidade é consequência do processo.</p>
          </div>
        </div>
      </div>
    </section>
  )
}
