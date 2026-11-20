import { useEffect, useRef, useState } from 'react'
import { useIdioma } from '../context/Idioma.jsx'

const VALORES = [
  {
    n: '01', titulo: 'CURIOSIDADE.', fundo: '#12312C', texto: '#f3f7f2', peca: 'peao',
    linhas: ['Não nos contentamos com a primeira resposta. Buscamos entender o que existe por trás de cada negócio, pessoas e contextos. Boas marcas começam com boas perguntas.'],
  },
  {
    n: '02', titulo: 'INTENÇÃO.', fundo: '#6DC249', texto: '#0a0a0a', peca: 'bispo',
    linhas: ['Nada deveria existir apenas porque ficou bonito.', 'Cada decisão precisa ter uma razão. Forma e significado devem caminhar juntos.'],
  },
  {
    n: '03', titulo: 'CORAGEM.', fundo: '#0a0a0a', texto: '#6DC249', peca: 'torre',
    linhas: ['O caminho mais seguro nem sempre é o mais interessante.', 'Defendemos diferenças, escolhas autorais e marcas que não precisam se parecer com todas as outras.'],
  },
]

/* Peças de xadrez em silhueta (vista de frente) */
const PECAS = {
  peao: (
    <g>
      <circle cx="30" cy="30" r="12" />
      <path d="M20 44 Q30 40 40 44 L44 84 L16 84 Z" />
      <rect x="12" y="84" width="36" height="8" rx="2" />
    </g>
  ),
  bispo: (
    <g>
      <path d="M30 6 Q42 24 37 40 Q30 46 23 40 Q18 24 30 6 Z" />
      <path d="M22 46 Q30 42 38 46 L42 84 L18 84 Z" />
      <rect x="12" y="84" width="36" height="8" rx="2" />
    </g>
  ),
  torre: (
    <g>
      <path d="M14 12 H23 V24 H37 V12 H46 V28 H40 V76 H20 V28 H14 Z" />
      <rect x="12" y="76" width="36" height="8" rx="2" />
      <rect x="10" y="84" width="40" height="8" rx="2" />
    </g>
  ),
}

const clamp = (v) => Math.min(1, Math.max(0, v))
const lerp = (a, b, t) => a + (b - a) * t

export default function Valores() {
  const { t } = useIdioma()
  const ref = useRef(null)
  const [p, setP] = useState(0)

  useEffect(() => {
    const sec = ref.current
    if (!sec) return
    const atualizar = () => {
      const topo = sec.getBoundingClientRect().top + window.pageYOffset
      const tot = Math.max(sec.offsetHeight - window.innerHeight, 1)
      setP(clamp((window.pageYOffset - topo) / tot))
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

  /* Linha do tempo (p de 0 a 1):
     0.00–0.18  planos deitados se separam; as peças surgem em pé sobre cada um
     0.18–0.30  os planos se levantam e viram um só bloco
     0.30–0.45  o plano 1 vira uma tela com a mensagem e cresce até ~80% da tela
     0.50–0.72  a tela 2 surge por trás e a 1 sai para cima
     0.80–1.00  a tela 3 surge por trás e a 2 sai para cima */
  const explode = clamp(p / 0.18)
  const pecas = clamp((p - 0.12) / 0.12)
  const levanta = clamp((p - 0.18) / 0.12)
  const blocoVisivel = clamp(1 - (p - 0.26) / 0.06)

  const cardEstado = (i) => {
    if (i === 0) {
      const entra = clamp((p - 0.26) / 0.1)
      const sai = clamp((p - 0.62) / 0.1)
      return { visivel: entra > 0 ? 1 : 0, escala: lerp(0.5, 0.8, entra), y: -sai * 130 }
    }
    if (i === 1) {
      const surge = clamp((p - 0.5) / 0.12)
      const cresce = clamp((p - 0.62) / 0.1)
      const sai = clamp((p - 0.87) / 0.1)
      return { visivel: surge, escala: lerp(0.72, 0.8, cresce), y: lerp(14, 0, surge) - sai * 130 }
    }
    const surge = clamp((p - 0.8) / 0.12)
    const cresce = clamp((p - 0.87) / 0.1)
    return { visivel: surge, escala: lerp(0.72, 0.8, cresce), y: lerp(14, 0, surge) }
  }

  return (
    <section className="val" id="valores" ref={ref} aria-label="Valores">
      <div className="val-stage">
        <h2 className="val-titulo-sec">{t('Nossos valores')}</h2>

        <div className="val-cena" aria-hidden={p > 0.3}>
          <div
            className="val-bloco"
            style={{
              opacity: blocoVisivel,
              transform: `rotateX(${62 - 62 * levanta}deg) rotateZ(${-28 + 28 * levanta}deg)`,
            }}
          >
            {VALORES.map((v, i) => {
              const z = (i - 1) * explode * 170
              return (
                <div
                  key={v.n}
                  className={'val-plano c' + i}
                  style={{ background: v.fundo, transform: `translateZ(${z}px)` }}
                >
                  <svg
                    className="val-peca"
                    viewBox="0 0 60 100"
                    style={{ opacity: pecas, transform: `translate(-50%,-100%) scale(${0.4 + 0.6 * pecas})` }}
                    fill={v.texto}
                  >
                    {PECAS[v.peca]}
                  </svg>
                </div>
              )
            })}
          </div>

          {VALORES.map((v, i) => {
            const e = cardEstado(i)
            if (e.visivel <= 0) return null
            return (
              <article
                key={v.n}
                className={'val-card c' + i}
                style={{
                  background: v.fundo,
                  color: v.texto,
                  opacity: e.visivel,
                  transform: `translate(-50%, calc(-50% + ${e.y}vh)) scale(${e.escala})`,
                  zIndex: 3 - i,
                }}
              >
                <span className="val-card-n">{v.n}</span>
                <h3 className="val-card-t">{t(v.titulo)}</h3>
                {v.linhas.map((l) => <p key={l}>{t(l)}</p>)}
              </article>
            )
          })}
        </div>
      </div>
    </section>
  )
}
