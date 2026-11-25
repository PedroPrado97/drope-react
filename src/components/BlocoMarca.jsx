import { useEffect, useRef } from 'react'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { useIdioma } from '../context/Idioma.jsx'

gsap.registerPlugin(ScrollTrigger)

/* Bloco de 6 lados. A frente (verde #215733) traz a mensagem; as outras cinco faces mostram trabalhos.
   Ao rolar, o bloco gira rápido e vai desacelerando, como um peão, até parar com a frente voltada
   para o público. Depois, o quadro pequeno dentro do texto cresce até ocupar a tela. */
const FACES = {
  costas: '/media/bloco/la-frontera.webp',
  topo: '/media/bloco/eu-amo-volei.webp',
  base: '/media/bloco/1-cafe.webp',
  esquerda: '/media/bloco/ello.webp',
  direita: '/media/bloco/cartao.webp',
}

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

      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: sec,
          start: 'top top',
          end: '+=340%',
          pin: '.bm-stage',
          scrub: 0.6,
          anticipatePin: 1,
          invalidateOnRefresh: true,
        },
      })

      /* giro do peão: 4 voltas em X e 2 em Y, desacelerando até a frente (0°, 0°) */
      tl.fromTo(cubo,
        { rotationX: 0, rotationY: 0 },
        { rotationX: -1440, rotationY: 720, duration: 1, ease: 'power3.out' },
        0)
      /* pausa com a frente à vista */
      tl.to({}, { duration: 0.25 }, 1)
      /* zoom do quadro pequeno até ocupar a tela */
      tl.fromTo(zoom,
        { autoAlpha: 0, clipPath: insetDoMini },
        { autoAlpha: 1, clipPath: 'inset(0px 0px 0px 0px)', duration: 0.9, ease: 'power3.inOut' },
        1.25)
    }, sec)

    return () => ctx.revert()
  }, [])

  return (
    <section ref={secRef} className="bm" id="bloco" aria-label="Toda marca tem algo a dizer">
      <div className="bm-stage">
        <div className="bm-cena">
          <div className="bm-cubo">
            <div className="bm-face bm-frente">
              <p>
                {t('Toda marca tem algo')}{' '}
                <span className="bm-mini"><img src={FACES.costas} alt="" /></span>{' '}
                {t('a dizer. Vamos descobrir o que é?')}
              </p>
            </div>
            <div className="bm-face bm-costas"><img src={FACES.costas} alt="" /></div>
            <div className="bm-face bm-topo"><img src={FACES.topo} alt="" /></div>
            <div className="bm-face bm-base"><img src={FACES.base} alt="" /></div>
            <div className="bm-face bm-esquerda"><img src={FACES.esquerda} alt="" /></div>
            <div className="bm-face bm-direita"><img src={FACES.direita} alt="" /></div>
          </div>
        </div>

        <div className="bm-zoom" aria-hidden="true">
          <img src={FACES.costas} alt="" />
          <p>{t('Próximo slide')}</p>
        </div>
      </div>
    </section>
  )
}
