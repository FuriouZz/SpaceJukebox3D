class SPACE.MainScene extends SPACE.Scene

  _manager: null
  _jukebox: null

  constructor: ->
    super()

  resume: ->
    super()

    @_manager = SPACE.SceneManager

    # Setup renderer
    @_manager.camera.position.setZ(600)
    # @_manager.setPixelRatio(window.devicePixelRatio)

    # @_manager.renderer.setClearColor(new THREE.Color(0x58b1ff))
    # @_manager.renderer.shadowMapEnabled = true
    # @_manager.renderer.shadowMapSoft    = true
    # @_manager.renderer.shadowMapType    = THREE.PCFShadowMap

    # Create a SC singleton
    SPACE.SC = new SPACE.SoundCloud(SPACE.SC.id, SPACE.SC.redirect_uri)

    @_events()
    @_setup()

  pause: ->

  _events: ->
    document.addEventListener(SPACE.SoundCloud.IS_CONNECTED, @_eSCIsConnected)
    document.addEventListener(SPACE.CoverController.PLAYLIST_LOADED, @_ePlaylistLoaded)

  _eSCIsConnected: =>
    @_fillJukebox()

  _ePlaylistLoaded: =>
    @_fillJukebox() if SPACE.SC.isConnected()

  _setup: =>
    window.firstLaunch = true

    # Setup Jukebox
    @_jukebox = new Jukebox()
    SPACE.Jukebox = @_jukebox
    # @_jukebox.add('resources/sounds/all_day.mp3', true)
    # @_jukebox.add('https://soundcloud.com/bon-entendeur-music/lafierte')

    # Setup equalizers
    small = new SPACE.Equalizer({
      minLength: 0
      maxLength: 200
      radius: 300
      color: 0xFFFFFF
      absolute: false
      lineForceDown: .5
      lineForceUp: 1
      interpolationTime: 250
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
      interpolationTime: 250
    })
    @add(big)

    # Setup cover
    @cover = new SPACE.CoverController()
    @add(@cover.view)

  _fillJukebox: =>
    for track, i in @cover.playlist
      @_jukebox.add(track.url)
