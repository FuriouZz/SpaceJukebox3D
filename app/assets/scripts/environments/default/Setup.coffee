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
    document.addEventListener(JUKEBOX.IS_STOPPED.type, @_eJukeboxIsStopped)

  _eJukeboxIsStopped: (e)=>
    for track in @playlist
      @jukebox.add(track)

  setup: ->
    @fetchTracks()
    @cover = new SPACE.DEFAULT.Cover()
    @_events()

  fetchTracks: ->
    req = new XMLHttpRequest()
    req.open('GET', 'resources/playlist.json', true)
    req.onload = (e)=>
      @playlist = JSON.parse(e.target.response)
      for track in @playlist
        @jukebox.add(track)
      $('#wrapper').css('background-image', 'url(resources/covers/'+@playlist[0].cover+')')
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
