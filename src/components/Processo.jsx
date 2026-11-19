import { useRef } from 'react'
import useProcesso from '../hooks/useProcesso.js'
export default function Processo() {
  const ref = useRef(null)
  useProcesso(ref)
  return (
    <section ref={ref} className={"pr"} id={"processo"} aria-label={"Processo"}>
      <header className={"pr-head reveal"}>
        <p className={"kicker"}>
          <span>
            {"(04)"}
          </span>
          {" Processo"}
        </p>
        <h2 className={"pr-title"}>
          {"Do questionamento"}
          <br />
          {"ao tra\u00e7o."}
        </h2>
      </header>
      <ol className={"pr-steps"}>
        <li className={"pr-step reveal"}>
          <span className={"pr-n"}>
            {"01"}
          </span>
          <span className={"pr-verb"}>
            {"Perguntar"}
          </span>
          <p>
            {"Come\u00e7amos pelas perguntas que o neg\u00f3cio ainda n\u00e3o sabe responder sozinho."}
          </p>
        </li>
        <li className={"pr-step reveal"}>
          <span className={"pr-n"}>
            {"02"}
          </span>
          <span className={"pr-verb"}>
            {"Entender"}
          </span>
          <p>
            {"Mergulhamos no contexto, nas pessoas e no que j\u00e1 existe no mercado."}
          </p>
        </li>
        <li className={"pr-step reveal"}>
          <span className={"pr-n"}>
            {"03"}
          </span>
          <span className={"pr-verb"}>
            {"Organizar"}
          </span>
          <p>
            {"Transformamos o que aprendemos em posicionamento, tom e dire\u00e7\u00e3o."}
          </p>
        </li>
        <li className={"pr-step reveal"}>
          <span className={"pr-n"}>
            {"04"}
          </span>
          <span className={"pr-verb"}>
            {"Encontrar"}
          </span>
          <p>
            {"Achamos o ponto onde a marca se diferencia de verdade."}
          </p>
        </li>
        <li className={"pr-step reveal"}>
          <span className={"pr-n"}>
            {"05"}
          </span>
          <span className={"pr-verb"}>
            {"Traduzir"}
          </span>
          <p>
            {"Levamos esse pensamento para forma: identidade, linguagem e aplica\u00e7\u00f5es."}
          </p>
        </li>
      </ol>
      <div className={"pr-track"} aria-hidden={"true"}>
        <span className={"pr-bar"}></span>
      </div>
    </section>
  )
}
