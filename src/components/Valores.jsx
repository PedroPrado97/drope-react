import { useEffect, useRef, useState } from 'react'
import { useIdioma } from '../context/Idioma.jsx'

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
const lerp = (a, b, t) => a + (b - a) * t

export default function Valores() {
  const { t } = useIdioma()
  const ref = useRef(null)
  const [p, setP] = useState(0)

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

  /* Linha do tempo:
     · início: pilha de quadros deitada em perspectiva isométrica (como na referência), base verde translúcida embaixo;
     · 0 a 0,22: a pilha se levanta e os quadros ficam em pé;
     · depois, cada valor ocupa um terço da rolagem: seu quadro vem para a frente, o ícone 3D aparece nele,
       o ícone some e o título e o texto aparecem centralizados. */
  const stand = clamp(p / 0.22)
  const lie = 1 - stand
  const seg = Math.min(VALORES.length - 1, Math.floor(clamp((p - 0.22) / 0.78) * VALORES.length))
  const t0 = clamp(((p - 0.22) / 0.78) * VALORES.length - seg)
  const iconeVisivel = 1 - clamp((t0 - 0.35) / 0.2)
  const textoVisivel = clamp((t0 - 0.5) / 0.2) * (1 - clamp((t0 - 0.9) / 0.1))
  const v = VALORES[seg]

  const stackStyle = {
    transform: `translate(-50%, -50%) rotateX(${lerp(62, 0, stand)}deg) rotateZ(${lerp(-45, 0, stand)}deg)`,
  }

  return (
    <section className="val" id="valores" ref={ref} aria-label="Valores">
      <div className="val-stage" style={{ background: v.fundo, color: v.texto }}>
        <header className="val-top">
          <h2 className="val-titulo-sec">{t('Nossos valores')}</h2>
        </header>

        <div className="val-cena" aria-hidden="true">
          <div className="val-stack" style={stackStyle}>
            {/* base verde translúcida (embaixo da pilha quando deitada) */}
            <div className="val-base" style={{ opacity: lie, transform: `translateZ(0px)` }} />
            {VALORES.map((vi, i) => {
              const ativo = seg === i
              const z = i * 70 * lie + (ativo ? 0 : -160) * stand
              return (
                <div
                  key={vi.n}
                  className={'val-quadro' + (ativo ? ' on' : '')}
                  style={{
                    transform: `translateZ(${z.toFixed(1)}px)`,
                    opacity: stand > 0.5 && !ativo ? 0.28 : 1,
                  }}
                >
                  <span className="val-quadro-n" style={{ opacity: lie + (1 - lie) * (ativo ? 1 : 0) }}>
                    {t(vi.titulo)}
                  </span>
                  <img
                    className="val-icone"
                    src={vi.img}
                    alt=""
                    style={{ opacity: lie > 0.02 ? 1 : (ativo ? iconeVisivel : 0) }}
                  />
                </div>
              )
            })}
          </div>
        </div>

        <div className="val-texto" style={{ opacity: textoVisivel }}>
          {v.linhas.map((l) => <p key={l}>{t(l)}</p>)}
          <p className="val-marca">{t(v.marca)}</p>
        </div>
      </div>
    </section>
  )
}
