module.exports = {
  presets: [
    [
      '@babel/env',
      {
        targets: 'defaults'
      }
    ]
  ],
  plugins: [
    '@babel/plugin-proposal-optional-chaining',
    '@babel/plugin-proposal-optional-catch-binding',
    '@babel/plugin-proposal-nullish-coalescing-operator'
  ]
};
