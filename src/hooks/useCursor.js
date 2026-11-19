import { useEffect } from 'react'

/* Cursor com halo de luz que segue o mouse (só em computador) */
export default function useCursor() {
  useEffect(() => {
    if (window.matchMedia && window.matchMedia('(hover: none), (pointer: coarse)').matches) return
    const glow = document.createElement('div')
    glow.className = 'cur-glow'
    const ring = document.createElement('div')
    ring.className = 'cur-ring'
    document.body.append(glow, ring)

    let mx = 0, my = 0, gx = 0, gy = 0, rx = 0, ry = 0, ativo = false, frame
    const onMove = (e) => {
      mx = e.clientX; my = e.clientY
      if (!ativo) {
        ativo = true
        gx = rx = mx; gy = ry = my
        document.body.classList.add('cur-on')
      }
    }
    const onLeave = () => { document.body.classList.remove('cur-on'); ativo = false }
    const onOver = (e) => {
      const alvo = e.target.closest && e.target.closest('a, button, .project')
      ring.classList.toggle('hov', !!alvo)
    }
    const reduzir = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches
    const loop = () => {
      rx += (mx - rx) * (reduzir ? 1 : 0.35); ry += (my - ry) * (reduzir ? 1 : 0.35)
      gx += (mx - gx) * (reduzir ? 1 : 0.12); gy += (my - gy) * (reduzir ? 1 : 0.12)
      ring.style.transform = `translate3d(${rx}px,${ry}px,0)`
      glow.style.transform = `translate3d(${gx}px,${gy}px,0)`
      frame = requestAnimationFrame(loop)
    }
    document.addEventListener('mousemove', onMove)
    document.addEventListener('mouseleave', onLeave)
    document.addEventListener('mouseover', onOver)
    frame = requestAnimationFrame(loop)
    return () => {
      cancelAnimationFrame(frame)
      document.removeEventListener('mousemove', onMove)
      document.removeEventListener('mouseleave', onLeave)
      document.removeEventListener('mouseover', onOver)
      glow.remove(); ring.remove()
    }
  }, [])
}
