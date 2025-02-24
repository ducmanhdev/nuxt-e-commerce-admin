// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  compatibilityDate: '2024-04-03',
  ssr: false,
  devtools: {
    enabled: true
  },
  runtimeConfig: {
    public: {
      baseUrl: process.env.BASE_URL || 'http://localhost:3000'
    }
  },
  modules: [
    '@nuxtjs/supabase',
    '@nuxt/ui',
    '@prisma/nuxt',
    '@nuxt/eslint',
    '@vueuse/nuxt',
    'dayjs-nuxt',
    '@pinia/nuxt',
    '@nuxt/image',
    'nuxt-security',
    'nuxt-tiptap-editor'
  ],
  css: ['~/assets/css/main.css'],
  supabase: {
    redirect: true,
    redirectOptions: {
      login: '/login',
      callback: '/confirm',
      include: undefined,
      exclude: ['/sign-up'],
      cookieRedirect: false
    }
  },
  prisma: {
    autoSetupPrisma: true
  },
  colorMode: {
    preference: 'system'
  },
  dayjs: {
    plugins: ['isSameOrAfter']
  },
  security: {
    headers: {
      contentSecurityPolicy: {
        'img-src': ["'self'", 'data:', 'blob:', process.env.SUPABASE_URL!]
      }
    }
  },
  image: {
    domains: [process.env.SUPABASE_URL!]
  },
  tiptap: {
    prefix: 'Tiptap'
  },
  fonts: {
    experimental: {
      processCSSVariables: true
    },
    provider: 'google'
  }
})
