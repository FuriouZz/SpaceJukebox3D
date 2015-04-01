class SPACE.MainScene extends SPACE.Scene

  equalizer: null
  jukebox:   null

  loadingManager: null
  loader:         null

  constructor: ->
    super

    @_events()
    @setup()

    # # Create a SC singleton
    # unless SPACE.hasOwnProperty('SC')
    #   SPACE.SC = new SPACE.SoundCloud(SPACE.SOUNDCLOUD.id, SPACE.SOUNDCLOUD.redirect_uri)
    # @SC = SPACE.SC

    # @setup() if @SC.isConnected()

    @env = new SPACE.DEFAULT.Setup()
    @env.onEnter()
    @add(@env)

  _events: ->
    document.addEventListener(EVENT.SoundCloud.IS_CONNECTED.type, @setup)

  setup: =>
    SPACE.Jukebox         = new SPACE.Jukebox(this)
    @jukebox              = SPACE.Jukebox
    @jukebox.whileplaying = @_whileplaying

  update: (delta)->
    super(delta)
    @jukebox.update(delta) if @jukebox
