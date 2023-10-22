import devtools from "solid-devtools/vite";
import vercel from "solid-start-vercel";
import solid from "solid-start/vite";
import UnoCSS from "unocss/vite";
import Icons from "unplugin-icons/vite";
import { defineConfig } from "vite";
import solidStyled from "vite-plugin-solid-styled";

export default defineConfig(() => {
  return {
    plugins: [
      devtools({
        autoname: true,
        locator: {
          targetIDE: "vscode",
        },
      }),
      solid({
        adapter: vercel(),
      }),
      Icons({ compiler: "solid" }),
      UnoCSS(),
      solidStyled({
        prefix: "ss",
        filter: {
          include: "src/**/*.{ts,js,tsx,jsx}",
          exclude: "node_modules/**/*.{ts,js,tsx,jsx}",
        },
      }),
      {
        name: "cross-origin-isolation",
        configureServer: (server) => {
          server.middlewares.use((_, response, next) => {
            response.setHeader("Cross-Origin-Opener-Policy", "same-origin");
            response.setHeader("Cross-Origin-Embedder-Policy", "require-corp");
            next();
          });
        },
        configurePreviewServer: (server) => {
          server.middlewares.use((_, response, next) => {
            response.setHeader("Cross-Origin-Opener-Policy", "same-origin");
            response.setHeader("Cross-Origin-Embedder-Policy", "require-corp");
            next();
          });
        },
      },
    ],
    ssr: {
      external: ["@prisma/client"],
      noExternal: ["@kobalte/core", "crypto", "@internationalized/message"],
    },
    optimizeDeps: {
      include: ["solid-devtools/setup"],
    },
    server: {
      headers: {
        "Cross-Origin-Opener-Policy": "same-origin",
        "Cross-Origin-Embedder-Policy": "require-corp",
      },
    },
  };
});
