class SPACE.MainScene extends SPACE.Scene

  _manager: null
  _jukebox: null

  constructor: ->
    super()

  resume: ->
    @_manager = SPACE.SceneManager

    # Setup renderer
    @_manager.camera.position.setZ(600)
    # @_manager.renderer.setPixelRatio(window.devicePixelRatio)
    # @_manager.renderer.setClearColor(new THREE.Color(0x58b1ff))
    # @_manager.renderer.shadowMapEnabled = true
    # @_manager.renderer.shadowMapSoft    = true
    # @_manager.renderer.shadowMapType    = THREE.PCFShadowMap

    # Create a SC singleton
    SPACE.SC = new SPACE.SoundCloud(SPACE.SC.id, SPACE.SC.redirect_uri)

    @_events()
    @_setup() if SPACE.SC.isConnected()

  pause: ->

  update: ->
    # @_jukebox.update() if @_jukebox

  _events: ->
    document.addEventListener(SPACE.SoundCloud.IS_CONNECTED, @_eSCIsConnected)

  _eSCIsConnected: =>
    @_setup()

  _setup: =>
    window.firstLaunch = true

    @_jukebox = new SPACE.Jukebox()
    # @_jukebox.add('https://soundcloud.com/bon-entendeur-music/lepere')
    # @_jukebox.add(true)

    small = new SPACE.Equalizer({
      minLength: 0
      maxLength: 200
      radius: 300
      color: 0xFFFFFF
      absolute: false
      lineForceDown: .5
      lineForceUp: 1
    })
    @add(small)

    big = new SPACE.Equalizer({
      minLength: 0
      maxLength: 50
      radius: 300
      color: 0xD1D1D1
      absolute: false
      lineForceDown: .5
      lineForceUp: 1
    })
    @add(big)

  # equalizer: null
  # jukebox:   null

  # loadingManager: null
  # loader:         null

  # constructor: ->
  #   super

  #   @_events()

  #   # Create a SC singleton
  #   unless SPACE.hasOwnProperty('SC')
  #     SPACE.SC = new SPACE.SoundCloud(SPACE.SOUNDCLOUD.id, SPACE.SOUNDCLOUD.redirect_uri)
  #   @SC = SPACE.SC

  #   # Loading Manager
  #   @loadingManager            = new THREE.LoadingManager()
  #   @loadingManager.onProgress = @_environmentOnProgress
  #   @loader                    = new THREE.XHRLoader(@loadingManager)

  #   # Load the default environment
  #   @_loadEnvironment('default', ['Earth', 'Icosahedron'], @_environmentLoaded)
  #   # @_loadEnvironment('evolution', ['Speedwalk'], @_environmentLoaded)

  #   @setup() if @SC.isConnected()

  # _events: ->
  #   document.addEventListener(SPACE.SoundCloud.IS_CONNECTED.type, @setup)

  # setup: =>
  #   SPACE.Jukebox         = new SPACE.Jukebox(this)
  #   @jukebox              = SPACE.Jukebox
  #   @jukebox.whileplaying = @_whileplaying
  #   # @jukebox.predefinedPlaylist()
  #   # @jukebox.search('kaytranada')

  # _loadEnvironment: (name, files, callback)->
  #   SPACE[name.toUpperCase()] = SPACE[name.toUpperCase()] || {}
  #   @loadingManager.onLoad    = (r)->
  #     callback(name)

  #   files.push('Setup')
  #   for file in files
  #     return if SPACE[name.toUpperCase()].hasOwnProperty(file)
  #     @loader.load('scripts/environments/'+name+'/'+file+'.js')

  # _environmentOnProgress: (item, loaded, total)=>
  #   objectName = item.replace(/(.+\/|\.js)/g, '')
  #   envName    = (item.split(/\//)[2]).toUpperCase()
  #   object     = eval(@loader.cache.files[item])
  #   SPACE[envName][objectName] = object

  # _environmentLoaded: (name)=>
  #   if @environment
  #     @environment.onExit =>
  #       @remove(@environment)
  #     @environment = null
  #   @environment = new SPACE[name.toUpperCase()].Setup(@jukebox)
  #   @add(@environment)
  #   @environment.onEnter( =>
  #     SPACE.LOG 'Environment displayed'
  #   )

  # update: (delta)->
  #   super(delta)
  #   @jukebox.update(delta) if @jukebox
