import type { Config } from 'tailwindcss'

export default <Partial<Config>>{
  theme: {
    extend: {
      fontFamily: {
        montserrat: ['Montserrat', 'sans-serif'],
      },
      aspectRatio: {
        auto: 'auto',
        square: '1 / 1',
        video: '16 / 9'
      }
    },
  },
}
