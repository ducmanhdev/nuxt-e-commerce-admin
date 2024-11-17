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
    cloudinary: {
      cloudName: process.env.CLOUDINARY_CLOUD_NAME,
      apiKey: process.env.CLOUDINARY_API_KEY,
      apiSecret: process.env.CLOUDINARY_API_SECRET,
    },
    public: {
      baseUrl: process.env.BASE_URL || 'http://localhost:3000',
    },
  },
  modules: [
    '@nuxtjs/supabase',
    '@nuxt/ui',
    '@prisma/nuxt',
    '@nuxt/eslint',
    '@nuxtjs/cloudinary',
    'notivue/nuxt',
    '@vueuse/nuxt',
    'dayjs-nuxt',
    '@pinia/nuxt',
    '@nuxt/fonts',
  ],
  css: ['notivue/notification.css', 'notivue/animations.css', 'notivue/notification-progress.css'],
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
  fonts: {
    provider: 'google',
  },
  tailwindcss: {},
  cloudinary: {
    cloudName: process.env.CLOUDINARY_CLOUD_NAME,
    apiKey: process.env.CLOUDINARY_API_KEY,
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
