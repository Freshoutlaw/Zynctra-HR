/**
 * /frontend/postcss.config.js
 * 
 * PostCSS configuration for processing CSS with Tailwind and other plugins
 */

module.exports = {
  plugins: [
    require('tailwindcss'),
    require('autoprefixer'),
  ],
};