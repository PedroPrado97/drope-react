import { useEffect, useRef } from 'react'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { useIdioma } from '../context/Idioma.jsx'

gsap.registerPlugin(ScrollTrigger)

/* Prisma hexagonal (6 faces iguais). Gira sozinho ao chegar na seção, para com a frente
   (com a frase) voltada para o público e espera 3 s.
   Depois, ao rolar, a pequena imagem ao lado de "algo" se expande, suavemente e de forma
   reversível, até ocupar a tela toda. Sobre ela aparecem as dúvidas frequentes. */
/* Imagem que fica ao lado de "algo" e se expande até a tela inteira */
const FOTO_EXPANSAO = '/media/bloco/drope-1.webp'

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

const lerp = (a, b, t) => a + (b - a) * t
const clamp = (v) => Math.min(1, Math.max(0, v))
const easeInOut = (t) => (t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2)

/* Cada face é centralizada pela margem e depois girada em torno do centro do prisma (eixo X).
   A distância até o eixo é h·√3/2, então as seis faces ficam coladas. */
const estiloCentro = (grau) => ({
  width: 'var(--s)',
  height: 'var(--h)',
  marginLeft: 'calc(var(--s) / -2)',
  marginTop: 'calc(var(--h) / -2)',
  transform: `rotateX(${grau}deg) translateZ(calc(var(--h) * 0.866))`,
})

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
      const expand = sec.querySelector('.bm-expand')
      const faqWrap = sec.querySelector('.bm-faq-wrap')
      const itens = sec.querySelectorAll('.bm-faq-item')

      /* expansão da imagem pequena (ao lado de "algo") até a tela inteira */
      const estado = { p: 0 }
      const desenhar = (p) => {
        const r = mini.getBoundingClientRect()
        const W = window.innerWidth, H = window.innerHeight
        const e = easeInOut(p)
        gsap.set(expand, {
          left: lerp(r.left, 0, e),
          top: lerp(r.top, 0, e),
          width: lerp(r.width, W, e),
          height: lerp(r.height, H, e),
          borderRadius: lerp(4, 0, e),
          autoAlpha: p > 0 ? 1 : 0,
        })
        gsap.set(faqWrap, { autoAlpha: clamp((p - 0.85) / 0.15) })
      }
      desenhar(0)
      gsap.set(itens, { opacity: 0 })

      /* sequência automática: a roleta gira e para; 2 s depois a imagem se expande
         até ocupar a tela e, em seguida, aparecem as dúvidas frequentes */
      const sequencia = gsap.timeline({ paused: true })
      sequencia
        .fromTo(cubo, { rotationX: 0 }, { rotationX: -360 * 2, duration: 3.6, ease: 'power2.out' })
        .to({}, { duration: 2 })
        .to(estado, { p: 1, duration: 1.2, ease: 'power2.inOut', onUpdate: () => desenhar(estado.p) })
        .fromTo(itens, { opacity: 0, y: 18 }, { opacity: 1, y: 0, stagger: 0.08, duration: 0.6 }, '-=0.2')

      const gatilho = ScrollTrigger.create({
        trigger: sec,
        start: 'top top',
        onEnter: () => sequencia.restart(),
        onLeaveBack: () => {
          sequencia.pause(0)
          estado.p = 0
          desenhar(0)
          gsap.set(itens, { opacity: 0 })
        },
      })

      return () => { gatilho.kill(); sequencia.kill() }
    }, sec)

    return () => ctx.revert()
  }, [])

  return (
    <section ref={secRef} className="bm" id="bloco" aria-label="Toda marca tem algo a dizer">
      <div className="bm-stage">
        <div className="bm-cena">
          <div className="bm-cubo">
            <div className="bm-face bm-frente" style={estiloCentro(0)}>
              <p>
                {t('Toda marca tem algo')}{' '}
                <span className="bm-mini"><img src={FOTO_EXPANSAO} alt="" /></span>{' '}
                {t('a dizer. Vamos descobrir o que é?')}
              </p>
            </div>
            {LATERAIS.map((src, i) => (
              <div
                key={src}
                className="bm-face bm-foto"
                style={{ ...estiloCentro((i + 1) * 60), backgroundImage: `url(${src})` }}
              />
            ))}
          </div>
        </div>

        <div className="bm-expand" aria-hidden="true" style={{ backgroundImage: `url(${FOTO_EXPANSAO})` }}>
          <div className="bm-expand-veu" />
        </div>

        <div className="bm-faq-wrap">
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
