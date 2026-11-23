import { useEffect, useRef } from 'react'

/* Tecido em movimento: a própria imagem do tecido é deformada por ondas lentas em WebGL,
   sem vídeo e sem bibliotecas. Pausa fora da tela e respeita movimento reduzido. */
const VS = `
attribute vec2 p;
varying vec2 vUv;
void main(){
  vUv = vec2(p.x * 0.5 + 0.5, 0.5 - p.y * 0.5);
  gl_Position = vec4(p, 0.0, 1.0);
}`

const FS = `
precision mediump float;
varying vec2 vUv;
uniform sampler2D tex;
uniform float t;
uniform vec2 res;
uniform vec2 imgRes;
void main(){
  float ra = res.x / res.y;
  float ia = imgRes.x / imgRes.y;
  vec2 s = ra > ia ? vec2(1.0, ia / ra) : vec2(ra / ia, 1.0);
  vec2 uv = (vUv - 0.5) * s + 0.5;
  float w1 = sin(uv.y * 5.0 + t * 0.9 + sin(uv.x * 3.0 - t * 0.5) * 1.2);
  float w2 = cos(uv.x * 4.0 - t * 0.7 + cos(uv.y * 2.5 + t * 0.4) * 1.1);
  vec2 off = vec2(w2 * 0.012, w1 * 0.018);
  vec3 c = texture2D(tex, uv + off).rgb;
  float luz = sin(uv.x * 2.2 - t * 0.8 + uv.y * 1.6);
  float shade = 1.0 + 0.045 * (w1 * 0.6 + w2 * 0.4) + 0.025 * luz;
  gl_FragColor = vec4(c * shade, 1.0);
}`

export default function Tecido() {
  const ref = useRef(null)

  useEffect(() => {
    const canvas = ref.current
    if (!canvas) return
    const gl = canvas.getContext('webgl', { antialias: false, alpha: false })
    if (!gl) return
    const reduzir = window.matchMedia('(prefers-reduced-motion: reduce)').matches

    const compilar = (tipo, src) => {
      const sh = gl.createShader(tipo)
      gl.shaderSource(sh, src)
      gl.compileShader(sh)
      return sh
    }
    const prog = gl.createProgram()
    gl.attachShader(prog, compilar(gl.VERTEX_SHADER, VS))
    gl.attachShader(prog, compilar(gl.FRAGMENT_SHADER, FS))
    gl.linkProgram(prog)
    gl.useProgram(prog)

    const buf = gl.createBuffer()
    gl.bindBuffer(gl.ARRAY_BUFFER, buf)
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([-1, -1, 1, -1, -1, 1, 1, 1]), gl.STATIC_DRAW)
    const loc = gl.getAttribLocation(prog, 'p')
    gl.enableVertexAttribArray(loc)
    gl.vertexAttribPointer(loc, 2, gl.FLOAT, false, 0, 0)

    const uT = gl.getUniformLocation(prog, 't')
    const uRes = gl.getUniformLocation(prog, 'res')
    const uImg = gl.getUniformLocation(prog, 'imgRes')
    gl.uniform1i(gl.getUniformLocation(prog, 'tex'), 0)

    let imgW = 1600
    let imgH = 1131
    let pronto = false
    const tex = gl.createTexture()
    gl.bindTexture(gl.TEXTURE_2D, tex)
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE)
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE)
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR)
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR)

    const img = new Image()
    img.onload = () => {
      imgW = img.naturalWidth
      imgH = img.naturalHeight
      gl.bindTexture(gl.TEXTURE_2D, tex)
      gl.pixelStorei(gl.UNPACK_FLIP_Y_WEBGL, false)
      gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGB, gl.RGB, gl.UNSIGNED_BYTE, img)
      pronto = true
      desenhar(0)
    }
    img.src = '/media/processo/tecido.webp'

    const ajustar = () => {
      const dpr = Math.min(window.devicePixelRatio || 1, 1.5)
      const w = canvas.clientWidth || window.innerWidth
      const h = canvas.clientHeight || window.innerHeight
      canvas.width = Math.round(w * dpr)
      canvas.height = Math.round(h * dpr)
      gl.viewport(0, 0, canvas.width, canvas.height)
      if (!ativo || reduzir) desenhar(tempo)
    }

    let tempo = 0
    let rafId = null
    let ativo = true

    const desenhar = (tm) => {
      if (!pronto) return
      gl.uniform1f(uT, tm)
      gl.uniform2f(uRes, canvas.width, canvas.height)
      gl.uniform2f(uImg, imgW, imgH)
      gl.drawArrays(gl.TRIANGLE_STRIP, 0, 4)
    }

    let ultimo = performance.now()
    const quadro = (agora) => {
      tempo += ((agora - ultimo) / 1000) * 0.6
      ultimo = agora
      desenhar(tempo)
      rafId = requestAnimationFrame(quadro)
    }

    const visivel = new IntersectionObserver(([e]) => {
      ativo = e.isIntersecting
      if (reduzir) return
      if (ativo && rafId === null) { ultimo = performance.now(); rafId = requestAnimationFrame(quadro) }
      if (!ativo && rafId !== null) { cancelAnimationFrame(rafId); rafId = null }
    })
    visivel.observe(canvas)

    ajustar()
    window.addEventListener('resize', ajustar)
    if (!reduzir) rafId = requestAnimationFrame(quadro)

    return () => {
      window.removeEventListener('resize', ajustar)
      visivel.disconnect()
      if (rafId !== null) cancelAnimationFrame(rafId)
    }
  }, [])

  return <canvas ref={ref} className="tec" aria-hidden="true" />
}
