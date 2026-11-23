import { useIdioma } from '../context/Idioma.jsx'
import { MARCAS } from '../data/marcas.js'

/* Um item da faixa: ícone em azulejo e o nome da marca abaixo */
function MarcaItem({ nome, src }) {
  return (
    <div className="mq-item">
      <div className="mq-tile mq-logo" role="img" aria-label={nome}>
        <img src={src} alt="" loading="lazy" />
      </div>
      <span className="mq-nome">{nome}</span>
    </div>
  )
}

export default function Marcas() {
  const { t } = useIdioma()
  /* a lista é repetida para o loop contínuo da faixa */
  const faixa = [...MARCAS, ...MARCAS]

  return (
    <section className="marcas" aria-label="Marcas que ajudamos a tornar únicas">
      <p data-i18n="marcas-t" className="marcas-titulo">
        {t('Marcas que ajudamos a tornar únicas.')}
      </p>
      <div className="mq" aria-hidden="false">
        <div className="mq-track">
          {faixa.map((m, i) => (
            <MarcaItem key={`${i}-${m.nome}`} nome={m.nome} src={m.src} />
          ))}
        </div>
      </div>
    </section>
  )
}
