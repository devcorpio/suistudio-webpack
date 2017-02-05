const generate = require('@schibstedspain/suistudio-webpack')

module.exports = generate({
  entry: {
    app: './app.js',
    vendor: ['react', 'react-dom']
  }
})
