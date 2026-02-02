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
    plugins: [react()],
    resolve: {
      alias: {
        "@": path.resolve(__dirname, "./src"),
      },
    },
  };
});
