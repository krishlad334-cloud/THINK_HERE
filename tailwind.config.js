export default {
  content: [
    './index.html',
    './src/**/*.{js,jsx}',
  ],
  theme: {
    extend: {
      colors: {
        'bg-dark': '#0A0816',
        surface: '#15122B',
        'brand-primary': '#A855F7',
        'brand-secondary': '#5EEAD4',
        'brand-indigo': '#4C4585',
        'accent-yellow': '#FACC15',
        'accent-pink': '#F472B6',
        'text-main': '#F5F3FF',
        'text-muted': '#A9A4C8',
      },
      fontFamily: {
        display: ['"Space Grotesk"', 'system-ui', 'sans-serif'],
        sans: ['"Inter"', 'system-ui', 'sans-serif'],
      },
      keyframes: {
        'pulse-glow': {
          '0%, 100%': {
            boxShadow: '0 0 22px rgba(168, 85, 247, 0.35), 0 0 48px rgba(94, 234, 212, 0.18)',
          },
          '50%': {
            boxShadow: '0 0 34px rgba(168, 85, 247, 0.6), 0 0 72px rgba(94, 234, 212, 0.35)',
          },
        },
        'float-slow': {
          '0%, 100%': { transform: 'translateY(0px)' },
          '50%': { transform: 'translateY(-10px)' },
        },
        'marquee-left': {
          '0%': { transform: 'translateX(0%)' },
          '100%': { transform: 'translateX(-50%)' },
        },
        'marquee-right': {
          '0%': { transform: 'translateX(-50%)' },
          '100%': { transform: 'translateX(0%)' },
        },
        'ripple-out': {
          '0%': { transform: 'scale(0)', opacity: '0.55' },
          '100%': { transform: 'scale(3.4)', opacity: '0' },
        },
        'border-glow': {
          '0%, 100%': { opacity: '0.5' },
          '50%': { opacity: '1' },
        },
      },
      animation: {
        'pulse-glow': 'pulse-glow 3s ease-in-out infinite',
        'float-slow': 'float-slow 5.5s ease-in-out infinite',
        'marquee-left': 'marquee-left 40s linear infinite',
        'marquee-right': 'marquee-right 44s linear infinite',
        'ripple-out': 'ripple-out 0.65s ease-out forwards',
        'border-glow': 'border-glow 3.5s ease-in-out infinite',
      },
      backgroundImage: {
        'brand-gradient': 'linear-gradient(135deg, #A855F7 0%, #5EEAD4 100%)',
        'gradient-radial': 'radial-gradient(var(--tw-gradient-stops))',
      },
    },
  },
  plugins: [],
};
