import esbuild from 'esbuild';
import fs from 'fs';
import path from 'path';
import process from 'process';


const reactCompatPlugin = {
  name: "react-compat",
  setup(build) {
    const react = path.join(process.cwd(), "node_modules", "react", "cjs", "react.development.js");
    const reactDom = path.join(process.cwd(), "node_modules", "react-dom", "cjs", "react-dom.development.js");
    const nanoid = path.join(process.cwd(), "node_modules", "nanoid", "index.browser.js");

    build.onResolve({ filter: /^(react)$/ }, args => {
      return { path: react };
    });
    build.onResolve({ filter: /^(react-dom)$/ }, args => {
      return { path: reactDom };
    });
    build.onResolve({ filter: /^(nanoid)$/ }, args => {
      return { path: nanoid };
    });
  }
}
esbuild.build({
  entryPoints: ['src/index.tsx'],
  outfile: 'dist/bundle.js',
  bundle: true,
  minify: false,
  sourcemap: true,
  treeShaking: true,
  target: ['chrome58'],
  plugins: [reactCompatPlugin],

  watch: process.argv.includes('--watch') ? {
    onRebuild(error, result) {
      fs.writeFileSync(
        path.join(process.cwd(), './dist/index.html'),
        `<!DOCTYPE html>
<html>
  <head>
    <meta charset='utf-8' />
    <meta name='viewport' content='width=device-width, initial-scale=1' />
    <title>Vault viewer</title>
  </head>
  <body>
    <div id='root'></div>
    <script src='/bundle.js' type='application/javascript'></script>
  </body>
</html>
    `,
      );
    },

  } : undefined,
})
  .catch(() => process.exit(1));
