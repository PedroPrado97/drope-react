import { useEffect, useRef, useState } from 'react'
import { useIdioma } from '../context/Idioma.jsx'
import Tecido from './Tecido.jsx'
import { ETAPAS } from '../data/processo.js'
import { clamp, easeInOut } from '../utils/numeros.js'


export default function Processo() {
  const { t } = useIdioma()
  const ref = useRef(null)
  const [ativo, setAtivo] = useState(0)

  useEffect(() => {
    const sec = ref.current
    if (!sec) return
    const painel = sec.querySelectorAll('.proc-panel')
    let alvo = 0          /* posição de destino (0 a 4), vinda da rolagem */
    let atual = 0         /* posição exibida, suavizada a cada quadro */
    let raf = null
    let idxAnterior = -1

    const desenhar = (q) => {
      const mobile = window.matchMedia('(max-width: 900px)').matches
      const head = sec.querySelector('.proc-head')
      painel.forEach((el, i) => {
        if (mobile) {
          el.style.transform = ''
          el.style.filter = ''
          const limite = head ? head.getBoundingClientRect().bottom : 0
          const d = el.getBoundingClientRect().top - limite
          /* visível enquanto está abaixo do título; some ao chegar nele, antes de passar por baixo */
          el.style.opacity = clamp((d + 40) / 140).toFixed(3)
          return
        }
        /* zona de leitura: a etapa fica inteira em destaque; a transição ocorre no trecho final */
        const dist = i - q
        const ad = Math.abs(dist)
        const m = easeInOut(clamp((ad - 0.25) / 0.75))
        const sinal = dist < 0 ? -1 : 1
        el.style.transform = `translate3d(${(sinal * m * 70).toFixed(2)}px, ${(-m * 18).toFixed(2)}px, 0) scale(${(1 - m * 0.06).toFixed(4)})`
        el.style.filter = `blur(${(m * 8).toFixed(2)}px)`
        el.style.opacity = (1 - m).toFixed(3)
      })
    }

    const passo = () => {
      atual += (alvo - atual) * 0.1
      if (Math.abs(alvo - atual) < 0.0008) atual = alvo
      desenhar(atual)
      const idx = Math.round(atual)
      if (idx !== idxAnterior) { idxAnterior = idx; setAtivo(idx) }
      raf = atual !== alvo ? requestAnimationFrame(passo) : null
    }
    const animar = () => { if (!raf) raf = requestAnimationFrame(passo) }

    const atualizar = () => {
      const topo = sec.getBoundingClientRect().top + window.pageYOffset
      const tot = Math.max(sec.offsetHeight - window.innerHeight, 1)
      const p = clamp((window.pageYOffset - topo) / tot)
      const n = ETAPAS.length
      const x = p * (n - 1)
      const k = Math.min(n - 2, Math.floor(x))
      const f = x - k
      /* cada etapa fica parada até 70% do seu trecho e só então troca */
      alvo = k + clamp((f - 0.7) / 0.3)
      sec.style.setProperty('--p', p.toFixed(4))
      animar()
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
      if (raf) cancelAnimationFrame(raf)
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
        <Tecido />
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
        </div>
      </div>
    </section>
  )
}
