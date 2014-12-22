class SPACE.Jukebox

  ## Data objects
  SC:          null
  current:     null
  playlist:    null

  ## THREEJS Objects
  scene:       null
  equalizer:   null
  group:       null

  ## STATES
  state:       null
  @IS_PLAYING: 'IS_PLAYING'
  @IS_STOPPED: 'IS_STOPPED'

  constructor: (scene)->
    @scene = scene
    @group = new THREE.Group()
    @scene.add(@group)

    # Initialize the equalizer
    @equalizer = new SPACE.Equalizer(new THREE.Vector3(), {
      minLength: 0
      maxLength: 100
      radius: 300
      absolute: false
      lineForceDown: .5
      lineForceUp: 1
    })
    @group.add(@equalizer)

    @SC       = SPACE.SC
    @playlist = []
    @_events()

  _events: ->
    # document.addEventListener(JUKEBOX.TRACK_ADDED.type, @_eTrackAdded)
    document.addEventListener(TRACK.IS_PLAYING.type, @_eTrackIsPlaying)
    document.addEventListener(TRACK.IS_STOPPED.type, @_eTrackIsStopped)

  _eTrackIsPlaying: (e)=>
    @current.whileplayingCallback = @_whileplaying

  _eTrackIsStopped: (e)=>
    @equalizer.mute()
    @current.destruct()
    @current = null
    # @next()

  _createTrack: (data)->
    spaceship       = new SPACE.Spaceship(@equalizer.center, @equalizer.radius)
    track           = new SPACE.Track(data)
    track.spaceship = spaceship
    track.pendingDuration = @_calcPending(@playlist.length-1)

    @group.add(spaceship)
    @playlist.push(track)

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
      # 'https://soundcloud.com/chonch-2/mouais'
      # 'https://soundcloud.com/chonch-2/cacaco-2'
      # 'https://soundcloud.com/chonch-2/duodenum'
      # 'https://soundcloud.com/chonch-2/little-green-monkey'
      # 'https://soundcloud.com/huhwhatandwhere/sets/supreme-laziness-the-celestics'
      # 'https://soundcloud.com/takugotbeats/sets/25-nights-for-nujabes'
      # 'https://soundcloud.com/tommisch/sets/tom-misch-soulection-white'
      # 'https://soundcloud.com/professorkliq/sets/trackmania-valley-ost'
      'https://soundcloud.com/professorkliq/sets/trackmania-stadium-ost'
    ]

    list = _Coffee.shuffle(list)
    for url, i in list
      @add(list[i])

  setState: (state)->
    @state = state
    switch(state)
      when SPACE.Jukebox.IS_PLAYING
        SPACE.LOG('Next: ' + @current.data.title)
      when SPACE.Jukebox.IS_STOPPED
        @equalizer.mute()
      else
        SPACE.LOG('jukeboxisstopped')

  update: (delta)->
    for track, i in @playlist
      track.update(delta)

    if @playlist.length > 0
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
      @current.stream()
      return true
    return false
    # @current.spaceship.parent.removeChild(@current.spaceship)

  _whileplaying: =>
    if @current and @current.sound and @current.sound.paused
      @equalizer.mute()
    else if @current.waveformData.hasOwnProperty('mono')
      @equalizer.setValues(@current.waveformData.mono)
