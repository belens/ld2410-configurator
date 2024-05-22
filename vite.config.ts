import { sveltekit } from "@sveltejs/kit/vite";
import { defineConfig } from "vite";
import mkcert from 'vite-plugin-mkcert';

export default defineConfig({
  plugins: [sveltekit(), mkcert()],
  server: {
    port: 80,
    host: true,
    https: true,
  },
});
