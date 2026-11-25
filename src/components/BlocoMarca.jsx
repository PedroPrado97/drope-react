import { useEffect, useRef } from 'react'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { useIdioma } from '../context/Idioma.jsx'

gsap.registerPlugin(ScrollTrigger)

/* Prisma de 6 faces iguais. Ao entrar na seção gira sozinho, para com a frente verde,
   espera 3 segundos. Depois, ao rolar a página, o quadro pequeno cresce até ocupar a tela
   e mostra as dúvidas frequentes. */
const LATERAIS = [
  '/media/bloco/la-frontera.webp',
  '/media/bloco/eu-amo-volei.webp',
  '/media/bloco/1-cafe.webp',
  '/media/bloco/ello.webp',
  '/media/bloco/cartao.webp',
]
const FAQ = [
  { p: 'Quanto tempo leva um projeto de identidade visual?', r: 'Depende do escopo. Uma identidade completa costuma levar de 3 a 6 semanas, contando a investigação, as propostas e os ajustes.' },
  { p: 'Como funciona o processo de criação?', r: 'Começamos por perguntas sobre o negócio, o público e o contexto. Depois, organizamos a estratégia, criamos a marca e entregamos as aplicações.' },
  { p: 'Vocês atendem empresas de outras cidades?', r: 'Sim. Todo o processo acontece online, com reuniões, apresentações e entregas digitais, independentemente da localização.' },
  { p: 'O que está incluso na identidade visual?', r: 'Logotipo, paleta de cores, tipografia, regras de uso e arquivos para aplicação em redes sociais, impressos e fachadas.' },
  { p: 'Preciso já ter um logotipo para começar?', r: 'Não. Muitos projetos começam do zero. Se já existir uma marca, analisamos o que funciona e o que precisa evoluir.' },
  { p: 'Como funciona o investimento?', r: 'Cada projeto recebe um orçamento sob medida. Trabalhamos com entrada e parcelas, e o valor fica claro antes de começar.' },
  { p: 'Vocês fazem aplicações além do logotipo?', r: 'Sim: uniformes, embalagens, sinalização, papelaria, cardápios e peças para redes sociais, sempre com a identidade da marca.' },
]

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

      /* 1) giro automático do prisma ao entrar na seção: 3 voltas, desacelera, para na frente e espera 3 s */
      const giro = gsap.timeline({ paused: true })
      giro.fromTo(cubo, { rotationX: 0 }, { rotationX: -360 * 3, duration: 4.2, ease: 'power3.out' })
        .to({}, { duration: 3 })
      const gatilhoGiro = ScrollTrigger.create({
        trigger: sec,
        start: 'top 65%',
        onEnter: () => giro.restart(),
        onLeaveBack: () => giro.pause(0),
      })

      /* 2) a tela fica fixa enquanto a página rola */
      const fixa = ScrollTrigger.create({
        trigger: sec,
        start: 'top top',
        end: 'bottom bottom',
        pin: '.bm-stage',
        pinSpacing: false,
      })

      /* 3) ao rolar a página, o quadro pequeno cresce até ocupar a tela toda */
      const zoomTl = gsap.timeline({
        scrollTrigger: {
          trigger: sec,
          start: 'top top+=100vh',
          end: 'bottom bottom',
          scrub: 0.8,
          invalidateOnRefresh: true,
        },
      })
      zoomTl.fromTo(zoom,
        { autoAlpha: 0, clipPath: insetDoMini },
        { autoAlpha: 1, clipPath: 'inset(0px 0px 0px 0px)', ease: 'none', duration: 1 })
        .fromTo(sec.querySelectorAll('.bm-faq-item'),
          { opacity: 0, y: 18 },
          { opacity: 1, y: 0, stagger: 0.08, ease: 'none', duration: 0.6 }, 0.55)

      return () => { gatilhoGiro.kill(); fixa.kill(); zoomTl.kill() }
    }, sec)

    return () => ctx.revert()
  }, [])

  return (
    <section ref={secRef} className="bm" id="bloco" aria-label="Toda marca tem algo a dizer">
      <div className="bm-stage">
        <div className="bm-cena">
          <div className="bm-cubo">
            <div className="bm-face bm-frente" style={{ transform: 'translate(-50%, -50%) rotateX(0deg) translateZ(calc(var(--s) * 0.866))' }}>
              <p>
                {t('Toda marca tem algo')}{' '}
                <span className="bm-mini"><img src={LATERAIS[0]} alt="" /></span>{' '}
                {t('a dizer. Vamos descobrir o que é?')}
              </p>
            </div>
            {LATERAIS.map((src, i) => (
              <div
                key={src}
                className="bm-face bm-foto"
                style={{
                  width: 'var(--s)',
                  height: 'var(--h)',
                  transform: `translate(-50%, -50%) rotateX(${(i + 1) * 60}deg) translateZ(calc(var(--s) * 0.866))`,
                  backgroundImage: `url(${src})`,
                }}
              />
            ))}
          </div>
        </div>

        <div className="bm-zoom">
          <img className="bm-zoom-fundo" src={LATERAIS[0]} alt="" aria-hidden="true" />
          <div className="bm-faq">
            <h3 className="bm-faq-titulo">{t('Dúvidas frequentes')}</h3>
            <ul className="bm-faq-lista">
              {FAQ.map((item) => (
                <li key={item.p} className="bm-faq-item" tabIndex={0}>
                  <span className="bm-faq-q">{t(item.p)}</span>
                  <span className="bm-faq-a"><span>{t(item.r)}</span></span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </section>
  )
}
