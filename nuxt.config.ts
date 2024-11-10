// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  compatibilityDate: '2024-04-03',
  ssr: false,
  imports: {
    dirs: [
      'composables/**',
    ],
  },
  devtools: {
    enabled: true,
  },
  runtimeConfig: {
    public: {
      baseUrl: process.env.BASE_URL || 'http://localhost:3000',
    },
  },
  modules: [
    '@nuxtjs/supabase',
    '@nuxt/ui',
    '@prisma/nuxt',
    '@nuxtjs/google-fonts',
    '@nuxt/eslint',
    '@nuxtjs/cloudinary',
    'notivue/nuxt',
    '@vueuse/nuxt',
    'dayjs-nuxt',
  ],
  css: [
    'notivue/notification.css',
    'notivue/animations.css',
    'notivue/notification-progress.css',
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
  googleFonts: {
    families: {
      Montserrat: true,
    },
  },
  tailwindcss: {
    config: {
      theme: {
        extend: {
          fontFamily: {
            sans: ['Montserrat', 'sans-serif'],
          },
        },
      },
    },
  },
  cloudinary: {
    apiKey: process.env.CLOUDINARY_API_KEY,
    uploadPreset: 'image-present',
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
  eslint: {
    config: {
      standalone: false,
    },
  },
  dayjs: {
    plugins: [],
  },
})
