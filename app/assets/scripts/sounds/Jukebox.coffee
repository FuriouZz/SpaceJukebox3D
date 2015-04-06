class SPACE.Jukebox

  ## Data objects
  SC:           null
  current:      null
  airport:      null
  playlist:     null
  searchEngine: null
  waveformData: null

  ## THREEJS Objects
  scene:       null
  equalizer:   null
  group:       null

  ## STATES
  state:        null
  airportState: null

  ## OTHERS
  delay: 2000
  time: 0

  constructor: (scene)->
    @scene = scene
    @group = new THREE.Group()
    @scene.add(@group)

    @waveformData =
      mono: null
      stereo: null
    @setAirportState(ENUM.AirportState.IDLE)

    # Initialize the equalizer
    @eqlzr = new SPACE.Equalizer({
      minLength: 0
      maxLength: 200
      radius: 300
      color: 0xFFFFFF
      absolute: false
      lineForceDown: .5
      lineForceUp: 1
      interpolationTime: 250
    })
    @group.add(@eqlzr)

    @equalizer = new SPACE.Equalizer({
      minLength: 0
      maxLength: 50
      radius: 300
      color: 0xD1D1D1
      absolute: false
      lineForceDown: .5
      lineForceUp: 1
      interpolationTime: 250
    })
    @group.add(@equalizer)

    @SC           = SPACE.SC
    @airport      = []
    @playlist     = []

    @_events()
    @setState(ENUM.JukeboxState.IS_STOPPED)

  _events: ->
    document.addEventListener(EVENT.Track.IS_PLAYING.type, @_eTrackIsPlaying)
    document.addEventListener(EVENT.Track.IS_STOPPED.type, @_eTrackIsStopped)
    # document.addEventListener(EVENT.Cover.TRANSITION_ENDED.type, @_eTransitionEnded)

  _eTrackIsPlaying: (e)=>
    @setState(ENUM.JukeboxState.IS_PLAYING)

  _eTrackIsStopped: (e)=>
    HELPER.trigger(EVENT.Jukebox.WILL_PLAY)
    # setTimeout(=>
    if @playlist.length > 0
      @setState(ENUM.JukeboxState.TRACK_STOPPED)
    else
      @setState(ENUM.JukeboxState.IS_STOPPED)
    # , 50)

  # _eTransitionEnded: (e)=>
  #   if @playlist.length > 0 && @time > @delay
  #     @next() if @current == null

  _createTrack: (data)->
    # spaceship       = new SPACE.Spaceship(@equalizer.center, @equalizer.radius)
    track           = new SPACE.Track(data)
    # track.spaceship = spaceship
    track.pendingDuration = @_calcPending(@playlist.length-1)

    # @group.add(spaceship)

    @playlist.push(track)
    # @airport.push(spaceship)

    HELPER.trigger(EVENT.Jukebox.TRACK_ADDED, { track: track })
    SPACE.LOG('Sound added: ' + track.data.title)

  _calcPending: (position)->
    duration = 0
    for track, i in @playlist
      duration += track.data.duration
      break if i == position
    return duration

  predefinedPlaylist: ->
    list = [
      # 'https://soundcloud.com/chonch-2/courte-danse-macabre'
      # 'https://soundcloud.com/chonch-2/mouais'
      # 'https://soundcloud.com/chonch-2/cacaco-2'
      # 'https://soundcloud.com/chonch-2/duodenum'
      # 'https://soundcloud.com/chonch-2/little-green-monkey'
      # 'https://soundcloud.com/huhwhatandwhere/sets/supreme-laziness-the-celestics'
      # 'https://soundcloud.com/takugotbeats/sets/25-nights-for-nujabes'
      # 'https://soundcloud.com/tommisch/sets/tom-misch-soulection-white'
      # 'https://soundcloud.com/professorkliq/sets/trackmania-valley-ost'
      # 'https://soundcloud.com/professorkliq/sets/trackmania-stadium-ost'
    ]

    list = _Coffee.shuffle(list)
    for url, i in list
      @add(list[i])

    # setTimeout(=>
    #   @add('https://soundcloud.com/chonch-2/cacaco-2')
    # , 5000)

  setState: (state)->
    @state = state
    switch(state)
      when ENUM.JukeboxState.IS_PLAYING
        @current.whileplayingCallback = @_whileplaying
      else
        if @current
          @current.destruct()
        @current = null

        if @state == ENUM.JukeboxState.IS_STOPPED
          HELPER.trigger(EVENT.Jukebox.IS_STOPPED)

  setAirportState: (state)=>
    @airportState = state
    switch(state)
      when ENUM.AirportState.IDLE
        SPACE.LOG('Waiting for new spaceship')
      when ENUM.AirportState.SENDING
        spaceship = @airport.shift()
        spaceship.setState(SpaceshipState.LAUNCHED)
        setTimeout(@setAirportState, 60 * 1000)
      else
        @setAirportState(ENUM.AirportState.IDLE)

  update: (delta)->
    if @current == null
      @time += delta
    else
      @time = 0
    # for track, i in @playlist
    #   track.update(delta)
    # @current.update(delta) if @current

    if @playlist.length > 0 && @time > @delay# && @state == ENUM.JukeboxState.IS_STOPPED
      @next() if @current == null

  ##########################
  # Jukebox player methods #
  ##########################
  list: ->
    list = []
    for track in @playlist
      list.push({title: track.data.title, pendingDuration: track.pendingDuration})
    return list

  add: (soundOrPlaylist)->
    @_createTrack(soundOrPlaylist)
    # @SC.getSoundOrPlaylist soundOrPlaylist, (o, err)=>
    #   if err
    #     _H.trigger(TRACK_ON_ADD_ERROR, {object: o, error: err})
    #     return

    #   tracks = null
    #   if o.hasOwnProperty('tracks')
    #     tracks = _Coffee.shuffle(o.tracks)
    #   else
    #     tracks = []
    #     tracks.push(o)

    #   for data in tracks
    #     @_createTrack(data)

  next: (track)->
    @current.stop() if @current
    if @playlist.length > 0
      @current = @playlist.shift()
      # @current.removeSpaceship()
      @current.stream()
      return true
    return false

  _whileplaying: =>
    # console.log 'youpi', @current.sound
    @waveformData = @current.waveformData if @current# and @current.sound
