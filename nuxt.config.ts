// https://nuxt.com/docs/api/configuration/nuxt-config

export default defineNuxtConfig({

  compatibilityDate: '2024-04-03',
  devtools: { enabled: false },
  modules: [
    '@pinia/nuxt',
    '@nuxtjs/tailwindcss',
  ],
  ssr: false,

  runtimeConfig: {
    public: {
      googleClientId: process.env.NUXT_PUBLIC_GOOGLE_CLIENT_ID,
      googleApiKey: process.env.NUXT_PUBLIC_GOOGLE_API_KEY,
      googleDiscoveryDoc: "https://www.googleapis.com/discovery/v1/apis/calendar/v3/rest",
      googleScopes: "https://www.googleapis.com/auth/calendar.readonly",
    }

  },
  vite: {
    build: {
      target: ['es2022', 'edge89', 'firefox89', 'chrome89', 'safari15'],
    },
  },
  nitro: {
    esbuild: {
      options: {
        target: ['es2022', 'edge89', 'firefox89', 'chrome89', 'safari15'],
      }

    }
  }




});