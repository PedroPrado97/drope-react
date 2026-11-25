import { useEffect, useRef } from 'react'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { useIdioma } from '../context/Idioma.jsx'

gsap.registerPlugin(ScrollTrigger)

/* Prisma de 6 faces iguais (como uma roleta). Gira sozinho ao entrar na seção,
   desacelera, para com a frente verde voltada para o público, espera 3 segundos
   e então o quadro pequeno cresce até ocupar a tela. */
const LATERAIS = [
  '/media/bloco/la-frontera.webp',
  '/media/bloco/eu-amo-volei.webp',
  '/media/bloco/1-cafe.webp',
  '/media/bloco/ello.webp',
  '/media/bloco/cartao.webp',
]
const FACES = 6
const PASSO = 360 / FACES

export default function BlocoMarca() {
  const { t } = useIdioma()
  const secRef = useRef(null)

  useEffect(() => {
    const sec = secRef.current
    if (!sec) return
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return

    const ctx = gsap.context(() => {
      const cubo = sec.querySelector('.bm-cubo')
      const mini = sec.querySelector('.bm-mini')
      const zoom = sec.querySelector('.bm-zoom')

      const insetDoMini = () => {
        const r = mini.getBoundingClientRect()
        const W = window.innerWidth, H = window.innerHeight
        return `inset(${r.top}px ${W - r.right}px ${H - r.bottom}px ${r.left}px)`
      }

      /* 3 voltas completas (múltiplo de 60°), terminando com a face 0 (frente) */
      const tl = gsap.timeline({ paused: true })
      tl.fromTo(cubo,
        { rotationX: 0 },
        { rotationX: -360 * 3, duration: 4.2, ease: 'power3.out' })
        .to({}, { duration: 3 })
        .fromTo(zoom,
          { autoAlpha: 0, clipPath: insetDoMini },
          { autoAlpha: 1, clipPath: 'inset(0px 0px 0px 0px)', duration: 1, ease: 'power3.inOut' })

      const gatilho = ScrollTrigger.create({
        trigger: sec,
        start: 'top 65%',
        onEnter: () => tl.restart(),
        onLeaveBack: () => tl.pause(0),
      })

      return () => gatilho.kill()
    }, sec)

    return () => ctx.revert()
  }, [])

  /* face 0 = frente (verde); faces 1 a 5 = trabalhos, cada uma a 60° da anterior */
  const angulo = (i) => i * PASSO
  const estiloFace = (i) => ({
    width: 'var(--s)',
    height: 'var(--h)',
    transform: `translate(-50%, -50%) rotateX(${angulo(i)}deg) translateZ(calc(var(--s) * 0.866))`,
  })

  return (
    <section ref={secRef} className="bm" id="bloco" aria-label="Toda marca tem algo a dizer">
      <div className="bm-stage">
        <div className="bm-cena">
          <div className="bm-cubo">
            <div className="bm-face bm-frente" style={estiloFace(0)}>
              <p>
                {t('Toda marca tem algo')}{' '}
                <span className="bm-mini"><img src={LATERAIS[0]} alt="" /></span>{' '}
                {t('a dizer. Vamos descobrir o que é?')}
              </p>
            </div>
            {LATERAIS.map((src, i) => (
              <div key={src} className="bm-face" style={estiloFace(i + 1)}>
                <img src={src} alt="" />
              </div>
            ))}
          </div>
        </div>

        <div className="bm-zoom" aria-hidden="true">
          <img src={LATERAIS[0]} alt="" />
          <p>{t('Próximo slide')}</p>
        </div>
      </div>
    </section>
  )
}
