class Jukebox

  # States
  @IS_WAITING:   'jukebox_is_waiting'
  @IS_QUEUING:   'jukebox_is_queuing'

  # Properties
  current:      null
  playlist:     null
  # searchEngine: null
  SC:           null

  state:     null

  _nextDelay: 1750
  _nextTimeout: null
  _refreshDelay: 1000

  _loadingQueue: null
  _isLoading: false

  constructor: ->
    @playlist       = []
    @_loadingQueue  = []
    # @searchEngine = new SPACE.SearchEngine()
    @SC             = SPACE.SC

    @inputType    = 'WebAudioAPI'

    @setState(Jukebox.IS_WAITING)
    @_refresh()
    @_events()

  _events: ->
    document.addEventListener(Track.IS_STOPPED, @_eTrackIsStopped)

  _eTrackIsStopped: =>
    @setState(Jukebox.IS_WAITING)

  setState: (state)->
    @state = state
    switch @state
      when Jukebox.IS_WAITING
        HELPER.trigger(Jukebox.IS_WAITING, { jukebox: this })
      when Jukebox.IS_QUEUING
        HELPER.trigger(Jukebox.IS_QUEUING, { jukebox: this })
    
  _refresh: =>
    if @playlist.length > 0 and @state == Jukebox.IS_WAITING
      @next()

    setTimeout(@_refresh, @_refreshDelay)

  add: (urlOrInput)->
    @_loadingQueue.push(urlOrInput)
    @_load(@_loadingQueue.shift()) unless @isLoading 

  _load: (url)->
    @isLoading = true
    Track.create url, (tracks, url)=>
      @playlist = @playlist.concat(tracks)
      if @_loadingQueue.length > 0
        @_load(@_loadingQueue.shift())
      else
        @isLoading = false

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
    return false if @inputType == 'Microphone'

    @current.stop() if @current

    canPlay = @playlist.length > 0
    canPlay = canPlay and @state == Jukebox.IS_WAITING
    canPlay = canPlay and not @_nextTimeout

    if canPlay
      @current = @playlist.shift()
      @setState(Jukebox.IS_QUEUING)    

      @_nextTimeout = setTimeout =>
          @current.stream()
          @_nextTimeout = null
      , @_nextDelay
  
      return true
    return false
