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
  { p: "Quanto tempo leva um projeto de identidade visual?", r: "Depende da complexidade e do escopo. Após entender suas necessidades, apresentamos um cronograma com os prazos de cada etapa." },
  { p: "Como funciona o processo de criação?", r: "Nosso processo acontece em cinco movimentos: Perguntar, Entender, Organizar, Encontrar e Traduzir. Investigamos o negócio antes de transformar suas particularidades em uma identidade visual." },
  { p: "Vocês atendem empresas de outras cidades?", r: "Sim! Atendemos em todo o Brasil, com reuniões e acompanhamento online." },
  { p: "O que está incluso na identidade visual?", r: "Pode incluir logotipo e variações, símbolo, cores, tipografia, elementos gráficos e diretrizes de aplicação. O escopo é definido conforme cada projeto." },
  { p: "Preciso já ter um logotipo para começar?", r: "Não! Podemos construir sua marca do zero ou desenvolver uma identidade a partir do que você já possui." },
  { p: "Como funciona o investimento?", r: "O valor depende das necessidades e do escopo do projeto. Após uma conversa inicial, apresentamos uma proposta personalizada com valores e condições de pagamento." },
  { p: "Vocês fazem aplicações além do logotipo?", r: "Sim! Criamos aplicações para materiais gráficos, papelaria, embalagens, peças digitais e outros pontos de contato da marca." },
  { p: "O Drope também trabalha com estratégia de marca?", r: "Sim! Investigamos o negócio e seu posicionamento para encontrar o que o torna único e transformar isso em uma marca coerente." },
  { p: "A impressão dos materiais está incluída no projeto?", r: "Não. Entregamos os arquivos digitais prontos para produção. Os custos de impressão e fabricação são contratados separadamente." },
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

      /* 1) a roleta gira sozinha ao chegar e para com a frente */
      let giroFeito = false
      const giro = gsap.timeline({
        paused: true,
        onStart: () => { giroFeito = false },
        onComplete: () => { giroFeito = true; aplicar() },
      })
      giro.fromTo(cubo, { rotationX: 0 }, { rotationX: -360 * 2, duration: 3.6, ease: 'power2.out' })

      /* 2) expansão da imagem pequena até a tela inteira, acompanhando a rolagem (vai e volta) */
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
        gsap.set(faqWrap, { autoAlpha: clamp((p - 0.7) / 0.3) })
        gsap.set(cubo.parentNode, { autoAlpha: 1 - clamp((p - 0.4) / 0.3) })
        gsap.set(itens, { opacity: clamp((p - 0.8) / 0.2), y: (1 - clamp((p - 0.8) / 0.2)) * 18 })
      }
      desenhar(0)

      const expansao = ScrollTrigger.create({
        trigger: sec,
        start: 'top top',
        end: 'bottom bottom',
        onUpdate: () => aplicar(),
      })
      const aplicar = () => {
        const alvo = giroFeito ? expansao.progress : 0
        gsap.to(estado, { p: alvo, duration: 0.35, ease: 'power2.out', overwrite: true, onUpdate: () => desenhar(estado.p) })
      }

      /* 3) a roleta começa a girar quando a seção chega ao topo; ao voltar, ela reinicia */
      const gatilho = ScrollTrigger.create({
        trigger: sec,
        start: 'top top',
        onEnter: () => giro.restart(),
        onLeaveBack: () => {
          giro.pause(0)
          giroFeito = false
          estado.p = 0
          desenhar(0)
        },
      })

      return () => { gatilho.kill(); expansao.kill(); giro.kill() }
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
