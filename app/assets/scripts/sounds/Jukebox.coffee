class SPACE.Jukebox

  current: null
  playlist: null

  state: null

  SC: null

  # # STATES
  @IS_PLAYING: 'IS_PLAYING'
  @IS_STOPPED: 'IS_STOPPED'

  constructor: ->
    @SC = new SPACE.SoundCloud(SPACE.SOUNDCLOUD.id, SPACE.SOUNDCLOUD.redirect_uri)

    @playlist = []
    @_events()

  _events: ->
    document.addEventListener(JUKEBOX.TRACK_ADDED.type, @_eTrackAdded)

  _eTrackAdded: (e)=>
    track = e.object.track
    track.pendingDuration = @_calcPending(@playlist.length-1)
    @playlist.push(e.object.track)

    # @playlist = _Coffee.shuffle(@playlist)
    SPACE.LOG('Sound added: ' + e.object.track.data.title)

  predefinedPlaylist: ->
    list = [
      'https://soundcloud.com/chonch-2/courte-danse-macabre'
      'https://soundcloud.com/chonch-2/mouais'
      'https://soundcloud.com/chonch-2/cacaco-2'
      'https://soundcloud.com/chonch-2/duodenum'
      'https://soundcloud.com/chonch-2/little-green-monkey'
      # 'https://soundcloud.com/huhwhatandwhere/sets/supreme-laziness-the-celestics'
      # 'https://soundcloud.com/takugotbeats/sets/25-nights-for-nujabes'
      # 'https://soundcloud.com/tommisch/sets/tom-misch-soulection-white'
      # 'https://soundcloud.com/professorkliq/sets/trackmania-valley-ost'
      # 'https://soundcloud.com/professorkliq/sets/trackmania-stadium-ost'
    ]

    list = _Coffee.shuffle(list)
    # for url, i in list
    #   @add(list[i])

    setTimeout(=>
      @add(list[0])
    , 1000)

    setTimeout(=>
      @add(list[1])
    , 2000)

    setTimeout(=>
      @add(list[2])
    , 3000)

    setTimeout(=>
      @add(list[3])
    , 4000)

    setTimeout(=>
      @add(list[4])
    , 5000)

  setState: (state)->
    @state = state
    switch(state)
      when SPACE.Jukebox.IS_PLAYING
        SPACE.LOG('Next: ' + @current.data.title)
      else
        SPACE.LOG('jukeboxisstopped')

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
        track = new SPACE.Track(data)
        _H.trigger(JUKEBOX.TRACK_ON_ADD, { track: track })

  _calcPending: (position)->
    duration = 0
    for track, i in @playlist
      duration += track.data.duration
      break if i == position
    return duration

  update: (delta)->
    for track, i in @playlist
      track.update(delta)

    if @playlist.length > 0
      @next() if @current == null

  next: (track)->
    @_onfinish() if @current
    @current = @playlist.shift()
    # @current.spaceship.parent.removeChild(@current.spaceship)

    @SC.streamSound(@current.data, @_starting, {
      onplay       : @_onplay
      onfinish     : @_onfinish
      onstop       : @_onstop
      whileplaying : @whileplaying
    })

  _starting: (sound)=>
    @current.sound = sound

  _onplay: =>
    _H.trigger(JUKEBOX.IS_PLAYING)
    @setState(SPACE.Jukebox.IS_PLAYING)

  _onfinish: =>
    @current.sound.stop()
    @current.sound.destruct()
    @current = null
    _H.trigger(JUKEBOX.IS_STOPPED)
    @setState(SPACE.Jukebox.IS_STOPPED)
