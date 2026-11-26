import { useEffect, useRef } from 'react'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

gsap.registerPlugin(ScrollTrigger)

/* Transição simples entre seções: fade para o verde #12312C, troca de seção no ponto mais escuro e fade de saída.
   Duração total ≈ 0,8 s. Respeita movimento reduzido (troca direta). */
export default function Displacement() {
  const ref = useRef(null)

  useEffect(() => {
    const root = ref.current
    if (!root) return
    const base = root.querySelector('.dp-base')
    const reduzir = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    let ocupado = false
    let alvoAtual = null

    const trocarSecao = (alvo) => {
      if (!alvo) return
      const el = document.querySelector(alvo)
      if (!el) return
      const y = el.getBoundingClientRect().top + window.pageYOffset
      window.scrollTo({ top: y, behavior: 'instant' })
      /* o endereço não muda (sem /#contato etc.); se a página abriu com #, limpa */
      if (location.hash) history.replaceState(null, '', location.pathname + location.search)
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
      onComplete: () => {
        root.classList.remove('on')
        ocupado = false
        destravar()
      },
    })

    tl.fromTo(base, { opacity: 0 }, { opacity: 1, duration: 0.34, ease: 'power2.in' }, 0)
      .call(() => { if (alvoAtual) trocarSecao(alvoAtual); alvoAtual = null }, null, 0.36)
      .to(base, { opacity: 0, duration: 0.42, ease: 'power2.out' }, 0.38)

    const iniciar = (alvo) => {
      if (ocupado) return
      ocupado = true
      alvoAtual = alvo
      travar()
      tl.restart()
    }

    const disparar = (alvo) => {
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

    /* Sem disparo automático ao rolar: o piscar ao chegar em Valores vinha desta transição */
    const gatilho = null

    return () => {
      document.removeEventListener('click', onClick)
      if (gatilho) gatilho.kill()
      destravar()
      tl.kill()
    }
  }, [])

  return (
    <div className="dp" ref={ref} aria-hidden="true">
      <div className="dp-base" />
    </div>
  )
}
