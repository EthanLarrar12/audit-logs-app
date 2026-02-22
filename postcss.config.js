import prefixer from 'postcss-prefix-selector';
import tailwind from 'tailwindcss';
import autoprefixer from 'autoprefixer';

export default {
  plugins: [
    tailwind(),
    autoprefixer(),
    prefixer({
      prefix: '.audit-logs-wrapper',
      transform(prefix, selector, prefixedSelector) {
        if (selector === ':root') {
          return '.audit-logs-wrapper';
        }
        if (selector.startsWith('.audit-logs-wrapper')) {
          return selector;
        }
        if (selector === 'body' || selector === 'html') {
          return '.audit-logs-wrapper';
        }
        return prefixedSelector;
      }
    })
  ]
};
