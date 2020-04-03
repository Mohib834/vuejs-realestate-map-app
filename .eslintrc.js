module.exports = {
    root: true,
    env: {
      browser: true,
      node: true
    },
    parserOptions: {
      parser: "@typescript-eslint/parser",
    },
    extends: [
      '@nuxtjs',
      'plugin:nuxt/recommended'
    ],
    // add your custom rules here
    rules: {
      'vue/max-attributes-per-line': [
        'error',
        {
          singleline: 1,
          multiline: {
            max: 1,
            allowFirstLine: false,
          },
        },
      ],
    }
  }
  