import react from "@vitejs/plugin-react";
import { defineConfig } from "vite";
import semi from "vite-plugin-semi-theme";
import tsconfigPaths from "vite-tsconfig-paths";

export default defineConfig({
  plugins: [
    react(),
    tsconfigPaths(),
    semi({
      theme: "@semi-bot/semi-theme-universedesign",
    }),
  ],
});
