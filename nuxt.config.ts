// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  modules: [
    '@nuxt/content',
  ],
  css: ['~/assets/css/main.css'],
  app: {
    head: {
      // Runs before paint so a saved light or dark choice does not flash the system theme.
      script: [{
        innerHTML: "try{var t=localStorage.getItem('pythonflow:theme');if(t==='light'||t==='dark')document.documentElement.dataset.theme=t}catch(e){}",
      }],
    },
  },
  content: {
    experimental: {
      nativeSqlite: true,
    },
  },
  devtools: { enabled: true },
  compatibilityDate: '2024-04-03',
})
