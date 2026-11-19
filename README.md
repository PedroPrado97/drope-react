# Drope Studio (React)

Site do Drope Studio convertido para React (Vite).

## Como rodar no computador
1. Instale o Node.js (versão 18 ou superior).
2. Dentro da pasta do projeto, rode:
   - `npm install`
   - `npm run dev` (abre o site em http://localhost:5173)
3. Para gerar a versão final: `npm run build` (a pasta `dist` é o site pronto).

## Estrutura
- `src/App.jsx`: ordem das seções na página.
- `src/components/`: uma seção por arquivo (Hero, Marcas, Projetos, Sobre, Processo, Servicos, Contato, Rodape, Dock).
- `src/hooks/`: comportamentos (vitrine de projetos, barra do processo, barra flutuante, cursor, revelação, rolagem suave).
- `src/context/Idioma.jsx`: idioma escolhido pelo visitante.
- `src/styles/global.css`: estilos do site.
- `public/media/`: imagens (logos, fotos, mockups).
- `public/*.html`: páginas dos cases (ainda estáticas).

## Pendências
- Traduções: só a capa está traduzida no React. As outras seções voltam a ficar em português até serem convertidas para o mesmo sistema de idiomas.
- Páginas dos cases: continuam como HTML estático na pasta `public`.
- Teste visual: confirmar vitrine, rolagem suave e cursor em navegador antes de publicar.

## Publicação
Suba esta pasta para um repositório no GitHub e importe no Vercel. O Vercel reconhece o projeto Vite e gera o site automaticamente.
