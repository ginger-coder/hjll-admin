module.exports = {
  plugins: {
    autoprefixer: {},
    'postcss-pxtorem': {
      rootValue: 100,
      // minPixelValue: 12,
      propList: ['*'],
      exclude: (e) => {
        if (/src(\\|\/)views(\\|\/)dashboard/.test(e)) {
          return false;
        }
        return true;
      },
    },
  },
}