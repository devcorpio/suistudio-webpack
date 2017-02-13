#!/usr/bin/env node
const program = require('commander')

const pkg = require('../package.json')
const version = pkg.version

program
  .version(version, '    --version')

program
  .command('dev', 'open a server dev to start the development')
  .command('build', 'Compile all assets and create a public folder')

program.parse(process.argv)
