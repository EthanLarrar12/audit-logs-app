import { defineConfig, loadEnv } from "vite";
import react from "@vitejs/plugin-react";
import path from "path";

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), '');
  const proxyTarget = env.PROXY_TARGET;

  return {
    server: {
      host: "::",
      port: 8000,
      cors: true,
      proxy: {
        '/audit': {
          target: proxyTarget,
          changeOrigin: true,
        },
        '/graphql': {
          target: proxyTarget,
          changeOrigin: true,
        },
        '/graphiql': {
          target: proxyTarget,
          changeOrigin: true,
        },
      },
    },
    build: {
      cssCodeSplit: false,
      rollupOptions: {
        input: {
          main: path.resolve(__dirname, 'index.html'),
          webComponent: path.resolve(__dirname, 'src/web-component.tsx'),
        },
        output: {
          entryFileNames: "assets/[name].js",
          assetFileNames: (assetInfo) => {
            if (assetInfo.name && assetInfo.name.endsWith('.css')) {
              return 'assets/webComponent.css';
            }
            return 'assets/[name].[ext]';
          },
        }
      }
    },
    plugins: [react()],
    resolve: {
      alias: {
        "@": path.resolve(__dirname, "./src"),
      },
    },
  };
});
