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
        video: '16 / 9',
      },
      colors: {
        rebeccaPurple: {
          DEFAULT: '#663399',
          50: '#faf6fe',
          100: '#f2ebfc',
          200: '#e7dafa',
          300: '#d5bdf5',
          400: '#bc93ed',
          500: '#a16ae2',
          600: '#8b4ad3',
          700: '#7638b8',
          800: '#663399',
          900: '#522a79',
          950: '#371358',
        },
      },
    },
  },
}
