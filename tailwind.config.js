/* @ts-expect-error Missing module declaration. */
const colors = require('tailwindcss/colors')

const config = {
  mode: 'jit',
  purge: ['src/**/*.@(ts|tsx)'],
  darkMode: false,
  theme: {
    extend: {
      colors: {
        error: colors.red,
        neutral: colors.coolGray,
        primary: colors.blue,
      },
      fontFamily: {
        sans: ['Inter var', 'system-ui', 'sans-serif'],
      },
      gridTemplateColumns: {
        'content-columns': '1fr 720px 1fr',
        cards: 'repeat(auto-fill, minmax(320px, 1fr))',
      },
      gridTemplateRows: {
        'page-layout': 'auto 1fr auto',
      },
      maxWidth: {
        /** Character units `ch` change with font size, we just want a fixed width container. */
        '80ch': '720px',
      },
      padding: {
        '10vmin': '10vmin',
      },
      ringOffsetWidth: {
        DEFAULT: '2px',
      },
      typography(/** @type {(key: string) => string} */ theme) {
        return {
          DEFAULT: {
            css: {
              /** Don't add quotes around `blockquote`. */
              'blockquote p:first-of-type::before': null,
              'blockquote p:last-of-type::after': null,
              /** Don't add backticks around inline `code`. */
              'code::before': null,
              'code::after': null,
              'overflow-wrap': 'break-word',
              a: {
                '&:focus': {
                  outline: 'none',
                },
                '&:focus-visible': {
                  borderRadius: theme('borderRadius.DEFAULT'),
                  color: theme('colors.primary.600'),
                  boxShadow: `white 0px 0px 0px 2px, ${theme(
                    'colors.primary.600',
                  )} 0px 0px 0px 5px`,
                },
              },
              strong: {
                color: 'inherit',
              },
              '.quiz-card p': {
                margin: 0,
              },
              '.quiz-multiple-choice li': {
                margin: 0,
                padding: 0,
              },
              '.quiz-multiple-choice li::before': {
                display: 'none',
              },
            },
          },
        }
      },
    },
    screens: {
      '2xs': '360px',
      xs: '480px',
      sm: '640px',
      md: '768px',
      lg: '1024px',
      xl: '1280px',
      '2xl': '1440px',
    },
  },
  variants: {
    extend: {
      backgroundColor: ['focus-visible'],
      ringColor: ['focus-visible'],
      ringWidth: ['focus-visible'],
    },
  },
  plugins: [
    /* @ts-expect-error Missing module declaration. */
    require('@tailwindcss/typography'),
    /** @ts-expect-error Missing module declaration. */
    require('@tailwindcss/aspect-ratio'),
  ],
}

module.exports = config
