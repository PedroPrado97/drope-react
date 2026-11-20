import { useEffect, useRef, useState } from 'react'
import { useIdioma } from '../context/Idioma.jsx'

const VALORES = [
  {
    n: '01', titulo: 'CURIOSIDADE.', fundo: '#12312C', texto: '#f3f7f2', camada: '#12312C',
    linhas: ['Não nos contentamos com a primeira resposta. Buscamos entender o que existe por trás de cada negócio, pessoas e contextos. Boas marcas começam com boas perguntas.'],
  },
  {
    n: '02', titulo: 'INTENÇÃO.', fundo: '#0f2b25', texto: '#f3f7f2', camada: '#6DC249',
    linhas: ['Nada deveria existir apenas porque ficou bonito.', 'Cada decisão precisa ter uma razão. Forma e significado devem caminhar juntos.'],
  },
  {
    n: '03', titulo: 'CORAGEM.', fundo: '#0a0a0a', texto: '#6DC249', camada: '#f3f7f2',
    linhas: ['O caminho mais seguro nem sempre é o mais interessante.', 'Defendemos diferenças, escolhas autorais e marcas que não precisam se parecer com todas as outras.'],
  },
]

export default function Valores() {
  const { t } = useIdioma()
  const ref = useRef(null)
  const [pos, setPos] = useState({ idx: 0, ex: 0, p: 0 })

  useEffect(() => {
    const sec = ref.current
    if (!sec) return
    const atualizar = () => {
      const topo = sec.getBoundingClientRect().top + window.pageYOffset
      const tot = Math.max(sec.offsetHeight - window.innerHeight, 1)
      const p = Math.min(1, Math.max(0, (window.pageYOffset - topo) / tot))
      /* camadas se afastam no início e voltam a se juntar no fim */
      const abre = Math.min(1, p / 0.45)
      const junta = Math.min(1, Math.max(0, (p - 0.82) / 0.18))
      const ex = abre * (1 - junta)
      const idx = Math.min(VALORES.length - 1, Math.floor(p * VALORES.length))
      sec.style.setProperty('--ex', ex.toFixed(4))
      setPos({ idx, ex, p })
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

  const atual = VALORES[pos.idx]
  const fim = pos.p > 0.82

  return (
    <section
      className="val"
      id="valores"
      ref={ref}
      aria-label="Valores"
      style={{ backgroundColor: fim ? '#ffffff' : atual.fundo, color: fim ? '#0a0a0a' : atual.texto }}
    >
      <div className="val-stage">
        <header className="val-top">
          <p className="val-kicker">{t('Nossos valores')}</p>
          <span className="val-count">{String(pos.idx + 1).padStart(2, '0')} / 03</span>
        </header>

        <div className="val-texto-col">
          <p className="val-label">
            {String(pos.idx + 1).padStart(2, '0')} · <span>{t(atual.titulo)}</span>
          </p>
          <div className="val-lista-textos" key={atual.n}>
            {atual.linhas.map((l) => (
              <p key={l}>{t(l)}</p>
            ))}
          </div>
          <div className="val-trilho" aria-hidden="true">
            {VALORES.map((v, i) => (
              <span key={v.n} className={i === pos.idx ? 'on' : ''} />
            ))}
          </div>
        </div>

        <div className="val-cena" aria-hidden="true">
          <div className="val-iso">
            {VALORES.map((v, i) => (
              <div
                key={v.n}
                className={'val-camada c' + i}
                style={{ background: v.camada }}
              >
                <span className="val-camada-n">{v.n}</span>
              </div>
            ))}
            <svg className="val-seta" viewBox="0 0 100 100" preserveAspectRatio="none">
              <path d="M8 84 C 30 20, 60 96, 92 14" />
            </svg>
          </div>
        </div>
      </div>
    </section>
  )
}
