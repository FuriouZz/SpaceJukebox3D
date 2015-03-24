var srcPath = 'app/assets/'
var dstPath = 'public/'

module.exports = {
  global: {
    javascript_compiler: 'coffee' // es6 or coffee
  }

  ,html: {
    src: dstPath+'**/*.html'
    ,opts: {
      cwd: dstPath
    }
  }

  ,coffee: {
    src: srcPath+'scripts/**/*.coffee'
    ,dst: dstPath+'scripts/'
    ,opts: {
      bare: true
    }
  }

  ,sass: {
    src: srcPath+'styles/**/*.{scss,sass}'
    ,srcPath: srcPath+'styles/'
    ,dstPath: dstPath+'styles/'
    ,opts: {
      sourcemap: false
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

}
