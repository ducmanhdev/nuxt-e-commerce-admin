// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
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
    'nuxt-tiptap-editor',
  ],
  devtools: {
    enabled: true,
  },
  css: ['~/assets/css/main.css'],
  colorMode: {
    preference: 'system',
  },
  runtimeConfig: {
    public: {
      baseUrl: process.env.BASE_URL || 'http://localhost:3000',
    },
  },
  compatibilityDate: '2024-04-03',
  dayjs: {
    plugins: ['isSameOrAfter'],
  },
  eslint: {
    config: {
      standalone: false,
      stylistic: true,
    },
  },
  fonts: {
    experimental: {
      processCSSVariables: true,
    },
    provider: 'google',
  },
  image: {
    domains: [process.env.SUPABASE_URL!],
  },
  prisma: {
    autoSetupPrisma: true,
  },
  security: {
    headers: {
      contentSecurityPolicy: {
        'img-src': ['\'self\'', 'data:', 'blob:', process.env.SUPABASE_URL!, '*'],
      },
    },
  },
  supabase: {
    redirect: false,
    redirectOptions: {
      login: '/sign-in',
      callback: '/confirm',
      cookieRedirect: false,
    },
  },
  tiptap: {
    prefix: 'Tiptap',
  },
})
