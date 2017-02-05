module.exports = {
  "cacheDirectory": true,
  "presets": [
    "es2015",
    "react",
    "stage-3"
  ],
  "plugins": [
    "transform-runtime",
    "transform-class-properties"
  ],
  "env": {
    "development": {
      "presets": [
        "react-hmre"
      ]
    }
  }
}
