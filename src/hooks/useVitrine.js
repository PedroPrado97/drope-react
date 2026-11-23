import { useEffect } from 'react'

const MOBILE = '(max-width: 900px)'

/* Vitrine de projetos.
   Desktop: a seção fica presa na tela e os projetos deslizam da direita para a esquerda,
   com movimento suave (interpolado a cada quadro).
   Mobile: cada projeto vira um quadro horizontal, um abaixo do outro, sem deslizar. */
export default function useVitrine(ref) {
  useEffect(() => {
    const vt = ref.current
    if (!vt) return
    const stage = vt.querySelector('.vt-stage')
    const dots = vt.querySelectorAll('.vt-dot')
    const cur = vt.querySelector('.vt-cur')
    const n = vt.querySelectorAll('.vt-slide').length
    const isMobile = () => window.matchMedia(MOBILE).matches

    let alvo = 0, atual = 0, rodando = false

    const desenhar = () => {
      vt.style.setProperty('--q', atual.toFixed(4))
      const idx = Math.round(atual)
      if (cur) cur.textContent = String(idx + 1).padStart(2, '0')
      dots.forEach((d, i) => d.classList.toggle('on', i === idx))
    }
    const passo = () => {
      const dif = alvo - atual
      if (Math.abs(dif) < 0.0004) {
        atual = alvo
        desenhar()
        rodando = false
        return
      }
      atual += dif * 0.06   /* quanto menor, mais suave e lento */
      desenhar()
      requestAnimationFrame(passo)
    }
    const animar = () => {
      if (!rodando) {
        rodando = true
        requestAnimationFrame(passo)
      }
    }
    const medir = () => {
      if (isMobile()) {
        stage.style.height = ''
        vt.style.height = ''
        return
      }
      stage.style.height = window.innerHeight + 'px'
      vt.style.height = n * window.innerHeight + 'px'
    }
    const atualizar = () => {
      if (isMobile()) return
      const topo = vt.getBoundingClientRect().top + window.pageYOffset
      const fim = topo + (vt.offsetHeight - window.innerHeight)
      let p = (window.pageYOffset - topo) / Math.max(fim - topo, 1)
      p = Math.min(1, Math.max(0, p))
      alvo = p * (n - 1)
      animar()
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
