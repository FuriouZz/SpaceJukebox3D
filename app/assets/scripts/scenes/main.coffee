class SPACE.MainScene extends SPACE.Scene

  equalizer: null
  jukebox:   null

  loadingManager: null
  loader:         null

  constructor: ->
    super

    @_events()

    # Create a SC singleton
    unless SPACE.hasOwnProperty('SC')
      SPACE.SC = new SPACE.SoundCloud(SPACE.SOUNDCLOUD.id, SPACE.SOUNDCLOUD.redirect_uri)
    @SC = SPACE.SC

    # Loading Manager
    @loadingManager            = new THREE.LoadingManager()
    @loadingManager.onProgress = @_environmentOnProgress
    @loader                    = new THREE.XHRLoader(@loadingManager)

    # Load the default environment
    @_loadEnvironment('default', ['Earth'], @_environmentLoaded)

    @setup() if @SC.isConnected()

  _events: ->
    document.addEventListener(SPACE.SoundCloud.IS_CONNECTED.type, @setup)

  setup: =>
    @jukebox = new SPACE.Jukebox(this)
    @jukebox.whileplaying = @_whileplaying
    # @jukebox.predefinedPlaylist()
    # @jukebox.search('kaytranada')

  _loadEnvironment: (name, files, callback)->
    SPACE[name.toUpperCase()] = SPACE[name.toUpperCase()] || {}
    @loadingManager.onLoad    = (r)->
      callback(name)

    files.push('Setup')
    for file in files
      return if SPACE[name.toUpperCase()].hasOwnProperty(file)
      @loader.load('scripts/environments/'+name+'/'+file+'.js')

  _environmentOnProgress: (item, loaded, total)=>
    objectName = item.replace(/(.+\/|\.js)/g, '')
    envName    = (item.split(/\//)[2]).toUpperCase()
    object     = eval(@loader.cache.files[item])
    SPACE[envName][objectName] = object

  _environmentLoaded: (name)=>
    if @environment
      @environment.onExit =>
        @remove(@environment)
      @environment = null
    @environment = new SPACE[name.toUpperCase()].Setup(@jukebox)
    @add(@environment)
    @environment.onEnter( =>
      SPACE.LOG 'Environment displayed'
    )

  update: (delta)->
    super(delta)
    @jukebox.update(delta) if @jukebox
