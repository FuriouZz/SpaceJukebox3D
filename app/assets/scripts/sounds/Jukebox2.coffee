class SPACE.Jukebox

  # States
  @IS_WAITING:   'jukebox_is_waiting'
  @IS_QUEUING:   'jukebox_is_queuing'

  # Properties
  current:      null
  playlist:     null
  searchEngine: null
  SC:           null

  state:     null

  _nextDelay: 0
  _nextTimeout: null
  _refreshDelay: 1000

  constructor: ->
    @playlist     = []
    @searchEngine = new SPACE.SearchEngine()
    @SC           = SPACE.SC

    @inputType    = 'WebAudioAPI'

    @setState(SPACE.Jukebox.IS_WAITING)
    @_refresh()
    @_events()

  _events: ->
    document.addEventListener(SPACE.Track.IS_STOPPED, @_eTrackIsStopped)

  _eTrackIsStopped: =>
    @setState(SPACE.Jukebox.IS_WAITING)

  setState: (state)->
    @state = state
    switch @state
      when SPACE.Jukebox.IS_WAITING
        HELPER.trigger(SPACE.Jukebox.IS_WAITING, { jukebox: this })
      when SPACE.Jukebox.IS_QUEUING
        HELPER.trigger(SPACE.Jukebox.IS_QUEUING, { jukebox: this })

  _createTrack: (data, inputMode=false)->
    track           = new SPACE.Track()
    track.inputMode = inputMode
    track.setData(data)
    @playlist.push(track)

  _refresh: =>
    if @playlist.length > 0 and @state == SPACE.Jukebox.IS_WAITING
      @next()

    setTimeout(@_refresh, @_refreshDelay)

  add: (urlOrInput)->
    if typeof urlOrInput == 'boolean' and urlOrInput
      @_createTrack({}, true) 
      return

    @SC.getSoundOrPlaylist urlOrInput, (o)=>
      tracks = null
      if o.hasOwnProperty('tracks')
        tracks = o.tracks
      else
        tracks = [o]

      for data in tracks
        @_createTrack(data, false)

  remove: (index)->
    return if @inputType == 'Microphone'
    @playlist.splice(index, 1)

  move: (index1, index2)->
    return if @inputType == 'Microphone'

    tmp               = @playlist[index1]
    @playlist[index1] = @playlist[index2]
    @playlist[index2] = tmp

  search: (value)->
    return if @inputType == 'Microphone'
    @searchEngine.search(value)

  next: ->
    return if @inputType == 'Microphone'

    clearTimeout(@_nextTimeout) if @_nextTimeout 

    @setState(SPACE.Jukebox.IS_QUEUING)
    @_nextTimeout = setTimeout =>
      @current.stop() if @current
      if @playlist.length > 0
        @current = @playlist.shift()
        @current.load()
    , @_nextDelay
