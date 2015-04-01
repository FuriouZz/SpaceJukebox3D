class SPACE.DEFAULT.Setup extends THREE.Group

  jukebox: null
  playlist: null
  current: null
  cover: null

  onadd: false

  constructor: ->
    super
    @jukebox = SPACE.Jukebox

  onEnter: (callback)->
    callback() if callback
    @setup()

  onExit: (callback)->
    callback() if callback

  _events: ->
    document.addEventListener(EVENT.Jukebox.IS_STOPPED.type, @_eJukeboxIsStopped)
    document.addEventListener(EVENT.Cover.TEXTURES_LOADED.type, @_eCoverTexturesLoaded)

  _eJukeboxIsStopped: (e)=>
    @_launch()

  _eCoverTexturesLoaded: (e)=>
    @_launch()

  _launch: ->
    for track in @playlist
      @jukebox.add(track)

  setup: ->
    @fetchTracks()
    @cover = new SPACE.DEFAULT.Cover()
    @add(@cover)
    @_events()

  fetchTracks: ->
    req = new XMLHttpRequest()
    req.open('GET', 'resources/playlist.json', true)
    req.onload = (e)=>
      @playlist = JSON.parse(e.target.response)

      @cover.load(@playlist)



      # for track in @playlist
      #   @jukebox.add(track)




        # $('#cover ul').append('<li></li>')
        # $('#cover ul li').css('background-image', 'url(resources/covers/'+track.cover+')')
      # $('#cover ul li:first-child').addClass('active')
    req.send(null)

  # next: ->
  #   if @playlist.length > 0
  #     @current = @playlist.shift()
  #   @jukebox.add(@current)
  #   @refreshCover()
  #   @onadd = true

  # update: (delta)->
  #   if @playlist and @playlist.length and @jukebox.state == JukeboxState.IS_STOPPED and not @onadd
  #     @next()
  #   else if @jukebox.state == JukeboxState.IS_PLAYING and @onadd
  #     @onadd = false
