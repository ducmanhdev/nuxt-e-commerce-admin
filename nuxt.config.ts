// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  compatibilityDate: '2024-04-03',
  ssr: false,
  devtools: {
    enabled: true,
  },
  runtimeConfig: {
    public: {
      baseUrl: process.env.BASE_URL || 'http://localhost:3000',
      supabaseStorageUrl: process.env.SUPABASE_STORAGE_URL,
    },
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
  ],
  css: ['~/assets/css/main.css'],
  supabase: {
    redirect: true,
    redirectOptions: {
      login: '/sign-in',
      callback: '/confirm',
      include: undefined,
      exclude: ['/sign-up'],
      cookieRedirect: false,
    },
  },
  prisma: {
    autoSetupPrisma: true,
  },
  colorMode: {
    preference: 'system',
  },
  dayjs: {
    plugins: [],
  },
  security: {
    headers: {
      contentSecurityPolicy: {
        'img-src': ["'self'", 'data:', process.env.SUPABASE_URL],
      },
    },
  },
})
