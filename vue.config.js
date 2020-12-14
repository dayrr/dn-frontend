// const IS_PRODUCTION = process.env.NODE_ENV === 'production'

module.exports = {
  runtimeCompiler: true,
  outputDir: 'dist',
  assetsDir: 'static',
  // baseUrl: IS_PRODUCTION
  // ? 'http://cdn123.com'
  // : '/',
  // For Production, replace set baseUrl to CDN
  // And set the CDN origin to `yourdomain.com/static`
  // Whitenoise will serve once to CDN which will then cache
  // and distribute
  devServer: {
    proxy: {
      '/api*': {
        // Forward frontend dev server request for /api to django dev server
        target: 'http://localhost:8000/',
      },
      '/onto*': {
        // Forward frontend dev server request for /api to django dev server
        target: 'http://localhost:8000/',
      },
      '/dataset*': {
        // Forward frontend dev server request for /api to django dev server
        target: 'http://localhost:8000/',
      },

      '/distribution*': {
        // Forward frontend dev server request for /api to django dev server
        target: 'http://localhost:8000/',
      },


      '/test*': {
        // Forward frontend dev server request for /api to django dev server
        target: 'http://localhost:8000/',
      },

    }
  }
}