export default function Rodape() {
  return (
    <footer className={"ct-foot"}>
      <div className={"row"}>
        <img src={"/media/8e2c28ac38ae.png"} alt={"Drope Studio"} />
        <span data-i18n={"footer-copy"}>
          {"\u00a9 2026 Drope Studio. Todos os direitos reservados."}
        </span>
        <span className={"r"}>
          <a href={"https://www.instagram.com/drope.studio_/"} target={"_blank"} rel={"noopener"}>
            {"Instagram"}
          </a>
          {" \u00b7 "}
          <a href={"https://www.behance.net/dropestudio_"} target={"_blank"} rel={"noopener"}>
            {"Behance"}
          </a>
        </span>
      </div>
    </footer>
  )
}
