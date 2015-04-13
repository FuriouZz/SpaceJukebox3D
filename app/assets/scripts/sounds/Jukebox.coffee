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

  constructor: (scene)->
    @scene = scene
    @group = new THREE.Group()
    @scene.add(@group)

    @waveformData =
      mono: null
      stereo: null
    @setAirportState(AirportState.IDLE)

    # Initialize the equalizer
    @eqlzr = new SPACE.Equalizer({
      minLength: 0
      maxLength: 200
      radius: 300
      color: 0xFFFFFF
      absolute: false
      lineForceDown: .5
      lineForceUp: 1
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
    })
    @group.add(@equalizer)

    @SC           = SPACE.SC
    @airport      = []
    @playlist     = []
    @searchEngine = new SPACE.SearchEngine(this)
    @_events()

  _events: ->
    document.addEventListener(TRACK.IS_PLAYING.type, @_eTrackIsPlaying)
    document.addEventListener(TRACK.IS_STOPPED.type, @_eTrackIsStopped)

  _eTrackIsPlaying: (e)=>
    @setState(JukeboxState.IS_PLAYING)

  _eTrackIsStopped: (e)=>
    @setState(JukeboxState.IS_STOPPED)

  _createTrack: (data)->
    spaceship       = new SPACE.Spaceship(@equalizer.center, @equalizer.radius)
    track           = new SPACE.Track(data)
    track.spaceship = spaceship
    track.pendingDuration = @_calcPending(@playlist.length-1)

    @group.add(spaceship)

    @playlist.push(track)
    @airport.push(spaceship)

    _H.trigger(JUKEBOX.TRACK_ADDED, { track: track })
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
      'https://soundcloud.com/chonch-2/mouais'
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
      when JukeboxState.IS_PLAYING
        @current.whileplayingCallback = @_whileplaying
      when JukeboxState.IS_STOPPED
        @current.destruct()
        @current = null

  setAirportState: (state)=>
    @airportState = state
    switch(state)
      when AirportState.IDLE
        SPACE.LOG('Waiting for new spaceship')
      when AirportState.SENDING
        spaceship = @airport.shift()
        spaceship.setState(SpaceshipState.LAUNCHED)
        setTimeout(@setAirportState, 60 * 1000)
      else
        @setAirportState(AirportState.IDLE)

  update: (delta)->
    for track, i in @playlist
      track.update(delta)

    if @playlist.length > 0
      @next() if @current == null

    if @airport.length > 0 and @airportState == AirportState.IDLE
      @setAirportState(AirportState.SENDING)

  ##########################
  # Jukebox player methods #
  ##########################
  list: ->
    list = []
    for track in @playlist
      list.push({title: track.data.title, pendingDuration: track.pendingDuration})
    return list

  add: (soundOrPlaylist)->
    @SC.getSoundOrPlaylist soundOrPlaylist, (o)=>
      tracks = null
      if o.hasOwnProperty('tracks')
        tracks = _Coffee.shuffle(o.tracks)
      else
        tracks = []
        tracks.push(o)

      for data in tracks
        @_createTrack(data)

  next: (track)->
    @current.stop() if @current
    if @playlist.length > 0
      @current = @playlist.shift()
      @current.removeSpaceship()
      @current.stream()
      return true
    return false

  search: (value)->
    @searchEngine.search(value)

  _whileplaying: =>
    @waveformData = @current.waveformData if @current and @current.sound

  input: ->
    userMedia = navigator.getUserMedia || navigator.webkitGetUserMedia || navigator.mozGetUserMedia || navigator.msGetUserMedia
    navigator.webkitGetUserMedia({ video: false, audio: true }, (localMediaStream)->


      vendorURL = window.URL || window.webkitURL;
      url = vendorURL.createObjectURL(localMediaStream)
      console.log url

      # setTimeout(->
      #   console.log 'create'
      #   sound = soundManager.createSound({
      #     id: 'plouc'
      #     url: url
      #     autoPlay: true
      #   })
      #   sound.play()
      # , 3000)

      audio = document.createElement('audio')
      audio.src = url
      audio.autoplay = true
      document.body.appendChild(audio)

    , (e)->
      console.log e
    )

