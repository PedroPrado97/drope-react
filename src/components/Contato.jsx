export default function Contato() {
  return (
    <section className={"cto"} id={"contato"} aria-label={"Contato"}>
      <p className={"kicker reveal"}>
        <span>
          {"(06)"}
        </span>
        {" Contato"}
      </p>
      <h2 className={"cto-title reveal"}>
        {"Vamos construir algo"}
        <br />
        <span className={"g"}>
          {"diferente."}
        </span>
      </h2>
      <p className={"cto-sub reveal"}>
        {"Conte o que voc\u00ea quer provocar com a sua marca."}
      </p>
      <nav className={"cto-links reveal"} aria-label={"Canais de contato"}>
        <a href={"mailto:pedropradodesigner@gmail.com"}>
          {"pedropradodesigner@gmail.com"}
        </a>
        <a href={"https://api.whatsapp.com/send/?phone=5577999709584&text&type=phone_number&app_absent=0"} target={"_blank"} rel={"noopener"}>
          {"WhatsApp"}
        </a>
        <a href={"https://www.instagram.com/drope.studio_/"} target={"_blank"} rel={"noopener"}>
          {"Instagram"}
        </a>
        <a href={"https://www.behance.net/dropestudio_"} target={"_blank"} rel={"noopener"}>
          {"Behance"}
        </a>
      </nav>
    </section>
  )
}
