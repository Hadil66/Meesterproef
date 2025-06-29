// https://nuxt.com/docs/api/configuration/nuxt-config
console.log('[nuxt.config.ts] Raw process.env.NUXT_PUBLIC_WORDPRESS_API_URL:', process.env.NUXT_PUBLIC_WORDPRESS_API_URL);
console.log('[nuxt.config.ts] Type of Raw process.env.NUXT_PUBLIC_WORDPRESS_API_URL:', typeof process.env.NUXT_PUBLIC_WORDPRESS_API_URL);

export default defineNuxtConfig({
  compatibilityDate: '2025-05-15',
  devtools: { enabled: true },

  ssr: false,

  image: {
    provider: 'ipxStatic', 
  },

  runtimeConfig: {
    wpAppPassword: process.env.NUXT_WP_APP_PASSWORD,
    public: {
      wordpressApiUrl: process.env.NUXT_PUBLIC_WORDPRESS_API_URL,
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
          `
          @use "@/assets/styles/_variables.scss" as *;
          @use "@/assets/styles/_mixins.scss" as *;
          @use "sass:math";
          @use "sass:color";
          `
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
       {
          rel: 'preload',
          href: '/fonts/HostGrotesk-VariableFont_wght.ttf',
          as: 'font',
          type: 'font/ttf',
          crossorigin: ''
        },
        {
          rel: 'preload',
          href: '/images/tauro-logo.svg',
          as: 'image',
          type: 'image/svg+xml'
        }
      ]
    }
  },

  modules: ['@nuxt/image']
});