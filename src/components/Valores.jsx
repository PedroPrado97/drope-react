import { useEffect, useRef, useState } from 'react'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { useIdioma } from '../context/Idioma.jsx'

gsap.registerPlugin(ScrollTrigger)

const VALORES = [
  {
    n: '01', titulo: 'CURIOSIDADE.', img: '/media/valores/labirinto.webp', fundo: '#12312C', texto: '#f3f7f2',
    linhas: ['Não nos contentamos com a primeira resposta. Buscamos entender o que existe por trás de cada negócio, pessoas e contextos. Boas marcas começam com boas perguntas.'],
    marca: 'Na sua marca, investigamos o negócio, o contexto e as pessoas antes de desenhar qualquer coisa. Cada pergunta abre um caminho, como um labirinto que só se revela ao ser percorrido.',
  },
  {
    n: '02', titulo: 'INTENÇÃO.', img: '/media/valores/bussola.webp', fundo: '#215733', texto: '#f3f7f2',
    linhas: ['Nada deveria existir apenas porque ficou bonito.', 'Cada decisão precisa ter uma razão. Forma e significado devem caminhar juntos.'],
    marca: 'Na sua marca, cada cor, forma e tipografia aponta para um mesmo norte. Nada entra apenas porque ficou bonito: tudo tem uma razão e um significado.',
  },
  {
    n: '03', titulo: 'CORAGEM.', img: '/media/valores/montanha.webp', fundo: '#0a0a0a', texto: '#6DC249',
    linhas: ['O caminho mais seguro nem sempre é o mais interessante.', 'Defendemos diferenças, escolhas autorais e marcas que não precisam se parecer com todas as outras.'],
    marca: 'Na sua marca, assumimos escolhas autorais que podem parecer arriscadas. Porque o caminho mais alto também é o que mais se destaca.',
  },
]

const clamp = (v) => Math.min(1, Math.max(0, v))

export default function Valores() {
  const { t } = useIdioma()
  const ref = useRef(null)
  const [p, setP] = useState(0)

  /* RUPTURA: ao entrar na seção, formas verdes atravessam a tela, cobrem tudo com #12312C
     e a máscara se abre revelando a seção (tempo total ≈ 1,2 s). Reverte ao voltar. */
  useEffect(() => {
    const sec = ref.current
    if (!sec) return
    const overlay = sec.querySelector('.rup')
    if (!overlay) return
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return

    const tl = gsap.timeline({
      paused: true,
      onStart: () => { overlay.classList.add('on') },
      onReverseComplete: () => { overlay.classList.remove('on') },
      onComplete: () => { overlay.classList.remove('on') },
    })
    tl.fromTo('.rup-white', { scale: 1 }, { scale: 0.985, duration: 0.12, ease: 'power2.out' }, 0)
      .fromTo('.rup-f1', { xPercent: -115 }, { xPercent: 0, duration: 0.42, ease: 'expo.out' }, 0.1)
      .fromTo('.rup-f2', { xPercent: 115 }, { xPercent: 0, duration: 0.38, ease: 'power4.out' }, 0.18)
      .fromTo('.rup-f5', { yPercent: -115 }, { yPercent: 0, duration: 0.34, ease: 'expo.out' }, 0.26)
      .fromTo('.rup-f3', { yPercent: 100 }, { yPercent: 0, duration: 0.46, ease: 'expo.inOut' }, 0.36)
      .fromTo('.rup-accent', { scaleY: 0 }, { scaleY: 1, duration: 0.3, ease: 'power3.out' }, 0.5)
      .to('.rup-stage', { clipPath: 'polygon(0% 0%, 100% 0%, 100% 0%, 0% 0%)', duration: 0.42, ease: 'expo.inOut' }, 0.8)

    const gatilho = ScrollTrigger.create({
      trigger: sec,
      start: 'top 8%',
      onEnter: () => tl.restart(),
      onLeaveBack: () => tl.reverse(),
    })
    return () => { gatilho.kill(); tl.kill() }
  }, [])

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

  /* Cada valor ocupa um terço da rolagem:
     1) o plano deitado (perspectiva de chão) sobe e o ícone 3D fica em pé sobre ele;
     2) o ícone some e a tela mostra só o título e o texto centralizados.  */
  const seg = Math.min(VALORES.length - 1, Math.floor(p * VALORES.length))
  const t0 = clamp(p * VALORES.length - seg)
  const sobe = clamp(t0 / 0.5)
  const iconeVisivel = 1 - clamp((t0 - 0.35) / 0.2)
  const textoVisivel = clamp((t0 - 0.5) / 0.2) * (1 - clamp((t0 - 0.9) / 0.1))
  const v = VALORES[seg]

  return (
    <section className="val" id="valores" ref={ref} aria-label="Valores">
      <div className="rup" aria-hidden="true">
        <div className="rup-stage">
          <div className="rup-white" />
          <div className="rup-f rup-f1" />
          <div className="rup-f rup-f2" />
          <div className="rup-f rup-f5" />
          <div className="rup-f rup-f3" />
          <div className="rup-accent" />
        </div>
      </div>
      <div className="val-stage" style={{ background: v.fundo, color: v.texto }}>
        <div className="val-aurora" aria-hidden="true"><span /><span /><span /></div>

        <header className="val-top">
          <h2 className="val-titulo-sec">{t('Nossos valores')}</h2>
          <span className="val-count">{String(seg + 1).padStart(2, '0')} / 03</span>
        </header>

        <div className="val-plano-cena" aria-hidden="true" style={{ opacity: iconeVisivel }}>
          <div
            className="val-plano"
            style={{ transform: `perspective(1200px) rotateX(${70 - 70 * sobe}deg) translateY(${-sobe * 6}vh)` }}
          >
            <div className="val-grade" />
            <img
              className="val-icone"
              src={v.img}
              alt=""
              style={{ transform: `translate(-50%, ${-100 + sobe * 100}%) scale(${0.6 + 0.4 * sobe})` }}
            />
          </div>
        </div>

        <div className="val-texto" style={{ opacity: textoVisivel }}>
          <h3 className="val-titulo-sec">{t(v.titulo)}</h3>
          {v.linhas.map((l) => <p key={l}>{t(l)}</p>)}
          <p className="val-marca">{t(v.marca)}</p>
        </div>
      </div>
    </section>
  )
}
