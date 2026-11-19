# Drope Studio (React + Vite)

Site do Drope Studio convertido para React (Vite). O projeto mantém as seções, componentes, hooks, estilos, mídias e páginas estáticas dos cases.

## Requisitos
- Node.js 18 ou superior
- npm

## Rodar localmente
```bash
npm install
npm run dev
```

## Gerar build de produção
```bash
npm run build
npm run preview
```

A saída de produção é gerada na pasta `dist/`.

## Estrutura
- `index.html`: documento HTML de entrada; carrega `/src/main.jsx`.
- `src/main.jsx`: inicialização do React.
- `src/App.jsx`: composição das seções da página.
- `src/components/`: seções e componentes visuais.
- `src/hooks/`: comportamentos de interação, rolagem e animações.
- `src/context/Idioma.jsx`: estado do idioma selecionado.
- `src/styles/global.css`: estilos globais.
- `public/media/` e `public/images/`: imagens e recursos públicos.
- `public/*.html`: páginas estáticas dos projetos/cases.
- `vercel.json`: configuração explícita de build e diretório de saída na Vercel.

## Publicar na Vercel
1. Importe o repositório no Vercel.
2. Em **Settings → Build and Deployment**, deixe **Root Directory** como `.` (raiz do repositório; não selecione `src`).
3. Build Command: `npm run build`.
4. Output Directory: `dist`.
5. Install Command: `npm install`.
6. Faça um novo deploy usando o commit que contém `src/main.jsx`, `src/App.jsx` e `vercel.json`.

> Importante: o erro `Rollup failed to resolve import "/src/main.jsx" from "/vercel/path0/index.html"` ocorre quando o arquivo não está presente no commit implantado ou quando o diretório raiz configurado no Vercel não corresponde à raiz deste projeto. Nesta versão, `index.html` aponta para `src/main.jsx`, e esse arquivo está incluído no projeto.

## Observações
As traduções completas de todas as seções e o teste visual em navegadores reais permanecem como melhorias futuras; não foram alterados nesta correção para preservar o comportamento e o conteúdo existentes.
