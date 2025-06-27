import type { Config } from 'tailwindcss'

const config: Config = {
  content: [
    './index.html',
    './src/**/*.{js,ts,jsx,tsx}',
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          orange: '#FB6500',
          DEFAULT: '#FB6500',
        },
        brand: {
          orange: '#FB6500',
        },
        charcoal: '#111827',
        destructive: '#DC2626',
        hover: '#F3F4F6',
        focus: '#3B82F6',
        slate: {
          700: '#374151',
          600: '#4B5563',
          500: '#6B7280',
          400: '#9CA3AF',
          300: '#D1D5DB',
          200: '#E5E7EB',
          100: '#F3F4F6',
          50: '#F9FAFB',
        },
        divider: '#E5E7EB',  // slate-200 for lighter dividers
      },
      fontFamily: {
        sans: ['Inter', 'SF Pro Display', 'system-ui', 'sans-serif'],
      },
      fontSize: {
        'body': '16px',
        'h1': '28px',
        'h2': '20px',
        'h3': '18px',
      },
      spacing: {
        '1': '4px',   // 4pt base
        '2': '8px',   // 8pt
        '4': '16px',  // 16pt
        '6': '24px',  // 24pt
        '8': '32px',  // 32pt
        'section': '24px',  // Standard section spacing
        'brand-gap': '8px',  // Logo to text spacing
        'wizard-gap': '24px',  // Wizard step spacing
      },
      boxShadow: {
        'focus': '0 0 0 2px #3B82F6',
        'active': 'inset 0 2px 4px 0 rgba(0, 0, 0, 0.06)',
      },
      screens: {
        'mobile': '320px',
        'tablet': '768px',
        'desktop': '1280px',
      },
      height: {
        'tile': '140px',
        'list-item': '64px',
        'touch-target': '44px',
      },
      minHeight: {
        'touch-target': '44px',
        'touch': '44px',
      },
      minWidth: {
        'touch-target': '44px',
        'touch': '44px',
      },
      maxHeight: {
        'list-scroll': '300px',
      }
    },
  },
  plugins: [],
}

export default config 
