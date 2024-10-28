module.exports = (api) => {
  // This caches the Babel config
  api.cache.using(() => `env=${process.env.NODE_ENV};isServer`);
  return {
    sourceType: 'unambiguous',
    presets: [
      '@babel/typescript',
      [
        '@babel/preset-env',
        {
          useBuiltIns: 'usage',
          corejs: '3.20',
        },
      ],
    ],
    plugins: ['@babel/plugin-transform-runtime'],
  };
};
