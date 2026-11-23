import { useEffect, useRef } from 'react'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

gsap.registerPlugin(ScrollTrigger)

/* Disparador global: os links de navegação (dock, botões e âncoras) chamam a RUPTURA antes de trocar de seção */
let disparar = null
export function navegarComRuptura(alvo) {
  if (disparar) disparar(alvo)
}

/* RUPTURA — tensão, ruptura, imersão (#12312C) e revelação por máscara.
   Duração total ≈ 1,2 s. Clique em navegação: a troca de seção acontece no instante da imersão.
   Rolagem natural até "Nossos valores": a mesma sequência, sem trocar a posição. */
export default function Ruptura() {
  const ref = useRef(null)

  useEffect(() => {
    const root = ref.current
    if (!root) return
    const reduzir = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    let ocupado = false

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

    const tl = gsap.timeline({
      paused: true,
      onStart: () => { root.classList.add('on') },
      onComplete: () => { root.classList.remove('on'); ocupado = false; destravar() },
    })

    /* 01 TENSÃO — a página branca perde presença */
    tl.fromTo('.rp-veu', { opacity: 0 }, { opacity: 0.55, duration: 0.14, ease: 'power2.out' }, 0)
      /* 02 RUPTURA — formas em velocidades e direções diferentes, sobrepostas */
      .fromTo('.rp-f1', { xPercent: -120 }, { xPercent: 0, duration: 0.36, ease: 'expo.out' }, 0.1)
      .fromTo('.rp-f2', { xPercent: 120 }, { xPercent: 0, duration: 0.3, ease: 'power4.out' }, 0.16)
      .fromTo('.rp-f3', { yPercent: -120 }, { yPercent: 0, duration: 0.34, ease: 'expo.out' }, 0.22)
      .fromTo('.rp-f4', { yPercent: 120 }, { yPercent: 0, duration: 0.28, ease: 'power3.out' }, 0.28)
      /* 03 IMERSÃO — o bloco #12312C cobre a tela e a seção é trocada por baixo */
      .fromTo('.rp-f5', { yPercent: 100 }, { yPercent: 0, duration: 0.34, ease: 'expo.inOut' }, 0.4)
      .fromTo('.rp-linha', { scaleY: 0 }, { scaleY: 1, duration: 0.22, ease: 'power3.out' }, 0.5)
      .call(() => { if (tl.__alvo) trocarSecao(tl.__alvo) }, null, 0.72)
      .to({}, { duration: 0.1 }, 0.72)
      /* 04 REVELAÇÃO — a máscara recua e mostra a nova seção com fundo verde */
      .to('.rp-stage', { clipPath: 'polygon(0% 100%, 100% 100%, 100% 100%, 0% 100%)', duration: 0.38, ease: 'expo.inOut' }, 0.82)
      .fromTo('.rp-veu', { opacity: 0.55 }, { opacity: 0, duration: 0.2, ease: 'power2.out' }, 0.9)

    disparar = (alvo) => {
      if (ocupado) return
      ocupado = true
      travar()
      tl.__alvo = alvo
      tl.restart()
    }

    if (reduzir) {
      disparar = (alvo) => { trocarSecao(alvo) }
    }

    /* Links internos (dock, botões e âncoras) */
    const onClick = (e) => {
      const a = e.target.closest && e.target.closest('a[href^="#"]')
      if (!a) return
      const alvo = a.getAttribute('href')
      if (!alvo || alvo === '#' || !document.querySelector(alvo)) return
      if (reduzir) return
      e.preventDefault()
      disparar(alvo)
    }
    document.addEventListener('click', onClick)

    /* Rolagem natural até "Nossos valores" */
    const gatilho = reduzir ? null : ScrollTrigger.create({
      trigger: '#valores',
      start: 'top 8%',
      onEnter: () => { if (!ocupado) disparar(null) },
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
    <div className="rp" ref={ref} aria-hidden="true">
      <div className="rp-stage">
        <div className="rp-veu" />
        <div className="rp-f rp-f1" />
        <div className="rp-f rp-f2" />
        <div className="rp-f rp-f3" />
        <div className="rp-f rp-f4" />
        <div className="rp-f rp-f5" />
        <div className="rp-linha" />
      </div>
    </div>
  )
}
