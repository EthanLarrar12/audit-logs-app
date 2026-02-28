import { defineConfig, loadEnv } from "vite";
import react from "@vitejs/plugin-react";
import path from "path";

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), "");
  const proxyTarget = env.PROXY_TARGET;

  return {
    base: "/audit/",
    server: {
      host: "::",
      port: 8000,
      cors: true,
      proxy: {
        "^/audit/(events|premade-profiles|suggest|events/.*)": {
          target: proxyTarget,
          changeOrigin: true,
        },
        "/graphql": {
          target: proxyTarget,
          changeOrigin: true,
        },
        "/graphiql": {
          target: proxyTarget,
          changeOrigin: true,
        },
      },
    },
    build: {
      rollupOptions: {
        input: {
          main: path.resolve(__dirname, "index.html"),
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
