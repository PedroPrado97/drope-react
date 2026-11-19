export default function Servicos() {
  return (
    <section className={"sv"} id={"servicos"} aria-label={"Servi\u00e7os"}>
      <p className={"kicker reveal"}>
        <span>
          {"(05)"}
        </span>
        {" Servi\u00e7os"}
      </p>
      <ul className={"sv-list"}>
        <li className={"sv-row reveal"}>
          <span className={"sv-no"}>
            {"01"}
          </span>
          <h3 className={"sv-name"}>
            {"Estrat\u00e9gia de marca"}
          </h3>
          <p className={"sv-desc"}>
            {"Posicionamento, arquitetura e dire\u00e7\u00e3o de comunica\u00e7\u00e3o."}
          </p>
        </li>
        <li className={"sv-row reveal"}>
          <span className={"sv-no"}>
            {"02"}
          </span>
          <h3 className={"sv-name"}>
            {"Branding"}
          </h3>
          <p className={"sv-desc"}>
            {"Naming, narrativa e sistema de marca completo."}
          </p>
        </li>
        <li className={"sv-row reveal"}>
          <span className={"sv-no"}>
            {"03"}
          </span>
          <h3 className={"sv-name"}>
            {"Identidade visual"}
          </h3>
          <p className={"sv-desc"}>
            {"Logotipo, tipografia, cor, grafismos e aplica\u00e7\u00f5es."}
          </p>
        </li>
      </ul>
    </section>
  )
}
