import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), tailwindcss()],
  base: "/",
  build: {
    chunkSizeWarningLimit: 1000, // Increase the warning limit
    rollupOptions: {
      output: {
        manualChunks: {
          vendor: ["react", "react-dom", "react-router-dom"],
          ethers: ["ethers"],
          zkpay: ["@zkpay/sdk"],
        },
      },
    },
  },
});
