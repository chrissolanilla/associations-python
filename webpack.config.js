// This is an example webpack for a React project

const path = require('path');
const srcPath = path.join(__dirname, 'src') + path.sep;
const outputPath = path.join(__dirname, 'build') + path.sep;
const widgetWebpack = require('materia-widget-development-kit/webpack-widget');

const rules = widgetWebpack.getDefaultRules();
const copy = [
  ...widgetWebpack.getDefaultCopyList(),
  {
    from: path.join(__dirname, 'src', 'demo.json'),
    to: path.join(outputPath, 'demo.json'),
  },
];

const entries = {
  player: [
    path.join(srcPath, 'player.html'),
    path.join(srcPath, 'player.js'),
    path.join(srcPath, 'player.scss'),
  ],
  creator: [
    path.join(srcPath, 'creator.html'),
    path.join(srcPath, 'creator.js'),
    path.join(srcPath, 'creator.scss'),
  ],
  scoreScreen: [
    path.join(srcPath, 'scoreScreen.html'),
    path.join(srcPath, 'scoreScreen.js'),
    path.join(srcPath, 'scoreScreen.scss'),
  ],
};

const customRules = [
  rules.loadHTMLAndReplaceMateriaScripts,
  rules.loadAndPrefixSASS,
  rules.copyImages,
  rules.reactLoader,
  {
    test: /\.svg$/,
    use: 'raw-loader',
  },
];

const options = {
  entries: entries,
  copyList: copy,
  moduleRules: customRules,
};

const buildConfig = widgetWebpack.getLegacyWidgetBuildConfig(options);

// if you are importing from node modules - don't include this
// buildConfig.externals = {
// 	"react": "React",
// 	"react-dom": "ReactDOM"
// }

module.exports = buildConfig;
