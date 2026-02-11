/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{html,ts}",
  ],
  theme: {
    extend: {
      colors: {
        // Mapeo semántico
        background: 'var(--bg-app)', // Uso: bg-background
        surface: {
          DEFAULT: 'var(--bg-surface)', // Uso: bg-surface
          hover: 'var(--bg-surface-hover)', // Uso: bg-surface-hover
        },
        primary: {
          DEFAULT: 'var(--primary)',       // Uso: bg-primary, text-primary
          foreground: 'var(--primary-fg)', // Uso: text-primary-foreground
        },
        secondary: 'var(--secondary)',
        accent: 'var(--accent)',

        // Textos
        text: {
          main: 'var(--text-main)',
          muted: 'var(--text-muted)',
          inverse: 'var(--text-inverse)',
        },

        // Bordes
        border: 'var(--border-default)',

        // Estados
        error: 'var(--color-error)',
        success: 'var(--color-success)',
      }
    },
  },
  plugins: [],
}
