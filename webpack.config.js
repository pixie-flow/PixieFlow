module.exports = {
    module: {
      rules: [
        {
          test: /\.wgsl$/,
          use: 'shader-loader',
        },
        // 他のローダー設定
      ],
    },
  };