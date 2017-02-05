const React = require('react')
const ReactDOM = require('react-dom')

import Hello from './hello'

debugger
ReactDOM.render(
  <Hello />,
  document.getElementById('root')
)

if (process.env.NODE_ENV === 'production') {
  require('offline-plugin/runtime').install()
}
