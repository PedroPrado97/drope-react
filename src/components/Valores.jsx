import { useEffect } from 'react'
import useScrollProgress from '../hooks/useScrollProgress.js'
import { VALORES } from '../data/valores.js'
import { clamp, lerp } from '../utils/numeros.js'
import { useIdioma } from '../context/Idioma.jsx'


export default function Valores() {
  const { t } = useIdioma()
  const [ref, p] = useScrollProgress()

  /* Aurora que acompanha o mouse: a posição do cursor é suavizada e vira variáveis CSS */
  useEffect(() => {
    const sec = ref.current
    if (!sec || window.matchMedia('(prefers-reduced-motion: reduce)').matches) return
    let alvoX = 0, alvoY = 0, x = 0, y = 0, raf = 0
    const mover = (e) => {
      const r = sec.getBoundingClientRect()
      alvoX = ((e.clientX - r.left) / r.width) * 2 - 1
      alvoY = ((e.clientY - r.top) / r.height) * 2 - 1
    }
    const passo = () => {
      x += (alvoX - x) * 0.05
      y += (alvoY - y) * 0.05
      sec.style.setProperty('--mx', x.toFixed(4))
      sec.style.setProperty('--my', y.toFixed(4))
      raf = requestAnimationFrame(passo)
    }
    sec.addEventListener('pointermove', mover)
    raf = requestAnimationFrame(passo)
    return () => { sec.removeEventListener('pointermove', mover); cancelAnimationFrame(raf) }
  }, [ref])

  /* Linha do tempo:
     · início: pilha de quadros deitada em perspectiva isométrica (como na referência), base verde translúcida embaixo;
     · 0 a 0,22: a pilha se levanta e os quadros ficam em pé;
     · depois, cada valor ocupa um terço da rolagem: seu quadro vem para a frente, o ícone 3D aparece nele,
       o ícone some e o título e o texto aparecem centralizados. */
  const stand = clamp(p / 0.22)
  const lie = 1 - stand
  const seg = Math.min(VALORES.length - 1, Math.floor(clamp((p - 0.22) / 0.78) * VALORES.length))
  const t0 = clamp(((p - 0.22) / 0.78) * VALORES.length - seg)
  const iconeVisivel = 1 - clamp((t0 - 0.35) / 0.2)
  const textoVisivel = clamp((t0 - 0.5) / 0.2) * (1 - clamp((t0 - 0.9) / 0.1))
  const v = VALORES[seg]

  const stackStyle = {
    transform: `translate(-50%, -50%) rotateX(${lerp(62, 0, stand)}deg) rotateZ(${lerp(-45, 0, stand)}deg)`,
  }

  return (
    <section className="val" id="valores" ref={ref} aria-label="Valores">
      <div className="val-stage" style={{ background: v.fundo, color: v.texto }}>
        <div className="val-aurora" aria-hidden="true"><span /><span /><span /></div>
        <div className="val-noise" aria-hidden="true" />

        <div className="val-fx" aria-hidden="true">
          <span className="val-grid" />
          <span className="val-scan" />
        </div>

        <header className="val-top">
          <h2 className="val-titulo-sec val-titulo-futuro">
            {t('Nossos valores').split(' ').map((palavra, i) => (
              <span key={i} className="val-palavra" style={{ animationDelay: `${0.15 + i * 0.12}s` }}>
                {palavra}
              </span>
            ))}
          </h2>
        </header>

        <div className="val-cena" aria-hidden="true">
          <div className="val-stack" style={stackStyle}>
            {/* base verde translúcida (embaixo da pilha quando deitada) */}
            <div className="val-base" style={{ opacity: lie, transform: `translateZ(0px)` }} />
            {VALORES.map((vi, i) => {
              const ativo = seg === i
              const z = i * 70 * lie + (ativo ? 0 : -160) * stand
              return (
                <div
                  key={vi.n}
                  className={'val-quadro' + (ativo ? ' on' : '')}
                  style={{
                    transform: `translateZ(${z.toFixed(1)}px)`,
                    opacity: stand > 0.5 && !ativo ? 0.28 : 1,
                  }}
                >
                  <img
                    className="val-icone"
                    src={vi.img}
                    alt=""
                    style={{ opacity: lie > 0.02 ? 1 : (ativo ? iconeVisivel : 0) }}
                  />
                </div>
              )
            })}
          </div>
        </div>

        <h3 className="val-titulo-obj" style={{ opacity: lie > 0.02 ? 0 : iconeVisivel }} aria-hidden="true">
          {t(v.titulo)}
        </h3>

        <div className="val-texto" style={{ opacity: textoVisivel }}>
          {v.linhas.map((l) => <p key={l}>{t(l)}</p>)}
          <p className="val-marca">{t(v.marca)}</p>
        </div>
      </div>
    </section>
  )
}
