import { useEffect, useRef } from 'react'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

gsap.registerPlugin(ScrollTrigger)

/* Disparador global: os links internos chamam o DISPLACEMENT antes de trocar de seção */
let disparar = null

/* Faixas: alturas irregulares (somam 100%) e ajustes de tempo e distância, para um movimento não previsível */
const ALTURAS = [7, 12, 9, 11, 8, 13, 6, 10, 9, 15]
const ATRASOS = [0.02, 0.07, 0.01, 0.11, 0.04, 0.09, 0.0, 0.06, 0.12, 0.03]
const DISTANCIAS = [118, 132, 124, 140, 121, 136, 127, 144, 119, 130]
const DURACOES = [0.52, 0.6, 0.48, 0.66, 0.5, 0.58, 0.46, 0.62, 0.54, 0.64]

export default function Displacement() {
  const ref = useRef(null)

  useEffect(() => {
    const root = ref.current
    if (!root) return
    const reduzir = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    let ocupado = false
    let alvoAtual = null

    const trocarSecao = (alvo) => {
      if (!alvo) return
      const el = document.querySelector(alvo)
      if (!el) return
      const y = el.getBoundingClientRect().top + window.pageYOffset
      window.scrollTo({ top: y, behavior: 'instant' })
      history.replaceState(null, '', alvo)
    }

    const bloquear = (e) => { if (ocupado) e.preventDefault() }
    const travar = () => {
      window.addEventListener('wheel', bloquear, { passive: false })
      window.addEventListener('touchmove', bloquear, { passive: false })
    }
    const destravar = () => {
      window.removeEventListener('wheel', bloquear)
      window.removeEventListener('touchmove', bloquear)
    }

    const faixas = gsap.utils.toArray(root.querySelectorAll('.dp-faixa'))

    const tl = gsap.timeline({
      paused: true,
      onStart: () => { root.classList.add('on') },
      onComplete: () => {
        gsap.set(faixas, { clearProps: 'all' })
        root.classList.remove('on')
        ocupado = false
        destravar()
      },
    })

    /* 01 FRAGMENTAÇÃO — a tela se divide em faixas com pequenas irregularidades */
    tl.fromTo(faixas,
      { xPercent: 0 },
      { xPercent: (i) => (i % 2 ? 0.9 : -0.9), duration: 0.12, ease: 'power2.out' }, 0)

    /* 02 DESLOCAMENTO — cada faixa se move em direção, velocidade e defasagem próprias */
    faixas.forEach((el, i) => {
      const dir = i % 2 === 0 ? -1 : 1
      tl.to(el, {
        xPercent: dir * DISTANCIAS[i % DISTANCIAS.length],
        duration: DURACOES[i % DURACOES.length],
        ease: i % 3 === 0 ? 'expo.in' : 'power3.inOut',
      }, 0.12 + ATRASOS[i % ATRASOS.length])
    })

    /* Troca de seção acontece com as faixas ainda cobrindo a tela */
    tl.call(() => { if (alvoAtual) trocarSecao(alvoAtual); alvoAtual = null }, null, 0.4)

    /* 03 REVELAÇÃO e 04 RECONSTRUÇÃO — o verde #12312C aparece onde as faixas saem */
    tl.to(root.querySelector('.dp-base'), { opacity: 1, duration: 0.1, ease: 'none' }, 0.5)
      .to(root.querySelector('.dp-base'), { opacity: 0, duration: 0.2, ease: 'power2.out' }, 0.94)

    const iniciar = (alvo) => {
      if (ocupado) return
      ocupado = true
      alvoAtual = alvo
      travar()
      tl.restart()
    }

    disparar = (alvo) => {
      if (reduzir) { trocarSecao(alvo); return }
      iniciar(alvo)
    }

    const onClick = (e) => {
      const a = e.target.closest && e.target.closest('a[href^="#"]')
      if (!a) return
      const alvo = a.getAttribute('href')
      if (!alvo || alvo === '#' || !document.querySelector(alvo)) return
      e.preventDefault()
      disparar(alvo)
    }
    document.addEventListener('click', onClick)

    /* Rolagem natural até "Nossos valores" */
    const gatilho = reduzir ? null : ScrollTrigger.create({
      trigger: '#valores',
      start: 'top 8%',
      onEnter: () => { if (!ocupado) iniciar(null) },
    })

    return () => {
      document.removeEventListener('click', onClick)
      if (gatilho) gatilho.kill()
      destravar()
      tl.kill()
      disparar = null
    }
  }, [])

  return (
    <div className="dp" ref={ref} aria-hidden="true">
      <div className="dp-base" />
      {ALTURAS.map((h, i) => (
        <div
          key={i}
          className="dp-faixa"
          style={{ top: `${ALTURAS.slice(0, i).reduce((a, b) => a + b, 0)}%`, height: `${h}%` }}
        />
      ))}
    </div>
  )
}
