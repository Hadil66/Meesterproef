// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  compatibilityDate: '2025-05-15',
  devtools: { enabled: true },
  runtimeConfig: {
    public: {
      wordpressApiUrl: process.env.NUXT_PUBLIC_WORDPRESS_API_URL,
      wpAppPassword: process.env.NUXT_PUBLIC_WP_APP_PASSWORD,
      wpUsername: process.env.NUXT_PUBLIC_WP_USERNAME,
    }
  }
  ,
  css: [
    '@/assets/styles/global.scss'
  ],
  vite: {
    css: {
      preprocessorOptions: {
        scss: {
          additionalData: `@import "@/assets/styles/_variables.scss";`
        }
      }
    }
  },
});
