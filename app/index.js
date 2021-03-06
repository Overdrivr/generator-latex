'use strict';
var yosay = require('yosay');
var mkdirp = require('mkdirp');
var docClasses = [
  'report', 'article', 'book', 'slides', 'beamer', 'lettre', 'memoir'
];
var languages = [
  'english', 'afrikaans', 'ancientgreek', 'arabic', 'armenian', 'assamese',
  'basque', 'bengali', 'bokmal', 'bulgarian', 'catalan', 'coptic', 'croatian',
  'czech', 'danish', 'dutch', 'esperanto', 'estonian', 'farsi', 'finnish',
  'french', 'galician', 'german', 'german-x-2013-05-26', 'greek', 'gujarati',
  'hindi', 'hungarian', 'icelandic', 'indonesian', 'interlingua', 'irish',
  'italian', 'kannada', 'kurmanji', 'latin', 'latvian', 'lithuanian',
  'malayalam', 'marathi', 'mongolian', 'mongolianlmc', 'monogreek', 'ngerman',
  'ngerman-x-2013-05-26', 'nynorsk', 'oriya', 'panjabi', 'pinyin', 'polish',
  'portuguese', 'romanian', 'russian', 'sanskrit', 'serbian', 'slovak',
  'slovenian', 'spanish', 'swedish', 'swissgerman', 'tamil', 'telugu',
  'turkish', 'turkmen', 'ukenglish', 'ukrainian', 'uppersorbian',
  'usenglishmax', 'welsh'
];

module.exports = require('yeoman-generator').Base.extend({
  init: function () {
    this.pkg = require('../package.json');

    this.on('end', function () {
      this._createFirstChapter();
      if (!this.options['skip-install']) {
        this.npmInstall();
      }
    });
  },

  askFor: function () {
    var done = this.async();
    var extensionName = require('lodash').kebabCase(this.appname);

    // Have Yeoman greet the user.
    this.log(yosay('Welcome to the marvelous Latex generator!'));

    var prompts = [{
      name: 'projectName',
      message: 'Project Name',
      default: extensionName,
      filter: function (input) {
        return input.replace(/^latex[\-_]?/, '').replace(/[\-_]?latex/, '');
      }
    },
    {
      name: 'projectDesc',
      message: 'Project Description',
      default: 'My new LaTex book.'
    },
    {
      name: 'version',
      message: 'Project version',
      default: '0.0.1',
      validate: function (input) {
        return /^[0-9]\.[0-9](\.[0-9])?$/.test(input);
      }
    },
    {
      name: 'projectUrl',
      message: 'Project homepage'
    },
    {
      name: 'license',
      message: 'License',
      default: 'MIT'
    },
    {
      name: 'authorName',
      message: 'Author name',
      default: this.user.git.username,
      validate: function (input) {
        return input ? true : false;
      }
    },
    {
      type: 'list',
      choices: docClasses,
      name: 'docClass',
      message: 'Choose your document class',
      default: docClasses[0]
    },
    {
      type: 'list',
      choices: languages,
      name: 'language',
      message: 'Choose your language for Babel',
      default: languages[0]
    },
    {
      type: 'confirm',
      name: 'bib',
      message: 'Do you need a bibliography?',
      default: false
    },
    {
      type: 'confirm',
      name: 'gloss',
      message: 'Do you need a glossary?',
      default: false
    },
    {
      type: 'confirm',
      name: 'figs',
      message: 'Do you need to generate .pdf figures from .svg automatically?',
      default: false
    }];

    this.prompt(prompts, function (props) {
      this.projectName = props.projectName;
      this.projectNameSlug = require('lodash').kebabCase(props.projectName);
      this.projectDesc = props.projectDesc;
      this.version = props.version;
      this.projectUrl = props.projectUrl;
      this.license = props.license;
      this.authorName = props.authorName;
      this.docClass = props.docClass;
      this.language = props.language;
      this.bib = props.bib;
      this.gloss = props.gloss;
      this.figs = props.figs;

      done();
    }.bind(this));
  },

  app: function () {
    mkdirp('dist/');
    this.copy('Gruntfile.js', 'Gruntfile.js');
    this.copy('main.tex', 'main.tex');
    if (this.bib) {
      this.copy('src/refs.bib', 'src/refs.bib');
    }
    if (this.gloss) {
      this.copy('src/glos.tex', 'src/glos.tex');
    }
    if (this.figs) {
      this.copy('src/foobar.svg', 'src/foobar.svg');
      this.copy('figs.js', 'figs.js');
    }
  },

  projectfiles: function () {
    this.copy('package.json', 'package.json');
    this.copy('editorconfig', '.editorconfig');
  },

  _createFirstChapter: function () {
    this.composeWith('latex:chapter', {
      options: {
        chapterNum: '1',
        chapterName: 'First Chapter'
      }
    });
  }
});
