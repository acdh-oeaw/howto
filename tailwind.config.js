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
              h5: {
                color: theme('colors.gray.900'),
                fontWeight: '500',
                fontStyle: 'italic',
                marginTop: em(24, 16),
                marginBottom: em(8, 16),
                lineHeight: round(24 / 16),
              },
              'h5 strong': {
                fontWeight: '700',
              },
              'h5 + *': {
                marginTop: '0',
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
              'li.tab-button': {
                margin: 0,
                padding: 0,
              },
              'li.tab-button::before': {
                display: 'none',
              },
              '.tabpanel a': {
                color: 'inherit',
              },
            },
          },
          sm: {
            css: {
              h5: {
                marginTop: em(20, 14),
                marginBottom: em(8, 14),
                lineHeight: round(20 / 14),
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

/** @type {(num: number) => string} */
function round(num) {
  return num
    .toFixed(7)
    .replace(/(\.[0-9]+?)0+$/, '$1')
    .replace(/\.0$/, '')
}

/** @type {(px: number, base: number) => string} */
function em(px, base) {
  return `${round(px / base)}em`
}

module.exports = config
