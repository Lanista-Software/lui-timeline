import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [vue()]
})
// import vue from "@vitejs/plugin-vue";

// export default {
//   plugins: [
//     vue({
//       template: {
//         compilerOptions: {
//           // treat all tags with a lui as custom elements
//           isCustomElement: (tag) => tag.startsWith("lui"),
//         },
//       },
//     }),
//   ],
//   build: {
//     rollupOptions: {
//       output: {
//         entryFileNames: `assets/lui-timeline.js`,
//         chunkFileNames: `assets/lui-timeline.[name].js`,
//       },
//     },
//   },
// };
