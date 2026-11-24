import { useEffect, useRef } from 'react'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { useIdioma } from '../context/Idioma.jsx'
import { VALORES } from '../data/valores.js'

gsap.registerPlugin(ScrollTrigger)

/* Valores em palco fixo: cada valor é um capítulo que se revela com a rolagem.
   · o capítulo novo sobe por uma máscara e o objeto 3D faz um deslocamento em profundidade;
   · o título entra de dentro de uma máscara; a barra de progresso acompanha;
   · o mouse inclina os objetos (parallax); no celular os capítulos se empilham; com movimento reduzido, tudo fica estático. */
export default function Valores() {
  const { t } = useIdioma()
  const secRef = useRef(null)

  useEffect(() => {
    const sec = secRef.current
    if (!sec) return
    const reduzir = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    if (reduzir) { sec.classList.add('vc-static'); return }

    const mm = gsap.matchMedia()
    const ctx = gsap.context(() => {
      const caps = gsap.utils.toArray('.vc-cap', sec)
      const objs = caps.map((c) => c.querySelector('.vc-obj'))
      const titulos = caps.map((c) => c.querySelector('.vc-titulo-linha'))
      const textos = caps.map((c) => c.querySelector('.vc-texto'))
      const prog = sec.querySelector('.vc-prog')

      mm.add('(min-width: 901px)', () => {
        /* estado inicial: só o primeiro capítulo visível */
        gsap.set(caps.slice(1), { clipPath: 'inset(100% 0% 0% 0%)' })
        gsap.set(objs.slice(1), { yPercent: 22, rotate: 5, scale: 0.94 })
        gsap.set(titulos.slice(1), { yPercent: 110 })
        gsap.set(textos.slice(1), { opacity: 0, y: 24 })
        gsap.set(prog, { scaleX: 1 / caps.length, transformOrigin: '0 50%' })

        const tl = gsap.timeline({
          defaults: { ease: 'power3.inOut' },
          scrollTrigger: {
            trigger: sec,
            start: 'top top',
            end: () => '+=' + window.innerHeight * (caps.length - 1) * 1.2,
            pin: '.vc-stage',
            scrub: 0.9,
            anticipatePin: 1,
            invalidateOnRefresh: true,
          },
        })

        for (let i = 0; i < caps.length - 1; i++) {
          const k = i + 1
          tl.to(caps[k], { clipPath: 'inset(0% 0% 0% 0%)', duration: 1, ease: 'expo.inOut' }, i)
            .to(objs[i], { yPercent: -18, rotate: -6, scale: 0.86, opacity: 0.25, duration: 1 }, i)
            .to(objs[k], { yPercent: 0, rotate: 0, scale: 1, duration: 1 }, i + 0.1)
            .to(titulos[k], { yPercent: 0, duration: 0.8, ease: 'expo.out' }, i + 0.35)
            .to(textos[k], { opacity: 1, y: 0, duration: 0.6 }, i + 0.6)
            .to(prog, { scaleX: (k + 1) / caps.length, duration: 1, ease: 'power2.inOut' }, i)
        }

        /* parallax com o mouse: os objetos se inclinam e se deslocam levemente */
        const mover = (e) => {
          const r = sec.getBoundingClientRect()
          const x = (e.clientX - r.left) / r.width - 0.5
          const y = (e.clientY - r.top) / r.height - 0.5
          objs.forEach((o) => {
            gsap.to(o, { x: x * 26, y: y * 16, rotationY: x * 10, rotationX: -y * 8, duration: 1.2, ease: 'power3.out', overwrite: 'auto' })
          })
        }
        sec.addEventListener('pointermove', mover)
        return () => sec.removeEventListener('pointermove', mover)
      })

      mm.add('(max-width: 900px)', () => {
        caps.forEach((c) => {
          gsap.fromTo(c.querySelector('.vc-conteudo'), { opacity: 0, y: 40 }, {
            opacity: 1, y: 0, duration: 0.9, ease: 'power3.out',
            scrollTrigger: { trigger: c, start: 'top 75%' },
          })
        })
      })
    }, sec)

    return () => { mm.revert(); ctx.revert() }
  }, [])

  return (
    <section ref={secRef} className="vc" id="valores" aria-label={t('Nossos valores')}>
      <div className="vc-stage">
        <header className="vc-head">
          <h2 className="vc-kicker">{t('Nossos valores')}</h2>
        </header>

        {VALORES.map((v) => (
          <article key={v.n} className="vc-cap" style={{ '--cap-bg': v.fundo, '--cap-fg': v.texto }}>
            <div className="vc-conteudo">
              <div className="vc-texto-col">
                <div className="vc-mask">
                  <h3 className="vc-titulo-linha">{t(v.titulo)}</h3>
                </div>
                <div className="vc-texto">
                  {v.linhas.map((l) => <p key={l}>{t(l)}</p>)}
                  <p className="vc-marca">{t(v.marca)}</p>
                </div>
              </div>
              <div className="vc-objwrap">
                <img className="vc-obj" src={v.img} alt="" />
              </div>
            </div>
          </article>
        ))}

        <div className="vc-prog" aria-hidden="true" />
      </div>
    </section>
  )
}
