// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  compatibilityDate: '2024-04-03',
  ssr: false,
  imports: {
    dirs: ['composables/**'],
  },
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
    'notivue/nuxt',
    '@vueuse/nuxt',
    'dayjs-nuxt',
    '@pinia/nuxt',
    '@nuxt/image',
  ],
  css: [
    'notivue/notification.css',
    'notivue/animations.css',
    'notivue/notification-progress.css',
    '~/assets/css/main.css',
  ],
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
  notivue: {
    position: 'top-right',
    limit: 4,
    enqueue: false,
    avoidDuplicates: false,
    notifications: {
      global: {
        duration: 3000,
      },
    },
  },
  dayjs: {
    plugins: [],
  },
})