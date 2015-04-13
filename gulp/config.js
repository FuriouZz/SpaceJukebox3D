var srcPath = 'app/assets/'
var dstPath = 'public/'

module.exports = {
  global: {
    javascript_compiler: 'coffee' // es6 or coffee
  }

  ,html: {
    src: dstPath+'*.html'
    ,opts: {
      cwd: dstPath
    }
  }

  ,watch: {
    files: [dstPath+'**/*.html', dstPath+'assets/shaders/**']
  }

  ,coffee: {
    src: srcPath+'scripts/**/*.coffee'
    ,source: srcPath+'scripts/main.coffee'
    ,dst: dstPath+'assets/scripts/'
    ,opts: {
      bare: true
    }
  }

  ,sass: {
    src: srcPath+'styles/**/*.{scss,sass}'
    ,srcPath: srcPath+'styles/'
    ,dstPath: dstPath+'assets/styles/'
    ,opts: {
      sourcemap: true
    }
  }

  ,browserSync: {
    open: false
    ,watchOptions: {
      debounceDelay: 1000
    }
    ,server: { baseDir: './public' }
    // ,proxy:  'spacejukebox.dev'
  }

  ,browserify: {
    // entries: './app/assets/scripts/_modules/main.coffee'
    modulePath: './app/assets/scripts/_modules/'
    ,extensions: ['.coffee']
    ,source: 'main.js'
    ,dstPath: dstPath+'assets/scripts'
  }
}
