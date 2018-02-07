const Promise = require('bluebird');
const fs = Promise.promisifyAll(require('fs'));
const {EOL} = require('os');
const less = require('less');
const remove = require('lodash.remove');
const natural = require('natural');
const d3 = require('d3');
const moment = require('moment');
const marked = require('marked');
const lunr = require('lunr');
const minimatch = require('minimatch');
const string = require('string');
const nunjucks = require('nunjucks');
const sh = require('shelljs');

const Metalsmith = require('metalsmith');
const debug = require('metalsmith-debug');
const drafts = require('metalsmith-drafts');
const markdown = require('metalsmith-markdown');
const layouts = require('metalsmith-layouts');
const collections = require('metalsmith-collections');
const related = require('metalsmith-related');

const env = nunjucks.configure('./layout/templates', { watch: false, autoescape: false });

natural.PorterStemmer.attach();

async function style() {
  const data = await fs.readFileAsync('./layout/style/radekstepan.less', 'utf-8');
  const {css} = await less.render(data, {
    paths: ['./layout/style/'],
    compress: true
  });
  return fs.writeFileAsync('./docs/assets/style.css', css);
};

async function content() {
  let stopwords = await fs.readFileAsync('./stopwords.txt', 'utf-8');
  stopwords = stopwords.split(EOL);

  return new Promise((resolve, reject) => {
    Metalsmith(__dirname)
    .source('./content')
    .destination('./docs')
    .clean(false)
    .metadata({
      currentYear: new Date().getFullYear()
    })

    .use(debug())

    .use(drafts())

    .use(related({
      pattern: 'notes/**/*.md',
      max: 3,
      text: (doc) => {
        let text = string(marked(String(doc.contents))).stripTags().s;
        text = text.tokenizeAndStem();
        remove(text, word => !isNaN(word) || stopwords.indexOf(word) >= 0);
        return text;
      }
    }))

    .use(markdown())

    .use(collections({
      posts: {
        pattern: 'notes/*',
        sortBy: 'date',
        reverse: true
      }
    }))

    .use((files, metalsmith, done) => {
      // Colorize.
      const {posts} = metalsmith.metadata();

      if (!posts.length) return done();

      const color = d3.scaleLinear()
        .domain([0, posts.length - 1])
        .interpolate(d3.interpolateRgb)
        .range(['#4d4034', '#a4926d']);

      posts.forEach((post, i) => {
        post.color = color(i);
        // + format dates
        post.date = moment(post.date).toISOString();
      });

      // URLs.
      Object.keys(files).forEach(path => files[path].path = path);

      // Search index.
      const docs = {};
      const search = lunr(function() {
        this.field('title', { boost: 10 });
        this.field('contents');
        this.ref('path');

        const mm = new minimatch.Minimatch('notes/**/*.html');
        for (const path in files) {
          const doc = files[path];
          if (!(mm.match(path))) continue;

          const {title, date, color} = doc;
          docs[path] = { title, date, color };

          const obj = { path };
          for (const k in doc) {
            if (k === 'title' || k === 'contents') {
              obj[k] = String(doc[k]);
            }
          }
          this.add(obj);
        }
      });

      files['index.json'] = {
        contents: new Buffer(JSON.stringify({
          docs,
          search: search.toJSON()
        }))
      };

      // Precompile browser templates.
      const bin = './node_modules/.bin/nunjucks-precompile';
      const src = './layout/templates/posts.html';
      const out = './docs/assets/templates/posts.js';
      sh.exec(`${bin} ${src} --name posts.html >> ${out}`, { silent: true }, done);
    })

    .use(layouts({
      engine: 'nunjucks',
      directory: './layout/templates'
    }))

    .build(err => err ? reject(err) : resolve());
  });
};

Promise.all([style(), content()]);
