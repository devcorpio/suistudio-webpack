const program = require('commander')
const webpack = require('webpack')
const path = require('path')
const browserSync = require('browser-sync')
const historyApiFallback = require('connect-history-api-fallback')
const config = require('../webpack.config.prod')

// TODO: Extract this
const chalk = require('chalk')
const chalkError = chalk.red;
const chalkSuccess = chalk.green;
const chalkWarning = chalk.yellow;
const chalkProcessing = chalk.blue;


program
  .option('-S, --server', 'server in local your production ready assets')
  .on('--help', () => {
    console.log('  Examples:')
    console.log('')
    console.log('    $ suistudio-webpack build -S')
    console.log('    $ suistudio-webpack build --help')
    console.log('')
  })
  .parse(process.argv)

const {server = false} = program

process.env.NODE_ENV = 'production';

console.log(chalkProcessing('Generating minified bundle. This will take a moment...'));

webpack(config).run((error, stats) => {
  if (error) {
    console.log(chalkError(error));
    return 1;
  }

  const jsonStats = stats.toJson();

  if (jsonStats.hasErrors) {
    return jsonStats.errors.map(error => console.log(chalkError(error)));
  }

  if (jsonStats.hasWarnings) {
    console.log(chalkWarning('Webpack generated the following warnings: '));
    jsonStats.warnings.map(warning => console.log(chalkWarning(warning)));
  }

  console.log(`Webpack stats: ${stats}`);

  console.log(chalkSuccess('Your app is compiled in production mode in /public. It\'s ready to roll!'));
  if (server) {
    console.log(chalkProcessing('Opening production build...'));
    browserSync({
      port: 4000,
      ui: {
        port: 4001
      },
      server: {
        baseDir: path.resolve(process.env.PWD, 'public')
      },

      files: [
        'src/*.html'
      ],

      middleware: [historyApiFallback()]
    });
  }

  return 0;
});

