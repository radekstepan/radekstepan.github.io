fs          = require 'fs'
async       = require 'async'
less        = require 'less'
{ EOL }     = require 'os'
_           = require 'lodash'
natural     = require 'natural'

Metalsmith  = require 'metalsmith'
drafts      = require 'metalsmith-drafts'
markdown    = require 'metalsmith-markdown'
templates   = require 'metalsmith-templates'
collections = require 'metalsmith-collections'
related     = require 'metalsmith-related'

d3          = require 'd3'
moment      = require 'moment'
marked      = require 'marked'
lunr        = require 'lunr'
minimatch   = require 'minimatch'
string      = require 'string'
swig        = require 'swig'
chalk       = require 'chalk'
sh          = require 'shelljs'

theme = (cb) ->
  async.waterfall [
    (cb) ->
      fs.readFile './theme/style/radekstepan.less', 'utf-8', cb
    
    (data, cb) ->
      less.render data,
        'paths': [ './theme/style/' ]
        'compress': yes
      , cb

    ({ css }, cb) ->
      fs.writeFile './public/assets/style.css', css, cb

  ], cb

content = (cb) ->
  console.log chalk.bold 'Metalsmith building content'

  # Tokenizer and stemmer.
  do natural.PorterStemmer.attach

  # Load stopwords.
  stopwords = (fs.readFileSync('./stopwords.txt', 'utf-8')).split(EOL)

  # Source and destination.
  m = Metalsmith(__dirname)
  .source('./content')
  .destination('./public')

  m.use ->
    console.log 'Drafts'
    (do drafts).apply null, arguments

  m.use ->
    console.log 'Related posts'
    opts =
      'pattern': 'notes/**/*.md'
      'max': 3
      text: (doc) ->
        # Strip all markup.
        text = string(marked(String(doc.contents))).stripTags().s
        # Tokenize and stem.
        text = do text.tokenizeAndStem
        _.remove text, (word) ->
          # Remove all numbers.
          return yes unless isNaN word
          # Remove all stopwords.
          word in stopwords
        
        text

    related(opts).apply null, arguments
  
  m.use ->
    console.log 'Markdown'
    (do markdown).apply null, arguments
  
  m.use ->
    console.log 'Collections'
    collections({
      'posts':
        'pattern': 'notes/*'
        'sortBy': 'date'
        'reverse': yes
    }).apply null, arguments

  m.use (files, metalsmith, done) ->
    # -------------------
    console.log 'Colorize'

    docs = metalsmith.data.posts

    color = d3.scale.linear()
    .domain([ 0, docs.length - 1 ])
    .interpolate(d3.interpolateRgb)
    .range([ '#4d4034', '#a4926d' ])

    ( doc.color = color i for doc, i in docs )

    # -------------------
    console.log 'URLs'
    
    ( obj.path = file for file, obj of files )

    # -------------------
    console.log 'Search index'
    
    search = lunr ->
      @field 'title', { 'boost': 10 }
      @field 'contents'
      @ref 'path'

    idx = {}

    mm = new minimatch.Minimatch 'notes/**/*.html'
    for path, doc of files when mm.match path
      { title, date, color } = doc # need these in search results
      
      idx[path] = { title, date, color }
      
      obj = { path } # search index
      
      for k, v of doc when k in [ 'title', 'contents' ]
        obj[k] = String v
      
      search.add obj

    # The indexes.
    contents = new Buffer JSON.stringify {
      'search': do search.toJSON
      'docs': idx
    }
    files['index.json'] = { contents }

    # -------------------
    console.log 'Precompile browser templates'
    
    a = './theme/templates/posts.html'
    sh.exec "swig compile #{a}", { 'silent': yes }, (code, out) ->
      return done out if code

      contents = new Buffer out
      files['assets/templates/posts.js'] = { contents }

      do done

  m.use ->
    console.log 'Render templates'
    templates({
      'engine': 'swig'
      'directory': './theme/templates'
    }).apply null, arguments

  m.build (err) ->
    console.log if (err) then chalk.red err else chalk.green.bold 'Done'
    cb err

async.parallel [ theme, content ], (err) ->
  throw err if err