import { useEffect } from 'react'

/* Vitrine de projetos: a seção fica presa na tela e cada projeto entra com a rolagem */
export default function useVitrine(ref) {
  useEffect(() => {
    const vt = ref.current
    if (!vt) return
    const stage = vt.querySelector('.vt-stage')
    const dots = vt.querySelectorAll('.vt-dot')
    const cur = vt.querySelector('.vt-cur')
    const n = vt.querySelectorAll('.vt-slide').length

    const medir = () => {
      stage.style.height = window.innerHeight + 'px'
      vt.style.height = n * window.innerHeight + 'px'
    }
    const atualizar = () => {
      const topo = vt.getBoundingClientRect().top + window.pageYOffset
      const fim = topo + (vt.offsetHeight - window.innerHeight)
      let p = (window.pageYOffset - topo) / Math.max(fim - topo, 1)
      p = Math.min(1, Math.max(0, p))
      const q = p * (n - 1)
      vt.style.setProperty('--q', q.toFixed(4))
      const idx = Math.round(q)
      if (cur) cur.textContent = String(idx + 1).padStart(2, '0')
      dots.forEach((d, i) => d.classList.toggle('on', i === idx))
    }

    let ticking = false
    const onScroll = () => {
      if (!ticking) {
        ticking = true
        requestAnimationFrame(() => { ticking = false; atualizar() })
      }
    }
    const onResize = () => { medir(); atualizar() }

    medir()
    atualizar()
    window.addEventListener('scroll', onScroll, { passive: true })
    window.addEventListener('resize', onResize)
    return () => {
      window.removeEventListener('scroll', onScroll)
      window.removeEventListener('resize', onResize)
    }
  }, [ref])
}
