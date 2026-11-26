import { useEffect, useRef } from 'react'
import { SLIDES, CARROSSEL } from '../data/iphone.js'

/* iPhone 3D em Three.js (modelo procedural, sem imagens externas).
   FASE 01: entrada girando em Y, revelando a traseira, com pequenas variações em X e Z; desacelera e para.
   FASE 02: posição travada em três quartos; a transformação não muda mais.
   FASE 03: carrossel de publicações dentro da tela, independente do aparelho. */

const clamp = (v, a = 0, b = 1) => Math.min(b, Math.max(a, v))
const lerp = (a, b, t) => a + (b - a) * t
const easeOut = (t) => 1 - Math.pow(1 - t, 3)
const easeInOut = (t) => -(Math.cos(Math.PI * t) - 1) / 2
const DURACAO_INTRO = 4.6 // segundos

export default function IphoneShowcase() {
  const ref = useRef(null)

  useEffect(() => {
    const el = ref.current
    if (!el) return
    const reduzir = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    let vivo = true
    let raf = 0
    let renderer = null
    let visivel = false
    let ouvindo = []

    ;(async () => {
      const THREE = await import('three')
      const { RoomEnvironment } = await import('three/examples/jsm/environments/RoomEnvironment.js')
      if (!vivo) return

      /* ---------- cena ---------- */
      renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true })
      renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 2))
      renderer.outputColorSpace = THREE.SRGBColorSpace
      renderer.toneMapping = THREE.ACESFilmicToneMapping
      renderer.toneMappingExposure = 1.05
      el.appendChild(renderer.domElement)

      const scene = new THREE.Scene()
      const pmrem = new THREE.PMREMGenerator(renderer)
      scene.environment = pmrem.fromScene(new RoomEnvironment(), 0.04).texture

      const camera = new THREE.PerspectiveCamera(30, 1, 0.1, 200)
      camera.position.set(0, 0, 34)

      const luzChave = new THREE.DirectionalLight(0xffffff, 1.1)
      luzChave.position.set(7, 10, 12)
      scene.add(luzChave)
      const luzContra = new THREE.DirectionalLight(0xbfe9b0, 0.5)
      luzContra.position.set(-9, 4, -8)
      scene.add(luzContra)

      /* ---------- geometria do aparelho ---------- */
      const H = 15.2, W = H * (379 / 787), R = 0.7, D = 0.62, BV = 0.12
      const F = (D + 2 * BV) / 2 // z da face frontal
      const retangulo = (w, h, r) => {
        const s = new THREE.Shape()
        const x = -w / 2, y = -h / 2
        s.moveTo(x + r, y)
        s.lineTo(x + w - r, y); s.quadraticCurveTo(x + w, y, x + w, y + r)
        s.lineTo(x + w, y + h - r); s.quadraticCurveTo(x + w, y + h, x + w - r, y + h)
        s.lineTo(x + r, y + h); s.quadraticCurveTo(x, y + h, x, y + h - r)
        s.lineTo(x, y + r); s.quadraticCurveTo(x, y, x + r, y)
        return s
      }

      const phone = new THREE.Group()
      scene.add(phone)

      const corpoGeo = new THREE.ExtrudeGeometry(retangulo(W, H, R), {
        depth: D, bevelEnabled: true, bevelThickness: BV, bevelSize: BV, bevelSegments: 8, curveSegments: 28,
      })
      corpoGeo.center()
      /* projeção planar da foto de costas: u/v calculados a partir de x/y, só na metade traseira */
      corpoGeo.computeBoundingBox()
      const bb = corpoGeo.boundingBox
      const Lx = bb.max.x - bb.min.x, Ly = bb.max.y - bb.min.y
      const pos = corpoGeo.attributes.position
      const uvs = corpoGeo.attributes.uv
      for (let i = 0; i < pos.count; i++) {
        const x = pos.getX(i), y = pos.getY(i), z = pos.getZ(i)
        if (z < 0) uvs.setXY(i, (bb.max.x - x) / Lx, (y - bb.min.y) / Ly)
        else uvs.setXY(i, 0.5, 0.65)
      }
      uvs.needsUpdate = true
      const titanio = new THREE.MeshPhysicalMaterial({ color: 0x2b2d30, metalness: 1, roughness: 0.3, clearcoat: 0.6, clearcoatRoughness: 0.2 })
      const fotoCostas = new THREE.TextureLoader().load('/media/iphone/costas.webp', (t) => {
        t.colorSpace = THREE.SRGBColorSpace
        t.anisotropy = renderer.capabilities.getMaxAnisotropy()
        capMat.map = t
        capMat.needsUpdate = true
      })
      const capMat = new THREE.MeshPhysicalMaterial({ color: 0xffffff, metalness: 0.35, roughness: 0.42, clearcoat: 0.5, clearcoatRoughness: 0.25 })
      /* grupo 0 = faces (frente e costas), grupo 1 = laterais */
      phone.add(new THREE.Mesh(corpoGeo, [capMat, titanio]))

      const preto = new THREE.MeshStandardMaterial({ color: 0x050505, roughness: 0.5, metalness: 0.2 })
      const vidro = new THREE.MeshPhysicalMaterial({ color: 0x0a0a0a, roughness: 0.05, metalness: 0, clearcoat: 1 })

      /* dynamic island */
      const ilhaGeo = new THREE.ShapeGeometry(retangulo(2.1, 0.58, 0.29), 12)
      const ilha = new THREE.Mesh(ilhaGeo, preto)
      ilha.position.set(0, H / 2 - 0.62, F + 0.012)
      phone.add(ilha)

      /* botões laterais */
      const botaoGeo = new THREE.BoxGeometry(0.12, 0.9, 0.22)
      ;[[-1, 3.2], [-1, 2.0], [-1, 0.8], [1, 2.6]].forEach(([lado, y]) => {
        const b = new THREE.Mesh(botaoGeo, titanio)
        b.position.set(lado * (W / 2 + BV + 0.04), y, 0)
        phone.add(b)
      })

      /* ---------- tela com carrossel ---------- */
      const TW = 720, TH = 1480
      const canvas = document.createElement('canvas')
      canvas.width = TW; canvas.height = TH
      const ctx = canvas.getContext('2d')
      const tela = new THREE.CanvasTexture(canvas)
      tela.colorSpace = THREE.SRGBColorSpace
      const sw = W - 0.16, sh = H - 0.16
      const telaGeo = new THREE.ShapeGeometry(retangulo(sw, sh, R - 0.08), 24)
      const telaPos = telaGeo.attributes.position
      const telaUv = telaGeo.attributes.uv
      for (let i = 0; i < telaPos.count; i++) telaUv.setXY(i, (telaPos.getX(i) + sw / 2) / sw, (telaPos.getY(i) + sh / 2) / sh)
      const telaMat = new THREE.MeshBasicMaterial({ map: tela, toneMapped: false })
      const telaMesh = new THREE.Mesh(telaGeo, telaMat)
      telaMesh.position.z = F + 0.004
      phone.add(telaMesh)

      const imagens = SLIDES.map((s) => {
        const img = new Image()
        img.src = s.src
        return img
      })
      const desenharCover = (img, dx, alfa) => {
        if (!img.complete || !img.naturalWidth) return
        const esc = Math.max(TW / img.naturalWidth, TH / img.naturalHeight)
        const w = img.naturalWidth * esc, h = img.naturalHeight * esc
        ctx.globalAlpha = alfa
        ctx.drawImage(img, (TW - w) / 2 + dx, h > TH ? 0 : (TH - h) / 2, w, h)
        ctx.globalAlpha = 1
      }
      let idx = 0, prox = 1 % Math.max(1, SLIDES.length), k = 0, ultimaTroca = performance.now(), emTransicao = false, inicioTransicao = 0
      const desenharTela = () => {
        ctx.save()
        ctx.beginPath()
        const r = 44
        ctx.moveTo(r, 0); ctx.arcTo(TW, 0, TW, TH, r); ctx.arcTo(TW, TH, 0, TH, r)
        ctx.arcTo(0, TH, 0, 0, r); ctx.arcTo(0, 0, TW, 0, r); ctx.closePath()
        ctx.clip()
        ctx.fillStyle = '#060606'
        ctx.fillRect(0, 0, TW, TH)
        if (SLIDES.length) {
          if (emTransicao) {
            desenharCover(imagens[idx], -k * 70, 1 - k)
            desenharCover(imagens[prox], (1 - k) * 70, k)
          } else {
            desenharCover(imagens[idx], 0, 1)
          }
        }
        ctx.restore()
        tela.needsUpdate = true
      }
      imagens.forEach((img) => img.addEventListener('load', () => { if (!emTransicao) desenharTela() }))
      desenharTela()

      /* ---------- redimensionar ---------- */
      const ajustar = () => {
        const w = el.clientWidth || 1, h = el.clientHeight || 1
        renderer.setSize(w, h, false)
        camera.aspect = w / h
        camera.updateProjectionMatrix()
      }
      ajustar()
      window.addEventListener('resize', ajustar)
      ouvindo.push(() => window.removeEventListener('resize', ajustar))

      /* ---------- animação ---------- */
      const aplicarPose = (rx, ry, rz, z, s) => {
        phone.rotation.set(rx, ry, rz)
        phone.position.z = z
        phone.scale.setScalar(s)
      }
      const posFinal = { rx: 0.06, ry: 0.62, rz: 0, z: 0, s: 1 }
      let inicio = 0
      let introFeita = reduzir
      if (reduzir) aplicarPose(posFinal.rx, posFinal.ry, posFinal.rz, posFinal.z, posFinal.s)
      else aplicarPose(-0.25, -1.1, 0, -6, 0.82)

      const iniciarIntro = () => { inicio = performance.now() }

      const quadro = (agora) => {
        if (!vivo) return
        raf = requestAnimationFrame(quadro)
        if (!introFeita) {
          if (!inicio && visivel) iniciarIntro()
          if (!inicio) { renderer.render(scene, camera); return }
          const t = clamp((agora - inicio) / 1000 / DURACAO_INTRO)
          const e = easeInOut(t)
          const eo = easeOut(t)
          const amortece = 1 - t
          const rx = lerp(-0.25, posFinal.rx, eo) + 0.07 * Math.sin(t * Math.PI * 2) * amortece
          const ry = lerp(-1.1, 2 * Math.PI + posFinal.ry, e)
          const rz = 0.03 * Math.sin(t * Math.PI * 3) * amortece
          aplicarPose(rx, ry, rz, lerp(-6, 0, eo), lerp(0.82, 1, eo))
          if (t >= 1) { aplicarPose(posFinal.rx, posFinal.ry, posFinal.rz, 0, 1); introFeita = true; ultimaTroca = agora }
        }

        /* carrossel: só roda quando a seção está visível e a aba ativa */
        if (!reduzir && introFeita && visivel && SLIDES.length > 1 && !document.hidden) {
          if (!emTransicao && agora - ultimaTroca > CARROSSEL.intervalo) {
            emTransicao = true
            inicioTransicao = agora
            prox = (idx + 1) % SLIDES.length
          }
          if (emTransicao) {
            k = easeInOut(clamp((agora - inicioTransicao) / CARROSSEL.transicao))
            desenharTela()
            if (k >= 1) {
              idx = prox; k = 0; emTransicao = false; ultimaTroca = agora
              desenharTela()
            }
          }
        }
        renderer.render(scene, camera)
      }

      const observador = new IntersectionObserver(([e]) => {
        const entrou = e.isIntersecting
        /* ao voltar para a seção, a animação de entrada começa de novo */
        if (entrou && !visivel && !reduzir && introFeita) {
          introFeita = false
          inicio = 0
          aplicarPose(-0.25, -1.1, 0, -6, 0.82)
        }
        visivel = entrou
        if (visivel && !introFeita && !inicio) iniciarIntro()
      }, { threshold: 0.25 })
      observador.observe(el)
      ouvindo.push(() => observador.disconnect())

      raf = requestAnimationFrame(quadro)
      ouvindo.push(() => {
        scene.traverse((o) => {
          if (o.geometry) o.geometry.dispose()
          if (o.material) (Array.isArray(o.material) ? o.material : [o.material]).forEach((m) => m.dispose())
        })
        tela.dispose()
        pmrem.dispose()
        renderer.dispose()
        if (renderer.domElement.parentNode) renderer.domElement.parentNode.removeChild(renderer.domElement)
      })
    })()

    return () => {
      vivo = false
      cancelAnimationFrame(raf)
      ouvindo.forEach((f) => f())
    }
  }, [])

  return (
    <section className="ip-sec" id="iphone" aria-label="Publicações em destaque">
      <div className="ip" ref={ref} />
    </section>
  )
}
