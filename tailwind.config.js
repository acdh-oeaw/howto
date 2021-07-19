/* @ts-expect-error Missing module declaration. */
const colors = require('tailwindcss/colors')

const config = {
  mode: 'jit',
  purge: ['src/**/*.@(ts|tsx)'],
  darkMode: false,
  theme: {
    extend: {
      colors: {
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
      ringOffsetWidth: {
        DEFAULT: '2px',
      },
      screens: {
        xs: '480px',
        '2xl': '1440px',
      },
      typography(/** @type {(key: string) => string} */ theme) {
        return {
          DEFAULT: {
            css: {
              /** Don't add quotes around `blockquote`. */
              'blockquote p:first-of-type::before': null,
              'blockquote p:last-of-type::after': null,
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
            },
          },
        }
      },
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
