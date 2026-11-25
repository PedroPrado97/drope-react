import { useIdioma } from '../context/Idioma.jsx'
import IphoneShowcase from './IphoneShowcase.jsx'
export default function Sobre() {
  const { t } = useIdioma()
  return (
    <section className={"sb"} id={"sobre"} aria-label={"Sobre o Drope"}>
      <div className={"sb-left"}>
        <IphoneShowcase />
      </div>
      <div className={"sb-right"}>
        <h2 className={"sb-title"}>
          {t("Sobre o")}
          {" Drope"}
        </h2>
        <p className={"sb-lead reveal"}>
          {t("Sou designer especialista em criação e posicionamento de marcas para pessoas e empresas e acredito que uma marca forte vai além da aparência: ela precisa saber o que representa, o que comunica e como deseja ser percebida. Por isso, investigo antes de desenhar, buscando entender sua essência e encontrar aquilo que a torna única.")}
        </p>
        <p className={"sb-body reveal"}>
          {t("Minha missão é transformar essa essência em uma identidade que expresse sua personalidade, fortaleça seu posicionamento e destaque sua marca. Não trabalho com fórmulas prontas, mas com ideias, escolhas e soluções próprias para cada projeto. Afinal, uma boa marca não precisa apenas ser vista, ela precisa ter algo mais pra dizer.")}
        </p>
        <p className={"sb-traits reveal"} aria-label={"Personalidade"}>
          <span>
            {t("curiosa")}
          </span>
          <span>
            {t("provocadora")}
          </span>
          <span>
            {t("autoral")}
          </span>
          <span>
            {t("experimental")}
          </span>
          <span>
            {t("humana")}
          </span>
          <span>
            {t("observadora")}
          </span>
        </p>
      </div>
    </section>
  )
}
