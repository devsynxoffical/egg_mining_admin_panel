/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        // Professional Color Palette
        'indigo-blue': '#4C6FFF',
        'cyan': '#00D4FF',
        'off-white': '#F4F7FA',
        'dark-slate': '#0D1B2',
        'dark-sidebar': '#1C2036',
        'light-bg': '#F4F7FA',
        'accent-gold': '#4C6FFF',
        'text-dark': '#0D1B2',
        'text-light': '#FFFFFF',
        'subtle-gray': '#6B7280',
      },
      fontFamily: {
        'heading': ['Poppins', 'sans-serif'],
        'body': ['Inter', 'sans-serif'],
      },
      boxShadow: {
        'soft': '0 4px 10px rgba(0, 0, 0, 0.08)',
        'soft-dark': '0 4px 15px rgba(0, 0, 0, 0.2)',
      },
      borderRadius: {
        'card': '16px',
        'card-lg': '20px',
      },
      backgroundImage: {
        'gradient-gold-soft': 'radial-gradient(circle at 20% 50%, rgba(249, 201, 95, 0.2) 0%, rgba(255, 215, 128, 0.1) 50%, transparent 100%)',
        'gradient-gold-radial': 'radial-gradient(ellipse at center, rgba(249, 201, 95, 0.25) 0%, rgba(255, 215, 128, 0.1) 50%, transparent 100%)',
        'gradient-blue-gold': 'linear-gradient(135deg, rgba(199, 223, 255, 0.15) 0%, rgba(249, 201, 95, 0.15) 100%)',
        'gradient-egg-card': 'radial-gradient(ellipse 80% 100% at 50% 0%, rgba(249, 201, 95, 0.2) 0%, rgba(255, 215, 128, 0.1) 40%, transparent 70%)',
        'gradient-invite': 'linear-gradient(135deg, #101E35 0%, rgba(249, 201, 95, 0.25) 100%)',
        'gradient-card-subtle': 'linear-gradient(to bottom, rgba(255, 255, 255, 0.95) 0%, rgba(237, 242, 249, 0.6) 100%)',
        'gradient-bg-main': 'linear-gradient(to bottom, #EDF2F9 0%, #E8EFF7 100%)',
      },
    },
  },
  plugins: [],
}

