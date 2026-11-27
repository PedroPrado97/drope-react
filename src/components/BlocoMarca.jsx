import { useEffect, useRef, useState } from 'react'
import { createPortal } from 'react-dom'
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
  { p: "O que está incluso na identidade visual?", r: "Pode incluir logotipo e variações, símbolo, cores, tipografia, elementos gráficos e diretrizes de aplicação. O escopo é definido conforme cada projeto." },
  { p: "Preciso já ter um logotipo para começar?", r: "Não! Podemos construir sua marca do zero ou desenvolver uma identidade a partir do que você já possui." },
  { p: "Como funciona o investimento?", r: "O valor depende das necessidades e do escopo do projeto. Após uma conversa inicial, apresentamos uma proposta personalizada com valores e condições de pagamento." },
  { p: "Vocês fazem aplicações além do logotipo?", r: "Sim! Criamos aplicações para materiais gráficos, papelaria, embalagens, peças digitais e outros pontos de contato da marca." },
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

/* Pergunta em acordeão: abre ao clicar no +; ao passar o mouse, o quadro se pinta em degradê verde */
function FaqItem({ pergunta, resposta, aberto, onAlternar }) {
  return (
    <li className={'fq-item' + (aberto ? ' aberto' : '')}>
      <button type="button" className="fq-btn" aria-expanded={aberto} onClick={onAlternar}>
        <span className="fq-q">{pergunta}</span>
        <span className="fq-mais" aria-hidden="true">{aberto ? '\u2212' : '+'}</span>
      </button>
      <div className="fq-resp"><div><p>{resposta}</p></div></div>
    </li>
  )
}

export default function BlocoMarca() {
  const { t } = useIdioma()
  const secRef = useRef(null)
  const faqRef = useRef(null)
  const [aberta, setAberta] = useState(-1)

  useEffect(() => {
    const sec = secRef.current
    if (!sec) return
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return

    const ctx = gsap.context(() => {
      const cubo = sec.querySelector('.bm-cubo')
      const mini = sec.querySelector('.bm-mini')
      const expand = sec.querySelector('.bm-expand')
      const faqWrap = faqRef.current
      const itens = faqWrap ? faqWrap.querySelectorAll('.bm-faq-item') : []

      /* 1) a roleta gira sozinha ao chegar e para com a frente */
      let giroFeito = false
      const giro = gsap.timeline({
        paused: true,
        onStart: () => { giroFeito = false },
        onComplete: () => { giroFeito = true; aplicar() },
      })
      giro.fromTo(cubo, { rotationX: 0 }, { rotationX: -360 * 2, duration: 3.6, ease: 'power2.out' })

      let saiu = false

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
        gsap.set(faqWrap, { autoAlpha: saiu ? 0 : clamp((p - 0.7) / 0.3) })
        /* a roleta some assim que a expansão começa, para não aparecer atrás da imagem */
        gsap.set(cubo.parentNode, { autoAlpha: 1 - clamp(p / 0.08) })
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

      /* ao sair da seção para baixo, o quadro de perguntas some (ele fica fora da seção, então não acompanha a rolagem) */
      const sair = ScrollTrigger.create({
        trigger: sec,
        start: 'bottom bottom',
        onEnter: () => { saiu = true; gsap.set(faqWrap, { autoAlpha: 0 }) },
        onLeaveBack: () => { saiu = false; aplicar() },
      })

      return () => { gatilho.kill(); expansao.kill(); sair.kill(); giro.kill() }
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

        {createPortal(
        <div className="bm-faq-wrap" ref={faqRef}>
          <div className="bm-faq">
            <h3 className="bm-faq-titulo">{t('Dúvidas frequentes')}</h3>
            <ul className="fq-lista">
              {FAQ.map((item, i) => (
                <FaqItem
                  key={item.p}
                  pergunta={t(item.p)}
                  resposta={t(item.r)}
                  aberto={aberta === i}
                  onAlternar={() => setAberta(aberta === i ? -1 : i)}
                />
              ))}
            </ul>
          </div>
        </div>
        , document.body)}
      </div>
    </section>
  )
}
