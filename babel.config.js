module.exports = function (api) {
  api.cache(true);
  return {
    presets: ['babel-preset-expo'],
    plugins: [
      [
        'module-resolver',
        {
          root: ['./'],
          alias: {
            '@': './src',
          },
          extensions: ['.ios.ts', '.android.ts', '.ts', '.ios.tsx', '.android.tsx', '.tsx', '.jsx', '.js', '.json'],
        },
      ],
      // Needed by Jest to transform intl-messageformat (used by i18next-icu),
      // which ships ES2022 static class blocks. babel-preset-expo does not
      // enable this transform by default.
      '@babel/plugin-transform-class-static-block',
      'react-native-worklets/plugin',
    ],
  };
};
