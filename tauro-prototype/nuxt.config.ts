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
  },
  css: [
    '@/assets/styles/global.scss'
  ],
  vite: {
    css: {
      preprocessorOptions: {
        scss: {
          additionalData:
          `@use "@/assets/styles/_variables.scss" as *;
          @use "sass:math";`
        }
      }
    }
  },
  app: {
    head: {
      htmlAttrs: {
        lang: 'nl'
      },
      charset: 'utf-8',
      viewport: 'width=device-width, initial-scale=1.0',
      title: 'Tauro Prototype',
      link: [
        { rel: 'icon', type: 'image/x-icon', href: '/favicon.ico' },
        {
          rel: 'preload',
          as: 'image',
          href: '/img/tauro_header.webp',
          fetchpriority: 'high'
        }
      ]
    }
  }
});